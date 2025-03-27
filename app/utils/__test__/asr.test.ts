import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { transcribeAudio } from '../asr'

const apiKey = process.env.OPEN_AI_API_KEY

if (!apiKey) {
	throw new Error('OPEN_AI_API_KEY is not set')
}

describe('transcribeAudio', () => {
	test(
		'should successfully transcribe audio',
		async () => {
			const audioFilePath = path.join(__dirname, './asr-test.wav')

			const result = await transcribeAudio(apiKey, audioFilePath, {
				responseFormat: 'json',
			})
			expect(result).toMatchInlineSnapshot(
				`"The U.S. is adding dozens of AI-related Chinese tech companies to an export blacklist that prevents American firms from supplying them without special government permits, the first such effort under this new Trump White House. Meantime, some new concerns today about NVIDIA's business in China. With all of that, we turn to Christina Partsenevelos. Morning, Christina. Well, new energy-efficient regulations threaten to block NVIDIA's H20 chips from the Chinese market, potentially jeopardizing up to 13 percent of its total 2025 revenues. This is according to the FT. Beijing's latest regulatory move puts NVIDIA really in a strategic pressure cooker, also why you're seeing shares off almost 5 percent. The company must now consider radical chip redesigns to really improve energy efficiency, or they risk losing their foothold in one of the world's most competitive tech markets. Industry sources are revealing NVIDIA's already developing a new chip for China specifically for that market with improved memory, possibly improved energy efficiency. Wells Fargo analysts remain confident, citing the company's proven track record of navigating geopolitical challenges. Quote, it would be foolish to think NVIDIA would not find a business solution for this new issue. But the real threat comes from domestic rivals like Huawei, who are positioning themselves as potential replacements, signaling China's rapidly advancing technological capabilities. At the center of this high-stakes drama is NVIDIA's CEO, of course, Jensen Wang, who is preparing to meet with Chinese officials, according to the report. This is more than a business negotiation, though. It's a delicate diplomatic dance that really tests the boundaries of U.S.-China tech relations. And the stakes are definitely clear. Protect about $17 billion in market value, navigate geopolitical tensions, and maintain technological leadership in an increasingly competitive global landscape. Shares off now 5 percent, David. Yeah, we're keeping an eye on that. It continues to weaken. Thank you, Christina."`,
			)
		},
		{ timeout: 60 * 1000 },
	)
})
