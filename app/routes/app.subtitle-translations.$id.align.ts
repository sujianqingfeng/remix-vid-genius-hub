import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Sentence } from '~/types'
import type { AiModel } from '~/utils/ai'
import { alignWordsAndSentences, alignWordsAndSentencesByAI } from '~/utils/align'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const alignmentMethod = formData.get('alignmentMethod')
	invariant(alignmentMethod === 'ai' || alignmentMethod === 'code', 'Invalid alignment method')

	const model = (formData.get('alignModel') as AiModel) || 'deepseek'

	const where = eq(schema.subtitleTranslations.id, id)
	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')

	const { withTimeWords, splitSentences } = subtitleTranslation
	invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for alignment')
	invariant(splitSentences && splitSentences.length > 0, 'Split sentences are required for alignment. Please split the text first.')

	let subtitles: Sentence[] = []

	if (alignmentMethod === 'ai') {
		subtitles = await alignWordsAndSentencesByAI(withTimeWords, splitSentences)
		console.log(`AI aligned ${subtitles.length} sentences`)
	} else {
		subtitles = alignWordsAndSentences(withTimeWords, splitSentences)
		console.log(`Code aligned ${subtitles.length} sentences`)
	}

	await db
		.update(schema.subtitleTranslations)
		.set({
			sentences: subtitles,
		})
		.where(where)

	return {
		success: true,
		subtitleCount: subtitles.length,
	}
}
