import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Transcript } from '~/types'
import { trimPunctuation } from '~/utils/transcript'

type OptimizeSentencesOptions = {
	sentences: Transcript[]
	englishMaxLength?: number
	chineseMaxLength?: number
}

// 优化展示，将长句子分割成多个句子
// text 为英文字段
// textInterpretation 为中文字段
function optimizeSentences({ sentences, englishMaxLength = 90, chineseMaxLength = 35 }: OptimizeSentencesOptions) {
	const optimizedSentences: Transcript[] = []

	for (const sentence of sentences) {
		const { text, textInterpretation, words, start, end } = sentence

		// If the sentence is already short enough, add it directly
		if ((!text || text.length <= englishMaxLength) && (!textInterpretation || textInterpretation.length <= chineseMaxLength)) {
			optimizedSentences.push(sentence)
			continue
		}

		// Split long sentences
		if (text && text.length > englishMaxLength) {
			// Split English text
			const chunks = splitTextIntoChunks(text, englishMaxLength)

			// If there's Chinese text, split it proportionally
			const chineseChunks = textInterpretation ? splitTextProportionally(textInterpretation, chunks.length) : Array(chunks.length).fill('')

			// Calculate time distribution
			const totalDuration = end - start
			const timePerChunk = totalDuration / chunks.length

			// Create new transcript entries for each chunk
			chunks.forEach((chunk, index) => {
				const chunkStart = start + timePerChunk * index
				const chunkEnd = chunkStart + timePerChunk

				// Find words that belong to this time range
				const chunkWords = words.filter((word) => word.start >= chunkStart && word.end <= chunkEnd)

				// If no words match exactly, use approximation
				const approximateWords = chunkWords.length > 0 ? chunkWords : approximateWordsForChunk(words, chunk, index, chunks.length, start, end)

				optimizedSentences.push({
					text: chunk,
					textInterpretation: chineseChunks[index],
					start: chunkStart,
					end: chunkEnd,
					words: approximateWords,
				})
			})
		} else if (textInterpretation && textInterpretation.length > chineseMaxLength) {
			// Only Chinese text is too long
			const chineseChunks = splitTextIntoChunks(textInterpretation, chineseMaxLength)

			// Split English text proportionally if it exists
			const englishChunks = text ? splitTextProportionally(text, chineseChunks.length) : Array(chineseChunks.length).fill('')

			// Calculate time distribution
			const totalDuration = end - start
			const timePerChunk = totalDuration / chineseChunks.length

			// Create new transcript entries for each chunk
			chineseChunks.forEach((chunk, index) => {
				const chunkStart = start + timePerChunk * index
				const chunkEnd = chunkStart + timePerChunk

				// Find words that belong to this time range
				const chunkWords = words.filter((word) => word.start >= chunkStart && word.end <= chunkEnd)

				// If no words match exactly, use approximation
				const approximateWords = chunkWords.length > 0 ? chunkWords : approximateWordsForChunk(words, englishChunks[index], index, chineseChunks.length, start, end)

				optimizedSentences.push({
					text: englishChunks[index],
					textInterpretation: chunk,
					start: chunkStart,
					end: chunkEnd,
					words: approximateWords,
				})
			})
		}
	}

	const trimmedSentences = optimizedSentences.map(({ text, textInterpretation, ...rest }) => {
		return {
			...rest,
			text: text ? trimPunctuation(text) : text,
			textInterpretation: textInterpretation ? trimPunctuation(textInterpretation) : textInterpretation,
		}
	})

	return trimmedSentences
}

// Helper function to split text into chunks of maximum length
function splitTextIntoChunks(text: string, maxLength: number): string[] {
	const chunks: string[] = []

	// Try to split at sentence boundaries (periods, question marks, exclamation points)
	const sentences = text.split(/(?<=[.!?])\s+/)

	let currentChunk = ''

	for (const sentence of sentences) {
		// If adding this sentence would exceed max length, save current chunk and start a new one
		if (currentChunk.length + sentence.length > maxLength && currentChunk.length > 0) {
			chunks.push(currentChunk)
			currentChunk = sentence
		}
		// If the sentence itself is longer than maxLength, split it by words
		else if (sentence.length > maxLength) {
			if (currentChunk.length > 0) {
				chunks.push(currentChunk)
				currentChunk = ''
			}

			const words = sentence.split(/\s+/)
			let wordChunk = ''

			for (const word of words) {
				if (wordChunk.length + word.length + 1 > maxLength && wordChunk.length > 0) {
					chunks.push(wordChunk)
					wordChunk = word
				} else {
					wordChunk = wordChunk.length === 0 ? word : `${wordChunk} ${word}`
				}
			}

			if (wordChunk.length > 0) {
				currentChunk = wordChunk
			}
		}
		// Otherwise, add to current chunk
		else {
			currentChunk = currentChunk.length === 0 ? sentence : `${currentChunk} ${sentence}`
		}
	}

	// Add the last chunk if there's anything left
	if (currentChunk.length > 0) {
		chunks.push(currentChunk)
	}

	return chunks
}

// Helper function to split text proportionally to match the number of chunks in another language
function splitTextProportionally(text: string, numChunks: number): string[] {
	if (numChunks <= 1) return [text]

	const chunks: string[] = []
	const chunkSize = Math.ceil(text.length / numChunks)

	// For Chinese text, we can split by characters since each character is a unit
	for (let i = 0; i < numChunks; i++) {
		const start = i * chunkSize
		const end = Math.min(start + chunkSize, text.length)
		chunks.push(text.substring(start, end))
	}

	return chunks
}

// Helper function to approximate which words belong to a chunk when time ranges don't match exactly
function approximateWordsForChunk(
	allWords: { word: string; start: number; end: number }[],
	chunkText: string,
	chunkIndex: number,
	totalChunks: number,
	sentenceStart: number,
	sentenceEnd: number,
): { word: string; start: number; end: number }[] {
	// If there are no words or empty chunk, return empty array
	if (allWords.length === 0 || !chunkText) return []

	// Calculate approximate word range based on chunk position
	const wordsPerChunk = Math.ceil(allWords.length / totalChunks)
	const startIdx = chunkIndex * wordsPerChunk
	const endIdx = Math.min(startIdx + wordsPerChunk, allWords.length)

	// Get the words for this chunk
	const chunkWords = allWords.slice(startIdx, endIdx)

	// If we have words, adjust their timing to fit within the chunk's time range
	if (chunkWords.length > 0) {
		const chunkDuration = (sentenceEnd - sentenceStart) / totalChunks
		const chunkStart = sentenceStart + chunkIndex * chunkDuration
		const chunkEnd = chunkStart + chunkDuration

		// Adjust word timings to fit within chunk boundaries
		return chunkWords.map((word, idx) => {
			const wordDuration = word.end - word.start
			const wordPosition = idx / chunkWords.length
			const adjustedStart = chunkStart + wordPosition * (chunkDuration - wordDuration)

			return {
				word: word.word,
				start: adjustedStart,
				end: adjustedStart + wordDuration,
			}
		})
	}

	return []
}

export const action = async ({ params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const where = eq(schema.subtitleTranslations.id, id)

	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')

	const { sentences } = subtitleTranslation
	invariant(sentences, 'sentences not found')

	const optimizedSentences = optimizeSentences({ sentences })

	await db
		.update(schema.subtitleTranslations)
		.set({
			optimizedSentences: optimizedSentences,
		})
		.where(where)

	return { success: true }
}
