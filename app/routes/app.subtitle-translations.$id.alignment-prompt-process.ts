import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Sentence } from '~/types'
import { parseAlignWordsAndSentencesResult } from '~/utils/align'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const promptText = formData.get('promptText')
	if (typeof promptText !== 'string') {
		return { result: 'No prompt text provided.' }
	}

	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where: eq(schema.subtitleTranslations.id, id),
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')
	const { withTimeWords, sentences } = subtitleTranslation
	invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for alignment')
	invariant(sentences && sentences.length > 0, 'Sentences are required for alignment')

	let result: Sentence[]
	try {
		result = parseAlignWordsAndSentencesResult(
			promptText,
			withTimeWords,
			sentences.map((s) => s.text),
		)
	} catch (e: unknown) {
		return { result: `Parse error: ${(e as Error)?.message || e}` }
	}

	// 保存到数据库
	await db.update(schema.subtitleTranslations).set({ sentences: result }).where(eq(schema.subtitleTranslations.id, id))

	return {}
}
