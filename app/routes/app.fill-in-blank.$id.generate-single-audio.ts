import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { getAudioDuration } from '~/utils/ffmpeg'
import { createOperationDir } from '~/utils/file'
import { generateSpeech } from '~/utils/tts/fm'

export async function action({ params, request }: ActionFunctionArgs) {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const index = formData.get('index')
	invariant(index && !Number.isNaN(Number(index)), 'index is required and must be a number')

	const sentenceIndex = Number(index)
	const where = eq(schema.fillInBlanks.id, id)

	const fillInBlank = await db.query.fillInBlanks.findFirst({
		where,
	})

	invariant(fillInBlank, 'fillInBlank not found')
	invariant(sentenceIndex >= 0 && sentenceIndex < fillInBlank.sentences.length, 'index out of range')

	const sentences = fillInBlank.sentences
	const sentence = sentences[sentenceIndex]

	const operationDir = await createOperationDir(id)
	const fileName = `${id}-${sentenceIndex}.mp3`
	const audioFilePath = path.join(operationDir, fileName)

	await generateSpeech({
		text: sentence.sentence,
		outputPath: audioFilePath,
		voice: 'echo',
	})

	// Measure the audio duration
	const audioDuration = getAudioDuration(audioFilePath)

	// Update the sentence
	sentences[sentenceIndex] = {
		...sentence,
		audioFilePath,
		audioDuration,
	}

	// Update the database
	await db
		.update(schema.fillInBlanks)
		.set({
			sentences,
		})
		.where(where)

	return {
		ok: true,
		index: sentenceIndex,
		audioDuration,
	}
}
