import { useFetcher } from '@remix-run/react'
import { Clock, Mic } from 'lucide-react'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import type { WordWithTime } from '~/types'
import { formatSubTitleTime } from '~/utils/format'

interface ASRTabContentProps {
	subtitleTranslation: {
		withTimeWords?: WordWithTime[] | null
	}
}

export function ASRTabContent({ subtitleTranslation }: ASRTabContentProps) {
	const asrFetcher = useFetcher()

	return (
		<div className="focus:outline-none">
			<div className="flex items-center gap-2 mb-4">
				<Mic className="h-5 w-5 text-primary" />
				<h2 className="text-xl font-semibold">Automatic Speech Recognition</h2>
			</div>
			<CardDescription className="mb-6">Convert audio from your video into text with timestamps</CardDescription>

			{subtitleTranslation.withTimeWords?.length ? (
				<div className="space-y-4 mb-6">
					{/* Text Display */}
					<Card className="bg-muted/30 border-0">
						<CardHeader className="pb-2">
							<CardTitle className="text-base">Text</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded-md bg-muted/20 p-3 whitespace-pre-wrap">
								{subtitleTranslation.withTimeWords.reduce((acc, word) => {
									return acc + word.word
								}, '')}
							</div>
						</CardContent>
					</Card>

					{/* Timestamps Display */}
					<Card className="bg-muted/30 border-0">
						<CardHeader className="pb-2">
							<CardTitle className="text-base flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Timestamps
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded-md bg-muted/20 p-3">
								<div className="flex flex-wrap gap-2">
									{subtitleTranslation.withTimeWords.map((word, index) => (
										<div key={`word-${word.start}-${word.end}-${index}`} className="flex flex-col items-center mb-2 bg-card p-2 rounded-md shadow-sm">
											<span className="text-lg font-medium mb-1">{word.word}</span>
											<div className="flex items-center gap-1 text-xs text-muted-foreground">
												<Badge variant="outline" className="text-xs px-1 py-0">
													{formatSubTitleTime(word.start)} - {formatSubTitleTime(word.end)}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			) : (
				<Card className="mb-6 bg-muted/30 border-0">
					<CardContent className="p-4 flex items-center gap-3">
						<div className="rounded-full bg-muted/50 p-2">
							<Mic className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">No ASR data available. Convert audio to text using the form below.</p>
					</CardContent>
				</Card>
			)}

			<Separator className="my-6" />

			<div className="bg-card rounded-lg p-6 shadow-sm">
				<h3 className="text-lg font-medium mb-4">Convert Audio to Text</h3>
				<asrFetcher.Form method="post" action="asr" className="flex flex-col gap-5">
					<div>
						<label htmlFor="model" className="block text-sm font-medium mb-2">
							Select ASR Model
						</label>
						<Select name="model" defaultValue="whisper-large">
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select ASR model" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="whisper-large">Whisper Large</SelectItem>
								<SelectItem value="whisper-medium">Whisper Medium</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<LoadingButtonWithState type="submit" className="mt-2 w-full sm:w-auto" state={asrFetcher.state} idleText="Convert Audio to Text" loadingText="Converting..." />
				</asrFetcher.Form>
			</div>
		</div>
	)
}
