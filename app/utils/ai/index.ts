import createChatGPT from './chatgpt'
import createDeepSeek from './deep-seek'
import createGemini from './gemini'
import createOpenRouterR1 from './open-router-r1'
import createQWen from './qwen'
import createR1 from './r1'
import { createVolcanoEngineDeepseekV3 } from './volcengine'

const chatGPT = createChatGPT({ apiKey: process.env.OPEN_AI_API_KEY || '' })
const deepSeek = createDeepSeek({ apiKey: process.env.DEEP_SEEK_API_KEY || '' })
// const r1 = createR1({ apiKey: process.env.SILICON_FLOW_API_KEY || '' })
const r1 = createOpenRouterR1({ apiKey: process.env.QWEN_API_KEY || '' })
const volcanoEngineDeepseekV3 = createVolcanoEngineDeepseekV3({ apiKey: process.env.DOU_BAO_API_KEY || '' })
const gemini = createGemini({ apiKey: process.env.OPEN_AI_API_KEY || '' })
const qwen = createQWen({ apiKey: process.env.QWEN_API_KEY || '' })
export type AiModel = 'deepseek' | 'openai' | 'r1' | 'volcanoEngineDeepseekV3' | 'gemini' | 'qwen'

type AiGenerateTextOptions = {
	systemPrompt: string
	prompt: string
	model: AiModel
	maxTokens?: number
}
export async function aiGenerateText({ systemPrompt, prompt, model, maxTokens }: AiGenerateTextOptions): Promise<string> {
	const options = {
		system: systemPrompt,
		prompt: prompt,
		maxTokens: maxTokens,
	}

	switch (model) {
		case 'openai': {
			return chatGPT.generateText(options)
		}
		case 'r1': {
			return r1.generateText(options)
		}
		case 'deepseek': {
			return deepSeek.generateText(options)
		}
		case 'volcanoEngineDeepseekV3': {
			return volcanoEngineDeepseekV3.generateText(options)
		}
		case 'gemini': {
			return gemini.generateText(options)
		}
		case 'qwen': {
			return qwen.generateText(options)
		}
		default: {
			throw new Error(`Unsupported model: ${model}`)
		}
	}
}

export { deepSeek, chatGPT, r1, volcanoEngineDeepseekV3, gemini, qwen }
