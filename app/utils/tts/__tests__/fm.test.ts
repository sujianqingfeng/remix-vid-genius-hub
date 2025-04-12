import fs from 'node:fs'
import path from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'
import { generateSpeech } from '../fm'
import type { TTSInput } from '../types'

describe('FM Text-to-Speech Service', () => {
	const testOutputDir = path.resolve(process.cwd(), 'app/utils/tts/__tests__/tmp')
	const testOutputFile = path.join(testOutputDir, 'test-tts-output.mp3')

	// Create the output directory if it doesn't exist
	if (!fs.existsSync(testOutputDir)) {
		fs.mkdirSync(testOutputDir, { recursive: true })
	}

	// Clean up test files after tests
	afterAll(() => {
		if (fs.existsSync(testOutputFile)) {
			fs.unlinkSync(testOutputFile)
		}

		// Clean up the directory if it's empty
		const files = fs.readdirSync(testOutputDir)
		if (files.length === 0) {
			fs.rmdirSync(testOutputDir)
		}
	})

	test('should generate speech file with default voice', async () => {
		const input: TTSInput = {
			text: 'This is a test of the text to speech system.',
			outputPath: testOutputFile,
		}

		const result = await generateSpeech(input)

		expect(fs.existsSync(result.audioFilePath)).toBe(true)
		expect(fs.statSync(result.audioFilePath).size).toBeGreaterThan(0)
	}, 10000) // Increase timeout for network request

	test('should generate speech file with specified voice', async () => {
		const input: TTSInput = {
			text: 'This is a test with a different voice.',
			outputPath: testOutputFile,
			voice: 'nova',
		}

		const result = await generateSpeech(input)

		expect(fs.existsSync(result.audioFilePath)).toBe(true)
		expect(fs.statSync(result.audioFilePath).size).toBeGreaterThan(0)
	}, 10000) // Increase timeout for network request

	test('should generate speech file with instructions', async () => {
		const input: TTSInput = {
			text: 'This is a test with instructions for the voice.',
			outputPath: testOutputFile,
			voice: 'alloy',
			instructions: 'Speak in a cheerful and upbeat tone.',
		}

		const result = await generateSpeech(input)

		expect(fs.existsSync(result.audioFilePath)).toBe(true)
		expect(fs.statSync(result.audioFilePath).size).toBeGreaterThan(0)
	}, 10000) // Increase timeout for network request
})
