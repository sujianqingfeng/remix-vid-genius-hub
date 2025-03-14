import path from 'node:path'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { Player } from '@remotion/player'
import { format } from 'date-fns'
import getVideoId from 'get-video-id'
import { Copy, Trash, Wand2 } from 'lucide-react'
import invariant from 'tiny-invariant'
import AiModelSelect from '~/components/AiModelSelect'
import BackPrevious from '~/components/BackPrevious'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import Comments from '~/components/business/translate-comment/Comments'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
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
	const transformFetcher = useFetcher()
	const checkSensitiveWordsFetcher = useFetcher()
	const deleteFetcher = useFetcher()
	const generatePublishTitleFetcher = useFetcher()

	const currentTime = format(translateComment.commentPullAt ?? new Date(), 'yyyy-MM-dd HH:mm')
	const desc = `视频源ID：${videoId}
本视频为娱乐向作品，请勿作过度延伸解读
排序算法受点赞量、互动时效等多维度数据影响
评论内容具有动态调整特性，当前数据获取时间：${currentTime}
请务必保持理性判断，注意甄别信息真实性`
	const publishTitle = `外网真实评论：${translateComment.translatedTitle}`
	const generatedTitle = (generatePublishTitleFetcher.data as { title: string } | undefined)?.title

	const onCopy = async (text?: string) => {
		if (!text) {
			return
		}
		await navigator.clipboard.writeText(text)
		toast({
			title: 'copy successful!',
		})
	}

	return (
		<div className="h-[calc(100vh-2rem)] overflow-hidden bg-gradient-to-br from-background via-background to-muted/10 px-8 py-6">
			<BackPrevious />

			<div className="grid grid-cols-[1fr,400px] gap-10 mt-6 h-[calc(100vh-8rem)]">
				{/* Left Column */}
				<div className="space-y-8 overflow-y-auto pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
					{/* Video Player */}
					<div className="bg-background border rounded-xl overflow-hidden">
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

					{/* Video Info */}
					<div className="bg-background border rounded-xl divide-y">
						<div className="p-5">
							<p className="text-sm text-muted-foreground/90 mb-4">{download.title}</p>

							<button
								type="button"
								className="flex items-start gap-3 group cursor-pointer w-full text-left hover:bg-accent p-2 rounded-md transition-colors"
								onClick={() => onCopy(publishTitle)}
								onKeyDown={(e) => e.key === 'Enter' && onCopy(publishTitle)}
							>
								<Copy size={16} className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
								<p className="text-sm font-medium">{publishTitle}</p>
							</button>

							{generatedTitle && (
								<button
									type="button"
									className="flex items-start gap-3 group cursor-pointer w-full text-left hover:bg-accent p-2 rounded-md transition-colors"
									onClick={() => onCopy(generatedTitle)}
									onKeyDown={(e) => e.key === 'Enter' && onCopy(generatedTitle)}
								>
									<Copy size={16} className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
									<p className="text-sm font-medium">{generatedTitle}</p>
								</button>
							)}

							<generatePublishTitleFetcher.Form action="generate-publish-title" method="post">
								<LoadingButtonWithState
									variant="ghost"
									size="sm"
									className="w-full justify-start"
									state={generatePublishTitleFetcher.state}
									idleText="Generate Publish Title"
									icon={<Wand2 size={14} />}
								/>
							</generatePublishTitleFetcher.Form>

							<button
								type="button"
								className="flex items-start gap-3 group cursor-pointer w-full text-left hover:bg-accent p-2 rounded-md transition-colors"
								onClick={() => onCopy(desc)}
								onKeyDown={(e) => e.key === 'Enter' && onCopy(desc)}
							>
								<Copy size={16} className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
								<p className="text-sm text-muted-foreground/90 whitespace-pre-line">{desc}</p>
							</button>
						</div>

						{/* Controls */}
						<div className="divide-y">
							{/* Mode & Title Update */}
							<updateFetcher.Form method="post" action="update">
								<div className="flex gap-3 p-5">
									<Select name="mode" defaultValue={translateComment.mode}>
										<SelectTrigger className="w-[140px]">
											<SelectValue placeholder="select mode" />
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

									<LoadingButtonWithState state={updateFetcher.state} idleText="Update" />
								</div>
							</updateFetcher.Form>

							{/* Action Buttons */}
							<div className="p-5">
								<div className="flex flex-wrap gap-3">
									{/* Info & Download Group */}
									<div className="flex gap-2">
										<downloadInfoFetcher.Form action="/app/downloads/download-info" method="post">
											<input name="id" value={dId} hidden readOnly />
											<LoadingButtonWithState variant="secondary" size="sm" state={downloadInfoFetcher.state} idleText="Download info" />
										</downloadInfoFetcher.Form>

										{download.author && !download.filePath && (
											<downloadVideoFetcher.Form action="/app/downloads/download-video" method="post">
												<input name="id" value={dId} hidden readOnly />
												<LoadingButtonWithState variant="secondary" size="sm" state={downloadVideoFetcher.state} idleText="Download video" />
											</downloadVideoFetcher.Form>
										)}
									</div>

									{/* Translation Group */}
									<div className="flex items-center gap-2 border-l pl-3">
										<translateFetcher.Form action="translate" method="post">
											<div className="flex gap-2">
												<AiModelSelect name="aiModel" defaultValue="deepseek" />
												<LoadingButtonWithState variant="secondary" size="sm" state={translateFetcher.state} idleText="Translate" />
											</div>
										</translateFetcher.Form>

										<transformFetcher.Form action="transform" method="post">
											<LoadingButtonWithState variant="secondary" size="sm" state={transformFetcher.state} idleText="Transform" />
										</transformFetcher.Form>

										<checkSensitiveWordsFetcher.Form action="check-sensitive-words" method="post">
											<LoadingButtonWithState variant="secondary" size="sm" state={checkSensitiveWordsFetcher.state} idleText="Check Words" />
										</checkSensitiveWordsFetcher.Form>
									</div>

									{/* Render Group */}
									{download.author && download.filePath && (
										<div className="flex gap-2 border-l pl-3">
											<renderFetcher.Form action="render" method="post">
												<LoadingButtonWithState variant="secondary" size="sm" state={renderFetcher.state} idleText="Render" />
											</renderFetcher.Form>

											<remoteRenderFetcher.Form action="remote-render" method="post">
												<LoadingButtonWithState variant="secondary" size="sm" state={remoteRenderFetcher.state} idleText="Remote Render" />
											</remoteRenderFetcher.Form>

											{translateComment.outputFilePath && (
												<Link to="local-download" target="_blank" rel="noopener noreferrer">
													<Button variant="secondary" size="sm">
														Download Local
													</Button>
												</Link>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Comments */}
				<div className="bg-background border rounded-xl h-full overflow-hidden flex flex-col">
					<div className="px-5 py-4 border-b bg-muted/5">
						<div className="flex justify-between items-center">
							<h3 className="font-medium text-lg">Comments</h3>
							{translateComment.comments?.length ? (
								<deleteFetcher.Form action="delete-comments" method="post">
									<Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive text-destructive">
										<Trash size={14} className="mr-1" />
										Delete All
									</Button>
								</deleteFetcher.Form>
							) : null}
						</div>
					</div>
					<div className="flex-1 overflow-y-auto p-5">
						{translateComment.comments?.length ? (
							<Comments comments={translateComment.comments ?? []} />
						) : (
							<div className="flex flex-col gap-4 items-center justify-center h-full">
								<p className="text-muted-foreground/90">No comments available</p>
								<downloadCommentsFetcher.Form action="download-comments" method="post" className="flex gap-2">
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
									<LoadingButtonWithState variant="secondary" state={downloadCommentsFetcher.state} idleText="Download comments" />
								</downloadCommentsFetcher.Form>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
