import { useFetcher } from '@remix-run/react'
import { Trash, VolumeX } from 'lucide-react'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import type { Transcript } from '~/types'

function formatTime(seconds: number) {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function Transcripts({ transcripts }: { transcripts: Transcript[] }) {
	const deleteFetcher = useFetcher()
	const muteToggleFetcher = useFetcher()

	return (
		<div className="flex flex-col gap-3">
			{transcripts.map((transcript, index) => (
				<div
					key={`transcript-${transcript.start}-${transcript.end}`}
					className={`p-3 border rounded-md hover:shadow-sm transition-all ${transcript.excluded ? 'bg-muted/50' : ''}`}
				>
					<div className="flex justify-between items-center mb-2">
						<div className="text-sm text-muted-foreground">
							{formatTime(transcript.start)} - {formatTime(transcript.end)}
						</div>
						<div className="flex gap-1">
							<muteToggleFetcher.Form method="post" action="toggle-transcript-exclusion">
								<input type="hidden" name="index" value={index.toString()} />
								<LoadingButtonWithState
									variant="ghost"
									size="icon"
									className={`h-7 w-7 ${transcript.excluded ? 'text-destructive' : ''}`}
									type="submit"
									state={muteToggleFetcher.state === 'submitting' && muteToggleFetcher.formData?.get('index') === index.toString() ? 'submitting' : 'idle'}
									idleText=""
									icon={<VolumeX className="h-4 w-4" />}
									title={transcript.excluded ? 'Currently excluded and muted' : 'Click to exclude and mute'}
								/>
							</muteToggleFetcher.Form>
							<deleteFetcher.Form method="post" action="delete-transcript">
								<input type="hidden" name="index" value={index.toString()} />
								<LoadingButtonWithState
									variant="ghost"
									size="icon"
									className="h-7 w-7"
									type="submit"
									state={deleteFetcher.state === 'submitting' && deleteFetcher.formData?.get('index') === index.toString() ? 'submitting' : 'idle'}
									idleText=""
									icon={<Trash className="h-4 w-4" />}
								/>
							</deleteFetcher.Form>
						</div>
					</div>
					<div>
						<p className={`text-sm ${transcript.excluded ? 'line-through text-muted-foreground' : ''}`}>{transcript.text}</p>
						{transcript.textLiteralTranslation && (
							<p className={`text-sm text-muted-foreground mt-1 ${transcript.excluded ? 'line-through' : ''}`}>{transcript.textLiteralTranslation}</p>
						)}
						{transcript.textInterpretation && <p className={`text-sm text-muted-foreground mt-1 ${transcript.excluded ? 'line-through' : ''}`}>{transcript.textInterpretation}</p>}
					</div>
				</div>
			))}
			{transcripts.length === 0 && <div className="text-center py-8 text-muted-foreground">No transcripts available</div>}
		</div>
	)
}
