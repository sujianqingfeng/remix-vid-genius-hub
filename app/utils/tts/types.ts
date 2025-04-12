export type TTSProvider = 'fm'

export type TTSInput = {
	text: string
	voice?: string
}

export type TTSOutput = {
	audioFilePath: string
}
