import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Transcript } from '~/types'
import { type AiModel, aiGenerateText } from '~/utils/ai'

async function translateSubtitle(text: string, model: AiModel = 'deepseek'): Promise<string> {
	const MAX_TOKENS = 8000

	const translatePrompt = `You are a master translator fluent in multiple languages. Your task is to translate the given text into Chinese. If the text is already in Chinese, return it unchanged.

Please follow these guidelines:
1. Maintain the original meaning and context
2. Preserve specific terminology or names from the original text
3. Ensure the translation sounds natural in Chinese
4. Maintain the original formatting including line breaks
5. Do not add explanations or interpretations
6. Each segment is prefixed with an index number in square brackets like "[1]", "[2]", etc. - KEEP these indices in your response
7. Segments are separated by "---" - translate each segment independently while maintaining consistency
8. If the input is empty, return an empty response
9. Preserve the exact number of segments in your response

The text will be from subtitle content, so translations should be concise and suitable for on-screen display.`

	return aiGenerateText({
		systemPrompt: translatePrompt,
		prompt: text,
		model: model,
		maxTokens: MAX_TOKENS,
	})
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const model = formData.get('model') as AiModel

	const where = eq(schema.subtitleTranslations.id, id)
	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')
	invariant(subtitleTranslation.sentences && subtitleTranslation.sentences.length > 0, 'Aligned sentences are required for translation')

	// Extract all texts to translate
	const textsToTranslate = subtitleTranslation.sentences.map((sentence) => sentence.text)

	// Instead of batch translation, we'll use a more reliable approach
	// Process in smaller batches to avoid losing segments
	const BATCH_SIZE = 20
	const translatedTexts: string[] = []

	// Process in batches
	for (let i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
		const batch = textsToTranslate.slice(i, i + BATCH_SIZE)
		const batchWithIndices = batch.map((text, index) => `[${i + index + 1}] ${text}`)
		const combinedBatchText = batchWithIndices.join('\n---\n')

		// Translate the batch
		const translatedBatchText = await translateSubtitle(combinedBatchText, model)

		// Extract translations with their indices
		const translatedBatch = translatedBatchText.split('\n---\n').map((item) => item.trim())

		// Process each translated item to remove the index prefix if present
		for (let j = 0; j < translatedBatch.length; j++) {
			const indexInFullArray = i + j
			if (indexInFullArray < textsToTranslate.length) {
				// Remove index prefix if present (e.g., "[123] Translated text" -> "Translated text")
				const text = translatedBatch[j].replace(/^\[\d+\]\s*/, '').trim()
				translatedTexts[indexInFullArray] = text
			}
		}
	}

	// Fill any missing translations with empty strings
	while (translatedTexts.length < textsToTranslate.length) {
		translatedTexts.push('')
	}

	// Update the sentences with translations
	const updatedSentences = subtitleTranslation.sentences.map((sentence, index) => {
		return {
			...sentence,
			textInterpretation: translatedTexts[index] || '',
		} as Transcript
	})

	// Update the database
	await db
		.update(schema.subtitleTranslations)
		.set({
			sentences: updatedSentences,
		})
		.where(where)

	return {}
}
