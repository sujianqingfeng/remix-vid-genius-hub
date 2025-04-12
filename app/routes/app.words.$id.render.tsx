import fs from 'node:fs/promises'
import path from 'node:path'
import { type ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { webpackOverride } from '~/remotion/webpack-override'
import type { WordSentence } from '~/types'
import { createOperationDir, ensurePublicDir, getPublicAssetPath } from '~/utils/file'
import { bundleOnProgress, throttleRenderOnProgress } from '~/utils/remotion'

interface ProcessedSentence extends Omit<WordSentence, 'wordPronunciationPath' | 'sentencePronunciationPath'> {
	form: number
	durationInFrames: number
	wordPronunciationPath?: string
	sentencePronunciationPath?: string
	wordDuration?: number
	sentenceDuration?: number
	word: string
	wordZh: string
	sentence: string
	sentenceZh: string
}

export const action = async ({ params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	try {
		// Fetch word data
		const word = await db.query.words.findFirst({
			where: eq(schema.words.id, id),
		})

		invariant(word, 'Word not found')

		// Process sentences to ensure all audio files are accessible
		const wordSentences: ProcessedSentence[] = []

		word.sentences.forEach((sentence: any, index: number) => {
			// Get actual durations from sentence data or use defaults
			const wordAudioDuration = sentence.wordDuration || 2
			const sentenceAudioDuration = sentence.sentenceDuration || 3

			// Calculate display times
			const wordDisplayDuration = Math.max(1.5, wordAudioDuration / 2)
			const sentenceDisplayDuration = Math.max(1.5, sentenceAudioDuration / 2)

			// Calculate total segment duration in seconds
			const segmentDurationInSeconds = wordDisplayDuration + wordAudioDuration + sentenceDisplayDuration + sentenceAudioDuration

			// Calculate form (starting frame) based on previous segments
			const form = index > 0 ? wordSentences[index - 1].form + wordSentences[index - 1].durationInFrames : 0

			// Convert segment duration to frames
			const durationInFrames = Math.ceil(segmentDurationInSeconds * word.fps)

			// Use public paths for audio files
			wordSentences.push({
				...sentence,
				form,
				durationInFrames,
				// Replace paths with public paths
				wordPronunciationPath: `/${getPublicAssetPath(id, `word_${sentence.word}.mp3`)}`,
				sentencePronunciationPath: `/${getPublicAssetPath(id, `sentence_${sentence.word}.mp3`)}`,
			})
		})

		// Calculate total duration
		const totalDurationInFrames = wordSentences.reduce((total: number, sentence: ProcessedSentence) => total + sentence.durationInFrames, 0)

		// Video configuration
		const videoConfig = {
			width: 1920,
			height: 1080,
		}

		// Bundle the remotion components
		const entryPoint = path.join(process.cwd(), 'app', 'remotion', 'words', 'index.ts')
		const bundled = await bundle({
			entryPoint,
			webpackOverride,
			onProgress: bundleOnProgress,
		})

		// Prepare input props
		const inputProps = {
			wordSentences,
			id,
		}

		// Select the composition
		const composition = await selectComposition({
			serveUrl: bundled,
			id: 'Words',
			inputProps,
		})

		// Set composition properties
		composition.durationInFrames = totalDurationInFrames
		composition.fps = word.fps
		composition.width = videoConfig.width
		composition.height = videoConfig.height

		// Ensure output directory exists
		const dir = await createOperationDir(id)
		const outputPath = path.join(dir, `${id}.mp4`)

		// Render the video
		await renderMedia({
			codec: 'h264',
			composition,
			serveUrl: bundled,
			outputLocation: outputPath,
			inputProps,
			onProgress: throttleRenderOnProgress,
		})

		// Update word with output file path information
		await db
			.update(schema.words)
			.set({
				outputFilePath: outputPath,
			})
			.where(eq(schema.words.id, id))

		return redirect(`/app/words/${id}`)
	} catch (error) {
		console.error('Error rendering video:', error)
		return json({ error: 'Failed to render video' }, { status: 500 })
	}
}
