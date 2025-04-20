import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

type CoverProps = {
	coverDurationInSeconds: number
	title?: string
	author?: string
	isSplit?: boolean
	coverOnly?: boolean
}

export default function Cover({ coverDurationInSeconds, title, author, isSplit = true, coverOnly = false }: CoverProps) {
	const { fps } = useVideoConfig()
	const frame = useCurrentFrame()
	const processedTitle = title?.endsWith('。') ? title.slice(0, -1) : title

	const CoverContent = () => {
		// Faster and simpler animations with better performance
		const textOpacity = interpolate(frame, [0, 15], [0, 1], {
			extrapolateRight: 'clamp',
		})

		const titleY = interpolate(frame, [5, 20], [15, 0], {
			extrapolateRight: 'clamp',
		})

		const authorOpacity = interpolate(frame, [12, 25], [0, 1], {
			extrapolateRight: 'clamp',
		})

		// Faster spring animation
		const accentScale = spring({
			frame: frame - 15, // Start earlier
			from: 0,
			to: 1,
			fps,
			config: {
				damping: 15,
				stiffness: 150, // Higher stiffness for faster motion
				mass: 0.5, // Lower mass for faster motion
			},
		})

		// Faster background fade
		const bgOpacity = interpolate(frame, [0, 15], [0, 0.7], {
			extrapolateRight: 'clamp',
		})

		return (
			<AbsoluteFill className="bg-gradient-to-br from-slate-50 to-slate-200 overflow-hidden relative">
				{/* 背景装饰：更丰富的渐变和模糊光斑 */}
				<div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
				<div className="absolute -right-40 top-0 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-slate-300/20 to-slate-200/10 blur-3xl" style={{ opacity: bgOpacity }} />
				<div className="absolute -left-40 bottom-0 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-slate-300/20 to-slate-200/10 blur-3xl" style={{ opacity: bgOpacity }} />
				<div className="absolute left-1/2 top-1/3 -translate-x-1/2 -z-10 w-[60vw] h-[20vh] bg-gradient-to-r from-slate-200/30 via-white/0 to-slate-200/30 blur-2xl rounded-full" />

				<div className="w-full h-full flex flex-col justify-center items-center p-4 sm:p-8 md:p-12">
					<div className="relative w-full max-w-5xl flex flex-col items-center">
						{/* Header 区域优化 */}
						<div style={{ opacity: textOpacity }} className="mb-10 flex flex-col items-center">
							{author && (
								<div className="text-gray-500 text-base sm:text-lg tracking-widest uppercase font-semibold mb-2 drop-shadow-sm bg-white/40 px-3 py-1 rounded-full border border-gray-200/60 backdrop-blur-md">
									@{author}
								</div>
							)}
							<div className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg flex items-center gap-4">
								<span className="h-8 w-1 bg-slate-300 rounded-full" />
								<span className="text-slate-700">外网真实评论</span>
								<span className="h-8 w-1 bg-slate-300 rounded-full" />
							</div>
						</div>

						{/* Title 卡片优化，增加玻璃拟态和阴影 */}
						<div
							className="mt-6 text-center relative px-6 py-10 sm:px-10 sm:py-14 rounded-2xl bg-white/60 backdrop-blur-xl shadow-2xl border border-white/80"
							style={{
								opacity: textOpacity,
								transform: `translateY(${titleY}px)`,
								boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
							}}
						>
							{/* 角标装饰优化 */}
							<div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-slate-300/70 rounded-tl-xl" style={{ opacity: authorOpacity }} />
							<div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-slate-300/70 rounded-br-xl" style={{ opacity: authorOpacity }} />

							{/* Title 字体优化 */}
							<div className="text-[2.5rem] sm:text-[4rem] md:text-[5rem] font-extrabold leading-[1.3] text-rose-400 tracking-tight drop-shadow-xl bg-gradient-to-b from-gray-800 to-gray-900 bg-clip-text text-transparent">
								{processedTitle}
							</div>

							{/* Accent line 优化 */}
							<div
								className="h-2 bg-slate-400 mx-auto mt-8 rounded-full shadow-sm"
								style={{
									width: '120px',
									opacity: authorOpacity,
									transform: `scaleX(${accentScale})`,
								}}
							/>
						</div>
					</div>
				</div>
			</AbsoluteFill>
		)
	}

	if (coverOnly) {
		return <CoverContent />
	}

	return (
		<Sequence from={0} durationInFrames={coverDurationInSeconds * fps}>
			<CoverContent />
		</Sequence>
	)
}
