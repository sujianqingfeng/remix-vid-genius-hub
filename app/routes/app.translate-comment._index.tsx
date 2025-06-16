import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { desc } from 'drizzle-orm'
import { Calendar, Download, FileVideo, MessageSquare, Play, Plus, Target, Trash, Users } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'

export const loader = async () => {
	const translateComments = await db.query.translateComments.findMany({
		orderBy: desc(schema.translateComments.createdAt),
	})

	return {
		translateComments,
	}
}

export default function TranslateCommentPage() {
	const { translateComments } = useLoaderData<typeof loader>()
	const deleteFetcher = useFetcher()

	const totalComments = translateComments.reduce((sum, project) => sum + (project.comments?.length || 0), 0)
	const withOutput = translateComments.filter((project) => project.outputFilePath).length
	const avgDuration = translateComments.length > 0 ? Math.round(translateComments.reduce((sum, project) => sum + project.coverDurationInSeconds, 0) / translateComments.length) : 0

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Comment Translation" description="Transform social media comments into engaging video content with AI translation">
				<Link to="/app/translate-comment/new">
					<Button className="shadow-soft">
						<Plus className="h-4 w-4 mr-2" />
						New Comment Project
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
								<p className="text-3xl font-bold text-foreground">{translateComments.length}</p>
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
								<p className="text-sm font-medium text-muted-foreground">Total Comments</p>
								<p className="text-3xl font-bold text-foreground">{totalComments}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Users className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Rendered</p>
								<p className="text-3xl font-bold text-foreground">{withOutput}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
								<FileVideo className="h-6 w-6 text-success" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
								<p className="text-3xl font-bold text-foreground">{avgDuration}s</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Target className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Projects Grid */}
			{translateComments.length === 0 ? (
				<Card className="border-border/50 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
								<MessageSquare className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">No comment projects yet</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">Create your first comment translation project. Turn social media comments into engaging videos.</p>
							<Link to="/app/translate-comment/new">
								<Button className="shadow-soft">
									<Plus className="h-4 w-4 mr-2" />
									Create Your First Project
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{translateComments.map((project) => (
						<Card key={project.id} className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex gap-2 mb-3">
										<Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
											{project.comments?.length || 0} Comments
										</Badge>
										{project.outputFilePath && (
											<Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
												Rendered
											</Badge>
										)}
										<Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted">
											{project.mode}
										</Badge>
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
									{project.translatedTitle || `Comment Project ${project.id.slice(0, 8)}`}
								</CardTitle>
								<CardDescription className="flex items-center text-sm text-muted-foreground">
									<MessageSquare className="h-4 w-4 mr-1" />
									Comment Translation Project
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Project Info */}
									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-muted/50 rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">Comments</p>
											<p className="text-sm font-medium text-foreground">{project.comments?.length || 0}</p>
										</div>
										<div className="p-3 bg-muted/50 rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">Duration</p>
											<p className="text-sm font-medium text-foreground">{project.coverDurationInSeconds}s</p>
										</div>
									</div>

									{/* Download Info */}
									<div className="p-3 bg-muted/50 rounded-lg">
										<p className="text-xs text-muted-foreground mb-1">Download ID</p>
										<p className="text-sm text-foreground truncate font-mono">{project.downloadId}</p>
									</div>

									{/* Job ID if exists */}
									{project.jobId && (
										<div className="p-3 bg-muted/50 rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">Job ID</p>
											<p className="text-sm text-foreground truncate font-mono">{project.jobId}</p>
										</div>
									)}

									{/* Date */}
									<div className="flex items-center text-xs text-muted-foreground">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(project.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/translate-comment/${project.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-border hover:bg-muted">
												<Play className="h-3 w-3 mr-1" />
												View
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/translate-comment/${project.id}/delete`}>
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
