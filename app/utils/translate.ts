import { type AiModel, aiGenerateText } from './ai'

export async function translate(content: string, model: AiModel) {
	return await aiGenerateText({
		model,
		systemPrompt: `You are a professional translator. Translate the following text to Chinese. Maintain the original meaning, tone, and style. If there are any technical terms, ensure they are translated accurately.Don't explain anything.`,
		prompt: content,
		maxTokens: 1000,
	})
}
