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

describe('align', () => {
	test('alignWordsAndSentences', async () => {
		const { words } = await getWords()
		const sentences = [
			'There are concerns tonight over the future of education,',
			"this following President Trump's signed executive order",
			'to dismantle the Department of Education.',
			"NBC4's Robert Kovacic is here now with what this means",
			'and where the impacts could be felt.',
			'Robert. Carolyn, first of all, the White House is pointing to low test scores',
			'as one of the reasons for shaking things up.',
			'The latest national report card showing 40 percent of fourth graders',
			"don't meet basic benchmarks for reading",
			'despite increases in federal funding.',
			'Meantime, as you see right here, there are Save Our School rallies',
			'all across the country, including Denver.',
			'But tonight, right here in California, some are predicting dire ramifications.',
			'President Trump tonight looking to keep a campaign promise.',
			'I will sign an executive order to begin eliminating the federal Department of Education',
			'once and for all.',
			'At a White House event with school children and Republican governors.',
			"The Democrats know it's right and I hope they're going to be voting for it",
			'because ultimately it may come before them.',
			"That's because this order may have little practical impact.",
			'Only Congress can abolish an executive agency, a move Democrats oppose.',
			'Education Secretary Linda McMahon promising full transparency with Congress.',
			"Because we'll convince them that students are going to be better served",
			'by eliminating the bureaucracy of the Department of Education.',
			'The White House said today core department responsibilities',
			'like managing student loans and Pell Grants',
			'and supporting special education will be preserved.',
			'Beyond these core necessities, my administration will take all lawful steps',
			'to shut down the department.',
			"He's trying to make it seem like this horrible thing isn't as horrible as-",
			'California Attorney General Rob Bonta telling NBC4 California public schools',
			'get 10-20% from the DOE.',
			"So it's billions of dollars to us too that are in the form of student loans.",
			'It does hurt poor kids.',
			"It does hurt kids' civil rights.",
			"It does hurt kids' dreams of going to college.",
			"There's no way around it.",
			'Bonta echoing the message from the American Federation of Teachers Union.',
			'See you in court.',
			'As for Los Angeles County.',
			'We received annually about $1.2 billion of federal investment.',
			'The largest program, the Title I program.',
			'About $470 million benefiting the poorest of the poor in our school district.',
			'The superintendent of the LAUSD warning of the impact',
			"on the nation's second largest school district.",
			'Any significant change to the appropriation level',
			'undermining current funding levels could prove to be catastrophic',
			'in terms of the quality of education kids get.',
			'Tonight, Governor Newsom releasing this statement regarding the decision.',
			'This overreach needs to be rejected immediately by a co-branch of government.',
			'Or was Congress eliminated by this executive order too?',
			"I'm Robert Kvasek.",
		]

		const result = alignWordsAndSentences(words, sentences)
		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "end": 2.98,
			    "start": 0,
			    "text": "There are concerns tonight over the future of education,",
			    "words": [
			      {
			        "end": 0.47,
			        "start": 0,
			        "word": " There",
			      },
			      {
			        "end": 0.51,
			        "start": 0.47,
			        "word": " are",
			      },
			      {
			        "end": 1.02,
			        "start": 0.51,
			        "word": " concerns",
			      },
			      {
			        "end": 1.47,
			        "start": 1.02,
			        "word": " tonight",
			      },
			      {
			        "end": 1.72,
			        "start": 1.47,
			        "word": " over",
			      },
			      {
			        "end": 1.99,
			        "start": 1.72,
			        "word": " the",
			      },
			      {
			        "end": 2.29,
			        "start": 1.99,
			        "word": " future",
			      },
			      {
			        "end": 2.44,
			        "start": 2.29,
			        "word": " of",
			      },
			      {
			        "end": 2.98,
			        "start": 2.44,
			        "word": " education",
			      },
			    ],
			  },
			  {
			    "end": 6.11,
			    "start": 3.15,
			    "text": "this following President Trump's signed executive order",
			    "words": [
			      {
			        "end": 3.5,
			        "start": 3.15,
			        "word": " this",
			      },
			      {
			        "end": 4.1,
			        "start": 3.5,
			        "word": " following",
			      },
			      {
			        "end": 4.57,
			        "start": 4.1,
			        "word": " President",
			      },
			      {
			        "end": 4.84,
			        "start": 4.57,
			        "word": " Trump",
			      },
			      {
			        "end": 4.98,
			        "start": 4.84,
			        "word": "'s",
			      },
			      {
			        "end": 5.32,
			        "start": 4.98,
			        "word": " signed",
			      },
			      {
			        "end": 5.83,
			        "start": 5.32,
			        "word": " executive",
			      },
			      {
			        "end": 6.11,
			        "start": 5.83,
			        "word": " order",
			      },
			    ],
			  },
			  {
			    "end": 8.07,
			    "start": 6.11,
			    "text": "to dismantle the Department of Education.",
			    "words": [
			      {
			        "end": 6.24,
			        "start": 6.11,
			        "word": " to",
			      },
			      {
			        "end": 6.61,
			        "start": 6.24,
			        "word": " dismant",
			      },
			      {
			        "end": 6.72,
			        "start": 6.61,
			        "word": "le",
			      },
			      {
			        "end": 6.88,
			        "start": 6.72,
			        "word": " the",
			      },
			      {
			        "end": 7.45,
			        "start": 6.88,
			        "word": " Department",
			      },
			      {
			        "end": 7.56,
			        "start": 7.45,
			        "word": " of",
			      },
			      {
			        "end": 8.07,
			        "start": 7.56,
			        "word": " Education",
			      },
			    ],
			  },
			  {
			    "end": 11.64,
			    "start": 8.28,
			    "text": "NBC4's Robert Kovacic is here now with what this means",
			    "words": [
			      {
			        "end": 8.7,
			        "start": 8.28,
			        "word": " NBC",
			      },
			      {
			        "end": 8.84,
			        "start": 8.7,
			        "word": "4",
			      },
			      {
			        "end": 9.07,
			        "start": 8.84,
			        "word": "'s",
			      },
			      {
			        "end": 9.67,
			        "start": 9.07,
			        "word": " Robert",
			      },
			      {
			        "end": 9.68,
			        "start": 9.67,
			        "word": " K",
			      },
			      {
			        "end": 9.82,
			        "start": 9.68,
			        "word": "ov",
			      },
			      {
			        "end": 9.97,
			        "start": 9.82,
			        "word": "ac",
			      },
			      {
			        "end": 10.14,
			        "start": 9.97,
			        "word": "ic",
			      },
			      {
			        "end": 10.24,
			        "start": 10.14,
			        "word": " is",
			      },
			      {
			        "end": 10.44,
			        "start": 10.24,
			        "word": " here",
			      },
			      {
			        "end": 10.62,
			        "start": 10.44,
			        "word": " now",
			      },
			      {
			        "end": 11.05,
			        "start": 10.62,
			        "word": " with",
			      },
			      {
			        "end": 11.1,
			        "start": 11.05,
			        "word": " what",
			      },
			      {
			        "end": 11.34,
			        "start": 11.1,
			        "word": " this",
			      },
			      {
			        "end": 11.64,
			        "start": 11.34,
			        "word": " means",
			      },
			    ],
			  },
			  {
			    "end": 13.39,
			    "start": 11.64,
			    "text": "and where the impacts could be felt.",
			    "words": [
			      {
			        "end": 11.82,
			        "start": 11.64,
			        "word": " and",
			      },
			      {
			        "end": 12.12,
			        "start": 11.82,
			        "word": " where",
			      },
			      {
			        "end": 12.3,
			        "start": 12.12,
			        "word": " the",
			      },
			      {
			        "end": 12.72,
			        "start": 12.3,
			        "word": " impacts",
			      },
			      {
			        "end": 13.02,
			        "start": 12.72,
			        "word": " could",
			      },
			      {
			        "end": 13.14,
			        "start": 13.02,
			        "word": " be",
			      },
			      {
			        "end": 13.39,
			        "start": 13.14,
			        "word": " felt",
			      },
			    ],
			  },
			  {
			    "end": 17.59,
			    "start": 13.6,
			    "text": "Robert. Carolyn, first of all, the White House is pointing to low test scores",
			    "words": [
			      {
			        "end": 13.94,
			        "start": 13.6,
			        "word": " Robert",
			      },
			      {
			        "end": 14.18,
			        "start": 13.94,
			        "word": ".",
			      },
			      {
			        "end": 14.47,
			        "start": 14.18,
			        "word": " Carolyn",
			      },
			      {
			        "end": 14.55,
			        "start": 14.47,
			        "word": ",",
			      },
			      {
			        "end": 14.75,
			        "start": 14.55,
			        "word": " first",
			      },
			      {
			        "end": 14.9,
			        "start": 14.75,
			        "word": " of",
			      },
			      {
			        "end": 14.95,
			        "start": 14.9,
			        "word": " all",
			      },
			      {
			        "end": 15.06,
			        "start": 14.95,
			        "word": ",",
			      },
			      {
			        "end": 15.26,
			        "start": 15.06,
			        "word": " the",
			      },
			      {
			        "end": 15.6,
			        "start": 15.26,
			        "word": " White",
			      },
			      {
			        "end": 15.92,
			        "start": 15.6,
			        "word": " House",
			      },
			      {
			        "end": 16.05,
			        "start": 15.92,
			        "word": " is",
			      },
			      {
			        "end": 16.59,
			        "start": 16.05,
			        "word": " pointing",
			      },
			      {
			        "end": 16.72,
			        "start": 16.59,
			        "word": " to",
			      },
			      {
			        "end": 16.91,
			        "start": 16.72,
			        "word": " low",
			      },
			      {
			        "end": 17.19,
			        "start": 16.91,
			        "word": " test",
			      },
			      {
			        "end": 17.59,
			        "start": 17.19,
			        "word": " scores",
			      },
			    ],
			  },
			  {
			    "end": 19.92,
			    "start": 17.59,
			    "text": "as one of the reasons for shaking things up.",
			    "words": [
			      {
			        "end": 17.72,
			        "start": 17.59,
			        "word": " as",
			      },
			      {
			        "end": 17.92,
			        "start": 17.72,
			        "word": " one",
			      },
			      {
			        "end": 18.05,
			        "start": 17.92,
			        "word": " of",
			      },
			      {
			        "end": 18.25,
			        "start": 18.05,
			        "word": " the",
			      },
			      {
			        "end": 18.72,
			        "start": 18.25,
			        "word": " reasons",
			      },
			      {
			        "end": 18.97,
			        "start": 18.72,
			        "word": " for",
			      },
			      {
			        "end": 19.39,
			        "start": 18.97,
			        "word": " shaking",
			      },
			      {
			        "end": 19.79,
			        "start": 19.39,
			        "word": " things",
			      },
			      {
			        "end": 19.92,
			        "start": 19.79,
			        "word": " up",
			      },
			    ],
			  },
			  {
			    "end": 24,
			    "start": 20.2,
			    "text": "The latest national report card showing 40 percent of fourth graders",
			    "words": [
			      {
			        "end": 20.58,
			        "start": 20.2,
			        "word": " The",
			      },
			      {
			        "end": 20.75,
			        "start": 20.58,
			        "word": " latest",
			      },
			      {
			        "end": 21.26,
			        "start": 20.75,
			        "word": " national",
			      },
			      {
			        "end": 21.61,
			        "start": 21.26,
			        "word": " report",
			      },
			      {
			        "end": 21.85,
			        "start": 21.61,
			        "word": " card",
			      },
			      {
			        "end": 22.36,
			        "start": 21.85,
			        "word": " showing",
			      },
			      {
			        "end": 22.65,
			        "start": 22.36,
			        "word": " 40",
			      },
			      {
			        "end": 23.07,
			        "start": 22.65,
			        "word": " percent",
			      },
			      {
			        "end": 23.28,
			        "start": 23.07,
			        "word": " of",
			      },
			      {
			        "end": 23.57,
			        "start": 23.28,
			        "word": " fourth",
			      },
			      {
			        "end": 24,
			        "start": 23.57,
			        "word": " graders",
			      },
			    ],
			  },
			  {
			    "end": 26.41,
			    "start": 24,
			    "text": "don't meet basic benchmarks for reading",
			    "words": [
			      {
			        "end": 24.18,
			        "start": 24,
			        "word": " don",
			      },
			      {
			        "end": 24.36,
			        "start": 24.18,
			        "word": "'t",
			      },
			      {
			        "end": 24.59,
			        "start": 24.36,
			        "word": " meet",
			      },
			      {
			        "end": 25.16,
			        "start": 24.59,
			        "word": " basic",
			      },
			      {
			        "end": 25.3,
			        "start": 25.16,
			        "word": "",
			      },
			      {
			        "end": 25.79,
			        "start": 25.3,
			        "word": " benchmarks",
			      },
			      {
			        "end": 25.98,
			        "start": 25.79,
			        "word": " for",
			      },
			      {
			        "end": 26.41,
			        "start": 25.98,
			        "word": " reading",
			      },
			    ],
			  },
			  {
			    "end": 28.41,
			    "start": 26.41,
			    "text": "despite increases in federal funding.",
			    "words": [
			      {
			        "end": 26.9,
			        "start": 26.41,
			        "word": " despite",
			      },
			      {
			        "end": 27.41,
			        "start": 26.9,
			        "word": " increases",
			      },
			      {
			        "end": 27.55,
			        "start": 27.41,
			        "word": " in",
			      },
			      {
			        "end": 27.97,
			        "start": 27.55,
			        "word": " federal",
			      },
			      {
			        "end": 28.41,
			        "start": 27.97,
			        "word": " funding",
			      },
			    ],
			  },
			  {
			    "end": 32.38,
			    "start": 28.59,
			    "text": "Meantime, as you see right here, there are Save Our School rallies",
			    "words": [
			      {
			        "end": 28.71,
			        "start": 28.59,
			        "word": " Me",
			      },
			      {
			        "end": 29.01,
			        "start": 28.71,
			        "word": "ant",
			      },
			      {
			        "end": 29.07,
			        "start": 29.01,
			        "word": "ime",
			      },
			      {
			        "end": 29.19,
			        "start": 29.07,
			        "word": ",",
			      },
			      {
			        "end": 29.31,
			        "start": 29.19,
			        "word": " as",
			      },
			      {
			        "end": 29.49,
			        "start": 29.31,
			        "word": " you",
			      },
			      {
			        "end": 29.67,
			        "start": 29.49,
			        "word": " see",
			      },
			      {
			        "end": 30.21,
			        "start": 29.67,
			        "word": " right",
			      },
			      {
			        "end": 30.34,
			        "start": 30.21,
			        "word": " here",
			      },
			      {
			        "end": 30.48,
			        "start": 30.34,
			        "word": ",",
			      },
			      {
			        "end": 30.86,
			        "start": 30.48,
			        "word": " there",
			      },
			      {
			        "end": 31.02,
			        "start": 30.86,
			        "word": " are",
			      },
			      {
			        "end": 31.29,
			        "start": 31.02,
			        "word": " Save",
			      },
			      {
			        "end": 31.49,
			        "start": 31.29,
			        "word": " Our",
			      },
			      {
			        "end": 31.9,
			        "start": 31.49,
			        "word": " School",
			      },
			      {
			        "end": 32.38,
			        "start": 31.9,
			        "word": " rallies",
			      },
			    ],
			  },
			  {
			    "end": 34.82,
			    "start": 32.38,
			    "text": "all across the country, including Denver.",
			    "words": [
			      {
			        "end": 32.58,
			        "start": 32.38,
			        "word": " all",
			      },
			      {
			        "end": 33.02,
			        "start": 32.58,
			        "word": " across",
			      },
			      {
			        "end": 33.19,
			        "start": 33.02,
			        "word": " the",
			      },
			      {
			        "end": 33.69,
			        "start": 33.19,
			        "word": " country",
			      },
			      {
			        "end": 33.8,
			        "start": 33.69,
			        "word": ",",
			      },
			      {
			        "end": 34.41,
			        "start": 33.8,
			        "word": " including",
			      },
			      {
			        "end": 34.82,
			        "start": 34.41,
			        "word": " Denver",
			      },
			    ],
			  },
			  {
			    "end": 42.57,
			    "start": 35.08,
			    "text": "But tonight, right here in California, some are predicting dire ramifications.",
			    "words": [
			      {
			        "end": 35.59,
			        "start": 35.08,
			        "word": " But",
			      },
			      {
			        "end": 35.94,
			        "start": 35.59,
			        "word": " tonight",
			      },
			      {
			        "end": 36.12,
			        "start": 35.94,
			        "word": ",",
			      },
			      {
			        "end": 36.52,
			        "start": 36.12,
			        "word": " right",
			      },
			      {
			        "end": 36.84,
			        "start": 36.52,
			        "word": " here",
			      },
			      {
			        "end": 37,
			        "start": 36.84,
			        "word": " in",
			      },
			      {
			        "end": 37.8,
			        "start": 37,
			        "word": " California",
			      },
			      {
			        "end": 38.23,
			        "start": 37.8,
			        "word": ",",
			      },
			      {
			        "end": 38.28,
			        "start": 38.23,
			        "word": " some",
			      },
			      {
			        "end": 38.52,
			        "start": 38.28,
			        "word": " are",
			      },
			      {
			        "end": 39.32,
			        "start": 38.52,
			        "word": " predicting",
			      },
			      {
			        "end": 39.66,
			        "start": 39.32,
			        "word": " dire",
			      },
			      {
			        "end": 39.88,
			        "start": 39.66,
			        "word": " ram",
			      },
			      {
			        "end": 40.69,
			        "start": 39.88,
			        "word": "ifications",
			      },
			      {
			        "end": 40.98,
			        "start": 40.69,
			        "word": ".",
			      },
			      {
			        "end": 42.09,
			        "start": 40.98,
			        "word": " President",
			      },
			      {
			        "end": 42.57,
			        "start": 42.09,
			        "word": " Trump",
			      },
			    ],
			  },
			  {
			    "end": 51.56,
			    "start": 45.48,
			    "text": "I will sign an executive order to begin eliminating the federal Department of Education",
			    "words": [
			      {
			        "end": 45.54,
			        "start": 45.48,
			        "word": " I",
			      },
			      {
			        "end": 45.81,
			        "start": 45.54,
			        "word": " will",
			      },
			      {
			        "end": 46.08,
			        "start": 45.81,
			        "word": " sign",
			      },
			      {
			        "end": 46.21,
			        "start": 46.08,
			        "word": " an",
			      },
			      {
			        "end": 46.86,
			        "start": 46.21,
			        "word": " executive",
			      },
			      {
			        "end": 47.2,
			        "start": 46.86,
			        "word": " order",
			      },
			      {
			        "end": 47.6,
			        "start": 47.2,
			        "word": " to",
			      },
			      {
			        "end": 48.02,
			        "start": 47.6,
			        "word": " begin",
			      },
			      {
			        "end": 48.95,
			        "start": 48.02,
			        "word": " eliminating",
			      },
			      {
			        "end": 49.2,
			        "start": 48.95,
			        "word": " the",
			      },
			      {
			        "end": 49.78,
			        "start": 49.2,
			        "word": " federal",
			      },
			      {
			        "end": 50.64,
			        "start": 49.78,
			        "word": " Department",
			      },
			      {
			        "end": 50.81,
			        "start": 50.64,
			        "word": " of",
			      },
			      {
			        "end": 51.56,
			        "start": 50.81,
			        "word": " Education",
			      },
			    ],
			  },
			  {
			    "end": 52.66,
			    "start": 51.56,
			    "text": "once and for all.",
			    "words": [
			      {
			        "end": 51.91,
			        "start": 51.56,
			        "word": " once",
			      },
			      {
			        "end": 52.16,
			        "start": 51.91,
			        "word": " and",
			      },
			      {
			        "end": 52.41,
			        "start": 52.16,
			        "word": " for",
			      },
			      {
			        "end": 52.66,
			        "start": 52.41,
			        "word": " all",
			      },
			    ],
			  },
			  {
			    "end": 57.2,
			    "start": 53.72,
			    "text": "At a White House event with school children and Republican governors.",
			    "words": [
			      {
			        "end": 53.84,
			        "start": 53.72,
			        "word": " At",
			      },
			      {
			        "end": 53.9,
			        "start": 53.84,
			        "word": " a",
			      },
			      {
			        "end": 54.2,
			        "start": 53.9,
			        "word": " White",
			      },
			      {
			        "end": 54.5,
			        "start": 54.2,
			        "word": " House",
			      },
			      {
			        "end": 54.8,
			        "start": 54.5,
			        "word": " event",
			      },
			      {
			        "end": 55.04,
			        "start": 54.8,
			        "word": " with",
			      },
			      {
			        "end": 55.4,
			        "start": 55.04,
			        "word": " school",
			      },
			      {
			        "end": 55.88,
			        "start": 55.4,
			        "word": " children",
			      },
			      {
			        "end": 56.06,
			        "start": 55.88,
			        "word": " and",
			      },
			      {
			        "end": 56.66,
			        "start": 56.06,
			        "word": " Republican",
			      },
			      {
			        "end": 57.2,
			        "start": 56.66,
			        "word": " governors",
			      },
			    ],
			  },
			  {
			    "end": 61.12,
			    "start": 57.42,
			    "text": "The Democrats know it's right and I hope they're going to be voting for it",
			    "words": [
			      {
			        "end": 57.63,
			        "start": 57.42,
			        "word": " The",
			      },
			      {
			        "end": 58.27,
			        "start": 57.63,
			        "word": " Democrats",
			      },
			      {
			        "end": 58.55,
			        "start": 58.27,
			        "word": " know",
			      },
			      {
			        "end": 58.71,
			        "start": 58.55,
			        "word": " it",
			      },
			      {
			        "end": 58.83,
			        "start": 58.71,
			        "word": "'s",
			      },
			      {
			        "end": 59.18,
			        "start": 58.83,
			        "word": " right",
			      },
			      {
			        "end": 59.42,
			        "start": 59.18,
			        "word": " and",
			      },
			      {
			        "end": 59.47,
			        "start": 59.42,
			        "word": " I",
			      },
			      {
			        "end": 59.74,
			        "start": 59.47,
			        "word": " hope",
			      },
			      {
			        "end": 59.87,
			        "start": 59.74,
			        "word": " they",
			      },
			      {
			        "end": 60.02,
			        "start": 59.87,
			        "word": "'re",
			      },
			      {
			        "end": 60.11,
			        "start": 60.02,
			        "word": " going",
			      },
			      {
			        "end": 60.15,
			        "start": 60.11,
			        "word": " to",
			      },
			      {
			        "end": 60.2,
			        "start": 60.15,
			        "word": " be",
			      },
			      {
			        "end": 60.5,
			        "start": 60.2,
			        "word": " voting",
			      },
			      {
			        "end": 60.86,
			        "start": 60.5,
			        "word": " for",
			      },
			      {
			        "end": 61.12,
			        "start": 60.86,
			        "word": " it",
			      },
			    ],
			  },
			  {
			    "end": 63.08,
			    "start": 61.12,
			    "text": "because ultimately it may come before them.",
			    "words": [
			      {
			        "end": 61.38,
			        "start": 61.12,
			        "word": " because",
			      },
			      {
			        "end": 61.94,
			        "start": 61.38,
			        "word": " ultimately",
			      },
			      {
			        "end": 62.22,
			        "start": 61.94,
			        "word": " it",
			      },
			      {
			        "end": 62.42,
			        "start": 62.22,
			        "word": " may",
			      },
			      {
			        "end": 62.57,
			        "start": 62.42,
			        "word": " come",
			      },
			      {
			        "end": 62.88,
			        "start": 62.57,
			        "word": " before",
			      },
			      {
			        "end": 63.08,
			        "start": 62.88,
			        "word": " them",
			      },
			    ],
			  },
			  {
			    "end": 66.46,
			    "start": 63.26,
			    "text": "That's because this order may have little practical impact.",
			    "words": [
			      {
			        "end": 63.51,
			        "start": 63.26,
			        "word": " That",
			      },
			      {
			        "end": 63.63,
			        "start": 63.51,
			        "word": "'s",
			      },
			      {
			        "end": 64.1,
			        "start": 63.63,
			        "word": " because",
			      },
			      {
			        "end": 64.35,
			        "start": 64.1,
			        "word": " this",
			      },
			      {
			        "end": 64.65,
			        "start": 64.35,
			        "word": " order",
			      },
			      {
			        "end": 64.84,
			        "start": 64.65,
			        "word": " may",
			      },
			      {
			        "end": 65.06,
			        "start": 64.84,
			        "word": " have",
			      },
			      {
			        "end": 65.48,
			        "start": 65.06,
			        "word": " little",
			      },
			      {
			        "end": 66.06,
			        "start": 65.48,
			        "word": " practical",
			      },
			      {
			        "end": 66.46,
			        "start": 66.06,
			        "word": " impact",
			      },
			    ],
			  },
			  {
			    "end": 71.27,
			    "start": 66.71,
			    "text": "Only Congress can abolish an executive agency, a move Democrats oppose.",
			    "words": [
			      {
			        "end": 67.02,
			        "start": 66.71,
			        "word": " Only",
			      },
			      {
			        "end": 67.7,
			        "start": 67.02,
			        "word": " Congress",
			      },
			      {
			        "end": 67.92,
			        "start": 67.7,
			        "word": " can",
			      },
			      {
			        "end": 68.21,
			        "start": 67.92,
			        "word": " abol",
			      },
			      {
			        "end": 68.42,
			        "start": 68.21,
			        "word": "ish",
			      },
			      {
			        "end": 68.57,
			        "start": 68.42,
			        "word": " an",
			      },
			      {
			        "end": 69.23,
			        "start": 68.57,
			        "word": " executive",
			      },
			      {
			        "end": 69.63,
			        "start": 69.23,
			        "word": " agency",
			      },
			      {
			        "end": 69.82,
			        "start": 69.63,
			        "word": ",",
			      },
			      {
			        "end": 69.94,
			        "start": 69.82,
			        "word": " a",
			      },
			      {
			        "end": 70.17,
			        "start": 69.94,
			        "word": " move",
			      },
			      {
			        "end": 70.82,
			        "start": 70.17,
			        "word": " Democrats",
			      },
			      {
			        "end": 71.27,
			        "start": 70.82,
			        "word": " oppose",
			      },
			    ],
			  },
			  {
			    "end": 76.59,
			    "start": 71.49,
			    "text": "Education Secretary Linda McMahon promising full transparency with Congress.",
			    "words": [
			      {
			        "end": 72.23,
			        "start": 71.49,
			        "word": " Education",
			      },
			      {
			        "end": 72.81,
			        "start": 72.23,
			        "word": " Secretary",
			      },
			      {
			        "end": 73.18,
			        "start": 72.81,
			        "word": " Linda",
			      },
			      {
			        "end": 73.69,
			        "start": 73.18,
			        "word": " McMahon",
			      },
			      {
			        "end": 74.44,
			        "start": 73.69,
			        "word": " promising",
			      },
			      {
			        "end": 74.75,
			        "start": 74.44,
			        "word": " full",
			      },
			      {
			        "end": 75.66,
			        "start": 74.75,
			        "word": " transparency",
			      },
			      {
			        "end": 76.11,
			        "start": 75.66,
			        "word": " with",
			      },
			      {
			        "end": 76.59,
			        "start": 76.11,
			        "word": " Congress",
			      },
			    ],
			  },
			  {
			    "end": 80.59,
			    "start": 76.84,
			    "text": "Because we'll convince them that students are going to be better served",
			    "words": [
			      {
			        "end": 77.18,
			        "start": 76.84,
			        "word": " Because",
			      },
			      {
			        "end": 77.27,
			        "start": 77.18,
			        "word": " we",
			      },
			      {
			        "end": 77.41,
			        "start": 77.27,
			        "word": "'ll",
			      },
			      {
			        "end": 77.8,
			        "start": 77.41,
			        "word": " convince",
			      },
			      {
			        "end": 78.02,
			        "start": 77.8,
			        "word": " them",
			      },
			      {
			        "end": 78.44,
			        "start": 78.02,
			        "word": " that",
			      },
			      {
			        "end": 79.28,
			        "start": 78.44,
			        "word": " students",
			      },
			      {
			        "end": 79.5,
			        "start": 79.28,
			        "word": " are",
			      },
			      {
			        "end": 79.78,
			        "start": 79.5,
			        "word": " going",
			      },
			      {
			        "end": 79.87,
			        "start": 79.78,
			        "word": " to",
			      },
			      {
			        "end": 79.98,
			        "start": 79.87,
			        "word": " be",
			      },
			      {
			        "end": 80.22,
			        "start": 79.98,
			        "word": " better",
			      },
			      {
			        "end": 80.22,
			        "start": 80.22,
			        "word": "",
			      },
			      {
			        "end": 80.59,
			        "start": 80.22,
			        "word": " served",
			      },
			    ],
			  },
			  {
			    "end": 83.92,
			    "start": 80.59,
			    "text": "by eliminating the bureaucracy of the Department of Education.",
			    "words": [
			      {
			        "end": 80.71,
			        "start": 80.59,
			        "word": " by",
			      },
			      {
			        "end": 81.39,
			        "start": 80.71,
			        "word": " eliminating",
			      },
			      {
			        "end": 81.57,
			        "start": 81.39,
			        "word": " the",
			      },
			      {
			        "end": 82.33,
			        "start": 81.57,
			        "word": " bureaucracy",
			      },
			      {
			        "end": 82.37,
			        "start": 82.33,
			        "word": " of",
			      },
			      {
			        "end": 82.55,
			        "start": 82.37,
			        "word": " the",
			      },
			      {
			        "end": 83.17,
			        "start": 82.55,
			        "word": " Department",
			      },
			      {
			        "end": 83.29,
			        "start": 83.17,
			        "word": " of",
			      },
			      {
			        "end": 83.92,
			        "start": 83.29,
			        "word": " Education",
			      },
			    ],
			  },
			  {
			    "end": 86.92,
			    "start": 83.92,
			    "text": "The White House said today core department responsibilities",
			    "words": [
			      {
			        "end": 84.08,
			        "start": 83.92,
			        "word": " The",
			      },
			      {
			        "end": 84.35,
			        "start": 84.08,
			        "word": " White",
			      },
			      {
			        "end": 84.63,
			        "start": 84.35,
			        "word": " House",
			      },
			      {
			        "end": 84.84,
			        "start": 84.63,
			        "word": " said",
			      },
			      {
			        "end": 85.18,
			        "start": 84.84,
			        "word": " today",
			      },
			      {
			        "end": 85.33,
			        "start": 85.18,
			        "word": " core",
			      },
			      {
			        "end": 85.92,
			        "start": 85.33,
			        "word": " department",
			      },
			      {
			        "end": 86.92,
			        "start": 85.92,
			        "word": " responsibilities",
			      },
			    ],
			  },
			  {
			    "end": 89.59,
			    "start": 86.92,
			    "text": "like managing student loans and Pell Grants",
			    "words": [
			      {
			        "end": 87.26,
			        "start": 86.92,
			        "word": " like",
			      },
			      {
			        "end": 87.82,
			        "start": 87.26,
			        "word": " managing",
			      },
			      {
			        "end": 88.35,
			        "start": 87.82,
			        "word": " student",
			      },
			      {
			        "end": 88.72,
			        "start": 88.35,
			        "word": " loans",
			      },
			      {
			        "end": 88.72,
			        "start": 88.72,
			        "word": "",
			      },
			      {
			        "end": 88.85,
			        "start": 88.72,
			        "word": " and",
			      },
			      {
			        "end": 88.89,
			        "start": 88.85,
			        "word": " P",
			      },
			      {
			        "end": 89.02,
			        "start": 88.89,
			        "word": "ell",
			      },
			      {
			        "end": 89.11,
			        "start": 89.02,
			        "word": " Gr",
			      },
			      {
			        "end": 89.28,
			        "start": 89.11,
			        "word": "ants",
			      },
			      {
			        "end": 89.42,
			        "start": 89.28,
			        "word": " and",
			      },
			      {
			        "end": 89.46,
			        "start": 89.42,
			        "word": " P",
			      },
			      {
			        "end": 89.59,
			        "start": 89.46,
			        "word": "ell",
			      },
			    ],
			  },
			  {
			    "end": 92.21,
			    "start": 89.9,
			    "text": "and supporting special education will be preserved.",
			    "words": [
			      {
			        "end": 89.99,
			        "start": 89.9,
			        "word": " and",
			      },
			      {
			        "end": 90.44,
			        "start": 89.99,
			        "word": " supporting",
			      },
			      {
			        "end": 90.78,
			        "start": 90.44,
			        "word": " special",
			      },
			      {
			        "end": 91.22,
			        "start": 90.78,
			        "word": " education",
			      },
			      {
			        "end": 91.48,
			        "start": 91.22,
			        "word": " will",
			      },
			      {
			        "end": 91.61,
			        "start": 91.48,
			        "word": " be",
			      },
			      {
			        "end": 92.21,
			        "start": 91.61,
			        "word": " preserved",
			      },
			    ],
			  },
			  {
			    "end": 97.54,
			    "start": 92.42,
			    "text": "Beyond these core necessities, my administration will take all lawful steps",
			    "words": [
			      {
			        "end": 93.28,
			        "start": 92.42,
			        "word": " Beyond",
			      },
			      {
			        "end": 93.89,
			        "start": 93.28,
			        "word": " these",
			      },
			      {
			        "end": 94.42,
			        "start": 93.89,
			        "word": " core",
			      },
			      {
			        "end": 94.74,
			        "start": 94.42,
			        "word": " necess",
			      },
			      {
			        "end": 95,
			        "start": 94.74,
			        "word": "ities",
			      },
			      {
			        "end": 95.1,
			        "start": 95,
			        "word": ",",
			      },
			      {
			        "end": 95.22,
			        "start": 95.1,
			        "word": " my",
			      },
			      {
			        "end": 95.85,
			        "start": 95.22,
			        "word": " administration",
			      },
			      {
			        "end": 96.03,
			        "start": 95.85,
			        "word": " will",
			      },
			      {
			        "end": 96.29,
			        "start": 96.03,
			        "word": " take",
			      },
			      {
			        "end": 96.62,
			        "start": 96.29,
			        "word": " all",
			      },
			      {
			        "end": 96.92,
			        "start": 96.62,
			        "word": " law",
			      },
			      {
			        "end": 97.22,
			        "start": 96.92,
			        "word": "ful",
			      },
			      {
			        "end": 97.54,
			        "start": 97.22,
			        "word": " steps",
			      },
			    ],
			  },
			  {
			    "end": 98.99,
			    "start": 97.54,
			    "text": "to shut down the department.",
			    "words": [
			      {
			        "end": 97.66,
			        "start": 97.54,
			        "word": " to",
			      },
			      {
			        "end": 97.91,
			        "start": 97.66,
			        "word": " shut",
			      },
			      {
			        "end": 98.16,
			        "start": 97.91,
			        "word": " down",
			      },
			      {
			        "end": 98.35,
			        "start": 98.16,
			        "word": " the",
			      },
			      {
			        "end": 98.99,
			        "start": 98.35,
			        "word": " department",
			      },
			    ],
			  },
			  {
			    "end": 103.54,
			    "start": 99.22,
			    "text": "He's trying to make it seem like this horrible thing isn't as horrible as-",
			    "words": [
			      {
			        "end": 99.37,
			        "start": 99.22,
			        "word": " He",
			      },
			      {
			        "end": 99.55,
			        "start": 99.37,
			        "word": "'s",
			      },
			      {
			        "end": 99.98,
			        "start": 99.55,
			        "word": " trying",
			      },
			      {
			        "end": 100.15,
			        "start": 99.98,
			        "word": " to",
			      },
			      {
			        "end": 100.43,
			        "start": 100.15,
			        "word": " make",
			      },
			      {
			        "end": 100.58,
			        "start": 100.43,
			        "word": " it",
			      },
			      {
			        "end": 100.94,
			        "start": 100.58,
			        "word": " seem",
			      },
			      {
			        "end": 101.21,
			        "start": 100.94,
			        "word": " like",
			      },
			      {
			        "end": 102.13,
			        "start": 101.21,
			        "word": " this",
			      },
			      {
			        "end": 102.22,
			        "start": 102.13,
			        "word": " horrible",
			      },
			      {
			        "end": 102.26,
			        "start": 102.22,
			        "word": " thing",
			      },
			      {
			        "end": 102.28,
			        "start": 102.26,
			        "word": " isn",
			      },
			      {
			        "end": 102.29,
			        "start": 102.28,
			        "word": "'t",
			      },
			      {
			        "end": 102.3,
			        "start": 102.29,
			        "word": " as",
			      },
			      {
			        "end": 102.35,
			        "start": 102.3,
			        "word": " horrible",
			      },
			      {
			        "end": 102.37,
			        "start": 102.35,
			        "word": " as",
			      },
			      {
			        "end": 102.42,
			        "start": 102.37,
			        "word": "-",
			      },
			      {
			        "end": 102.42,
			        "start": 102.42,
			        "word": "",
			      },
			      {
			        "end": 103.54,
			        "start": 102.42,
			        "word": " California",
			      },
			    ],
			  },
			  {
			    "end": 112.24,
			    "start": 109.12,
			    "text": "get 10-20% from the DOE.",
			    "words": [
			      {
			        "end": 109.38,
			        "start": 109.12,
			        "word": " get",
			      },
			      {
			        "end": 109.92,
			        "start": 109.38,
			        "word": " 10",
			      },
			      {
			        "end": 110.07,
			        "start": 109.92,
			        "word": "-",
			      },
			      {
			        "end": 110.79,
			        "start": 110.07,
			        "word": "20",
			      },
			      {
			        "end": 110.92,
			        "start": 110.79,
			        "word": "%",
			      },
			      {
			        "end": 111.31,
			        "start": 110.92,
			        "word": " from",
			      },
			      {
			        "end": 111.61,
			        "start": 111.31,
			        "word": " the",
			      },
			      {
			        "end": 111.81,
			        "start": 111.61,
			        "word": " DO",
			      },
			      {
			        "end": 111.92,
			        "start": 111.81,
			        "word": "E",
			      },
			      {
			        "end": 112.12,
			        "start": 111.92,
			        "word": ".",
			      },
			      {
			        "end": 112.24,
			        "start": 112.12,
			        "word": " So",
			      },
			    ],
			  },
			  {
			    "end": 117.14,
			    "start": 116.12,
			    "text": "It does hurt poor kids.",
			    "words": [
			      {
			        "end": 116.42,
			        "start": 116.12,
			        "word": " It",
			      },
			      {
			        "end": 116.62,
			        "start": 116.42,
			        "word": " does",
			      },
			      {
			        "end": 116.84,
			        "start": 116.62,
			        "word": " hurt",
			      },
			      {
			        "end": 117.06,
			        "start": 116.84,
			        "word": " poor",
			      },
			      {
			        "end": 117.14,
			        "start": 117.06,
			        "word": " kids",
			      },
			    ],
			  },
			  {
			    "end": 123,
			    "start": 117.41,
			    "text": "It does hurt kids' civil rights.",
			    "words": [
			      {
			        "end": 117.62,
			        "start": 117.41,
			        "word": " It",
			      },
			      {
			        "end": 118.12,
			        "start": 117.62,
			        "word": " does",
			      },
			      {
			        "end": 118.12,
			        "start": 118.12,
			        "word": " hurt",
			      },
			      {
			        "end": 118.12,
			        "start": 118.12,
			        "word": "",
			      },
			      {
			        "end": 121.88,
			        "start": 118.12,
			        "word": " kids",
			      },
			      {
			        "end": 122.82,
			        "start": 121.88,
			        "word": "'",
			      },
			      {
			        "end": 122.88,
			        "start": 122.82,
			        "word": " civil",
			      },
			      {
			        "end": 123,
			        "start": 122.88,
			        "word": " rights",
			      },
			    ],
			  },
			  {
			    "end": 123.45,
			    "start": 123.02,
			    "text": "It does hurt kids' dreams of going to college.",
			    "words": [
			      {
			        "end": 123.03,
			        "start": 123.02,
			        "word": " It",
			      },
			      {
			        "end": 123.07,
			        "start": 123.03,
			        "word": " does",
			      },
			      {
			        "end": 123.12,
			        "start": 123.07,
			        "word": " hurt",
			      },
			      {
			        "end": 123.17,
			        "start": 123.12,
			        "word": " kids",
			      },
			      {
			        "end": 123.18,
			        "start": 123.17,
			        "word": "'",
			      },
			      {
			        "end": 123.26,
			        "start": 123.18,
			        "word": " dreams",
			      },
			      {
			        "end": 123.28,
			        "start": 123.26,
			        "word": " of",
			      },
			      {
			        "end": 123.34,
			        "start": 123.28,
			        "word": " going",
			      },
			      {
			        "end": 123.36,
			        "start": 123.34,
			        "word": " to",
			      },
			      {
			        "end": 123.45,
			        "start": 123.36,
			        "word": " college",
			      },
			    ],
			  },
			  {
			    "end": 123.82,
			    "start": 123.49,
			    "text": "There's no way around it.",
			    "words": [
			      {
			        "end": 123.55,
			        "start": 123.49,
			        "word": " There",
			      },
			      {
			        "end": 123.57,
			        "start": 123.55,
			        "word": "'s",
			      },
			      {
			        "end": 123.59,
			        "start": 123.57,
			        "word": " no",
			      },
			      {
			        "end": 123.63,
			        "start": 123.59,
			        "word": " way",
			      },
			      {
			        "end": 123.82,
			        "start": 123.63,
			        "word": " around",
			      },
			      {
			        "end": 123.82,
			        "start": 123.82,
			        "word": " it",
			      },
			    ],
			  },
			  {
			    "end": 127.82,
			    "start": 123.82,
			    "text": "Bonta echoing the message from the American Federation of Teachers Union.",
			    "words": [
			      {
			        "end": 123.98,
			        "start": 123.82,
			        "word": " B",
			      },
			      {
			        "end": 124.62,
			        "start": 123.98,
			        "word": "onta",
			      },
			      {
			        "end": 124.91,
			        "start": 124.62,
			        "word": " echo",
			      },
			      {
			        "end": 125.02,
			        "start": 124.91,
			        "word": "ing",
			      },
			      {
			        "end": 125.19,
			        "start": 125.02,
			        "word": " the",
			      },
			      {
			        "end": 125.62,
			        "start": 125.19,
			        "word": " message",
			      },
			      {
			        "end": 125.82,
			        "start": 125.62,
			        "word": " from",
			      },
			      {
			        "end": 125.93,
			        "start": 125.82,
			        "word": " the",
			      },
			      {
			        "end": 126.23,
			        "start": 125.93,
			        "word": " American",
			      },
			      {
			        "end": 126.62,
			        "start": 126.23,
			        "word": " Federation",
			      },
			      {
			        "end": 126.82,
			        "start": 126.62,
			        "word": " of",
			      },
			      {
			        "end": 127.62,
			        "start": 126.82,
			        "word": " Teachers",
			      },
			      {
			        "end": 127.82,
			        "start": 127.62,
			        "word": " Union",
			      },
			    ],
			  },
			  {
			    "end": 129.62,
			    "start": 128.14,
			    "text": "See you in court.",
			    "words": [
			      {
			        "end": 128.57,
			        "start": 128.14,
			        "word": " See",
			      },
			      {
			        "end": 128.82,
			        "start": 128.57,
			        "word": " you",
			      },
			      {
			        "end": 129.33,
			        "start": 128.82,
			        "word": " in",
			      },
			      {
			        "end": 129.62,
			        "start": 129.33,
			        "word": " court",
			      },
			    ],
			  },
			  {
			    "end": 131.82,
			    "start": 129.82,
			    "text": "As for Los Angeles County.",
			    "words": [
			      {
			        "end": 130.29,
			        "start": 129.82,
			        "word": " As",
			      },
			      {
			        "end": 130.85,
			        "start": 130.29,
			        "word": " for",
			      },
			      {
			        "end": 131,
			        "start": 130.85,
			        "word": " Los",
			      },
			      {
			        "end": 131.43,
			        "start": 131,
			        "word": " Angeles",
			      },
			      {
			        "end": 131.82,
			        "start": 131.43,
			        "word": " County",
			      },
			    ],
			  },
			  {
			    "end": 135.52,
			    "start": 131.82,
			    "text": "We received annually about $1.2 billion of federal investment.",
			    "words": [
			      {
			        "end": 131.94,
			        "start": 131.82,
			        "word": " We",
			      },
			      {
			        "end": 132.44,
			        "start": 131.94,
			        "word": " received",
			      },
			      {
			        "end": 132.94,
			        "start": 132.44,
			        "word": " annually",
			      },
			      {
			        "end": 133.26,
			        "start": 132.94,
			        "word": " about",
			      },
			      {
			        "end": 133.31,
			        "start": 133.26,
			        "word": " $",
			      },
			      {
			        "end": 133.49,
			        "start": 133.31,
			        "word": "1",
			      },
			      {
			        "end": 133.67,
			        "start": 133.49,
			        "word": ".",
			      },
			      {
			        "end": 133.85,
			        "start": 133.67,
			        "word": "2",
			      },
			      {
			        "end": 134.28,
			        "start": 133.85,
			        "word": " billion",
			      },
			      {
			        "end": 134.4,
			        "start": 134.28,
			        "word": " of",
			      },
			      {
			        "end": 134.83,
			        "start": 134.4,
			        "word": " federal",
			      },
			      {
			        "end": 135.52,
			        "start": 134.83,
			        "word": " investment",
			      },
			    ],
			  },
			  {
			    "end": 138.52,
			    "start": 135.52,
			    "text": "The largest program, the Title I program.",
			    "words": [
			      {
			        "end": 136.03,
			        "start": 135.52,
			        "word": " The",
			      },
			      {
			        "end": 136.08,
			        "start": 136.03,
			        "word": " largest",
			      },
			      {
			        "end": 136.39,
			        "start": 136.08,
			        "word": " program",
			      },
			      {
			        "end": 136.55,
			        "start": 136.39,
			        "word": ",",
			      },
			      {
			        "end": 136.89,
			        "start": 136.55,
			        "word": " the",
			      },
			      {
			        "end": 137.51,
			        "start": 136.89,
			        "word": " Title",
			      },
			      {
			        "end": 137.62,
			        "start": 137.51,
			        "word": " I",
			      },
			      {
			        "end": 138.52,
			        "start": 137.62,
			        "word": " program",
			      },
			    ],
			  },
			  {
			    "end": 143.52,
			    "start": 138.76,
			    "text": "About $470 million benefiting the poorest of the poor in our school district.",
			    "words": [
			      {
			        "end": 139.09,
			        "start": 138.76,
			        "word": " About",
			      },
			      {
			        "end": 139.16,
			        "start": 139.09,
			        "word": " $",
			      },
			      {
			        "end": 139.37,
			        "start": 139.16,
			        "word": "4",
			      },
			      {
			        "end": 139.82,
			        "start": 139.37,
			        "word": "70",
			      },
			      {
			        "end": 140.02,
			        "start": 139.82,
			        "word": " million",
			      },
			      {
			        "end": 140.52,
			        "start": 140.02,
			        "word": " benefiting",
			      },
			      {
			        "end": 140.82,
			        "start": 140.52,
			        "word": " the",
			      },
			      {
			        "end": 141.52,
			        "start": 140.82,
			        "word": " poorest",
			      },
			      {
			        "end": 142.12,
			        "start": 141.52,
			        "word": " of",
			      },
			      {
			        "end": 142.36,
			        "start": 142.12,
			        "word": " the",
			      },
			      {
			        "end": 142.52,
			        "start": 142.36,
			        "word": " poor",
			      },
			      {
			        "end": 143.02,
			        "start": 142.52,
			        "word": " in",
			      },
			      {
			        "end": 143.22,
			        "start": 143.02,
			        "word": " our",
			      },
			      {
			        "end": 143.52,
			        "start": 143.22,
			        "word": " school",
			      },
			      {
			        "end": 143.52,
			        "start": 143.52,
			        "word": " district",
			      },
			    ],
			  },
			  {
			    "end": 148.06,
			    "start": 143.52,
			    "text": "The superintendent of the LAUSD warning of the impact",
			    "words": [
			      {
			        "end": 144.32,
			        "start": 143.52,
			        "word": " The",
			      },
			      {
			        "end": 144.52,
			        "start": 144.32,
			        "word": " superintendent",
			      },
			      {
			        "end": 144.92,
			        "start": 144.52,
			        "word": " of",
			      },
			      {
			        "end": 145.52,
			        "start": 144.92,
			        "word": " the",
			      },
			      {
			        "end": 146.12,
			        "start": 145.52,
			        "word": " LAU",
			      },
			      {
			        "end": 146.6,
			        "start": 146.12,
			        "word": "SD",
			      },
			      {
			        "end": 147.17,
			        "start": 146.6,
			        "word": " warning",
			      },
			      {
			        "end": 147.26,
			        "start": 147.17,
			        "word": " of",
			      },
			      {
			        "end": 147.52,
			        "start": 147.26,
			        "word": " the",
			      },
			      {
			        "end": 148.06,
			        "start": 147.52,
			        "word": " impact",
			      },
			    ],
			  },
			  {
			    "end": 150.51,
			    "start": 148.06,
			    "text": "on the nation's second largest school district.",
			    "words": [
			      {
			        "end": 148.26,
			        "start": 148.06,
			        "word": " on",
			      },
			      {
			        "end": 148.52,
			        "start": 148.26,
			        "word": " the",
			      },
			      {
			        "end": 148.8,
			        "start": 148.52,
			        "word": " nation",
			      },
			      {
			        "end": 148.89,
			        "start": 148.8,
			        "word": "'s",
			      },
			      {
			        "end": 149.19,
			        "start": 148.89,
			        "word": " second",
			      },
			      {
			        "end": 149.52,
			        "start": 149.19,
			        "word": " largest",
			      },
			      {
			        "end": 149.94,
			        "start": 149.52,
			        "word": " school",
			      },
			      {
			        "end": 150.51,
			        "start": 149.94,
			        "word": " district",
			      },
			    ],
			  },
			  {
			    "end": 153.22,
			    "start": 150.52,
			    "text": "Any significant change to the appropriation level",
			    "words": [
			      {
			        "end": 150.74,
			        "start": 150.52,
			        "word": " Any",
			      },
			      {
			        "end": 151.39,
			        "start": 150.74,
			        "word": " significant",
			      },
			      {
			        "end": 151.76,
			        "start": 151.39,
			        "word": " change",
			      },
			      {
			        "end": 151.88,
			        "start": 151.76,
			        "word": " to",
			      },
			      {
			        "end": 152.06,
			        "start": 151.88,
			        "word": " the",
			      },
			      {
			        "end": 152.56,
			        "start": 152.06,
			        "word": " appropri",
			      },
			      {
			        "end": 152.87,
			        "start": 152.56,
			        "word": "ation",
			      },
			      {
			        "end": 153.22,
			        "start": 152.87,
			        "word": " level",
			      },
			    ],
			  },
			  {
			    "end": 157.22,
			    "start": 153.22,
			    "text": "undermining current funding levels could prove to be catastrophic",
			    "words": [
			      {
			        "end": 153.96,
			        "start": 153.22,
			        "word": " underm",
			      },
			      {
			        "end": 154.52,
			        "start": 153.96,
			        "word": "ining",
			      },
			      {
			        "end": 155.02,
			        "start": 154.52,
			        "word": " current",
			      },
			      {
			        "end": 155.45,
			        "start": 155.02,
			        "word": " funding",
			      },
			      {
			        "end": 155.82,
			        "start": 155.45,
			        "word": " levels",
			      },
			      {
			        "end": 156.02,
			        "start": 155.82,
			        "word": " could",
			      },
			      {
			        "end": 156.22,
			        "start": 156.02,
			        "word": " prove",
			      },
			      {
			        "end": 156.42,
			        "start": 156.22,
			        "word": " to",
			      },
			      {
			        "end": 156.62,
			        "start": 156.42,
			        "word": " be",
			      },
			      {
			        "end": 157.22,
			        "start": 156.62,
			        "word": " catastrophic",
			      },
			    ],
			  },
			  {
			    "end": 160.21,
			    "start": 157.22,
			    "text": "in terms of the quality of education kids get.",
			    "words": [
			      {
			        "end": 157.52,
			        "start": 157.22,
			        "word": " in",
			      },
			      {
			        "end": 158.34,
			        "start": 157.52,
			        "word": " terms",
			      },
			      {
			        "end": 158.34,
			        "start": 158.34,
			        "word": " of",
			      },
			      {
			        "end": 158.52,
			        "start": 158.34,
			        "word": " the",
			      },
			      {
			        "end": 159.21,
			        "start": 158.52,
			        "word": " quality",
			      },
			      {
			        "end": 159.33,
			        "start": 159.21,
			        "word": " of",
			      },
			      {
			        "end": 159.82,
			        "start": 159.33,
			        "word": " education",
			      },
			      {
			        "end": 160.04,
			        "start": 159.82,
			        "word": " kids",
			      },
			      {
			        "end": 160.21,
			        "start": 160.04,
			        "word": " get",
			      },
			    ],
			  },
			  {
			    "end": 165.91,
			    "start": 160.22,
			    "text": "Tonight, Governor Newsom releasing this statement regarding the decision.",
			    "words": [
			      {
			        "end": 161.96,
			        "start": 160.22,
			        "word": " Tonight",
			      },
			      {
			        "end": 162.22,
			        "start": 161.96,
			        "word": ",",
			      },
			      {
			        "end": 162.79,
			        "start": 162.22,
			        "word": " Governor",
			      },
			      {
			        "end": 163.07,
			        "start": 162.79,
			        "word": " News",
			      },
			      {
			        "end": 163.21,
			        "start": 163.07,
			        "word": "om",
			      },
			      {
			        "end": 163.85,
			        "start": 163.21,
			        "word": " releasing",
			      },
			      {
			        "end": 164.13,
			        "start": 163.85,
			        "word": " this",
			      },
			      {
			        "end": 164.77,
			        "start": 164.13,
			        "word": " statement",
			      },
			      {
			        "end": 165.42,
			        "start": 164.77,
			        "word": " regarding",
			      },
			      {
			        "end": 165.62,
			        "start": 165.42,
			        "word": " the",
			      },
			      {
			        "end": 165.91,
			        "start": 165.62,
			        "word": " decision",
			      },
			    ],
			  },
			  {
			    "end": 170.9,
			    "start": 166.22,
			    "text": "This overreach needs to be rejected immediately by a co-branch of government.",
			    "words": [
			      {
			        "end": 166.51,
			        "start": 166.22,
			        "word": " This",
			      },
			      {
			        "end": 166.8,
			        "start": 166.51,
			        "word": " over",
			      },
			      {
			        "end": 167.16,
			        "start": 166.8,
			        "word": "reach",
			      },
			      {
			        "end": 167.52,
			        "start": 167.16,
			        "word": " needs",
			      },
			      {
			        "end": 167.66,
			        "start": 167.52,
			        "word": " to",
			      },
			      {
			        "end": 167.87,
			        "start": 167.66,
			        "word": " be",
			      },
			      {
			        "end": 168.38,
			        "start": 167.87,
			        "word": " rejected",
			      },
			      {
			        "end": 169.18,
			        "start": 168.38,
			        "word": " immediately",
			      },
			      {
			        "end": 169.32,
			        "start": 169.18,
			        "word": " by",
			      },
			      {
			        "end": 169.39,
			        "start": 169.32,
			        "word": " a",
			      },
			      {
			        "end": 169.53,
			        "start": 169.39,
			        "word": " co",
			      },
			      {
			        "end": 169.6,
			        "start": 169.53,
			        "word": "-",
			      },
			      {
			        "end": 169.74,
			        "start": 169.6,
			        "word": "br",
			      },
			      {
			        "end": 170.03,
			        "start": 169.74,
			        "word": "anch",
			      },
			      {
			        "end": 170.17,
			        "start": 170.03,
			        "word": " of",
			      },
			      {
			        "end": 170.9,
			        "start": 170.17,
			        "word": " government",
			      },
			    ],
			  },
			  {
			    "end": 175.83,
			    "start": 171.22,
			    "text": "Or was Congress eliminated by this executive order too?",
			    "words": [
			      {
			        "end": 171.43,
			        "start": 171.22,
			        "word": " Or",
			      },
			      {
			        "end": 171.72,
			        "start": 171.43,
			        "word": " was",
			      },
			      {
			        "end": 172.53,
			        "start": 171.72,
			        "word": " Congress",
			      },
			      {
			        "end": 173.54,
			        "start": 172.53,
			        "word": " eliminated",
			      },
			      {
			        "end": 174.01,
			        "start": 173.54,
			        "word": " by",
			      },
			      {
			        "end": 174.14,
			        "start": 174.01,
			        "word": " this",
			      },
			      {
			        "end": 175.05,
			        "start": 174.14,
			        "word": " executive",
			      },
			      {
			        "end": 175.56,
			        "start": 175.05,
			        "word": " order",
			      },
			      {
			        "end": 175.83,
			        "start": 175.56,
			        "word": " too",
			      },
			    ],
			  },
			  {
			    "end": 177.22,
			    "start": 176.22,
			    "text": "I'm Robert Kvasek.",
			    "words": [
			      {
			        "end": 176.35,
			        "start": 176.22,
			        "word": " I",
			      },
			      {
			        "end": 176.38,
			        "start": 176.35,
			        "word": "'m",
			      },
			      {
			        "end": 176.72,
			        "start": 176.38,
			        "word": " Robert",
			      },
			      {
			        "end": 176.75,
			        "start": 176.72,
			        "word": " K",
			      },
			      {
			        "end": 176.81,
			        "start": 176.75,
			        "word": "v",
			      },
			      {
			        "end": 176.97,
			        "start": 176.81,
			        "word": "ase",
			      },
			      {
			        "end": 177.02,
			        "start": 176.97,
			        "word": "k",
			      },
			      {
			        "end": 177.22,
			        "start": 177.02,
			        "word": ".",
			      },
			    ],
			  },
			]
		`)
	})
})
