import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { buildAlignWordsAndSentencesPrompt } from '~/utils/align'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const where = eq(schema.subtitleTranslations.id, id)
	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')
	const { withTimeWords, splitSentences } = subtitleTranslation
	invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for alignment')
	invariant(splitSentences && splitSentences.length > 0, 'Split sentences are required for alignment. Please split the text first.')

	// Generate the prompt
	const { systemPrompt, prompt } = buildAlignWordsAndSentencesPrompt(withTimeWords, splitSentences)

	return {
		prompt: {
			systemPrompt,
			prompt,
		},
	}
}
