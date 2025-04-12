import { unlink } from 'node:fs/promises'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { fileExist } from '~/utils/file'

export const action = async ({ params, request }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const index = formData.get('index')

	invariant(index, 'index is required')
	const idx = Number.parseInt(index.toString(), 10)

	const word = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	invariant(word, 'Word not found')

	const sentences = [...word.sentences]
	invariant(idx >= 0 && idx < sentences.length, 'Invalid sentence index')

	// Get the sentence to delete
	const sentenceToDelete = sentences[idx]

	// Delete audio files if they exist
	if (sentenceToDelete.wordPronunciationPath) {
		if (await fileExist(sentenceToDelete.wordPronunciationPath)) {
			await unlink(sentenceToDelete.wordPronunciationPath)
		}
	}

	if (sentenceToDelete.sentencePronunciationPath) {
		if (await fileExist(sentenceToDelete.sentencePronunciationPath)) {
			await unlink(sentenceToDelete.sentencePronunciationPath)
		}
	}

	// Remove the sentence from the array
	sentences.splice(idx, 1)

	// Update the database
	await db
		.update(schema.words)
		.set({
			sentences,
		})
		.where(eq(schema.words.id, id))

	return json({ success: true })
}
