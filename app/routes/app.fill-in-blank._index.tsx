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
					<Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
						<Plus className="h-4 w-4 mr-2" />
						Create New Exercise
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-0 shadow-soft bg-gradient-to-br from-orange-50 to-orange-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-orange-600">Total Exercises</p>
								<p className="text-3xl font-bold text-orange-900">{fillInBlanks.length}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
								<BookOpen className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-blue-50 to-blue-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600">Total Sentences</p>
								<p className="text-3xl font-bold text-blue-900">{totalSentences}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
								<FileText className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-green-50 to-green-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-green-600">Rendered</p>
								<p className="text-3xl font-bold text-green-900">{withOutput}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
								<Target className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-purple-50 to-purple-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-purple-600">Avg FPS</p>
								<p className="text-3xl font-bold text-purple-900">{avgFps}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
								<Zap className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Exercises Grid */}
			{fillInBlanks.length === 0 ? (
				<Card className="border-0 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
								<BookOpen className="h-12 w-12 text-orange-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No exercises yet</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first fill-in-the-blank exercise. Generate engaging educational content with AI.</p>
							<Link to="/app/fill-in-blank/create">
								<Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
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
						<Card key={exercise.id} className="group border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex gap-2 mb-3">
										<Badge variant="secondary" className="bg-orange-100 text-orange-700">
											{exercise.sentences?.length || 0} Sentences
										</Badge>
										{exercise.outputFilePath && (
											<Badge variant="secondary" className="bg-green-100 text-green-700">
												Rendered
											</Badge>
										)}
										<Badge variant="secondary" className="bg-purple-100 text-purple-700">
											{exercise.fps} FPS
										</Badge>
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">Exercise {exercise.id.slice(0, 8)}</CardTitle>
								<CardDescription className="flex items-center text-sm text-gray-600">
									<BookOpen className="h-4 w-4 mr-1" />
									Fill-in-the-Blank Exercise
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Exercise Info */}
									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Sentences</p>
											<p className="text-sm font-medium text-gray-700">{exercise.sentences?.length || 0}</p>
										</div>
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Frame Rate</p>
											<p className="text-sm font-medium text-gray-700">{exercise.fps} FPS</p>
										</div>
									</div>

									{/* Job ID if exists */}
									{exercise.jobId && (
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Job ID</p>
											<p className="text-sm text-gray-700 truncate font-mono">{exercise.jobId}</p>
										</div>
									)}

									{/* Date */}
									<div className="flex items-center text-xs text-gray-500">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(exercise.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/fill-in-blank/${exercise.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300">
												<Play className="h-3 w-3 mr-1" />
												View
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/fill-in-blank/${exercise.id}/delete`}>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600">
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
