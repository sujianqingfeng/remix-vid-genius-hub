import { ThumbsUp } from 'lucide-react'
import { AbsoluteFill, Sequence, Video, useVideoConfig } from 'remotion'
import Cover from './Cover'
import { useTranslateComment } from './hooks'
import type { TranslateCommentProps } from './types'

export default function PortraitTranslateComment({ comments, title, playFile, viewCountText, coverDurationInSeconds, author, isRemoteRender = false }: TranslateCommentProps) {
	const { fps } = useVideoConfig()

	const { currentComment, fontSize, playSrc } = useTranslateComment({
		isRemoteRender,
		playFile,
		coverDurationInSeconds,
		comments,
		availableWidth: 1920 / 2 - 32,
		availableHeight: 800,
	})

	return (
		<AbsoluteFill className="bg-white">
			<Cover coverDurationInSeconds={coverDurationInSeconds} title={title} author={author} />

			<Sequence from={coverDurationInSeconds * fps}>
				<AbsoluteFill>
					<div className="flex justify-center items-center w-[45%] h-full p-8">
						<Video loop className="object-contain h-full rounded-2xl shadow-lg" startFrom={0} crossOrigin="anonymous" src={playSrc} />
					</div>
				</AbsoluteFill>

				<AbsoluteFill>
					<div className="absolute top-0 left-[45%] w-[55%] flex flex-col p-8">
						<div className="text-[#ee3f4d]">
							<div className="space-y-4">
								{viewCountText && (
									<div className="flex items-center gap-3 text-3xl font-medium bg-red-50 px-4 py-2 rounded-lg w-fit">
										<span>播放量：{viewCountText}</span>
									</div>
								)}

								<h1 className="text-5xl font-bold leading-[1.4] tracking-tight">{title}</h1>
							</div>
						</div>

						<div className="flex items-center gap-4 text-2xl text-gray-700 border-b border-gray-100 pb-3 mt-4">
							<div className="font-medium">{currentComment?.author}</div>

							<div className="text-gray-500">{currentComment?.publishedTime}</div>

							{currentComment?.likes && +currentComment.likes > 0 && (
								<div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full">
									<ThumbsUp className="text-[#ee3f4d]" size={24} />
									<span className="text-[#ee3f4d]">{currentComment?.likes}</span>
								</div>
							)}
						</div>

						<div className="flex flex-col">
							<p className="leading-[1.6] text-3xl text-ellipsis line-clamp-4 text-gray-800">{currentComment?.content}</p>

							<p
								className="text-[#ee3f4d] leading-[1.4] font-semibold mt-2"
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
