import { createOpenAI } from '@ai-sdk/openai'
import type { Schema } from '@ai-sdk/ui-utils'
import { type CoreMessage, generateText as aiGenerateText, generateObject } from 'ai'
import type { z } from 'zod'

const API_BASE_URL = 'https://openrouter.ai/api/v1'
const model = 'deepseek/deepseek-r1-0528:free'

function createOpenRouterR1({ apiKey }: { apiKey: string }) {
	const openai = createOpenAI({
		baseURL: API_BASE_URL,
		apiKey,
	})

	return {
		generateText: async ({
			system,
			prompt,
			maxTokens,
			messages,
		}: {
			system?: string
			prompt?: string
			maxTokens?: number
			messages?: Array<CoreMessage>
		}) => {
			console.log('🚀 ~ createOpenRouterR1 ~ prompt:', prompt)
			const { text } = await aiGenerateText({
				model: openai(model),
				system,
				prompt,
				maxTokens,
				messages,
			})
			return text
		},
		generateObject: async <OBJECT>({
			system,
			prompt,
			schema,
			messages,
		}: {
			system?: string
			prompt?: string
			messages?: Array<CoreMessage>
			schema: z.Schema<OBJECT, z.ZodTypeDef, any> | Schema<OBJECT>
		}) => {
			const { object } = await generateObject({
				model: openai(model),
				schema,
				system,
				prompt,
				messages,
			})

			return object
		},
	}
}

export default createOpenRouterR1
