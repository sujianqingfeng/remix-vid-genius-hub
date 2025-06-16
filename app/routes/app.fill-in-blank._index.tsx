import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { desc } from 'drizzle-orm'
import { BookOpen, Calendar, FileText, Play, Plus, Target, Trash, Zap } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'

export const loader = async () => {
	const fillInBlanks = await db.query.fillInBlanks.findMany({
		orderBy: desc(schema.fillInBlanks.createdAt),
	})

	return {
		fillInBlanks,
	}
}

export default function AppFillInBlankIndexPage() {
	const { fillInBlanks } = useLoaderData<typeof loader>()
	const deleteFetcher = useFetcher()

	const totalSentences = fillInBlanks.reduce((sum, exercise) => sum + (exercise.sentences?.length || 0), 0)
	const withOutput = fillInBlanks.filter((exercise) => exercise.outputFilePath).length
	const avgFps = fillInBlanks.length > 0 ? Math.round(fillInBlanks.reduce((sum, exercise) => sum + exercise.fps, 0) / fillInBlanks.length) : 0

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Fill in Blanks" description="Create interactive fill-in-the-blank exercises with AI-powered content generation">
				<Link to="/app/fill-in-blank/create">
					<Button className="shadow-soft">
						<Plus className="h-4 w-4 mr-2" />
						Create New Exercise
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Exercises</p>
								<p className="text-3xl font-bold text-foreground">{fillInBlanks.length}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<BookOpen className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Sentences</p>
								<p className="text-3xl font-bold text-foreground">{totalSentences}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<FileText className="h-6 w-6 text-primary" />
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
								<Target className="h-6 w-6 text-success" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Avg FPS</p>
								<p className="text-3xl font-bold text-foreground">{avgFps}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Zap className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Exercises Grid */}
			{fillInBlanks.length === 0 ? (
				<Card className="border-border/50 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
								<BookOpen className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">No exercises yet</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">Create your first fill-in-the-blank exercise. Generate engaging educational content with AI.</p>
							<Link to="/app/fill-in-blank/create">
								<Button className="shadow-soft">
									<Plus className="h-4 w-4 mr-2" />
									Create Your First Exercise
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{fillInBlanks.map((exercise) => (
						<Card key={exercise.id} className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex gap-2 mb-3">
										<Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
											{exercise.sentences?.length || 0} Sentences
										</Badge>
										{exercise.outputFilePath && (
											<Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
												Rendered
											</Badge>
										)}
										<Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted">
											{exercise.fps} FPS
										</Badge>
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">Exercise {exercise.id.slice(0, 8)}</CardTitle>
								<CardDescription className="flex items-center text-sm text-muted-foreground">
									<BookOpen className="h-4 w-4 mr-1" />
									Fill-in-the-Blank Exercise
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Exercise Info */}
									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-muted/50 rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">Sentences</p>
											<p className="text-sm font-medium text-foreground">{exercise.sentences?.length || 0}</p>
										</div>
										<div className="p-3 bg-muted/50 rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">Frame Rate</p>
											<p className="text-sm font-medium text-foreground">{exercise.fps} FPS</p>
										</div>
									</div>

									{/* Job ID if exists */}
									{exercise.jobId && (
										<div className="p-3 bg-muted/50 rounded-lg">
											<p className="text-xs text-muted-foreground mb-1">Job ID</p>
											<p className="text-sm text-foreground truncate font-mono">{exercise.jobId}</p>
										</div>
									)}

									{/* Date */}
									<div className="flex items-center text-xs text-muted-foreground">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(exercise.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/fill-in-blank/${exercise.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-border hover:bg-muted">
												<Play className="h-3 w-3 mr-1" />
												View
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/fill-in-blank/${exercise.id}/delete`}>
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
