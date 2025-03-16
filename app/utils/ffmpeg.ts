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
