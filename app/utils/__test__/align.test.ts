import fsp from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { alignWordsAndSentences } from '../align'

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

const sentences = [
	'Hello, everybody.',
	'A photo op with motor racing champions.',
	'These are nice cars.',
	'And a handbrake turn from the president,',
	"turning back from the course he'd set on tariffs just one week ago.",
	'I thought that people were jumping a little bit out of line.',
	'They were getting yippy, you know?',
	'They were getting a little bit yippy, a little bit afraid,',
	'unlike these champions, because we have a big job to do.',
	'No other president would have done what I did.',
	'It had been another day of policy by Truth Social Post,',
	'Donald Trump announcing a 90-day stay of execution for those countries',
	"he said hadn't retaliated.",
	'But raising tariffs again for the one country he said had.',
	"Based on the lack of respect that China has shown to the world's markets,",
	'I am hereby raising the tariff charged to China by the United States of America',
	'to 125 percent, effective immediately.',
	'At some point, hopefully in the near future,',
	'China will realize that the days of ripping off the USA',
	'and other countries is no longer sustainable or acceptable.',
	'But moments later, clarity from his treasury secretary,',
	'who claimed this had been the plan all along.',
	'You might even say that he goaded China into a bad position.',
	'They responded that they have shown themselves to the world',
	'to be the bad actors.',
	'And we are willing to cooperate with our allies',
	'and with our trading partners who did not retaliate.',
	'It was a relief to the markets,',
	'stocks surging to one of their biggest gains since World War Two.',
	'His Democratic rivals, less impressed.',
	'PRESIDENT DONALD TRUMP: They keep changing their minds',
	"about what they're doing, why they're doing it, how they're doing it.",
	'And the only victim is the American public,',
	'American consumer, the American citizen, the American business.',
	'PRESIDENT DONALD TRUMP: The chaos playing out on Capitol Hill.',
	"Trump's trade representative defending tariffs",
	'at the very moment the president was rowing back.',
	'PRESIDENT DONALD TRUMP: So, did you know that the --',
	'that this was under discussion?',
	'And why did you not include that as part of your opening remarks?',
	"DONALD TRUMP: So, typically, what I don't do is divulge",
	'the contents of my discussions.',
	'PRESIDENT DONALD TRUMP: What are the details of the pause?',
	'DONALD TRUMP: Well, my understanding is that,',
	'because so many countries have decided not to retaliate,',
	"we're going to have about 90 days.",
	'PRESIDENT DONALD TRUMP: No, no, excuse me?',
	'You -- we are -- China increased their tariffs on the United States.',
	'Trump blinked.',
	'PRESIDENT DONALD TRUMP: There were questions,',
	"but no answers from President Trump's own trade advisor.",
	'PRESIDENT DONALD TRUMP: Sir, you said that tariffs were non-negotiable.',
	'Why did you say that?',
	'PRESIDENT DONALD TRUMP: Sir, we got to get to work.',
	'I apologize.',
	'PRESIDENT DONALD TRUMP: Did you contribute to the chaos in the market, sir?',
	'PRESIDENT DONALD TRUMP: Just hours before this climb down,',
	`the president posted online, "Be cool. Everything's going to work out well.`,
	'The USA will be bigger and better than ever before.',
	`This is a great time to buy."`,
	'Anyone who did buy stocks and shares right then',
	'made a lot of money today.',
	'PRESIDENT DONALD TRUMP: The White House is selling this',
	'as a stroke of economic genius.',
	"To many, it's damage limitation.",
	"But the trade war between the world's two largest economies rages on.",
	'PRESIDENT DONALD TRUMP: David Blevins, Sky News, in Washington.',
]

describe('align', () => {
	test('alignWordsAndSentences', async () => {
		const { words } = await getWords()

		const result = alignWordsAndSentences(words, sentences)

		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "end": 1.48,
			    "start": 0.78,
			    "text": "Hello, everybody.",
			    "words": [
			      {
			        "end": 0.46,
			        "start": 0.78,
			        "word": " Hello",
			      },
			      {
			        "end": 0.81,
			        "start": 0.46,
			        "word": ",",
			      },
			      {
			        "end": 1.48,
			        "start": 0.81,
			        "word": " everybody",
			      },
			    ],
			  },
			  {
			    "end": 4.16,
			    "start": 1.78,
			    "text": "A photo op with motor racing champions.",
			    "words": [
			      {
			        "end": 1.88,
			        "start": 1.78,
			        "word": " A",
			      },
			      {
			        "end": 2.22,
			        "start": 1.88,
			        "word": " photo",
			      },
			      {
			        "end": 2.36,
			        "start": 2.22,
			        "word": " op",
			      },
			      {
			        "end": 2.65,
			        "start": 2.36,
			        "word": " with",
			      },
			      {
			        "end": 3.02,
			        "start": 2.65,
			        "word": " motor",
			      },
			      {
			        "end": 3.46,
			        "start": 3.02,
			        "word": " racing",
			      },
			      {
			        "end": 4.16,
			        "start": 3.46,
			        "word": " champions",
			      },
			    ],
			  },
			  {
			    "end": 5.71,
			    "start": 4.24,
			    "text": "These are nice cars.",
			    "words": [
			      {
			        "end": 4.7,
			        "start": 4.24,
			        "word": " These",
			      },
			      {
			        "end": 4.97,
			        "start": 4.7,
			        "word": " are",
			      },
			      {
			        "end": 5.34,
			        "start": 4.97,
			        "word": " nice",
			      },
			      {
			        "end": 5.71,
			        "start": 5.34,
			        "word": " cars",
			      },
			    ],
			  },
			  {
			    "end": 9.6,
			    "start": 6,
			    "text": "And a handbrake turn from the president,",
			    "words": [
			      {
			        "end": 6.32,
			        "start": 6,
			        "word": " And",
			      },
			      {
			        "end": 6.43,
			        "start": 6.32,
			        "word": " a",
			      },
			      {
			        "end": 6.84,
			        "start": 6.43,
			        "word": " hand",
			      },
			      {
			        "end": 7.16,
			        "start": 6.84,
			        "word": "bra",
			      },
			      {
			        "end": 7.37,
			        "start": 7.16,
			        "word": "ke",
			      },
			      {
			        "end": 7.79,
			        "start": 7.37,
			        "word": " turn",
			      },
			      {
			        "end": 8.21,
			        "start": 7.79,
			        "word": " from",
			      },
			      {
			        "end": 8.53,
			        "start": 8.21,
			        "word": " the",
			      },
			      {
			        "end": 9.6,
			        "start": 8.53,
			        "word": " president",
			      },
			    ],
			  },
			  {
			    "end": 13.48,
			    "start": 9.76,
			    "text": "turning back from the course he'd set on tariffs just one week ago.",
			    "words": [
			      {
			        "end": 10.06,
			        "start": 9.76,
			        "word": " turning",
			      },
			      {
			        "end": 10.28,
			        "start": 10.06,
			        "word": " back",
			      },
			      {
			        "end": 10.42,
			        "start": 10.28,
			        "word": " from",
			      },
			      {
			        "end": 10.59,
			        "start": 10.42,
			        "word": " the",
			      },
			      {
			        "end": 10.82,
			        "start": 10.59,
			        "word": " course",
			      },
			      {
			        "end": 10.92,
			        "start": 10.82,
			        "word": " he",
			      },
			      {
			        "end": 11,
			        "start": 10.92,
			        "word": "'d",
			      },
			      {
			        "end": 11.29,
			        "start": 11,
			        "word": " set",
			      },
			      {
			        "end": 11.4,
			        "start": 11.29,
			        "word": " on",
			      },
			      {
			        "end": 12.47,
			        "start": 11.4,
			        "word": " tariffs",
			      },
			      {
			        "end": 12.72,
			        "start": 12.47,
			        "word": " just",
			      },
			      {
			        "end": 12.95,
			        "start": 12.72,
			        "word": " one",
			      },
			      {
			        "end": 13.25,
			        "start": 12.95,
			        "word": " week",
			      },
			      {
			        "end": 13.48,
			        "start": 13.25,
			        "word": " ago",
			      },
			    ],
			  },
			  {
			    "end": 18.2,
			    "start": 13.72,
			    "text": "I thought that people were jumping a little bit out of line.",
			    "words": [
			      {
			        "end": 14.2,
			        "start": 13.72,
			        "word": " I",
			      },
			      {
			        "end": 14.47,
			        "start": 14.2,
			        "word": " thought",
			      },
			      {
			        "end": 14.84,
			        "start": 14.47,
			        "word": " that",
			      },
			      {
			        "end": 15.4,
			        "start": 14.84,
			        "word": " people",
			      },
			      {
			        "end": 15.77,
			        "start": 15.4,
			        "word": " were",
			      },
			      {
			        "end": 16.45,
			        "start": 15.77,
			        "word": " jumping",
			      },
			      {
			        "end": 16.52,
			        "start": 16.45,
			        "word": " a",
			      },
			      {
			        "end": 17.08,
			        "start": 16.52,
			        "word": " little",
			      },
			      {
			        "end": 17.35,
			        "start": 17.08,
			        "word": " bit",
			      },
			      {
			        "end": 17.64,
			        "start": 17.35,
			        "word": " out",
			      },
			      {
			        "end": 17.83,
			        "start": 17.64,
			        "word": " of",
			      },
			      {
			        "end": 18.2,
			        "start": 17.83,
			        "word": " line",
			      },
			    ],
			  },
			  {
			    "end": 20.41,
			    "start": 18.56,
			    "text": "They were getting yippy, you know?",
			    "words": [
			      {
			        "end": 18.82,
			        "start": 18.56,
			        "word": " They",
			      },
			      {
			        "end": 19.08,
			        "start": 18.82,
			        "word": " were",
			      },
			      {
			        "end": 19.53,
			        "start": 19.08,
			        "word": " getting",
			      },
			      {
			        "end": 19.59,
			        "start": 19.53,
			        "word": " y",
			      },
			      {
			        "end": 19.91,
			        "start": 19.59,
			        "word": "ippy",
			      },
			      {
			        "end": 19.96,
			        "start": 19.91,
			        "word": ",",
			      },
			      {
			        "end": 20.16,
			        "start": 19.96,
			        "word": " you",
			      },
			      {
			        "end": 20.41,
			        "start": 20.16,
			        "word": " know",
			      },
			    ],
			  },
			  {
			    "end": 23.74,
			    "start": 20.64,
			    "text": "They were getting a little bit yippy, a little bit afraid,",
			    "words": [
			      {
			        "end": 20.9,
			        "start": 20.64,
			        "word": " They",
			      },
			      {
			        "end": 21.16,
			        "start": 20.9,
			        "word": " were",
			      },
			      {
			        "end": 21.62,
			        "start": 21.16,
			        "word": " getting",
			      },
			      {
			        "end": 21.79,
			        "start": 21.62,
			        "word": " a",
			      },
			      {
			        "end": 22.07,
			        "start": 21.79,
			        "word": " little",
			      },
			      {
			        "end": 22.26,
			        "start": 22.07,
			        "word": " bit",
			      },
			      {
			        "end": 22.32,
			        "start": 22.26,
			        "word": " y",
			      },
			      {
			        "end": 22.57,
			        "start": 22.32,
			        "word": "ippy",
			      },
			      {
			        "end": 22.71,
			        "start": 22.57,
			        "word": ",",
			      },
			      {
			        "end": 22.77,
			        "start": 22.71,
			        "word": " a",
			      },
			      {
			        "end": 23.23,
			        "start": 22.77,
			        "word": " little",
			      },
			      {
			        "end": 23.35,
			        "start": 23.23,
			        "word": " bit",
			      },
			      {
			        "end": 23.74,
			        "start": 23.35,
			        "word": " afraid",
			      },
			    ],
			  },
			  {
			    "end": 26.9,
			    "start": 23.87,
			    "text": "unlike these champions, because we have a big job to do.",
			    "words": [
			      {
			        "end": 24.25,
			        "start": 23.87,
			        "word": " unlike",
			      },
			      {
			        "end": 24.59,
			        "start": 24.25,
			        "word": " these",
			      },
			      {
			        "end": 25.18,
			        "start": 24.59,
			        "word": " champions",
			      },
			      {
			        "end": 25.32,
			        "start": 25.18,
			        "word": ",",
			      },
			      {
			        "end": 25.88,
			        "start": 25.32,
			        "word": " because",
			      },
			      {
			        "end": 26,
			        "start": 25.88,
			        "word": " we",
			      },
			      {
			        "end": 26.24,
			        "start": 26,
			        "word": " have",
			      },
			      {
			        "end": 26.3,
			        "start": 26.24,
			        "word": " a",
			      },
			      {
			        "end": 26.48,
			        "start": 26.3,
			        "word": " big",
			      },
			      {
			        "end": 26.66,
			        "start": 26.48,
			        "word": " job",
			      },
			      {
			        "end": 26.78,
			        "start": 26.66,
			        "word": " to",
			      },
			      {
			        "end": 26.9,
			        "start": 26.78,
			        "word": " do",
			      },
			    ],
			  },
			  {
			    "end": 29.54,
			    "start": 27.12,
			    "text": "No other president would have done what I did.",
			    "words": [
			      {
			        "end": 27.24,
			        "start": 27.12,
			        "word": " No",
			      },
			      {
			        "end": 27.54,
			        "start": 27.24,
			        "word": " other",
			      },
			      {
			        "end": 28.09,
			        "start": 27.54,
			        "word": " president",
			      },
			      {
			        "end": 28.39,
			        "start": 28.09,
			        "word": " would",
			      },
			      {
			        "end": 28.63,
			        "start": 28.39,
			        "word": " have",
			      },
			      {
			        "end": 28.86,
			        "start": 28.63,
			        "word": " done",
			      },
			      {
			        "end": 29.12,
			        "start": 28.86,
			        "word": " what",
			      },
			      {
			        "end": 29.16,
			        "start": 29.12,
			        "word": " I",
			      },
			      {
			        "end": 29.54,
			        "start": 29.16,
			        "word": " did",
			      },
			    ],
			  },
			  {
			    "end": 32.68,
			    "start": 29.6,
			    "text": "It had been another day of policy by Truth Social Post,",
			    "words": [
			      {
			        "end": 29.74,
			        "start": 29.6,
			        "word": " It",
			      },
			      {
			        "end": 29.95,
			        "start": 29.74,
			        "word": " had",
			      },
			      {
			        "end": 30.23,
			        "start": 29.95,
			        "word": " been",
			      },
			      {
			        "end": 30.73,
			        "start": 30.23,
			        "word": " another",
			      },
			      {
			        "end": 30.93,
			        "start": 30.73,
			        "word": " day",
			      },
			      {
			        "end": 31.07,
			        "start": 30.93,
			        "word": " of",
			      },
			      {
			        "end": 31.51,
			        "start": 31.07,
			        "word": " policy",
			      },
			      {
			        "end": 31.63,
			        "start": 31.51,
			        "word": " by",
			      },
			      {
			        "end": 31.98,
			        "start": 31.63,
			        "word": " Truth",
			      },
			      {
			        "end": 32.42,
			        "start": 31.98,
			        "word": " Social",
			      },
			      {
			        "end": 32.68,
			        "start": 32.42,
			        "word": " Post",
			      },
			    ],
			  },
			  {
			    "end": 38.21,
			    "start": 32.82,
			    "text": "Donald Trump announcing a 90-day stay of execution for those countries",
			    "words": [
			      {
			        "end": 33.24,
			        "start": 32.82,
			        "word": " Donald",
			      },
			      {
			        "end": 33.59,
			        "start": 33.24,
			        "word": " Trump",
			      },
			      {
			        "end": 34.3,
			        "start": 33.59,
			        "word": " announcing",
			      },
			      {
			        "end": 34.37,
			        "start": 34.3,
			        "word": " a",
			      },
			      {
			        "end": 34.79,
			        "start": 34.37,
			        "word": " 90",
			      },
			      {
			        "end": 34.86,
			        "start": 34.79,
			        "word": "-",
			      },
			      {
			        "end": 35.16,
			        "start": 34.86,
			        "word": "day",
			      },
			      {
			        "end": 35.54,
			        "start": 35.16,
			        "word": " stay",
			      },
			      {
			        "end": 35.73,
			        "start": 35.54,
			        "word": " of",
			      },
			      {
			        "end": 36.57,
			        "start": 35.73,
			        "word": " execution",
			      },
			      {
			        "end": 36.87,
			        "start": 36.57,
			        "word": " for",
			      },
			      {
			        "end": 37.35,
			        "start": 36.87,
			        "word": " those",
			      },
			      {
			        "end": 38.21,
			        "start": 37.35,
			        "word": " countries",
			      },
			    ],
			  },
			  {
			    "end": 40.55,
			    "start": 38.21,
			    "text": "he said hadn't retaliated.",
			    "words": [
			      {
			        "end": 38.61,
			        "start": 38.21,
			        "word": " he",
			      },
			      {
			        "end": 38.8,
			        "start": 38.61,
			        "word": " said",
			      },
			      {
			        "end": 39.19,
			        "start": 38.8,
			        "word": " hadn",
			      },
			      {
			        "end": 39.35,
			        "start": 39.19,
			        "word": "'t",
			      },
			      {
			        "end": 39.91,
			        "start": 39.35,
			        "word": " retali",
			      },
			      {
			        "end": 40.55,
			        "start": 39.91,
			        "word": "ated",
			      },
			    ],
			  },
			  {
			    "end": 45.66,
			    "start": 40.64,
			    "text": "But raising tariffs again for the one country he said had.",
			    "words": [
			      {
			        "end": 40.94,
			        "start": 40.64,
			        "word": " But",
			      },
			      {
			        "end": 41.78,
			        "start": 40.94,
			        "word": " raising",
			      },
			      {
			        "end": 42.63,
			        "start": 41.78,
			        "word": " tariffs",
			      },
			      {
			        "end": 42.96,
			        "start": 42.63,
			        "word": " again",
			      },
			      {
			        "end": 43.27,
			        "start": 42.96,
			        "word": " for",
			      },
			      {
			        "end": 43.59,
			        "start": 43.27,
			        "word": " the",
			      },
			      {
			        "end": 43.89,
			        "start": 43.59,
			        "word": " one",
			      },
			      {
			        "end": 44.63,
			        "start": 43.89,
			        "word": " country",
			      },
			      {
			        "end": 44.77,
			        "start": 44.63,
			        "word": " he",
			      },
			      {
			        "end": 45.26,
			        "start": 44.77,
			        "word": " said",
			      },
			      {
			        "end": 45.66,
			        "start": 45.26,
			        "word": " had",
			      },
			    ],
			  },
			  {
			    "end": 49.79,
			    "start": 45.96,
			    "text": "Based on the lack of respect that China has shown to the world's markets,",
			    "words": [
			      {
			        "end": 46.28,
			        "start": 45.96,
			        "word": " Based",
			      },
			      {
			        "end": 46.4,
			        "start": 46.28,
			        "word": " on",
			      },
			      {
			        "end": 46.59,
			        "start": 46.4,
			        "word": " the",
			      },
			      {
			        "end": 46.84,
			        "start": 46.59,
			        "word": " lack",
			      },
			      {
			        "end": 47.11,
			        "start": 46.84,
			        "word": " of",
			      },
			      {
			        "end": 47.4,
			        "start": 47.11,
			        "word": " respect",
			      },
			      {
			        "end": 47.65,
			        "start": 47.4,
			        "word": " that",
			      },
			      {
			        "end": 47.97,
			        "start": 47.65,
			        "word": " China",
			      },
			      {
			        "end": 48.16,
			        "start": 47.97,
			        "word": " has",
			      },
			      {
			        "end": 48.48,
			        "start": 48.16,
			        "word": " shown",
			      },
			      {
			        "end": 48.6,
			        "start": 48.48,
			        "word": " to",
			      },
			      {
			        "end": 48.79,
			        "start": 48.6,
			        "word": " the",
			      },
			      {
			        "end": 49.11,
			        "start": 48.79,
			        "word": " world",
			      },
			      {
			        "end": 49.28,
			        "start": 49.11,
			        "word": "'s",
			      },
			      {
			        "end": 49.79,
			        "start": 49.28,
			        "word": " markets",
			      },
			    ],
			  },
			  {
			    "end": 55.21,
			    "start": 49.83,
			    "text": "I am hereby raising the tariff charged to China by the United States of America",
			    "words": [
			      {
			        "end": 49.85,
			        "start": 49.83,
			        "word": " I",
			      },
			      {
			        "end": 49.97,
			        "start": 49.85,
			        "word": " am",
			      },
			      {
			        "end": 50.22,
			        "start": 49.97,
			        "word": " here",
			      },
			      {
			        "end": 50.46,
			        "start": 50.22,
			        "word": "by",
			      },
			      {
			        "end": 50.94,
			        "start": 50.46,
			        "word": " raising",
			      },
			      {
			        "end": 51.19,
			        "start": 50.94,
			        "word": " the",
			      },
			      {
			        "end": 51.61,
			        "start": 51.19,
			        "word": " tar",
			      },
			      {
			        "end": 51.72,
			        "start": 51.61,
			        "word": "iff",
			      },
			      {
			        "end": 52.33,
			        "start": 51.72,
			        "word": " charged",
			      },
			      {
			        "end": 52.5,
			        "start": 52.33,
			        "word": " to",
			      },
			      {
			        "end": 53.03,
			        "start": 52.5,
			        "word": " China",
			      },
			      {
			        "end": 53.11,
			        "start": 53.03,
			        "word": " by",
			      },
			      {
			        "end": 53.37,
			        "start": 53.11,
			        "word": " the",
			      },
			      {
			        "end": 53.98,
			        "start": 53.37,
			        "word": " United",
			      },
			      {
			        "end": 54.43,
			        "start": 53.98,
			        "word": " States",
			      },
			      {
			        "end": 54.6,
			        "start": 54.43,
			        "word": " of",
			      },
			      {
			        "end": 55.21,
			        "start": 54.6,
			        "word": " America",
			      },
			    ],
			  },
			  {
			    "end": 59.08,
			    "start": 55.21,
			    "text": "to 125 percent, effective immediately.",
			    "words": [
			      {
			        "end": 55.38,
			        "start": 55.21,
			        "word": " to",
			      },
			      {
			        "end": 56.17,
			        "start": 55.38,
			        "word": " 125",
			      },
			      {
			        "end": 56.78,
			        "start": 56.17,
			        "word": " percent",
			      },
			      {
			        "end": 56.95,
			        "start": 56.78,
			        "word": ",",
			      },
			      {
			        "end": 57.84,
			        "start": 56.95,
			        "word": " effective",
			      },
			      {
			        "end": 59.08,
			        "start": 57.84,
			        "word": " immediately",
			      },
			    ],
			  },
			  {
			    "end": 61.7,
			    "start": 59.2,
			    "text": "At some point, hopefully in the near future,",
			    "words": [
			      {
			        "end": 59.33,
			        "start": 59.2,
			        "word": " At",
			      },
			      {
			        "end": 59.57,
			        "start": 59.33,
			        "word": " some",
			      },
			      {
			        "end": 60.03,
			        "start": 59.57,
			        "word": " point",
			      },
			      {
			        "end": 60.04,
			        "start": 60.03,
			        "word": ",",
			      },
			      {
			        "end": 60.61,
			        "start": 60.04,
			        "word": " hopefully",
			      },
			      {
			        "end": 60.74,
			        "start": 60.61,
			        "word": " in",
			      },
			      {
			        "end": 60.98,
			        "start": 60.74,
			        "word": " the",
			      },
			      {
			        "end": 61.22,
			        "start": 60.98,
			        "word": " near",
			      },
			      {
			        "end": 61.7,
			        "start": 61.22,
			        "word": " future",
			      },
			    ],
			  },
			  {
			    "end": 65.3,
			    "start": 61.76,
			    "text": "China will realize that the days of ripping off the USA",
			    "words": [
			      {
			        "end": 62.02,
			        "start": 61.76,
			        "word": " China",
			      },
			      {
			        "end": 62.28,
			        "start": 62.02,
			        "word": " will",
			      },
			      {
			        "end": 62.72,
			        "start": 62.28,
			        "word": " realize",
			      },
			      {
			        "end": 63.02,
			        "start": 62.72,
			        "word": " that",
			      },
			      {
			        "end": 63.23,
			        "start": 63.02,
			        "word": " the",
			      },
			      {
			        "end": 63.44,
			        "start": 63.23,
			        "word": " days",
			      },
			      {
			        "end": 63.57,
			        "start": 63.44,
			        "word": " of",
			      },
			      {
			        "end": 64.08,
			        "start": 63.57,
			        "word": " ripping",
			      },
			      {
			        "end": 64.76,
			        "start": 64.08,
			        "word": " off",
			      },
			      {
			        "end": 65.03,
			        "start": 64.76,
			        "word": " the",
			      },
			      {
			        "end": 65.3,
			        "start": 65.03,
			        "word": " USA",
			      },
			    ],
			  },
			  {
			    "end": 70.1,
			    "start": 65.3,
			    "text": "and other countries is no longer sustainable or acceptable.",
			    "words": [
			      {
			        "end": 65.57,
			        "start": 65.3,
			        "word": " and",
			      },
			      {
			        "end": 66.04,
			        "start": 65.57,
			        "word": " other",
			      },
			      {
			        "end": 66.86,
			        "start": 66.04,
			        "word": " countries",
			      },
			      {
			        "end": 67.04,
			        "start": 66.86,
			        "word": " is",
			      },
			      {
			        "end": 67.21,
			        "start": 67.04,
			        "word": " no",
			      },
			      {
			        "end": 67.77,
			        "start": 67.21,
			        "word": " longer",
			      },
			      {
			        "end": 68.89,
			        "start": 67.77,
			        "word": " sustainable",
			      },
			      {
			        "end": 68.96,
			        "start": 68.89,
			        "word": " or",
			      },
			      {
			        "end": 70.1,
			        "start": 68.96,
			        "word": " acceptable",
			      },
			    ],
			  },
			  {
			    "end": 73.33,
			    "start": 70.24,
			    "text": "But moments later, clarity from his treasury secretary,",
			    "words": [
			      {
			        "end": 70.43,
			        "start": 70.24,
			        "word": " But",
			      },
			      {
			        "end": 70.88,
			        "start": 70.43,
			        "word": " moments",
			      },
			      {
			        "end": 71.2,
			        "start": 70.88,
			        "word": " later",
			      },
			      {
			        "end": 71.33,
			        "start": 71.2,
			        "word": ",",
			      },
			      {
			        "end": 71.78,
			        "start": 71.33,
			        "word": " clarity",
			      },
			      {
			        "end": 72.07,
			        "start": 71.78,
			        "word": " from",
			      },
			      {
			        "end": 72.23,
			        "start": 72.07,
			        "word": " his",
			      },
			      {
			        "end": 72.75,
			        "start": 72.23,
			        "word": " treasury",
			      },
			      {
			        "end": 73.33,
			        "start": 72.75,
			        "word": " secretary",
			      },
			    ],
			  },
			  {
			    "end": 75.8,
			    "start": 73.46,
			    "text": "who claimed this had been the plan all along.",
			    "words": [
			      {
			        "end": 73.78,
			        "start": 73.46,
			        "word": " who",
			      },
			      {
			        "end": 74.1,
			        "start": 73.78,
			        "word": " claimed",
			      },
			      {
			        "end": 74.35,
			        "start": 74.1,
			        "word": " this",
			      },
			      {
			        "end": 74.55,
			        "start": 74.35,
			        "word": " had",
			      },
			      {
			        "end": 74.83,
			        "start": 74.55,
			        "word": " been",
			      },
			      {
			        "end": 75.12,
			        "start": 74.83,
			        "word": " the",
			      },
			      {
			        "end": 75.8,
			        "start": 75.12,
			        "word": " plan",
			      },
			      {
			        "end": 75.8,
			        "start": 75.8,
			        "word": " all",
			      },
			      {
			        "end": 75.8,
			        "start": 75.8,
			        "word": " along",
			      },
			    ],
			  },
			  {
			    "end": 81.88,
			    "start": 75.8,
			    "text": "You might even say that he goaded China into a bad position.",
			    "words": [
			      {
			        "end": 76.12,
			        "start": 75.8,
			        "word": " You",
			      },
			      {
			        "end": 76.88,
			        "start": 76.12,
			        "word": " might",
			      },
			      {
			        "end": 77.09,
			        "start": 76.88,
			        "word": " even",
			      },
			      {
			        "end": 77.41,
			        "start": 77.09,
			        "word": " say",
			      },
			      {
			        "end": 77.85,
			        "start": 77.41,
			        "word": " that",
			      },
			      {
			        "end": 78.05,
			        "start": 77.85,
			        "word": " he",
			      },
			      {
			        "end": 78.26,
			        "start": 78.05,
			        "word": " go",
			      },
			      {
			        "end": 78.72,
			        "start": 78.26,
			        "word": "aded",
			      },
			      {
			        "end": 79.47,
			        "start": 78.72,
			        "word": " China",
			      },
			      {
			        "end": 80.09,
			        "start": 79.47,
			        "word": " into",
			      },
			      {
			        "end": 80.22,
			        "start": 80.09,
			        "word": " a",
			      },
			      {
			        "end": 80.67,
			        "start": 80.22,
			        "word": " bad",
			      },
			      {
			        "end": 81.88,
			        "start": 80.67,
			        "word": " position",
			      },
			    ],
			  },
			  {
			    "end": 85.71,
			    "start": 82.36,
			    "text": "They responded that they have shown themselves to the world",
			    "words": [
			      {
			        "end": 82.63,
			        "start": 82.36,
			        "word": " They",
			      },
			      {
			        "end": 83.24,
			        "start": 82.63,
			        "word": " responded",
			      },
			      {
			        "end": 83.51,
			        "start": 83.24,
			        "word": " that",
			      },
			      {
			        "end": 83.78,
			        "start": 83.51,
			        "word": " they",
			      },
			      {
			        "end": 84.05,
			        "start": 83.78,
			        "word": " have",
			      },
			      {
			        "end": 84.38,
			        "start": 84.05,
			        "word": " shown",
			      },
			      {
			        "end": 85.05,
			        "start": 84.38,
			        "word": " themselves",
			      },
			      {
			        "end": 85.18,
			        "start": 85.05,
			        "word": " to",
			      },
			      {
			        "end": 85.4,
			        "start": 85.18,
			        "word": " the",
			      },
			      {
			        "end": 85.71,
			        "start": 85.4,
			        "word": " world",
			      },
			    ],
			  },
			  {
			    "end": 86.84,
			    "start": 85.71,
			    "text": "to be the bad actors.",
			    "words": [
			      {
			        "end": 85.84,
			        "start": 85.71,
			        "word": " to",
			      },
			      {
			        "end": 85.97,
			        "start": 85.84,
			        "word": " be",
			      },
			      {
			        "end": 86.17,
			        "start": 85.97,
			        "word": " the",
			      },
			      {
			        "end": 86.37,
			        "start": 86.17,
			        "word": " bad",
			      },
			      {
			        "end": 86.84,
			        "start": 86.37,
			        "word": " actors",
			      },
			    ],
			  },
			  {
			    "end": 91.36,
			    "start": 86.84,
			    "text": "And we are willing to cooperate with our allies",
			    "words": [
			      {
			        "end": 87.18,
			        "start": 86.84,
			        "word": " And",
			      },
			      {
			        "end": 87.41,
			        "start": 87.18,
			        "word": " we",
			      },
			      {
			        "end": 87.75,
			        "start": 87.41,
			        "word": " are",
			      },
			      {
			        "end": 88.56,
			        "start": 87.75,
			        "word": " willing",
			      },
			      {
			        "end": 88.79,
			        "start": 88.56,
			        "word": " to",
			      },
			      {
			        "end": 89.83,
			        "start": 88.79,
			        "word": " cooperate",
			      },
			      {
			        "end": 90.29,
			        "start": 89.83,
			        "word": " with",
			      },
			      {
			        "end": 90.63,
			        "start": 90.29,
			        "word": " our",
			      },
			      {
			        "end": 91.36,
			        "start": 90.63,
			        "word": " allies",
			      },
			    ],
			  },
			  {
			    "end": 95.1,
			    "start": 91.36,
			    "text": "and with our trading partners who did not retaliate.",
			    "words": [
			      {
			        "end": 91.53,
			        "start": 91.36,
			        "word": " and",
			      },
			      {
			        "end": 91.76,
			        "start": 91.53,
			        "word": " with",
			      },
			      {
			        "end": 91.93,
			        "start": 91.76,
			        "word": " our",
			      },
			      {
			        "end": 92.36,
			        "start": 91.93,
			        "word": " trading",
			      },
			      {
			        "end": 93.36,
			        "start": 92.36,
			        "word": " partners",
			      },
			      {
			        "end": 94.16,
			        "start": 93.36,
			        "word": " who",
			      },
			      {
			        "end": 94.26,
			        "start": 94.16,
			        "word": " did",
			      },
			      {
			        "end": 94.36,
			        "start": 94.26,
			        "word": " not",
			      },
			      {
			        "end": 94.86,
			        "start": 94.36,
			        "word": " retali",
			      },
			      {
			        "end": 95.1,
			        "start": 94.86,
			        "word": "ate",
			      },
			    ],
			  },
			  {
			    "end": 99.31,
			    "start": 95.36,
			    "text": "It was a relief to the markets,",
			    "words": [
			      {
			        "end": 95.69,
			        "start": 95.36,
			        "word": " It",
			      },
			      {
			        "end": 96.18,
			        "start": 95.69,
			        "word": " was",
			      },
			      {
			        "end": 96.34,
			        "start": 96.18,
			        "word": " a",
			      },
			      {
			        "end": 97.33,
			        "start": 96.34,
			        "word": " relief",
			      },
			      {
			        "end": 97.66,
			        "start": 97.33,
			        "word": " to",
			      },
			      {
			        "end": 98.15,
			        "start": 97.66,
			        "word": " the",
			      },
			      {
			        "end": 99.31,
			        "start": 98.15,
			        "word": " markets",
			      },
			    ],
			  },
			  {
			    "end": 107,
			    "start": 99.64,
			    "text": "stocks surging to one of their biggest gains since World War Two.",
			    "words": [
			      {
			        "end": 100.63,
			        "start": 99.64,
			        "word": " stocks",
			      },
			      {
			        "end": 101.12,
			        "start": 100.63,
			        "word": " sur",
			      },
			      {
			        "end": 101.8,
			        "start": 101.12,
			        "word": "ging",
			      },
			      {
			        "end": 102.11,
			        "start": 101.8,
			        "word": " to",
			      },
			      {
			        "end": 102.6,
			        "start": 102.11,
			        "word": " one",
			      },
			      {
			        "end": 102.93,
			        "start": 102.6,
			        "word": " of",
			      },
			      {
			        "end": 103.76,
			        "start": 102.93,
			        "word": " their",
			      },
			      {
			        "end": 104.98,
			        "start": 103.76,
			        "word": " biggest",
			      },
			      {
			        "end": 105.86,
			        "start": 104.98,
			        "word": " gains",
			      },
			      {
			        "end": 106.12,
			        "start": 105.86,
			        "word": " since",
			      },
			      {
			        "end": 106.48,
			        "start": 106.12,
			        "word": " World",
			      },
			      {
			        "end": 106.76,
			        "start": 106.48,
			        "word": " War",
			      },
			      {
			        "end": 107,
			        "start": 106.76,
			        "word": " Two",
			      },
			    ],
			  },
			  {
			    "end": 109.97,
			    "start": 107.28,
			    "text": "His Democratic rivals, less impressed.",
			    "words": [
			      {
			        "end": 107.85,
			        "start": 107.28,
			        "word": " His",
			      },
			      {
			        "end": 108.34,
			        "start": 107.85,
			        "word": " Democratic",
			      },
			      {
			        "end": 108.79,
			        "start": 108.34,
			        "word": " rivals",
			      },
			      {
			        "end": 108.94,
			        "start": 108.79,
			        "word": ",",
			      },
			      {
			        "end": 109.53,
			        "start": 108.94,
			        "word": " less",
			      },
			      {
			        "end": 109.97,
			        "start": 109.53,
			        "word": " impressed",
			      },
			    ],
			  },
			  {
			    "end": 112.41,
			    "start": 110.24,
			    "text": "PRESIDENT DONALD TRUMP: They keep changing their minds",
			    "words": [
			      {
			        "end": 111.19,
			        "start": 110.24,
			        "word": " PRESID",
			      },
			      {
			        "end": 111.24,
			        "start": 111.19,
			        "word": "ENT",
			      },
			      {
			        "end": 111.33,
			        "start": 111.24,
			        "word": " DON",
			      },
			      {
			        "end": 111.42,
			        "start": 111.33,
			        "word": "ALD",
			      },
			      {
			        "end": 111.51,
			        "start": 111.42,
			        "word": " TR",
			      },
			      {
			        "end": 111.52,
			        "start": 111.51,
			        "word": "U",
			      },
			      {
			        "end": 111.57,
			        "start": 111.52,
			        "word": "MP",
			      },
			      {
			        "end": 111.6,
			        "start": 111.57,
			        "word": ":",
			      },
			      {
			        "end": 111.72,
			        "start": 111.6,
			        "word": " They",
			      },
			      {
			        "end": 111.84,
			        "start": 111.72,
			        "word": " keep",
			      },
			      {
			        "end": 112.08,
			        "start": 111.84,
			        "word": " changing",
			      },
			      {
			        "end": 112.23,
			        "start": 112.08,
			        "word": " their",
			      },
			      {
			        "end": 112.41,
			        "start": 112.23,
			        "word": " minds",
			      },
			    ],
			  },
			  {
			    "end": 115.36,
			    "start": 112.41,
			    "text": "about what they're doing, why they're doing it, how they're doing it.",
			    "words": [
			      {
			        "end": 112.64,
			        "start": 112.41,
			        "word": " about",
			      },
			      {
			        "end": 112.8,
			        "start": 112.64,
			        "word": " what",
			      },
			      {
			        "end": 112.96,
			        "start": 112.8,
			        "word": " they",
			      },
			      {
			        "end": 113.11,
			        "start": 112.96,
			        "word": "'re",
			      },
			      {
			        "end": 113.27,
			        "start": 113.11,
			        "word": " doing",
			      },
			      {
			        "end": 113.36,
			        "start": 113.27,
			        "word": ",",
			      },
			      {
			        "end": 113.52,
			        "start": 113.36,
			        "word": " why",
			      },
			      {
			        "end": 113.65,
			        "start": 113.52,
			        "word": " they",
			      },
			      {
			        "end": 113.76,
			        "start": 113.65,
			        "word": "'re",
			      },
			      {
			        "end": 114.06,
			        "start": 113.76,
			        "word": " doing",
			      },
			      {
			        "end": 114.19,
			        "start": 114.06,
			        "word": " it",
			      },
			      {
			        "end": 114.31,
			        "start": 114.19,
			        "word": ",",
			      },
			      {
			        "end": 114.5,
			        "start": 114.31,
			        "word": " how",
			      },
			      {
			        "end": 114.75,
			        "start": 114.5,
			        "word": " they",
			      },
			      {
			        "end": 114.93,
			        "start": 114.75,
			        "word": "'re",
			      },
			      {
			        "end": 115.23,
			        "start": 114.93,
			        "word": " doing",
			      },
			      {
			        "end": 115.36,
			        "start": 115.23,
			        "word": " it",
			      },
			    ],
			  },
			  {
			    "end": 118.86,
			    "start": 115.6,
			    "text": "And the only victim is the American public,",
			    "words": [
			      {
			        "end": 115.93,
			        "start": 115.6,
			        "word": " And",
			      },
			      {
			        "end": 116.26,
			        "start": 115.93,
			        "word": " the",
			      },
			      {
			        "end": 116.71,
			        "start": 116.26,
			        "word": " only",
			      },
			      {
			        "end": 117.45,
			        "start": 116.71,
			        "word": " victim",
			      },
			      {
			        "end": 117.52,
			        "start": 117.45,
			        "word": " is",
			      },
			      {
			        "end": 117.76,
			        "start": 117.52,
			        "word": " the",
			      },
			      {
			        "end": 118.58,
			        "start": 117.76,
			        "word": " American",
			      },
			      {
			        "end": 118.86,
			        "start": 118.58,
			        "word": " public",
			      },
			    ],
			  },
			  {
			    "end": 122.57,
			    "start": 119.16,
			    "text": "American consumer, the American citizen, the American business.",
			    "words": [
			      {
			        "end": 119.69,
			        "start": 119.16,
			        "word": " American",
			      },
			      {
			        "end": 120.32,
			        "start": 119.69,
			        "word": " consumer",
			      },
			      {
			        "end": 120.63,
			        "start": 120.32,
			        "word": ",",
			      },
			      {
			        "end": 120.64,
			        "start": 120.63,
			        "word": " the",
			      },
			      {
			        "end": 121.08,
			        "start": 120.64,
			        "word": " American",
			      },
			      {
			        "end": 121.48,
			        "start": 121.08,
			        "word": " citizen",
			      },
			      {
			        "end": 121.6,
			        "start": 121.48,
			        "word": ",",
			      },
			      {
			        "end": 121.78,
			        "start": 121.6,
			        "word": " the",
			      },
			      {
			        "end": 122.23,
			        "start": 121.78,
			        "word": " American",
			      },
			      {
			        "end": 122.57,
			        "start": 122.23,
			        "word": " business",
			      },
			    ],
			  },
			  {
			    "end": 125.94,
			    "start": 122.64,
			    "text": "PRESIDENT DONALD TRUMP: The chaos playing out on Capitol Hill.",
			    "words": [
			      {
			        "end": 122.97,
			        "start": 122.64,
			        "word": " PRESID",
			      },
			      {
			        "end": 123.03,
			        "start": 122.97,
			        "word": "ENT",
			      },
			      {
			        "end": 123.08,
			        "start": 123.03,
			        "word": " DON",
			      },
			      {
			        "end": 123.26,
			        "start": 123.08,
			        "word": "ALD",
			      },
			      {
			        "end": 123.27,
			        "start": 123.26,
			        "word": " TR",
			      },
			      {
			        "end": 123.29,
			        "start": 123.27,
			        "word": "U",
			      },
			      {
			        "end": 123.36,
			        "start": 123.29,
			        "word": "MP",
			      },
			      {
			        "end": 123.54,
			        "start": 123.36,
			        "word": ":",
			      },
			      {
			        "end": 123.68,
			        "start": 123.54,
			        "word": " The",
			      },
			      {
			        "end": 124.1,
			        "start": 123.68,
			        "word": " chaos",
			      },
			      {
			        "end": 124.66,
			        "start": 124.1,
			        "word": " playing",
			      },
			      {
			        "end": 124.9,
			        "start": 124.66,
			        "word": " out",
			      },
			      {
			        "end": 125.06,
			        "start": 124.9,
			        "word": " on",
			      },
			      {
			        "end": 125.6,
			        "start": 125.06,
			        "word": " Capitol",
			      },
			      {
			        "end": 125.94,
			        "start": 125.6,
			        "word": " Hill",
			      },
			    ],
			  },
			  {
			    "end": 129.13,
			    "start": 126.32,
			    "text": "Trump's trade representative defending tariffs",
			    "words": [
			      {
			        "end": 126.52,
			        "start": 126.32,
			        "word": " Trump",
			      },
			      {
			        "end": 126.64,
			        "start": 126.52,
			        "word": "'s",
			      },
			      {
			        "end": 127.04,
			        "start": 126.64,
			        "word": " trade",
			      },
			      {
			        "end": 128,
			        "start": 127.04,
			        "word": " representative",
			      },
			      {
			        "end": 128.62,
			        "start": 128,
			        "word": " defending",
			      },
			      {
			        "end": 129.13,
			        "start": 128.62,
			        "word": " tariffs",
			      },
			    ],
			  },
			  {
			    "end": 131.8,
			    "start": 129.13,
			    "text": "at the very moment the president was rowing back.",
			    "words": [
			      {
			        "end": 129.23,
			        "start": 129.13,
			        "word": " at",
			      },
			      {
			        "end": 129.43,
			        "start": 129.23,
			        "word": " the",
			      },
			      {
			        "end": 129.73,
			        "start": 129.43,
			        "word": " very",
			      },
			      {
			        "end": 130.11,
			        "start": 129.73,
			        "word": " moment",
			      },
			      {
			        "end": 130.31,
			        "start": 130.11,
			        "word": " the",
			      },
			      {
			        "end": 130.93,
			        "start": 130.31,
			        "word": " president",
			      },
			      {
			        "end": 131.15,
			        "start": 130.93,
			        "word": " was",
			      },
			      {
			        "end": 131.34,
			        "start": 131.15,
			        "word": " row",
			      },
			      {
			        "end": 131.53,
			        "start": 131.34,
			        "word": "ing",
			      },
			      {
			        "end": 131.8,
			        "start": 131.53,
			        "word": " back",
			      },
			    ],
			  },
			  {
			    "end": 134.39,
			    "start": 132.08,
			    "text": "PRESIDENT DONALD TRUMP: So, did you know that the --",
			    "words": [
			      {
			        "end": 132.32,
			        "start": 132.08,
			        "word": " PRESID",
			      },
			      {
			        "end": 132.45,
			        "start": 132.32,
			        "word": "ENT",
			      },
			      {
			        "end": 132.57,
			        "start": 132.45,
			        "word": " DON",
			      },
			      {
			        "end": 132.68,
			        "start": 132.57,
			        "word": "ALD",
			      },
			      {
			        "end": 132.77,
			        "start": 132.68,
			        "word": " TR",
			      },
			      {
			        "end": 132.81,
			        "start": 132.77,
			        "word": "U",
			      },
			      {
			        "end": 132.96,
			        "start": 132.81,
			        "word": "MP",
			      },
			      {
			        "end": 133.04,
			        "start": 132.96,
			        "word": ":",
			      },
			      {
			        "end": 133.07,
			        "start": 133.04,
			        "word": " So",
			      },
			      {
			        "end": 133.18,
			        "start": 133.07,
			        "word": ",",
			      },
			      {
			        "end": 133.35,
			        "start": 133.18,
			        "word": " did",
			      },
			      {
			        "end": 133.52,
			        "start": 133.35,
			        "word": " you",
			      },
			      {
			        "end": 133.76,
			        "start": 133.52,
			        "word": " know",
			      },
			      {
			        "end": 134.05,
			        "start": 133.76,
			        "word": " that",
			      },
			      {
			        "end": 134.24,
			        "start": 134.05,
			        "word": " the",
			      },
			      {
			        "end": 134.39,
			        "start": 134.24,
			        "word": " --",
			      },
			    ],
			  },
			  {
			    "end": 135.68,
			    "start": 134.39,
			    "text": "that this was under discussion?",
			    "words": [
			      {
			        "end": 134.61,
			        "start": 134.39,
			        "word": " that",
			      },
			      {
			        "end": 134.73,
			        "start": 134.61,
			        "word": " this",
			      },
			      {
			        "end": 134.96,
			        "start": 134.73,
			        "word": " was",
			      },
			      {
			        "end": 135.12,
			        "start": 134.96,
			        "word": " under",
			      },
			      {
			        "end": 135.68,
			        "start": 135.12,
			        "word": " discussion",
			      },
			    ],
			  },
			  {
			    "end": 138.5,
			    "start": 135.68,
			    "text": "And why did you not include that as part of your opening remarks?",
			    "words": [
			      {
			        "end": 135.84,
			        "start": 135.68,
			        "word": " And",
			      },
			      {
			        "end": 136,
			        "start": 135.84,
			        "word": " why",
			      },
			      {
			        "end": 136.16,
			        "start": 136,
			        "word": " did",
			      },
			      {
			        "end": 136.32,
			        "start": 136.16,
			        "word": " you",
			      },
			      {
			        "end": 136.48,
			        "start": 136.32,
			        "word": " not",
			      },
			      {
			        "end": 136.86,
			        "start": 136.48,
			        "word": " include",
			      },
			      {
			        "end": 137.1,
			        "start": 136.86,
			        "word": " that",
			      },
			      {
			        "end": 137.33,
			        "start": 137.1,
			        "word": " as",
			      },
			      {
			        "end": 137.41,
			        "start": 137.33,
			        "word": " part",
			      },
			      {
			        "end": 137.59,
			        "start": 137.41,
			        "word": " of",
			      },
			      {
			        "end": 137.74,
			        "start": 137.59,
			        "word": " your",
			      },
			      {
			        "end": 138.14,
			        "start": 137.74,
			        "word": " opening",
			      },
			      {
			        "end": 138.5,
			        "start": 138.14,
			        "word": " remarks",
			      },
			    ],
			  },
			  {
			    "end": 141.44,
			    "start": 138.72,
			    "text": "DONALD TRUMP: So, typically, what I don't do is divulge",
			    "words": [
			      {
			        "end": 138.86,
			        "start": 138.72,
			        "word": " DON",
			      },
			      {
			        "end": 139.05,
			        "start": 138.86,
			        "word": "ALD",
			      },
			      {
			        "end": 139.09,
			        "start": 139.05,
			        "word": " TR",
			      },
			      {
			        "end": 139.13,
			        "start": 139.09,
			        "word": "U",
			      },
			      {
			        "end": 139.23,
			        "start": 139.13,
			        "word": "MP",
			      },
			      {
			        "end": 139.26,
			        "start": 139.23,
			        "word": ":",
			      },
			      {
			        "end": 139.38,
			        "start": 139.26,
			        "word": " So",
			      },
			      {
			        "end": 139.5,
			        "start": 139.38,
			        "word": ",",
			      },
			      {
			        "end": 139.86,
			        "start": 139.5,
			        "word": " typically",
			      },
			      {
			        "end": 139.95,
			        "start": 139.86,
			        "word": ",",
			      },
			      {
			        "end": 140.13,
			        "start": 139.95,
			        "word": " what",
			      },
			      {
			        "end": 140.17,
			        "start": 140.13,
			        "word": " I",
			      },
			      {
			        "end": 140.31,
			        "start": 140.17,
			        "word": " don",
			      },
			      {
			        "end": 140.4,
			        "start": 140.31,
			        "word": "'t",
			      },
			      {
			        "end": 140.56,
			        "start": 140.4,
			        "word": " do",
			      },
			      {
			        "end": 140.75,
			        "start": 140.56,
			        "word": " is",
			      },
			      {
			        "end": 141.23,
			        "start": 140.75,
			        "word": " divul",
			      },
			      {
			        "end": 141.44,
			        "start": 141.23,
			        "word": "ge",
			      },
			    ],
			  },
			  {
			    "end": 142.72,
			    "start": 141.44,
			    "text": "the contents of my discussions.",
			    "words": [
			      {
			        "end": 141.59,
			        "start": 141.44,
			        "word": " the",
			      },
			      {
			        "end": 141.97,
			        "start": 141.59,
			        "word": " contents",
			      },
			      {
			        "end": 142.06,
			        "start": 141.97,
			        "word": " of",
			      },
			      {
			        "end": 142.15,
			        "start": 142.06,
			        "word": " my",
			      },
			      {
			        "end": 142.72,
			        "start": 142.15,
			        "word": " discussions",
			      },
			    ],
			  },
			  {
			    "end": 144.46,
			    "start": 142.72,
			    "text": "PRESIDENT DONALD TRUMP: What are the details of the pause?",
			    "words": [
			      {
			        "end": 142.95,
			        "start": 142.72,
			        "word": " PRESID",
			      },
			      {
			        "end": 143.05,
			        "start": 142.95,
			        "word": "ENT",
			      },
			      {
			        "end": 143.16,
			        "start": 143.05,
			        "word": " DON",
			      },
			      {
			        "end": 143.27,
			        "start": 143.16,
			        "word": "ALD",
			      },
			      {
			        "end": 143.34,
			        "start": 143.27,
			        "word": " TR",
			      },
			      {
			        "end": 143.37,
			        "start": 143.34,
			        "word": "U",
			      },
			      {
			        "end": 143.44,
			        "start": 143.37,
			        "word": "MP",
			      },
			      {
			        "end": 143.47,
			        "start": 143.44,
			        "word": ":",
			      },
			      {
			        "end": 143.62,
			        "start": 143.47,
			        "word": " What",
			      },
			      {
			        "end": 143.73,
			        "start": 143.62,
			        "word": " are",
			      },
			      {
			        "end": 143.84,
			        "start": 143.73,
			        "word": " the",
			      },
			      {
			        "end": 144.1,
			        "start": 143.84,
			        "word": " details",
			      },
			      {
			        "end": 144.17,
			        "start": 144.1,
			        "word": " of",
			      },
			      {
			        "end": 144.28,
			        "start": 144.17,
			        "word": " the",
			      },
			      {
			        "end": 144.46,
			        "start": 144.28,
			        "word": " pause",
			      },
			    ],
			  },
			  {
			    "end": 147.06,
			    "start": 144.64,
			    "text": "DONALD TRUMP: Well, my understanding is that,",
			    "words": [
			      {
			        "end": 144.82,
			        "start": 144.64,
			        "word": " DON",
			      },
			      {
			        "end": 144.99,
			        "start": 144.82,
			        "word": "ALD",
			      },
			      {
			        "end": 145.11,
			        "start": 144.99,
			        "word": " TR",
			      },
			      {
			        "end": 145.18,
			        "start": 145.11,
			        "word": "U",
			      },
			      {
			        "end": 145.3,
			        "start": 145.18,
			        "word": "MP",
			      },
			      {
			        "end": 145.36,
			        "start": 145.3,
			        "word": ":",
			      },
			      {
			        "end": 145.6,
			        "start": 145.36,
			        "word": " Well",
			      },
			      {
			        "end": 145.84,
			        "start": 145.6,
			        "word": ",",
			      },
			      {
			        "end": 145.88,
			        "start": 145.84,
			        "word": " my",
			      },
			      {
			        "end": 146.65,
			        "start": 145.88,
			        "word": " understanding",
			      },
			      {
			        "end": 146.77,
			        "start": 146.65,
			        "word": " is",
			      },
			      {
			        "end": 147.06,
			        "start": 146.77,
			        "word": " that",
			      },
			    ],
			  },
			  {
			    "end": 150.95,
			    "start": 147.2,
			    "text": "because so many countries have decided not to retaliate,",
			    "words": [
			      {
			        "end": 148.63,
			        "start": 147.2,
			        "word": " because",
			      },
			      {
			        "end": 148.72,
			        "start": 148.63,
			        "word": " so",
			      },
			      {
			        "end": 148.88,
			        "start": 148.72,
			        "word": " many",
			      },
			      {
			        "end": 149.28,
			        "start": 148.88,
			        "word": " countries",
			      },
			      {
			        "end": 149.44,
			        "start": 149.28,
			        "word": " have",
			      },
			      {
			        "end": 149.84,
			        "start": 149.44,
			        "word": " decided",
			      },
			      {
			        "end": 150,
			        "start": 149.84,
			        "word": " not",
			      },
			      {
			        "end": 150.16,
			        "start": 150,
			        "word": " to",
			      },
			      {
			        "end": 150.68,
			        "start": 150.16,
			        "word": " retali",
			      },
			      {
			        "end": 150.95,
			        "start": 150.68,
			        "word": "ate",
			      },
			    ],
			  },
			  {
			    "end": 152.39,
			    "start": 151.12,
			    "text": "we're going to have about 90 days.",
			    "words": [
			      {
			        "end": 151.21,
			        "start": 151.12,
			        "word": " we",
			      },
			      {
			        "end": 151.33,
			        "start": 151.21,
			        "word": "'re",
			      },
			      {
			        "end": 151.53,
			        "start": 151.33,
			        "word": " going",
			      },
			      {
			        "end": 151.61,
			        "start": 151.53,
			        "word": " to",
			      },
			      {
			        "end": 151.77,
			        "start": 151.61,
			        "word": " have",
			      },
			      {
			        "end": 151.98,
			        "start": 151.77,
			        "word": " about",
			      },
			      {
			        "end": 152.22,
			        "start": 151.98,
			        "word": " 90",
			      },
			      {
			        "end": 152.39,
			        "start": 152.22,
			        "word": " days",
			      },
			    ],
			  },
			  {
			    "end": 154.29,
			    "start": 152.56,
			    "text": "PRESIDENT DONALD TRUMP: No, no, excuse me?",
			    "words": [
			      {
			        "end": 152.82,
			        "start": 152.56,
			        "word": " PRESID",
			      },
			      {
			        "end": 153.01,
			        "start": 152.82,
			        "word": "ENT",
			      },
			      {
			        "end": 153.07,
			        "start": 153.01,
			        "word": " DON",
			      },
			      {
			        "end": 153.29,
			        "start": 153.07,
			        "word": "ALD",
			      },
			      {
			        "end": 153.29,
			        "start": 153.29,
			        "word": " TR",
			      },
			      {
			        "end": 153.33,
			        "start": 153.29,
			        "word": "U",
			      },
			      {
			        "end": 153.41,
			        "start": 153.33,
			        "word": "MP",
			      },
			      {
			        "end": 153.45,
			        "start": 153.41,
			        "word": ":",
			      },
			      {
			        "end": 153.53,
			        "start": 153.45,
			        "word": " No",
			      },
			      {
			        "end": 153.61,
			        "start": 153.53,
			        "word": ",",
			      },
			      {
			        "end": 153.69,
			        "start": 153.61,
			        "word": " no",
			      },
			      {
			        "end": 153.91,
			        "start": 153.69,
			        "word": ",",
			      },
			      {
			        "end": 154.18,
			        "start": 153.91,
			        "word": " excuse",
			      },
			      {
			        "end": 154.29,
			        "start": 154.18,
			        "word": " me",
			      },
			    ],
			  },
			  {
			    "end": 159.73,
			    "start": 154.48,
			    "text": "You -- we are -- China increased their tariffs on the United States.",
			    "words": [
			      {
			        "end": 155.34,
			        "start": 154.48,
			        "word": " You",
			      },
			      {
			        "end": 155.43,
			        "start": 155.34,
			        "word": " --",
			      },
			      {
			        "end": 155.81,
			        "start": 155.43,
			        "word": " we",
			      },
			      {
			        "end": 156.38,
			        "start": 155.81,
			        "word": " are",
			      },
			      {
			        "end": 156.86,
			        "start": 156.38,
			        "word": " --",
			      },
			      {
			        "end": 157.14,
			        "start": 156.86,
			        "word": " China",
			      },
			      {
			        "end": 157.82,
			        "start": 157.14,
			        "word": " increased",
			      },
			      {
			        "end": 158.14,
			        "start": 157.82,
			        "word": " their",
			      },
			      {
			        "end": 158.58,
			        "start": 158.14,
			        "word": " tariffs",
			      },
			      {
			        "end": 158.71,
			        "start": 158.58,
			        "word": " on",
			      },
			      {
			        "end": 158.91,
			        "start": 158.71,
			        "word": " the",
			      },
			      {
			        "end": 159.33,
			        "start": 158.91,
			        "word": " United",
			      },
			      {
			        "end": 159.73,
			        "start": 159.33,
			        "word": " States",
			      },
			    ],
			  },
			  {
			    "end": 161.01,
			    "start": 160.14,
			    "text": "Trump blinked.",
			    "words": [
			      {
			        "end": 160.42,
			        "start": 160.14,
			        "word": " Trump",
			      },
			      {
			        "end": 160.96,
			        "start": 160.42,
			        "word": " blink",
			      },
			      {
			        "end": 161.01,
			        "start": 160.96,
			        "word": "ed",
			      },
			    ],
			  },
			  {
			    "end": 163.53,
			    "start": 161.28,
			    "text": "PRESIDENT DONALD TRUMP: There were questions,",
			    "words": [
			      {
			        "end": 161.54,
			        "start": 161.28,
			        "word": " PRESID",
			      },
			      {
			        "end": 161.69,
			        "start": 161.54,
			        "word": "ENT",
			      },
			      {
			        "end": 161.84,
			        "start": 161.69,
			        "word": " DON",
			      },
			      {
			        "end": 161.98,
			        "start": 161.84,
			        "word": "ALD",
			      },
			      {
			        "end": 162.08,
			        "start": 161.98,
			        "word": " TR",
			      },
			      {
			        "end": 162.12,
			        "start": 162.08,
			        "word": "U",
			      },
			      {
			        "end": 162.21,
			        "start": 162.12,
			        "word": "MP",
			      },
			      {
			        "end": 162.49,
			        "start": 162.21,
			        "word": ":",
			      },
			      {
			        "end": 162.63,
			        "start": 162.49,
			        "word": " There",
			      },
			      {
			        "end": 162.87,
			        "start": 162.63,
			        "word": " were",
			      },
			      {
			        "end": 163.53,
			        "start": 162.87,
			        "word": " questions",
			      },
			    ],
			  },
			  {
			    "end": 166.55,
			    "start": 163.55,
			    "text": "but no answers from President Trump's own trade advisor.",
			    "words": [
			      {
			        "end": 163.74,
			        "start": 163.55,
			        "word": " but",
			      },
			      {
			        "end": 163.92,
			        "start": 163.74,
			        "word": " no",
			      },
			      {
			        "end": 164.48,
			        "start": 163.92,
			        "word": " answers",
			      },
			      {
			        "end": 164.72,
			        "start": 164.48,
			        "word": " from",
			      },
			      {
			        "end": 165.2,
			        "start": 164.72,
			        "word": " President",
			      },
			      {
			        "end": 165.48,
			        "start": 165.2,
			        "word": " Trump",
			      },
			      {
			        "end": 165.6,
			        "start": 165.48,
			        "word": "'s",
			      },
			      {
			        "end": 165.84,
			        "start": 165.6,
			        "word": " own",
			      },
			      {
			        "end": 166.16,
			        "start": 165.84,
			        "word": " trade",
			      },
			      {
			        "end": 166.55,
			        "start": 166.16,
			        "word": " advisor",
			      },
			    ],
			  },
			  {
			    "end": 169.44,
			    "start": 166.72,
			    "text": "PRESIDENT DONALD TRUMP: Sir, you said that tariffs were non-negotiable.",
			    "words": [
			      {
			        "end": 166.92,
			        "start": 166.72,
			        "word": " PRESID",
			      },
			      {
			        "end": 167.02,
			        "start": 166.92,
			        "word": "ENT",
			      },
			      {
			        "end": 167.12,
			        "start": 167.02,
			        "word": " DON",
			      },
			      {
			        "end": 167.22,
			        "start": 167.12,
			        "word": "ALD",
			      },
			      {
			        "end": 167.28,
			        "start": 167.22,
			        "word": " TR",
			      },
			      {
			        "end": 167.31,
			        "start": 167.28,
			        "word": "U",
			      },
			      {
			        "end": 167.37,
			        "start": 167.31,
			        "word": "MP",
			      },
			      {
			        "end": 167.44,
			        "start": 167.37,
			        "word": ":",
			      },
			      {
			        "end": 167.59,
			        "start": 167.44,
			        "word": " Sir",
			      },
			      {
			        "end": 167.67,
			        "start": 167.59,
			        "word": ",",
			      },
			      {
			        "end": 167.81,
			        "start": 167.67,
			        "word": " you",
			      },
			      {
			        "end": 168,
			        "start": 167.81,
			        "word": " said",
			      },
			      {
			        "end": 168.19,
			        "start": 168,
			        "word": " that",
			      },
			      {
			        "end": 168.56,
			        "start": 168.19,
			        "word": " tariffs",
			      },
			      {
			        "end": 168.8,
			        "start": 168.56,
			        "word": " were",
			      },
			      {
			        "end": 168.94,
			        "start": 168.8,
			        "word": " non",
			      },
			      {
			        "end": 168.98,
			        "start": 168.94,
			        "word": "-",
			      },
			      {
			        "end": 169.12,
			        "start": 168.98,
			        "word": "neg",
			      },
			      {
			        "end": 169.26,
			        "start": 169.12,
			        "word": "oti",
			      },
			      {
			        "end": 169.44,
			        "start": 169.26,
			        "word": "able",
			      },
			    ],
			  },
			  {
			    "end": 170.41,
			    "start": 169.6,
			    "text": "Why did you say that?",
			    "words": [
			      {
			        "end": 169.84,
			        "start": 169.6,
			        "word": " Why",
			      },
			      {
			        "end": 170,
			        "start": 169.84,
			        "word": " did",
			      },
			      {
			        "end": 170.16,
			        "start": 170,
			        "word": " you",
			      },
			      {
			        "end": 170.32,
			        "start": 170.16,
			        "word": " say",
			      },
			      {
			        "end": 170.41,
			        "start": 170.32,
			        "word": " that",
			      },
			    ],
			  },
			  {
			    "end": 171.15,
			    "start": 170.48,
			    "text": "PRESIDENT DONALD TRUMP: Sir, we got to get to work.",
			    "words": [
			      {
			        "end": 170.58,
			        "start": 170.48,
			        "word": " PRESID",
			      },
			      {
			        "end": 170.63,
			        "start": 170.58,
			        "word": "ENT",
			      },
			      {
			        "end": 170.68,
			        "start": 170.63,
			        "word": " DON",
			      },
			      {
			        "end": 170.73,
			        "start": 170.68,
			        "word": "ALD",
			      },
			      {
			        "end": 170.76,
			        "start": 170.73,
			        "word": " TR",
			      },
			      {
			        "end": 170.77,
			        "start": 170.76,
			        "word": "U",
			      },
			      {
			        "end": 170.8,
			        "start": 170.77,
			        "word": "MP",
			      },
			      {
			        "end": 170.81,
			        "start": 170.8,
			        "word": ":",
			      },
			      {
			        "end": 170.86,
			        "start": 170.81,
			        "word": " Sir",
			      },
			      {
			        "end": 170.89,
			        "start": 170.86,
			        "word": ",",
			      },
			      {
			        "end": 170.92,
			        "start": 170.89,
			        "word": " we",
			      },
			      {
			        "end": 170.97,
			        "start": 170.92,
			        "word": " got",
			      },
			      {
			        "end": 171,
			        "start": 170.97,
			        "word": " to",
			      },
			      {
			        "end": 171.06,
			        "start": 171,
			        "word": " get",
			      },
			      {
			        "end": 171.12,
			        "start": 171.06,
			        "word": " to",
			      },
			      {
			        "end": 171.15,
			        "start": 171.12,
			        "word": " work",
			      },
			    ],
			  },
			  {
			    "end": 171.6,
			    "start": 171.28,
			    "text": "I apologize.",
			    "words": [
			      {
			        "end": 171.31,
			        "start": 171.28,
			        "word": " I",
			      },
			      {
			        "end": 171.6,
			        "start": 171.31,
			        "word": " apologize",
			      },
			    ],
			  },
			  {
			    "end": 173.58,
			    "start": 171.68,
			    "text": "PRESIDENT DONALD TRUMP: Did you contribute to the chaos in the market, sir?",
			    "words": [
			      {
			        "end": 171.86,
			        "start": 171.68,
			        "word": " PRESID",
			      },
			      {
			        "end": 171.95,
			        "start": 171.86,
			        "word": "ENT",
			      },
			      {
			        "end": 172.03,
			        "start": 171.95,
			        "word": " DON",
			      },
			      {
			        "end": 172.13,
			        "start": 172.03,
			        "word": "ALD",
			      },
			      {
			        "end": 172.19,
			        "start": 172.13,
			        "word": " TR",
			      },
			      {
			        "end": 172.22,
			        "start": 172.19,
			        "word": "U",
			      },
			      {
			        "end": 172.28,
			        "start": 172.22,
			        "word": "MP",
			      },
			      {
			        "end": 172.31,
			        "start": 172.28,
			        "word": ":",
			      },
			      {
			        "end": 172.4,
			        "start": 172.31,
			        "word": " Did",
			      },
			      {
			        "end": 172.5,
			        "start": 172.4,
			        "word": " you",
			      },
			      {
			        "end": 172.82,
			        "start": 172.5,
			        "word": " contribute",
			      },
			      {
			        "end": 172.86,
			        "start": 172.82,
			        "word": " to",
			      },
			      {
			        "end": 172.95,
			        "start": 172.86,
			        "word": " the",
			      },
			      {
			        "end": 173.09,
			        "start": 172.95,
			        "word": " chaos",
			      },
			      {
			        "end": 173.16,
			        "start": 173.09,
			        "word": " in",
			      },
			      {
			        "end": 173.25,
			        "start": 173.16,
			        "word": " the",
			      },
			      {
			        "end": 173.42,
			        "start": 173.25,
			        "word": " market",
			      },
			      {
			        "end": 173.49,
			        "start": 173.42,
			        "word": ",",
			      },
			      {
			        "end": 173.58,
			        "start": 173.49,
			        "word": " sir",
			      },
			    ],
			  },
			  {
			    "end": 176.62,
			    "start": 173.76,
			    "text": "PRESIDENT DONALD TRUMP: Just hours before this climb down,",
			    "words": [
			      {
			        "end": 174.04,
			        "start": 173.76,
			        "word": " PRESID",
			      },
			      {
			        "end": 174.19,
			        "start": 174.04,
			        "word": "ENT",
			      },
			      {
			        "end": 174.33,
			        "start": 174.19,
			        "word": " DON",
			      },
			      {
			        "end": 174.47,
			        "start": 174.33,
			        "word": "ALD",
			      },
			      {
			        "end": 174.56,
			        "start": 174.47,
			        "word": " TR",
			      },
			      {
			        "end": 174.6,
			        "start": 174.56,
			        "word": "U",
			      },
			      {
			        "end": 174.69,
			        "start": 174.6,
			        "word": "MP",
			      },
			      {
			        "end": 174.94,
			        "start": 174.69,
			        "word": ":",
			      },
			      {
			        "end": 175.08,
			        "start": 174.94,
			        "word": " Just",
			      },
			      {
			        "end": 175.43,
			        "start": 175.08,
			        "word": " hours",
			      },
			      {
			        "end": 175.87,
			        "start": 175.43,
			        "word": " before",
			      },
			      {
			        "end": 176.2,
			        "start": 175.87,
			        "word": " this",
			      },
			      {
			        "end": 176.41,
			        "start": 176.2,
			        "word": " climb",
			      },
			      {
			        "end": 176.62,
			        "start": 176.41,
			        "word": " down",
			      },
			    ],
			  },
			  {
			    "end": 181.34,
			    "start": 176.72,
			    "text": "the president posted online, "Be cool. Everything's going to work out well.",
			    "words": [
			      {
			        "end": 176.88,
			        "start": 176.72,
			        "word": " the",
			      },
			      {
			        "end": 177.36,
			        "start": 176.88,
			        "word": " president",
			      },
			      {
			        "end": 177.92,
			        "start": 177.36,
			        "word": " posted",
			      },
			      {
			        "end": 178.71,
			        "start": 177.92,
			        "word": " online",
			      },
			      {
			        "end": 178.72,
			        "start": 178.71,
			        "word": ",",
			      },
			      {
			        "end": 178.72,
			        "start": 178.72,
			        "word": "",
			      },
			      {
			        "end": 178.8,
			        "start": 178.72,
			        "word": " "",
			      },
			      {
			        "end": 178.91,
			        "start": 178.8,
			        "word": "Be",
			      },
			      {
			        "end": 179.17,
			        "start": 178.91,
			        "word": " cool",
			      },
			      {
			        "end": 179.37,
			        "start": 179.17,
			        "word": ".",
			      },
			      {
			        "end": 180.03,
			        "start": 179.37,
			        "word": " Everything",
			      },
			      {
			        "end": 180.16,
			        "start": 180.03,
			        "word": "'s",
			      },
			      {
			        "end": 180.51,
			        "start": 180.16,
			        "word": " going",
			      },
			      {
			        "end": 180.63,
			        "start": 180.51,
			        "word": " to",
			      },
			      {
			        "end": 180.88,
			        "start": 180.63,
			        "word": " work",
			      },
			      {
			        "end": 181.08,
			        "start": 180.88,
			        "word": " out",
			      },
			      {
			        "end": 181.34,
			        "start": 181.08,
			        "word": " well",
			      },
			    ],
			  },
			  {
			    "end": 184.77,
			    "start": 181.8,
			    "text": "The USA will be bigger and better than ever before.",
			    "words": [
			      {
			        "end": 181.86,
			        "start": 181.8,
			        "word": " The",
			      },
			      {
			        "end": 182.12,
			        "start": 181.86,
			        "word": " USA",
			      },
			      {
			        "end": 182.47,
			        "start": 182.12,
			        "word": " will",
			      },
			      {
			        "end": 182.64,
			        "start": 182.47,
			        "word": " be",
			      },
			      {
			        "end": 183.2,
			        "start": 182.64,
			        "word": " bigger",
			      },
			      {
			        "end": 183.44,
			        "start": 183.2,
			        "word": " and",
			      },
			      {
			        "end": 183.8,
			        "start": 183.44,
			        "word": " better",
			      },
			      {
			        "end": 184,
			        "start": 183.8,
			        "word": " than",
			      },
			      {
			        "end": 184.24,
			        "start": 184,
			        "word": " ever",
			      },
			      {
			        "end": 184.77,
			        "start": 184.24,
			        "word": " before",
			      },
			    ],
			  },
			  {
			    "end": 187.12,
			    "start": 185.04,
			    "text": "This is a great time to buy."",
			    "words": [
			      {
			        "end": 185.37,
			        "start": 185.04,
			        "word": " This",
			      },
			      {
			        "end": 185.53,
			        "start": 185.37,
			        "word": " is",
			      },
			      {
			        "end": 185.63,
			        "start": 185.53,
			        "word": " a",
			      },
			      {
			        "end": 186.02,
			        "start": 185.63,
			        "word": " great",
			      },
			      {
			        "end": 186.35,
			        "start": 186.02,
			        "word": " time",
			      },
			      {
			        "end": 186.51,
			        "start": 186.35,
			        "word": " to",
			      },
			      {
			        "end": 186.75,
			        "start": 186.51,
			        "word": " buy",
			      },
			      {
			        "end": 187.12,
			        "start": 186.75,
			        "word": "."",
			      },
			    ],
			  },
			  {
			    "end": 190.72,
			    "start": 187.12,
			    "text": "Anyone who did buy stocks and shares right then",
			    "words": [
			      {
			        "end": 187.76,
			        "start": 187.12,
			        "word": " Anyone",
			      },
			      {
			        "end": 188.02,
			        "start": 187.76,
			        "word": " who",
			      },
			      {
			        "end": 188.33,
			        "start": 188.02,
			        "word": " did",
			      },
			      {
			        "end": 188.62,
			        "start": 188.33,
			        "word": " buy",
			      },
			      {
			        "end": 189.22,
			        "start": 188.62,
			        "word": " stocks",
			      },
			      {
			        "end": 189.52,
			        "start": 189.22,
			        "word": " and",
			      },
			      {
			        "end": 190.26,
			        "start": 189.52,
			        "word": " shares",
			      },
			      {
			        "end": 190.48,
			        "start": 190.26,
			        "word": " right",
			      },
			      {
			        "end": 190.72,
			        "start": 190.48,
			        "word": " then",
			      },
			    ],
			  },
			  {
			    "end": 192.41,
			    "start": 190.72,
			    "text": "made a lot of money today.",
			    "words": [
			      {
			        "end": 191.52,
			        "start": 190.72,
			        "word": " made",
			      },
			      {
			        "end": 191.61,
			        "start": 191.52,
			        "word": " a",
			      },
			      {
			        "end": 191.76,
			        "start": 191.61,
			        "word": " lot",
			      },
			      {
			        "end": 191.84,
			        "start": 191.76,
			        "word": " of",
			      },
			      {
			        "end": 192.16,
			        "start": 191.84,
			        "word": " money",
			      },
			      {
			        "end": 192.41,
			        "start": 192.16,
			        "word": " today",
			      },
			    ],
			  },
			  {
			    "end": 195.04,
			    "start": 192.56,
			    "text": "PRESIDENT DONALD TRUMP: The White House is selling this",
			    "words": [
			      {
			        "end": 192.84,
			        "start": 192.56,
			        "word": " PRESID",
			      },
			      {
			        "end": 192.98,
			        "start": 192.84,
			        "word": "ENT",
			      },
			      {
			        "end": 193.13,
			        "start": 192.98,
			        "word": " DON",
			      },
			      {
			        "end": 193.27,
			        "start": 193.13,
			        "word": "ALD",
			      },
			      {
			        "end": 193.36,
			        "start": 193.27,
			        "word": " TR",
			      },
			      {
			        "end": 193.4,
			        "start": 193.36,
			        "word": "U",
			      },
			      {
			        "end": 193.49,
			        "start": 193.4,
			        "word": "MP",
			      },
			      {
			        "end": 193.7,
			        "start": 193.49,
			        "word": ":",
			      },
			      {
			        "end": 193.78,
			        "start": 193.7,
			        "word": " The",
			      },
			      {
			        "end": 194.03,
			        "start": 193.78,
			        "word": " White",
			      },
			      {
			        "end": 194.32,
			        "start": 194.03,
			        "word": " House",
			      },
			      {
			        "end": 194.43,
			        "start": 194.32,
			        "word": " is",
			      },
			      {
			        "end": 194.81,
			        "start": 194.43,
			        "word": " selling",
			      },
			      {
			        "end": 195.04,
			        "start": 194.81,
			        "word": " this",
			      },
			    ],
			  },
			  {
			    "end": 197.16,
			    "start": 195.04,
			    "text": "as a stroke of economic genius.",
			    "words": [
			      {
			        "end": 195.18,
			        "start": 195.04,
			        "word": " as",
			      },
			      {
			        "end": 195.25,
			        "start": 195.18,
			        "word": " a",
			      },
			      {
			        "end": 195.68,
			        "start": 195.25,
			        "word": " stroke",
			      },
			      {
			        "end": 195.82,
			        "start": 195.68,
			        "word": " of",
			      },
			      {
			        "end": 196.4,
			        "start": 195.82,
			        "word": " economic",
			      },
			      {
			        "end": 197.16,
			        "start": 196.4,
			        "word": " genius",
			      },
			    ],
			  },
			  {
			    "end": 199.19,
			    "start": 197.2,
			    "text": "To many, it's damage limitation.",
			    "words": [
			      {
			        "end": 197.37,
			        "start": 197.2,
			        "word": " To",
			      },
			      {
			        "end": 197.62,
			        "start": 197.37,
			        "word": " many",
			      },
			      {
			        "end": 197.76,
			        "start": 197.62,
			        "word": ",",
			      },
			      {
			        "end": 197.9,
			        "start": 197.76,
			        "word": " it",
			      },
			      {
			        "end": 198.1,
			        "start": 197.9,
			        "word": "'s",
			      },
			      {
			        "end": 198.46,
			        "start": 198.1,
			        "word": " damage",
			      },
			      {
			        "end": 199.19,
			        "start": 198.46,
			        "word": " limitation",
			      },
			    ],
			  },
			  {
			    "end": 203.96,
			    "start": 199.44,
			    "text": "But the trade war between the world's two largest economies rages on.",
			    "words": [
			      {
			        "end": 199.71,
			        "start": 199.44,
			        "word": " But",
			      },
			      {
			        "end": 199.94,
			        "start": 199.71,
			        "word": " the",
			      },
			      {
			        "end": 200.31,
			        "start": 199.94,
			        "word": " trade",
			      },
			      {
			        "end": 200.56,
			        "start": 200.31,
			        "word": " war",
			      },
			      {
			        "end": 200.88,
			        "start": 200.56,
			        "word": " between",
			      },
			      {
			        "end": 200.97,
			        "start": 200.88,
			        "word": " the",
			      },
			      {
			        "end": 201.24,
			        "start": 200.97,
			        "word": " world",
			      },
			      {
			        "end": 201.36,
			        "start": 201.24,
			        "word": "'s",
			      },
			      {
			        "end": 201.68,
			        "start": 201.36,
			        "word": " two",
			      },
			      {
			        "end": 202.16,
			        "start": 201.68,
			        "word": " largest",
			      },
			      {
			        "end": 202.87,
			        "start": 202.16,
			        "word": " economies",
			      },
			      {
			        "end": 203.43,
			        "start": 202.87,
			        "word": " r",
			      },
			      {
			        "end": 203.84,
			        "start": 203.43,
			        "word": "ages",
			      },
			      {
			        "end": 203.96,
			        "start": 203.84,
			        "word": " on",
			      },
			    ],
			  },
			  {
			    "end": 207.2,
			    "start": 204.16,
			    "text": "PRESIDENT DONALD TRUMP: David Blevins, Sky News, in Washington.",
			    "words": [
			      {
			        "end": 204.47,
			        "start": 204.16,
			        "word": " PRESID",
			      },
			      {
			        "end": 204.7,
			        "start": 204.47,
			        "word": "ENT",
			      },
			      {
			        "end": 204.83,
			        "start": 204.7,
			        "word": " DON",
			      },
			      {
			        "end": 204.96,
			        "start": 204.83,
			        "word": "ALD",
			      },
			      {
			        "end": 205.06,
			        "start": 204.96,
			        "word": " TR",
			      },
			      {
			        "end": 205.18,
			        "start": 205.06,
			        "word": "U",
			      },
			      {
			        "end": 205.21,
			        "start": 205.18,
			        "word": "MP",
			      },
			      {
			        "end": 205.26,
			        "start": 205.21,
			        "word": ":",
			      },
			      {
			        "end": 205.52,
			        "start": 205.26,
			        "word": " David",
			      },
			      {
			        "end": 205.58,
			        "start": 205.52,
			        "word": " B",
			      },
			      {
			        "end": 205.74,
			        "start": 205.58,
			        "word": "lev",
			      },
			      {
			        "end": 205.9,
			        "start": 205.74,
			        "word": "ins",
			      },
			      {
			        "end": 206,
			        "start": 205.9,
			        "word": ",",
			      },
			      {
			        "end": 206.16,
			        "start": 206,
			        "word": " Sky",
			      },
			      {
			        "end": 206.37,
			        "start": 206.16,
			        "word": " News",
			      },
			      {
			        "end": 206.57,
			        "start": 206.37,
			        "word": ",",
			      },
			      {
			        "end": 206.59,
			        "start": 206.57,
			        "word": " in",
			      },
			      {
			        "end": 207.2,
			        "start": 206.59,
			        "word": " Washington",
			      },
			    ],
			  },
			]
		`)
	})

	test('alignWordsAndSentences words count', async () => {
		const { words } = await getWords()
		const result = alignWordsAndSentences(words, sentences)

		// 计算原始sentences中的总单词数
		const originalWordCount = sentences
			.join(' ')
			.split(/\s+/)
			.filter((word) => word.trim().length > 0).length

		// 计算result中所有text属性拼接后的总单词数
		const resultWordCount = result
			.map((item) => item.text)
			.join(' ')
			.split(/\s+/)
			.filter((word) => word.trim().length > 0).length

		// 判断单词数量是否一致
		console.log(`Original sentences count: ${sentences.length}`)
		console.log(`Result sentences count: ${result.length}`)
		console.log(`Original word count: ${originalWordCount}`)
		console.log(`Result word count: ${resultWordCount}`)

		// 找出缺失的句子
		const resultTexts = result.map((item) => item.text)
		const missingSentences = sentences.filter((sentence) => !resultTexts.includes(sentence))

		if (missingSentences.length > 0) {
			console.log('Missing sentences:')
			missingSentences.forEach((sentence, index) => {
				console.log(`${index + 1}. "${sentence}"`)
			})
		}

		// 仍然执行断言，但我们已经知道可能会失败
		expect(resultWordCount).toBe(originalWordCount)
	})
})
