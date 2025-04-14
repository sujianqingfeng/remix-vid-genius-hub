import fs from 'node:fs/promises'
import path from 'node:path'
import { createOpenAI } from '@ai-sdk/openai'
import { experimental_generateImage as generateImageAI } from 'ai'
import type { GenerateImageInput } from './types'

const API_BASE_URL = 'https://api.tu-zi.com/v1'
const model = 'gpt-4o-image'

export async function generateImage({ prompt, outputPath, size }: GenerateImageInput) {
	const openai = createOpenAI({
		baseURL: API_BASE_URL,
		apiKey: process.env.TU_ZI_API_KEY,
	})

	const { images } = await generateImageAI({
		model: openai.image(model),
		prompt,
		n: 1,
		size,
	})

	const dir = path.dirname(outputPath)
	await fs.mkdir(dir, { recursive: true })

	if (images.length > 0 && outputPath) {
		let base64Data = images[0].base64
		if (base64Data.includes(';base64,')) {
			base64Data = base64Data.split(';base64,')[1]
		}

		const buffer = Buffer.from(base64Data, 'base64')
		await fs.writeFile(outputPath, buffer)
	}

	return images
}
