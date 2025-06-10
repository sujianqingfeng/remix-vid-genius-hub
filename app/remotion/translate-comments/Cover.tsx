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
		// Staggered animations for better visual hierarchy
		const titleOpacity = interpolate(frame, [15, 35], [0, 1], {
			extrapolateRight: 'clamp',
		})

		const titleScale = spring({
			frame: frame - 10,
			from: 0.8,
			to: 1,
			fps,
			config: {
				damping: 20,
				stiffness: 120,
				mass: 0.8,
			},
		})

		const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], {
			extrapolateRight: 'clamp',
		})

		const authorOpacity = interpolate(frame, [35, 55], [0, 1], {
			extrapolateRight: 'clamp',
		})

		const decorativeOpacity = interpolate(frame, [45, 65], [0, 1], {
			extrapolateRight: 'clamp',
		})

		// Floating animation for decorative elements
		const floatY = interpolate(frame, [0, 120], [0, -20], {
			extrapolateRight: 'extend',
		})

		const floatY2 = interpolate(frame, [0, 100], [0, 15], {
			extrapolateRight: 'extend',
		})

		// Background gradient animation
		const bgGradientOffset = interpolate(frame, [0, 300], [0, 100], {
			extrapolateRight: 'extend',
		})

		return (
			<AbsoluteFill className="relative overflow-hidden">
				{/* Animated gradient background - matching the main video style */}
				<div
					className="absolute inset-0 bg-gradient-to-br from-rose-50 via-slate-50 to-rose-100"
					style={{
						backgroundPosition: `${bgGradientOffset}% 50%`,
						backgroundSize: '200% 200%',
					}}
				/>

				{/* Subtle overlay for depth */}
				<div className="absolute inset-0 bg-white/30" />

				{/* Geometric decorative elements */}
				<div
					className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-rose-100/40 backdrop-blur-xl"
					style={{
						opacity: decorativeOpacity,
						transform: `translateY(${floatY}px)`,
					}}
				/>
				<div
					className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-slate-100/50 to-transparent backdrop-blur-xl"
					style={{
						opacity: decorativeOpacity,
						transform: `translateY(${floatY2}px)`,
					}}
				/>

				{/* Grid pattern overlay */}
				<div className="absolute inset-0 opacity-[0.02]">
					<div className="w-full h-full bg-[linear-gradient(rgba(156,163,175,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(156,163,175,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
				</div>

				{/* Main content container */}
				<div className="w-full h-full flex flex-col justify-center items-center p-8 relative z-10">
					{/* Author badge */}
					{author && (
						<div className="mb-8 px-6 py-3 rounded-xl bg-rose-100 border border-rose-200/50 shadow-sm" style={{ opacity: authorOpacity }}>
							<span className="text-rose-600 text-lg font-medium tracking-wider">@{author}</span>
						</div>
					)}

					{/* Main title */}
					<div
						className="text-center mb-12 mx-32"
						style={{
							opacity: titleOpacity,
							transform: `scale(${titleScale})`,
						}}
					>
						<h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-rose-500 mb-6 leading-normal tracking-tight">{processedTitle}</h1>
					</div>

					{/* Subtitle section */}
					<div className="text-center max-w-4xl" style={{ opacity: subtitleOpacity }}>
						<div className="flex items-center justify-center gap-6 mb-8">
							<div className="h-1 w-16 bg-gradient-to-r from-transparent via-slate-400/60 to-transparent rounded-full" />
							<h2 className="text-2xl sm:text-3xl font-bold text-slate-700 tracking-wide">外网真实评论</h2>
							<div className="h-1 w-16 bg-gradient-to-r from-transparent via-slate-400/60 to-transparent rounded-full" />
						</div>

						<p className="text-xl text-slate-600 font-light tracking-wide leading-relaxed">Authentic Global Perspectives</p>
					</div>

					{/* Decorative bottom elements */}
					<div className="absolute bottom-12 left-1/2 transform -translate-x-1/2" style={{ opacity: decorativeOpacity }}>
						<div className="flex items-center gap-3">
							<div className="w-2 h-2 rounded-full bg-rose-300" />
							<div className="w-3 h-3 rounded-full bg-rose-400" />
							<div className="w-2 h-2 rounded-full bg-rose-300" />
						</div>
					</div>
				</div>

				{/* Subtle light effects */}
				<div
					className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1/3 bg-gradient-to-b from-white/40 to-transparent"
					style={{ opacity: decorativeOpacity * 0.3 }}
				/>
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
