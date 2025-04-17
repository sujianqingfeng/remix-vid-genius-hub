import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { execCommand } from '~/utils/exec'
import { convertToStandardAudioFormat } from '~/utils/ffmpeg'
import { createOperationDir } from '~/utils/file'

async function downloadYoutubeAudio({ link, id }: { link: string; id: string }) {
	const dir = await createOperationDir(id)
	const fileName = `${id}.wav`
	const audioFilePath = path.join(dir, fileName)

	let command = `cd ${dir} && yt-dlp -f "ba" --extract-audio --audio-format wav --postprocessor-args "ffmpeg:-ar 16000" "${link}" -o "${id}.%(ext)s"`

	const isExistCookiePath = process.env.YOUTUBE_COOKIE_FILE_PATH
	if (isExistCookiePath) {
		command += ` --cookies "${isExistCookiePath}"`
	}

	await execCommand(command)

	await db
		.update(schema.translateVideos)
		.set({
			audioFilePath,
		})
		.where(eq(schema.translateVideos.id, id))
}

async function parseDownloadAudio({ id, downloadId }: { id: string; downloadId: string }) {
	const download = await db.query.downloads.findFirst({
		where: eq(schema.downloads.id, downloadId),
	})
	invariant(download, 'download not found')

	const { type, link, downloadUrl } = download

	if (downloadUrl) {
		await processAudioFile({ id, filePath: downloadUrl })
		return
	}

	switch (type) {
		case 'youtube':
			await downloadYoutubeAudio({ link, id })
			break

		default:
			break
	}
}

async function processAudioFile({ id, filePath }: { id: string; filePath: string }) {
	const dir = await createOperationDir(id)
	const fileName = `${id}.wav`
	const audioFilePath = path.join(dir, fileName)
	await execCommand(convertToStandardAudioFormat(filePath, audioFilePath))

	await db
		.update(schema.translateVideos)
		.set({
			audioFilePath,
		})
		.where(eq(schema.translateVideos.id, id))
}

export const action = async ({ params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const where = eq(schema.translateVideos.id, id)
	const translateVideo = await db.query.translateVideos.findFirst({
		where,
	})
	invariant(translateVideo, 'translateVideo not found')

	const { source, downloadId, uploadFilePath, audioFilePath } = translateVideo

	// If audio file already exists, return it
	if (audioFilePath) {
		return {}
	}

	// Otherwise process based on source type
	switch (source) {
		case 'download':
			invariant(downloadId, 'downloadId is required')
			await parseDownloadAudio({ id, downloadId })
			break

		case 'upload':
			invariant(uploadFilePath, 'uploadFilePath is required')
			await processAudioFile({ id, filePath: uploadFilePath })
			break

		default:
			break
	}

	const newTranslateVideo = await db.query.translateVideos.findFirst({
		where,
	})
	invariant(newTranslateVideo, 'newTranslateVideo not found')

	const { audioFilePath: newAudioFilePath } = newTranslateVideo
	invariant(newAudioFilePath, 'audioFilePath is required')

	return {}
}
