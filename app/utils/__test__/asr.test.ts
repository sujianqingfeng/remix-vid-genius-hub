import { readFile } from 'node:fs/promises'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { transcribeAudio } from '../asr'

const apiKey = process.env.OPEN_AI_API_KEY

describe('transcribeAudio', () => {
	test(
		'should successfully transcribe audio',
		async () => {
			const audioFilePath = '/Users/hens/code-space/remix-vid-genius-hub/operations/xeg70b0zr7qbohzeg27q2tqd/xeg70b0zr7qbohzeg27q2tqd.wav'

			const result = await transcribeAudio(apiKey, audioFilePath)
			expect(result).toMatchInlineSnapshot()
		},
		{ timeout: 60 * 1000 },
	)
})
