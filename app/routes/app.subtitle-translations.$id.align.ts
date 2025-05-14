import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import type { Sentence, WordWithTime } from '~/types'
import type { AiModel } from '~/utils/ai'
import { alignWordsAndSentencesByAI } from '~/utils/align'

/**
 * Aligns a list of words to a list of sentences derived from concatenating those words.
 *
 * @param words - An array of strings, where each string is a word or punctuation.
 *                The concatenation of these words (in order) forms the text
 *                from which sentences were split. Can contain empty strings.
 * @param sentences - An array of strings, where each string is a sentence.
 *                    These sentences are assumed to be formed by splitting the
 *                    concatenated `words` string.
 * @returns An AlignmentResult object containing the mapping of word indices to sentences.
 * @throws Error if the sentences cannot be reconstructed perfectly from the words,
 *         indicating inconsistent input.
 */
export function mapWordsToSentences(words: string[], sentences: string[]): { indices: number[][] } {
	const resultIndices: number[][] = []
	let currentWordIndex = 0
	const totalWords = words.length

	for (let i = 0; i < sentences.length; i++) {
		const sentence = sentences[i]
		const sentenceIndices: number[] = []
		let constructedSentence = ''
		const startIndexForThisSentence = currentWordIndex // For error reporting

		// --- Handle Empty Sentence Case ---
		// An empty sentence can only be matched by consuming zero words,
		// OR by consuming a single empty word if it exists at the current position.
		if (sentence === '') {
			if (currentWordIndex < totalWords && words[currentWordIndex] === '') {
				// Consume exactly one empty word for this empty sentence
				sentenceIndices.push(currentWordIndex)
				currentWordIndex++
			}
			// If the current word isn't empty, or we're out of words,
			// the empty sentence corresponds to zero words.
			resultIndices.push(sentenceIndices)
			continue // Move to the next sentence
		}

		// --- Handle Non-Empty Sentence Case ---
		// Keep consuming words until the constructed string matches the target sentence.
		let matchFound = false
		while (currentWordIndex < totalWords) {
			const word = words[currentWordIndex]

			// Trim leading space only if it's the first word being added
			const wordToAdd = constructedSentence.length === 0 ? word.trimStart() : word

			const nextConstructedSentence = constructedSentence + wordToAdd

			// Add the current word's index and advance the pointer
			sentenceIndices.push(currentWordIndex)
			constructedSentence = nextConstructedSentence
			currentWordIndex++

			// Check for a match *after* adding the word, using normalized comparison
			if (constructedSentence.trim().toLowerCase() === sentence.trim().toLowerCase()) {
				matchFound = true
				break // Found the complete sentence
			}

			// Early exit condition: Use normalized comparison for length check too
			if (constructedSentence.trim().toLowerCase().length > sentence.trim().toLowerCase().length && sentence !== '') {
				// Check if the *previous* state was the match (can happen if the last word added was empty)
				const previousConstructedSentence = constructedSentence.slice(
					0,
					// Use wordToAdd length for accurate slicing, as it might have been trimmed
					constructedSentence.length - (wordToAdd?.length ?? 0),
				)
				if (previousConstructedSentence.trim().toLowerCase() === sentence.trim().toLowerCase()) {
					// We overshot because the last word was empty or normalization makes them match.
					// Backtrack index, keep indices.
					currentWordIndex-- // Don't consume the word causing overshoot yet
					sentenceIndices.pop() // Remove the index of the word causing overshoot
					matchFound = true
					break
				}

				// If backtracking didn't help, throw error
				throw new Error(
					`Alignment error: Constructed string "${constructedSentence}" ` +
						`(${constructedSentence.length}) unexpectedly became longer than target sentence ` +
						`"${sentence}" (${sentence.length}) starting from word index ${startIndexForThisSentence}. ` +
						`Last word added: "${word}" at index ${currentWordIndex - 1}.`,
				)
			}
		}

		// Check if the loop finished because a match was found
		if (!matchFound) {
			// If we exited the loop *without* finding a match, it means we ran out
			// of words before the sentence could be fully constructed.
			throw new Error(
				`Alignment error: Ran out of words while trying to construct sentence ${i}: "${sentence}". ` +
					`Started at word index ${startIndexForThisSentence}. ` +
					`Constructed: "${constructedSentence}". ` +
					`Current word index: ${currentWordIndex}. Total words: ${totalWords}.`,
			)
		}

		resultIndices.push(sentenceIndices)
	}

	// Final sanity checks
	if (currentWordIndex !== totalWords) {
		console.warn(
			// Use warn instead of error for potentially recoverable issues downstream
			`Alignment warning: Finished processing sentences, but word index ` +
				`(${currentWordIndex}) does not match total number of words (${totalWords}). ` +
				`Some words may be unassigned.`,
		)
		// Depending on strictness, could throw new Error(...) here
	}

	if (resultIndices.length !== sentences.length) {
		// This should be structurally impossible if the loop runs correctly, but check anyway.
		throw new Error(`Alignment error: Number of resulting index arrays (${resultIndices.length}) ` + `does not match number of input sentences (${sentences.length}).`)
	}

	return { indices: resultIndices }
}

export function buildSentenceWithWords(words: WordWithTime[], sentences: string[], result: { indices: number[][] }): Sentence[] {
	const output: Sentence[] = []
	for (let i = 0; i < sentences.length; i++) {
		const idxArr = result.indices[i] || []
		if (idxArr.length === 0) continue
		const sentenceWords = idxArr.map((idx) => words[idx]).filter(Boolean)
		if (sentenceWords.length === 0) continue
		output.push({
			words: sentenceWords,
			text: sentences[i],
			start: sentenceWords[0].start,
			end: sentenceWords[sentenceWords.length - 1].end,
		})
	}
	return output
}

export async function alignWordsToSentences(words: WordWithTime[], sentences: string[]): Promise<Sentence[]> {
	const w = words.map((w) => w.word)
	const result = mapWordsToSentences(w, sentences)
	return buildSentenceWithWords(words, sentences, result)
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const alignmentMethod = formData.get('alignmentMethod')
	invariant(alignmentMethod === 'ai' || alignmentMethod === 'code', 'Invalid alignment method')

	const model = (formData.get('alignModel') as AiModel) || 'deepseek'

	const where = eq(schema.subtitleTranslations.id, id)
	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')

	const { withTimeWords, splitSentences } = subtitleTranslation
	invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for alignment')
	invariant(splitSentences && splitSentences.length > 0, 'Split sentences are required for alignment. Please split the text first.')

	let subtitles: Sentence[] = []

	if (alignmentMethod === 'ai') {
		subtitles = await alignWordsAndSentencesByAI(withTimeWords, splitSentences)
		console.log(`AI aligned ${subtitles.length} sentences`)
	} else {
		subtitles = await alignWordsToSentences(withTimeWords, splitSentences)
		console.log(`Code aligned ${subtitles.length} sentences`)
	}

	await db
		.update(schema.subtitleTranslations)
		.set({
			sentences: subtitles,
		})
		.where(where)

	return {
		success: true,
		subtitleCount: subtitles.length,
	}
}
