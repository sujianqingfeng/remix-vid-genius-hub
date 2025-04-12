import path from 'node:path'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { Player } from '@remotion/player'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import invariant from 'tiny-invariant'
import BackPrevious from '~/components/BackPrevious'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Button } from '~/components/ui/button'
import { db, schema } from '~/lib/drizzle'
import { Words } from '~/remotion'
import type { WordSentence } from '~/types'
import { copyFiles, ensurePublicDir, fileExist, getPublicAssetPath, getPublicFilePath } from '~/utils/file'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const word = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	invariant(word, 'Word not found')

	// Process sentences to check for audio files and copy them to public directory if they exist
	const processedSentences = await Promise.all(
		word.sentences.map(async (sentence: any) => {
			const sentenceWithPublicPaths = { ...sentence }
			const copyTasks: [string, string][] = []

			// Check and copy word pronunciation audio file if it exists
			if (sentence.wordPronunciationPath && (await fileExist(sentence.wordPronunciationPath))) {
				const fileName = `word_${sentence.word}.mp3`
				const publicPath = getPublicAssetPath(id, fileName)
				const publicFilePath = await ensurePublicDir(publicPath)

				copyTasks.push([sentence.wordPronunciationPath, publicFilePath])
				sentenceWithPublicPaths.wordPronunciationPublicPath = publicPath
			}

			// Check and copy sentence pronunciation audio file if it exists
			if (sentence.sentencePronunciationPath && (await fileExist(sentence.sentencePronunciationPath))) {
				const fileName = `sentence_${sentence.word}.mp3`
				const publicPath = getPublicAssetPath(id, fileName)
				const publicFilePath = await ensurePublicDir(publicPath)

				copyTasks.push([sentence.sentencePronunciationPath, publicFilePath])
				sentenceWithPublicPaths.sentencePronunciationPublicPath = publicPath
			}

			// Execute all copy tasks
			if (copyTasks.length > 0) {
				await copyFiles(copyTasks)
			}

			return sentenceWithPublicPaths
		}),
	)

	// Update word with processed sentences
	const wordWithPublicPaths = {
		...word,
		sentences: processedSentences,
	}

	// Define type for processed sentence with duration and form
	interface ProcessedSentence extends Omit<WordSentence, 'wordPronunciationPath' | 'sentencePronunciationPath'> {
		form: number
		durationInFrames: number
		wordPronunciationPublicPath?: string
		sentencePronunciationPublicPath?: string
		wordPronunciationPath?: string
		sentencePronunciationPath?: string
		wordDuration?: number
		sentenceDuration?: number
		word: string
		wordZh: string
		sentence: string
		sentenceZh: string
	}

	// Calculate word sentences remotion data
	const wordSentences: ProcessedSentence[] = []

	wordWithPublicPaths.sentences.forEach((sentence, index) => {
		// Get actual durations from sentence data or use defaults
		const wordAudioDuration = sentence.wordDuration || 2 // Default 2 seconds if no duration
		const sentenceAudioDuration = sentence.sentenceDuration || 3 // Default 3 seconds if no duration

		// Calculate display times (minimum 1.5 seconds or half of audio duration)
		const wordDisplayDuration = Math.max(1.5, wordAudioDuration / 2)
		const sentenceDisplayDuration = Math.max(1.5, sentenceAudioDuration / 2)

		// Calculate total segment duration in seconds
		const segmentDurationInSeconds = wordDisplayDuration + wordAudioDuration + sentenceDisplayDuration + sentenceAudioDuration

		// Calculate form (starting frame) based on previous segments
		const form = index > 0 ? wordSentences[index - 1].form + wordSentences[index - 1].durationInFrames : 0

		// Convert segment duration to frames
		const durationInFrames = Math.ceil(segmentDurationInSeconds * word.fps)

		wordSentences.push({
			...sentence,
			form,
			durationInFrames,
		})
	})

	// Calculate total duration by summing all segment durations
	const totalDurationInFrames = wordSentences.reduce((total: number, sentence: ProcessedSentence) => total + sentence.durationInFrames, 0)

	return json({
		word: wordWithPublicPaths,
		wordSentences,
		totalDurationInFrames,
		compositionWidth: 1920,
		compositionHeight: 1080,
	})
}

// Create a component to render each sentence with its details
function SentenceItem({
	sentence,
	index,
	wordId,
}: {
	sentence: any
	index: number
	wordId: string
}) {
	const hasWordAudio = !!sentence.wordPronunciationPath
	const hasSentenceAudio = !!sentence.sentencePronunciationPath
	const isComplete = hasWordAudio && hasSentenceAudio
	const deleteFetcher = useFetcher()
	const isDeleting = deleteFetcher.state !== 'idle'

	return (
		<div className="border rounded-lg p-4 mb-4 bg-white">
			<div className="flex justify-between items-start mb-2">
				<div>
					<h3 className="font-semibold text-lg">{sentence.word}</h3>
					<p className="text-sm text-gray-500">{sentence.wordZh}</p>
					{sentence.wordDuration && <p className="text-xs text-gray-400 mt-1">Word audio: {sentence.wordDuration.toFixed(2)}s</p>}
				</div>
				<deleteFetcher.Form method="post" action={`/app/words/${wordId}/delete-sentence`}>
					<input type="hidden" name="index" value={index} />
					<Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" disabled={isDeleting} type="submit">
						<Trash className="h-4 w-4" />
					</Button>
				</deleteFetcher.Form>
			</div>
			<div className="mt-2">
				<p className="text-gray-800">{sentence.sentence}</p>
				<p className="text-sm text-gray-500 mt-1">{sentence.sentenceZh}</p>
				{sentence.sentenceDuration && <p className="text-xs text-gray-400 mt-1">Sentence audio: {sentence.sentenceDuration.toFixed(2)}s</p>}
			</div>
			{isComplete && (
				<div className="mt-3 space-y-2">
					<div className="text-xs text-green-600">Audio generated ✓</div>

					{sentence.wordPronunciationPublicPath && (
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-500">Word audio:</span>
							<audio controls className="h-8 w-full max-w-xs" src={`/${sentence.wordPronunciationPublicPath}`}>
								<track kind="captions" />
								Your browser does not support the audio element.
							</audio>
						</div>
					)}

					{sentence.sentencePronunciationPublicPath && (
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-500">Sentence audio:</span>
							<audio controls className="h-8 w-full max-w-xs" src={`/${sentence.sentencePronunciationPublicPath}`}>
								<track kind="captions" />
								Your browser does not support the audio element.
							</audio>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default function WordDetailPage() {
	const { word, wordSentences, totalDurationInFrames, compositionWidth, compositionHeight } = useLoaderData<typeof loader>()
	const audioFetcher = useFetcher()
	const renderFetcher = useFetcher()

	// Check if all sentences have audio generated
	const allAudioGenerated = word.sentences.every((sentence: any) => sentence.wordPronunciationPath && sentence.sentencePronunciationPath)

	const isGenerating = audioFetcher.state !== 'idle'
	const isRendering = renderFetcher.state !== 'idle'

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="mb-6">
					<BackPrevious />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left column - Information and Remotion Player */}
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h1 className="text-2xl font-bold mb-4">Word Details</h1>
							<div className="flex justify-between mb-2">
								<span className="text-gray-500">ID:</span>
								<span className="font-mono">{word.id}</span>
							</div>
							<div className="flex justify-between mb-2">
								<span className="text-gray-500">Number of Sentences:</span>
								<span>{word.sentences.length}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-500">FPS:</span>
								<span>{word.fps}</span>
							</div>
							<div className="mt-4">
								<renderFetcher.Form action={`/app/words/${word.id}/render`} method="post">
									<LoadingButtonWithState
										variant="default"
										size="sm"
										state={isRendering ? 'loading' : 'idle'}
										idleText="Render Video"
										loadingText="Rendering Video..."
										disabled={!allAudioGenerated || isRendering || isGenerating}
										type="submit"
										className="w-full"
									/>
								</renderFetcher.Form>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-xl font-bold mb-4">Remotion Player</h2>
							<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
								<Player
									component={Words}
									inputProps={{
										wordSentences,
										id: word.id,
									}}
									durationInFrames={totalDurationInFrames}
									compositionWidth={compositionWidth}
									compositionHeight={compositionHeight}
									fps={word.fps}
									style={{
										width: '100%',
										height: '100%',
									}}
									controls
								/>
							</div>
						</div>
					</div>

					{/* Right column - Sentences list */}
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold">Sentences</h2>

							<audioFetcher.Form action={`/app/words/${word.id}/generate-audio`} method="post">
								<LoadingButtonWithState
									variant="default"
									size="sm"
									state={isGenerating ? 'loading' : 'idle'}
									idleText="Generate All Audio"
									loadingText="Generating Audio..."
									disabled={allAudioGenerated || isGenerating}
									type="submit"
								/>
							</audioFetcher.Form>
						</div>

						<div className="space-y-4">
							{word.sentences.map((sentence: any, index: number) => (
								<SentenceItem key={`${sentence.word}-${index}`} sentence={sentence} index={index} wordId={word.id} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
