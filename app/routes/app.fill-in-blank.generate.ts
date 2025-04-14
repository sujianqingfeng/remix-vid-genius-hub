import { type ActionFunctionArgs, data } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import type { FillInBlankSentence } from '~/types'
import { chatGPT } from '~/utils/ai'

const GenerateSchema = z.object({
	list: z.array(
		z.object({
			sentence: z.string(),
			word: z.string(),
			sentenceZh: z.string(),
			wordZh: z.string(),
			wordPronunciation: z.string(),
			wordInSentenceZh: z.string(),
		}),
	),
})

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()
	const prompt = formData.get('prompt')

	invariant(prompt, 'prompt is required')

	const result = await chatGPT.generateObject({
		system: '',
		prompt: prompt as string,
		schema: GenerateSchema,
		temperature: 0.8,
		topP: 0.9,
	})

	return data<FillInBlankSentence[]>(result.list)
}
