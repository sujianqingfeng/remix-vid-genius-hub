import { data } from '@remix-run/node'
import { z } from 'zod'
import { GenerateWordSentencesSchema } from '~/schema'
import type { GenerateWordSentences, GenerateWordSentencesActionData, GenerationWordSentencesErrors } from '~/types'
import { type AiModel, chatGPT, deepSeek, gemini, r1 } from '~/utils/ai'

// Define validation schema
const GenerateSchema = z.object({
	prompt: z.string().min(1, 'Prompt is required'),
	model: z.string().min(1, 'Model is required'),
})

async function generateWordSentences(prompt: string, aiModel: string): Promise<GenerateWordSentences['list']> {
	const systemPrompt = `
You are a language learning assistant specialized in creating engaging content for English learners. 
Generate diverse word-sentence pairs based on the user's prompt.

For each pair, provide the following fields exactly:
1. word: An English word (appropriate for intermediate language learners)
2. wordZh: Its Chinese translation (simplified Chinese)
3. sentence: A natural, conversational sentence using the word in a clear context
4. sentenceZh: Chinese translation of the sentence that maintains the original meaning

Generate 5 varied word-sentence pairs based on the user's prompt.
Ensure diversity in word types (nouns, verbs, adjectives, etc.) and sentence structures.
If no specific topic is given, create pairs around common, useful everyday vocabulary.
`

	try {
		let result: GenerateWordSentences

		// Select the AI model based on the parameter
		switch (aiModel as AiModel) {
			case 'r1':
				result = await r1.generateObject({
					system: systemPrompt,
					prompt,
					schema: GenerateWordSentencesSchema,
					maxTokens: 2000,
				})
				break
			case 'openai':
				result = await chatGPT.generateObject({
					system: systemPrompt,
					prompt,
					schema: GenerateWordSentencesSchema,
					temperature: 0.7,
				})
				break
			case 'deepseek':
				result = await deepSeek.generateObject({
					system: systemPrompt,
					prompt,
					schema: GenerateWordSentencesSchema,
					temperature: 0.7,
				})
				break
			case 'gemini':
				result = await gemini.generateObject({
					system: systemPrompt,
					prompt,
					schema: GenerateWordSentencesSchema,
					temperature: 0.7,
				})
				break
			default:
				// Default to r1 if the model is not recognized
				result = await r1.generateObject({
					system: systemPrompt,
					prompt,
					schema: GenerateWordSentencesSchema,
					maxTokens: 2000,
				})
		}

		return result.list
	} catch (error) {
		console.error('Error generating word sentences:', error)
		throw new Error('Failed to generate word sentences')
	}
}

export const action = async ({ request }: { request: Request }) => {
	const formData = await request.formData()

	try {
		const payload = {
			prompt: formData.get('prompt'),
			model: formData.get('model'),
		}

		// Validate the input
		const validatedData = GenerateSchema.parse(payload)

		// Generate word sentences
		const generatedResults = await generateWordSentences(validatedData.prompt, validatedData.model)

		return data<GenerateWordSentencesActionData>(
			{
				success: true,
				data: generatedResults,
			},
			{ status: 200 },
		)
	} catch (error) {
		console.error('Error generating content:', error)

		if (error instanceof z.ZodError) {
			return data<GenerateWordSentencesActionData>(
				{
					success: false,
					errors: error.flatten().fieldErrors as GenerationWordSentencesErrors,
				},
				{ status: 400 },
			)
		}

		return data<GenerateWordSentencesActionData>(
			{
				success: false,
				errors: { _form: ['An unexpected error occurred during generation'] },
			},
			{ status: 500 },
		)
	}
}
