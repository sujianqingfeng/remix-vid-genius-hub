import { ThumbsUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { staticFile } from 'remotion'
import type { Comment } from '~/types'

const formatLikes = (count: number) => {
	if (count >= 10000) {
		return `${(count / 10000).toFixed(1)}w`
	}
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}k`
	}
	return count.toString()
}

interface CommentsProps {
	comments: Comment[]
	totalDurationInFrames?: number
}

export const Comments: React.FC<CommentsProps> = ({ comments, totalDurationInFrames }) => {
	const frame = useCurrentFrame()
	const { fps } = useVideoConfig()
	const containerRef = useRef<HTMLDivElement>(null)
	const [scrollHeight, setScrollHeight] = useState(0)

	useEffect(() => {
		if (containerRef.current) {
			setScrollHeight(containerRef.current.scrollHeight)
		}
	}, [])

	const opacity = spring({
		frame,
		fps,
		from: 0,
		to: 1,
		durationInFrames: 30,
	})

	// 计算滚动位置
	const calculateScrollPosition = () => {
		const visibleHeight = 700 // 可视区域高度
		const scrollDistance = Math.max(0, scrollHeight - visibleHeight)

		// 使用 interpolate 计算滚动位置
		const duration = totalDurationInFrames || fps * 15 // 如果没有提供总时长，默认使用15秒
		const scrollProgress = interpolate(frame, [fps * 0.5, duration - fps * 0.5], [0, scrollDistance], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		})

		return scrollProgress
	}

	const getAssetPath = (path: string) => {
		if (path.startsWith('http')) {
			return path
		}
		return staticFile(path.replace(/^\//, '').replace(/^public\//, ''))
	}

	return (
		<div className="h-full w-full overflow-hidden">
			<div
				className="w-full h-full"
				style={{
					opacity,
				}}
			>
				<div className="h-full px-8 py-4 overflow-hidden relative">
					<div
						ref={containerRef}
						className="comments-container space-y-6 absolute inset-x-0"
						style={{
							transform: `translateY(-${calculateScrollPosition()}px)`,
						}}
					>
						{comments.map((comment, index) => {
							const likes = typeof comment.likes === 'string' ? Number.parseInt(comment.likes, 10) : comment.likes
							const commentOpacity = spring({
								frame: frame - index * 5,
								fps,
								from: 0,
								to: 1,
								durationInFrames: 20,
							})

							return (
								<div
									key={comment.id || `${comment.author}-${index}`}
									className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm ring-1 ring-black/[0.02]"
									style={{
										opacity: commentOpacity,
										transform: `scale(${interpolate(commentOpacity, [0, 1], [0.95, 1])})`,
									}}
								>
									{/* Author Info */}
									<div className="flex items-center gap-4">
										{comment.authorThumbnail && (
											<div className="relative">
												<div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-50 blur-sm" />
												<img src={getAssetPath(comment.authorThumbnail)} alt={comment.author} className="relative w-12 h-12 rounded-full object-cover ring-2 ring-white" />
											</div>
										)}
										<div className="min-w-0 flex-1">
											<h3 className="text-lg font-semibold text-gray-900 truncate">{comment.author}</h3>

											{comment.likes ? (
												<div className="flex items-center gap-2 mt-1">
													<ThumbsUp className="w-4 h-4 text-blue-500" />
													<span className="text-base text-gray-600 font-medium">{formatLikes(likes)}</span>
												</div>
											) : (
												''
											)}
										</div>
									</div>

									{/* Text Content */}
									<div className="flex flex-col gap-4">
										<div className="bg-gray-50 rounded-xl p-4">
											<h4 className="text-xs font-semibold text-blue-600 tracking-wide uppercase mb-2">Original</h4>
											<p className="text-base text-gray-600 leading-relaxed">{comment.content}</p>
										</div>
										{comment.translatedContent && (
											<div className="bg-emerald-50 rounded-xl p-4">
												<h4 className="text-xs font-semibold text-emerald-600 tracking-wide uppercase mb-2">Translation</h4>
												<p className="text-4xl text-gray-900 leading-normal font-medium">{comment.translatedContent}</p>
											</div>
										)}
									</div>

									{/* Media Content */}
									{comment.media && comment.media.length > 0 && (
										<div className="flex gap-3 overflow-x-auto -mx-2 px-2">
											{comment.media
												.filter((m) => m.type === 'photo')
												.map((m, mediaIndex) => {
													const mediaUrl = m.localUrl ? getAssetPath(m.localUrl) : m.url

													return (
														<div key={m.url} className="w-[240px] aspect-[4/3] flex-shrink-0 bg-black rounded-xl overflow-hidden shadow-md ring-1 ring-black/5">
															<img src={mediaUrl} alt="Comment media" className="w-full h-full object-cover" />
														</div>
													)
												})}
										</div>
									)}
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
