import { useFetcher } from '@remix-run/react'
import { AlignLeft, ArrowRight, Copy, Text } from 'lucide-react'
import { useEffect, useState } from 'react'
import AiModelSelect from '~/components/AiModelSelect'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import type { Transcript, WordWithTime } from '~/types'
import { formatSubTitleTime } from '~/utils/format'

interface AlignmentTabContentProps {
	subtitleTranslation: {
		withTimeWords?: WordWithTime[] | null
		splitSentences?: string[] | null
		sentences?: Transcript[] | null
	}
}

export function AlignmentTabContent({ subtitleTranslation }: AlignmentTabContentProps) {
	const splitFetcher = useFetcher()
	const alignmentFetcher = useFetcher()
	const alignmentPromptFetcher = useFetcher<{ prompt?: { systemPrompt: string; prompt: string } }>()
	const promptProcessFetcher = useFetcher<{ result?: string }>()

	const [splitSentencesMethod, setSplitSentencesMethod] = useState<'code' | 'ai'>('ai')
	const [alignmentMethod, setAlignmentMethod] = useState<'code' | 'ai'>('code')
	const [promptText, setPromptText] = useState('')
	const showAiModelSelect = splitSentencesMethod === 'ai' || alignmentMethod === 'ai'

	const [copied, setCopied] = useState(false)
	const [copyError, setCopyError] = useState<string | null>(null)

	// Calculate total word count from sentences
	const totalWords =
		subtitleTranslation.sentences?.reduce((acc, subtitle) => {
			// Count words by splitting text by whitespace and filtering out empty strings
			const wordCount = subtitle.text ? subtitle.text.split(/\s+/).filter(Boolean).length : 0
			return acc + wordCount
		}, 0) || 0

	// Calculate total split sentence count
	const splitSentenceCount = subtitleTranslation.splitSentences?.length || 0

	// Handle prompt copy and clipboard operations
	useEffect(() => {
		if (alignmentPromptFetcher.data?.prompt) {
			const text = `System Prompt:\n${alignmentPromptFetcher.data.prompt.systemPrompt}\n\nPrompt:\n${alignmentPromptFetcher.data.prompt.prompt}`
			// Don't auto-fill the text area anymore
			navigator.clipboard
				.writeText(text)
				.then(() => {
					setCopied(true)
					setTimeout(() => setCopied(false), 2000)
				})
				.catch(() => setCopyError('Failed to copy prompt'))
		}
	}, [alignmentPromptFetcher.data])

	const hasWithTimeWords = !!subtitleTranslation.withTimeWords?.length
	const hasSplitSentences = !!subtitleTranslation.splitSentences?.length
	const hasAlignedSubtitles = !!subtitleTranslation.sentences?.length

	return (
		<div className="focus:outline-none space-y-6">
			<div className="flex items-center gap-2">
				<AlignLeft className="h-5 w-5 text-primary" />
				<h2 className="text-xl font-semibold">Text Alignment</h2>
			</div>
			<CardDescription>Align text into properly timed subtitle segments</CardDescription>

			<Card className={`border-0 shadow-sm ${hasWithTimeWords ? 'bg-primary/5' : 'bg-muted/30'}`}>
				<CardContent className="p-4 flex items-center gap-3">
					<div className={`rounded-full p-2 ${hasWithTimeWords ? 'bg-primary/10' : 'bg-muted/50'}`}>
						{hasWithTimeWords ? <ArrowRight className="h-4 w-4 text-primary" /> : <AlignLeft className="h-4 w-4 text-muted-foreground" />}
					</div>
					{hasWithTimeWords ? (
						<p className="text-sm">ASR data available for alignment. Use the form below to align the text.</p>
					) : (
						<p className="text-sm text-muted-foreground">No ASR data available. Please complete the ASR step first.</p>
					)}
				</CardContent>
			</Card>

			{/* Display split sentences if available */}
			{hasSplitSentences && subtitleTranslation.splitSentences && (
				<Card className="bg-card border shadow-sm hover:shadow-md transition-shadow">
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Text className="h-4 w-4" />
								Split Sentences
							</span>
							<Badge variant="secondary" className="ml-2">
								{splitSentenceCount} sentences
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="rounded-md bg-muted/10 p-3 max-h-80 overflow-y-auto custom-scrollbar">
							<div className="space-y-3">
								{subtitleTranslation.splitSentences.map((sentence, index) => (
									<div key={`sentence-${index}-${sentence.substring(0, 20)}`} className="bg-background p-3 rounded-md shadow-sm hover:shadow transition-shadow border border-muted">
										<p className="text-sm md:text-base">{sentence}</p>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Display aligned subtitles if available */}
			{hasAlignedSubtitles && subtitleTranslation.sentences && (
				<Card className="bg-card border shadow-sm hover:shadow-md transition-shadow">
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center justify-between">
							<span className="flex items-center gap-2">
								<AlignLeft className="h-4 w-4" />
								Aligned Subtitles
							</span>
							<Badge variant="secondary" className="ml-2">
								{totalWords} words
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="rounded-md bg-muted/10 p-3 max-h-80 overflow-y-auto custom-scrollbar">
							<div className="space-y-3">
								{subtitleTranslation.sentences.map((subtitle, index) => (
									<div key={`subtitle-${subtitle.start}-${index}`} className="bg-background p-3 rounded-md shadow-sm hover:shadow transition-shadow border border-muted">
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
			)}

			<Separator />

			<div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-8">
				{/* Split Text Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Text className="h-5 w-5 text-primary" />
						<h3 className="text-lg font-medium">Split Text into Sentences</h3>
					</div>

					<splitFetcher.Form method="post" action="split" className="space-y-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="splitSentencesMethod" className="block text-sm font-medium">
									Sentence Split Method
								</label>
								<Select name="splitSentencesMethod" defaultValue="ai" onValueChange={(value) => setSplitSentencesMethod(value as 'code' | 'ai')}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Sentence Split Method" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="code">Code</SelectItem>
										<SelectItem value="ai">AI</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{showAiModelSelect && (
								<div className="space-y-2">
									<label htmlFor="model" className="block text-sm font-medium">
										AI Model
									</label>
									<AiModelSelect name="model" defaultValue="qwen" />
									<p className="text-xs text-muted-foreground mt-1">Used when AI methods are selected</p>
								</div>
							)}
						</div>

						<div>
							<LoadingButtonWithState type="submit" className="w-full sm:w-auto" state={splitFetcher.state} idleText="Split Text" loadingText="Splitting..." />
						</div>
					</splitFetcher.Form>
				</div>

				<Separator />

				{/* Align Text Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<AlignLeft className="h-5 w-5 text-primary" />
						<h3 className="text-lg font-medium">Align Text with Timing</h3>
					</div>

					<alignmentFetcher.Form method="post" action="align" className="space-y-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="alignmentMethod" className="block text-sm font-medium">
									Alignment Method
								</label>
								<Select name="alignmentMethod" defaultValue="code" onValueChange={(value) => setAlignmentMethod(value as 'code' | 'ai')}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Alignment Method" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="code">Code</SelectItem>
										<SelectItem value="ai">AI</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{alignmentMethod === 'ai' && (
								<div className="space-y-2">
									<label htmlFor="alignModel" className="block text-sm font-medium">
										AI Model
									</label>
									<AiModelSelect name="alignModel" defaultValue="deepseek" />
									<p className="text-xs text-muted-foreground mt-1">Used for AI alignment</p>
								</div>
							)}
						</div>

						<div>
							<LoadingButtonWithState
								type="submit"
								className="w-full sm:w-auto"
								state={alignmentFetcher.state}
								idleText="Align Text"
								loadingText="Aligning..."
								disabled={!hasSplitSentences}
							/>
							{!hasSplitSentences && <p className="text-xs text-amber-500 mt-1">Please split the text into sentences first</p>}
						</div>
					</alignmentFetcher.Form>
				</div>

				<Separator />

				{/* AI Prompt Tools Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Copy className="h-5 w-5 text-primary" />
						<h3 className="text-lg font-medium">AI Prompt Tools</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
						<div className="md:col-span-5">
							<alignmentPromptFetcher.Form method="post" action="alignment-prompt" className="space-y-4">
								<h4 className="text-sm font-medium">Generate Alignment Prompt</h4>
								<Button type="submit" variant="outline" className="flex items-center gap-2 w-full" disabled={alignmentPromptFetcher.state === 'submitting' || !hasSplitSentences}>
									<Copy className="w-4 h-4" />
									{alignmentPromptFetcher.state === 'submitting' ? 'Copying...' : copied ? 'Copied!' : 'Copy Alignment Prompt'}
								</Button>
								{copyError && <div className="text-red-500 text-xs mt-1">{copyError}</div>}
								{!hasSplitSentences && <p className="text-xs text-amber-500 mt-1">Please split the text into sentences first</p>}
							</alignmentPromptFetcher.Form>
						</div>

						<div className="md:col-span-7">
							<promptProcessFetcher.Form method="post" action="alignment-prompt-process" className="space-y-4">
								<h4 className="text-sm font-medium">Process AI Result</h4>
								<Textarea
									id="prompt-textarea"
									name="promptText"
									className="min-h-[120px] resize-y"
									placeholder="Paste AI-generated results here..."
									value={promptText}
									onChange={(e) => setPromptText(e.target.value)}
								/>
								<p className="text-xs text-muted-foreground">After using an external AI tool with the copied prompt, paste the result here</p>
								<Button type="submit" variant="outline" className="w-full sm:w-auto" disabled={promptProcessFetcher.state === 'submitting' || !promptText.trim()}>
									Process AI Result
								</Button>
							</promptProcessFetcher.Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
