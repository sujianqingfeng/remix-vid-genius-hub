import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const index = formData.get('index')
	invariant(index && typeof index === 'string', 'index is required')

	const indexNumber = Number.parseInt(index, 10)
	invariant(!Number.isNaN(indexNumber), 'index must be a number')

	const translateVideo = await db.query.translateVideos.findFirst({
		where: eq(schema.translateVideos.id, id),
	})
	invariant(translateVideo, 'translateVideo not found')

	const transcripts = [...(translateVideo.transcripts || [])]
	invariant(indexNumber >= 0 && indexNumber < transcripts.length, 'index out of bounds')

	// Toggle the excluded state
	transcripts[indexNumber].excluded = !transcripts[indexNumber].excluded

	// Update the database
	await db.update(schema.translateVideos).set({ transcripts }).where(eq(schema.translateVideos.id, id))

	return { success: true }
}
