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
}

// WordDisplay component to show the word with animation
const WordDisplay = ({ sentence }: { sentence: WordSentenceWithPublicPaths }) => {
	const frame = useCurrentFrame()

	// Simple fade-in animation
	const opacity = Math.min(1, frame / 15)
	const scale = 0.9 + Math.min(0.1, frame / 30)

	return (
		<AbsoluteFill className="bg-amber-50 flex items-center justify-center text-gray-800">
			<div
				className="flex flex-col items-center justify-center gap-6 mx-8"
				style={{
					opacity,
					transform: `scale(${scale})`,
					fontFamily: 'Huiwen-mincho, serif',
				}}
			>
				<h1 className="text-8xl font-bold m-0 tracking-tight">{sentence.word}</h1>
				<h2 className="text-4xl m-0 text-gray-500">{sentence.wordZh}</h2>
			</div>
		</AbsoluteFill>
	)
}

// SentenceDisplay component to show the sentence with animation
const SentenceDisplay = ({ sentence }: { sentence: WordSentenceWithPublicPaths }) => {
	const frame = useCurrentFrame()

	// Simple fade-in animation
	const opacity = Math.min(1, frame / 15)
	const translateY = Math.max(0, 10 - frame / 2)

	return (
		<AbsoluteFill className="bg-amber-50 flex items-center justify-center text-gray-800 px-16">
			<div
				className="flex flex-col items-center justify-center gap-8 text-center max-w-5xl"
				style={{
					opacity,
					transform: `translateY(${translateY}px)`,
					fontFamily: 'Huiwen-mincho, serif',
				}}
			>
				<h2 className="text-5xl font-bold m-0 leading-relaxed">{sentence.sentence}</h2>
				<h3 className="text-3xl m-0 text-gray-500 leading-relaxed">{sentence.sentenceZh}</h3>
			</div>
		</AbsoluteFill>
	)
}

export default function Words({ wordSentences, id }: WordsProps) {
	const { fps } = useVideoConfig()

	return (
		<AbsoluteFill className="bg-amber-50">
			{wordSentences.map((sentence, index) => {
				// Calculate time durations based on actual audio durations
				// Get actual durations or default to reasonable values if not available
				const wordAudioDuration = sentence.wordDuration ? Math.round(sentence.wordDuration * fps) : fps * 2
				const sentenceAudioDuration = sentence.sentenceDuration ? Math.round(sentence.sentenceDuration * fps) : fps * 3

				// We'll show the word/sentence for a minimum amount of time before playing audio
				const wordDisplayDuration = Math.max(fps * 1.5, wordAudioDuration / 2)
				const sentenceDisplayDuration = Math.max(fps * 1.5, sentenceAudioDuration / 2)

				// Calculate start frames for each segment
				const startFrame = sentence.form
				const wordAudioStart = startFrame + wordDisplayDuration
				const sentenceDisplayStart = wordAudioStart + wordAudioDuration
				const sentenceAudioStart = sentenceDisplayStart + sentenceDisplayDuration

				const sentenceId = `${sentence.word}-${index}`

				return (
					<React.Fragment key={sentenceId}>
						{/* Word Display Sequence */}
						<Sequence from={startFrame} durationInFrames={wordDisplayDuration} key={`${sentenceId}-word`}>
							<WordDisplay sentence={sentence} />
						</Sequence>

						{/* Word Audio Sequence */}
						{sentence.wordPronunciationPublicPath && (
							<Sequence from={wordAudioStart} durationInFrames={wordAudioDuration} key={`${sentenceId}-word-audio`}>
								<WordDisplay sentence={sentence} />
								<Audio src={staticFile(`${sentence.wordPronunciationPublicPath}`)} />
							</Sequence>
						)}

						{/* Sentence Display Sequence */}
						<Sequence from={sentenceDisplayStart} durationInFrames={sentenceDisplayDuration} key={`${sentenceId}-sentence`}>
							<SentenceDisplay sentence={sentence} />
						</Sequence>

						{/* Sentence Audio Sequence */}
						{sentence.sentencePronunciationPublicPath && (
							<Sequence from={sentenceAudioStart} durationInFrames={sentenceAudioDuration} key={`${sentenceId}-sentence-audio`}>
								<SentenceDisplay sentence={sentence} />
								<Audio src={staticFile(`${sentence.sentencePronunciationPublicPath}`)} />
							</Sequence>
						)}
					</React.Fragment>
				)
			})}
		</AbsoluteFill>
	)
}
