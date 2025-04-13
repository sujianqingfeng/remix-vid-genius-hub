import path from 'node:path'
import { type ActionFunctionArgs, json } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import execa from 'execa'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { generateScreenshotCommand } from '~/utils/ffmpeg'
import { createOperationDir, fileExist } from '~/utils/file'

export async function action({ params, request }: ActionFunctionArgs) {
	const { id } = params
	invariant(id, 'id is required')

	// Get form data to extract timestamp
	const formData = await request.formData()
	const timestampStr = formData.get('timestamp')

	// Default to 1 second if not provided or invalid
	let timestamp = 1
	if (typeof timestampStr === 'string') {
		const parsedValue = Number(timestampStr)
		if (!Number.isNaN(parsedValue)) {
			timestamp = parsedValue
		}
	}

	const word = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	invariant(word, 'Word not found')
	invariant(word.outputFilePath, 'Video file not found')
	invariant(await fileExist(word.outputFilePath), 'Video file does not exist')

	// Get the operation directory for this word
	const operationDir = await createOperationDir(id)

	// Generate screenshot filename and path in the operation directory
	const screenshotFileName = 'screenshot.jpg'
	const screenshotPath = path.join(operationDir, screenshotFileName)

	// Generate and execute ffmpeg command with provided timestamp
	const ffmpegArgs = generateScreenshotCommand(word.outputFilePath, timestamp)
	ffmpegArgs.push(screenshotPath)

	try {
		await execa('ffmpeg', ffmpegArgs)

		return json({
			success: true,
			message: `Screenshot saved successfully at ${timestamp} seconds`,
		})
	} catch (error) {
		console.error('Error generating screenshot:', error)
		return json(
			{
				success: false,
				error: 'Failed to generate screenshot',
			},
			{ status: 500 },
		)
	}
}
