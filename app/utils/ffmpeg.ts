import type { Transcript } from '~/types'

export function generateFFmpegCommand(videoPath: string, escapedSrtPath: string) {
	return [
		'-y',
		// Limit CPU usage
		'-threads',
		'2',
		'-thread_queue_size',
		'512',
		'-filter_threads',
		'2',
		'-filter_complex_threads',
		'2',
		// Input file
		'-i',
		videoPath,
		// Subtitle filter (for ASS format, we don't need force_style as styles are defined in the ASS file)
		'-vf',
		`ass='${escapedSrtPath}'`,
		// Video encoding settings with CPU optimization
		'-c:v',
		'libx264',
		'-preset',
		'faster',
		'-crf',
		'30',
		// Additional CPU optimization for x264
		'-x264-params',
		'ref=2:me=dia:subme=4:trellis=0',
		// Copy audio stream without re-encoding
		'-c:a',
		'copy',
	]
}

/**
 * Generate FFmpeg audio filter for muting segments of the video
 * Uses the 'volume' filter with timeline editing (enable/disable expressions)
 * @param excludedTranscripts - Array of transcripts that should be muted
 * @returns FFmpeg audio filter string or empty string if no segments to mute
 */
export function generateMuteSegmentsFilter(excludedTranscripts: Transcript[]): string {
	if (!excludedTranscripts.length) {
		return ''
	}

	// Create a volume filter with timeline editing to mute specific segments
	// Format: volume=enable='between(t,start,end)':volume=0,volume=1
	const muteExpressions = excludedTranscripts.map((transcript) => `between(t,${transcript.start},${transcript.end})`).join('+')

	// If any expression is true, set volume to 0, otherwise keep volume at 1
	return `volume=enable='${muteExpressions}':volume=0,volume=1`
}
