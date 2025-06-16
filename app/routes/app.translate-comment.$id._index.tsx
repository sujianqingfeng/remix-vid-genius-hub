import path from 'node:path'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { Player } from '@remotion/player'
import { format } from 'date-fns'
import getVideoId from 'get-video-id'
import {
	ArrowDownToLine,
	Calendar,
	Clock,
	Copy,
	Download,
	ExternalLink,
	Eye,
	FileDown,
	FileText,
	Globe,
	Info,
	Languages,
	Play,
	RefreshCw,
	RotateCw,
	Save,
	ShieldAlert,
	Trash,
	User,
	Video,
} from 'lucide-react'
import invariant from 'tiny-invariant'
import AiModelSelect from '~/components/AiModelSelect'
import BackPrevious from '~/components/BackPrevious'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import Comments from '~/components/business/translate-comment/Comments'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
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
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<BackPrevious />
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
									<Languages className="w-4 h-4 text-primary" />
								</div>
								<div>
									<h1 className="text-xl font-semibold text-foreground">Translate Comment</h1>
									<p className="text-sm text-muted-foreground">Video Comment Translation Studio</p>
								</div>
							</div>
							{translateComment.mode && (
								<Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/20">
									{translateComment.mode}
								</Badge>
							)}
						</div>
						{translateComment.outputFilePath && (
							<Link to="local-download" target="_blank" rel="noopener noreferrer">
								<Button className="shadow-soft">
									<ArrowDownToLine size={16} className="mr-2" />
									Download Output
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>

			<div className="container mx-auto px-6 py-8">
				<div className="grid grid-cols-1 xl:grid-cols-[1fr,420px] gap-8">
					{/* Left Column */}
					<div className="space-y-8">
						{/* Video Player */}
						<Card className="overflow-hidden border-border/50 shadow-soft bg-card/50 backdrop-blur-sm">
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
								<CardFooter className="bg-muted/50 border-t border-border">
									<div className="flex items-center gap-3 w-full">
										<Video className="w-5 h-5 text-muted-foreground" />
										<p className="text-sm text-foreground truncate flex-1 font-medium">{download.title}</p>
										{download.viewCountText && (
											<div className="flex items-center gap-1 text-xs text-muted-foreground">
												<Eye className="w-3 h-3" />
												{download.viewCountText}
											</div>
										)}
									</div>
								</CardFooter>
							)}
						</Card>

						{/* Video Information */}
						<Card className="border-border/50 shadow-soft bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg">
									<Info className="w-5 h-5 text-primary" />
									Video Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Video Stats */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="bg-muted/50 p-3 rounded-lg border border-border">
										<div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
											<User className="w-3 h-3" />
											AUTHOR
										</div>
										<p className="text-sm font-semibold text-foreground truncate">{download.author || 'Unknown'}</p>
									</div>
									<div className="bg-muted/50 p-3 rounded-lg border border-border">
										<div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
											<FileText className="w-3 h-3" />
											COMMENTS
										</div>
										<p className="text-sm font-semibold text-foreground">{commentsCount}</p>
									</div>
									<div className="bg-muted/50 p-3 rounded-lg border border-border">
										<div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
											<Clock className="w-3 h-3" />
											FPS
										</div>
										<p className="text-sm font-semibold text-foreground">{translateComment.fps}</p>
									</div>
									<div className="bg-muted/50 p-3 rounded-lg border border-border">
										<div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
											<Calendar className="w-3 h-3" />
											UPDATED
										</div>
										<p className="text-sm font-semibold text-foreground">{currentTime}</p>
									</div>
								</div>

								{/* Copyable Content */}
								<div className="space-y-3">
									<div className="text-sm font-medium text-foreground mb-2">Publish Content</div>
									<button
										type="button"
										className="group relative w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
										onClick={() => onCopy(publishTitle)}
									>
										<div className="flex items-start gap-3">
											<Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-0.5 flex-shrink-0" />
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground break-words">{publishTitle}</p>
												<p className="text-xs text-muted-foreground mt-1">Click to copy title</p>
											</div>
										</div>
									</button>

									<button
										type="button"
										className="group relative w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
										onClick={() => onCopy(desc)}
									>
										<div className="flex items-start gap-3">
											<Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-0.5 flex-shrink-0" />
											<div className="flex-1 min-w-0">
												<p className="text-sm text-muted-foreground whitespace-pre-line break-words">{desc}</p>
												<p className="text-xs text-muted-foreground mt-2">Click to copy description</p>
											</div>
										</div>
									</button>
								</div>

								<Separator />

								{/* Settings Update */}
								<updateFetcher.Form method="post" action="update" className="p-4 bg-muted/50 rounded-lg border border-border">
									<div className="flex gap-3 items-end">
										<div className="flex-shrink-0">
											<label htmlFor="mode-select" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">
												MODE
											</label>
											<Select name="mode" defaultValue={translateComment.mode}>
												<SelectTrigger id="mode-select" className="w-[140px] bg-white dark:bg-slate-900">
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
										</div>

										<div className="flex-1">
											<label htmlFor="translated-title" className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">
												TRANSLATED TITLE
											</label>
											<Input
												id="translated-title"
												name="translatedTitle"
												defaultValue={translateComment.translatedTitle || ''}
												placeholder="Enter translated title..."
												className="bg-white dark:bg-slate-900"
											/>
										</div>

										<Button type="submit" disabled={updateFetcher.state !== 'idle'} className="bg-blue-600 hover:bg-blue-700 text-white">
											{updateFetcher.state !== 'idle' ? (
												<>
													<RefreshCw size={16} className="mr-2 animate-spin" />
													Updating...
												</>
											) : (
												<>
													<Save size={16} className="mr-2" />
													Update
												</>
											)}
										</Button>
									</div>
								</updateFetcher.Form>
							</CardContent>
						</Card>

						{/* Action Controls */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Download Actions */}
							<Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-base">
										<Download className="w-5 h-5" />
										Download
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<downloadInfoFetcher.Form action="/app/downloads/download-info" method="post">
										<input name="id" value={dId} hidden readOnly />
										<LoadingButtonWithState
											variant="outline"
											size="sm"
											state={downloadInfoFetcher.state}
											idleText="Info"
											icon={<Info size={14} />}
											className="w-full bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
										/>
									</downloadInfoFetcher.Form>

									{download.author && !download.filePath && (
										<downloadVideoFetcher.Form action="/app/downloads/download-video" method="post">
											<input name="id" value={dId} hidden readOnly />
											<LoadingButtonWithState
												variant="outline"
												size="sm"
												state={downloadVideoFetcher.state}
												idleText="Video"
												icon={<Video size={14} />}
												className="w-full bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
											/>
										</downloadVideoFetcher.Form>
									)}
								</CardContent>
							</Card>

							{/* Translation Actions */}
							<Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-base">
										<Languages className="w-5 h-5" />
										Translation
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<translateFetcher.Form action="translate" method="post" className="space-y-3">
										<AiModelSelect name="aiModel" defaultValue="deepseek" />
										<Button
											type="submit"
											variant="outline"
											size="sm"
											disabled={translateFetcher.state !== 'idle'}
											className="w-full bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
										>
											{translateFetcher.state !== 'idle' ? (
												<>
													<RefreshCw size={14} className="mr-2 animate-spin" />
													Loading...
												</>
											) : (
												<>
													<Languages size={14} className="mr-2" />
													Translate
												</>
											)}
										</Button>
									</translateFetcher.Form>

									{commentsCount > 0 && (
										<sensitiveCheckFetcher.Form method="post" action="check-sensitive">
											<Button
												type="submit"
												variant="outline"
												size="sm"
												disabled={sensitiveCheckFetcher.state !== 'idle'}
												className="w-full bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
											>
												{sensitiveCheckFetcher.state !== 'idle' ? (
													<>
														<RefreshCw size={14} className="mr-2 animate-spin" />
														Loading...
													</>
												) : (
													<>
														<ShieldAlert size={14} className="mr-2" />
														Check Sensitive
													</>
												)}
											</Button>
										</sensitiveCheckFetcher.Form>
									)}
								</CardContent>
							</Card>

							{/* Render Actions */}
							{download.author && download.filePath && (
								<Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-base">
											<RotateCw className="w-5 h-5" />
											Render
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<renderFetcher.Form action="render" method="post">
											<Button
												type="submit"
												variant="outline"
												size="sm"
												disabled={renderFetcher.state !== 'idle'}
												className="w-full bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
											>
												{renderFetcher.state !== 'idle' ? (
													<>
														<RefreshCw size={14} className="mr-2 animate-spin" />
														Loading...
													</>
												) : (
													<>
														<RotateCw size={14} className="mr-2" />
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
												className="w-full bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
											>
												{remoteRenderFetcher.state !== 'idle' ? (
													<>
														<RefreshCw size={14} className="mr-2 animate-spin" />
														Loading...
													</>
												) : (
													<>
														<Globe size={14} className="mr-2" />
														Remote Render
													</>
												)}
											</Button>
										</remoteRenderFetcher.Form>
									</CardContent>
								</Card>
							)}
						</div>
					</div>

					{/* Right Column - Comments */}
					<Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm h-[calc(100vh-12rem)] flex flex-col">
						<CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 border-b border-slate-200/50 dark:border-slate-700/50 flex flex-row items-center justify-between space-y-0 py-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
									<FileText className="w-4 h-4 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-slate-100">Comments</h3>
									{commentsCount > 0 && <p className="text-xs text-slate-500 dark:text-slate-400">{commentsCount} comments available</p>}
								</div>
								{commentsCount > 0 && (
									<Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
										{commentsCount}
									</Badge>
								)}
							</div>
							{commentsCount > 0 && (
								<deleteFetcher.Form action="delete-comment" method="post">
									<Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600 text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400">
										<Trash size={14} className="mr-2" />
										Delete All
									</Button>
								</deleteFetcher.Form>
							)}
						</CardHeader>
						<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500">
							{commentsCount > 0 ? (
								<div className="p-6">
									<Comments comments={translateComment.comments ?? []} />
								</div>
							) : (
								<div className="flex flex-col items-center justify-center h-full text-center p-8">
									<div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-4">
										<FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
									</div>
									<h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No Comments Yet</h3>
									<p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">Download comments from the video to start the translation process.</p>
									{download.author && (
										<downloadCommentsFetcher.Form action="download-comments" method="post" className="flex flex-col gap-3 w-full max-w-sm">
											<Select name="pageCount" defaultValue="3">
												<SelectTrigger className="bg-white dark:bg-slate-900">
													<SelectValue placeholder="Select pages" />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
														<SelectItem key={num} value={num.toString()}>
															{num} {num === 1 ? 'page' : 'pages'}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												type="submit"
												disabled={downloadCommentsFetcher.state !== 'idle'}
												className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
											>
												{downloadCommentsFetcher.state !== 'idle' ? (
													<>
														<RefreshCw size={16} className="mr-2 animate-spin" />
														Loading...
													</>
												) : (
													<>
														<Download size={16} className="mr-2" />
														Download Comments
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
		</div>
	)
}
