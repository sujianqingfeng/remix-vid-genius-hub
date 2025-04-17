import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { parseAlignWordsAndSentencesResult } from '~/utils/align'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const promptText = formData.get('promptText') as string
	invariant(promptText, 'promptText is required')

	try {
		// Get the subtitle translation to access words and sentences
		const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
			where: eq(schema.subtitleTranslations.id, id),
		})
		invariant(subtitleTranslation, 'subtitleTranslation not found')

		const { withTimeWords, splitSentences } = subtitleTranslation
		invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for processing')
		invariant(splitSentences && splitSentences.length > 0, 'Split sentences are required for processing')

		// Use the parseAlignWordsAndSentencesResult function from align.ts
		// This function will handle extracting the JSON from the text, parsing it, and creating properly timed sentences
		try {
			const sentencesData = parseAlignWordsAndSentencesResult(promptText, withTimeWords, splitSentences)

			if (sentencesData.length === 0) {
				return { error: 'Could not create any aligned sentences from the provided input.' }
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
		} catch (parseError) {
			return {
				error: parseError instanceof Error ? parseError.message : 'Error parsing AI result. Make sure the result contains a valid JSON object with an "indices" array.',
			}
		}
	} catch (error) {
		console.error('Error processing AI result:', error)
		return {
			error: error instanceof Error ? error.message : 'Unknown error processing AI result',
		}
	}
}
