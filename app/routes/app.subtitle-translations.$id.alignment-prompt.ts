import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { buildAlignWordsAndSentencesPrompt, splitTextToSentences } from '~/utils/align'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where: eq(schema.subtitleTranslations.id, id),
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')
	const { withTimeWords } = subtitleTranslation
	invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for alignment')

	const text = withTimeWords.reduce((acc: string, item: any) => acc + item.word, '')
	const sentences = splitTextToSentences({ text })

	const { systemPrompt, prompt } = buildAlignWordsAndSentencesPrompt(withTimeWords, sentences)
	return {
		prompt: {
			systemPrompt,
			prompt,
		},
	}
}
