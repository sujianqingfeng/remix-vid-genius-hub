import { useFetcher } from '@remix-run/react'
import { ArrowRight, Languages } from 'lucide-react'
import AiModelSelect from '~/components/AiModelSelect'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import type { Transcript } from '~/types'
import { formatSubTitleTime } from '~/utils/format'

interface TranslationTabContentProps {
	subtitleTranslation: {
		sentences?: Transcript[] | null
	}
}

export function TranslationTabContent({ subtitleTranslation }: TranslationTabContentProps) {
	const translationFetcher = useFetcher()

	return (
		<div className="focus:outline-none">
			<div className="flex items-center gap-2 mb-4">
				<Languages className="h-5 w-5 text-primary" />
				<h2 className="text-xl font-semibold">Translation</h2>
			</div>
			<CardDescription className="mb-6">Translate your subtitles to the target language</CardDescription>

			{subtitleTranslation.sentences?.length ? (
				<div className="mb-6">
					<Card className="mb-3 bg-muted/30 border-0 shadow-sm">
						<CardContent className="p-4 flex items-center gap-3">
							<div className="rounded-full bg-primary/10 p-2">
								<ArrowRight className="h-4 w-4 text-primary" />
							</div>
							<p className="text-sm">Aligned sentences available for translation.</p>
						</CardContent>
					</Card>

					{/* Display sentences to translate */}
					<Card className="bg-muted/30 border-0 shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-base">Source Sentences</CardTitle>
							<CardDescription>Text to be translated</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="rounded-md bg-muted/20 p-3 max-h-60 overflow-y-auto">
								<div className="space-y-3">
									{subtitleTranslation.sentences.map((subtitle, index) => (
										<div key={`subtitle-${subtitle.start}-${index}`} className="bg-card p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
											<p className="text-sm md:text-base">{subtitle.text}</p>
											<p className="text-sm md:text-base">{subtitle.textInterpretation}</p>

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
				</div>
			) : (
				<Card className="mb-6 bg-muted/30 border-0 shadow-sm">
					<CardContent className="p-4 flex items-center gap-3">
						<div className="rounded-full bg-muted/50 p-2">
							<Languages className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">No aligned sentences available. Please complete the alignment step first.</p>
					</CardContent>
				</Card>
			)}

			<Separator className="my-6" />

			<div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
				<h3 className="text-lg font-medium mb-4">Translate Text</h3>
				<translationFetcher.Form method="post" action="translation" className="flex flex-col gap-5">
					<div>
						<label htmlFor="model" className="block text-sm font-medium mb-2">
							Select Translation Model
						</label>
						<AiModelSelect name="model" defaultValue="deepseek" />
					</div>

					<LoadingButtonWithState type="submit" className="mt-2 w-full sm:w-auto" state={translationFetcher.state} idleText="Translate Text" loadingText="Translating..." />
				</translationFetcher.Form>
			</div>
		</div>
	)
}
