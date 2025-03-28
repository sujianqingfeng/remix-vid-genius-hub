import type { Transcript } from '~/types'

// 去除句子两边的符号
export function trimPunctuation(sentence: string): string {
	const punctuationRegex = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu
	return sentence.replace(punctuationRegex, '')
}

// 生成 ASS 格式字幕
export function generateASS(transcripts: Transcript[]): string {
	const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Microsoft YaHei,60,&HFFFFFF,&HFFFFFF,&H000000,&H40000000,0,0,0,0,100,100,0,0,4,1,0,2,0,0,100,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`

	const events = transcripts
		.map((transcript) => {
			const start = formatASSTime(transcript.start)
			const end = formatASSTime(transcript.end)
			const text = transcript.text
			const translation = transcript.textInterpretation || ''

			return `Dialogue: 0,${start},${end},Default,,0,0,0,,{\\1a&H00&\\2a&H00&\\3a&H00&\\4a&H40&}${text}\\N${translation}`
		})
		.join('\n')

	return `${header}\n\n${events}`
}

// 格式化时间为 ASS 格式 (0:00:00.00)
function formatASSTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const secs = seconds % 60
	return `${hours}:${String(minutes).padStart(2, '0')}:${String(Math.floor(secs)).padStart(2, '0')}.${String(Math.floor((secs % 1) * 100)).padStart(2, '0')}`
}
