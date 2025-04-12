import { rm } from 'node:fs/promises'
import path from 'node:path'
import { data, redirect } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import { PUBLIC_DIR } from '~/constants'
import { db, schema } from '~/lib/drizzle'
import { createOperationDir } from '~/utils/file'

export const action = async ({ params }: { params: { id: string } }) => {
	const { id } = params

	if (!id) {
		return data({ success: false, error: 'No ID provided' }, { status: 400 })
	}

	try {
		// Get the word data before deleting
		const word = await db.query.words.findFirst({
			where: eq(schema.words.id, id),
		})

		// Delete from database
		await db.delete(schema.words).where(eq(schema.words.id, id))

		// Delete operation directory if it exists
		try {
			const operationDir = await createOperationDir(id)
			await rm(operationDir, { recursive: true })
		} catch (error) {
			console.error('Failed to delete operation directory:', error)
		}

		// Delete public directory if it exists
		try {
			const publicPath = path.join(PUBLIC_DIR, 'assets', 'operations', id)
			await rm(publicPath, { recursive: true })
		} catch (error) {
			console.error('Failed to delete public directory:', error)
		}

		return redirect('/app/words')
	} catch (error) {
		console.error('Failed to delete word:', error)
		return data({ success: false, error: 'Failed to delete word' }, { status: 500 })
	}
}
