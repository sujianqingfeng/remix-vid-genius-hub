import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { deepSeek } from '~/utils/ai'

export const action = async ({ params, request }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	// 获取单词数据
	const word = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	invariant(word, 'Word not found')

	// 提取所有单词及其例句
	const wordData = word.sentences.map((sentence: any) => ({
		word: sentence.word,
		wordZh: sentence.wordZh,
		sentence: sentence.sentence,
		sentenceZh: sentence.sentenceZh,
	}))

	if (wordData.length === 0) {
		return json({ success: false, error: 'No words found' }, { status: 400 })
	}

	// 将数据格式化为更易于理解的形式
	const formattedWordData = wordData.map((item) => `单词: ${item.word}\n中文解释: ${item.wordZh}\n例句: ${item.sentence}\n例句翻译: ${item.sentenceZh}`).join('\n\n')

	// 使用大模型生成有趣的中文标题
	const system = `你是一位专业的英语单词教学视频创作者，擅长为单词学习视频创作吸引人的标题。

你将收到一组英语单词及其例句，请分析这些单词和例句的主题、难度和实用性，然后创作一个吸引人的中文标题。

这个标题应该：
- 简洁明了，不超过15个字
- 必须包含"英语单词"、"词汇"或类似的表达
- 突出单词学习的趣味性和实用性
- 能够激发学习者的学习兴趣
- 可以使用如"实用单词"、"地道表达"、"日常词汇"等词语
- 如果单词有共同主题（如商务、旅游、学术等），请在标题中体现
- 不使用标点符号、特殊字符或数字编号`

	try {
		const generatedTitle = await deepSeek.generateText({
			system,
			prompt: `请为以下英语单词学习视频创作一个吸引人的中文标题。这些是视频中要教授的单词和例句：\n\n${formattedWordData}\n\n创作一个能吸引学习者的中文标题，突出这些单词的学习价值和特点。`,
			maxTokens: 100,
		})

		// 更新数据库中的标题
		await db
			.update(schema.words)
			.set({
				title: generatedTitle,
			})
			.where(eq(schema.words.id, id))

		return json({ success: true, title: generatedTitle })
	} catch (error) {
		console.error('Error generating title:', error)
		return json({ success: false, error: 'Failed to generate title' }, { status: 500 })
	}
}
