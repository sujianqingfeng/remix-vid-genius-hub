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
		const subtitleOpacity = interpolate(frame, [0, 20], [0, 1], {
			extrapolateRight: 'clamp',
		})
		const subtitleY = interpolate(frame, [0, 20], [20, 0], {
			extrapolateRight: 'clamp',
		})

		const titleScale = spring({
			frame,
			from: 0.8,
			to: 1,
			fps,
			config: {
				damping: 100,
				stiffness: 200,
				mass: 0.5,
			},
		})

		const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
			extrapolateRight: 'clamp',
		})

		const decorationScale = spring({
			frame: frame - 5,
			from: 0,
			to: 1,
			fps,
			config: {
				damping: 80,
				stiffness: 150,
				mass: 0.8,
			},
		})

		// Enhanced animations for a more modern look
		const backgroundShift = interpolate(frame, [0, 150], [0, 15], { extrapolateRight: 'clamp' })

		const accentOpacity = spring({
			frame: frame - 10,
			from: 0,
			to: 0.9,
			fps,
			config: {
				damping: 100,
				stiffness: 140,
				mass: 0.6,
			},
		})

		// New subtle rotation animation for decorative elements
		const decorationRotate = interpolate(frame, [0, 180], [0, 8], { extrapolateRight: 'clamp' })

		return (
			<AbsoluteFill className="bg-gradient-to-br from-[#f1f3f8] via-[#e9ecf5] to-[#e2e6f0] overflow-hidden">
				{/* Modern layered background with subtle animations */}
				<div
					className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.7)_20%,rgba(255,255,255,0)_70%)]"
					style={{
						transform: `translateX(${backgroundShift}px)`,
					}}
				/>

				{/* Enhanced decorative elements with subtle rotation */}
				<div
					className="absolute top-8 right-12 w-48 h-48 rounded-full bg-gradient-to-br from-[#ff7676] to-[#ff3a3a] blur-xl opacity-15"
					style={{
						transform: `scale(${decorationScale}) rotate(${decorationRotate}deg)`,
					}}
				/>
				<div
					className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-[#6e6e6e] to-[#3d3d3d] blur-xl opacity-10"
					style={{
						transform: `scale(${decorationScale}) rotate(-${decorationRotate}deg)`,
					}}
				/>
				<div
					className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#ffcece] to-[#ff7676] blur-xl opacity-15"
					style={{
						transform: `scale(${decorationScale * 0.8}) translateY(-30%) rotate(${decorationRotate / 2}deg)`,
					}}
				/>

				{/* Modern dot grid pattern */}
				<div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,rgba(130,130,130,0.2)_1px,transparent_1px)] bg-[size:24px_24px]" />

				<div className="w-full h-full flex justify-center items-center p-20">
					<div className="relative w-[85%] max-w-6xl">
						{/* Enhanced accent elements */}
						<div
							className="absolute -left-6 top-0 w-1.5 h-40 bg-gradient-to-b from-[#ff4040] via-[#ff5757] to-transparent rounded-full"
							style={{
								opacity: accentOpacity,
							}}
						/>

						<div
							className="absolute -right-10 bottom-10 w-1 h-32 bg-gradient-to-t from-[#ff4040] to-transparent rounded-full"
							style={{
								opacity: accentOpacity * 0.7,
							}}
						/>

						<div className="relative">
							<div
								style={{
									opacity: titleOpacity,
									transform: `scale(${titleScale})`,
								}}
								className="text-7xl font-bold tracking-tight"
							>
								<span className="bg-gradient-to-r from-[#101010] to-[#3a3a3a] bg-clip-text text-transparent drop-shadow-sm">外网真实评论</span>
								<div className="absolute -left-3 -bottom-2 w-20 h-1.5 bg-gradient-to-r from-[#ff4040] to-transparent rounded-full" style={{ opacity: accentOpacity }} />
							</div>
						</div>

						<div
							style={{
								opacity: subtitleOpacity,
								transform: `translateY(${subtitleY}px)`,
							}}
							className="text-4xl mt-8 font-medium text-gray-500 flex items-center"
						>
							<span className="text-sm mr-3 text-gray-400 tracking-wider">by</span>
							<span className="bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">{author ? `@${author}` : ''}</span>
						</div>

						<div
							className="mt-24"
							style={{
								opacity: interpolate(frame, [15, 35], [0, 1], {
									extrapolateRight: 'clamp',
								}),
								transform: `translateY(${interpolate(frame, [15, 35], [30, 0], {
									extrapolateRight: 'clamp',
								})}px)`,
							}}
						>
							<div className="relative">
								<div className="text-[6.5rem] font-bold leading-[1.1] bg-gradient-to-r from-[#ff2a2a] via-[#ff5757] to-[#ff8080] bg-clip-text text-transparent drop-shadow-lg">
									{processedTitle}
								</div>

								{/* Enhanced decorative elements around the title */}
								<div
									className="absolute -right-10 -top-12 w-32 h-32 rounded-full bg-gradient-to-br from-[#ffcece] to-[#ff9e9e] opacity-25 -z-10 blur-md"
									style={{
										transform: `rotate(${decorationRotate}deg)`,
									}}
								/>
								<div
									className="absolute -left-8 bottom-8 w-20 h-20 rounded-full bg-gradient-to-br from-[#ff7676] to-[#ff3a3a] opacity-20 -z-10 blur-md"
									style={{
										transform: `rotate(-${decorationRotate}deg)`,
									}}
								/>

								{/* Enhanced underline effect */}
								<div
									className="absolute -bottom-6 left-0 h-2 bg-gradient-to-r from-[#ff4040] via-[#ff5757] to-transparent rounded-full"
									style={{
										width: '50%',
										opacity: accentOpacity,
									}}
								/>
							</div>
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
