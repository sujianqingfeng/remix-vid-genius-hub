import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { AiModel } from '~/utils/ai'
import { splitTextToSentences, splitTextToSentencesWithAI } from '~/utils/align'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const splitSentencesMethod = formData.get('splitSentencesMethod')
	invariant(splitSentencesMethod === 'ai' || splitSentencesMethod === 'code', 'Invalid split method')

	const model = (formData.get('model') as AiModel) || 'deepseek'

	const where = eq(schema.subtitleTranslations.id, id)
	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')
	const { withTimeWords } = subtitleTranslation
	invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for alignment')

	let sentences: string[] = []

	const text = withTimeWords.reduce((acc: string, item: any) => {
		return acc + item.word
	}, '')

	if (splitSentencesMethod === 'ai') {
		sentences = await splitTextToSentencesWithAI(text, model)
		console.log(`AI split text into ${sentences.length} sentences using model: ${model}`)
	} else {
		sentences = splitTextToSentences({ text })
		console.log(`Code split text into ${sentences.length} sentences`)
	}

	// Store the split sentences in the database for later alignment
	await db
		.update(schema.subtitleTranslations)
		.set({
			splitSentences: sentences,
		})
		.where(where)

	return {
		success: true,
		sentenceCount: sentences.length,
	}
}
