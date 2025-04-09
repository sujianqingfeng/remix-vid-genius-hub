import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Sentence } from '~/types'
import { alignWordsAndSentences, splitTextToSentences, splitTextToSentencesWithAI } from '~/utils/align'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const alignmentMethod = formData.get('alignmentMethod')
	invariant(alignmentMethod === 'ai' || alignmentMethod === 'code', 'Invalid alignment method')

	const where = eq(schema.subtitleTranslations.id, id)
	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')
	const { withTimeWords } = subtitleTranslation
	invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for alignment')

	let sentences: string[] = []
	let subtitles: Sentence[] = []

	const text = withTimeWords.reduce((acc: string, item: any) => {
		return acc + item.word
	}, '')
	console.log('🚀 ~ text ~ text:', text)

	if (alignmentMethod === 'ai') {
		sentences = await splitTextToSentencesWithAI(text)
		console.log(`AI split text into ${sentences.length} sentences`)
	} else {
		sentences = splitTextToSentences({ text })
		console.log(`Code split text into ${sentences.length} sentences`)
	}

	subtitles = alignWordsAndSentences(withTimeWords, sentences)

	await db
		.update(schema.subtitleTranslations)
		.set({
			sentences: subtitles,
		})
		.where(where)

	return {
		success: true,
	}
}
