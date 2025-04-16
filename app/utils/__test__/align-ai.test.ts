import fsp from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { alignWordsAndSentencesByAI } from '../align'

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

describe('alignWordsAndSentencesByAI', () => {
	test('should align all sentences in batch mode', { timeout: 1000 * 60 * 10 }, async () => {
		const { words } = await getWords()
		const result = await alignWordsAndSentencesByAI(words, sentences)
		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "end": 3.6,
			    "start": 0,
			    "text": "In a rare move, Chinese authorities have gestured zero tolerance",
			    "words": [
			      {
			        "end": 0.14,
			        "start": 0,
			        "word": "",
			      },
			      {
			        "end": 0.15,
			        "start": 0.14,
			        "word": " In",
			      },
			      {
			        "end": 0.21,
			        "start": 0.15,
			        "word": " a",
			      },
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
			        "end": 0.97,
			        "start": 0.79,
			        "word": ",",
			      },
			      {
			        "end": 1.36,
			        "start": 0.97,
			        "word": " Chinese",
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
			        "end": 2.56,
			        "start": 2.44,
			        "word": " gest",
			      },
			      {
			        "end": 2.8,
			        "start": 2.56,
			        "word": "ured",
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
			        "end": 4.48,
			        "start": 4.08,
			        "word": " cyber",
			      },
			      {
			        "end": 4.78,
			        "start": 4.48,
			        "word": "att",
			      },
			      {
			        "end": 5.2,
			        "start": 4.78,
			        "word": "acks",
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
			        "end": 9.37,
			        "start": 9.28,
			        "word": " of",
			      },
			      {
			        "end": 9.43,
			        "start": 9.37,
			        "word": " a",
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
			        "end": 9.83,
			        "start": 9.7,
			        "word": " of",
			      },
			      {
			        "end": 9.86,
			        "start": 9.83,
			        "word": " U",
			      },
			      {
			        "end": 10.03,
			        "start": 9.86,
			        "word": ".",
			      },
			      {
			        "end": 10.08,
			        "start": 10.03,
			        "word": "S",
			      },
			      {
			        "end": 10.25,
			        "start": 10.08,
			        "word": ".",
			      },
			      {
			        "end": 10.81,
			        "start": 10.25,
			        "word": " government",
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
			      {
			        "end": 12.64,
			        "start": 12.64,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 16.45,
			    "start": 12.64,
			    "text": "The Public Security Bureau Harbin in northeast China's Heilongjiang province",
			    "words": [
			      {
			        "end": 12.8,
			        "start": 12.64,
			        "word": " The",
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
			        "end": 14.14,
			        "start": 13.9,
			        "word": " Har",
			      },
			      {
			        "end": 14.22,
			        "start": 14.14,
			        "word": "bin",
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
			      {
			        "end": 15.47,
			        "start": 15.21,
			        "word": " Heil",
			      },
			      {
			        "end": 15.59,
			        "start": 15.47,
			        "word": "ong",
			      },
			      {
			        "end": 15.92,
			        "start": 15.59,
			        "word": "jiang",
			      },
			      {
			        "end": 16.45,
			        "start": 15.92,
			        "word": " province",
			      },
			    ],
			  },
			  {
			    "end": 21.41,
			    "start": 16.45,
			    "text": "disclosed that Katherine Wilson, Robert Snelling, and Stephen Johnson",
			    "words": [
			      {
			        "end": 16.78,
			        "start": 16.45,
			        "word": " discl",
			      },
			      {
			        "end": 17.04,
			        "start": 16.78,
			        "word": "osed",
			      },
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
			        "end": 18.81,
			        "start": 18.67,
			        "word": ",",
			      },
			      {
			        "end": 19.24,
			        "start": 18.81,
			        "word": " Robert",
			      },
			      {
			        "end": 19.45,
			        "start": 19.24,
			        "word": " Sne",
			      },
			      {
			        "end": 19.8,
			        "start": 19.45,
			        "word": "lling",
			      },
			      {
			        "end": 19.96,
			        "start": 19.8,
			        "word": ",",
			      },
			      {
			        "end": 20.15,
			        "start": 19.96,
			        "word": " and",
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
			    "end": 24.15,
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
			        "end": 22.55,
			        "start": 22.2,
			        "word": " cyber",
			      },
			      {
			        "end": 22.75,
			        "start": 22.55,
			        "word": "att",
			      },
			      {
			        "end": 23.04,
			        "start": 22.75,
			        "word": "acks",
			      },
			      {
			        "end": 23.04,
			        "start": 23.04,
			        "word": ",",
			      },
			      {
			        "end": 23.16,
			        "start": 23.04,
			        "word": " sk",
			      },
			      {
			        "end": 23.29,
			        "start": 23.16,
			        "word": "im",
			      },
			      {
			        "end": 23.47,
			        "start": 23.29,
			        "word": "med",
			      },
			      {
			        "end": 23.59,
			        "start": 23.47,
			        "word": " by",
			      },
			      {
			        "end": 23.71,
			        "start": 23.59,
			        "word": " an",
			      },
			      {
			        "end": 24.15,
			        "start": 23.71,
			        "word": " office",
			      },
			    ],
			  },
			  {
			    "end": 27.97,
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
			        "end": 24.59,
			        "start": 24.4,
			        "word": ".",
			      },
			      {
			        "end": 24.65,
			        "start": 24.59,
			        "word": "S",
			      },
			      {
			        "end": 24.84,
			        "start": 24.65,
			        "word": ".",
			      },
			      {
			        "end": 25.35,
			        "start": 24.84,
			        "word": " National",
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
			      {
			        "end": 26.32,
			        "start": 26.1,
			        "word": ",",
			      },
			      {
			        "end": 26.45,
			        "start": 26.32,
			        "word": "",
			      },
			      {
			        "end": 26.68,
			        "start": 26.45,
			        "word": " notor",
			      },
			      {
			        "end": 27.12,
			        "start": 26.68,
			        "word": "iously",
			      },
			      {
			        "end": 27.48,
			        "start": 27.12,
			        "word": " known",
			      },
			      {
			        "end": 27.62,
			        "start": 27.48,
			        "word": " as",
			      },
			      {
			        "end": 27.82,
			        "start": 27.62,
			        "word": " TA",
			      },
			      {
			        "end": 27.83,
			        "start": 27.82,
			        "word": "O",
			      },
			      {
			        "end": 27.97,
			        "start": 27.83,
			        "word": ",",
			      },
			    ],
			  },
			  {
			    "end": 31.12,
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
			        "end": 29.46,
			        "start": 29.13,
			        "word": " Tail",
			      },
			      {
			        "end": 29.78,
			        "start": 29.46,
			        "word": "ored",
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
			      {
			        "end": 31.12,
			        "start": 30.76,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 35.54,
			    "start": 31.12,
			    "text": "China also detected the mastermind behind a 2022 cyberattack",
			    "words": [
			      {
			        "end": 31.48,
			        "start": 31.12,
			        "word": " China",
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
			        "end": 32.97,
			        "start": 32.54,
			        "word": " master",
			      },
			      {
			        "end": 33.25,
			        "start": 32.97,
			        "word": "mind",
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
			      {
			        "end": 34.97,
			        "start": 34.61,
			        "word": " cyber",
			      },
			      {
			        "end": 35.54,
			        "start": 34.97,
			        "word": "attack",
			      },
			    ],
			  },
			  {
			    "end": 39.62,
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
			        "end": 39.1,
			        "start": 38.9,
			        "word": " TA",
			      },
			      {
			        "end": 39.2,
			        "start": 39.1,
			        "word": "O",
			      },
			      {
			        "end": 39.62,
			        "start": 39.2,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 42.4,
			    "start": 39.62,
			    "text": "Calling those three secret agents, Harbin police said",
			    "words": [
			      {
			        "end": 39.95,
			        "start": 39.62,
			        "word": " Calling",
			      },
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
			        "end": 41.44,
			        "start": 41.28,
			        "word": ",",
			      },
			      {
			        "end": 41.68,
			        "start": 41.44,
			        "word": " Har",
			      },
			      {
			        "end": 41.92,
			        "start": 41.68,
			        "word": "bin",
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
			    "end": 45.66,
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
			      {
			        "end": 45.26,
			        "start": 44.97,
			        "word": " cyber",
			      },
			      {
			        "end": 45.43,
			        "start": 45.26,
			        "word": "att",
			      },
			      {
			        "end": 45.66,
			        "start": 45.43,
			        "word": "acks",
			      },
			    ],
			  },
			  {
			    "end": 49.59,
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
			      {
			        "end": 49.59,
			        "start": 49.46,
			        "word": ",",
			      },
			    ],
			  },
			  {
			    "end": 51.43,
			    "start": 49.59,
			    "text": "including tech giant Huawei.",
			    "words": [
			      {
			        "end": 50.17,
			        "start": 49.59,
			        "word": " including",
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
			      {
			        "end": 51.43,
			        "start": 51.14,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 55.76,
			    "start": 51.43,
			    "text": "And the latest was Harbin's Asian Winter Games this February.",
			    "words": [
			      {
			        "end": 51.55,
			        "start": 51.43,
			        "word": " And",
			      },
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
			        "end": 52.42,
			        "start": 52.21,
			        "word": " Har",
			      },
			      {
			        "end": 52.63,
			        "start": 52.42,
			        "word": "bin",
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
			        "end": 54.01,
			        "start": 54,
			        "word": "",
			      },
			      {
			        "end": 54.46,
			        "start": 54.01,
			        "word": " this",
			      },
			      {
			        "end": 55.39,
			        "start": 54.46,
			        "word": " February",
			      },
			      {
			        "end": 55.76,
			        "start": 55.39,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 59.84,
			    "start": 55.76,
			    "text": "During the Asian Winter Games, the NSA purchased IP addresses",
			    "words": [
			      {
			        "end": 56.16,
			        "start": 55.76,
			        "word": " During",
			      },
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
			        "end": 57.6,
			        "start": 57.44,
			        "word": ",",
			      },
			      {
			        "end": 57.96,
			        "start": 57.6,
			        "word": " the",
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
			        "end": 61.51,
			        "start": 61.09,
			        "word": " anonym",
			      },
			      {
			        "end": 61.86,
			        "start": 61.51,
			        "word": "ously",
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
			        "end": 65.53,
			        "start": 65.31,
			        "word": ",",
			      },
			      {
			        "end": 66,
			        "start": 65.53,
			        "word": " Asia",
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
			    "end": 70.06,
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
			      {
			        "end": 70.06,
			        "start": 69.92,
			        "word": ",",
			      },
			    ],
			  },
			  {
			    "end": 74.27,
			    "start": 70.06,
			    "text": "critical information infrastructure and specific departments.",
			    "words": [
			      {
			        "end": 70.63,
			        "start": 70.06,
			        "word": " critical",
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
			      {
			        "end": 74.27,
			        "start": 73.95,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 78.42,
			    "start": 74.27,
			    "text": "This time, we've also found the NSA has conducted zero-day attacks",
			    "words": [
			      {
			        "end": 74.5,
			        "start": 74.27,
			        "word": " This",
			      },
			      {
			        "end": 74.77,
			        "start": 74.5,
			        "word": " time",
			      },
			      {
			        "end": 74.92,
			        "start": 74.77,
			        "word": ",",
			      },
			      {
			        "end": 75.17,
			        "start": 74.92,
			        "word": " we",
			      },
			      {
			        "end": 75.29,
			        "start": 75.17,
			        "word": "'ve",
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
			        "end": 77.67,
			        "start": 77.6,
			        "word": "-",
			      },
			      {
			        "end": 77.89,
			        "start": 77.67,
			        "word": "day",
			      },
			      {
			        "end": 78.42,
			        "start": 77.89,
			        "word": " attacks",
			      },
			    ],
			  },
			  {
			    "end": 81.43,
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
			        "end": 79.84,
			        "start": 79.84,
			        "word": "",
			      },
			      {
			        "end": 80.07,
			        "start": 79.84,
			        "word": " tro",
			      },
			      {
			        "end": 80.14,
			        "start": 80.07,
			        "word": "j",
			      },
			      {
			        "end": 80.38,
			        "start": 80.14,
			        "word": "ans",
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
			      {
			        "end": 81.05,
			        "start": 80.75,
			        "word": " impl",
			      },
			      {
			        "end": 81.43,
			        "start": 81.05,
			        "word": "anted",
			      },
			    ],
			  },
			  {
			    "end": 86.24,
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
			      {
			        "end": 86.24,
			        "start": 86.18,
			        "word": ",",
			      },
			    ],
			  },
			  {
			    "end": 89.09,
			    "start": 86.24,
			    "text": "similar to a time bomb that can be awakened at any time",
			    "words": [
			      {
			        "end": 86.7,
			        "start": 86.24,
			        "word": " similar",
			      },
			      {
			        "end": 86.83,
			        "start": 86.7,
			        "word": " to",
			      },
			      {
			        "end": 86.89,
			        "start": 86.83,
			        "word": " a",
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
			      {
			        "end": 90.88,
			        "start": 90.88,
			        "word": ".",
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
			        "word": " Further",
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
			    "end": 101.27,
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
			        "end": 98.64,
			        "start": 98.64,
			        "word": "",
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
			      {
			        "end": 101.27,
			        "start": 100.72,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 105.6,
			    "start": 101.27,
			    "text": "Both institutes were founded by the NSA in the realm of cyber warfare,",
			    "words": [
			      {
			        "end": 101.3,
			        "start": 101.27,
			        "word": " Both",
			      },
			      {
			        "end": 101.8,
			        "start": 101.3,
			        "word": " instit",
			      },
			      {
			        "end": 102.36,
			        "start": 101.8,
			        "word": "utes",
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
			      {
			        "end": 105.6,
			        "start": 105.43,
			        "word": ",",
			      },
			    ],
			  },
			  {
			    "end": 108.16,
			    "start": 105.6,
			    "text": "and this warfare is now in a smarter trend.",
			    "words": [
			      {
			        "end": 105.8,
			        "start": 105.6,
			        "word": " and",
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
			        "end": 107,
			        "start": 106.88,
			        "word": " in",
			      },
			      {
			        "end": 107.23,
			        "start": 107,
			        "word": " a",
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
			      {
			        "end": 108.16,
			        "start": 107.88,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 114.09,
			    "start": 108.16,
			    "text": "The U.S. cyberattacks have applied AI technology in their scope.",
			    "words": [
			      {
			        "end": 108.44,
			        "start": 108.16,
			        "word": " The",
			      },
			      {
			        "end": 108.58,
			        "start": 108.44,
			        "word": " U",
			      },
			      {
			        "end": 108.81,
			        "start": 108.58,
			        "word": ".",
			      },
			      {
			        "end": 108.9,
			        "start": 108.81,
			        "word": "S",
			      },
			      {
			        "end": 109.18,
			        "start": 108.9,
			        "word": ".",
			      },
			      {
			        "end": 109.64,
			        "start": 109.18,
			        "word": " cyber",
			      },
			      {
			        "end": 110.07,
			        "start": 109.64,
			        "word": "att",
			      },
			      {
			        "end": 110.31,
			        "start": 110.07,
			        "word": "acks",
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
			      {
			        "end": 114.09,
			        "start": 113.63,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 116.98,
			    "start": 114.09,
			    "text": "Not only the games registration information systems,",
			    "words": [
			      {
			        "end": 114.19,
			        "start": 114.09,
			        "word": " Not",
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
			      {
			        "end": 116.98,
			        "start": 116.85,
			        "word": ",",
			      },
			    ],
			  },
			  {
			    "end": 120.77,
			    "start": 116.98,
			    "text": "but also a number of infrastructure units in Heilongjiang province",
			    "words": [
			      {
			        "end": 117.28,
			        "start": 116.98,
			        "word": " but",
			      },
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
			        "end": 119.63,
			        "start": 119.37,
			        "word": " Heil",
			      },
			      {
			        "end": 119.82,
			        "start": 119.63,
			        "word": "ong",
			      },
			      {
			        "end": 120.14,
			        "start": 119.82,
			        "word": "jiang",
			      },
			      {
			        "end": 120.77,
			        "start": 120.14,
			        "word": " province",
			      },
			    ],
			  },
			  {
			    "end": 121.68,
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
			      {
			        "end": 121.68,
			        "start": 121.38,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 125.39,
			    "start": 121.68,
			    "text": "The AI agents can copy a large number of digital hackers",
			    "words": [
			      {
			        "end": 121.84,
			        "start": 121.68,
			        "word": " The",
			      },
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
			        "end": 123.44,
			        "start": 123.44,
			        "word": "",
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
			        "end": 127.21,
			        "start": 126.83,
			        "word": ",",
			      },
			      {
			        "end": 127.55,
			        "start": 127.21,
			        "word": " generate",
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
			    "end": 131.05,
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
			        "end": 129.5,
			        "start": 129.28,
			        "word": " ind",
			      },
			      {
			        "end": 129.85,
			        "start": 129.5,
			        "word": "isc",
			      },
			      {
			        "end": 130.09,
			        "start": 129.85,
			        "word": "rimin",
			      },
			      {
			        "end": 130.37,
			        "start": 130.09,
			        "word": "ate",
			      },
			      {
			        "end": 130.83,
			        "start": 130.37,
			        "word": " attacks",
			      },
			      {
			        "end": 131.05,
			        "start": 130.83,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 134.55,
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
			      {
			        "end": 134.55,
			        "start": 134.26,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 138.88,
			    "start": 134.55,
			    "text": "This type of attack is unprecedented and poses a huge challenge",
			    "words": [
			      {
			        "end": 135.21,
			        "start": 134.55,
			        "word": " This",
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
			    "end": 140.24,
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
			      {
			        "end": 140.24,
			        "start": 140.04,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 146.47,
			    "start": 140.24,
			    "text": "China has expressed serious concerns about cyberattacks it has exposed,",
			    "words": [
			      {
			        "end": 142.23,
			        "start": 140.24,
			        "word": " China",
			      },
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
			        "end": 144.99,
			        "start": 144.64,
			        "word": " cyber",
			      },
			      {
			        "end": 145.19,
			        "start": 144.99,
			        "word": "att",
			      },
			      {
			        "end": 145.48,
			        "start": 145.19,
			        "word": "acks",
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
			      {
			        "end": 146.47,
			        "start": 146.33,
			        "word": ",",
			      },
			    ],
			  },
			  {
			    "end": 149.32,
			    "start": 146.47,
			    "text": "noting it is one of the main victims of them,",
			    "words": [
			      {
			        "end": 146.91,
			        "start": 146.47,
			        "word": " noting",
			      },
			      {
			        "end": 147.04,
			        "start": 146.91,
			        "word": " it",
			      },
			      {
			        "end": 147.18,
			        "start": 147.04,
			        "word": " is",
			      },
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
			      {
			        "end": 149.32,
			        "start": 148.94,
			        "word": ",",
			      },
			    ],
			  },
			  {
			    "end": 153.36,
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
			        "end": 150.95,
			        "start": 150.6,
			        "word": ".",
			      },
			      {
			        "end": 151.12,
			        "start": 150.95,
			        "word": "S",
			      },
			      {
			        "end": 151.3,
			        "start": 151.12,
			        "word": ".",
			      },
			      {
			        "end": 151.36,
			        "start": 151.3,
			        "word": " to",
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
			      {
			        "end": 152.08,
			        "start": 152.08,
			        "word": "",
			      },
			      {
			        "end": 152.82,
			        "start": 152.08,
			        "word": " responsible",
			      },
			      {
			        "end": 153.36,
			        "start": 152.82,
			        "word": " attitude",
			      },
			    ],
			  },
			  {
			    "end": 155.76,
			    "start": 153.36,
			    "text": "and refrain from slaughtering others.",
			    "words": [
			      {
			        "end": 153.56,
			        "start": 153.36,
			        "word": " and",
			      },
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
			        "end": 154.5,
			        "start": 154.41,
			        "word": " sla",
			      },
			      {
			        "end": 154.77,
			        "start": 154.5,
			        "word": "ught",
			      },
			      {
			        "end": 155.1,
			        "start": 154.77,
			        "word": "ering",
			      },
			      {
			        "end": 155.5,
			        "start": 155.1,
			        "word": " others",
			      },
			      {
			        "end": 155.76,
			        "start": 155.5,
			        "word": ".",
			      },
			    ],
			  },
			  {
			    "end": 158.24,
			    "start": 155.76,
			    "text": "Zhou Yaxing, CGTN, Beijing.",
			    "words": [
			      {
			        "end": 156.15,
			        "start": 155.76,
			        "word": " Zhou",
			      },
			      {
			        "end": 156.23,
			        "start": 156.15,
			        "word": " Y",
			      },
			      {
			        "end": 156.45,
			        "start": 156.23,
			        "word": "ax",
			      },
			      {
			        "end": 156.73,
			        "start": 156.45,
			        "word": "ing",
			      },
			      {
			        "end": 156.92,
			        "start": 156.73,
			        "word": ",",
			      },
			      {
			        "end": 157.11,
			        "start": 156.92,
			        "word": " CG",
			      },
			      {
			        "end": 157.18,
			        "start": 157.11,
			        "word": "T",
			      },
			      {
			        "end": 157.28,
			        "start": 157.18,
			        "word": "N",
			      },
			      {
			        "end": 157.48,
			        "start": 157.28,
			        "word": ",",
			      },
			      {
			        "end": 158.23,
			        "start": 157.48,
			        "word": " Beijing",
			      },
			      {
			        "end": 158.24,
			        "start": 158.23,
			        "word": ".",
			      },
			    ],
			  },
			]
		`)
	})
})
