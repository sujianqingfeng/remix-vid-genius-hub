import { useFetcher } from '@remix-run/react'
import { Plus, Scissors, Trash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Slider } from '~/components/ui/slider'

// Reuse the formatTime function
function formatTime(seconds: number) {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

type TrimSegment = {
	id: string
	start: number
	end: number
}

export default function VideoTrimmer({
	videoId,
	videoDuration,
}: {
	videoId: string
	videoDuration: number
}) {
	const [currentPosition, setCurrentPosition] = useState(0)
	const [segments, setSegments] = useState<TrimSegment[]>([])
	const trimFetcher = useFetcher()
	const videoRef = useRef<HTMLVideoElement | null>(null)

	// Connect to the video element on the page
	useEffect(() => {
		const videoElement = document.querySelector('video')
		if (videoElement) {
			videoRef.current = videoElement

			// Listen to the timeupdate event to update current position
			const handleTimeUpdate = () => {
				setCurrentPosition(videoElement.currentTime)
			}

			videoElement.addEventListener('timeupdate', handleTimeUpdate)
			return () => {
				videoElement.removeEventListener('timeupdate', handleTimeUpdate)
			}
		}
	}, [])

	// Add a new segment to remove
	const addSegment = () => {
		const newSegment: TrimSegment = {
			id: Math.random().toString(36).substring(2, 9),
			start: Math.max(0, currentPosition - 2),
			end: Math.min(videoDuration, currentPosition + 2),
		}
		setSegments([...segments, newSegment])
	}

	// Remove a segment
	const removeSegment = (id: string) => {
		setSegments(segments.filter((segment) => segment.id !== id))
	}

	// Update the start and end times of a segment
	const updateSegment = (id: string, start: number, end: number) => {
		setSegments(segments.map((segment) => (segment.id === id ? { ...segment, start, end } : segment)))
	}

	// Seek to a specific position in the video
	const seekToPosition = (position: number) => {
		if (videoRef.current) {
			videoRef.current.currentTime = position
		}
	}

	return (
		<Card className="group transition-all duration-300 hover:shadow-lg">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Scissors className="w-5 h-5 text-muted-foreground" />
						Video Trimmer
					</div>
					<Button variant="outline" size="sm" onClick={addSegment} className="flex items-center gap-1">
						<Plus className="w-4 h-4" />
						Add Segment
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* Current position indicator */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm text-muted-foreground">
							<span>Current Position: {formatTime(currentPosition)}</span>
							<span>Duration: {formatTime(videoDuration)}</span>
						</div>
						<Slider
							value={[currentPosition]}
							min={0}
							max={videoDuration}
							step={0.1}
							onValueChange={(values) => {
								setCurrentPosition(values[0])
								seekToPosition(values[0])
							}}
							className="my-4"
						/>
					</div>

					{/* List of segments to remove */}
					{segments.length > 0 ? (
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Segments to Remove:</h3>
							{segments.map((segment) => (
								<div key={segment.id} className="space-y-2 border p-3 rounded-md">
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">
											{formatTime(segment.start)} - {formatTime(segment.end)}
										</span>
										<Button variant="ghost" size="icon" onClick={() => removeSegment(segment.id)} className="h-7 w-7">
											<Trash className="h-4 w-4" />
										</Button>
									</div>
									<Slider
										value={[segment.start, segment.end]}
										min={0}
										max={videoDuration}
										step={0.1}
										onValueChange={(values) => {
											updateSegment(segment.id, values[0], values[1])
										}}
										className="my-2"
									/>
									<div className="flex gap-2">
										<Button variant="outline" size="sm" onClick={() => seekToPosition(segment.start)} className="text-xs">
											Jump to Start
										</Button>
										<Button variant="outline" size="sm" onClick={() => seekToPosition(segment.end)} className="text-xs">
											Jump to End
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-4 text-muted-foreground">Please add segments to remove</div>
					)}

					{segments.length > 0 && (
						<trimFetcher.Form method="post" action={`/app/translate-video/${videoId}/trim-video`}>
							<input type="hidden" name="segments" value={JSON.stringify(segments)} />
							<LoadingButtonWithState type="submit" className="w-full" state={trimFetcher.state} idleText="Trim Video" loadingText="Processing..." />
						</trimFetcher.Form>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
