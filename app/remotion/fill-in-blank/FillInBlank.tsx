import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { RemotionFillInBlankSentence } from '~/types'

// Add CSS to load the font
const fontStyle = {
	fontFamily: "'Huiwen-mincho', serif",
}

type FillInBlankProps = {
	sentences: RemotionFillInBlankSentence[]
}

export default function FillInBlank({ sentences }: FillInBlankProps) {
	const { fps, width, height } = useVideoConfig()
	const frame = useCurrentFrame()

	const QUESTION_DURATION = 3 * fps // 3 seconds for question
	const ANSWER_DURATION = 3 * fps // 3 seconds for answer + audio

	const getCurrentSentenceIndex = () => {
		const totalDuration = QUESTION_DURATION + ANSWER_DURATION
		return Math.floor(frame / totalDuration)
	}

	const currentIndex = getCurrentSentenceIndex()
	const currentSentence = sentences[currentIndex]

	const renderEnglishSentence = (sentence: string, word: string, pronunciation: string, showAnswer: boolean) => {
		const parts = sentence.split(word)

		// Animation for the answer reveal
		const opacity = showAnswer
			? spring({
					frame: frame - currentIndex * (QUESTION_DURATION + ANSWER_DURATION) - QUESTION_DURATION,
					fps,
					config: { damping: 12 },
				})
			: 0

		const countdownValue = Math.ceil((QUESTION_DURATION - (frame % (QUESTION_DURATION + ANSWER_DURATION))) / fps)

		return (
			<div className="text-7xl text-center font-bold leading-tight tracking-wide text-stone-700" style={fontStyle}>
				<div className="drop-shadow-sm">
					{parts[0]}
					<div className="relative inline-flex flex-col items-center px-2 mx-1">
						<div className="relative">
							<span className="invisible">{word}</span>
							<div className="absolute inset-0 flex items-center justify-center">
								{showAnswer ? (
									<span
										className="text-red-700 font-black"
										style={{
											opacity,
											transform: `scale(${interpolate(opacity, [0, 1], [0.8, 1])})`,
											textShadow: '0 0 1px rgba(185, 28, 28, 0.4)',
											fontFamily: "'Huiwen-mincho', serif",
										}}
									>
										{word}
									</span>
								) : (
									<div className="flex flex-col items-center">
										<span
											className="text-blue-700 font-black text-8xl"
											style={{
												transform: `scale(${1 + Math.sin(frame * 0.1) * 0.05})`,
												textShadow: '0 0 1px rgba(29, 78, 216, 0.4)',
												fontFamily: "'Huiwen-mincho', serif",
											}}
										>
											{countdownValue}
										</span>
									</div>
								)}
							</div>
						</div>
						<div className="h-12 flex items-center justify-center mt-3">
							<span
								className="text-stone-500 text-3xl font-medium"
								style={{
									opacity: showAnswer ? opacity : 0,
									transform: `translateY(${showAnswer ? 0 : 10}px)`,
									fontFamily: "'Huiwen-mincho', serif",
								}}
							>
								{pronunciation}
							</span>
						</div>
					</div>
					{parts[1]}
				</div>
			</div>
		)
	}

	const renderChineseSentence = (sentence: string, word: string) => {
		const parts = sentence.split(word)

		const opacity = spring({
			frame: frame - currentIndex * (QUESTION_DURATION + ANSWER_DURATION),
			fps,
			config: { damping: 12 },
		})

		return (
			<div
				className="text-5xl text-center font-medium tracking-wider text-stone-600"
				style={{
					opacity,
					fontFamily: "'Huiwen-mincho', serif",
				}}
			>
				{parts[0]}
				<span className="text-red-700 font-bold px-1">{word}</span>
				{parts[1]}
			</div>
		)
	}

	if (!currentSentence) return null

	const startFrame = currentIndex * (QUESTION_DURATION + ANSWER_DURATION)
	const currentSequenceFrame = frame - startFrame

	// Background animation
	const bgOpacity = spring({
		frame: frame - startFrame,
		fps,
		config: { damping: 20 },
	})

	return (
		<AbsoluteFill className="bg-amber-50 overflow-hidden" style={fontStyle}>
			{/* Paper texture background */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Subtle paper texture overlay */}
				<div
					className="absolute inset-0 opacity-100"
					style={{
						background: `
							linear-gradient(to right, rgba(245, 243, 238, 0.9), rgba(252, 249, 241, 0.95), rgba(245, 243, 238, 0.9)),
							url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMSAwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+')
						`,
						backgroundBlendMode: 'overlay',
					}}
				/>

				{/* Yellowed edges */}
				<div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-amber-100/40 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-amber-100/40 to-transparent" />
				<div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-amber-100/40 to-transparent" />
				<div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-amber-100/40 to-transparent" />

				{/* Very subtle page fold */}
				<div
					className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/10 to-transparent"
					style={{
						transform: 'rotate(-5deg) translate(20px, -40px)',
					}}
				/>
			</div>

			<Sequence from={startFrame} durationInFrames={QUESTION_DURATION + ANSWER_DURATION}>
				<div className="w-full h-full flex flex-col items-center justify-center px-12 relative z-10">
					{currentSentence.publicCoverPath && (
						<div
							className="w-full flex justify-center mb-14"
							style={{
								opacity: spring({
									frame: currentSequenceFrame,
									fps,
									config: { mass: 0.8, damping: 12 },
								}),
								transform: `translateY(${interpolate(Math.min(currentSequenceFrame, 25), [0, 25], [30, 0], { extrapolateRight: 'clamp' })}px)`,
							}}
						>
							<div className="relative">
								<Img
									src={staticFile(currentSentence.publicCoverPath)}
									className="h-[400px] w-auto object-cover rounded-lg"
									style={{
										boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 0 15px rgba(180, 83, 9, 0.1)',
									}}
								/>
								<div className="absolute inset-0 rounded-lg ring-1 ring-black/10" />
							</div>
						</div>
					)}

					<div
						className="space-y-16"
						style={{
							opacity: spring({
								frame: currentSequenceFrame,
								fps,
								config: { mass: 0.8, damping: 12 },
							}),
							transform: `translateY(${interpolate(Math.min(currentSequenceFrame, 25), [0, 25], [30, 0], { extrapolateRight: 'clamp' })}px)`,
						}}
					>
						{renderEnglishSentence(currentSentence.sentence, currentSentence.word, currentSentence.wordPronunciation, currentSequenceFrame >= QUESTION_DURATION)}
						{renderChineseSentence(currentSentence.sentenceZh, currentSentence.wordZh)}
					</div>
				</div>
			</Sequence>

			{currentSentence.publicAudioPath && (
				<Sequence from={startFrame + QUESTION_DURATION} durationInFrames={ANSWER_DURATION}>
					<Audio src={staticFile(currentSentence.publicAudioPath)} />
				</Sequence>
			)}
		</AbsoluteFill>
	)
}
