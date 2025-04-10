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
			  "Hello, everybody.",
			  "A photo op with motor racing champions.",
			  "These are nice cars.",
			  "And a handbrake turn from the president,",
			  "turning back from the course he'd set on tariffs just one week ago.",
			  "I thought that people were jumping a little bit out of line.",
			  "They were getting yippy, you know?",
			  "They were getting a little bit yippy, a little bit afraid,",
			  "unlike these champions, because we have a big job to do.",
			  "No other president would have done what I did.",
			  "It had been another day of policy by Truth Social Post,",
			  "Donald Trump announcing a 90-day stay of execution for those countries",
			  "he said hadn't retaliated.",
			  "But raising tariffs again for the one country he said had.",
			  "Based on the lack of respect that China has shown to the world's markets,",
			  "I am hereby raising the tariff charged to China by the United States of America",
			  "to 125 percent, effective immediately.",
			  "At some point, hopefully in the near future,",
			  "China will realize that the days of ripping off the USA",
			  "and other countries is no longer sustainable or acceptable.",
			  "But moments later, clarity from his treasury secretary,",
			  "who claimed this had been the plan all along.",
			  "You might even say that he goaded China into a bad position.",
			  "They responded that they have shown themselves to the world",
			  "to be the bad actors.",
			  "And we are willing to cooperate with our allies",
			  "and with our trading partners who did not retaliate.",
			  "It was a relief to the markets,",
			  "stocks surging to one of their biggest gains since World War Two.",
			  "His Democratic rivals, less impressed.",
			  "PRESIDENT DONALD TRUMP: They keep changing their minds",
			  "about what they're doing, why they're doing it, how they're doing it.",
			  "And the only victim is the American public,",
			  "American consumer, the American citizen, the American business.",
			  "PRESIDENT DONALD TRUMP: The chaos playing out on Capitol Hill.",
			  "Trump's trade representative defending tariffs",
			  "at the very moment the president was rowing back.",
			  "PRESIDENT DONALD TRUMP: So, did you know that the --",
			  "that this was under discussion?",
			  "And why did you not include that as part of your opening remarks?",
			  "DONALD TRUMP: So, typically, what I don't do is divulge",
			  "the contents of my discussions.",
			  "PRESIDENT DONALD TRUMP: What are the details of the pause?",
			  "DONALD TRUMP: Well, my understanding is that,",
			  "because so many countries have decided not to retaliate,",
			  "we're going to have about 90 days.",
			  "PRESIDENT DONALD TRUMP: No, no, excuse me?",
			  "You -- we are -- China increased their tariffs on the United States.",
			  "Trump blinked.",
			  "PRESIDENT DONALD TRUMP: There were questions,",
			  "but no answers from President Trump's own trade advisor.",
			  "PRESIDENT DONALD TRUMP: Sir, you said that tariffs were non-negotiable.",
			  "Why did you say that?",
			  "PRESIDENT DONALD TRUMP: Sir, we got to get to work.",
			  "I apologize.",
			  "PRESIDENT DONALD TRUMP: Did you contribute to the chaos in the market, sir?",
			  "PRESIDENT DONALD TRUMP: Just hours before this climb down,",
			  "the president posted online, "Be cool. Everything's going to work out well.",
			  "The USA will be bigger and better than ever before.",
			  "This is a great time to buy."",
			  "Anyone who did buy stocks and shares right then",
			  "made a lot of money today.",
			  "PRESIDENT DONALD TRUMP: The White House is selling this",
			  "as a stroke of economic genius.",
			  "To many, it's damage limitation.",
			  "But the trade war between the world's two largest economies rages on.",
			  "PRESIDENT DONALD TRUMP: David Blevins, Sky News, in Washington.",
			]
		`)
	})
})
