import { type AiModel, aiGenerateText } from './ai'

export async function translate(content: string, model: AiModel) {
	return await aiGenerateText({
		model,
		systemPrompt:
			'Translate the following text to idiomatic Chinese. Keep proper nouns and technical terms in their original form when appropriate. Return only the translation without any annotations or explanations.',
		prompt: content,
		maxTokens: 1000,
	})
}
