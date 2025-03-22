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
	test(
		'splitTextToSentencesWithAI',
		async () => {
			const { text } = await getWords()
			const sentences = await splitTextToSentencesWithAI(text)
			expect(sentences).toMatchInlineSnapshot(`
				[
				  "There are concerns tonight over the future of education,",
				  "this following President Trump's signed executive order",
				  "to dismantle the Department of Education.",
				  "NBC4's Robert Kovacic is here now with what this means",
				  "and where the impacts could be felt.",
				  "Robert. Carolyn, first of all, the White House is pointing to low test scores",
				  "as one of the reasons for shaking things up.",
				  "The latest national report card showing 40 percent of fourth graders",
				  "don't meet basic benchmarks for reading",
				  "despite increases in federal funding.",
				  "Meantime, as you see right here, there are Save Our School rallies",
				  "all across the country, including Denver.",
				  "But tonight, right here in California, some are predicting dire ramifications.",
				  "President Trump tonight looking to keep a campaign promise.",
				  "I will sign an executive order to begin eliminating the federal Department of Education",
				  "once and for all.",
				  "At a White House event with school children and Republican governors.",
				  "The Democrats know it's right and I hope they're going to be voting for it",
				  "because ultimately it may come before them.",
				  "That's because this order may have little practical impact.",
				  "Only Congress can abolish an executive agency, a move Democrats oppose.",
				  "Education Secretary Linda McMahon promising full transparency with Congress.",
				  "Because we'll convince them that students are going to be better served",
				  "by eliminating the bureaucracy of the Department of Education.",
				  "The White House said today core department responsibilities",
				  "like managing student loans and Pell Grants",
				  "and supporting special education will be preserved.",
				  "Beyond these core necessities, my administration will take all lawful steps",
				  "to shut down the department.",
				  "He's trying to make it seem like this horrible thing isn't as horrible as-",
				  "California Attorney General Rob Bonta telling NBC4 California public schools",
				  "get 10-20% from the DOE.",
				  "So it's billions of dollars to us too that are in the form of student loans.",
				  "It does hurt poor kids.",
				  "It does hurt kids' civil rights.",
				  "It does hurt kids' dreams of going to college.",
				  "There's no way around it.",
				  "Bonta echoing the message from the American Federation of Teachers Union.",
				  "See you in court.",
				  "As for Los Angeles County.",
				  "We received annually about $1.2 billion of federal investment.",
				  "The largest program, the Title I program.",
				  "About $470 million benefiting the poorest of the poor in our school district.",
				  "The superintendent of the LAUSD warning of the impact",
				  "on the nation's second largest school district.",
				  "Any significant change to the appropriation level",
				  "undermining current funding levels could prove to be catastrophic",
				  "in terms of the quality of education kids get.",
				  "Tonight, Governor Newsom releasing this statement regarding the decision.",
				  "This overreach needs to be rejected immediately by a co-branch of government.",
				  "Or was Congress eliminated by this executive order too?",
				  "I'm Robert Kvasek.",
				]
			`)
		},
		{ timeout: 50000 },
	)
})
