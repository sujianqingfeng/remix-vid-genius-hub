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
	const { fps } = useVideoConfig()
	const frame = useCurrentFrame()

	// Calculate question and answer durations based on sentence duration
	const QUESTION_DURATION_RATIO = 0.5 // Use 50% of total time for question

	// Find which sentence we're currently on based on frame
	const getCurrentSentenceIndex = () => {
		let accumulatedFrames = 0
		for (let i = 0; i < sentences.length; i++) {
			accumulatedFrames += sentences[i].durationInFrames
			if (frame < accumulatedFrames) return i
		}
		return sentences.length - 1 // Default to last sentence if beyond all
	}

	const currentIndex = getCurrentSentenceIndex()
	const currentSentence = sentences[currentIndex]

	if (!currentSentence) return null

	// Calculate start frame for current sentence
	const getStartFrame = (index: number) => {
		let startFrame = 0
		for (let i = 0; i < index; i++) {
			startFrame += sentences[i].durationInFrames
		}
		return startFrame
	}

	const startFrame = getStartFrame(currentIndex)
	const currentSequenceFrame = frame - startFrame

	// Calculate question/answer durations
	const totalDuration = currentSentence.durationInFrames
	const QUESTION_DURATION = Math.floor(totalDuration * QUESTION_DURATION_RATIO)
	const ANSWER_DURATION = totalDuration - QUESTION_DURATION

	const renderEnglishSentence = (sentence: string, word: string, pronunciation: string, showAnswer: boolean) => {
		// Make the search case-insensitive by using regular expression
		const regex = new RegExp(`(${word})`, 'i')
		const parts = sentence.split(regex)

		// Safely handle the case where the word is not found in the sentence
		if (parts.length < 2) {
			// Fallback if word not found in sentence
			return (
				<div className="text-8xl text-center font-bold leading-tight tracking-wide text-stone-700" style={fontStyle}>
					<div className="drop-shadow-sm">{sentence}</div>
				</div>
			)
		}

		// Get the actual matching word from the sentence to preserve its case
		const matchedWord = sentence.match(regex)?.[0] || word

		// Remove punctuation from the end of the third part (when using regex split, matched content is in parts[1])
		const lastPart = parts[2]?.replace(/[.!?;:,]$/, '') || ''

		// Animation for the answer reveal
		const opacity = showAnswer
			? spring({
					frame: frame - startFrame - QUESTION_DURATION,
					fps,
					config: { damping: 12 },
				})
			: 0

		// Calculate countdown based on percentage of question time remaining
		const countdownProgress = (QUESTION_DURATION - (currentSequenceFrame % totalDuration)) / QUESTION_DURATION
		const countdownValue = Math.max(1, Math.ceil(3 * countdownProgress)) // 3 second countdown

		return (
			<div className="text-8xl text-center font-bold leading-tight tracking-wide text-stone-700" style={fontStyle}>
				<div className="drop-shadow-sm">
					{parts[0]}
					<div className="relative inline-flex flex-col items-center px-2 mx-1">
						<div className="relative">
							<span className="invisible">{matchedWord}</span>
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
										{matchedWord}
									</span>
								) : (
									<div className="flex flex-col items-center">
										<span
											className="text-blue-700 font-black text-9xl"
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
								className="text-stone-500 text-4xl font-medium"
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
					{lastPart}
				</div>
			</div>
		)
	}

	const renderChineseSentence = (sentence: string, word: string) => {
		// Make the search case-insensitive by using regular expression
		const regex = new RegExp(`(${word})`, 'i')
		const parts = sentence.split(regex)

		// Safely handle the case where the word is not found in the sentence
		if (parts.length < 2) {
			return (
				<div
					className="text-7xl text-center font-medium tracking-wider text-stone-600"
					style={{
						opacity: spring({
							frame: frame - startFrame,
							fps,
							config: { damping: 12 },
						}),
						fontFamily: "'Huiwen-mincho', serif",
					}}
				>
					{sentence}
				</div>
			)
		}

		// Get the actual matching word from the sentence to preserve its case
		const matchedWord = sentence.match(regex)?.[0] || word

		// Remove punctuation from the end of the third part
		const lastPart = parts[2]?.replace(/[。！？；：，]$/, '') || ''

		const opacity = spring({
			frame: frame - startFrame,
			fps,
			config: { damping: 12 },
		})

		return (
			<div
				className="text-7xl text-center font-medium tracking-wider text-stone-600"
				style={{
					opacity,
					fontFamily: "'Huiwen-mincho', serif",
				}}
			>
				{parts[0]}
				<span className="text-red-700 font-bold px-1">{matchedWord}</span>
				{lastPart}
			</div>
		)
	}

	return (
		<AbsoluteFill className="bg-amber-50" style={fontStyle}>
			<Sequence from={startFrame} durationInFrames={currentSentence.durationInFrames}>
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
						{renderChineseSentence(currentSentence.sentenceZh, currentSentence.wordInSentenceZh)}
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
