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
			<AbsoluteFill className="bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
				{/* Fixed background pattern for better performance */}
				<div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />

				{/* Static decorative elements */}
				<div className="absolute -right-32 top-0 w-96 h-96 rounded-full bg-gradient-to-br from-red-400/10 to-orange-400/10 blur-2xl" style={{ opacity: bgOpacity }} />
				<div className="absolute -left-32 bottom-0 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-400/10 to-indigo-400/10 blur-2xl" style={{ opacity: bgOpacity }} />

				<div className="w-full h-full flex flex-col justify-center items-center p-12">
					<div className="relative w-full max-w-5xl flex flex-col items-center">
						{/* Simplified header with minimal animations */}
						<div style={{ opacity: textOpacity }} className="mb-8 flex flex-col items-center">
							<div className="text-gray-500 text-md tracking-widest uppercase font-medium mb-1">{author ? `@${author}` : ''}</div>
							<div className="text-4xl font-bold tracking-tight text-gray-800">
								<span className="inline-flex items-center">
									<span className="h-6 w-1 bg-red-500 rounded-full mr-4" />
									外网真实评论
									<span className="h-6 w-1 bg-red-500 rounded-full ml-4" />
								</span>
							</div>
						</div>

						{/* Streamlined title container */}
						<div
							className="mt-5 text-center relative px-6 py-8 rounded-xl bg-white/30"
							style={{
								opacity: textOpacity,
								transform: `translateY(${titleY}px)`,
								boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
							}}
						>
							{/* Minimal decorative elements */}
							<div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-500/70" style={{ opacity: authorOpacity }} />
							<div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-500/70" style={{ opacity: authorOpacity }} />

							{/* Simplified title typography */}
							<div className="text-[5rem] font-bold leading-[1.1] text-gray-900 tracking-tight">{processedTitle}</div>

							{/* Simple accent line */}
							<div
								className="h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mt-6 rounded-full"
								style={{
									width: '100px',
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
