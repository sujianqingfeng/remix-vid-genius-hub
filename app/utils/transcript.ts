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
WrapStyle: 0
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: English,Microsoft YaHei,55,&HFFFFFF,&HFFFFFF,&H000000,&H40000000,0,0,0,0,100,100,0,0,1,3,0,2,10,10,150,1
Style: Chinese,Microsoft YaHei,80,&H00FFFF,&H00FFFF,&H000000,&H40000000,0,0,0,0,100,100,0,0,1,3,0,2,10,10,120,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`

	const events = transcripts
		.filter((transcript) => !transcript.excluded)
		.map((transcript) => {
			const start = formatASSTime(transcript.start)
			const end = formatASSTime(transcript.end)
			const text = transcript.text.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}')
			const translation = transcript.textInterpretation ? transcript.textInterpretation.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}') : ''

			// Chinese positioned above English, both at the bottom
			let result = `Dialogue: 0,${start},${end},English,,0,0,0,,${text}`
			if (translation) {
				// Chinese subtitles above English, both at the bottom of the screen
				result = `Dialogue: 0,${start},${end},Chinese,,0,0,0,,${translation}\n${result}`
			}
			return result
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
