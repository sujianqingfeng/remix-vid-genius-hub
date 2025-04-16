import { describe, expect, test } from 'vitest'
import { gemini } from '../index'

describe('gemini', () => {
	test('hello', async () => {
		const result = await gemini.generateText({
			prompt: 'hello',
			system: 'you are a helpful assistant',
		})
		expect(result).toMatchInlineSnapshot(`
			"Hello! How can I help you today?
			"
		`)
	})
})
