import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { getAudioDuration } from '~/utils/ffmpeg'
import { createOperationDir } from '~/utils/file'
import { generateSpeech } from '~/utils/tts'

export const action = async ({ params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const word = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	invariant(word, 'Word not found')

	// Create operation directory
	const operationDir = await createOperationDir(id)

	const sentences = [...word.sentences]

	// Generate audio for each sentence
	for (let idx = 0; idx < sentences.length; idx++) {
		const sentence = sentences[idx]
		let needsUpdate = false

		// Generate word audio if it doesn't exist
		if (!sentence.wordPronunciationPath) {
			const wordFileName = `${id}-word-${idx}.mp3`
			const wordFilePath = path.join(operationDir, wordFileName)

			await generateSpeech('fm', {
				text: sentence.word,
				outputPath: wordFilePath,
				voice: 'alloy',
			})

			// Get audio duration
			const wordDuration = getAudioDuration(wordFilePath)

			sentence.wordPronunciationPath = wordFilePath
			sentence.wordDuration = wordDuration
			needsUpdate = true
		}

		// Generate sentence audio if it doesn't exist
		if (!sentence.sentencePronunciationPath) {
			const sentenceFileName = `${id}-sentence-${idx}.mp3`
			const sentenceFilePath = path.join(operationDir, sentenceFileName)

			await generateSpeech('fm', {
				text: sentence.sentence,
				outputPath: sentenceFilePath,
				voice: 'alloy',
			})

			// Get audio duration
			const sentenceDuration = getAudioDuration(sentenceFilePath)

			sentence.sentencePronunciationPath = sentenceFilePath
			sentence.sentenceDuration = sentenceDuration
			needsUpdate = true
		}

		// Save the current sentence if changes were made
		if (needsUpdate) {
			await db
				.update(schema.words)
				.set({
					sentences,
				})
				.where(eq(schema.words.id, id))
		}
	}

	return json({ success: true })
}
