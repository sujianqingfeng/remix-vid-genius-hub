import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Sentence } from '~/types'
import type { AiModel } from '~/utils/ai'
import { alignWordsAndSentences, alignWordsAndSentencesByAI, buildAlignWordsAndSentencesPrompt, splitTextToSentences, splitTextToSentencesWithAI } from '~/utils/align'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const splitSentencesMethod = formData.get('splitSentencesMethod')
	invariant(splitSentencesMethod === 'ai' || splitSentencesMethod === 'code', 'Invalid alignment method')

	const alignmentMethod = formData.get('alignmentMethod')
	invariant(alignmentMethod === 'ai' || alignmentMethod === 'code', 'Invalid alignment method')

	const model = (formData.get('model') as AiModel) || 'deepseek'

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

	if (splitSentencesMethod === 'ai') {
		sentences = await splitTextToSentencesWithAI(text, model)
		console.log('🚀 ~ action ~ sentences:', sentences)
		console.log(`AI split text into ${sentences.length} sentences using model: ${model}`)
	} else {
		sentences = splitTextToSentences({ text })
		console.log(`Code split text into ${sentences.length} sentences`)
	}

	if (alignmentMethod === 'ai') {
		subtitles = await alignWordsAndSentencesByAI(withTimeWords, sentences)
		console.log(`AI aligned ${subtitles.length} sentences`)
	} else {
		subtitles = alignWordsAndSentences(withTimeWords, sentences)
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
	}
}
