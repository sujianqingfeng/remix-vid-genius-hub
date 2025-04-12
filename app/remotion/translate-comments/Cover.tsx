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
		const textOpacity = interpolate(frame, [0, 15], [0, 1], {
			extrapolateRight: 'clamp',
		})

		const titleY = interpolate(frame, [15, 35], [20, 0], {
			extrapolateRight: 'clamp',
		})

		const authorOpacity = interpolate(frame, [20, 35], [0, 1], {
			extrapolateRight: 'clamp',
		})

		const accentScale = spring({
			frame: frame - 25,
			from: 0,
			to: 1,
			fps,
			config: {
				damping: 200,
				stiffness: 150,
				mass: 0.5,
			},
		})

		return (
			<AbsoluteFill className="bg-gradient-to-br from-white to-gray-50 overflow-hidden">
				{/* Minimal background pattern */}
				<div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:24px_24px]" />

				<div className="w-full h-full flex flex-col justify-center items-center p-20">
					<div className="w-full max-w-4xl flex flex-col items-center">
						{/* Header */}
						<div style={{ opacity: textOpacity }} className="mb-6 flex flex-col items-center">
							<div className="text-gray-400 text-sm tracking-widest uppercase font-medium mb-2">{author ? `@${author}` : ''}</div>
							<div className="text-3xl font-bold tracking-tight text-gray-800">外网真实评论</div>
							<div
								className="h-[2px] bg-[#ff4040] mt-3"
								style={{
									width: '40px',
									transform: `scaleX(${accentScale})`,
								}}
							/>
						</div>

						{/* Main Title */}
						<div
							className="mt-10 text-center"
							style={{
								opacity: textOpacity,
								transform: `translateY(${titleY}px)`,
							}}
						>
							<div className="text-[5rem] font-bold leading-[1.1] text-gray-900">{processedTitle}</div>

							{/* Accent line under title */}
							<div
								className="h-1 bg-[#ff4040] mx-auto mt-8"
								style={{
									width: '80px',
									opacity: authorOpacity,
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
