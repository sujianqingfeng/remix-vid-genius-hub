import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import type { Transcript } from '~/types'

export default function VideoPlayer({ playFile, transcripts, defaultShowTranscript = true }: { playFile: string; transcripts: Transcript[]; defaultShowTranscript?: boolean }) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [currentTranscript, setCurrentTranscript] = useState<Transcript | null>(null)
	const [showTranscript, setShowTranscript] = useState(defaultShowTranscript)
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		const handleTimeUpdate = () => {
			const currentTime = video.currentTime
			// Find the transcript for the current time
			const transcript = transcripts.find((t) => {
				const start = t.start
				const end = t.end
				return currentTime >= start && currentTime <= end
			})

			setCurrentTranscript(transcript || null)
		}

		const handleLoadedData = () => {
			setIsLoading(false)
			setHasError(false)
		}

		const handleError = () => {
			setIsLoading(false)
			setHasError(true)
			console.error('Error loading video:', video.error)
		}

		video.addEventListener('timeupdate', handleTimeUpdate)
		video.addEventListener('loadeddata', handleLoadedData)
		video.addEventListener('error', handleError)

		return () => {
			video.removeEventListener('timeupdate', handleTimeUpdate)
			video.removeEventListener('loadeddata', handleLoadedData)
			video.removeEventListener('error', handleError)
		}
	}, [transcripts])

	const toggleTranscript = () => {
		setShowTranscript(!showTranscript)
	}

	return (
		<div className="relative">
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/10">
					<div className="text-center">
						<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
						<p className="mt-2">Loading video...</p>
					</div>
				</div>
			)}

			{hasError && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/10">
					<div className="text-center p-4 bg-destructive/10 rounded-lg">
						<p className="text-destructive font-medium">Failed to load video</p>
						<p className="text-sm mt-1">The video file may be missing or corrupted</p>
					</div>
				</div>
			)}

			<video ref={videoRef} src={playFile ? `/${playFile}` : undefined} controls className="w-full" preload="auto">
				<track
					kind="captions"
					src="#" // Add an empty track element for accessibility requirements
					default
				/>
			</video>

			<div className="absolute top-4 right-4 z-10">
				<Button variant="secondary" size="sm" className="bg-black/50 hover:bg-black/70 text-white" onClick={toggleTranscript}>
					{showTranscript ? (
						<>
							<EyeOff className="h-4 w-4 mr-1" />
							<span className="text-xs">Hide Script</span>
						</>
					) : (
						<>
							<Eye className="h-4 w-4 mr-1" />
							<span className="text-xs">Show Script</span>
						</>
					)}
				</Button>
			</div>

			{showTranscript && currentTranscript && (
				<div className="absolute bottom-16 left-0 right-0 text-center">
					<div className="inline-block bg-black/70 text-white px-4 py-2 rounded-lg">
						<p>{currentTranscript.text}</p>
						<p>{currentTranscript.textInterpretation}</p>
					</div>
				</div>
			)}
		</div>
	)
}
