import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { type AiModel, aiGenerateText } from '~/utils/ai'
import { splitTextToSentences, splitTextToSentencesWithAI } from '~/utils/align'

/**
 * 使用 AI 将文本分割为适合字幕的短句
 * @param words 词数组
 * @param model AI模型名
 */
async function splitSentence(text: string, model: string): Promise<string[]> {
	console.log('🚀 ~ splitSentence ~ text:', text)
	const systemPrompt = `【任务】将文本分割成适合字幕显示的短句。

【角色】你是一个专业的字幕编辑器。

【核心规则】
1.  **强制长度限制：** 每个输出句子长度【必须】在20到35个字符之间（含标点）。这是【绝对不可违反】的规则，因为字幕显示空间有限。
2.  **强制拆分：** 任何超过35字符的句子【必须】被强制拆分，即使牺牲一点语义连贯性。在接近30字符的单词边界处拆分。
3.  **短句处理：** 遇到独立短语、称呼（如 "Hi, Mike.")、感叹（如 "Well,")等，【必须】单独成句，即使少于20字符。
4.  **原文一致：** 只分割原文，不修改、增删任何内容。拼接所有输出句子必须等于原文。
5.  **输出格式：** 只输出分割后的句子，用 \`|||\` 分隔。不要包含任何其他文字、解释或标记。

【示例】
原文："Hi, Mike. Well, U.S. chip sanctions aimed at slowing China's AI progress just really appear to be unraveling."
输出："Hi, Mike.|||Well,|||U.S. chip sanctions aimed at slowing China's AI progress|||just really appear to be unraveling."

原文："thisisaverylongsentencewithoutanypunctuationanditshouldbesplit"
输出："thisisaverylongsentencewithou||| tanypunctuationanditshouldbespl||| it"

【开始处理】请严格按照以上规则处理用户提供的文本：`

	const userPrompt = `Split the following text into natural sentences according to the rules provided. Return ONLY the sentences separated by '|||'.\n\n${text}`
	const delimiter = '|||'

	const textResult = await aiGenerateText({
		systemPrompt: systemPrompt,
		prompt: userPrompt,
		model: 'qwen',
	})

	if (!textResult) {
		throw new Error('AI returned empty result for sentence splitting.')
	}

	const sentences = textResult
		.split(delimiter)
		.map((s) => s.trim())
		.filter((s) => s.length > 0)

	return sentences
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const splitSentencesMethod = formData.get('splitSentencesMethod')
	invariant(splitSentencesMethod === 'ai' || splitSentencesMethod === 'code', 'Invalid split method')

	const model = (formData.get('model') as AiModel) || 'deepseek'

	const where = eq(schema.subtitleTranslations.id, id)
	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')
	const { withTimeWords } = subtitleTranslation
	invariant(withTimeWords && withTimeWords.length > 0, 'ASR data is required for alignment')

	let sentences: string[] = []

	const text = withTimeWords.reduce((acc: string, item: any) => {
		return acc + item.word
	}, '')

	if (splitSentencesMethod === 'ai') {
		sentences = await splitSentence(text, model)
		console.log(`AI split text into ${sentences.length} sentences using model: ${model}`)
	} else {
		sentences = splitTextToSentences({ text })
		console.log(`Code split text into ${sentences.length} sentences`)
	}

	// Store the split sentences in the database for later alignment
	await db
		.update(schema.subtitleTranslations)
		.set({
			splitSentences: sentences,
		})
		.where(where)

	return {
		success: true,
		sentenceCount: sentences.length,
	}
}
