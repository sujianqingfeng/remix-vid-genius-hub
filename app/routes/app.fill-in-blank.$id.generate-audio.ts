import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { asyncPool } from '~/utils'
import { getAudioDuration } from '~/utils/ffmpeg'
import { createOperationDir } from '~/utils/file'
import { generateSpeech } from '~/utils/tts/fm'

export async function action({ params }: ActionFunctionArgs) {
	const { id } = params
	invariant(id, 'id is required')

	const where = eq(schema.fillInBlanks.id, id)

	const fillInBlank = await db.query.fillInBlanks.findFirst({
		where,
	})

	invariant(fillInBlank, 'fillInBlank not found')

	const sentences = fillInBlank.sentences

	const notAudioSentences = sentences.filter((s) => !s.audioFilePath)
	const operationDir = await createOperationDir(id)

	// Use asyncPool with concurrency limit of 3 instead of Promise.all
	await asyncPool(3, notAudioSentences, async (sentence, index) => {
		const fileName = `${id}-${index}.mp3`
		const audioFilePath = path.join(operationDir, fileName)

		await generateSpeech({
			text: sentence.sentence,
			outputPath: audioFilePath,
			voice: 'echo',
		})

		// Measure the audio duration
		const audioDuration = getAudioDuration(audioFilePath)

		sentence.audioFilePath = audioFilePath
		sentence.audioDuration = audioDuration
		return sentence
	})

	await db
		.update(schema.fillInBlanks)
		.set({
			sentences,
		})
		.where(where)

	return {}
}
