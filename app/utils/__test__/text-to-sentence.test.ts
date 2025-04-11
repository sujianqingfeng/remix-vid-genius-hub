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
		expect(sentences).toMatchInlineSnapshot(`
			[
			  "President Donald Trump is putting a 90-day pause on tariffs for more than 75 countries.",
			  "Since then, stocks have soared after weeks of chaos in the market.",
			  "The U.S. and China are still trading tariff hikes.",
			  "Alice Barr shares the latest on this growing trade war.",
			  "In Commerce City last night, around 6 p.m., Commerce City police say a crash involving multiple cars shut down part of I-270.",
			  "The highway is back open right now.",
			  "According to police, one person died and three other people were hurt.",
			  "One of them seriously.",
			  "The wife of a man charged with murder and the death of a dog breeder in Clear Creek County is in custody this afternoon.",
			  "The sheriff's office says 36-year-old Anna Ferrer was booked into jail Friday after she was extradited from Nebraska.",
			  "Right now, she's being held on suspicion of accessory to a crime and tampering with physical evidence.",
			  "Her husband, Sergio Ferrer, is accused of shooting and killing Paul Peavy.",
			  "Peavy bred and sold Doberman puppies.",
			  "Several of those puppies are still missing today.",
			  "New data is showing that more students in Colorado are choosing to use the state's anonymous reporting system.",
			  "Numbers from the state attorney general's office show students have submitted more than 23,000 safe-to-tell reports so far this school year.",
			  "That's a 15% jump from this time last year.",
			  "The bulk of this month's reports focused on school safety, bullying, and mental health concerns.",
			  "All three of those categories made up more than 70% of all submissions.",
			  "Students can use the system anytime through the Safe-to-Tell website, mobile app, or hotline.",
			]
		`)
	})
})
