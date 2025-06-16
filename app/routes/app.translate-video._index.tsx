import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { desc } from 'drizzle-orm'
import { Calendar, Clock, ExternalLink, FileVideo, Languages, Play, Plus, Trash, User } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'

export const loader = async () => {
	const translateVideos = await db.query.translateVideos.findMany({
		orderBy: desc(schema.translateVideos.createdAt),
	})

	return {
		translateVideos,
	}
}

export default function TranslateVideoPage() {
	const { translateVideos } = useLoaderData<typeof loader>()
	const deleteFetcher = useFetcher()

	const completedVideos = translateVideos.filter((video) => video.outputFilePath).length
	const processingVideos = translateVideos.filter((video) => !video.outputFilePath && video.audioFilePath).length

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Video Translation" description="Transform your videos with AI-powered translation and dubbing">
				<Link to="/app/translate-video/create">
					<Button className="shadow-soft">
						<Plus className="h-4 w-4 mr-2" />
						Create New Video
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Videos</p>
								<p className="text-3xl font-bold text-foreground">{translateVideos.length}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<FileVideo className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Completed</p>
								<p className="text-3xl font-bold text-foreground">{completedVideos}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
								<Languages className="h-6 w-6 text-success" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Processing</p>
								<p className="text-3xl font-bold text-foreground">{processingVideos}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
								<Clock className="h-6 w-6 text-warning" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Success Rate</p>
								<p className="text-3xl font-bold text-foreground">{translateVideos.length > 0 ? Math.round((completedVideos / translateVideos.length) * 100) : 0}%</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Play className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Videos Grid */}
			{translateVideos.length === 0 ? (
				<Card className="border-border/50 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
								<Languages className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">No videos yet</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">Start by creating your first video translation. Upload a video and let AI handle the rest.</p>
							<Link to="/app/translate-video/create">
								<Button className="shadow-soft">
									<Plus className="h-4 w-4 mr-2" />
									Create Your First Video
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{translateVideos.map((video) => (
						<Card key={video.id} className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<Badge
										variant="secondary"
										className={`mb-3 ${
											video.outputFilePath
												? 'bg-success/10 text-success hover:bg-success/20'
												: video.audioFilePath
													? 'bg-warning/10 text-warning hover:bg-warning/20'
													: 'bg-muted text-muted-foreground hover:bg-muted'
										}`}
									>
										{video.outputFilePath ? 'Completed' : video.audioFilePath ? 'Processing' : 'Draft'}
									</Badge>
									<div className="flex items-center space-x-1">
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
											<a href={video.source} target="_blank" rel="noopener noreferrer">
												<ExternalLink className="h-4 w-4" />
											</a>
										</Button>
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">{video.title || `Video ${video.id}`}</CardTitle>
								<CardDescription className="flex items-center text-sm text-muted-foreground">
									<FileVideo className="h-4 w-4 mr-1" />
									Video Translation Project
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Source Preview */}
									<div className="p-3 bg-muted/50 rounded-lg">
										<p className="text-xs text-muted-foreground mb-1">Source</p>
										<p className="text-sm text-foreground truncate font-mono">{video.source}</p>
									</div>

									{/* Date */}
									<div className="flex items-center text-xs text-muted-foreground">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(video.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/translate-video/${video.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-border hover:bg-muted">
												<Languages className="h-3 w-3 mr-1" />
												Translate
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/translate-video/${video.id}/delete`}>
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
