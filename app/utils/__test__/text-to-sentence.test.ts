import fsp from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { splitTextToSentencesWithAI } from '../align'

const getWords = async () => {
	const currentDir = import.meta.dirname
	const p = path.join(currentDir, './test.json')
	const result = await fsp.readFile(p, 'utf-8')
	const data = JSON.parse(result)

	const words = data.transcription.map((item: any) => ({
		word: item.text,
		start: item.offsets.from / 1000,
		end: item.offsets.to / 1000,
	}))

	const text = words.reduce((acc: string, item: any) => {
		return acc + item.word
	}, '')

	return { words, text }
}

describe('text-to-sentence', () => {
	test('splitTextToSentencesWithAI', { timeout: 1000 * 60 * 10 }, async () => {
		const { text } = await getWords()
		const sentences = await splitTextToSentencesWithAI(text)
		expect(sentences).toMatchInlineSnapshot()
	})
})
