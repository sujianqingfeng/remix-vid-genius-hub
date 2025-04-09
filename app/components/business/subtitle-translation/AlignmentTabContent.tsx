import { useFetcher } from '@remix-run/react'
import { AlignLeft, ArrowRight, Text } from 'lucide-react'
import AiModelSelect from '~/components/AiModelSelect'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import type { Transcript, WordWithTime } from '~/types'
import { formatSubTitleTime } from '~/utils/format'

interface AlignmentTabContentProps {
	subtitleTranslation: {
		withTimeWords?: WordWithTime[] | null
		sentences?: Transcript[] | null
	}
}

export function AlignmentTabContent({ subtitleTranslation }: AlignmentTabContentProps) {
	const alignmentFetcher = useFetcher()

	// Calculate total word count from sentences
	const totalWords =
		subtitleTranslation.sentences?.reduce((acc, subtitle) => {
			// Count words by splitting text by whitespace and filtering out empty strings
			const wordCount = subtitle.text ? subtitle.text.split(/\s+/).filter(Boolean).length : 0
			return acc + wordCount
		}, 0) || 0

	return (
		<div className="focus:outline-none">
			<div className="flex items-center gap-2 mb-4">
				<AlignLeft className="h-5 w-5 text-primary" />
				<h2 className="text-xl font-semibold">Text Alignment</h2>
			</div>
			<CardDescription className="mb-6">Align text into properly timed subtitle segments</CardDescription>

			{subtitleTranslation.withTimeWords?.length ? (
				<Card className="mb-6 bg-muted/30 border-0">
					<CardContent className="p-4 flex items-center gap-3">
						<div className="rounded-full bg-primary/10 p-2">
							<ArrowRight className="h-4 w-4 text-primary" />
						</div>
						<p className="text-sm">ASR data available for alignment. Use the form below to align the text.</p>
					</CardContent>
				</Card>
			) : (
				<Card className="mb-6 bg-muted/30 border-0">
					<CardContent className="p-4 flex items-center gap-3">
						<div className="rounded-full bg-muted/50 p-2">
							<AlignLeft className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">No ASR data available. Please complete the ASR step first.</p>
					</CardContent>
				</Card>
			)}

			{subtitleTranslation.sentences?.length ? (
				<Card className="mb-6 bg-muted/30 border-0">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Aligned Subtitles</CardTitle>
						<div className="flex items-center gap-2 mt-1">
							<Text className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">Total Words: {totalWords}</span>
						</div>
					</CardHeader>
					<CardContent>
						<div className="rounded-md bg-muted/20 p-3">
							{subtitleTranslation.sentences.map((subtitle, index) => (
								<div key={`subtitle-${subtitle.start}-${index}`} className="mb-3 bg-card p-3 rounded-md shadow-sm">
									<p className="text-sm">{subtitle.text}</p>
									<div className="flex items-center mt-2">
										<Badge variant="outline" className="text-xs font-normal">
											{formatSubTitleTime(subtitle.start)} - {formatSubTitleTime(subtitle.end)}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			) : null}

			<Separator className="my-6" />

			<div className="bg-card rounded-lg p-6 shadow-sm">
				<h3 className="text-lg font-medium mb-4">Align Text</h3>
				<alignmentFetcher.Form method="post" action="alignment" className="flex flex-col gap-5">
					<div>
						<label htmlFor="alignmentMethod" className="block text-sm font-medium mb-2">
							Select Alignment Method
							<Select name="alignmentMethod" defaultValue="ai">
								<SelectTrigger>
									<SelectValue placeholder="Select Alignment Method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ai">AI</SelectItem>
									<SelectItem value="code">Code</SelectItem>
								</SelectContent>
							</Select>
						</label>
						<AiModelSelect name="alignmentMethod" defaultValue="openai" />
					</div>

					<LoadingButtonWithState type="submit" className="mt-2 w-full sm:w-auto" state={alignmentFetcher.state} idleText="Align Text" loadingText="Aligning..." />
				</alignmentFetcher.Form>
			</div>
		</div>
	)
}
