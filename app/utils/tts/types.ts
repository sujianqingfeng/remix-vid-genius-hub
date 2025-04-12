export type TTSProvider = 'fm'

export type TTSInput = {
	text: string
	outputPath: string
	voice?: string
	instructions?: string
}

export type TTSOutput = {
	audioFilePath: string
}
