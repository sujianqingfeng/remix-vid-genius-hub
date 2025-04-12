import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { downloads } from './db/schema'

export const downloadsInsertSchema = createInsertSchema(downloads)

export const GenerateDialogueSchema = z.object({
	list: z.array(
		z.object({
			roleLabel: z.number(),
			content: z.string(),
			contentZh: z.string(),
		}),
	),
})

export const GenerateWordSentencesSchema = z.object({
	list: z.array(
		z.object({
			word: z.string(),
			wordZh: z.string(),
			sentence: z.string(),
			sentenceZh: z.string(),
		}),
	),
})
