import { json, redirect } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import { db, schema } from '~/lib/drizzle'

export const action = async ({ params }: { params: { id: string } }) => {
	const { id } = params

	if (!id) {
		return json({ success: false, error: 'No ID provided' }, { status: 400 })
	}

	try {
		await db.delete(schema.words).where(eq(schema.words.id, id))
		return redirect('/app/words')
	} catch (error) {
		console.error('Failed to delete word:', error)
		return json({ success: false, error: 'Failed to delete word' }, { status: 500 })
	}
}
