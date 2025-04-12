import fs from 'node:fs'
import path from 'node:path'
import { request } from 'undici'
import type { TTSInput, TTSOutput } from './types'

/**
 * Generate speech using ttsapi.site service
 * @param input TTSInput object containing text, outputPath, and optional voice and instructions
 * @returns Promise with TTSOutput object containing path to the generated audio file
 */
export async function generateSpeech(input: TTSInput): Promise<TTSOutput> {
	const { text, voice = 'alloy', instructions } = input
	const format = 'mp3'

	try {
		const requestBody: Record<string, any> = {
			input: text,
			voice,
			response_format: format,
		}

		// Add instructions if provided
		if (instructions) {
			requestBody.instructions = instructions
		}

		const { statusCode, body } = await request('https://ttsapi.site/v1/audio/speech', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		})

		if (statusCode !== 200) {
			const errorText = await body.text()
			throw new Error(`TTS API error: ${statusCode} - ${errorText}`)
		}

		// Create directory for audio files if it doesn't exist
		const outputDir = path.dirname(input.outputPath)
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true })
		}

		// Write the audio buffer to file
		const arrayBuffer = await body.arrayBuffer()
		fs.writeFileSync(input.outputPath, Buffer.from(arrayBuffer))

		return {
			audioFilePath: input.outputPath,
		}
	} catch (error) {
		console.error('Error generating speech:', error)
		throw error
	}
}
