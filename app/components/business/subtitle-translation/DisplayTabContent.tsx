import { Form, useFetcher } from '@remix-run/react'
import { MonitorPlay } from 'lucide-react'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import type { Transcript } from '~/types'
import { formatSubTitleTime } from '~/utils/format'

interface DisplayTabContentProps {
	subtitleTranslation: {
		optimizedSentences?: Transcript[] | null
	}
}

export function DisplayTabContent({ subtitleTranslation }: DisplayTabContentProps) {
	const optimizationFetcher = useFetcher()
	const syncScriptFetcher = useFetcher()

	return (
		<div className="focus:outline-none">
			<div className="flex items-center gap-2 mb-4">
				<MonitorPlay className="h-5 w-5 text-primary" />
				<h2 className="text-xl font-semibold">Optimized Display</h2>
			</div>
			<CardDescription className="mb-6">Optimize how subtitles are displayed for better viewing experience</CardDescription>

			{subtitleTranslation.optimizedSentences?.length && subtitleTranslation.optimizedSentences.some((s) => s?.textInterpretation) ? (
				<Card className="mb-6 bg-muted/30 border-0 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Preview</CardTitle>
						<CardDescription>Optimized subtitles for better viewing experience</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="max-h-60 overflow-y-auto rounded-md bg-muted/20 p-3">
							<div className="space-y-3">
								{subtitleTranslation.optimizedSentences.map((subtitle, index) => (
									<div key={`subtitle-optimized-${subtitle.start}-${index}`} className="bg-card p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
										<p className="text-sm md:text-base">{subtitle.text}</p>
										{subtitle.textInterpretation && <p className="text-sm mt-2 text-primary">{subtitle.textInterpretation}</p>}
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
			) : (
				<Card className="mb-6 bg-muted/30 border-0 shadow-sm">
					<CardContent className="p-4 flex items-center gap-3">
						<div className="rounded-full bg-muted/50 p-2">
							<MonitorPlay className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">No translated sentences available. Please complete the translation step first.</p>
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
					<h3 className="text-lg font-medium mb-4">Optimize Display</h3>
					<p className="text-sm text-muted-foreground mb-4">Improve subtitle timing and formatting for better readability</p>
					<optimizationFetcher.Form method="post" action="optimize" className="flex flex-col gap-5">
						<LoadingButtonWithState type="submit" className="w-full" state={optimizationFetcher.state} idleText="Optimize Display" loadingText="Optimizing..." />
					</optimizationFetcher.Form>
				</div>

				<div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
					<h3 className="text-lg font-medium mb-4">Sync to Video Script</h3>
					<p className="text-sm text-muted-foreground mb-4">Export optimized subtitles to your video script</p>
					<Form method="post" action="sync-script" className="flex flex-col gap-5">
						<LoadingButtonWithState type="submit" className="w-full" state={syncScriptFetcher.state} idleText="Sync to Video Script" loadingText="Syncing..." />
					</Form>
				</div>
			</div>
		</div>
	)
}
