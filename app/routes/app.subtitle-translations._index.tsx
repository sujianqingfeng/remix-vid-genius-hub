import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { format, formatDistanceToNow } from 'date-fns'
import { desc } from 'drizzle-orm'
import { Calendar, CheckCircle, Clock, Eye, FileAudio, MessageSquare, PlusCircle, Subtitles, Trash } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'

export const loader = async () => {
	const subtitleTranslations = await db.query.subtitleTranslations.findMany({
		orderBy: desc(schema.subtitleTranslations.createdAt),
	})

	return {
		subtitleTranslations,
	}
}

export default function SubtitleTranslationsPages() {
	const { subtitleTranslations } = useLoaderData<typeof loader>()
	const deleteFetcher = useFetcher()

	const withAudio = subtitleTranslations.filter((translation) => translation.audioFilePath).length
	const withSentences = subtitleTranslations.filter((translation) => translation.sentences && translation.sentences.length > 0).length
	const optimized = subtitleTranslations.filter((translation) => translation.optimizedSentences && translation.optimizedSentences.length > 0).length

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Subtitle Translations" description="Create and manage professional subtitle translations with AI assistance">
				<Link to="/app/subtitle-translations/new">
					<Button className="shadow-soft">
						<PlusCircle className="h-4 w-4 mr-2" />
						New Translation
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Projects</p>
								<p className="text-3xl font-bold text-foreground">{subtitleTranslations.length}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Subtitles className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">With Audio</p>
								<p className="text-3xl font-bold text-foreground">{withAudio}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<FileAudio className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">With Sentences</p>
								<p className="text-3xl font-bold text-foreground">{withSentences}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<MessageSquare className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Optimized</p>
								<p className="text-3xl font-bold text-foreground">{optimized}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
								<CheckCircle className="h-6 w-6 text-success" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Translations Grid */}
			{subtitleTranslations.length === 0 ? (
				<Card className="border-border/50 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
								<Subtitles className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">No subtitle translations yet</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">Create your first subtitle translation project. Upload audio and generate professional subtitles.</p>
							<Link to="/app/subtitle-translations/new">
								<Button className="shadow-soft">
									<PlusCircle className="h-4 w-4 mr-2" />
									Create Your First Project
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{subtitleTranslations.map((translation) => (
						<Card
							key={translation.id}
							className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex gap-2 mb-3">
										{translation.audioFilePath && (
											<Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
												Audio
											</Badge>
										)}
										{translation.sentences && translation.sentences.length > 0 && (
											<Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
												{translation.sentences.length} Sentences
											</Badge>
										)}
										{translation.optimizedSentences && translation.optimizedSentences.length > 0 && (
											<Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
												Optimized
											</Badge>
										)}
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
									{translation.title || `Translation ${translation.id.slice(0, 8)}`}
								</CardTitle>
								<CardDescription className="flex items-center text-sm text-muted-foreground">
									<Subtitles className="h-4 w-4 mr-1" />
									Subtitle Translation Project
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Status Info */}
									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-muted/50 rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">Audio Status</p>
											<p className="text-sm font-medium text-foreground">{translation.audioFilePath ? 'Uploaded' : 'Not Uploaded'}</p>
										</div>
										<div className="p-3 bg-muted/50 rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">Sentences</p>
											<p className="text-sm font-medium text-foreground">{translation.sentences?.length || 0}</p>
										</div>
									</div>

									{/* Date */}
									<div className="flex items-center text-xs text-muted-foreground">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(translation.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Time ago */}
									<div className="flex items-center text-xs text-muted-foreground">
										<Clock className="h-3 w-3 mr-1" />
										{formatDistanceToNow(new Date(translation.createdAt), { addSuffix: true })}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/subtitle-translations/${translation.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-border hover:bg-muted">
												<Eye className="h-3 w-3 mr-1" />
												View
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/subtitle-translations/${translation.id}/delete`}>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive">
												<Trash className="h-3 w-3" />
											</Button>
										</deleteFetcher.Form>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
