import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { createOperationDir } from '~/utils/file'

export const action = async ({ params, request }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	// Parse form data
	const formData = await request.formData()
	const index = Number(formData.get('index'))
	const word = formData.get('word')?.toString()

	invariant(!Number.isNaN(index), 'Index is required')
	invariant(word, 'Word is required')

	// Get the word document
	const wordDoc = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	invariant(wordDoc, 'Word not found')
	invariant(wordDoc.sentences[index], 'Sentence not found')

	// Create operation directory
	const operationDir = await createOperationDir(id)

	// Create a copy of the sentences array
	const sentences = [...wordDoc.sentences]
	const sentence = sentences[index]

	// This is where image generation would happen
	// For now, we'll just create a placeholder for the image path
	const imageFileName = `${id}-image-${word}.jpg`
	const imageFilePath = path.join(operationDir, imageFileName)

	// TODO: Implement actual image generation here
	// For now, we'll just update the imagePath in the database
	sentence.imagePath = imageFilePath

	// Update the sentence in the sentences array
	sentences[index] = sentence

	// Update the database
	await db
		.update(schema.words)
		.set({
			sentences,
		})
		.where(eq(schema.words.id, id))

	return json({ success: true, imagePath: imageFilePath })
}
