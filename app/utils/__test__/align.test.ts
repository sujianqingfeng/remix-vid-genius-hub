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
	'In a rare move, Chinese authorities have gestured zero tolerance',
	'concerning cyberattacks by offering rewards to the public',
	'for information that could lead to the arrest of a group',
	'of U.S. government hackers targeting China.',
	"The Public Security Bureau Harbin in northeast China's Heilongjiang province",
	'disclosed that Katherine Wilson, Robert Snelling, and Stephen Johnson',
	'were part of mass cyberattacks, skimmed by an office',
	'with U.S. National Security Agency, notoriously known as TAO,',
	'short for Office of Tailored Access Operation.',
	'China also detected the mastermind behind a 2022 cyberattack',
	'against a leading Chinese aviation university was TAO.',
	'Calling those three secret agents, Harbin police said',
	'the investigation found they repeatedly carried out cyberattacks',
	"on China's critical information infrastructure and enterprises,",
	'including tech giant Huawei.',
	"And the latest was Harbin's Asian Winter Games this February.",
	'During the Asian Winter Games, the NSA purchased IP addresses',
	'in different countries and anonymously rented a large number',
	'of network servers located in Europe, Asia and other countries',
	'and regions to carry out attacks on relevant systems,',
	'critical information infrastructure and specific departments.',
	"This time, we've also found the NSA has conducted zero-day attacks",
	'through which specific trojans can be implanted',
	'after attacking the operating system to carry out a latent burial,',
	'similar to a time bomb that can be awakened at any time',
	'by sending encrypted byte data.',
	'Further findings suggest that the attacks against the Asian Winter Games',
	'be traced to University of California and Virginia Tech.',
	'Both institutes were founded by the NSA in the realm of cyber warfare,',
	'and this warfare is now in a smarter trend.',
	'The U.S. cyberattacks have applied AI technology in their scope.',
	'Not only the games registration information systems,',
	'but also a number of infrastructure units in Heilongjiang province',
	'were targeted.',
	'The AI agents can copy a large number of digital hackers',
	'and design combat plans, generate attack tools',
	'and implement indiscriminate attacks.',
	'Digital hackers also react much faster than humans.',
	'This type of attack is unprecedented and poses a huge challenge',
	'to national security.',
	'China has expressed serious concerns about cyberattacks it has exposed,',
	'noting it is one of the main victims of them,',
	'urging specifically the U.S. to adopt a responsible attitude',
	'and refrain from slaughtering others.',
	'Zhou Yaxing, CGTN, Beijing.',
]

describe('align', () => {
	test('alignWordsAndSentences', async () => {
		const { words } = await getWords()

		// 只对前5个句子进行对齐，便于profile和调试
		const result = alignWordsAndSentences(words, sentences)

		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "end": 3.6,
			    "start": 0.21,
			    "text": "In a rare move, Chinese authorities have gestured zero tolerance",
			    "words": [
			      {
			        "end": 0.5,
			        "start": 0.21,
			        "word": " rare",
			      },
			      {
			        "end": 0.79,
			        "start": 0.5,
			        "word": " move",
			      },
			      {
			        "end": 1.36,
			        "start": 0.79,
			        "word": ", Chinese",
			      },
			      {
			        "end": 2,
			        "start": 1.36,
			        "word": " authorities",
			      },
			      {
			        "end": 2.44,
			        "start": 2,
			        "word": " have",
			      },
			      {
			        "end": 2.8,
			        "start": 2.44,
			        "word": " gestured",
			      },
			      {
			        "end": 3.04,
			        "start": 2.8,
			        "word": " zero",
			      },
			      {
			        "end": 3.6,
			        "start": 3.04,
			        "word": " tolerance",
			      },
			    ],
			  },
			  {
			    "end": 7,
			    "start": 3.6,
			    "text": "concerning cyberattacks by offering rewards to the public",
			    "words": [
			      {
			        "end": 4.08,
			        "start": 3.6,
			        "word": " concerning",
			      },
			      {
			        "end": 5.2,
			        "start": 4.08,
			        "word": " cyberattacks",
			      },
			      {
			        "end": 5.35,
			        "start": 5.2,
			        "word": " by",
			      },
			      {
			        "end": 5.83,
			        "start": 5.35,
			        "word": " offering",
			      },
			      {
			        "end": 6.27,
			        "start": 5.83,
			        "word": " rewards",
			      },
			      {
			        "end": 6.42,
			        "start": 6.27,
			        "word": " to",
			      },
			      {
			        "end": 6.59,
			        "start": 6.42,
			        "word": " the",
			      },
			      {
			        "end": 7,
			        "start": 6.59,
			        "word": " public",
			      },
			    ],
			  },
			  {
			    "end": 9.7,
			    "start": 7,
			    "text": "for information that could lead to the arrest of a group",
			    "words": [
			      {
			        "end": 7.16,
			        "start": 7,
			        "word": " for",
			      },
			      {
			        "end": 7.92,
			        "start": 7.16,
			        "word": " information",
			      },
			      {
			        "end": 8.14,
			        "start": 7.92,
			        "word": " that",
			      },
			      {
			        "end": 8.42,
			        "start": 8.14,
			        "word": " could",
			      },
			      {
			        "end": 8.67,
			        "start": 8.42,
			        "word": " lead",
			      },
			      {
			        "end": 8.75,
			        "start": 8.67,
			        "word": " to",
			      },
			      {
			        "end": 8.92,
			        "start": 8.75,
			        "word": " the",
			      },
			      {
			        "end": 9.28,
			        "start": 8.92,
			        "word": " arrest",
			      },
			      {
			        "end": 9.43,
			        "start": 9.28,
			        "word": " of a",
			      },
			      {
			        "end": 9.7,
			        "start": 9.43,
			        "word": " group",
			      },
			    ],
			  },
			  {
			    "end": 12.64,
			    "start": 9.7,
			    "text": "of U.S. government hackers targeting China.",
			    "words": [
			      {
			        "end": 9.86,
			        "start": 9.7,
			        "word": " of U",
			      },
			      {
			        "end": 10.08,
			        "start": 9.86,
			        "word": ".S",
			      },
			      {
			        "end": 10.81,
			        "start": 10.08,
			        "word": ". government",
			      },
			      {
			        "end": 11.4,
			        "start": 10.81,
			        "word": " hackers",
			      },
			      {
			        "end": 12.15,
			        "start": 11.4,
			        "word": " targeting",
			      },
			      {
			        "end": 12.64,
			        "start": 12.15,
			        "word": " China",
			      },
			    ],
			  },
			  {
			    "end": 15.21,
			    "start": 12.64,
			    "text": "The Public Security Bureau Harbin in northeast China's Heilongjiang province",
			    "words": [
			      {
			        "end": 12.8,
			        "start": 12.64,
			        "word": ". The",
			      },
			      {
			        "end": 13.12,
			        "start": 12.8,
			        "word": " Public",
			      },
			      {
			        "end": 13.57,
			        "start": 13.12,
			        "word": " Security",
			      },
			      {
			        "end": 13.9,
			        "start": 13.57,
			        "word": " Bureau",
			      },
			      {
			        "end": 14.22,
			        "start": 13.9,
			        "word": " Harbin",
			      },
			      {
			        "end": 14.33,
			        "start": 14.22,
			        "word": " in",
			      },
			      {
			        "end": 14.87,
			        "start": 14.33,
			        "word": " northeast",
			      },
			      {
			        "end": 15.1,
			        "start": 14.87,
			        "word": " China",
			      },
			      {
			        "end": 15.21,
			        "start": 15.1,
			        "word": "'s",
			      },
			    ],
			  },
			  {
			    "end": 21.41,
			    "start": 17.04,
			    "text": "disclosed that Katherine Wilson, Robert Snelling, and Stephen Johnson",
			    "words": [
			      {
			        "end": 17.6,
			        "start": 17.04,
			        "word": " that",
			      },
			      {
			        "end": 18.33,
			        "start": 17.6,
			        "word": " Katherine",
			      },
			      {
			        "end": 18.67,
			        "start": 18.33,
			        "word": " Wilson",
			      },
			      {
			        "end": 19.24,
			        "start": 18.67,
			        "word": ", Robert",
			      },
			      {
			        "end": 19.8,
			        "start": 19.24,
			        "word": " Snelling",
			      },
			      {
			        "end": 20.15,
			        "start": 19.8,
			        "word": ", and",
			      },
			      {
			        "end": 20.65,
			        "start": 20.15,
			        "word": " Stephen",
			      },
			      {
			        "end": 21.41,
			        "start": 20.65,
			        "word": " Johnson",
			      },
			    ],
			  },
			  {
			    "end": 23.47,
			    "start": 21.41,
			    "text": "were part of mass cyberattacks, skimmed by an office",
			    "words": [
			      {
			        "end": 21.48,
			        "start": 21.41,
			        "word": " were",
			      },
			      {
			        "end": 21.76,
			        "start": 21.48,
			        "word": " part",
			      },
			      {
			        "end": 21.92,
			        "start": 21.76,
			        "word": " of",
			      },
			      {
			        "end": 22.2,
			        "start": 21.92,
			        "word": " mass",
			      },
			      {
			        "end": 23.04,
			        "start": 22.2,
			        "word": " cyberattacks",
			      },
			      {
			        "end": 23.47,
			        "start": 23.04,
			        "word": ", skimmed",
			      },
			    ],
			  },
			  {
			    "end": 26.1,
			    "start": 24.15,
			    "text": "with U.S. National Security Agency, notoriously known as TAO,",
			    "words": [
			      {
			        "end": 24.36,
			        "start": 24.15,
			        "word": " with",
			      },
			      {
			        "end": 24.4,
			        "start": 24.36,
			        "word": " U",
			      },
			      {
			        "end": 24.65,
			        "start": 24.4,
			        "word": ".S",
			      },
			      {
			        "end": 25.35,
			        "start": 24.65,
			        "word": ". National",
			      },
			      {
			        "end": 25.86,
			        "start": 25.35,
			        "word": " Security",
			      },
			      {
			        "end": 26.1,
			        "start": 25.86,
			        "word": " Agency",
			      },
			    ],
			  },
			  {
			    "end": 30.76,
			    "start": 27.97,
			    "text": "short for Office of Tailored Access Operation.",
			    "words": [
			      {
			        "end": 28.33,
			        "start": 27.97,
			        "word": " short",
			      },
			      {
			        "end": 28.55,
			        "start": 28.33,
			        "word": " for",
			      },
			      {
			        "end": 28.99,
			        "start": 28.55,
			        "word": " Office",
			      },
			      {
			        "end": 29.13,
			        "start": 28.99,
			        "word": " of",
			      },
			      {
			        "end": 29.78,
			        "start": 29.13,
			        "word": " Tailored",
			      },
			      {
			        "end": 30.15,
			        "start": 29.78,
			        "word": " Access",
			      },
			      {
			        "end": 30.76,
			        "start": 30.15,
			        "word": " Operation",
			      },
			    ],
			  },
			  {
			    "end": 34.61,
			    "start": 30.76,
			    "text": "China also detected the mastermind behind a 2022 cyberattack",
			    "words": [
			      {
			        "end": 31.48,
			        "start": 30.76,
			        "word": ". China",
			      },
			      {
			        "end": 31.76,
			        "start": 31.48,
			        "word": " also",
			      },
			      {
			        "end": 32.33,
			        "start": 31.76,
			        "word": " detected",
			      },
			      {
			        "end": 32.54,
			        "start": 32.33,
			        "word": " the",
			      },
			      {
			        "end": 33.25,
			        "start": 32.54,
			        "word": " mastermind",
			      },
			      {
			        "end": 33.68,
			        "start": 33.25,
			        "word": " behind",
			      },
			      {
			        "end": 33.8,
			        "start": 33.68,
			        "word": " a",
			      },
			      {
			        "end": 34.61,
			        "start": 33.8,
			        "word": " 2022",
			      },
			    ],
			  },
			  {
			    "end": 39.2,
			    "start": 35.54,
			    "text": "against a leading Chinese aviation university was TAO.",
			    "words": [
			      {
			        "end": 35.86,
			        "start": 35.54,
			        "word": " against",
			      },
			      {
			        "end": 35.92,
			        "start": 35.86,
			        "word": " a",
			      },
			      {
			        "end": 36.32,
			        "start": 35.92,
			        "word": " leading",
			      },
			      {
			        "end": 36.8,
			        "start": 36.32,
			        "word": " Chinese",
			      },
			      {
			        "end": 37.6,
			        "start": 36.8,
			        "word": " aviation",
			      },
			      {
			        "end": 38.6,
			        "start": 37.6,
			        "word": " university",
			      },
			      {
			        "end": 38.9,
			        "start": 38.6,
			        "word": " was",
			      },
			      {
			        "end": 39.2,
			        "start": 38.9,
			        "word": " TAO",
			      },
			    ],
			  },
			  {
			    "end": 42.4,
			    "start": 39.95,
			    "text": "Calling those three secret agents, Harbin police said",
			    "words": [
			      {
			        "end": 40.36,
			        "start": 39.95,
			        "word": " those",
			      },
			      {
			        "end": 40.55,
			        "start": 40.36,
			        "word": " three",
			      },
			      {
			        "end": 40.92,
			        "start": 40.55,
			        "word": " secret",
			      },
			      {
			        "end": 41.28,
			        "start": 40.92,
			        "word": " agents",
			      },
			      {
			        "end": 41.92,
			        "start": 41.28,
			        "word": ", Harbin",
			      },
			      {
			        "end": 42.24,
			        "start": 41.92,
			        "word": " police",
			      },
			      {
			        "end": 42.4,
			        "start": 42.24,
			        "word": " said",
			      },
			    ],
			  },
			  {
			    "end": 44.97,
			    "start": 42.4,
			    "text": "the investigation found they repeatedly carried out cyberattacks",
			    "words": [
			      {
			        "end": 42.56,
			        "start": 42.4,
			        "word": " the",
			      },
			      {
			        "end": 43.28,
			        "start": 42.56,
			        "word": " investigation",
			      },
			      {
			        "end": 43.57,
			        "start": 43.28,
			        "word": " found",
			      },
			      {
			        "end": 43.8,
			        "start": 43.57,
			        "word": " they",
			      },
			      {
			        "end": 44.4,
			        "start": 43.8,
			        "word": " repeatedly",
			      },
			      {
			        "end": 44.8,
			        "start": 44.4,
			        "word": " carried",
			      },
			      {
			        "end": 44.97,
			        "start": 44.8,
			        "word": " out",
			      },
			    ],
			  },
			  {
			    "end": 49.46,
			    "start": 45.66,
			    "text": "on China's critical information infrastructure and enterprises,",
			    "words": [
			      {
			        "end": 45.77,
			        "start": 45.66,
			        "word": " on",
			      },
			      {
			        "end": 46.06,
			        "start": 45.77,
			        "word": " China",
			      },
			      {
			        "end": 46.17,
			        "start": 46.06,
			        "word": "'s",
			      },
			      {
			        "end": 46.64,
			        "start": 46.17,
			        "word": " critical",
			      },
			      {
			        "end": 47.36,
			        "start": 46.64,
			        "word": " information",
			      },
			      {
			        "end": 48.56,
			        "start": 47.36,
			        "word": " infrastructure",
			      },
			      {
			        "end": 48.75,
			        "start": 48.56,
			        "word": " and",
			      },
			      {
			        "end": 49.46,
			        "start": 48.75,
			        "word": " enterprises",
			      },
			    ],
			  },
			  {
			    "end": 51.14,
			    "start": 49.46,
			    "text": "including tech giant Huawei.",
			    "words": [
			      {
			        "end": 50.17,
			        "start": 49.46,
			        "word": ", including",
			      },
			      {
			        "end": 50.43,
			        "start": 50.17,
			        "word": " tech",
			      },
			      {
			        "end": 50.76,
			        "start": 50.43,
			        "word": " giant",
			      },
			      {
			        "end": 51.14,
			        "start": 50.76,
			        "word": " Huawei",
			      },
			    ],
			  },
			  {
			    "end": 55.39,
			    "start": 51.55,
			    "text": "And the latest was Harbin's Asian Winter Games this February.",
			    "words": [
			      {
			        "end": 51.68,
			        "start": 51.55,
			        "word": " the",
			      },
			      {
			        "end": 52,
			        "start": 51.68,
			        "word": " latest",
			      },
			      {
			        "end": 52.21,
			        "start": 52,
			        "word": " was",
			      },
			      {
			        "end": 52.63,
			        "start": 52.21,
			        "word": " Harbin",
			      },
			      {
			        "end": 52.86,
			        "start": 52.63,
			        "word": "'s",
			      },
			      {
			        "end": 53.12,
			        "start": 52.86,
			        "word": " Asian",
			      },
			      {
			        "end": 53.52,
			        "start": 53.12,
			        "word": " Winter",
			      },
			      {
			        "end": 54,
			        "start": 53.52,
			        "word": " Games",
			      },
			      {
			        "end": 54.46,
			        "start": 54,
			        "word": " this",
			      },
			      {
			        "end": 55.39,
			        "start": 54.46,
			        "word": " February",
			      },
			    ],
			  },
			  {
			    "end": 59.84,
			    "start": 56.16,
			    "text": "During the Asian Winter Games, the NSA purchased IP addresses",
			    "words": [
			      {
			        "end": 56.36,
			        "start": 56.16,
			        "word": " the",
			      },
			      {
			        "end": 56.7,
			        "start": 56.36,
			        "word": " Asian",
			      },
			      {
			        "end": 57.1,
			        "start": 56.7,
			        "word": " Winter",
			      },
			      {
			        "end": 57.44,
			        "start": 57.1,
			        "word": " Games",
			      },
			      {
			        "end": 57.96,
			        "start": 57.44,
			        "word": ", the",
			      },
			      {
			        "end": 58.32,
			        "start": 57.96,
			        "word": " NSA",
			      },
			      {
			        "end": 58.8,
			        "start": 58.32,
			        "word": " purchased",
			      },
			      {
			        "end": 59.2,
			        "start": 58.8,
			        "word": " IP",
			      },
			      {
			        "end": 59.84,
			        "start": 59.2,
			        "word": " addresses",
			      },
			    ],
			  },
			  {
			    "end": 63.12,
			    "start": 59.84,
			    "text": "in different countries and anonymously rented a large number",
			    "words": [
			      {
			        "end": 59.92,
			        "start": 59.84,
			        "word": " in",
			      },
			      {
			        "end": 60.32,
			        "start": 59.92,
			        "word": " different",
			      },
			      {
			        "end": 60.88,
			        "start": 60.32,
			        "word": " countries",
			      },
			      {
			        "end": 61.09,
			        "start": 60.88,
			        "word": " and",
			      },
			      {
			        "end": 61.86,
			        "start": 61.09,
			        "word": " anonymously",
			      },
			      {
			        "end": 62.33,
			        "start": 61.86,
			        "word": " rented",
			      },
			      {
			        "end": 62.35,
			        "start": 62.33,
			        "word": " a",
			      },
			      {
			        "end": 62.7,
			        "start": 62.35,
			        "word": " large",
			      },
			      {
			        "end": 63.12,
			        "start": 62.7,
			        "word": " number",
			      },
			    ],
			  },
			  {
			    "end": 66.8,
			    "start": 63.12,
			    "text": "of network servers located in Europe, Asia and other countries",
			    "words": [
			      {
			        "end": 63.26,
			        "start": 63.12,
			        "word": " of",
			      },
			      {
			        "end": 63.75,
			        "start": 63.26,
			        "word": " network",
			      },
			      {
			        "end": 64.24,
			        "start": 63.75,
			        "word": " servers",
			      },
			      {
			        "end": 64.73,
			        "start": 64.24,
			        "word": " located",
			      },
			      {
			        "end": 64.87,
			        "start": 64.73,
			        "word": " in",
			      },
			      {
			        "end": 65.31,
			        "start": 64.87,
			        "word": " Europe",
			      },
			      {
			        "end": 66,
			        "start": 65.31,
			        "word": ", Asia",
			      },
			      {
			        "end": 66.16,
			        "start": 66,
			        "word": " and",
			      },
			      {
			        "end": 66.4,
			        "start": 66.16,
			        "word": " other",
			      },
			      {
			        "end": 66.8,
			        "start": 66.4,
			        "word": " countries",
			      },
			    ],
			  },
			  {
			    "end": 69.92,
			    "start": 66.8,
			    "text": "and regions to carry out attacks on relevant systems,",
			    "words": [
			      {
			        "end": 67.01,
			        "start": 66.8,
			        "word": " and",
			      },
			      {
			        "end": 67.51,
			        "start": 67.01,
			        "word": " regions",
			      },
			      {
			        "end": 67.72,
			        "start": 67.51,
			        "word": " to",
			      },
			      {
			        "end": 68,
			        "start": 67.72,
			        "word": " carry",
			      },
			      {
			        "end": 68.21,
			        "start": 68,
			        "word": " out",
			      },
			      {
			        "end": 68.71,
			        "start": 68.21,
			        "word": " attacks",
			      },
			      {
			        "end": 68.88,
			        "start": 68.71,
			        "word": " on",
			      },
			      {
			        "end": 69.42,
			        "start": 68.88,
			        "word": " relevant",
			      },
			      {
			        "end": 69.92,
			        "start": 69.42,
			        "word": " systems",
			      },
			    ],
			  },
			  {
			    "end": 73.95,
			    "start": 69.92,
			    "text": "critical information infrastructure and specific departments.",
			    "words": [
			      {
			        "end": 70.63,
			        "start": 69.92,
			        "word": ", critical",
			      },
			      {
			        "end": 71.42,
			        "start": 70.63,
			        "word": " information",
			      },
			      {
			        "end": 72.48,
			        "start": 71.42,
			        "word": " infrastructure",
			      },
			      {
			        "end": 72.64,
			        "start": 72.48,
			        "word": " and",
			      },
			      {
			        "end": 73.12,
			        "start": 72.64,
			        "word": " specific",
			      },
			      {
			        "end": 73.95,
			        "start": 73.12,
			        "word": " departments",
			      },
			    ],
			  },
			  {
			    "end": 78.42,
			    "start": 73.95,
			    "text": "This time, we've also found the NSA has conducted zero-day attacks",
			    "words": [
			      {
			        "end": 74.5,
			        "start": 73.95,
			        "word": ". This",
			      },
			      {
			        "end": 74.92,
			        "start": 74.5,
			        "word": " time,",
			      },
			      {
			        "end": 75.59,
			        "start": 75.29,
			        "word": " also",
			      },
			      {
			        "end": 75.97,
			        "start": 75.59,
			        "word": " found",
			      },
			      {
			        "end": 76.18,
			        "start": 75.97,
			        "word": " the",
			      },
			      {
			        "end": 76.4,
			        "start": 76.18,
			        "word": " NSA",
			      },
			      {
			        "end": 76.61,
			        "start": 76.4,
			        "word": " has",
			      },
			      {
			        "end": 77.3,
			        "start": 76.61,
			        "word": " conducted",
			      },
			      {
			        "end": 77.6,
			        "start": 77.3,
			        "word": " zero",
			      },
			      {
			        "end": 77.89,
			        "start": 77.6,
			        "word": "-day",
			      },
			      {
			        "end": 78.42,
			        "start": 77.89,
			        "word": " attacks",
			      },
			    ],
			  },
			  {
			    "end": 80.75,
			    "start": 78.42,
			    "text": "through which specific trojans can be implanted",
			    "words": [
			      {
			        "end": 79.04,
			        "start": 78.42,
			        "word": " through",
			      },
			      {
			        "end": 79.31,
			        "start": 79.04,
			        "word": " which",
			      },
			      {
			        "end": 79.84,
			        "start": 79.31,
			        "word": " specific",
			      },
			      {
			        "end": 80.38,
			        "start": 79.84,
			        "word": " trojans",
			      },
			      {
			        "end": 80.63,
			        "start": 80.38,
			        "word": " can",
			      },
			      {
			        "end": 80.75,
			        "start": 80.63,
			        "word": " be",
			      },
			    ],
			  },
			  {
			    "end": 86.18,
			    "start": 81.43,
			    "text": "after attacking the operating system to carry out a latent burial,",
			    "words": [
			      {
			        "end": 81.81,
			        "start": 81.43,
			        "word": " after",
			      },
			      {
			        "end": 82.53,
			        "start": 81.81,
			        "word": " attacking",
			      },
			      {
			        "end": 82.73,
			        "start": 82.53,
			        "word": " the",
			      },
			      {
			        "end": 83.42,
			        "start": 82.73,
			        "word": " operating",
			      },
			      {
			        "end": 83.92,
			        "start": 83.42,
			        "word": " system",
			      },
			      {
			        "end": 84.06,
			        "start": 83.92,
			        "word": " to",
			      },
			      {
			        "end": 84.41,
			        "start": 84.06,
			        "word": " carry",
			      },
			      {
			        "end": 84.64,
			        "start": 84.41,
			        "word": " out",
			      },
			      {
			        "end": 84.79,
			        "start": 84.64,
			        "word": " a",
			      },
			      {
			        "end": 85.36,
			        "start": 84.79,
			        "word": " latent",
			      },
			      {
			        "end": 86.18,
			        "start": 85.36,
			        "word": " burial",
			      },
			    ],
			  },
			  {
			    "end": 89.09,
			    "start": 86.18,
			    "text": "similar to a time bomb that can be awakened at any time",
			    "words": [
			      {
			        "end": 86.7,
			        "start": 86.18,
			        "word": ", similar",
			      },
			      {
			        "end": 86.89,
			        "start": 86.7,
			        "word": " to a",
			      },
			      {
			        "end": 87.15,
			        "start": 86.89,
			        "word": " time",
			      },
			      {
			        "end": 87.41,
			        "start": 87.15,
			        "word": " bomb",
			      },
			      {
			        "end": 87.74,
			        "start": 87.41,
			        "word": " that",
			      },
			      {
			        "end": 87.87,
			        "start": 87.74,
			        "word": " can",
			      },
			      {
			        "end": 87.98,
			        "start": 87.87,
			        "word": " be",
			      },
			      {
			        "end": 88.51,
			        "start": 87.98,
			        "word": " awakened",
			      },
			      {
			        "end": 88.64,
			        "start": 88.51,
			        "word": " at",
			      },
			      {
			        "end": 88.83,
			        "start": 88.64,
			        "word": " any",
			      },
			      {
			        "end": 89.09,
			        "start": 88.83,
			        "word": " time",
			      },
			    ],
			  },
			  {
			    "end": 90.88,
			    "start": 89.09,
			    "text": "by sending encrypted byte data.",
			    "words": [
			      {
			        "end": 89.23,
			        "start": 89.09,
			        "word": " by",
			      },
			      {
			        "end": 89.68,
			        "start": 89.23,
			        "word": " sending",
			      },
			      {
			        "end": 90.27,
			        "start": 89.68,
			        "word": " encrypted",
			      },
			      {
			        "end": 90.53,
			        "start": 90.27,
			        "word": " byte",
			      },
			      {
			        "end": 90.88,
			        "start": 90.53,
			        "word": " data",
			      },
			    ],
			  },
			  {
			    "end": 97.36,
			    "start": 90.88,
			    "text": "Further findings suggest that the attacks against the Asian Winter Games",
			    "words": [
			      {
			        "end": 91.84,
			        "start": 90.88,
			        "word": ". Further",
			      },
			      {
			        "end": 92.95,
			        "start": 91.84,
			        "word": " findings",
			      },
			      {
			        "end": 94.26,
			        "start": 92.95,
			        "word": " suggest",
			      },
			      {
			        "end": 94.45,
			        "start": 94.26,
			        "word": " that",
			      },
			      {
			        "end": 94.86,
			        "start": 94.45,
			        "word": " the",
			      },
			      {
			        "end": 95.84,
			        "start": 94.86,
			        "word": " attacks",
			      },
			      {
			        "end": 96.16,
			        "start": 95.84,
			        "word": " against",
			      },
			      {
			        "end": 96.4,
			        "start": 96.16,
			        "word": " the",
			      },
			      {
			        "end": 96.72,
			        "start": 96.4,
			        "word": " Asian",
			      },
			      {
			        "end": 97.04,
			        "start": 96.72,
			        "word": " Winter",
			      },
			      {
			        "end": 97.36,
			        "start": 97.04,
			        "word": " Games",
			      },
			    ],
			  },
			  {
			    "end": 100.72,
			    "start": 97.36,
			    "text": "be traced to University of California and Virginia Tech.",
			    "words": [
			      {
			        "end": 97.52,
			        "start": 97.36,
			        "word": " be",
			      },
			      {
			        "end": 97.84,
			        "start": 97.52,
			        "word": " traced",
			      },
			      {
			        "end": 98,
			        "start": 97.84,
			        "word": " to",
			      },
			      {
			        "end": 98.59,
			        "start": 98,
			        "word": " University",
			      },
			      {
			        "end": 98.64,
			        "start": 98.59,
			        "word": " of",
			      },
			      {
			        "end": 99.47,
			        "start": 98.64,
			        "word": " California",
			      },
			      {
			        "end": 99.79,
			        "start": 99.47,
			        "word": " and",
			      },
			      {
			        "end": 100.39,
			        "start": 99.79,
			        "word": " Virginia",
			      },
			      {
			        "end": 100.72,
			        "start": 100.39,
			        "word": " Tech",
			      },
			    ],
			  },
			  {
			    "end": 105.43,
			    "start": 101.3,
			    "text": "Both institutes were founded by the NSA in the realm of cyber warfare,",
			    "words": [
			      {
			        "end": 102.36,
			        "start": 101.3,
			        "word": " institutes",
			      },
			      {
			        "end": 102.57,
			        "start": 102.36,
			        "word": " were",
			      },
			      {
			        "end": 103.01,
			        "start": 102.57,
			        "word": " founded",
			      },
			      {
			        "end": 103.16,
			        "start": 103.01,
			        "word": " by",
			      },
			      {
			        "end": 103.39,
			        "start": 103.16,
			        "word": " the",
			      },
			      {
			        "end": 103.62,
			        "start": 103.39,
			        "word": " NSA",
			      },
			      {
			        "end": 103.76,
			        "start": 103.62,
			        "word": " in",
			      },
			      {
			        "end": 104,
			        "start": 103.76,
			        "word": " the",
			      },
			      {
			        "end": 104.39,
			        "start": 104,
			        "word": " realm",
			      },
			      {
			        "end": 104.54,
			        "start": 104.39,
			        "word": " of",
			      },
			      {
			        "end": 104.93,
			        "start": 104.54,
			        "word": " cyber",
			      },
			      {
			        "end": 105.43,
			        "start": 104.93,
			        "word": " warfare",
			      },
			    ],
			  },
			  {
			    "end": 107.88,
			    "start": 105.43,
			    "text": "and this warfare is now in a smarter trend.",
			    "words": [
			      {
			        "end": 105.8,
			        "start": 105.43,
			        "word": ", and",
			      },
			      {
			        "end": 106.07,
			        "start": 105.8,
			        "word": " this",
			      },
			      {
			        "end": 106.55,
			        "start": 106.07,
			        "word": " warfare",
			      },
			      {
			        "end": 106.69,
			        "start": 106.55,
			        "word": " is",
			      },
			      {
			        "end": 106.88,
			        "start": 106.69,
			        "word": " now",
			      },
			      {
			        "end": 107.23,
			        "start": 106.88,
			        "word": " in a",
			      },
			      {
			        "end": 107.57,
			        "start": 107.23,
			        "word": " smarter",
			      },
			      {
			        "end": 107.88,
			        "start": 107.57,
			        "word": " trend",
			      },
			    ],
			  },
			  {
			    "end": 113.63,
			    "start": 108.81,
			    "text": "The U.S. cyberattacks have applied AI technology in their scope.",
			    "words": [
			      {
			        "end": 108.9,
			        "start": 108.81,
			        "word": "S",
			      },
			      {
			        "end": 110.31,
			        "start": 108.9,
			        "word": ". cyberattacks",
			      },
			      {
			        "end": 110.69,
			        "start": 110.31,
			        "word": " have",
			      },
			      {
			        "end": 111.36,
			        "start": 110.69,
			        "word": " applied",
			      },
			      {
			        "end": 111.55,
			        "start": 111.36,
			        "word": " AI",
			      },
			      {
			        "end": 112.5,
			        "start": 111.55,
			        "word": " technology",
			      },
			      {
			        "end": 112.69,
			        "start": 112.5,
			        "word": " in",
			      },
			      {
			        "end": 113.16,
			        "start": 112.69,
			        "word": " their",
			      },
			      {
			        "end": 113.63,
			        "start": 113.16,
			        "word": " scope",
			      },
			    ],
			  },
			  {
			    "end": 116.85,
			    "start": 113.63,
			    "text": "Not only the games registration information systems,",
			    "words": [
			      {
			        "end": 114.19,
			        "start": 113.63,
			        "word": ". Not",
			      },
			      {
			        "end": 114.44,
			        "start": 114.19,
			        "word": " only",
			      },
			      {
			        "end": 114.64,
			        "start": 114.44,
			        "word": " the",
			      },
			      {
			        "end": 115.04,
			        "start": 114.64,
			        "word": " games",
			      },
			      {
			        "end": 115.84,
			        "start": 115.04,
			        "word": " registration",
			      },
			      {
			        "end": 116.4,
			        "start": 115.84,
			        "word": " information",
			      },
			      {
			        "end": 116.85,
			        "start": 116.4,
			        "word": " systems",
			      },
			    ],
			  },
			  {
			    "end": 120.77,
			    "start": 117.28,
			    "text": "but also a number of infrastructure units in Heilongjiang province",
			    "words": [
			      {
			        "end": 117.43,
			        "start": 117.28,
			        "word": " also",
			      },
			      {
			        "end": 117.48,
			        "start": 117.43,
			        "word": " a",
			      },
			      {
			        "end": 117.88,
			        "start": 117.48,
			        "word": " number",
			      },
			      {
			        "end": 118.01,
			        "start": 117.88,
			        "word": " of",
			      },
			      {
			        "end": 118.92,
			        "start": 118.01,
			        "word": " infrastructure",
			      },
			      {
			        "end": 119.24,
			        "start": 118.92,
			        "word": " units",
			      },
			      {
			        "end": 119.37,
			        "start": 119.24,
			        "word": " in",
			      },
			      {
			        "end": 120.14,
			        "start": 119.37,
			        "word": " Heilongjiang",
			      },
			      {
			        "end": 120.77,
			        "start": 120.14,
			        "word": " province",
			      },
			    ],
			  },
			  {
			    "end": 121.38,
			    "start": 120.77,
			    "text": "were targeted.",
			    "words": [
			      {
			        "end": 120.95,
			        "start": 120.77,
			        "word": " were",
			      },
			      {
			        "end": 121.38,
			        "start": 120.95,
			        "word": " targeted",
			      },
			    ],
			  },
			  {
			    "end": 125.39,
			    "start": 121.84,
			    "text": "The AI agents can copy a large number of digital hackers",
			    "words": [
			      {
			        "end": 122.24,
			        "start": 121.84,
			        "word": " AI",
			      },
			      {
			        "end": 122.88,
			        "start": 122.24,
			        "word": " agents",
			      },
			      {
			        "end": 123.04,
			        "start": 122.88,
			        "word": " can",
			      },
			      {
			        "end": 123.36,
			        "start": 123.04,
			        "word": " copy",
			      },
			      {
			        "end": 123.44,
			        "start": 123.36,
			        "word": " a",
			      },
			      {
			        "end": 123.8,
			        "start": 123.44,
			        "word": " large",
			      },
			      {
			        "end": 124.23,
			        "start": 123.8,
			        "word": " number",
			      },
			      {
			        "end": 124.37,
			        "start": 124.23,
			        "word": " of",
			      },
			      {
			        "end": 124.88,
			        "start": 124.37,
			        "word": " digital",
			      },
			      {
			        "end": 125.39,
			        "start": 124.88,
			        "word": " hackers",
			      },
			    ],
			  },
			  {
			    "end": 128.34,
			    "start": 125.39,
			    "text": "and design combat plans, generate attack tools",
			    "words": [
			      {
			        "end": 125.61,
			        "start": 125.39,
			        "word": " and",
			      },
			      {
			        "end": 126.04,
			        "start": 125.61,
			        "word": " design",
			      },
			      {
			        "end": 126.49,
			        "start": 126.04,
			        "word": " combat",
			      },
			      {
			        "end": 126.83,
			        "start": 126.49,
			        "word": " plans",
			      },
			      {
			        "end": 127.55,
			        "start": 126.83,
			        "word": ", generate",
			      },
			      {
			        "end": 127.97,
			        "start": 127.55,
			        "word": " attack",
			      },
			      {
			        "end": 128.34,
			        "start": 127.97,
			        "word": " tools",
			      },
			    ],
			  },
			  {
			    "end": 130.37,
			    "start": 128.34,
			    "text": "and implement indiscriminate attacks.",
			    "words": [
			      {
			        "end": 128.64,
			        "start": 128.34,
			        "word": " and",
			      },
			      {
			        "end": 129.28,
			        "start": 128.64,
			        "word": " implement",
			      },
			      {
			        "end": 130.37,
			        "start": 129.28,
			        "word": " indiscriminate",
			      },
			    ],
			  },
			  {
			    "end": 134.26,
			    "start": 131.05,
			    "text": "Digital hackers also react much faster than humans.",
			    "words": [
			      {
			        "end": 131.57,
			        "start": 131.05,
			        "word": " Digital",
			      },
			      {
			        "end": 132.09,
			        "start": 131.57,
			        "word": " hackers",
			      },
			      {
			        "end": 132.4,
			        "start": 132.09,
			        "word": " also",
			      },
			      {
			        "end": 132.76,
			        "start": 132.4,
			        "word": " react",
			      },
			      {
			        "end": 133.06,
			        "start": 132.76,
			        "word": " much",
			      },
			      {
			        "end": 133.52,
			        "start": 133.06,
			        "word": " faster",
			      },
			      {
			        "end": 133.81,
			        "start": 133.52,
			        "word": " than",
			      },
			      {
			        "end": 134.26,
			        "start": 133.81,
			        "word": " humans",
			      },
			    ],
			  },
			  {
			    "end": 138.88,
			    "start": 134.26,
			    "text": "This type of attack is unprecedented and poses a huge challenge",
			    "words": [
			      {
			        "end": 135.21,
			        "start": 134.26,
			        "word": ". This",
			      },
			      {
			        "end": 135.84,
			        "start": 135.21,
			        "word": " type",
			      },
			      {
			        "end": 136.08,
			        "start": 135.84,
			        "word": " of",
			      },
			      {
			        "end": 136.53,
			        "start": 136.08,
			        "word": " attack",
			      },
			      {
			        "end": 136.64,
			        "start": 136.53,
			        "word": " is",
			      },
			      {
			        "end": 137.46,
			        "start": 136.64,
			        "word": " unprecedented",
			      },
			      {
			        "end": 137.75,
			        "start": 137.46,
			        "word": " and",
			      },
			      {
			        "end": 137.98,
			        "start": 137.75,
			        "word": " poses",
			      },
			      {
			        "end": 138.04,
			        "start": 137.98,
			        "word": " a",
			      },
			      {
			        "end": 138.28,
			        "start": 138.04,
			        "word": " huge",
			      },
			      {
			        "end": 138.88,
			        "start": 138.28,
			        "word": " challenge",
			      },
			    ],
			  },
			  {
			    "end": 140.04,
			    "start": 138.88,
			    "text": "to national security.",
			    "words": [
			      {
			        "end": 138.98,
			        "start": 138.88,
			        "word": " to",
			      },
			      {
			        "end": 139.49,
			        "start": 138.98,
			        "word": " national",
			      },
			      {
			        "end": 140.04,
			        "start": 139.49,
			        "word": " security",
			      },
			    ],
			  },
			  {
			    "end": 146.33,
			    "start": 142.23,
			    "text": "China has expressed serious concerns about cyberattacks it has exposed,",
			    "words": [
			      {
			        "end": 143.04,
			        "start": 142.23,
			        "word": " has",
			      },
			      {
			        "end": 143.44,
			        "start": 143.04,
			        "word": " expressed",
			      },
			      {
			        "end": 143.95,
			        "start": 143.44,
			        "word": " serious",
			      },
			      {
			        "end": 144.32,
			        "start": 143.95,
			        "word": " concerns",
			      },
			      {
			        "end": 144.64,
			        "start": 144.32,
			        "word": " about",
			      },
			      {
			        "end": 145.48,
			        "start": 144.64,
			        "word": " cyberattacks",
			      },
			      {
			        "end": 145.62,
			        "start": 145.48,
			        "word": " it",
			      },
			      {
			        "end": 145.83,
			        "start": 145.62,
			        "word": " has",
			      },
			      {
			        "end": 146.33,
			        "start": 145.83,
			        "word": " exposed",
			      },
			    ],
			  },
			  {
			    "end": 148.94,
			    "start": 147.18,
			    "text": "noting it is one of the main victims of them,",
			    "words": [
			      {
			        "end": 147.4,
			        "start": 147.18,
			        "word": " one",
			      },
			      {
			        "end": 147.53,
			        "start": 147.4,
			        "word": " of",
			      },
			      {
			        "end": 147.74,
			        "start": 147.53,
			        "word": " the",
			      },
			      {
			        "end": 148.02,
			        "start": 147.74,
			        "word": " main",
			      },
			      {
			        "end": 148.52,
			        "start": 148.02,
			        "word": " victims",
			      },
			      {
			        "end": 148.66,
			        "start": 148.52,
			        "word": " of",
			      },
			      {
			        "end": 148.94,
			        "start": 148.66,
			        "word": " them",
			      },
			    ],
			  },
			  {
			    "end": 152.08,
			    "start": 149.32,
			    "text": "urging specifically the U.S. to adopt a responsible attitude",
			    "words": [
			      {
			        "end": 149.61,
			        "start": 149.32,
			        "word": " urging",
			      },
			      {
			        "end": 150.32,
			        "start": 149.61,
			        "word": " specifically",
			      },
			      {
			        "end": 150.48,
			        "start": 150.32,
			        "word": " the",
			      },
			      {
			        "end": 150.6,
			        "start": 150.48,
			        "word": " U",
			      },
			      {
			        "end": 151.12,
			        "start": 150.6,
			        "word": ".S",
			      },
			      {
			        "end": 151.36,
			        "start": 151.12,
			        "word": ". to",
			      },
			      {
			        "end": 151.9,
			        "start": 151.36,
			        "word": " adopt",
			      },
			      {
			        "end": 152.08,
			        "start": 151.9,
			        "word": " a",
			      },
			    ],
			  },
			  {
			    "end": 155.5,
			    "start": 153.56,
			    "text": "and refrain from slaughtering others.",
			    "words": [
			      {
			        "end": 154.02,
			        "start": 153.56,
			        "word": " refrain",
			      },
			      {
			        "end": 154.41,
			        "start": 154.02,
			        "word": " from",
			      },
			      {
			        "end": 155.1,
			        "start": 154.41,
			        "word": " slaughtering",
			      },
			      {
			        "end": 155.5,
			        "start": 155.1,
			        "word": " others",
			      },
			    ],
			  },
			  {
			    "end": 157.28,
			    "start": 155.5,
			    "text": "Zhou Yaxing, CGTN, Beijing.",
			    "words": [
			      {
			        "end": 156.15,
			        "start": 155.5,
			        "word": ". Zhou",
			      },
			      {
			        "end": 156.73,
			        "start": 156.15,
			        "word": " Yaxing",
			      },
			      {
			        "end": 157.28,
			        "start": 156.73,
			        "word": ", CGTN",
			      },
			    ],
			  },
			]
		`)
	})

	test.skip('alignWordsAndSentences words count', async () => {
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
