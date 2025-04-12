import type { WordSentence } from '~/types'

// Define type for processed sentence with duration and additional properties
export interface ProcessedSentence extends Omit<WordSentence, 'wordPronunciationPath' | 'sentencePronunciationPath'> {
	form: number
	durationInFrames: number
	wordPronunciationPublicPath?: string
	sentencePronunciationPublicPath?: string
	wordPronunciationPath?: string
	sentencePronunciationPath?: string
	wordDuration?: number
	sentenceDuration?: number
	word: string
	wordZh: string
	sentence: string
	sentenceZh: string
}

/**
 * Processes word sentences data to calculate durations and frame positions for Remotion rendering
 *
 * @param sentences - The array of word sentences to process
 * @param fps - Frames per second for the video
 * @returns An object containing the processed sentences and the total duration in frames
 */
export function processWordSentences(sentences: WordSentence[], fps: number): { wordSentences: ProcessedSentence[]; totalDurationInFrames: number } {
	const wordSentences: ProcessedSentence[] = []

	// Process each sentence to calculate timing and frames
	sentences.forEach((sentence, index) => {
		// Get actual durations from sentence data or use defaults
		const wordAudioDuration = sentence.wordDuration || 2 // Default 2 seconds if no duration
		const sentenceAudioDuration = sentence.sentenceDuration || 3 // Default 3 seconds if no duration

		// Calculate display times (minimum 1.5 seconds or half of audio duration)
		const wordDisplayDuration = Math.max(1.5, wordAudioDuration / 2)
		const sentenceDisplayDuration = Math.max(1.5, sentenceAudioDuration / 2)

		// Calculate total segment duration in seconds
		const segmentDurationInSeconds = wordDisplayDuration + wordAudioDuration + sentenceDisplayDuration + sentenceAudioDuration

		// Calculate form (starting frame) based on previous segments
		const form = index > 0 ? wordSentences[index - 1].form + wordSentences[index - 1].durationInFrames : 0

		// Convert segment duration to frames
		const durationInFrames = Math.ceil(segmentDurationInSeconds * fps)

		wordSentences.push({
			...sentence,
			form,
			durationInFrames,
		})
	})

	// Calculate total duration by summing all segment durations
	const totalDurationInFrames = wordSentences.reduce((total: number, sentence: ProcessedSentence) => total + sentence.durationInFrames, 0)

	return { wordSentences, totalDurationInFrames }
}

/**
 * Default video configuration for word videos
 */
export const DEFAULT_VIDEO_CONFIG = {
	width: 1920,
	height: 1080,
}
