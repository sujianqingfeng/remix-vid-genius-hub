import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { RemotionFillInBlankSentence } from '~/types'

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
			<div className="text-7xl text-center font-bold leading-tight tracking-wide text-gray-100">
				<div className="drop-shadow-md">
					{parts[0]}
					<div className="relative inline-flex flex-col items-center px-2 mx-1">
						<div className="relative">
							<span className="invisible">{word}</span>
							<div className="absolute inset-0 flex items-center justify-center">
								{showAnswer ? (
									<span
										className="text-amber-300 font-black"
										style={{
											opacity,
											transform: `scale(${interpolate(opacity, [0, 1], [0.8, 1])})`,
											textShadow: '0 0 10px rgba(250, 204, 21, 0.4)',
										}}
									>
										{word}
									</span>
								) : (
									<div className="flex flex-col items-center">
										<span
											className="text-blue-400 font-black text-8xl"
											style={{
												transform: `scale(${1 + Math.sin(frame * 0.1) * 0.05})`,
												textShadow: '0 0 10px rgba(96, 165, 250, 0.4)',
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
								className="text-teal-300 text-3xl font-medium"
								style={{
									opacity: showAnswer ? opacity : 0,
									transform: `translateY(${showAnswer ? 0 : 10}px)`,
									textShadow: '0 0 8px rgba(103, 232, 249, 0.4)',
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
				className="text-5xl text-center font-medium tracking-wider text-gray-300"
				style={{
					opacity,
					textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
				}}
			>
				{parts[0]}
				<span className="text-rose-300 font-bold px-1">{word}</span>
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
		<AbsoluteFill className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
			{/* Dynamic background elements */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Animated gradient overlay */}
				<div
					className="absolute inset-0 opacity-20"
					style={{
						background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.01) * 30}% ${50 + Math.cos(frame * 0.01) * 30}%, rgba(79, 70, 229, 0.4) 0%, rgba(109, 40, 217, 0.3) 45%, rgba(91, 33, 182, 0) 70%)`,
					}}
				/>

				{/* Floating particles */}
				<div
					className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"
					style={{
						transform: `translate(${Math.sin(frame * 0.01) * 20}px, ${Math.cos(frame * 0.01) * 20}px)`,
						opacity: 0.15 + Math.sin(frame * 0.02) * 0.05,
					}}
				/>
				<div
					className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
					style={{
						transform: `translate(${Math.cos(frame * 0.01) * 20}px, ${Math.sin(frame * 0.01) * 20}px)`,
						opacity: 0.15 + Math.cos(frame * 0.02) * 0.05,
					}}
				/>
				<div
					className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl"
					style={{
						transform: `translate(${Math.sin(frame * 0.015) * 20}px, ${Math.cos(frame * 0.015) * 20}px)`,
						opacity: 0.15 + Math.sin(frame * 0.015) * 0.05,
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
									className="h-[400px] w-auto object-cover rounded-2xl"
									style={{
										boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 15px rgba(79, 70, 229, 0.3)',
									}}
								/>
								<div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
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
