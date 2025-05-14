import { createOpenAI as createOpenAIModel } from '@ai-sdk/openai'
import type { Schema } from '@ai-sdk/ui-utils'
import { generateText as aiGenerateText, generateObject } from 'ai'
import type { z } from 'zod'
const API_BASE_URL = 'https://openrouter.ai/api/v1'

export default function createQWen({ apiKey }: { apiKey: string }) {
	const openai = createOpenAIModel({
		baseURL: API_BASE_URL,
		apiKey,
	})

	return {
		generateText: async ({
			system,
			prompt,
			maxTokens,
			model = 'qwen/qwen3-235b-a22b:free',
		}: {
			system: string
			prompt: string
			maxTokens?: number
			model?: string
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
			model = 'qwen/qwen3-235b-a22b:free',
		}: {
			system: string
			prompt: string
			schema: z.Schema<OBJECT, z.ZodTypeDef, unknown> | Schema<OBJECT>
			temperature?: number
			topP?: number
			maxTokens?: number
			model?: string
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

export const QWEN_MODELS = ['qwen/qwen3-235b-a22b:free', 'qwen/qwen3-30b-a3b:free', 'deepseek/deepseek-chat-v3-0324:free', 'tngtech/deepseek-r1t-chimera:free']
