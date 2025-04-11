import { ThumbsUp } from 'lucide-react'
import { AbsoluteFill, Sequence, Video, useVideoConfig } from 'remotion'
import Cover from './Cover'
import { useTranslateComment } from './hooks'
import type { TranslateCommentProps } from './types'

export default function LandscapeTranslateComment({ comments, title, playFile, viewCountText, coverDurationInSeconds, author, isRemoteRender = false }: TranslateCommentProps) {
	const { fps } = useVideoConfig()

	const { currentComment, fontSize, playSrc } = useTranslateComment({
		isRemoteRender,
		playFile,
		coverDurationInSeconds,
		comments,
		availableWidth: 1920 - 48,
		availableHeight: 440,
	})

	return (
		<AbsoluteFill className="bg-gradient-to-b from-rose-50 to-slate-50">
			<Cover coverDurationInSeconds={coverDurationInSeconds} title={title} author={author} />

			<Sequence from={coverDurationInSeconds * fps}>
				<AbsoluteFill>
					<div className="flex items-center justify-center h-[58%] pt-8 px-16">
						<div className="w-[28%] flex-shrink-0 h-full flex flex-col items-start justify-center">
							<div className="flex items-center gap-3 text-3xl font-medium bg-rose-100 px-6 py-3 rounded-xl shadow-sm">
								<p className="text-rose-700">播放量：{viewCountText}</p>
							</div>
							<p className="text-5xl mt-5 leading-[1.3] font-semibold max-w-[580px] text-rose-600">{title}</p>
						</div>
						<div className="flex justify-center items-center w-[72%]">
							<div className="bg-slate-200/70 rounded-xl p-2 w-[85%] shadow-md">
								<Video loop className="object-contain w-full h-full rounded-lg shadow-sm" startFrom={0} crossOrigin="anonymous" src={playSrc} />
							</div>
						</div>
					</div>
				</AbsoluteFill>

				<AbsoluteFill>
					<div className="absolute bottom-0 left-0 px-16 pb-8 h-[42%] w-full flex flex-col bg-gradient-to-t from-white/95 to-slate-50/90 backdrop-blur-sm border-t border-slate-200">
						<div className="text-xl leading-[20px] flex items-center gap-3 mb-4 text-slate-700 mt-6">
							<div className="font-medium">
								{currentComment?.author} ({currentComment?.publishedTime})
							</div>

							{currentComment?.likes.trim() && (
								<div className="flex items-center gap-1.5 bg-rose-100 px-4 py-1.5 rounded-full shadow-sm">
									<ThumbsUp size={16} className="text-rose-600" />
									<p className="text-rose-600">{currentComment?.likes}</p>
								</div>
							)}
						</div>

						<div className="flex flex-col gap-4">
							<p className="leading-tight text-2xl text-ellipsis line-clamp-1 text-slate-800 font-medium">{currentComment?.content}</p>

							<p
								className="text-rose-600 leading-[1.1]"
								style={{
									fontSize: `${fontSize}px`,
								}}
							>
								{currentComment?.translatedContent}
							</p>
						</div>
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	)
}
