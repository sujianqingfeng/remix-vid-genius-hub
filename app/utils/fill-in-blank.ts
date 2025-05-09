import path from 'node:path'
import type { FillInBlankSentence } from '~/types'

type BuildFillInBlankRenderDataOptions = {
	sentences: FillInBlankSentence[]
	fps: number
}

export function buildFillInBlankRenderData({ sentences, fps }: BuildFillInBlankRenderDataOptions) {
	const defaultDurationInSeconds = 6 // Default duration if no audio duration available
	const bufferTimeInSeconds = 3 // Increased buffer time between sentences

	const remotionFillInBlankSentences = sentences.map((sentence, index) => {
		// Calculate frames based on actual audio duration or default to 6 seconds
		const durationInSeconds = sentence.audioDuration || defaultDurationInSeconds
		// Add buffer time to ensure audio completes playing with pause
		const sentenceDurationInFrames = Math.ceil((durationInSeconds + bufferTimeInSeconds) * fps)

		// Calculate form position (starting frame) based on previous sentences
		let formPosition = 0
		for (let i = 0; i < index; i++) {
			const prevDuration = sentences[i].audioDuration || defaultDurationInSeconds
			formPosition += Math.ceil((prevDuration + bufferTimeInSeconds) * fps)
		}

		return {
			...sentence,
			publicCoverPath: sentence.coverFilePath ? `/${path.basename(sentence.coverFilePath)}` : undefined,
			publicAudioPath: sentence.audioFilePath ? `/${path.basename(sentence.audioFilePath)}` : undefined,
			durationInFrames: sentenceDurationInFrames,
			form: formPosition,
		}
	})

	// Calculate total duration by adding up all sentence durations
	const totalDurationInFrames = remotionFillInBlankSentences.reduce((total, sentence) => total + sentence.durationInFrames, 0)

	return {
		remotionFillInBlankSentences,
		totalDurationInFrames,
		compositionWidth: 1920,
		compositionHeight: 1080,
		playWidth: 1080,
		playHeight: 720,
	}
}
