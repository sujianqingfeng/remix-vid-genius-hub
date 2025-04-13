import fs from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { generateImage } from '../4o'

describe('4o image generation', () => {
	const outputPath = path.join(__dirname, 'test-image.png')

	it(
		'should generate an image with the provided prompt',
		{
			timeout: 1000 * 60 * 10,
		},
		async () => {
			const result = await generateImage({
				prompt: '生成一张可爱的小猫咪，动漫风格，简单线条',
				outputPath,
			})

			// Verify the file was created and is readable
			const fileStats = await fs.stat(outputPath)
			expect(fileStats.size).toBeGreaterThan(0)

			expect(result.length).toBeGreaterThan(0)
			expect(result[0]).toHaveProperty('base64')
		},
	)
})
