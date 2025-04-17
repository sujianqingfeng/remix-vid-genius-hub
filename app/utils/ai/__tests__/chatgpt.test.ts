import { describe, expect, test } from 'vitest'
import { chatGPT } from '../index'

describe('chatGPT', () => {
	test('hello', async () => {
		const result = await chatGPT.generateText({
			prompt: 'hello',
			system: 'you are a helpful assistant',
			model: 'gpt-4.1',
		})
		expect(result).toMatchInlineSnapshot(`"Hello! How can I help you today?"`)
	})
})
