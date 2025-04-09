import { z } from 'zod'
import type { Sentence, WordWithTime } from '~/types'
import { chatGPT, deepSeek, gemini } from './ai'

type SplitTextToSentencesOptions = {
	text: string
	maxSentenceLength?: number
}

// 将文本分割成句子,使用句子结束符号分割，但是需要考虑一些特殊情况不分割，比如小数点，科学计数，一些特殊的缩写，比如['U.S','A.I']
// 如果句子长度超过maxSentenceLength，可以考虑使用其他标点分割，如果没有其他标点，就不分割
export function splitTextToSentences({ text, maxSentenceLength = 100 }: SplitTextToSentencesOptions): string[] {
	if (!text) return []

	// Common abbreviations that contain periods but shouldn't split sentences
	const commonAbbreviations = ['U.S', 'A.I', 'Mr.', 'Mrs.', 'Dr.', 'Ph.D', 'e.g.', 'i.e.', 'etc.']

	// Replace abbreviations with temporary placeholders to avoid splitting at their periods
	let processedText = text
	const abbreviationMap = new Map<string, string>()

	commonAbbreviations.forEach((abbr, index) => {
		const placeholder = `__ABBR${index}__`
		const regex = new RegExp(abbr.replace(/\./g, '\\.'), 'g')
		processedText = processedText.replace(regex, placeholder)
		abbreviationMap.set(placeholder, abbr)
	})

	// Regular expression to match sentence endings while ignoring decimal points and scientific notation
	// This regex looks for:
	// - A period, question mark, or exclamation mark
	// - Followed by a space or end of string
	// - But not preceded by a digit if followed by a digit (to avoid splitting decimal points)
	// - And not preceded by 'e' or 'E' if followed by '+' or '-' (to avoid splitting scientific notation)
	const sentenceEndRegex = /(?<![0-9])(?<![eE])[.!?](?=\s|$)/g

	// Split by sentence endings
	const sentences = processedText
		.split(sentenceEndRegex)
		.map((s) => s.trim())
		.filter(Boolean)

	// If any sentence is too long, try to split it further using other punctuation
	const result: string[] = []

	for (const sentence of sentences) {
		if (sentence.length <= maxSentenceLength) {
			result.push(sentence)
		} else {
			// Try to split by commas, semicolons, or colons
			const secondaryPunctuation = /[,;:](?=\s)/g
			const parts = sentence
				.split(secondaryPunctuation)
				.map((p) => p.trim())
				.filter(Boolean)

			let currentPart = ''

			for (const part of parts) {
				if ((currentPart + part).length > maxSentenceLength && currentPart) {
					result.push(currentPart)
					currentPart = part
				} else {
					currentPart = currentPart ? `${currentPart} ${part}` : part
				}
			}

			if (currentPart) {
				result.push(currentPart)
			}
		}
	}

	// Restore abbreviations
	return result.map((sentence) => {
		let restored = sentence
		abbreviationMap.forEach((original, placeholder) => {
			restored = restored.replace(new RegExp(placeholder, 'g'), original)
		})
		return restored
	})
}

export function alignWordsAndSentences(words: WordWithTime[], sentences: string[]): Sentence[] {
	if (!words.length || !sentences.length) {
		return []
	}

	// 构建完整的转录文本
	const fullTranscript = words.map((w) => w.word).join('')

	// 规范化文本以便于匹配
	const normalizeText = (text: string) => {
		return text.replace(/\s+/g, ' ').trim().toLowerCase()
	}

	// 创建结果数组
	const result: Sentence[] = []

	// 创建单词索引映射，用于快速查找单词位置
	const wordPositions: { [key: string]: number[] } = {}
	let currentPos = 0
	words.forEach((word, index) => {
		const normalizedWord = normalizeText(word.word)
		if (!wordPositions[normalizedWord]) {
			wordPositions[normalizedWord] = []
		}
		wordPositions[normalizedWord].push(index)
		currentPos += word.word.length
	})

	// 第一阶段：尝试匹配每个句子的开头和结尾
	const normalizedTranscript = normalizeText(fullTranscript)
	const sentenceData: {
		sentence: string
		normalizedSentence: string
		firstWords: string[]
		lastWords: string[]
		matchedStartIndex: number
		matchedEndIndex: number
		processed: boolean
	}[] = sentences.map((sentence) => {
		const normalizedSentence = normalizeText(sentence)
		const words = normalizedSentence.split(/\s+/).filter((w) => w.length > 0)

		return {
			sentence,
			normalizedSentence,
			firstWords: words.slice(0, Math.min(3, words.length)),
			lastWords: words.slice(Math.max(0, words.length - 3)),
			matchedStartIndex: -1,
			matchedEndIndex: -1,
			processed: false,
		}
	})

	// 找到可能的句子边界
	for (const sentenceInfo of sentenceData) {
		if (!sentenceInfo.sentence.trim()) {
			sentenceInfo.processed = true
			continue
		}

		// 直接匹配完整句子
		const directMatchIndex = normalizedTranscript.indexOf(sentenceInfo.normalizedSentence)
		if (directMatchIndex !== -1) {
			// 找到对应的单词索引
			let charCount = 0
			let startWordIdx = -1
			let endWordIdx = -1

			for (let i = 0; i < words.length; i++) {
				const prevCharCount = charCount
				charCount += words[i].word.length

				if (prevCharCount <= directMatchIndex && charCount > directMatchIndex && startWordIdx === -1) {
					startWordIdx = i
				}

				if (startWordIdx !== -1 && charCount >= directMatchIndex + sentenceInfo.normalizedSentence.length) {
					endWordIdx = i
					break
				}
			}

			if (startWordIdx !== -1 && endWordIdx !== -1) {
				result.push({
					words: words.slice(startWordIdx, endWordIdx + 1),
					text: sentenceInfo.sentence,
					start: words[startWordIdx].start,
					end: words[endWordIdx].end,
				})
				sentenceInfo.processed = true
				continue
			}
		}

		// 尝试匹配第一个单词组合
		for (let numFirstWords = Math.min(3, sentenceInfo.firstWords.length); numFirstWords > 0; numFirstWords--) {
			const firstWordsPhrase = sentenceInfo.firstWords.slice(0, numFirstWords).join(' ')
			const firstPhraseIndex = normalizedTranscript.indexOf(firstWordsPhrase)

			if (firstPhraseIndex !== -1) {
				sentenceInfo.matchedStartIndex = firstPhraseIndex
				break
			}
		}

		// 尝试匹配最后一个单词组合
		for (let numLastWords = Math.min(3, sentenceInfo.lastWords.length); numLastWords > 0; numLastWords--) {
			const lastWordsPhrase = sentenceInfo.lastWords.slice(sentenceInfo.lastWords.length - numLastWords).join(' ')
			// 从matched start index开始查找
			const startSearchFrom = sentenceInfo.matchedStartIndex !== -1 ? sentenceInfo.matchedStartIndex : 0

			// 我们期望最后的部分在句子开始之后的合理位置
			const expectedMinLength = sentenceInfo.normalizedSentence.length * 0.5
			const expectedMaxLength = sentenceInfo.normalizedSentence.length * 2

			// 搜索在合理范围内的最后一个单词组合
			let lastPhraseIndex = -1
			let currentSearchPos = startSearchFrom

			while (true) {
				const nextOccurrence = normalizedTranscript.indexOf(lastWordsPhrase, currentSearchPos)
				if (nextOccurrence === -1) break

				// 检查这个位置是否在合理的范围内
				const distance = nextOccurrence - startSearchFrom
				if (distance >= expectedMinLength && distance <= expectedMaxLength) {
					lastPhraseIndex = nextOccurrence
					break
				}

				currentSearchPos = nextOccurrence + 1
				if (currentSearchPos >= normalizedTranscript.length) break
			}

			if (lastPhraseIndex !== -1) {
				sentenceInfo.matchedEndIndex = lastPhraseIndex + lastWordsPhrase.length
				break
			}
		}
	}

	// 第二阶段：根据边界提取单词并创建句子
	for (const sentenceInfo of sentenceData) {
		if (sentenceInfo.processed) continue

		if (sentenceInfo.matchedStartIndex !== -1 && sentenceInfo.matchedEndIndex !== -1) {
			// 找到对应的单词索引
			let startWordIdx = -1
			let endWordIdx = -1
			let charCount = 0

			for (let i = 0; i < words.length; i++) {
				const prevCharCount = charCount
				charCount += words[i].word.length

				if (prevCharCount <= sentenceInfo.matchedStartIndex && charCount > sentenceInfo.matchedStartIndex && startWordIdx === -1) {
					startWordIdx = i
				}

				if (startWordIdx !== -1 && charCount >= sentenceInfo.matchedEndIndex) {
					endWordIdx = i
					break
				}
			}

			if (startWordIdx !== -1 && endWordIdx !== -1) {
				const sentenceWords = words.slice(startWordIdx, endWordIdx + 1)

				// 计算相似度验证匹配的合理性
				const extractedText = sentenceWords.map((w) => w.word).join('')
				const normalizedExtracted = normalizeText(extractedText)
				const similarity = calculateSimilarity(normalizedExtracted, sentenceInfo.normalizedSentence)

				// 相似度阈值降低到0.5，因为我们已经使用了开始和结尾锚点
				if (similarity > 0.4) {
					result.push({
						words: sentenceWords,
						text: sentenceInfo.sentence,
						start: sentenceWords[0].start,
						end: sentenceWords[sentenceWords.length - 1].end,
					})
					sentenceInfo.processed = true
				}
			}
		}
	}

	// 第三阶段：使用更宽松的方法尝试匹配剩余的句子
	const unprocessedSentences = sentenceData.filter((info) => !info.processed)

	if (unprocessedSentences.length > 0) {
		// 对于剩余的句子，尝试使用更模糊的匹配
		// 按句子的起始位置排序结果，以确定空白区域
		result.sort((a, b) => a.start - b.start)

		// 找出转录文本中的空白区域
		const coveredRanges: { start: number; end: number }[] = result.map((item) => ({
			start: item.start,
			end: item.end,
		}))

		// 合并重叠的区间
		coveredRanges.sort((a, b) => a.start - b.start)
		const mergedRanges: { start: number; end: number }[] = []

		for (const range of coveredRanges) {
			if (mergedRanges.length === 0) {
				mergedRanges.push(range)
				continue
			}

			const lastRange = mergedRanges[mergedRanges.length - 1]
			if (range.start <= lastRange.end) {
				// 重叠区间，合并
				lastRange.end = Math.max(lastRange.end, range.end)
			} else {
				// 新区间
				mergedRanges.push(range)
			}
		}

		// 找出空白区域
		const gaps: { start: number; end: number }[] = []
		let lastEnd = 0

		for (const range of mergedRanges) {
			if (range.start > lastEnd) {
				gaps.push({ start: lastEnd, end: range.start })
			}
			lastEnd = range.end
		}

		// 如果最后一个区间结束后还有单词，添加最后一个空白区域
		if (lastEnd < words[words.length - 1].end) {
			gaps.push({ start: lastEnd, end: words[words.length - 1].end })
		}

		// 对于每个空白区域，尝试将未处理的句子与之匹配
		for (const gap of gaps) {
			// 找出这个空白区域内的单词
			const gapWords = words.filter((word) => word.start >= gap.start && word.end <= gap.end)
			if (gapWords.length === 0) continue

			// 尝试匹配未处理的句子
			for (const sentenceInfo of unprocessedSentences) {
				if (sentenceInfo.processed) continue

				const gapText = gapWords.map((w) => w.word).join('')
				const normalizedGapText = normalizeText(gapText)
				const similarity = calculateSimilarity(normalizedGapText, sentenceInfo.normalizedSentence)

				// 使用更低的相似度阈值
				if (similarity > 0.35) {
					result.push({
						words: gapWords,
						text: sentenceInfo.sentence,
						start: gapWords[0].start,
						end: gapWords[gapWords.length - 1].end,
					})
					sentenceInfo.processed = true
					break // 一个空白区域只匹配一个句子
				}
			}
		}
	}

	// 按照单词的开始时间对结果排序
	return result.sort((a, b) => a.start - b.start)
}

// 辅助函数：找到最佳匹配位置
function findBestMatch(needle: string, haystack: string): number {
	// 直接匹配
	const directIndex = haystack.indexOf(needle)
	if (directIndex !== -1) {
		return directIndex
	}

	// 尝试模糊匹配
	// 1. 移除所有标点符号后匹配
	const cleanNeedle = needle.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
	const cleanHaystack = haystack.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
	const cleanIndex = cleanHaystack.indexOf(cleanNeedle)
	if (cleanIndex !== -1) {
		// 找到对应的原始索引
		let originalIndex = 0
		let cleanCounter = 0
		while (cleanCounter < cleanIndex && originalIndex < haystack.length) {
			if (!/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(haystack[originalIndex])) {
				cleanCounter++
			}
			originalIndex++
		}
		return originalIndex
	}

	// 2. 尝试匹配前几个单词
	const needleWords = needle.split(/\s+/)
	if (needleWords.length > 2) {
		// 匹配前3个单词，如果不行，尝试前2个
		const firstFewWords = needleWords.slice(0, 3).join(' ')
		const firstFewWordsIndex = haystack.indexOf(firstFewWords)
		if (firstFewWordsIndex !== -1) {
			return firstFewWordsIndex
		}

		// 尝试前2个单词
		const first2Words = needleWords.slice(0, 2).join(' ')
		return haystack.indexOf(first2Words)
	}

	return -1
}

// 计算两个字符串的相似度 (0-1)
function calculateSimilarity(str1: string, str2: string): number {
	if (!str1 || !str2) return 0

	// 使用 Levenshtein 距离计算相似度
	const longerStr = str1.length > str2.length ? str1 : str2
	const shorterStr = str1.length > str2.length ? str2 : str1

	if (longerStr.length === 0) return 1.0

	// 计算编辑距离
	const distance = levenshteinDistance(longerStr, shorterStr)

	// 计算相似度
	return (longerStr.length - distance) / longerStr.length
}

// 计算 Levenshtein 距离
function levenshteinDistance(str1: string, str2: string): number {
	const m = str1.length
	const n = str2.length

	// 创建距离矩阵
	const dp: number[][] = Array(m + 1)
		.fill(0)
		.map(() => Array(n + 1).fill(0))

	// 初始化第一行和第一列
	for (let i = 0; i <= m; i++) dp[i][0] = i
	for (let j = 0; j <= n; j++) dp[0][j] = j

	// 填充矩阵
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
			dp[i][j] = Math.min(
				dp[i - 1][j] + 1, // 删除
				dp[i][j - 1] + 1, // 插入
				dp[i - 1][j - 1] + cost, // 替换
			)
		}
	}

	return dp[m][n]
}

export async function splitTextToSentencesWithAI(sentence: string) {
	const WordsToSentencesSchema = z.object({
		sentences: z.array(z.string()),
	})

	const result = await deepSeek.generateObject({
		schema: WordsToSentencesSchema,
		system: `将输入文本分割成更短的句子，遵循以下规则：
1. 保持原文内容完整，不增减、修改或翻译任何内容
2. 严格控制每个分割后的句子长度在40-60个字符之间
3. 分割优先级：
   - 首先在句号、问号、感叹号等自然句末处分割
   - 其次在引号后、逗号、分号、冒号处分割
   - 然后在连词（如and, but, or, because, about, whether等）处分割
   - 最后在介词短语、名词短语或从句边界处分割
4. 对于带引语的长句，在引语结束处分割
5. 对于没有明显分割点的长句，强制在50-60字符处的单词边界分割
6. 对于超过60字符的句子，必须再次分割，不允许例外
7. 确保分割后每个句子保持语义连贯性
8. 返回的所有句子拼接起来必须与原文完全一致
9. 每次分割前检查剩余文本长度，防止生成过短句子（少于20字符）

验证步骤（必须执行）：
1. 记录原始输入文本的每个字符
2. 分割后，检查每个句子的字符数，确保都在40-60范围内
3. 将所有句子拼接并逐字符比对原文，确保100%匹配
4. 对于任何超过60字符的句子，立即重新分割
5. 确保最后一个句子不会过短（少于20字符）`,
		prompt: sentence,
	})

	console.log('🚀 ~ splitTextToSentencesWithAI ~ result:', result.sentences)

	return result.sentences
}
