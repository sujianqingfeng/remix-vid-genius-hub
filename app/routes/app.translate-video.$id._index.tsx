import path from 'node:path'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useFetcher, useLoaderData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { Captions, Copy, Download, FileAudio, FileVideo, Globe2, Languages, MessageSquare } from 'lucide-react'
import invariant from 'tiny-invariant'
import AiModelSelect from '~/components/AiModelSelect'
import BackPrevious from '~/components/BackPrevious'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import Transcripts from '~/components/business/translate-video/Transcripts'
import VideoPlayer from '~/components/business/translate-video/VideoPlayer'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { toast } from '~/hooks/use-toast'
import { db, schema } from '~/lib/drizzle'
import { safeCopyFileToPublic } from '~/utils/file'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const translateVideo = await db.query.translateVideos.findFirst({
		where: eq(schema.translateVideos.id, id),
	})
	invariant(translateVideo, 'translateVideo not found')

	const { source, downloadId, uploadFilePath } = translateVideo

	let playFile = ''
	let link = ''
	if (source === 'download' && downloadId) {
		const download = await db.query.downloads.findFirst({
			where: eq(schema.downloads.id, downloadId),
		})
		invariant(download, 'download not found')
		const filePath = download.filePath || ''
		link = download.link || ''

		if (filePath) {
			await safeCopyFileToPublic(filePath)
			playFile = path.basename(filePath)
		}
	}

	if (source === 'upload' && uploadFilePath) {
		await safeCopyFileToPublic(uploadFilePath)
		playFile = path.basename(uploadFilePath)
	}

	return {
		translateVideo,
		playFile,
		downloadId,
		link,
	}
}

export default function TranslateVideoPage() {
	const { translateVideo, playFile, downloadId, link } = useLoaderData<typeof loader>()

	const translateFetcher = useFetcher()
	const downloadVideoFetcher = useFetcher()
	const renderFetcher = useFetcher()
	const remoteRenderFetcher = useFetcher()
	const downloadAudioFetcher = useFetcher()

	const onCopy = async (text?: string | null) => {
		if (!text) {
			return
		}
		await navigator.clipboard.writeText(text)
		toast({
			title: 'copy successful!',
		})
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<BackPrevious />
			<div className="flex flex-col lg:flex-row gap-8 mt-6">
				<div className="flex-1 lg:flex-[2] space-y-8">
					<Card className="group transition-all duration-300 hover:shadow-lg">
						<CardContent className="p-0 overflow-hidden rounded-lg">
							<VideoPlayer playFile={playFile} transcripts={translateVideo.transcripts ?? []} />
						</CardContent>
					</Card>

					<Card className="group transition-all duration-300 hover:shadow-lg">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Globe2 className="w-5 h-5 text-muted-foreground" />
								Video Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-8">
							<div className="grid gap-6">
								<div className="p-4 bg-muted/50 rounded-lg space-y-1.5 transition-colors duration-200 hover:bg-muted/70">
									<div className="text-sm text-muted-foreground">Original Title</div>
									<div className="text-lg font-medium break-all">{translateVideo.title}</div>
								</div>

								<div className="p-4 bg-muted/50 rounded-lg space-y-1.5 transition-colors duration-200 hover:bg-muted/70">
									<div className="text-sm text-muted-foreground">Original Link</div>
									<div className="flex items-center gap-2 group/link">
										<Globe2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
										<div className="text-lg font-medium break-all flex-1">{link}</div>
										<Button variant="ghost" size="icon" className="opacity-0 group-hover/link:opacity-100 transition-opacity" onClick={() => onCopy(link)}>
											<Copy size={16} className="text-muted-foreground hover:text-foreground transition-colors" />
										</Button>
									</div>
								</div>

								<div className="p-4 bg-muted/50 rounded-lg space-y-1.5 transition-colors duration-200 hover:bg-muted/70">
									<div className="text-sm text-muted-foreground">Translated Title</div>
									<div className="flex items-center gap-2 group/title">
										<Languages className="w-4 h-4 text-muted-foreground flex-shrink-0" />
										<div className="text-lg font-medium break-all flex-1">{translateVideo.titleZh}</div>
										<Button variant="ghost" size="icon" className="opacity-0 group-hover/title:opacity-100 transition-opacity" onClick={() => onCopy(translateVideo.titleZh)}>
											<Copy size={16} className="text-muted-foreground hover:text-foreground transition-colors" />
										</Button>
									</div>
									<div className="mt-3 flex flex-wrap gap-2 items-center">
										<translateFetcher.Form method="post" action="translate" className="flex items-center gap-2">
											<AiModelSelect name="model" defaultValue="r1" />
											<LoadingButtonWithState
												state={translateFetcher.state}
												idleText="Translate"
												className="gap-2 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary"
												variant="outline"
												icon={<Languages size={16} />}
											/>
										</translateFetcher.Form>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="text-lg font-semibold flex items-center gap-2">
									<FileAudio className="w-5 h-5 text-muted-foreground" />
									Media Controls
								</h3>
								<div className="flex flex-wrap gap-4">
									<downloadAudioFetcher.Form method="post" action="download-audio">
										<LoadingButtonWithState
											state={downloadAudioFetcher.state}
											idleText="Download Audio"
											className="gap-2 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary"
											variant="outline"
											icon={<FileAudio size={16} />}
										/>
									</downloadAudioFetcher.Form>

									{translateVideo.source === 'download' && !playFile && (
										<downloadVideoFetcher.Form action="/app/downloads/download-video" method="post">
											{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
											<input name="id" value={downloadId!} hidden readOnly />
											<input name="highQuality" value="true" hidden readOnly />
											<LoadingButtonWithState
												state={downloadVideoFetcher.state}
												idleText="Download video"
												className="gap-2 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary"
												variant="outline"
												icon={<FileVideo size={16} />}
											/>
										</downloadVideoFetcher.Form>
									)}

									{translateVideo.audioFilePath && (
										<Form method="post" action="create-subtitle-translation">
											<Button variant="secondary" className="gap-2 transition-colors hover:bg-primary/20 hover:text-primary">
												<Captions size={16} />
												Create Subtitle Translation
											</Button>
										</Form>
									)}
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="text-lg font-semibold flex items-center gap-2">
									<Languages className="w-5 h-5 text-muted-foreground" />
									Rendering Actions
								</h3>
								<div className="flex flex-wrap gap-4">
									{playFile && (
										<renderFetcher.Form method="post" action="render">
											<LoadingButtonWithState
												state={renderFetcher.state}
												idleText="Render"
												className="transition-colors hover:bg-primary/10 hover:text-primary"
												variant="outline"
											/>
										</renderFetcher.Form>
									)}

									{playFile && (
										<remoteRenderFetcher.Form method="post" action="remote-render">
											<LoadingButtonWithState
												state={remoteRenderFetcher.state}
												idleText="Remote Render"
												className="transition-colors hover:bg-primary/10 hover:text-primary"
												variant="outline"
											/>
										</remoteRenderFetcher.Form>
									)}

									{translateVideo.outputFilePath && (
										<Link to="cut" target="_blank" rel="noopener noreferrer">
											<Button variant="outline" className="gap-2 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary">
												<Download size={16} />
												Cut
											</Button>
										</Link>
									)}

									{translateVideo.outputFilePath && (
										<Link to="local-download" target="_blank" rel="noopener noreferrer">
											<Button variant="outline" className="gap-2 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary">
												<Download size={16} />
												Download Local
											</Button>
										</Link>
									)}

									{translateVideo.outputFilePath && (
										<Form method="post" action="create-translate-comment">
											<Button variant="secondary" className="gap-2 transition-colors hover:bg-primary/20 hover:text-primary">
												<MessageSquare size={16} />
												Start Translate Comment
											</Button>
										</Form>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="w-full lg:w-[400px] lg:flex-1">
					<Card className="sticky top-4 group transition-all duration-300 hover:shadow-lg">
						<CardHeader className="sticky top-0 bg-card z-10">
							<CardTitle className="flex items-center gap-2">
								<Languages className="w-5 h-5 text-muted-foreground" />
								Transcripts
							</CardTitle>
						</CardHeader>
						<CardContent className="max-h-[calc(100vh-180px)] overflow-y-auto px-4 -mx-2">
							<Transcripts transcripts={translateVideo?.transcripts ?? []} />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
