import { execSync } from 'node:child_process'
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

/**
 * Get the duration of an audio file in seconds using ffmpeg
 * @param filePath - Path to the audio file
 * @returns Duration in seconds
 */
export function getAudioDuration(filePath: string): number {
	try {
		// Use ffprobe to get duration information
		const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
		const output = execSync(command).toString().trim()
		return Number.parseFloat(output)
	} catch (error) {
		console.error('Error getting audio duration:', error)
		return 0
	}
}

/**
 * Generate FFmpeg command to take a screenshot at the specified time
 * @param videoPath - Path to the video file
 * @param timestamp - Time in seconds to take screenshot at
 * @returns FFmpeg command arguments array
 */
export function generateScreenshotCommand(videoPath: string, timestamp: number) {
	return [
		'-y',
		'-ss',
		timestamp.toString(), // Take screenshot at specified timestamp
		'-i',
		videoPath,
		'-vframes',
		'1', // Extract only one frame
		'-q:v',
		'2', // High quality
	]
}

/**
 * Convert audio file to standardized WAV format (16kHz, mono, PCM)
 * @param inputPath - Path to the input audio file
 * @param outputPath - Path to save the converted audio file
 * @returns Command to execute for the conversion
 */
export function convertToStandardAudioFormat(inputPath: string, outputPath: string): string {
	return `ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${outputPath}"`
}
