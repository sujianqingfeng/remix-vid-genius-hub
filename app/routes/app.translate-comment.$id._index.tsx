import path from 'node:path'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { Player } from '@remotion/player'
import { format } from 'date-fns'
import getVideoId from 'get-video-id'
import { ArrowDownToLine, Copy, Download, ExternalLink, FileDown, FileText, Globe, Info, Languages, Play, RefreshCw, RotateCw, Save, ShieldAlert, Trash, Video } from 'lucide-react'
import invariant from 'tiny-invariant'
import AiModelSelect from '~/components/AiModelSelect'
import BackPrevious from '~/components/BackPrevious'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import Comments from '~/components/business/translate-comment/Comments'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { commentModeOptions } from '~/config'
import { toast } from '~/hooks/use-toast'
import type { schema } from '~/lib/drizzle'
import { LandscapeTranslateComment, PortraitTranslateComment, VerticalTranslateComment } from '~/remotion'
import { safeCopyFileToPublic } from '~/utils/file'
import { buildTranslateCommentRemotionRenderData } from '~/utils/translate-comment'
import { getTranslateCommentAndDownloadInfo } from '~/utils/translate-comment.server'

type Mode = (typeof schema.translateComments.$inferSelect)['mode']
function getRemotionTemplateComponent(mode: Mode) {
	const componentMap = {
		landscape: LandscapeTranslateComment,
		portrait: PortraitTranslateComment,
		vertical: VerticalTranslateComment,
	}
	return componentMap[mode]
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const id = params.id
	invariant(id, 'id is required')
	const { translateComment, download } = await getTranslateCommentAndDownloadInfo(id)

	const playFilePath = translateComment.sourceFilePath || download.filePath
	let playFile = ''
	if (playFilePath) {
		const fileName = path.basename(playFilePath)
		await safeCopyFileToPublic(playFilePath)
		playFile = fileName
	}

	const render = await buildTranslateCommentRemotionRenderData({
		mode: translateComment.mode,
		fps: translateComment.fps,
		secondsForEvery30Words: translateComment.secondsForEvery30Words,
		coverDurationInSeconds: translateComment.coverDurationInSeconds,
		comments: translateComment.comments ?? [],
	})

	const videoId = getVideoId(download.link).id

	return { dId: translateComment.downloadId, id, download, render, translateComment, playFile, videoId }
}

export default function TranslateCommentPage() {
	const { dId, download, render, translateComment, playFile, videoId } = useLoaderData<typeof loader>()
	const downloadInfoFetcher = useFetcher()
	const downloadVideoFetcher = useFetcher()
	const downloadCommentsFetcher = useFetcher()
	const updateFetcher = useFetcher()
	const translateFetcher = useFetcher()
	const renderFetcher = useFetcher()
	const remoteRenderFetcher = useFetcher()
	const deleteFetcher = useFetcher()
	const sensitiveCheckFetcher = useFetcher()

	const currentTime = format(translateComment.commentPullAt ?? new Date(), 'yyyy-MM-dd HH:mm')
	const desc = `视频源ID：${videoId}
本视频为娱乐向作品，请勿作过度延伸解读
视频可能会消音一些敏感内容
评论排序算法受点赞量、互动时效等多维度数据影响
评论内容具有动态调整特性，当前数据获取时间：${currentTime}
请务必保持理性判断，注意甄别信息真实性`
	const publishTitle = `外网真实评论：${translateComment.translatedTitle}`
	const commentsCount = translateComment.comments?.length || 0

	const onCopy = async (text?: string) => {
		if (!text) {
			return
		}
		await navigator.clipboard.writeText(text)
		toast({
			title: 'Copy successful!',
		})
	}

	return (
		<div className="h-[calc(100vh-2rem)] overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 px-6 py-5">
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-3">
					<BackPrevious />
					<h1 className="text-xl font-semibold text-foreground/90">Translate Comment</h1>
					{translateComment.mode && (
						<Badge variant="outline" className="ml-2 capitalize">
							{translateComment.mode}
						</Badge>
					)}
				</div>
				{translateComment.outputFilePath && (
					<Link to="local-download" target="_blank" rel="noopener noreferrer">
						<Button variant="outline" size="sm" className="flex items-center gap-1 border-primary/20 text-primary hover:text-primary hover:bg-primary/10">
							<ArrowDownToLine size={14} className="mr-1" />
							Download Output
						</Button>
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6 h-[calc(100vh-8rem)]">
				{/* Left Column */}
				<div className="space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/20">
					{/* Video Player */}
					<Card className="border-muted/30 shadow-sm">
						<div className="relative group">
							<Player
								component={getRemotionTemplateComponent(translateComment.mode)}
								inputProps={{
									comments: render.remotionVideoComments,
									title: translateComment.translatedTitle || '',
									playFile,
									viewCountText: download.viewCountText || '',
									coverDurationInSeconds: translateComment.coverDurationInSeconds,
									author: download.author || '',
								}}
								durationInFrames={render.totalDurationInFrames}
								compositionWidth={render.compositionWidth}
								compositionHeight={render.compositionHeight}
								fps={translateComment.fps}
								style={{
									width: '100%',
									height: 'auto',
									aspectRatio: `${render.compositionWidth} / ${render.compositionHeight}`,
								}}
								controls
								acknowledgeRemotionLicense
							/>
						</div>

						{download.title && (
							<CardFooter className="py-3 px-4 bg-muted/5">
								<p className="text-sm text-muted-foreground truncate">{download.title}</p>
							</CardFooter>
						)}
					</Card>

					{/* Video Info Card */}
					<Card className="border-muted/30 shadow-sm">
						<CardHeader className="pb-2">
							<h3 className="text-base font-medium">Video Information</h3>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Copyable Sections */}
							<div className="space-y-2">
								<button
									type="button"
									className="flex items-start gap-3 group cursor-pointer w-full text-left hover:bg-accent/60 p-2.5 rounded-md transition-colors"
									onClick={() => onCopy(publishTitle)}
									onKeyDown={(e) => e.key === 'Enter' && onCopy(publishTitle)}
								>
									<Copy size={16} className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 text-primary" />
									<p className="text-sm font-medium">{publishTitle}</p>
								</button>

								<button
									type="button"
									className="flex items-start gap-3 group cursor-pointer w-full text-left hover:bg-accent/60 p-2.5 rounded-md transition-colors"
									onClick={() => onCopy(desc)}
									onKeyDown={(e) => e.key === 'Enter' && onCopy(desc)}
								>
									<Copy size={16} className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 text-primary" />
									<p className="text-sm text-muted-foreground whitespace-pre-line">{desc}</p>
								</button>
							</div>

							<Separator />

							{/* Mode & Title Update */}
							<updateFetcher.Form method="post" action="update" className="p-2 rounded-lg">
								<div className="flex gap-3 items-center">
									<Select name="mode" defaultValue={translateComment.mode}>
										<SelectTrigger className="w-[120px]">
											<SelectValue placeholder="Select mode" />
										</SelectTrigger>
										<SelectContent>
											{commentModeOptions.map((item) => (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Input className="flex-1" name="translatedTitle" defaultValue={translateComment.translatedTitle || ''} placeholder="Translated Title" />

									<Button type="submit" disabled={updateFetcher.state !== 'idle'} className="flex items-center gap-1.5">
										{updateFetcher.state !== 'idle' ? (
											<>
												<RefreshCw size={14} className="mr-1.5 animate-spin" />
												Updating...
											</>
										) : (
											<>
												<Save size={14} className="mr-1.5" />
												Update
											</>
										)}
									</Button>
								</div>
							</updateFetcher.Form>
						</CardContent>

						{/* Action Controls */}
						<CardFooter className="flex-col gap-6 pt-0">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
								{/* Download Group */}
								<div className="bg-muted/5 p-3 rounded-lg space-y-3 border border-muted/10 hover:border-muted/20 transition-colors">
									<h3 className="text-xs uppercase font-medium text-muted-foreground tracking-wide">Download</h3>
									<div className="flex flex-wrap gap-2">
										<downloadInfoFetcher.Form action="/app/downloads/download-info" method="post">
											<input name="id" value={dId} hidden readOnly />
											<LoadingButtonWithState
												variant="outline"
												size="sm"
												state={downloadInfoFetcher.state}
												idleText={
													<>
														<Info size={14} className="mr-1.5" />
														Info
													</>
												}
												className="transition-all hover:shadow-sm"
											/>
										</downloadInfoFetcher.Form>

										{download.author && !download.filePath && (
											<downloadVideoFetcher.Form action="/app/downloads/download-video" method="post">
												<input name="id" value={dId} hidden readOnly />
												<LoadingButtonWithState
													variant="outline"
													size="sm"
													state={downloadVideoFetcher.state}
													idleText={
														<>
															<Video size={14} className="mr-1.5" />
															Video
														</>
													}
													className="transition-all hover:shadow-sm"
												/>
											</downloadVideoFetcher.Form>
										)}
									</div>
								</div>

								{/* Translation & Check Group */}
								<div className="bg-muted/5 p-3 rounded-lg space-y-3 border border-muted/10 hover:border-muted/20 transition-colors">
									<h3 className="text-xs uppercase font-medium text-muted-foreground tracking-wide">Translation</h3>
									<div className="flex flex-wrap gap-2">
										<translateFetcher.Form action="translate" method="post">
											<div className="flex gap-2">
												<AiModelSelect name="aiModel" defaultValue="deepseek" />
												<Button
													type="submit"
													variant="outline"
													size="sm"
													disabled={translateFetcher.state !== 'idle'}
													className="transition-all hover:shadow-sm flex items-center gap-1.5"
												>
													{translateFetcher.state !== 'idle' ? (
														<>
															<RefreshCw size={14} className="mr-1.5 animate-spin" />
															Loading...
														</>
													) : (
														<>
															<Languages size={14} className="mr-1.5" />
															Translate
														</>
													)}
												</Button>
											</div>
										</translateFetcher.Form>

										{commentsCount > 0 && (
											<sensitiveCheckFetcher.Form method="post" action="check-sensitive">
												<Button
													type="submit"
													variant="outline"
													size="sm"
													disabled={sensitiveCheckFetcher.state !== 'idle'}
													className="transition-all hover:shadow-sm flex items-center gap-1.5"
												>
													{sensitiveCheckFetcher.state !== 'idle' ? (
														<>
															<RefreshCw size={14} className="mr-1.5 animate-spin" />
															Loading...
														</>
													) : (
														<>
															<ShieldAlert size={14} className="mr-1.5" />
															Check Sensitive
														</>
													)}
												</Button>
											</sensitiveCheckFetcher.Form>
										)}
									</div>
								</div>

								{/* Render Group */}
								{download.author && download.filePath && (
									<div className="bg-muted/5 p-3 rounded-lg space-y-3 border border-muted/10 hover:border-muted/20 transition-colors md:col-span-2">
										<h3 className="text-xs uppercase font-medium text-muted-foreground tracking-wide">Render & Output</h3>
										<div className="flex flex-wrap gap-2">
											<renderFetcher.Form action="render" method="post">
												<Button
													type="submit"
													variant="outline"
													size="sm"
													disabled={renderFetcher.state !== 'idle'}
													className="transition-all hover:shadow-sm flex items-center gap-1.5"
												>
													{renderFetcher.state !== 'idle' ? (
														<>
															<RefreshCw size={14} className="mr-1.5 animate-spin" />
															Loading...
														</>
													) : (
														<>
															<RotateCw size={14} className="mr-1.5" />
															Local Render
														</>
													)}
												</Button>
											</renderFetcher.Form>

											<remoteRenderFetcher.Form action="remote-render" method="post">
												<Button
													type="submit"
													variant="outline"
													size="sm"
													disabled={remoteRenderFetcher.state !== 'idle'}
													className="transition-all hover:shadow-sm flex items-center gap-1.5"
												>
													{remoteRenderFetcher.state !== 'idle' ? (
														<>
															<RefreshCw size={14} className="mr-1.5 animate-spin" />
															Loading...
														</>
													) : (
														<>
															<Globe size={14} className="mr-1.5" />
															Remote Render
														</>
													)}
												</Button>
											</remoteRenderFetcher.Form>
										</div>
									</div>
								)}
							</div>
						</CardFooter>
					</Card>
				</div>

				{/* Right Column - Comments */}
				<Card className="border-muted/30 h-full overflow-hidden flex flex-col shadow-sm">
					<CardHeader className="px-5 py-4 border-b bg-muted/5 flex flex-row items-center justify-between space-y-0">
						<div className="flex items-center gap-2">
							<h3 className="font-medium text-lg">Comments</h3>
							{commentsCount > 0 && (
								<Badge variant="secondary" className="text-xs px-2.5 py-0.5">
									{commentsCount}
								</Badge>
							)}
						</div>
						{commentsCount > 0 && (
							<deleteFetcher.Form action="delete-comment" method="post">
								<Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive text-destructive/80 h-8">
									<Trash size={14} className="mr-1.5" />
									Delete All
								</Button>
							</deleteFetcher.Form>
						)}
					</CardHeader>
					<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/20">
						{commentsCount > 0 ? (
							<div className="p-5">
								<Comments comments={translateComment.comments ?? []} />
							</div>
						) : (
							<div className="flex flex-col gap-4 items-center justify-center h-full text-center p-5">
								<div className="bg-muted/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
									<FileText className="w-8 h-8 text-muted-foreground/50" />
								</div>
								<p className="text-muted-foreground">No comments available</p>
								{download.author && (
									<downloadCommentsFetcher.Form action="download-comments" method="post" className="flex gap-2 mt-2">
										<Select name="pageCount" defaultValue="3">
											<SelectTrigger className="w-24">
												<SelectValue placeholder="Pages" />
											</SelectTrigger>
											<SelectContent>
												{Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
													<SelectItem key={num} value={num.toString()}>
														{num} {num === 1 ? 'page' : 'pages'}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Button type="submit" variant="secondary" disabled={downloadCommentsFetcher.state !== 'idle'} className="shadow-sm hover:shadow flex items-center gap-1.5">
											{downloadCommentsFetcher.state !== 'idle' ? (
												<>
													<RefreshCw size={14} className="mr-1.5 animate-spin" />
													Loading...
												</>
											) : (
												<>
													<Download size={14} className="mr-1.5" />
													Download
												</>
											)}
										</Button>
									</downloadCommentsFetcher.Form>
								)}
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	)
}
