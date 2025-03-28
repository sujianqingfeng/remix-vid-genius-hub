import { z } from 'zod'

export const GenerateDialogueSchema = z.object({
	list: z.array(
		z.object({
			roleLabel: z.number(),
			content: z.string(),
			contentZh: z.string(),
		}),
	),
})

export const WordsToSentencesSchema = z.object({
	sentences: z.array(z.string()),
})
