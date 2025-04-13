import type { LoaderFunctionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { Player } from '@remotion/player'
import { eq } from 'drizzle-orm'
import { Camera, Edit, FileVideo, Headphones, Image, Trash, Type } from 'lucide-react'
import { useEffect, useState } from 'react'
import invariant from 'tiny-invariant'
import BackPrevious from '~/components/BackPrevious'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
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

			// Check and copy image file if it exists
			if (sentence.imagePath && (await fileExist(sentence.imagePath))) {
				const fileName = `image_${sentence.word}.jpg`
				const publicPath = getPublicAssetPath(id, fileName)
				const publicFilePath = await ensurePublicDir(publicPath)

				copyTasks.push([sentence.imagePath, publicFilePath])
				sentenceWithPublicPaths.imagePublicPath = publicPath
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

	// Add 2 seconds (in frames) for the title cover
	const titleCoverDurationInFrames = word.fps * 2
	const totalDurationWithTitleCover = totalDurationInFrames + titleCoverDurationInFrames

	return {
		word: wordWithPublicPaths,
		wordSentences,
		totalDurationInFrames: totalDurationWithTitleCover,
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
	const generateImageFetcher = useFetcher()
	const isDeleting = deleteFetcher.state !== 'idle'
	const isGeneratingImage = generateImageFetcher.state !== 'idle'

	return (
		<Card className="overflow-hidden transition-all hover:shadow-md">
			<CardContent className="p-5">
				<div className="flex justify-between items-start gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-lg">{sentence.word}</h3>
							{isComplete && (
								<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
									Complete
								</Badge>
							)}
						</div>
						<p className="text-sm text-gray-500">{sentence.wordZh}</p>
						{sentence.wordDuration && <p className="text-xs text-gray-400 mt-1">Word audio: {sentence.wordDuration.toFixed(2)}s</p>}
					</div>
					<div className="flex gap-2">
						<generateImageFetcher.Form method="post" action={`/app/words/${wordId}/generate-image`}>
							<input type="hidden" name="index" value={index} />
							<input type="hidden" name="word" value={sentence.word} />
							<LoadingButtonWithState
								variant="outline"
								size="icon"
								state={isGeneratingImage ? 'loading' : 'idle'}
								idleText=""
								loadingText=""
								className="h-8 w-8 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
								icon={<Image className="h-4 w-4" />}
								disabled={isGeneratingImage}
								type="submit"
								title="Generate Image"
							/>
						</generateImageFetcher.Form>
						<deleteFetcher.Form method="post" action={`/app/words/${wordId}/delete-sentence`}>
							<input type="hidden" name="index" value={index} />
							<Button variant="outline" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8" disabled={isDeleting} type="submit">
								<Trash className="h-4 w-4" />
							</Button>
						</deleteFetcher.Form>
					</div>
				</div>

				<Separator className="my-3" />

				<div>
					<p className="text-gray-800">{sentence.sentence}</p>
					<p className="text-sm text-gray-500 mt-1">{sentence.sentenceZh}</p>
					{sentence.sentenceDuration && <p className="text-xs text-gray-400 mt-1">Sentence audio: {sentence.sentenceDuration.toFixed(2)}s</p>}
				</div>

				{/* Display generated image if available */}
				{sentence.imagePath && (
					<div className="mt-4">
						<img
							src={sentence.imagePublicPath ? `/${sentence.imagePublicPath}` : sentence.imagePath}
							alt={sentence.word}
							className="w-full h-auto rounded-md border border-gray-200"
						/>
					</div>
				)}

				{isComplete && (
					<div className="mt-4 space-y-3 bg-gray-50 p-3 rounded-md">
						{sentence.wordPronunciationPublicPath && (
							<div className="flex items-center gap-2">
								<span className="text-xs font-medium text-gray-600 min-w-16">Word:</span>
								<audio controls className="h-8 w-full" src={`/${sentence.wordPronunciationPublicPath}`}>
									<track kind="captions" />
									Your browser does not support the audio element.
								</audio>
							</div>
						)}

						{sentence.sentencePronunciationPublicPath && (
							<div className="flex items-center gap-2">
								<span className="text-xs font-medium text-gray-600 min-w-16">Sentence:</span>
								<audio controls className="h-8 w-full" src={`/${sentence.sentencePronunciationPublicPath}`}>
									<track kind="captions" />
									Your browser does not support the audio element.
								</audio>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default function WordDetailPage() {
	const { word, wordSentences, totalDurationInFrames, compositionWidth, compositionHeight } = useLoaderData<typeof loader>()
	const audioFetcher = useFetcher()
	const renderFetcher = useFetcher()
	const titleFetcher = useFetcher<{ success?: boolean; title?: string }>()
	const updateTitleFetcher = useFetcher<{ success?: boolean; title?: string }>()
	const screenshotFetcher = useFetcher<{ success: boolean; message?: string }>()

	// State for timestamp input
	const [timestamp, setTimestamp] = useState('1')

	// State for title editing
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [titleValue, setTitleValue] = useState(word.title || '')

	// Check if all sentences have audio generated
	const allAudioGenerated = word.sentences.every((sentence: any) => sentence.wordPronunciationPath && sentence.sentencePronunciationPath)

	const isGenerating = audioFetcher.state !== 'idle'
	const isRendering = renderFetcher.state !== 'idle'
	const isGeneratingTitle = titleFetcher.state !== 'idle'
	const isUpdatingTitle = updateTitleFetcher.state !== 'idle'
	const isScreenshotting = screenshotFetcher.state !== 'idle'

	// Handle title update submission
	const handleTitleUpdate = () => {
		updateTitleFetcher.submit({ title: titleValue }, { method: 'post', action: `/app/words/${word.id}/update-title` })
		setIsEditingTitle(false)
	}

	// Update local title when fetcher data returns
	useEffect(() => {
		if (updateTitleFetcher.data?.success && updateTitleFetcher.data.title) {
			setTitleValue(updateTitleFetcher.data.title)
		}
	}, [updateTitleFetcher.data])

	// Update local title when AI generates title
	useEffect(() => {
		if (titleFetcher.data?.success && titleFetcher.data.title) {
			setTitleValue(titleFetcher.data.title)
		}
	}, [titleFetcher.data])

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="mb-6">
					<BackPrevious />
				</div>

				<h1 className="text-3xl font-bold mb-6 text-gray-800">{titleValue || 'Word Collection'}</h1>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Left column - Information and Remotion Player */}
					<div className="lg:col-span-5 space-y-6">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle>Details</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-2 text-sm">
									<span className="text-gray-500">ID:</span>
									<span className="font-mono text-gray-700">{word.id}</span>

									<span className="text-gray-500">Sentences:</span>
									<span className="text-gray-700">{word.sentences.length}</span>

									<span className="text-gray-500">FPS:</span>
									<span className="text-gray-700">{word.fps}</span>
								</div>

								<Separator />

								{/* Title section with edit functionality */}
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-gray-700 font-medium">Title</span>
										{!isEditingTitle && (
											<Button variant="ghost" size="sm" onClick={() => setIsEditingTitle(true)} className="h-8 px-2" aria-label="Edit title">
												<Edit size={16} className="mr-1" />
												<span>Edit</span>
											</Button>
										)}
									</div>

									{isEditingTitle ? (
										<div className="flex flex-col gap-2">
											<input
												type="text"
												value={titleValue}
												onChange={(e) => setTitleValue(e.target.value)}
												className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
												placeholder="Enter a title..."
											/>
											<div className="flex justify-end gap-2">
												<Button variant="outline" size="sm" onClick={() => setIsEditingTitle(false)} disabled={isUpdatingTitle}>
													Cancel
												</Button>
												<Button variant="default" size="sm" onClick={handleTitleUpdate} disabled={isUpdatingTitle}>
													{isUpdatingTitle ? 'Saving...' : 'Save'}
												</Button>
											</div>
										</div>
									) : (
										<div className="flex items-center">
											<span className="font-medium text-xl text-indigo-600">{titleValue || 'No title'}</span>
										</div>
									)}

									<titleFetcher.Form action={`/app/words/${word.id}/generate-title`} method="post">
										<LoadingButtonWithState
											variant="outline"
											size="sm"
											state={isGeneratingTitle ? 'loading' : 'idle'}
											idleText="Generate Fun Title"
											loadingText="Generating Title..."
											disabled={isGeneratingTitle || word.sentences.length === 0 || isEditingTitle}
											type="submit"
											className="w-full mt-2"
											icon={<Type className="mr-2 h-4 w-4" />}
										/>
									</titleFetcher.Form>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<CardTitle>Preview</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-200">
									<Player
										component={Words}
										inputProps={{
											wordSentences,
											id: word.id,
											title: titleValue,
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

								<div className="space-y-2">
									<renderFetcher.Form action={`/app/words/${word.id}/render`} method="post">
										<LoadingButtonWithState
											variant="default"
											size="lg"
											state={isRendering ? 'loading' : 'idle'}
											idleText="Render Video"
											loadingText="Rendering Video..."
											disabled={!allAudioGenerated || isRendering || isGenerating}
											type="submit"
											className="w-full"
											icon={<FileVideo className="mr-2 h-5 w-5" />}
										/>
									</renderFetcher.Form>

									{word.outputFilePath && (
										<screenshotFetcher.Form action={`/app/words/${word.id}/screenshot`} method="post">
											<div className="mb-2">
												<div className="flex items-center gap-2">
													<label htmlFor="timestamp" className="text-sm text-gray-600">
														Screenshot Time (seconds):
													</label>
													<input
														id="timestamp"
														name="timestamp"
														type="number"
														min="0"
														step="0.1"
														value={timestamp}
														onChange={(e) => setTimestamp(e.target.value)}
														className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
													/>
												</div>
											</div>
											<LoadingButtonWithState
												variant="outline"
												size="lg"
												state={isScreenshotting ? 'loading' : 'idle'}
												idleText="Take Screenshot"
												loadingText="Taking Screenshot..."
												disabled={isScreenshotting}
												type="submit"
												className="w-full"
												icon={<Camera className="mr-2 h-5 w-5" />}
											/>
										</screenshotFetcher.Form>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right column - Sentences list */}
					<div className="lg:col-span-7">
						<Card className="h-full">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle>Sentences</CardTitle>

								<audioFetcher.Form action={`/app/words/${word.id}/generate-audio`} method="post">
									<LoadingButtonWithState
										variant="default"
										size="sm"
										state={isGenerating ? 'loading' : 'idle'}
										idleText="Generate All Audio"
										loadingText="Generating Audio..."
										disabled={allAudioGenerated || isGenerating}
										type="submit"
										icon={<Headphones className="mr-2 h-4 w-4" />}
									/>
								</audioFetcher.Form>
							</CardHeader>

							<CardContent>
								<div className="overflow-y-auto pr-2 space-y-5 max-h-[calc(100vh-16rem)]">
									{word.sentences.length === 0 ? (
										<div className="text-center py-12 text-gray-500">No sentences added yet</div>
									) : (
										word.sentences.map((sentence: any, index: number) => <SentenceItem key={`${sentence.word}-${index}`} sentence={sentence} index={index} wordId={word.id} />)
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
