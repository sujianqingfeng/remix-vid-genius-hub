import path from 'node:path'
import { type ActionFunctionArgs, data, redirect } from '@remix-run/node'
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { webpackOverride } from '~/remotion/webpack-override'
import { createOperationDir, ensurePublicDir, getPublicAssetPath } from '~/utils/file'
import { bundleOnProgress, throttleRenderOnProgress } from '~/utils/remotion'
import { DEFAULT_VIDEO_CONFIG, processWordSentences } from '~/utils/words-video'

export const action = async ({ params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	try {
		// Fetch word data
		const word = await db.query.words.findFirst({
			where: eq(schema.words.id, id),
		})

		invariant(word, 'Word not found')

		// Process sentences and prepare public paths for audio files
		const sentences = word.sentences.map((sentence) => {
			// Prepare paths that will be used by Remotion during rendering
			const wordAudioPublicPath = getPublicAssetPath(id, `word_${sentence.word}.mp3`)
			const sentenceAudioPublicPath = getPublicAssetPath(id, `sentence_${sentence.word}.mp3`)

			return {
				...sentence,
				wordPronunciationPublicPath: wordAudioPublicPath,
				sentencePronunciationPublicPath: sentenceAudioPublicPath,
			}
		})

		// Process sentences for Remotion using the shared utility
		const { wordSentences, totalDurationInFrames } = processWordSentences(sentences, word.fps)

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
		composition.width = DEFAULT_VIDEO_CONFIG.width
		composition.height = DEFAULT_VIDEO_CONFIG.height

		// Ensure output directory exists
		const dir = await createOperationDir(id)
		const outputPath = path.join(dir, `${id}-output.mp4`)

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
		return data({ error: 'Failed to render video' }, { status: 500 })
	}
}
