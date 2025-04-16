import { z } from 'zod'
import type { Sentence, WordWithTime } from '~/types'
import { aiGenerateText, chatGPT, deepSeek, gemini, r1, volcanoEngineDeepseekV3 } from './ai'
import type { AiModel } from './ai'

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

// 合并碎片 words，提升对齐准确性（保守策略：只合并连续长度<minLength的短词）
function mergeShortWords(words: WordWithTime[], minLength = 3): WordWithTime[] {
	const merged: WordWithTime[] = []
	let buffer = ''
	let bufferStartTime = 0
	let bufferEndTime = 0
	let buffering = false

	const flush = () => {
		if (buffering) {
			merged.push({
				word: buffer,
				start: bufferStartTime,
				end: bufferEndTime,
			})
			buffer = ''
			buffering = false
		}
	}

	for (let i = 0; i < words.length; i++) {
		const w = words[i]
		const alphaLen = w.word.replace(/[^a-zA-Z]/g, '').length
		if (alphaLen > 0 && alphaLen < minLength) {
			if (!buffering) {
				bufferStartTime = w.start
				buffer = ''
				buffering = true
			}
			buffer += w.word
			bufferEndTime = w.end
		} else {
			flush()
			merged.push(w)
		}
	}
	flush()
	return merged
}

export function alignWordsAndSentences(words: WordWithTime[], sentences: string[]): Sentence[] {
	if (!words.length || !sentences.length) return []

	// 合并碎片 words
	const mergedWords = mergeShortWords(words)

	// 增强归一化：去除所有标点、所有格、缩写点，统一小写
	const normalize = (str: string) =>
		str
			.replace(/'s\b/g, ' s') // 所有格
			.replace(/\./g, ' ') // 缩写点
			.replace(/[^a-zA-Z0-9 ]/g, ' ') // 其它标点
			.replace(/\s+/g, ' ') // 多空格合一
			.trim()
			.toLowerCase()
	const normalizedWords = mergedWords.map((w) => normalize(w.word))
	const used = Array(mergedWords.length).fill(false)
	const results: Sentence[] = []

	// Levenshtein距离
	function levenshtein(a: string, b: string): number {
		const m = a.length
		const n = b.length
		const dp = Array(m + 1)
			.fill(0)
			.map(() => Array(n + 1).fill(0))
		for (let i = 0; i <= m; i++) dp[i][0] = i
		for (let j = 0; j <= n; j++) dp[0][j] = j
		for (let i = 1; i <= m; i++) {
			for (let j = 1; j <= n; j++) {
				dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
			}
		}
		return dp[m][n]
	}

	// 将句子拆分为单词数组
	const splitToWords = (sentence: string) => normalize(sentence).split(/\s+/).filter(Boolean)

	// LCS+合并+模糊匹配（窗口内）
	function lcsAlign(windowWords: string[], sentenceWords: string[]) {
		const m = windowWords.length
		const n = sentenceWords.length
		const dp: { score: number; matches: number; path: { wi: number[]; si: number }[] }[][] = Array(m + 1)
			.fill(0)
			.map(() =>
				Array(n + 1)
					.fill(0)
					.map(() => ({ score: 0, matches: 0, path: [] })),
			)
		dp[0][0] = { score: 0, matches: 0, path: [] }
		for (let i = 0; i <= m; i++) {
			for (let j = 0; j <= n; j++) {
				// 匹配：合并1~4个windowWords与sentenceWords[j]模糊匹配
				if (i < m && j < n) {
					for (let k = 1; k <= 4 && i + k <= m; k++) {
						const merged = windowWords.slice(i, i + k).join('')
						if (merged && sentenceWords[j] && levenshtein(merged, sentenceWords[j]) <= 2) {
							const prev = dp[i][j]
							const next = dp[i + k][j + 1]
							const newScore = prev.score + 2
							if (newScore > next.score) {
								dp[i + k][j + 1] = {
									score: newScore,
									matches: prev.matches + 1,
									path: [...prev.path, { wi: [i, i + k], si: j }],
								}
							}
						}
					}
				}
				// 跳过windowWords[i]（惩罚-1）
				if (i < m) {
					const prev = dp[i][j]
					const next = dp[i + 1][j]
					const newScore = prev.score - 1
					if (newScore > next.score) {
						dp[i + 1][j] = {
							score: newScore,
							matches: prev.matches,
							path: [...prev.path],
						}
					}
				}
				// 跳过sentenceWords[j]（惩罚-1）
				if (j < n) {
					const prev = dp[i][j]
					const next = dp[i][j + 1]
					const newScore = prev.score - 1
					if (newScore > next.score) {
						dp[i][j + 1] = {
							score: newScore,
							matches: prev.matches,
							path: [...prev.path],
						}
					}
				}
			}
		}
		// 找到最大分数和路径
		let maxScore = Number.NEGATIVE_INFINITY
		let bestPath: { wi: number[]; si: number }[] = []
		let bestMatches = 0
		for (let i = 0; i <= m; i++) {
			if (dp[i][n].score > maxScore) {
				maxScore = dp[i][n].score
				bestPath = dp[i][n].path
				bestMatches = dp[i][n].matches
			}
		}
		// F1-like分数
		const f1Score = bestMatches / Math.max(m, n)
		return { matchedCount: bestMatches, mapping: bestPath, f1Score }
	}

	let lastUsedIdx = 0
	for (const sentence of sentences) {
		const sentenceWords = splitToWords(sentence)
		if (sentenceWords.length === 0) continue
		let bestScore = 0
		let bestStart = -1
		let bestLen = 0
		let bestMapping: { wi: number[]; si: number }[] = []
		let bestF1 = 0
		// 优化：窗口长度范围收缩，步长加大为2
		for (let win = Math.max(1, sentenceWords.length - 1); win <= sentenceWords.length + 2 && win <= mergedWords.length - lastUsedIdx; win++) {
			for (let i = lastUsedIdx; i <= mergedWords.length - win; i += 2) {
				// 步长2
				if (used.slice(i, i + win).some(Boolean)) continue
				const windowWords = normalizedWords.slice(i, i + win)
				const { matchedCount, mapping, f1Score } = lcsAlign(windowWords, sentenceWords)
				if (f1Score > bestF1 || (f1Score === bestF1 && matchedCount > bestScore)) {
					bestScore = matchedCount
					bestStart = i
					bestLen = win
					bestMapping = mapping
					bestF1 = f1Score
				}
			}
		}
		// 边界检查，防止数组越界
		if (bestStart < 0 || bestLen <= 0 || bestStart + bestLen > mergedWords.length) {
			// 兜底策略：用未分配 words 拼成字符串，与句子做 Levenshtein 相似度
			const unusedWordsArr = mergedWords.filter((_, idx) => !used[idx]).map((w) => w.word)
			const unusedStr = unusedWordsArr.join(' ').replace(/\s+/g, ' ').trim()
			const sentenceStr = sentence.replace(/\s+/g, ' ').trim()
			const sim = calculateSimilarity(unusedStr, sentenceStr)
			if (sim > 0.7 && unusedWordsArr.length > 0) {
				results.push({
					words: mergedWords.filter((_, idx) => !used[idx]),
					text: sentence,
					start: mergedWords.find((_, idx) => !used[idx])?.start ?? 0,
					end:
						mergedWords
							.slice()
							.reverse()
							.find((_, idx) => !used[mergedWords.length - 1 - idx])?.end ?? 0,
				})
				// 标记已用
				for (let i = 0; i < used.length; i++) if (!used[i]) used[i] = true
			}
		} else {
			// 阈值降低到 0.5
			if (bestF1 >= 0.5 && bestStart !== -1 && bestMapping.length > 0) {
				// 标记已用
				for (const m of bestMapping) {
					for (let i = m.wi[0]; i < m.wi[1]; i++) {
						used[bestStart + i] = true
					}
				}
				// 组装words
				const alignedWords: WordWithTime[] = []
				for (const m of bestMapping) {
					const from = bestStart + m.wi[0]
					const to = bestStart + m.wi[1] - 1
					const merged = {
						word: mergedWords
							.slice(from, to + 1)
							.map((w) => w.word)
							.join(''),
						start: mergedWords[from].start,
						end: mergedWords[to].end,
					}
					alignedWords.push(merged)
				}
				results.push({
					words: alignedWords,
					text: sentence,
					start: alignedWords[0]?.start ?? 0,
					end: alignedWords[alignedWords.length - 1]?.end ?? 0,
				})
				lastUsedIdx = bestStart + bestLen
			} else {
				// 匹配失败，输出详细调试信息
				const unusedWords = mergedWords
					.filter((_, idx) => !used[idx])
					.map((w) => w.word)
					.join(' ')
				// 兜底策略：用未分配 words 拼成字符串，与句子做 Levenshtein 相似度
				const unusedWordsArr = mergedWords.filter((_, idx) => !used[idx]).map((w) => w.word)
				const unusedStr = unusedWordsArr.join(' ').replace(/\s+/g, ' ').trim()
				const sentenceStr = sentence.replace(/\s+/g, ' ').trim()
				const sim = calculateSimilarity(unusedStr, sentenceStr)
				if (sim > 0.7 && unusedWordsArr.length > 0) {
					results.push({
						words: mergedWords.filter((_, idx) => !used[idx]),
						text: sentence,
						start: mergedWords.find((_, idx) => !used[idx])?.start ?? 0,
						end:
							mergedWords
								.slice()
								.reverse()
								.find((_, idx) => !used[mergedWords.length - 1 - idx])?.end ?? 0,
					})
					// 标记已用
					for (let i = 0; i < used.length; i++) if (!used[i]) used[i] = true
				}
			}
		}
	}
	// 最后输出未分配words和未对齐句子
	const unusedWords = mergedWords
		.filter((_, idx) => !used[idx])
		.map((w) => w.word)
		.join(' ')
	if (unusedWords.length > 0) {
	}
	return results
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

export async function splitTextToSentencesWithAI(sentence: string, model: AiModel = 'deepseek') {
	const WordsToSentencesSchema = z.object({
		sentences: z.array(z.string()),
	})

	let result: { sentences: string[] }

	// Chinese system prompt for splitting text
	const chineseSystemPrompt = `将输入文本分割成更短的句子，遵循以下规则：
1. 保持原文内容完整，不增减、修改或翻译任何内容，不要添加任何多余内容（如空格、标点、换行、注释、解释等），只返回原文的拆分句子
2. 严格控制每个分割后的句子长度在30-50个字符之间
3. 分割优先级：
   - 首先在句号、问号、感叹号等自然句末处分割
   - 必须在逗号处分割，尤其是当句子超过35个字符时
   - 在分号、冒号后分割
   - 在引号结束后分割
   - 然后在连词（如and, but, or, because, about, whether等）处分割
   - 接着在介词短语、名词短语或从句边界处分割
   - 根据语义单元分割，保证每个句子表达一个完整的语义单元
   - 最后在任何可能的单词边界处分割
4. 逗号分割规则：
   - 看到逗号立即考虑分割，特别是当前部分已达到30字符以上
   - 多个逗号连接的句子必须拆分为多个短句
   - 即使会稍微破坏语义完整性，也要在逗号处分割长句
5. 对于带引语的句子，必须在引语结束处分割
6. 对于复合句，必须拆分成多个简单句，每个子句作为独立句子
7. 对于没有明显分割点的长句，根据语义单元在35字符附近的单词边界分割
8. 对于超过50字符的句子，必须再次分割，不允许例外
9. 确保分割后每个句子保持基本语义连贯性
10. 返回的所有句子拼接起来必须与原文完全一致
11. 每次分割前检查剩余文本长度，防止生成过短句子（少于15字符）

验证步骤（必须执行）：
1. 记录原始输入文本的每个字符
2. 分割后，检查每个句子的字符数，确保都在30-50范围内
3. 特别检查是否有未在逗号处分割的长句（超过35字符）
4. 检查每个句子是否表达了一个相对完整的语义单元
5. 将所有句子拼接并逐字符比对原文，确保100%匹配
6. 对于任何超过50字符的句子，立即重新分割
7. 确保最后一个句子不会过短（少于15字符）`

	// English system prompt for splitting text
	const englishSystemPrompt = `Split the input text into shorter sentences following these rules:
1. Keep the original content intact without adding, removing, or translating any content. Do not add any extra content (such as spaces, punctuation, line breaks, comments, or explanations). Only return the split sentences from the original text.
2. Strictly control each sentence length to be between 30-50 characters
3. Split priority:
   - First at natural sentence endings (periods, question marks, exclamation points)
   - Must split at commas, especially when the sentence exceeds 35 characters
   - Split after semicolons and colons
   - Split after the end of quotations
   - Then at conjunctions (like and, but, or, because, about, whether)
   - Then at prepositional phrases, noun phrases, or clause boundaries
   - Split according to semantic units, ensuring each sentence expresses one complete semantic unit
   - Finally at any possible word boundary
4. Comma splitting rules:
   - Consider splitting immediately when encountering a comma, especially if current part is already 30+ characters
   - Sentences with multiple commas must be split into multiple shorter sentences
   - Split at commas in long sentences even if it slightly disrupts semantic completeness
5. For sentences with quotations, must split at the end of quotations
6. For compound sentences, must break them into multiple simple sentences, each sub-clause as an independent sentence
7. For long sentences without obvious split points, split at word boundaries near 35 characters according to semantic units
8. For sentences over 50 characters, must split again, no exceptions
9. Ensure basic semantic coherence in each sentence
10. All sentences concatenated must match the original text exactly
11. Check remaining text length before each split to prevent generating very short sentences (less than 15 characters)

Validation steps (must be executed):
1. Record each character of the original input text
2. After splitting, check character count of each sentence to ensure they're within 30-50 range
3. Specifically check for any long sentences (over 35 characters) that weren't split at commas
4. Check if each sentence expresses a relatively complete semantic unit
5. Concatenate all sentences and compare character by character with original, ensure 100% match
6. For any sentence over 50 characters, split immediately
7. Ensure the last sentence isn't too short (less than 15 characters)`

	// Select the appropriate system prompt based on content language detection
	// For simplicity, we're using Chinese prompt for deepseek and English for others
	// In a more advanced implementation, you could detect the language of the content
	const systemPrompt = model === 'deepseek' ? chineseSystemPrompt : englishSystemPrompt

	switch (model) {
		case 'deepseek':
			result = await deepSeek.generateObject({
				schema: WordsToSentencesSchema,
				system: systemPrompt,
				prompt: sentence,
			})
			break
		case 'openai':
			result = await chatGPT.generateObject({
				schema: WordsToSentencesSchema,
				system: systemPrompt,
				prompt: sentence,
			})
			break
		case 'gemini':
			result = await gemini.generateObject({
				schema: WordsToSentencesSchema,
				system: systemPrompt,
				prompt: sentence,
			})
			break
		case 'r1':
			result = await r1.generateObject({
				schema: WordsToSentencesSchema,
				system: systemPrompt,
				prompt: sentence,
			})
			break
		case 'volcanoEngineDeepseekV3':
			result = await volcanoEngineDeepseekV3.generateObject({
				schema: WordsToSentencesSchema,
				system: systemPrompt,
				prompt: sentence,
			})
			break
		default:
			throw new Error(`Unsupported model: ${model}`)
	}

	return result.sentences
}

/**
 * 使用 Gemini AI 对齐 words 和 sentences，返回 Sentence[]
 * @param words WordWithTime[]
 * @param sentences string[]
 * @returns Promise<Sentence[]>
 */
export async function alignWordsAndSentencesByAI(words: WordWithTime[], sentences: string[]): Promise<Sentence[]> {
	if (!words.length || !sentences.length) return []

	// 只传递 word 字符串，减少 token
	const wordList = words.map((w) => w.word)

	// 构造 prompt，要求 AI 返回 {"indices": ...} 结构，并严格约束输出格式
	const systemPrompt =
		'You are an alignment assistant. Given a list of words and a list of sentences (the sentences are split from the concatenation of all words), align the words to the sentences. For each sentence, return an array of the indices (0-based) of the words that belong to it. Only return a JSON object with an "indices" key, e.g. {"indices": [[0,1,2],[3,4,5]]}. Do not return any explanation, markdown, code block, or extra text. The output must be strictly valid JSON.'

	// 组装输入
	const prompt = `words: ${JSON.stringify(wordList)}\nsentences: ${JSON.stringify(sentences)}`

	// 请求 AI，使用 generateText
	const textResult = await chatGPT.generateText({
		system: systemPrompt,
		prompt,
	})

	// 解析 AI 返回的 JSON，自动去除 markdown 代码块包裹
	let result: { indices: number[][] }
	let jsonText = textResult.trim()
	if (jsonText.startsWith('```json')) {
		jsonText = jsonText
			.replace(/^```json/, '')
			.replace(/```$/, '')
			.trim()
	} else if (jsonText.startsWith('```')) {
		jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim()
	}
	try {
		result = JSON.parse(jsonText)
	} catch (e) {
		throw new Error(`Failed to parse Gemini response as JSON: ${jsonText}`)
	}

	// 组装 Sentence[]
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

/**
 * 分批处理 words 和 sentences，避免超出 token 限制
 * @param words 所有单词
 * @param sentences 所有句子
 * @param options 配置选项
 * @returns 对齐后的句子数组
 */
export async function alignWordsAndSentencesByAIBatched(
	words: WordWithTime[],
	sentences: string[],
	options: {
		batchSize?: number
		model?: AiModel
		overlap?: number
		maxTokensPerBatch?: number
	} = {},
): Promise<Sentence[]> {
	if (!words.length || !sentences.length) return []

	const {
		batchSize = 50, // 减小默认批处理大小至50
		overlap = 10, // 批次之间的重叠单词数，提高连续性
		maxTokensPerBatch = 4000, // 减小每批次最大token数至4000
	} = options

	// 如果数据量小，直接使用原始函数处理
	if (words.length <= 30 && sentences.length <= 10) {
		return alignWordsAndSentencesByAI(words, sentences)
	}

	// 估算token数量（粗略估算：每个单词算4个token，每个句子算20个token）
	const estimateTokens = (wordCount: number, sentenceCount: number) => {
		return wordCount * 4 + sentenceCount * 20 + 300 // 额外300用于系统提示和其他开销
	}

	// 按句子长度动态调整批次大小
	const avgWordsPerSentence = words.length / sentences.length
	let dynamicBatchSize = Math.min(batchSize, 50) // 确保批次大小不超过50

	// 如果句子平均长度过长，进一步减小批次大小
	if (avgWordsPerSentence > 10) {
		dynamicBatchSize = Math.min(dynamicBatchSize, Math.floor(maxTokensPerBatch / (avgWordsPerSentence * 5 + 30)))
	}

	// 结果集
	const allResults: Sentence[] = []

	// 创建单词批次，基于动态批次大小
	for (let wordStartIdx = 0; wordStartIdx < words.length; wordStartIdx += dynamicBatchSize - overlap) {
		const wordEndIdx = Math.min(wordStartIdx + dynamicBatchSize, words.length)
		const wordBatch = words.slice(wordStartIdx, wordEndIdx)

		// 估算当前批次的单词所属句子范围
		const sentenceRatio = sentences.length / words.length
		const estimatedSentenceStartIdx = Math.max(0, Math.floor(wordStartIdx * sentenceRatio) - 1)
		const estimatedSentenceEndIdx = Math.min(sentences.length, Math.ceil(wordEndIdx * sentenceRatio) + 1)

		// 获取当前批次的句子，但限制句子数量不超过10个
		let sentenceBatch = sentences.slice(estimatedSentenceStartIdx, estimatedSentenceEndIdx)

		// 如果句子太多，只取最可能匹配的句子
		if (sentenceBatch.length > 10) {
			const middleIndex = Math.floor(sentenceBatch.length / 2)
			const halfLength = 5 // 取中间的10个句子
			sentenceBatch = sentenceBatch.slice(Math.max(0, middleIndex - halfLength), Math.min(sentenceBatch.length, middleIndex + halfLength))
		}

		// 检查当前批次的token估算
		const estimatedTokens = estimateTokens(wordBatch.length, sentenceBatch.length)

		// 如果估算的token还是超出限制，进一步减小单词批次
		if (estimatedTokens > maxTokensPerBatch) {
			// 递归处理较小的子批次
			const subBatchSize = Math.floor(wordBatch.length / 2)

			// 处理第一部分
			const firstHalfWords = wordBatch.slice(0, subBatchSize)
			try {
				const firstHalfResults = await processBatch(firstHalfWords, sentenceBatch, wordStartIdx, estimatedSentenceStartIdx)
				allResults.push(...firstHalfResults)
			} catch (error) {
				console.error(`Error processing first half batch: ${error}`)
				// 继续处理，不中断整个过程
			}

			// 处理第二部分
			const secondHalfWords = wordBatch.slice(subBatchSize)
			try {
				const secondHalfResults = await processBatch(secondHalfWords, sentenceBatch, wordStartIdx + subBatchSize, estimatedSentenceStartIdx)
				allResults.push(...secondHalfResults)
			} catch (error) {
				console.error(`Error processing second half batch: ${error}`)
				// 继续处理，不中断整个过程
			}
		} else {
			// 直接处理批次，带错误处理
			try {
				const batchResults = await processBatch(wordBatch, sentenceBatch, wordStartIdx, estimatedSentenceStartIdx)
				allResults.push(...batchResults)
			} catch (error) {
				console.error(`Error processing batch: ${error}`)

				// 失败时尝试减半处理
				if (wordBatch.length > 10) {
					const halfSize = Math.floor(wordBatch.length / 2)

					try {
						// 处理前半部分
						const firstHalfWords = wordBatch.slice(0, halfSize)
						const firstHalfResults = await processBatch(firstHalfWords, sentenceBatch, wordStartIdx, estimatedSentenceStartIdx)
						allResults.push(...firstHalfResults)

						// 处理后半部分
						const secondHalfWords = wordBatch.slice(halfSize)
						const secondHalfResults = await processBatch(secondHalfWords, sentenceBatch, wordStartIdx + halfSize, estimatedSentenceStartIdx)
						allResults.push(...secondHalfResults)
					} catch (retryError) {
						console.error(`Error in retry processing: ${retryError}`)
						// 失败了就继续，不中断整个过程
					}
				}
			}
		}
	}

	// 处理单批次的辅助函数
	async function processBatch(wordBatch: WordWithTime[], sentenceBatch: string[], wordOffset: number, sentenceOffset: number): Promise<Sentence[]> {
		if (wordBatch.length === 0 || sentenceBatch.length === 0) {
			return []
		}

		// 使用AI对齐当前批次 - 添加重试逻辑
		let retryCount = 0
		const maxRetries = 2
		let batchResults: Sentence[] = []

		while (retryCount <= maxRetries) {
			try {
				// 如果是重试，且数据量大，减少处理量
				if (retryCount > 0 && wordBatch.length > 10) {
					// 只处理一部分单词
					const reducedWordBatch = wordBatch.slice(0, Math.floor(wordBatch.length * 0.7))
					batchResults = await alignWordsAndSentencesByAI(reducedWordBatch, sentenceBatch)
				} else {
					batchResults = await alignWordsAndSentencesByAI(wordBatch, sentenceBatch)
				}
				break // 成功就跳出循环
			} catch (error) {
				retryCount++
				console.error(`Batch processing failed, retry ${retryCount}/${maxRetries}: ${error}`)

				if (retryCount === maxRetries) {
					// 最后一次尝试，使用超小批次
					if (wordBatch.length > 5 && sentenceBatch.length > 1) {
						const tinyWordBatch = wordBatch.slice(0, 5)
						const tinySentenceBatch = sentenceBatch.slice(0, 1)
						try {
							batchResults = await alignWordsAndSentencesByAI(tinyWordBatch, tinySentenceBatch)
							break
						} catch (finalError) {
							console.error(`Final tiny batch also failed: ${finalError}`)
							throw finalError
						}
					} else {
						throw error // 重试失败且已经足够小，抛出错误
					}
				}
			}
		}

		// 处理结果，转换回原始索引
		return batchResults.map((result) => {
			// 使用绝对索引查找对应的句子文本
			const sentenceIndex = sentenceOffset + sentenceBatch.indexOf(result.text)
			const originalSentence = sentences[sentenceIndex]

			// 创建新的结果对象
			return {
				words: result.words,
				text: originalSentence || result.text, // 使用原始句子，如果找不到则使用批次中的句子
				start: result.start,
				end: result.end,
			}
		})
	}

	// 合并结果并按词索引去重
	// 由于批次处理可能导致同一个单词被分配到多个句子，我们需要去重
	const wordMap = new Map<string, Sentence>()

	// 基于单词的唯一标识(使用时间戳创建唯一标识)创建映射
	for (const result of allResults) {
		for (const word of result.words) {
			const wordKey = `${word.start}-${word.end}-${word.word}`
			if (!wordMap.has(wordKey)) {
				wordMap.set(wordKey, result)
			}
		}
	}

	// 重构句子结果，确保每个句子只包含唯一单词
	const sentenceMap = new Map<string, WordWithTime[]>()

	for (const [wordKey, sentence] of wordMap.entries()) {
		// 从wordKey中提取单词信息
		const [startStr, endStr, ...wordParts] = wordKey.split('-')
		const word = wordParts.join('-') // 重新组合可能包含"-"的单词
		const start = Number.parseFloat(startStr)
		const end = Number.parseFloat(endStr)

		const wordInfo: WordWithTime = { word, start, end }

		if (!sentenceMap.has(sentence.text)) {
			sentenceMap.set(sentence.text, [])
		}

		const wordsArray = sentenceMap.get(sentence.text)
		if (wordsArray) {
			wordsArray.push(wordInfo)
		}
	}

	// 创建最终结果数组
	const finalResults: Sentence[] = []

	for (const [text, words] of sentenceMap.entries()) {
		// 按时间排序单词
		const sortedWords = words.sort((a, b) => a.start - b.start)

		if (sortedWords.length > 0) {
			finalResults.push({
				words: sortedWords,
				text,
				start: sortedWords[0].start,
				end: sortedWords[sortedWords.length - 1].end,
			})
		}
	}

	// 按开始时间排序句子
	return finalResults.sort((a, b) => a.start - b.start)
}
