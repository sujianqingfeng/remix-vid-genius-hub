import type { LoaderFunctionArgs } from '@remix-run/node'
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
import { copyFiles, ensurePublicDir, fileExist, getPublicAssetPath } from '~/utils/file'
import { DEFAULT_VIDEO_CONFIG, processWordSentences } from '~/utils/words-video'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const word = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	invariant(word, 'Word not found')

	// Prepare a word with public URL information
	const wordWithPublicUrls = { ...word }

	// Process sentences to check for audio files and copy them to public directory if they exist
	const processedSentences = await Promise.all(
		wordWithPublicUrls.sentences.map(async (sentence: any) => {
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
		...wordWithPublicUrls,
		sentences: processedSentences,
	}

	// Process sentences for Remotion
	const { wordSentences, totalDurationInFrames } = processWordSentences(wordWithPublicPaths.sentences, word.fps)

	return {
		word: wordWithPublicPaths,
		wordSentences,
		totalDurationInFrames,
		compositionWidth: DEFAULT_VIDEO_CONFIG.width,
		compositionHeight: DEFAULT_VIDEO_CONFIG.height,
	}
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
									acknowledgeRemotionLicense
									style={{
										width: '100%',
										height: '100%',
									}}
									controls
								/>
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
