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
		<AbsoluteFill className="bg-gradient-to-br from-rose-50 via-slate-50 to-rose-100">
			<Cover coverDurationInSeconds={coverDurationInSeconds} title={title} author={author} />

			<Sequence from={coverDurationInSeconds * fps}>
				<AbsoluteFill>
					<div className="flex items-center justify-center h-[60%] pt-12 px-20">
						<div className="w-[30%] flex-shrink-0 h-full flex flex-col items-start justify-center pr-8">
							<div className="flex items-center gap-3 text-2xl font-semibold bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-rose-100/50 mb-8">
								<div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
								<p className="text-rose-600">播放量：{viewCountText}</p>
							</div>

							<h1 className="text-4xl leading-[1.2] font-bold max-w-[580px] text-slate-800 tracking-tight">{title}</h1>

							<div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-rose-300 rounded-full mt-6" />
						</div>

						<div className="flex justify-center items-center w-[70%]">
							<div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 w-[90%] shadow-2xl border border-white/50">
								<div className="relative overflow-hidden rounded-2xl shadow-lg">
									<Video loop className="object-contain w-full h-full" startFrom={0} crossOrigin="anonymous" src={playSrc} />
									<div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
								</div>
							</div>
						</div>
					</div>
				</AbsoluteFill>

				<AbsoluteFill>
					<div className="absolute bottom-0 left-0 px-20 pb-12 h-[40%] w-full flex flex-col">
						<div className="flex items-center gap-4 mb-4 mt-6">
							<div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md border border-slate-200/50">
								<div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
									{currentComment?.author?.charAt(0)?.toUpperCase()}
								</div>
								<div className="text-lg font-medium text-slate-700">{currentComment?.author}</div>
								<div className="text-sm text-slate-500 bg-slate-100/70 px-3 py-1 rounded-full">{currentComment?.publishedTime}</div>
							</div>

							{currentComment?.likes.trim() && (
								<div className="flex items-center gap-2 bg-rose-100/80 backdrop-blur-sm px-5 py-3 rounded-xl shadow-md border border-rose-200/50">
									<ThumbsUp size={18} className="text-rose-600" />
									<p className="text-rose-600 font-semibold">{currentComment?.likes}</p>
								</div>
							)}
						</div>

						<div className="flex flex-col bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/60 h-full">
							{/* Original comment with adaptive display */}
							<div className={`${currentComment?.content && currentComment.content.length > 100 ? 'max-h-[80px]' : 'max-h-[60px]'} overflow-hidden mb-3`}>
								<p className="leading-[1.3] text-base text-slate-700 font-medium break-words">{currentComment?.content}</p>
							</div>

							{/* Subtle visual separator */}
							<div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300/30 to-transparent mb-3" />

							{/* Translated comment with optimized spacing */}
							<div className="flex-1 flex items-center justify-start">
								<p
									className="text-rose-600 font-bold break-words w-full leading-none"
									style={{
										fontSize: `${Math.min(fontSize, 56)}px`,
										lineHeight: fontSize > 40 ? '1.1' : fontSize > 28 ? '1.1' : '1.1',
										wordBreak: 'break-word',
										hyphens: 'auto',
									}}
								>
									{currentComment?.translatedContent}
								</p>
							</div>
						</div>
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	)
}
