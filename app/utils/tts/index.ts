import { generateSpeech as generateSpeechFm } from './fm'
import type { TTSInput, TTSOutput, TTSProvider } from './types'

export function generateSpeech(provider: TTSProvider, input: TTSInput): Promise<TTSOutput> {
	switch (provider) {
		case 'fm':
			return generateSpeechFm(input)
	}
}
