import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { Player } from '@remotion/player'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import BackPrevious from '~/components/BackPrevious'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import Sentences from '~/components/business/fill-in-blank/Sentences'
import { Button } from '~/components/ui/button'
import { db, schema } from '~/lib/drizzle'
import { FillInBlank } from '~/remotion'
import { safeCopyFileToPublic } from '~/utils/file'
import { buildFillInBlankRenderData } from '~/utils/fill-in-blank'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const fillInBlank = await db.query.fillInBlanks.findFirst({
		where: eq(schema.fillInBlanks.id, id),
	})

	invariant(fillInBlank, 'fillInBlank not found')

	const { remotionFillInBlankSentences, totalDurationInFrames, compositionWidth, compositionHeight, playWidth, playHeight } = buildFillInBlankRenderData({
		sentences: fillInBlank.sentences,
		fps: fillInBlank.fps,
	})

	const coverFilePaths = fillInBlank.sentences.map((s) => s.coverFilePath).filter(Boolean)
	const audioFilePaths = fillInBlank.sentences.map((s) => s.audioFilePath).filter(Boolean)

	await Promise.all(
		coverFilePaths.map(async (coverFilePath) => {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			await safeCopyFileToPublic(coverFilePath!)
		}),
	)

	await Promise.all(
		audioFilePaths.map(async (audioFilePath) => {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			await safeCopyFileToPublic(audioFilePath!)
		}),
	)

	return {
		fillInBlank,
		remotionFillInBlankSentences,
		totalDurationInFrames,
		compositionWidth,
		compositionHeight,
		playWidth,
		playHeight,
	}
}

export default function AppFillInBlankPage() {
	const { fillInBlank, remotionFillInBlankSentences, totalDurationInFrames, compositionWidth, compositionHeight, playWidth, playHeight } = useLoaderData<typeof loader>()

	const generateAudioFetcher = useFetcher()
	const renderFetcher = useFetcher()

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-[1920px] mx-auto px-6 py-8">
				<div className="mb-6">
					<BackPrevious />
				</div>

				<div className="grid grid-cols-[1fr,400px] gap-8">
					{/* Main Content - Video Player */}
					<div className="space-y-6">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
							<div className="aspect-video relative overflow-hidden rounded-xl">
								<Player
									component={FillInBlank}
									inputProps={{
										sentences: remotionFillInBlankSentences,
									}}
									durationInFrames={totalDurationInFrames}
									compositionWidth={compositionWidth}
									compositionHeight={compositionHeight}
									fps={fillInBlank.fps}
									style={{
										width: '100%',
										height: '100%',
									}}
									controls
									acknowledgeRemotionLicense
								/>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-4">
							<renderFetcher.Form method="post" action="render">
								<LoadingButtonWithState state={renderFetcher.state} idleText="Render Video" className="bg-indigo-600 hover:bg-indigo-700 text-white" />
							</renderFetcher.Form>

							{fillInBlank.outputFilePath && (
								<Link to="local-download" target="_blank" rel="noopener noreferrer">
									<Button className="bg-green-600 hover:bg-green-700 text-white">Download Video</Button>
								</Link>
							)}
						</div>
					</div>

					{/* Sidebar - Sentences */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-semibold text-gray-900">Sentences</h2>
							<generateAudioFetcher.Form method="post" action="generate-audio">
								<LoadingButtonWithState state={generateAudioFetcher.state} idleText="Generate Audio" className="bg-blue-600 hover:bg-blue-700 text-white" />
							</generateAudioFetcher.Form>
						</div>
						<div className="overflow-y-auto max-h-[calc(100vh-200px)]">
							<Sentences sentences={remotionFillInBlankSentences} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
