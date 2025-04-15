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
		const sentences = await splitTextToSentencesWithAI(text, 'openai')
		expect(sentences).toMatchInlineSnapshot(`
			[
			  "In a rare move, Chinese authorities have gestured zero tolerance",
			  "concerning cyberattacks by offering rewards to the public",
			  "for information that could lead to the arrest of a group",
			  "of U.S. government hackers targeting China.",
			  "The Public Security Bureau Harbin in northeast China's Heilongjiang province",
			  "disclosed that Katherine Wilson, Robert Snelling, and Stephen Johnson",
			  "were part of mass cyberattacks, skimmed by an office",
			  "with U.S. National Security Agency, notoriously known as TAO,",
			  "short for Office of Tailored Access Operation.",
			  "China also detected the mastermind behind a 2022 cyberattack",
			  "against a leading Chinese aviation university was TAO.",
			  "Calling those three secret agents, Harbin police said",
			  "the investigation found they repeatedly carried out cyberattacks",
			  "on China's critical information infrastructure and enterprises,",
			  "including tech giant Huawei.",
			  "And the latest was Harbin's Asian Winter Games this February.",
			  "During the Asian Winter Games, the NSA purchased IP addresses",
			  "in different countries and anonymously rented a large number",
			  "of network servers located in Europe, Asia and other countries",
			  "and regions to carry out attacks on relevant systems,",
			  "critical information infrastructure and specific departments.",
			  "This time, we've also found the NSA has conducted zero-day attacks",
			  "through which specific trojans can be implanted",
			  "after attacking the operating system to carry out a latent burial,",
			  "similar to a time bomb that can be awakened at any time",
			  "by sending encrypted byte data.",
			  "Further findings suggest that the attacks against the Asian Winter Games",
			  "be traced to University of California and Virginia Tech.",
			  "Both institutes were founded by the NSA in the realm of cyber warfare,",
			  "and this warfare is now in a smarter trend.",
			  "The U.S. cyberattacks have applied AI technology in their scope.",
			  "Not only the games registration information systems,",
			  "but also a number of infrastructure units in Heilongjiang province",
			  "were targeted.",
			  "The AI agents can copy a large number of digital hackers",
			  "and design combat plans, generate attack tools",
			  "and implement indiscriminate attacks.",
			  "Digital hackers also react much faster than humans.",
			  "This type of attack is unprecedented and poses a huge challenge",
			  "to national security.",
			  "China has expressed serious concerns about cyberattacks it has exposed,",
			  "noting it is one of the main victims of them,",
			  "urging specifically the U.S. to adopt a responsible attitude",
			  "and refrain from slaughtering others.",
			  "Zhou Yaxing, CGTN, Beijing.",
			]
		`)
	})
})
