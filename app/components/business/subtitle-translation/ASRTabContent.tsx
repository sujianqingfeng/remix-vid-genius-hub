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

	// Calculate joined text and word count if withTimeWords exists
	const joinedText = subtitleTranslation.withTimeWords
		?.map((word) => word.word)
		.join(' ')
		.trim()
	const wordCount = subtitleTranslation.withTimeWords?.length || 0

	return (
		<div className="focus:outline-none">
			<div className="flex items-center gap-2 mb-4">
				<Mic className="h-5 w-5 text-primary" />
				<h2 className="text-xl font-semibold">Automatic Speech Recognition</h2>
			</div>
			<CardDescription className="mb-6">Convert audio to text with precise timestamps</CardDescription>

			{subtitleTranslation.withTimeWords?.length ? (
				<div className="space-y-6 mb-6">
					{/* Text Display */}
					<Card className="bg-muted/30 border-0 shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-base flex items-center justify-between">
								<span>Text</span>
								<Badge variant="secondary" className="ml-2">
									{wordCount} words
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded-md bg-muted/20 p-3 whitespace-pre-wrap text-sm md:text-base">{joinedText}</div>
						</CardContent>
					</Card>
				</div>
			) : (
				<Card className="mb-6 bg-muted/30 border-0 shadow-sm">
					<CardContent className="p-4 flex items-center gap-3">
						<div className="rounded-full bg-muted/50 p-2">
							<Mic className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">No ASR data available. Convert audio to text using the form below.</p>
					</CardContent>
				</Card>
			)}

			<Separator className="my-6" />

			<div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
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
