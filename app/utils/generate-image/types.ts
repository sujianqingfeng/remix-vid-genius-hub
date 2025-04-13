export type GenerateImageProvider = '4o'

export type GenerateImageInput = {
	prompt: string
	outputPath: string
	size?: `${number}x${number}` | undefined
}
