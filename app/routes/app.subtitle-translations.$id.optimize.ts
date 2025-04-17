import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Transcript, WordWithTime } from '~/types'
import { trimPunctuation } from '~/utils/transcript'

// Define types for clarity
type SubtitleChunk = {
	text: string
	textInterpretation: string
	start: number
	end: number
	words: WordWithTime[]
}

type OptimizeSentencesOptions = {
	sentences: Transcript[]
	englishMaxLength?: number
	chineseMaxLength?: number
}

// --- Constants for splitting ---
const ENGLISH_SENTENCE_BREAKS = /(?<=[.!?])\s+/
const ENGLISH_CLAUSE_BREAKS = /(?<=[,.!?;:])\s+/
const ENGLISH_WORD_BREAKS = /\s+/
const CHINESE_BREAKS = /(?<=[。！？；，：])\s*/
const MAX_ENGLISH_WORDS = 15 // Maximum English words per chunk
const MAX_CHINESE_CHARS = 25 // Maximum Chinese chars per chunk

// --- Main Optimization Function (Simplified) ---

function optimizeSentences({ sentences, englishMaxLength = 70, chineseMaxLength = 35 }: OptimizeSentencesOptions): SubtitleChunk[] {
	const optimizedSentences: SubtitleChunk[] = []

	for (const sentence of sentences) {
		const { text, textInterpretation, words, start, end } = sentence

		// Skip empty sentences
		if (!text && !textInterpretation) continue

		// Determine if splitting is needed
		const englishWords = text ? text.split(ENGLISH_WORD_BREAKS).filter(Boolean) : []
		const needsEnglishSplit = text && (text.length > englishMaxLength || englishWords.length > MAX_ENGLISH_WORDS)

		const needsChineseSplit = textInterpretation && (textInterpretation.length > chineseMaxLength || textInterpretation.length > MAX_CHINESE_CHARS)

		// If neither needs splitting, add directly
		if (!needsEnglishSplit && !needsChineseSplit) {
			optimizedSentences.push({
				...sentence,
				text: text ? trimPunctuation(text) : '',
				textInterpretation: textInterpretation ? trimPunctuation(textInterpretation) : '',
			})
			continue
		}

		// Simple approach: determine number of chunks based on length and duration
		const durationInSeconds = end - start

		// Base number of chunks on content length
		const englishChunks = needsEnglishSplit ? Math.ceil(Math.max(text.length / englishMaxLength, englishWords.length / MAX_ENGLISH_WORDS)) : 1
		const chineseChunks = needsChineseSplit ? Math.ceil(Math.max(textInterpretation.length / chineseMaxLength, textInterpretation.length / MAX_CHINESE_CHARS)) : 1

		// Target number of chunks - balance between content needs and reasonable reading time
		let targetChunks = Math.max(englishChunks, chineseChunks)

		// Ensure reasonable display time: aim for at least 1.8 seconds per chunk, but also consider limitations
		const maxChunksByDuration = Math.max(1, Math.round(durationInSeconds / 1.8))
		targetChunks = Math.min(targetChunks, maxChunksByDuration)

		// Simple splitting of English text
		let englishParts: string[] = []
		if (text) {
			// Try natural breaks first
			englishParts = text.split(ENGLISH_SENTENCE_BREAKS).filter(Boolean)

			// If too few parts, try clause breaks
			if (englishParts.length < targetChunks) {
				englishParts = text.split(ENGLISH_CLAUSE_BREAKS).filter(Boolean)
			}

			// If still too few or too many parts, do an even split
			if (englishParts.length !== targetChunks) {
				englishParts = splitTextEvenly(text, targetChunks, true)
			}
		}

		// Simple splitting of Chinese text
		let chineseParts: string[] = []
		if (textInterpretation) {
			// Try natural breaks first
			chineseParts = textInterpretation.split(CHINESE_BREAKS).filter(Boolean)

			// If too few or too many parts, do an even split
			if (chineseParts.length !== targetChunks) {
				chineseParts = splitTextEvenly(textInterpretation, targetChunks, false)
			}
		}

		// Ensure both arrays have the same length
		while (englishParts.length < targetChunks) englishParts.push('')
		while (chineseParts.length < targetChunks) chineseParts.push('')

		// Even time distribution
		const timePerChunk = durationInSeconds / targetChunks

		// Create subtitles with even timing
		for (let i = 0; i < targetChunks; i++) {
			const chunkStart = start + i * timePerChunk
			const chunkEnd = i === targetChunks - 1 ? end : chunkStart + timePerChunk

			// Get words in this time range
			const chunkWords = words ? getWordsInTimeRange(words, chunkStart, chunkEnd) : []

			optimizedSentences.push({
				text: trimPunctuation(englishParts[i] || ''),
				textInterpretation: trimPunctuation(chineseParts[i] || ''),
				start: chunkStart,
				end: chunkEnd,
				words: chunkWords,
			})
		}
	}

	return optimizedSentences
}

/**
 * Simple function to split text into evenly sized chunks
 */
function splitTextEvenly(text: string, numChunks: number, isEnglish: boolean): string[] {
	if (numChunks <= 1) return [text]
	if (!text) return Array(numChunks).fill('')

	const result: string[] = []

	if (isEnglish) {
		// For English, split by words for more natural chunks
		const words = text.split(ENGLISH_WORD_BREAKS).filter(Boolean)
		const wordsPerChunk = Math.ceil(words.length / numChunks)

		for (let i = 0; i < numChunks; i++) {
			const startIdx = i * wordsPerChunk
			const endIdx = Math.min(startIdx + wordsPerChunk, words.length)

			if (startIdx < words.length) {
				result.push(words.slice(startIdx, endIdx).join(' '))
			} else {
				result.push('')
			}
		}
	} else {
		// For Chinese, split by character count
		const charsPerChunk = Math.ceil(text.length / numChunks)

		for (let i = 0; i < numChunks; i++) {
			const startIdx = i * charsPerChunk
			const endIdx = Math.min(startIdx + charsPerChunk, text.length)

			if (startIdx < text.length) {
				result.push(text.substring(startIdx, endIdx))
			} else {
				result.push('')
			}
		}
	}

	return result
}

/**
 * Simple function to get words that fall within a time range
 */
function getWordsInTimeRange(words: WordWithTime[], startTime: number, endTime: number): WordWithTime[] {
	if (!words || words.length === 0) return []

	const Epsilon = 0.01 // Small tolerance for floating point comparison

	return words.filter(
		(word) =>
			(word.start >= startTime - Epsilon && word.start < endTime - Epsilon) || // Word starts in range
			(word.end > startTime + Epsilon && word.end <= endTime + Epsilon) || // Word ends in range
			(word.start < startTime && word.end > endTime), // Word spans entire range
	)
}

export const action = async ({ params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const where = eq(schema.subtitleTranslations.id, id)

	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
		columns: {
			id: true,
			sentences: true,
		},
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')

	const { sentences } = subtitleTranslation
	invariant(sentences, 'sentences is not an array or is missing')

	// Explicitly pass max lengths
	const optimizedSentences = optimizeSentences({
		sentences,
		englishMaxLength: 70,
		chineseMaxLength: 35,
	})

	await db
		.update(schema.subtitleTranslations)
		.set({
			optimizedSentences: optimizedSentences,
		})
		.where(where)

	return { success: true }
}
