import { createOpenAI } from '@ai-sdk/openai'
import type { Schema } from '@ai-sdk/ui-utils'
import { generateText as aiGenerateText, generateObject } from 'ai'
import type { z } from 'zod'

const API_BASE_URL = 'https://api.chatanywhere.tech'

const model = 'gpt-4.1-mini'

function createChatGPT({ apiKey }: { apiKey: string }) {
	const openai = createOpenAI({
		baseURL: API_BASE_URL,
		apiKey,
	})

	return {
		generateText: async ({
			system,
			prompt,
			maxTokens,
		}: {
			system: string
			prompt: string
			maxTokens?: number
		}) => {
			const { text } = await aiGenerateText({
				model: openai(model),
				system,
				prompt,
				maxTokens,
			})
			return text
		},
		generateObject: async <OBJECT>({
			system,
			prompt,
			schema,
			temperature,
			topP,
			maxTokens,
		}: {
			system: string
			prompt: string
			schema: z.Schema<OBJECT, z.ZodTypeDef, any> | Schema<OBJECT>
			temperature?: number
			topP?: number
			maxTokens?: number
		}) => {
			const { object } = await generateObject({
				model: openai(model),
				schema,
				system,
				prompt,
				temperature,
				topP,
				maxTokens,
			})

			return object
		},
	}
}

export default createChatGPT
