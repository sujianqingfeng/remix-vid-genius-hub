import type { Sentence, WordWithTime } from '~/types'
import { WordsToSentencesSchema } from '~/z-schema'
import { deepSeek } from './ai'

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

	const result: Sentence[] = []

	// 构建完整的转录文本
	const fullTranscript = words.map((w) => w.word).join('')

	// 规范化文本以便于匹配
	const normalizeText = (text: string) => {
		return text.replace(/\s+/g, ' ').trim().toLowerCase()
	}

	// 为每个句子找到在完整转录文本中的位置
	let startSearchIndex = 0
	const processedWordIndex = 0 // 跟踪已处理的单词索引

	for (const sentence of sentences) {
		if (!sentence.trim()) {
			continue
		}

		// 尝试在转录文本中找到句子
		const normalizedSentence = normalizeText(sentence)
		const normalizedTranscript = normalizeText(fullTranscript.substring(startSearchIndex))

		// 使用模糊匹配查找句子在转录文本中的位置
		let sentenceStartIndex = findBestMatch(normalizedSentence, normalizedTranscript)

		if (sentenceStartIndex === -1) {
			// 如果找不到匹配，尝试使用句子的前半部分
			const halfSentence = normalizedSentence.substring(0, Math.floor(normalizedSentence.length / 2))
			sentenceStartIndex = normalizedTranscript.indexOf(halfSentence)

			// 如果还是找不到，跳过这个句子
			if (sentenceStartIndex === -1) {
				continue
			}
		}

		// 调整为全局索引
		sentenceStartIndex += startSearchIndex

		// 找到句子结束的位置
		let sentenceEndIndex = sentenceStartIndex
		let wordCount = 0
		let sentenceLength = 0

		// 找到包含句子的单词范围
		let startWordIndex = -1
		let endWordIndex = -1
		let currentPosition = 0

		// 重置当前位置计数器，从所有单词的开始计算
		for (let i = 0; i < words.length; i++) {
			const word = words[i]
			const prevPosition = currentPosition
			currentPosition += word.word.length

			// 找到起始单词
			if (prevPosition <= sentenceStartIndex && currentPosition > sentenceStartIndex && startWordIndex === -1) {
				startWordIndex = i
			}

			// 累计句子长度
			if (startWordIndex !== -1) {
				wordCount++
				sentenceLength += word.word.length

				// 检查是否已经覆盖了足够的文本
				const currentText = normalizeText(fullTranscript.substring(sentenceStartIndex, currentPosition))

				// 改进匹配逻辑，使用更精确的匹配方式
				// 确保我们匹配到句子的末尾，特别是句号等标点符号
				const sentenceEndsWithPunctuation = /[.!?]$/.test(sentence)
				const foundEndOfSentence = sentenceEndsWithPunctuation
					? currentText.includes(normalizedSentence) ||
						(i + 1 < words.length && normalizeText(fullTranscript.substring(sentenceStartIndex, currentPosition + words[i + 1].word.length)).includes(normalizedSentence))
					: currentText.includes(normalizedSentence)

				if (foundEndOfSentence || (sentenceLength >= normalizedSentence.length * 0.95 && calculateSimilarity(currentText, normalizedSentence) > 0.85)) {
					// 如果句子以标点结束，确保我们包含了这个标点
					if (sentenceEndsWithPunctuation && i + 1 < words.length && words[i + 1].word.trim().match(/^[.!?]$/)) {
						endWordIndex = i + 1
					} else {
						endWordIndex = i
					}
					sentenceEndIndex = currentPosition
					break
				}
			}

			// 如果已经处理了太多单词但还没找到匹配，设置一个上限
			if (startWordIndex !== -1 && wordCount > 40) {
				endWordIndex = i
				sentenceEndIndex = currentPosition
				break
			}
		}

		// 如果找到了单词范围
		if (startWordIndex !== -1 && endWordIndex !== -1) {
			const sentenceWords = words.slice(startWordIndex, endWordIndex + 1)

			// 验证单词组合是否与句子文本匹配
			const wordsText = sentenceWords.map((w) => w.word).join('')
			const similarity = calculateSimilarity(normalizeText(wordsText), normalizedSentence)

			// 只有当相似度足够高时才添加句子
			if (similarity > 0.7) {
				// 创建句子对象
				result.push({
					words: sentenceWords,
					text: sentence,
					start: sentenceWords[0].start,
					end: sentenceWords[sentenceWords.length - 1].end,
				})

				// 更新下一次搜索的起始位置
				startSearchIndex = sentenceEndIndex
			}
		}
	}

	return result
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
	if (needleWords.length > 3) {
		const firstFewWords = needleWords.slice(0, 3).join(' ')
		return haystack.indexOf(firstFewWords)
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
	const result = await deepSeek.generateObject({
		schema: WordsToSentencesSchema,
		system: `请将输入的文本分割成更短的句子，遵循以下规则：
1. 保持原文内容完整，不要增减、修改或翻译任何内容
2. 优先在自然的语句边界（如句号、问号、感叹号等）处分割
3. 长句必须进一步分割：
   - 在逗号、分号、冒号等标点处分割
   - 在连词（如and, but, or, because, about, whether）处分割
   - 在从句与主句的边界处分割
4. 每个分割后的句子应严格控制在40-60个字符之间，不要超过这个范围
5. 对于超过60个字符且内部有逗号、分号等标点的句子，必须在这些标点处进行分割
6. 即使没有明显的标点，也要在语义单元的边界处分割长句
7. 确保分割后的每个句子都是完整的语义单元，便于理解
8. 返回的所有句子拼接起来必须与原文完全一致
9. 检查最终结果，确保没有超过60个字符的句子

示例1：
输入: "The quick brown fox jumps over the lazy dog. The dog was too tired to react, and the fox continued on its journey through the forest."
输出: [
  "The quick brown fox jumps over the lazy dog.",
  "The dog was too tired to react,",
  "and the fox continued on its journey",
  "through the forest."
]

示例2：
输入: "Artificial intelligence has revolutionized many industries, including healthcare, finance, and transportation, by automating complex tasks and providing insights from large datasets that would be impossible for humans to process manually."
输出: [
  "Artificial intelligence has revolutionized many industries,",
  "including healthcare, finance, and transportation,",
  "by automating complex tasks",
  "and providing insights from large datasets",
  "that would be impossible for humans",
  "to process manually."
]

示例3：
输入: "When I arrived at the station, the train had already left, which meant I had to wait for another two hours before the next one would arrive."
输出: [
  "When I arrived at the station,",
  "the train had already left,",
  "which meant I had to wait for another two hours",
  "before the next one would arrive."
]

请确保：
1. 分割点选择在语义自然的位置
2. 每个句子长度在40-60字符之间
3. 所有句子拼接起来与原文完全一致
4. 不要添加、删除或修改任何内容`,
		prompt: sentence,
		maxTokens: 8000,
	})

	return result.sentences
}
