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
	'President Donald Trump is putting a 90-day pause on tariffs for more than 75 countries.',
	'Since then, stocks have soared after weeks of chaos in the market.',
	'The U.S. and China are still trading tariff hikes.',
	'Alice Barr shares the latest on this growing trade war.',
	'In Commerce City last night, around 6 p.m., Commerce City police say a crash involving multiple cars shut down part of I-270.',
	'The highway is back open right now.',
	'According to police, one person died and three other people were hurt.',
	'One of them seriously.',
	'The wife of a man charged with murder and the death of a dog breeder in Clear Creek County is in custody this afternoon.',
	"The sheriff's office says 36-year-old Anna Ferrer was booked into jail Friday after she was extradited from Nebraska.",
	"Right now, she's being held on suspicion of accessory to a crime and tampering with physical evidence.",
	'Her husband, Sergio Ferrer, is accused of shooting and killing Paul Peavy.',
	'Peavy bred and sold Doberman puppies.',
	'Several of those puppies are still missing today.',
	"New data is showing that more students in Colorado are choosing to use the state's anonymous reporting system.",
	"Numbers from the state attorney general's office show students have submitted more than 23,000 safe-to-tell reports so far this school year.",
	"That's a 15% jump from this time last year.",
	"The bulk of this month's reports focused on school safety, bullying, and mental health concerns.",
	'All three of those categories made up more than 70% of all submissions.',
	'Students can use the system anytime through the Safe-to-Tell website, mobile app, or hotline.',
]

describe('align', () => {
	test('alignWordsAndSentences', async () => {
		const { words } = await getWords()

		const result = alignWordsAndSentences(words, sentences)

		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "end": 4.74,
			    "start": 0.09,
			    "text": "President Donald Trump is putting a 90-day pause on tariffs for more than 75 countries.",
			    "words": [
			      {
			        "end": 0.4,
			        "start": 0.09,
			        "word": " President",
			      },
			      {
			        "end": 0.64,
			        "start": 0.4,
			        "word": " Donald",
			      },
			      {
			        "end": 0.92,
			        "start": 0.64,
			        "word": " Trump",
			      },
			      {
			        "end": 1.54,
			        "start": 0.92,
			        "word": " is",
			      },
			      {
			        "end": 1.82,
			        "start": 1.54,
			        "word": " putting",
			      },
			      {
			        "end": 1.83,
			        "start": 1.82,
			        "word": " a",
			      },
			      {
			        "end": 1.94,
			        "start": 1.83,
			        "word": " 90",
			      },
			      {
			        "end": 2,
			        "start": 1.94,
			        "word": "-",
			      },
			      {
			        "end": 2.32,
			        "start": 2,
			        "word": "day",
			      },
			      {
			        "end": 2.58,
			        "start": 2.32,
			        "word": " pause",
			      },
			      {
			        "end": 2.92,
			        "start": 2.58,
			        "word": " on",
			      },
			      {
			        "end": 3.22,
			        "start": 2.92,
			        "word": " tariffs",
			      },
			      {
			        "end": 3.39,
			        "start": 3.22,
			        "word": " for",
			      },
			      {
			        "end": 3.64,
			        "start": 3.39,
			        "word": " more",
			      },
			      {
			        "end": 3.89,
			        "start": 3.64,
			        "word": " than",
			      },
			      {
			        "end": 4.28,
			        "start": 3.89,
			        "word": " 75",
			      },
			      {
			        "end": 4.74,
			        "start": 4.28,
			        "word": " countries",
			      },
			    ],
			  },
			  {
			    "end": 8.26,
			    "start": 4.9,
			    "text": "Since then, stocks have soared after weeks of chaos in the market.",
			    "words": [
			      {
			        "end": 5.27,
			        "start": 4.9,
			        "word": " Since",
			      },
			      {
			        "end": 5.52,
			        "start": 5.27,
			        "word": " then",
			      },
			      {
			        "end": 5.57,
			        "start": 5.52,
			        "word": ",",
			      },
			      {
			        "end": 5.94,
			        "start": 5.57,
			        "word": " stocks",
			      },
			      {
			        "end": 6.2,
			        "start": 5.94,
			        "word": " have",
			      },
			      {
			        "end": 6.52,
			        "start": 6.2,
			        "word": " so",
			      },
			      {
			        "end": 6.54,
			        "start": 6.52,
			        "word": "ared",
			      },
			      {
			        "end": 6.85,
			        "start": 6.54,
			        "word": " after",
			      },
			      {
			        "end": 7.16,
			        "start": 6.85,
			        "word": " weeks",
			      },
			      {
			        "end": 7.28,
			        "start": 7.16,
			        "word": " of",
			      },
			      {
			        "end": 7.58,
			        "start": 7.28,
			        "word": " chaos",
			      },
			      {
			        "end": 7.71,
			        "start": 7.58,
			        "word": " in",
			      },
			      {
			        "end": 7.89,
			        "start": 7.71,
			        "word": " the",
			      },
			      {
			        "end": 8.26,
			        "start": 7.89,
			        "word": " market",
			      },
			    ],
			  },
			  {
			    "end": 11.14,
			    "start": 8.5,
			    "text": "The U.S. and China are still trading tariff hikes.",
			    "words": [
			      {
			        "end": 8.69,
			        "start": 8.5,
			        "word": " The",
			      },
			      {
			        "end": 8.74,
			        "start": 8.69,
			        "word": " U",
			      },
			      {
			        "end": 8.96,
			        "start": 8.74,
			        "word": ".",
			      },
			      {
			        "end": 9,
			        "start": 8.96,
			        "word": "S",
			      },
			      {
			        "end": 9.16,
			        "start": 9,
			        "word": ".",
			      },
			      {
			        "end": 9.31,
			        "start": 9.16,
			        "word": " and",
			      },
			      {
			        "end": 9.61,
			        "start": 9.31,
			        "word": " China",
			      },
			      {
			        "end": 9.94,
			        "start": 9.61,
			        "word": " are",
			      },
			      {
			        "end": 10.09,
			        "start": 9.94,
			        "word": " still",
			      },
			      {
			        "end": 10.5,
			        "start": 10.09,
			        "word": " trading",
			      },
			      {
			        "end": 10.68,
			        "start": 10.5,
			        "word": " tar",
			      },
			      {
			        "end": 10.85,
			        "start": 10.68,
			        "word": "iff",
			      },
			      {
			        "end": 10.91,
			        "start": 10.85,
			        "word": " h",
			      },
			      {
			        "end": 11.14,
			        "start": 10.91,
			        "word": "ikes",
			      },
			    ],
			  },
			  {
			    "end": 14.43,
			    "start": 11.38,
			    "text": "Alice Barr shares the latest on this growing trade war.",
			    "words": [
			      {
			        "end": 11.8,
			        "start": 11.38,
			        "word": " Alice",
			      },
			      {
			        "end": 12.14,
			        "start": 11.8,
			        "word": " Barr",
			      },
			      {
			        "end": 12.45,
			        "start": 12.14,
			        "word": " shares",
			      },
			      {
			        "end": 12.6,
			        "start": 12.45,
			        "word": " the",
			      },
			      {
			        "end": 13.02,
			        "start": 12.6,
			        "word": " latest",
			      },
			      {
			        "end": 13.19,
			        "start": 13.02,
			        "word": " on",
			      },
			      {
			        "end": 13.43,
			        "start": 13.19,
			        "word": " this",
			      },
			      {
			        "end": 13.89,
			        "start": 13.43,
			        "word": " growing",
			      },
			      {
			        "end": 14.23,
			        "start": 13.89,
			        "word": " trade",
			      },
			      {
			        "end": 14.43,
			        "start": 14.23,
			        "word": " war",
			      },
			    ],
			  },
			  {
			    "end": 23.44,
			    "start": 14.7,
			    "text": "In Commerce City last night, around 6 p.m., Commerce City police say a crash involving multiple cars shut down part of I-270.",
			    "words": [
			      {
			        "end": 14.89,
			        "start": 14.7,
			        "word": " In",
			      },
			      {
			        "end": 15.79,
			        "start": 14.89,
			        "word": " Commerce",
			      },
			      {
			        "end": 16.06,
			        "start": 15.79,
			        "word": " City",
			      },
			      {
			        "end": 16.45,
			        "start": 16.06,
			        "word": " last",
			      },
			      {
			        "end": 16.98,
			        "start": 16.45,
			        "word": " night",
			      },
			      {
			        "end": 17.13,
			        "start": 16.98,
			        "word": ",",
			      },
			      {
			        "end": 17.75,
			        "start": 17.13,
			        "word": " around",
			      },
			      {
			        "end": 18.1,
			        "start": 17.75,
			        "word": " 6",
			      },
			      {
			        "end": 18.14,
			        "start": 18.1,
			        "word": " p",
			      },
			      {
			        "end": 18.46,
			        "start": 18.14,
			        "word": ".",
			      },
			      {
			        "end": 18.48,
			        "start": 18.46,
			        "word": "m",
			      },
			      {
			        "end": 19.04,
			        "start": 18.48,
			        "word": ".,",
			      },
			      {
			        "end": 19.44,
			        "start": 19.04,
			        "word": " Commerce",
			      },
			      {
			        "end": 19.64,
			        "start": 19.44,
			        "word": " City",
			      },
			      {
			        "end": 19.94,
			        "start": 19.64,
			        "word": " police",
			      },
			      {
			        "end": 20.1,
			        "start": 19.94,
			        "word": " say",
			      },
			      {
			        "end": 20.5,
			        "start": 20.1,
			        "word": " a",
			      },
			      {
			        "end": 20.86,
			        "start": 20.5,
			        "word": " crash",
			      },
			      {
			        "end": 21.22,
			        "start": 20.86,
			        "word": " involving",
			      },
			      {
			        "end": 21.8,
			        "start": 21.22,
			        "word": " multiple",
			      },
			      {
			        "end": 22.11,
			        "start": 21.8,
			        "word": " cars",
			      },
			      {
			        "end": 22.3,
			        "start": 22.11,
			        "word": " shut",
			      },
			      {
			        "end": 22.52,
			        "start": 22.3,
			        "word": " down",
			      },
			      {
			        "end": 22.74,
			        "start": 22.52,
			        "word": " part",
			      },
			      {
			        "end": 22.85,
			        "start": 22.74,
			        "word": " of",
			      },
			      {
			        "end": 22.9,
			        "start": 22.85,
			        "word": " I",
			      },
			      {
			        "end": 22.95,
			        "start": 22.9,
			        "word": "-",
			      },
			      {
			        "end": 23.11,
			        "start": 22.95,
			        "word": "2",
			      },
			      {
			        "end": 23.44,
			        "start": 23.11,
			        "word": "70",
			      },
			    ],
			  },
			  {
			    "end": 25.53,
			    "start": 23.64,
			    "text": "The highway is back open right now.",
			    "words": [
			      {
			        "end": 24.18,
			        "start": 23.64,
			        "word": " The",
			      },
			      {
			        "end": 24.32,
			        "start": 24.18,
			        "word": " highway",
			      },
			      {
			        "end": 24.45,
			        "start": 24.32,
			        "word": " is",
			      },
			      {
			        "end": 24.72,
			        "start": 24.45,
			        "word": " back",
			      },
			      {
			        "end": 24.99,
			        "start": 24.72,
			        "word": " open",
			      },
			      {
			        "end": 25.33,
			        "start": 24.99,
			        "word": " right",
			      },
			      {
			        "end": 25.53,
			        "start": 25.33,
			        "word": " now",
			      },
			    ],
			  },
			  {
			    "end": 29.06,
			    "start": 25.8,
			    "text": "According to police, one person died and three other people were hurt.",
			    "words": [
			      {
			        "end": 26.33,
			        "start": 25.8,
			        "word": " According",
			      },
			      {
			        "end": 26.41,
			        "start": 26.33,
			        "word": " to",
			      },
			      {
			        "end": 26.82,
			        "start": 26.41,
			        "word": " police",
			      },
			      {
			        "end": 26.85,
			        "start": 26.82,
			        "word": ",",
			      },
			      {
			        "end": 27.11,
			        "start": 26.85,
			        "word": " one",
			      },
			      {
			        "end": 27.4,
			        "start": 27.11,
			        "word": " person",
			      },
			      {
			        "end": 27.57,
			        "start": 27.4,
			        "word": " died",
			      },
			      {
			        "end": 27.72,
			        "start": 27.57,
			        "word": " and",
			      },
			      {
			        "end": 27.99,
			        "start": 27.72,
			        "word": " three",
			      },
			      {
			        "end": 28.26,
			        "start": 27.99,
			        "word": " other",
			      },
			      {
			        "end": 28.58,
			        "start": 28.26,
			        "word": " people",
			      },
			      {
			        "end": 28.81,
			        "start": 28.58,
			        "word": " were",
			      },
			      {
			        "end": 29.06,
			        "start": 28.81,
			        "word": " hurt",
			      },
			    ],
			  },
			  {
			    "end": 30.3,
			    "start": 29.38,
			    "text": "One of them seriously.",
			    "words": [
			      {
			        "end": 29.52,
			        "start": 29.38,
			        "word": " One",
			      },
			      {
			        "end": 29.61,
			        "start": 29.52,
			        "word": " of",
			      },
			      {
			        "end": 29.88,
			        "start": 29.61,
			        "word": " them",
			      },
			      {
			        "end": 30.3,
			        "start": 29.88,
			        "word": " seriously",
			      },
			    ],
			  },
			  {
			    "end": 37.75,
			    "start": 30.38,
			    "text": "The wife of a man charged with murder and the death of a dog breeder in Clear Creek County is in custody this afternoon.",
			    "words": [
			      {
			        "end": 30.61,
			        "start": 30.38,
			        "word": " The",
			      },
			      {
			        "end": 30.89,
			        "start": 30.61,
			        "word": " wife",
			      },
			      {
			        "end": 31.07,
			        "start": 30.89,
			        "word": " of",
			      },
			      {
			        "end": 31.24,
			        "start": 31.07,
			        "word": " a",
			      },
			      {
			        "end": 31.37,
			        "start": 31.24,
			        "word": " man",
			      },
			      {
			        "end": 32.18,
			        "start": 31.37,
			        "word": " charged",
			      },
			      {
			        "end": 32.22,
			        "start": 32.18,
			        "word": " with",
			      },
			      {
			        "end": 32.68,
			        "start": 32.22,
			        "word": " murder",
			      },
			      {
			        "end": 32.91,
			        "start": 32.68,
			        "word": " and",
			      },
			      {
			        "end": 33.14,
			        "start": 32.91,
			        "word": " the",
			      },
			      {
			        "end": 33.53,
			        "start": 33.14,
			        "word": " death",
			      },
			      {
			        "end": 33.68,
			        "start": 33.53,
			        "word": " of",
			      },
			      {
			        "end": 33.75,
			        "start": 33.68,
			        "word": " a",
			      },
			      {
			        "end": 33.98,
			        "start": 33.75,
			        "word": " dog",
			      },
			      {
			        "end": 34.21,
			        "start": 33.98,
			        "word": " bre",
			      },
			      {
			        "end": 34.52,
			        "start": 34.21,
			        "word": "eder",
			      },
			      {
			        "end": 34.67,
			        "start": 34.52,
			        "word": " in",
			      },
			      {
			        "end": 35.07,
			        "start": 34.67,
			        "word": " Clear",
			      },
			      {
			        "end": 35.45,
			        "start": 35.07,
			        "word": " Creek",
			      },
			      {
			        "end": 36.02,
			        "start": 35.45,
			        "word": " County",
			      },
			      {
			        "end": 36.3,
			        "start": 36.02,
			        "word": " is",
			      },
			      {
			        "end": 36.37,
			        "start": 36.3,
			        "word": " in",
			      },
			      {
			        "end": 36.84,
			        "start": 36.37,
			        "word": " custody",
			      },
			      {
			        "end": 37.1,
			        "start": 36.84,
			        "word": " this",
			      },
			      {
			        "end": 37.75,
			        "start": 37.1,
			        "word": " afternoon",
			      },
			    ],
			  },
			  {
			    "end": 44.5,
			    "start": 38,
			    "text": "The sheriff's office says 36-year-old Anna Ferrer was booked into jail Friday after she was extradited from Nebraska.",
			    "words": [
			      {
			        "end": 38.58,
			        "start": 38,
			        "word": " The",
			      },
			      {
			        "end": 38.64,
			        "start": 38.58,
			        "word": " sheriff",
			      },
			      {
			        "end": 38.76,
			        "start": 38.64,
			        "word": "'s",
			      },
			      {
			        "end": 39.15,
			        "start": 38.76,
			        "word": " office",
			      },
			      {
			        "end": 39.39,
			        "start": 39.15,
			        "word": " says",
			      },
			      {
			        "end": 39.83,
			        "start": 39.39,
			        "word": " 36",
			      },
			      {
			        "end": 39.88,
			        "start": 39.83,
			        "word": "-",
			      },
			      {
			        "end": 40.08,
			        "start": 39.88,
			        "word": "year",
			      },
			      {
			        "end": 40.18,
			        "start": 40.08,
			        "word": "-",
			      },
			      {
			        "end": 40.37,
			        "start": 40.18,
			        "word": "old",
			      },
			      {
			        "end": 40.58,
			        "start": 40.37,
			        "word": " Anna",
			      },
			      {
			        "end": 40.9,
			        "start": 40.58,
			        "word": " Fer",
			      },
			      {
			        "end": 40.96,
			        "start": 40.9,
			        "word": "rer",
			      },
			      {
			        "end": 41.25,
			        "start": 40.96,
			        "word": " was",
			      },
			      {
			        "end": 41.53,
			        "start": 41.25,
			        "word": " booked",
			      },
			      {
			        "end": 41.78,
			        "start": 41.53,
			        "word": " into",
			      },
			      {
			        "end": 42.06,
			        "start": 41.78,
			        "word": " jail",
			      },
			      {
			        "end": 42.41,
			        "start": 42.06,
			        "word": " Friday",
			      },
			      {
			        "end": 42.73,
			        "start": 42.41,
			        "word": " after",
			      },
			      {
			        "end": 42.92,
			        "start": 42.73,
			        "word": " she",
			      },
			      {
			        "end": 43.21,
			        "start": 42.92,
			        "word": " was",
			      },
			      {
			        "end": 43.3,
			        "start": 43.21,
			        "word": " ext",
			      },
			      {
			        "end": 43.49,
			        "start": 43.3,
			        "word": "rad",
			      },
			      {
			        "end": 43.78,
			        "start": 43.49,
			        "word": "ited",
			      },
			      {
			        "end": 43.99,
			        "start": 43.78,
			        "word": " from",
			      },
			      {
			        "end": 44.5,
			        "start": 43.99,
			        "word": " Nebraska",
			      },
			    ],
			  },
			  {
			    "end": 49.73,
			    "start": 44.88,
			    "text": "Right now, she's being held on suspicion of accessory to a crime and tampering with physical evidence.",
			    "words": [
			      {
			        "end": 45.33,
			        "start": 44.88,
			        "word": " Right",
			      },
			      {
			        "end": 45.36,
			        "start": 45.33,
			        "word": " now",
			      },
			      {
			        "end": 45.44,
			        "start": 45.36,
			        "word": ",",
			      },
			      {
			        "end": 45.61,
			        "start": 45.44,
			        "word": " she",
			      },
			      {
			        "end": 45.72,
			        "start": 45.61,
			        "word": "'s",
			      },
			      {
			        "end": 46,
			        "start": 45.72,
			        "word": " being",
			      },
			      {
			        "end": 46.24,
			        "start": 46,
			        "word": " held",
			      },
			      {
			        "end": 46.34,
			        "start": 46.24,
			        "word": " on",
			      },
			      {
			        "end": 46.85,
			        "start": 46.34,
			        "word": " suspicion",
			      },
			      {
			        "end": 46.96,
			        "start": 46.85,
			        "word": " of",
			      },
			      {
			        "end": 47.55,
			        "start": 46.96,
			        "word": " accessory",
			      },
			      {
			        "end": 47.58,
			        "start": 47.55,
			        "word": " to",
			      },
			      {
			        "end": 47.63,
			        "start": 47.58,
			        "word": " a",
			      },
			      {
			        "end": 48.02,
			        "start": 47.63,
			        "word": " crime",
			      },
			      {
			        "end": 48.08,
			        "start": 48.02,
			        "word": " and",
			      },
			      {
			        "end": 48.25,
			        "start": 48.08,
			        "word": " tam",
			      },
			      {
			        "end": 48.62,
			        "start": 48.25,
			        "word": "pering",
			      },
			      {
			        "end": 48.82,
			        "start": 48.62,
			        "word": " with",
			      },
			      {
			        "end": 49.3,
			        "start": 48.82,
			        "word": " physical",
			      },
			      {
			        "end": 49.73,
			        "start": 49.3,
			        "word": " evidence",
			      },
			    ],
			  },
			  {
			    "end": 54,
			    "start": 50.02,
			    "text": "Her husband, Sergio Ferrer, is accused of shooting and killing Paul Peavy.",
			    "words": [
			      {
			        "end": 50.38,
			        "start": 50.02,
			        "word": " Her",
			      },
			      {
			        "end": 50.71,
			        "start": 50.38,
			        "word": " husband",
			      },
			      {
			        "end": 50.75,
			        "start": 50.71,
			        "word": ",",
			      },
			      {
			        "end": 51.12,
			        "start": 50.75,
			        "word": " Sergio",
			      },
			      {
			        "end": 51.3,
			        "start": 51.12,
			        "word": " Fer",
			      },
			      {
			        "end": 51.53,
			        "start": 51.3,
			        "word": "rer",
			      },
			      {
			        "end": 51.6,
			        "start": 51.53,
			        "word": ",",
			      },
			      {
			        "end": 51.72,
			        "start": 51.6,
			        "word": " is",
			      },
			      {
			        "end": 52.19,
			        "start": 51.72,
			        "word": " accused",
			      },
			      {
			        "end": 52.27,
			        "start": 52.19,
			        "word": " of",
			      },
			      {
			        "end": 52.81,
			        "start": 52.27,
			        "word": " shooting",
			      },
			      {
			        "end": 52.95,
			        "start": 52.81,
			        "word": " and",
			      },
			      {
			        "end": 53.38,
			        "start": 52.95,
			        "word": " killing",
			      },
			      {
			        "end": 53.72,
			        "start": 53.38,
			        "word": " Paul",
			      },
			      {
			        "end": 53.75,
			        "start": 53.72,
			        "word": " Pe",
			      },
			      {
			        "end": 54,
			        "start": 53.75,
			        "word": "avy",
			      },
			    ],
			  },
			  {
			    "end": 56.35,
			    "start": 54.22,
			    "text": "Peavy bred and sold Doberman puppies.",
			    "words": [
			      {
			        "end": 54.54,
			        "start": 54.22,
			        "word": " Pe",
			      },
			      {
			        "end": 54.8,
			        "start": 54.54,
			        "word": "avy",
			      },
			      {
			        "end": 54.84,
			        "start": 54.8,
			        "word": " bred",
			      },
			      {
			        "end": 55.05,
			        "start": 54.84,
			        "word": " and",
			      },
			      {
			        "end": 55.33,
			        "start": 55.05,
			        "word": " sold",
			      },
			      {
			        "end": 55.55,
			        "start": 55.33,
			        "word": " Do",
			      },
			      {
			        "end": 55.67,
			        "start": 55.55,
			        "word": "ber",
			      },
			      {
			        "end": 55.87,
			        "start": 55.67,
			        "word": "man",
			      },
			      {
			        "end": 56.35,
			        "start": 55.87,
			        "word": " puppies",
			      },
			    ],
			  },
			  {
			    "end": 58.92,
			    "start": 56.6,
			    "text": "Several of those puppies are still missing today.",
			    "words": [
			      {
			        "end": 57.04,
			        "start": 56.6,
			        "word": " Several",
			      },
			      {
			        "end": 57.11,
			        "start": 57.04,
			        "word": " of",
			      },
			      {
			        "end": 57.38,
			        "start": 57.11,
			        "word": " those",
			      },
			      {
			        "end": 57.8,
			        "start": 57.38,
			        "word": " puppies",
			      },
			      {
			        "end": 57.97,
			        "start": 57.8,
			        "word": " are",
			      },
			      {
			        "end": 58.33,
			        "start": 57.97,
			        "word": " still",
			      },
			      {
			        "end": 58.66,
			        "start": 58.33,
			        "word": " missing",
			      },
			      {
			        "end": 58.92,
			        "start": 58.66,
			        "word": " today",
			      },
			    ],
			  },
			  {
			    "end": 65.02,
			    "start": 59.26,
			    "text": "New data is showing that more students in Colorado are choosing to use the state's anonymous reporting system.",
			    "words": [
			      {
			        "end": 59.27,
			        "start": 59.26,
			        "word": " New",
			      },
			      {
			        "end": 59.7,
			        "start": 59.27,
			        "word": " data",
			      },
			      {
			        "end": 59.98,
			        "start": 59.7,
			        "word": " is",
			      },
			      {
			        "end": 60.36,
			        "start": 59.98,
			        "word": " showing",
			      },
			      {
			        "end": 60.51,
			        "start": 60.36,
			        "word": " that",
			      },
			      {
			        "end": 60.76,
			        "start": 60.51,
			        "word": " more",
			      },
			      {
			        "end": 61.26,
			        "start": 60.76,
			        "word": " students",
			      },
			      {
			        "end": 61.47,
			        "start": 61.26,
			        "word": " in",
			      },
			      {
			        "end": 61.88,
			        "start": 61.47,
			        "word": " Colorado",
			      },
			      {
			        "end": 62.07,
			        "start": 61.88,
			        "word": " are",
			      },
			      {
			        "end": 62.57,
			        "start": 62.07,
			        "word": " choosing",
			      },
			      {
			        "end": 62.69,
			        "start": 62.57,
			        "word": " to",
			      },
			      {
			        "end": 62.88,
			        "start": 62.69,
			        "word": " use",
			      },
			      {
			        "end": 63.07,
			        "start": 62.88,
			        "word": " the",
			      },
			      {
			        "end": 63.38,
			        "start": 63.07,
			        "word": " state",
			      },
			      {
			        "end": 63.5,
			        "start": 63.38,
			        "word": "'s",
			      },
			      {
			        "end": 64.07,
			        "start": 63.5,
			        "word": " anonymous",
			      },
			      {
			        "end": 64.68,
			        "start": 64.07,
			        "word": " reporting",
			      },
			      {
			        "end": 65.02,
			        "start": 64.68,
			        "word": " system",
			      },
			    ],
			  },
			  {
			    "end": 73.18,
			    "start": 65.32,
			    "text": "Numbers from the state attorney general's office show students have submitted more than 23,000 safe-to-tell reports so far this school year.",
			    "words": [
			      {
			        "end": 65.48,
			        "start": 65.32,
			        "word": " Num",
			      },
			      {
			        "end": 65.92,
			        "start": 65.48,
			        "word": "bers",
			      },
			      {
			        "end": 65.98,
			        "start": 65.92,
			        "word": " from",
			      },
			      {
			        "end": 66.16,
			        "start": 65.98,
			        "word": " the",
			      },
			      {
			        "end": 66.46,
			        "start": 66.16,
			        "word": " state",
			      },
			      {
			        "end": 66.95,
			        "start": 66.46,
			        "word": " attorney",
			      },
			      {
			        "end": 67.38,
			        "start": 66.95,
			        "word": " general",
			      },
			      {
			        "end": 67.49,
			        "start": 67.38,
			        "word": "'s",
			      },
			      {
			        "end": 67.86,
			        "start": 67.49,
			        "word": " office",
			      },
			      {
			        "end": 68.1,
			        "start": 67.86,
			        "word": " show",
			      },
			      {
			        "end": 68.59,
			        "start": 68.1,
			        "word": " students",
			      },
			      {
			        "end": 68.84,
			        "start": 68.59,
			        "word": " have",
			      },
			      {
			        "end": 69.38,
			        "start": 68.84,
			        "word": " submitted",
			      },
			      {
			        "end": 69.62,
			        "start": 69.38,
			        "word": " more",
			      },
			      {
			        "end": 69.92,
			        "start": 69.62,
			        "word": " than",
			      },
			      {
			        "end": 70.23,
			        "start": 69.92,
			        "word": " 23",
			      },
			      {
			        "end": 70.34,
			        "start": 70.23,
			        "word": ",",
			      },
			      {
			        "end": 70.89,
			        "start": 70.34,
			        "word": "000",
			      },
			      {
			        "end": 71.11,
			        "start": 70.89,
			        "word": " safe",
			      },
			      {
			        "end": 71.19,
			        "start": 71.11,
			        "word": "-",
			      },
			      {
			        "end": 71.37,
			        "start": 71.19,
			        "word": "to",
			      },
			      {
			        "end": 71.43,
			        "start": 71.37,
			        "word": "-",
			      },
			      {
			        "end": 71.48,
			        "start": 71.43,
			        "word": "t",
			      },
			      {
			        "end": 71.66,
			        "start": 71.48,
			        "word": "ell",
			      },
			      {
			        "end": 72.04,
			        "start": 71.66,
			        "word": " reports",
			      },
			      {
			        "end": 72.16,
			        "start": 72.04,
			        "word": " so",
			      },
			      {
			        "end": 72.56,
			        "start": 72.16,
			        "word": " far",
			      },
			      {
			        "end": 72.58,
			        "start": 72.56,
			        "word": " this",
			      },
			      {
			        "end": 72.94,
			        "start": 72.58,
			        "word": " school",
			      },
			      {
			        "end": 73.18,
			        "start": 72.94,
			        "word": " year",
			      },
			    ],
			  },
			  {
			    "end": 77.04,
			    "start": 73.52,
			    "text": "That's a 15% jump from this time last year.",
			    "words": [
			      {
			        "end": 74.01,
			        "start": 73.52,
			        "word": " That",
			      },
			      {
			        "end": 74.06,
			        "start": 74.01,
			        "word": "'s",
			      },
			      {
			        "end": 74.15,
			        "start": 74.06,
			        "word": " a",
			      },
			      {
			        "end": 74.69,
			        "start": 74.15,
			        "word": " 15",
			      },
			      {
			        "end": 74.95,
			        "start": 74.69,
			        "word": "%",
			      },
			      {
			        "end": 75.19,
			        "start": 74.95,
			        "word": " jump",
			      },
			      {
			        "end": 75.5,
			        "start": 75.19,
			        "word": " from",
			      },
			      {
			        "end": 75.86,
			        "start": 75.5,
			        "word": " this",
			      },
			      {
			        "end": 76.22,
			        "start": 75.86,
			        "word": " time",
			      },
			      {
			        "end": 76.58,
			        "start": 76.22,
			        "word": " last",
			      },
			      {
			        "end": 77.04,
			        "start": 76.58,
			        "word": " year",
			      },
			    ],
			  },
			  {
			    "end": 82.39,
			    "start": 77.73,
			    "text": "The bulk of this month's reports focused on school safety, bullying, and mental health concerns.",
			    "words": [
			      {
			        "end": 77.89,
			        "start": 77.73,
			        "word": " The",
			      },
			      {
			        "end": 78.11,
			        "start": 77.89,
			        "word": " bulk",
			      },
			      {
			        "end": 78.21,
			        "start": 78.11,
			        "word": " of",
			      },
			      {
			        "end": 78.44,
			        "start": 78.21,
			        "word": " this",
			      },
			      {
			        "end": 78.75,
			        "start": 78.44,
			        "word": " month",
			      },
			      {
			        "end": 78.83,
			        "start": 78.75,
			        "word": "'s",
			      },
			      {
			        "end": 79.23,
			        "start": 78.83,
			        "word": " reports",
			      },
			      {
			        "end": 79.63,
			        "start": 79.23,
			        "word": " focused",
			      },
			      {
			        "end": 79.86,
			        "start": 79.63,
			        "word": " on",
			      },
			      {
			        "end": 80.08,
			        "start": 79.86,
			        "word": " school",
			      },
			      {
			        "end": 80.42,
			        "start": 80.08,
			        "word": " safety",
			      },
			      {
			        "end": 80.85,
			        "start": 80.42,
			        "word": ",",
			      },
			      {
			        "end": 80.98,
			        "start": 80.85,
			        "word": " bullying",
			      },
			      {
			        "end": 81.09,
			        "start": 80.98,
			        "word": ",",
			      },
			      {
			        "end": 81.26,
			        "start": 81.09,
			        "word": " and",
			      },
			      {
			        "end": 81.6,
			        "start": 81.26,
			        "word": " mental",
			      },
			      {
			        "end": 81.93,
			        "start": 81.6,
			        "word": " health",
			      },
			      {
			        "end": 82.39,
			        "start": 81.93,
			        "word": " concerns",
			      },
			    ],
			  },
			  {
			    "end": 86.36,
			    "start": 82.64,
			    "text": "All three of those categories made up more than 70% of all submissions.",
			    "words": [
			      {
			        "end": 83.07,
			        "start": 82.64,
			        "word": " All",
			      },
			      {
			        "end": 83.12,
			        "start": 83.07,
			        "word": " three",
			      },
			      {
			        "end": 83.28,
			        "start": 83.12,
			        "word": " of",
			      },
			      {
			        "end": 83.54,
			        "start": 83.28,
			        "word": " those",
			      },
			      {
			        "end": 84.14,
			        "start": 83.54,
			        "word": " categories",
			      },
			      {
			        "end": 84.38,
			        "start": 84.14,
			        "word": " made",
			      },
			      {
			        "end": 84.5,
			        "start": 84.38,
			        "word": " up",
			      },
			      {
			        "end": 84.74,
			        "start": 84.5,
			        "word": " more",
			      },
			      {
			        "end": 85.06,
			        "start": 84.74,
			        "word": " than",
			      },
			      {
			        "end": 85.34,
			        "start": 85.06,
			        "word": " 70",
			      },
			      {
			        "end": 85.46,
			        "start": 85.34,
			        "word": "%",
			      },
			      {
			        "end": 85.52,
			        "start": 85.46,
			        "word": " of",
			      },
			      {
			        "end": 85.7,
			        "start": 85.52,
			        "word": " all",
			      },
			      {
			        "end": 86.36,
			        "start": 85.7,
			        "word": " submissions",
			      },
			    ],
			  },
			  {
			    "end": 91.51,
			    "start": 86.6,
			    "text": "Students can use the system anytime through the Safe-to-Tell website, mobile app, or hotline.",
			    "words": [
			      {
			        "end": 87.26,
			        "start": 86.6,
			        "word": " Students",
			      },
			      {
			        "end": 87.27,
			        "start": 87.26,
			        "word": " can",
			      },
			      {
			        "end": 87.45,
			        "start": 87.27,
			        "word": " use",
			      },
			      {
			        "end": 87.63,
			        "start": 87.45,
			        "word": " the",
			      },
			      {
			        "end": 88,
			        "start": 87.63,
			        "word": " system",
			      },
			      {
			        "end": 88.43,
			        "start": 88,
			        "word": " anytime",
			      },
			      {
			        "end": 88.86,
			        "start": 88.43,
			        "word": " through",
			      },
			      {
			        "end": 89.07,
			        "start": 88.86,
			        "word": " the",
			      },
			      {
			        "end": 89.32,
			        "start": 89.07,
			        "word": " Safe",
			      },
			      {
			        "end": 89.34,
			        "start": 89.32,
			        "word": "-",
			      },
			      {
			        "end": 89.48,
			        "start": 89.34,
			        "word": "to",
			      },
			      {
			        "end": 89.52,
			        "start": 89.48,
			        "word": "-",
			      },
			      {
			        "end": 89.62,
			        "start": 89.52,
			        "word": "T",
			      },
			      {
			        "end": 89.76,
			        "start": 89.62,
			        "word": "ell",
			      },
			      {
			        "end": 90.19,
			        "start": 89.76,
			        "word": " website",
			      },
			      {
			        "end": 90.56,
			        "start": 90.19,
			        "word": ",",
			      },
			      {
			        "end": 90.68,
			        "start": 90.56,
			        "word": " mobile",
			      },
			      {
			        "end": 90.86,
			        "start": 90.68,
			        "word": " app",
			      },
			      {
			        "end": 90.98,
			        "start": 90.86,
			        "word": ",",
			      },
			      {
			        "end": 91.12,
			        "start": 90.98,
			        "word": " or",
			      },
			      {
			        "end": 91.28,
			        "start": 91.12,
			        "word": " hot",
			      },
			      {
			        "end": 91.51,
			        "start": 91.28,
			        "word": "line",
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
