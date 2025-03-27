import { readFile } from 'node:fs/promises'
import { FormData, fetch } from 'undici'

interface TranscriptionOptions {
	model?: string
	prompt?: string
	responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
	temperature?: number
	language?: string
}

interface TranscriptionResponse {
	text: string
}

/**
 * Transcribes audio file to text using ChatAnywhere API
 * @param apiKey ChatAnywhere API key
 * @param audioFilePath Path to the audio file (mp3, mp4, mpeg, mpga, m4a, wav, webm)
 * @param options Optional parameters for transcription
 * @returns The transcribed text
 */
export async function transcribeAudio(apiKey: string, audioFilePath: string, options: TranscriptionOptions = {}): Promise<string> {
	if (!apiKey) {
		throw new Error('API key is required')
	}

	if (!audioFilePath) {
		throw new Error('Audio file path is required')
	}

	const formData = new FormData()

	// Read the audio file content
	const fileBuffer = await readFile(audioFilePath)
	const fileName = audioFilePath.split('/').pop() || 'audio.mp3'

	// Create a Blob from the file buffer
	const fileBlob = new Blob([fileBuffer], { type: 'audio/mpeg' })

	// Add the audio file to the form
	formData.append('file', fileBlob, fileName)

	// Add required model parameter, default to whisper-1
	formData.append('model', options.model || 'gpt-4o-mini-transcribe')

	// Add optional parameters if specified
	if (options.prompt) formData.append('prompt', options.prompt)
	if (options.responseFormat) formData.append('response_format', options.responseFormat)
	if (options.temperature !== undefined) formData.append('temperature', options.temperature.toString())
	if (options.language) formData.append('language', options.language)

	try {
		const response = await fetch('https://api.chatanywhere.tech/v1/audio/transcriptions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			body: formData,
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(`Transcription failed: ${errorData.error?.message || response.statusText}`)
		}

		const data = (await response.json()) as TranscriptionResponse
		return data.text
	} catch (error) {
		if (error instanceof Error) {
			throw error
		}
		throw new Error(`Transcription failed: ${String(error)}`)
	}
}
