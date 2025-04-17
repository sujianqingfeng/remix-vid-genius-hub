import { useFetcher } from '@remix-run/react'
import { AlignLeft, ArrowRight, Text } from 'lucide-react'
import { useState } from 'react'
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
	const [splitSentencesMethod, setSplitSentencesMethod] = useState<'code' | 'ai'>('ai')
	const showAiModelSelect = splitSentencesMethod === 'ai'

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
				<Card className="mb-6 bg-muted/30 border-0 shadow-sm">
					<CardContent className="p-4 flex items-center gap-3">
						<div className="rounded-full bg-primary/10 p-2">
							<ArrowRight className="h-4 w-4 text-primary" />
						</div>
						<p className="text-sm">ASR data available for alignment. Use the form below to align the text.</p>
					</CardContent>
				</Card>
			) : (
				<Card className="mb-6 bg-muted/30 border-0 shadow-sm">
					<CardContent className="p-4 flex items-center gap-3">
						<div className="rounded-full bg-muted/50 p-2">
							<AlignLeft className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">No ASR data available. Please complete the ASR step first.</p>
					</CardContent>
				</Card>
			)}

			{subtitleTranslation.sentences?.length ? (
				<Card className="mb-6 bg-muted/30 border-0 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center justify-between">
							<span>Aligned Subtitles</span>
							<Badge variant="secondary" className="ml-2">
								{totalWords} words
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="rounded-md bg-muted/20 p-3 max-h-80 overflow-y-auto">
							<div className="space-y-3">
								{subtitleTranslation.sentences.map((subtitle, index) => (
									<div key={`subtitle-${subtitle.start}-${index}`} className="bg-card p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
										<p className="text-sm md:text-base">{subtitle.text}</p>
										<div className="flex items-center mt-2">
											<Badge variant="outline" className="text-xs font-normal">
												{formatSubTitleTime(subtitle.start)} - {formatSubTitleTime(subtitle.end)}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			) : null}

			<Separator className="my-6" />

			<div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
				<h3 className="text-lg font-medium mb-4">Align Text</h3>
				<alignmentFetcher.Form method="post" action="alignment" className="flex flex-col gap-5">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="splitSentencesMethod" className="block text-sm font-medium mb-2">
								Select Sentence Split Method
							</label>
							<Select name="splitSentencesMethod" defaultValue="ai" onValueChange={(value) => setSplitSentencesMethod(value as 'code' | 'ai')}>
								<SelectTrigger>
									<SelectValue placeholder="Select Sentence Split Method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="code">Code</SelectItem>
									<SelectItem value="ai">AI</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<label htmlFor="alignmentMethod" className="block text-sm font-medium mb-2">
								Select Alignment Method
							</label>
							<Select name="alignmentMethod" defaultValue="code">
								<SelectTrigger>
									<SelectValue placeholder="Select Alignment Method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="code">Code</SelectItem>
									<SelectItem value="ai">AI</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{showAiModelSelect && (
							<div>
								<label htmlFor="model" className="block text-sm font-medium mb-2">
									Select AI Model
								</label>
								<AiModelSelect name="model" defaultValue="deepseek" />
								<p className="text-xs text-muted-foreground mt-1">Used when AI methods are selected</p>
							</div>
						)}
					</div>

					<LoadingButtonWithState type="submit" className="mt-2 w-full sm:w-auto" state={alignmentFetcher.state} idleText="Align Text" loadingText="Aligning..." />
				</alignmentFetcher.Form>
			</div>
		</div>
	)
}
