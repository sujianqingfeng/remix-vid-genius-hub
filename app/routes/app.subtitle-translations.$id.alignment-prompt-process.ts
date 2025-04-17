import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Transcript, WordWithTime } from '~/types'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const promptText = formData.get('promptText') as string
	invariant(promptText, 'promptText is required')

	try {
		// Extract the AI response from the user-pasted text
		// Handle various formats that might be pasted

		// First try to find JSON response between triple backticks
		let jsonContent = null
		const codeBlockMatch = promptText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)

		if (codeBlockMatch) {
			jsonContent = codeBlockMatch[1].trim()
		} else {
			// If no code blocks found, try to find JSON object directly
			const jsonMatch = promptText.match(/\{[\s\S]*"indices"[\s\S]*\}/)
			if (jsonMatch) {
				jsonContent = jsonMatch[0].trim()
			} else {
				// Last attempt - see if the entire text is valid JSON
				try {
					JSON.parse(promptText.trim())
					jsonContent = promptText.trim()
				} catch {
					// Not valid JSON, continue with further processing
				}
			}
		}

		if (!jsonContent) {
			return { error: 'Could not find JSON response in the pasted text. Please make sure to paste the AI-generated result containing JSON data.' }
		}

		// Parse the JSON content
		const result = JSON.parse(jsonContent)

		// Validate the structure - looking for indices property
		if (!result.indices || !Array.isArray(result.indices)) {
			return { error: 'Invalid response format: missing or invalid "indices" array in the JSON result.' }
		}

		// Get the subtitle translation to access words and sentences
		const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
			where: eq(schema.subtitleTranslations.id, id),
		})
		invariant(subtitleTranslation, 'subtitleTranslation not found')

		const { withTimeWords, splitSentences } = subtitleTranslation
		invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for processing')
		invariant(splitSentences && splitSentences.length > 0, 'Split sentences are required for processing')

		// Build the sentences with timing information
		const sentencesData: Transcript[] = []

		for (let i = 0; i < result.indices.length; i++) {
			const indices = result.indices[i]
			if (!indices || indices.length === 0) continue

			// Make sure all indices are within valid range
			const validIndices = indices.filter((idx: number) => idx >= 0 && idx < withTimeWords.length)
			if (validIndices.length === 0) continue

			// Get the words for this sentence
			const words = validIndices.map((idx: number) => withTimeWords[idx])

			// Create transcript entry
			sentencesData.push({
				text: splitSentences[i] || '',
				start: Math.min(...words.map((w: WordWithTime) => w.start)),
				end: Math.max(...words.map((w: WordWithTime) => w.end)),
				words: words,
			})
		}

		if (sentencesData.length === 0) {
			return { error: 'Could not align any sentences with the provided indices.' }
		}

		// Update the database with the processed sentences
		await db
			.update(schema.subtitleTranslations)
			.set({
				sentences: sentencesData,
			})
			.where(eq(schema.subtitleTranslations.id, id))

		return {
			success: true,
			sentenceCount: sentencesData.length,
		}
	} catch (error) {
		console.error('Error processing AI result:', error)
		return {
			error: error instanceof Error ? error.message : 'Unknown error processing AI result',
		}
	}
}
