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
			from: 0.95,
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

		const accentOpacity = spring({
			frame: frame - 10,
			from: 0,
			to: 0.9,
			fps,
			config: {
				damping: 100,
				stiffness: 150,
				mass: 0.6,
			},
		})

		return (
			<AbsoluteFill className="bg-white overflow-hidden">
				{/* Minimal dot grid pattern */}
				<div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,rgba(100,100,100,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />

				{/* Subtle accent line */}
				<div
					className="absolute top-0 left-[10%] w-[2px] h-full bg-gradient-to-b from-[#ff4040] via-[#ff6060] to-transparent"
					style={{
						opacity: accentOpacity * 0.6,
					}}
				/>

				<div className="w-full h-full flex justify-center items-center p-16">
					<div className="relative w-[80%] max-w-5xl">
						<div className="relative">
							<div
								style={{
									opacity: titleOpacity,
									transform: `scale(${titleScale})`,
								}}
								className="text-6xl font-bold tracking-tighter"
							>
								<span className="text-[#232323]">外网真实评论</span>
								<div className="absolute -left-2 -bottom-1 w-16 h-[3px] bg-[#ff4040]" style={{ opacity: accentOpacity }} />
							</div>
						</div>

						<div
							style={{
								opacity: subtitleOpacity,
								transform: `translateY(${subtitleY}px)`,
							}}
							className="text-3xl mt-6 font-light text-gray-500 flex items-center"
						>
							<span className="text-xs mr-3 text-gray-400 tracking-wider">by</span>
							<span className="text-gray-600">{author ? `@${author}` : ''}</span>
						</div>

						<div
							className="mt-20"
							style={{
								opacity: interpolate(frame, [15, 35], [0, 1], {
									extrapolateRight: 'clamp',
								}),
								transform: `translateY(${interpolate(frame, [15, 35], [20, 0], {
									extrapolateRight: 'clamp',
								})}px)`,
							}}
						>
							<div className="relative">
								<div className="text-[5.5rem] font-bold leading-[1.1] text-[#ff4040]">{processedTitle}</div>

								{/* Minimal underline */}
								<div
									className="absolute -bottom-4 left-0 h-1 bg-[#ff4040]"
									style={{
										width: '40%',
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
