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
		<AbsoluteFill className="bg-gradient-to-b from-white to-gray-50">
			<Cover coverDurationInSeconds={coverDurationInSeconds} title={title} author={author} />

			<Sequence from={coverDurationInSeconds * fps}>
				<AbsoluteFill>
					<div className="flex items-center justify-center h-[55%] pt-6 px-12">
						<div className="w-[30%] flex-shrink-0 h-full flex flex-col items-start justify-center">
							<div className="flex items-center gap-3 text-3xl font-medium bg-red-50 px-5 py-2.5 rounded-xl">
								<span className="text-[#d83a49]">播放量：{viewCountText}</span>
							</div>
							<p className="text-5xl mt-4 leading-[1.3] font-semibold max-w-[600px] text-[#d83a49]">{title}</p>
						</div>
						<div className="flex justify-center items-center">
							<div className="bg-black/5 rounded-xl p-1.5 w-[80%]">
								<Video loop className="object-contain w-full h-full rounded-lg" startFrom={0} crossOrigin="anonymous" src={playSrc} />
							</div>
						</div>
					</div>
				</AbsoluteFill>

				<AbsoluteFill>
					<div className="absolute bottom-0 left-0 px-12 pb-6 h-[45%] w-full flex flex-col bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-sm">
						<div className="text-xl leading-[20px] flex items-center gap-3 mb-3 text-gray-600 mt-4">
							<div className="font-medium">
								{currentComment?.author} ({currentComment?.publishedTime})
							</div>

							{currentComment?.likes.trim() && (
								<div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full">
									<ThumbsUp size={16} className="text-[#d83a49]" />
									<span className="text-[#d83a49]">{currentComment?.likes}</span>
								</div>
							)}
						</div>

						<div className="flex flex-col gap-3">
							<p className="leading-1.3 text-2xl text-ellipsis line-clamp-1 text-gray-700">{currentComment?.content}</p>

							<p
								className="text-[#d83a49] leading-[1.1]"
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
