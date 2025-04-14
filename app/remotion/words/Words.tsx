import React from 'react'
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { WordSentence } from '~/types'

// Extended WordSentence to include public paths needed for Remotion
interface WordSentenceWithPublicPaths extends WordSentence {
	wordPronunciationPublicPath?: string
	sentencePronunciationPublicPath?: string
	form: number
}

type WordsProps = {
	wordSentences: WordSentenceWithPublicPaths[]
	id: string // Used to access the audio files in public directory
	title?: string // Title for the cover
}

// Helper function to remove ending punctuation
const removePunctuation = (text: string) => {
	return text.replace(/[.!?,;:。！？，；：]+$/, '')
}

// Avatar component that shows in the top-right corner
const Avatar = () => {
	return (
		<div className="absolute top-8 right-8 z-10">
			<img
				src={staticFile('hens-avatar.png')}
				alt="Avatar"
				className="w-20 h-20 rounded-full border-2 border-amber-400 shadow-lg"
				style={{
					objectFit: 'cover',
				}}
			/>
		</div>
	)
}

// Title cover component to show at the beginning of the video
const TitleCover = ({ title }: { title?: string }) => {
	const frame = useCurrentFrame()
	const { fps } = useVideoConfig()

	// Fade in during the first half second
	const fadeInOpacity = Math.min(1, frame / (fps * 0.5))
	// Fade out during the last half second (of 2 seconds)
	const fadeOutOpacity = Math.max(0, 1 - (frame - fps * 1.5) / (fps * 0.5))
	// Combined opacity effect
	const opacity = frame < fps * 1.5 ? fadeInOpacity : fadeOutOpacity

	return (
		<AbsoluteFill className="bg-amber-50 flex items-center justify-center text-gray-800">
			<div
				className="flex flex-col items-center justify-center mx-8 text-center"
				style={{
					opacity,
					fontFamily: 'Huiwen-mincho, serif',
				}}
			>
				<h1 className="text-8xl font-bold m-0 tracking-tight">{title || 'Word Learning Video'}</h1>
			</div>
		</AbsoluteFill>
	)
}

// WordDisplay component to show the word with animation
const WordDisplay = ({ sentence }: { sentence: WordSentenceWithPublicPaths }) => {
	const frame = useCurrentFrame()

	// Smoother fade-in animation that persists
	const opacity = Math.min(1, frame / 10)

	return (
		<AbsoluteFill className="bg-amber-50 flex items-center justify-center text-gray-800">
			<div
				className="flex flex-col items-center justify-center gap-8 mx-8"
				style={{
					opacity,
					fontFamily: 'Huiwen-mincho, serif',
				}}
			>
				<h1 className="text-9xl font-bold m-0 tracking-tight">{sentence.word}</h1>
				<h2 className="text-9xl m-0 text-gray-600">{sentence.wordZh}</h2>
			</div>
		</AbsoluteFill>
	)
}

// SentenceDisplay component to show the sentence with animation
const SentenceDisplay = ({ sentence }: { sentence: WordSentenceWithPublicPaths }) => {
	const frame = useCurrentFrame()

	// Smoother fade-in animation that persists
	const opacity = Math.min(1, frame / 10)

	// Remove punctuation from sentences
	const cleanEnglishSentence = removePunctuation(sentence.sentence)
	const cleanChineseSentence = removePunctuation(sentence.sentenceZh)

	return (
		<AbsoluteFill className="bg-amber-50 flex items-center justify-center text-gray-800 px-16">
			<div
				className="flex flex-col items-center justify-center gap-10 text-center w-full"
				style={{
					opacity,
					fontFamily: 'Huiwen-mincho, serif',
				}}
			>
				<h2 className="text-7xl font-bold m-0 leading-relaxed">{cleanEnglishSentence}</h2>
				<h3 className="text-7xl m-0 text-gray-600 leading-relaxed">{cleanChineseSentence}</h3>
			</div>
		</AbsoluteFill>
	)
}

export default function Words({ wordSentences, id, title }: WordsProps) {
	const { fps } = useVideoConfig()

	// Calculate the title cover duration in frames (2 seconds)
	const titleCoverDurationInFrames = fps * 2

	return (
		<AbsoluteFill className="bg-amber-50">
			{/* Add the avatar that will appear throughout the video */}
			<Avatar />

			{/* Title cover sequence at the beginning */}
			<Sequence from={0} durationInFrames={titleCoverDurationInFrames} key="title-cover">
				<TitleCover title={title} />
			</Sequence>

			{wordSentences.map((sentence, index) => {
				// Calculate time durations based on actual audio durations
				// Get actual durations or default to reasonable values if not available
				const wordAudioDuration = sentence.wordDuration ? Math.round(sentence.wordDuration * fps) : fps * 2
				const sentenceAudioDuration = sentence.sentenceDuration ? Math.round(sentence.sentenceDuration * fps) : fps * 3

				// We'll show the word/sentence for the entire duration to avoid flickering
				const wordDisplayDuration = wordAudioDuration + Math.round(fps * 1)
				const sentenceDisplayDuration = sentenceAudioDuration + Math.round(fps * 1)

				// Calculate start frames for each segment
				// Adjust all start frames by adding the title cover duration
				const startFrame = sentence.form + titleCoverDurationInFrames
				const sentenceDisplayStart = startFrame + wordDisplayDuration

				const sentenceId = `${sentence.word}-${index}`
				return (
					<React.Fragment key={sentenceId}>
						{/* Word Display and Audio combined for smoother experience */}
						<Sequence from={startFrame} durationInFrames={wordDisplayDuration} key={`${sentenceId}-word`}>
							<WordDisplay sentence={sentence} />
							{sentence.wordPronunciationPublicPath && <Audio src={staticFile(`${sentence.wordPronunciationPublicPath}`)} />}
						</Sequence>

						{/* Sentence Display and Audio combined for smoother experience */}
						<Sequence from={sentenceDisplayStart} durationInFrames={sentenceDisplayDuration} key={`${sentenceId}-sentence`}>
							<SentenceDisplay sentence={sentence} />
							{sentence.sentencePronunciationPublicPath && <Audio src={staticFile(`${sentence.sentencePronunciationPublicPath}`)} />}
						</Sequence>
					</React.Fragment>
				)
			})}
		</AbsoluteFill>
	)
}
