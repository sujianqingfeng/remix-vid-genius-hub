import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { Form, redirect } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { Button } from '~/components/ui/button'
import { db, schema } from '~/lib/drizzle'
import { createOperationDir } from '~/utils/file'

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()
	const file = formData.get('file') as File
	invariant(file instanceof File, 'file is required')

	const [translateVideo] = await db
		.insert(schema.translateVideos)
		.values({
			source: 'upload',
		})
		.returning({ id: schema.translateVideos.id })

	const operationDir = await createOperationDir(translateVideo.id)

	const fileName = `${translateVideo.id}-${Date.now()}${path.extname(file.name)}`
	const uploadFilePath = path.join(operationDir, fileName)
	await writeFile(uploadFilePath, Buffer.from(await file.arrayBuffer()))

	await db
		.update(schema.translateVideos)
		.set({
			uploadFilePath,
		})
		.where(eq(schema.translateVideos.id, translateVideo.id))

	return redirect(`/app/translate-video/${translateVideo.id}`)
}

export default function TranslateVideoCreatePage() {
	return (
		<div className="mx-auto max-w-2xl py-8">
			<div className="mb-8 text-center">
				<h1 className="mb-3 text-2xl font-bold text-foreground">Upload Video for Translation</h1>
				<p className="text-muted-foreground">Upload your video file (MP4 or WebM) to get started with the translation process.</p>
			</div>

			<Form method="post" encType="multipart/form-data" className="space-y-6">
				<div className="rounded-lg border-2 border-dashed border-border bg-card p-6 text-center hover:border-primary transition-colors shadow-soft">
					<input
						type="file"
						name="file"
						accept=".mp4,.webm"
						className="w-full cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary/10 file:px-6 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
						required
					/>
					<p className="mt-2 text-sm text-muted-foreground">Maximum file size: 500MB</p>
				</div>

				<Button type="submit" className="w-full py-6 text-lg font-semibold shadow-soft">
					Upload and Start Translation
				</Button>
			</Form>
		</div>
	)
}
