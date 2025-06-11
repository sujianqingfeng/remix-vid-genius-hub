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
					<Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
						<Plus className="h-4 w-4 mr-2" />
						New Comment Project
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-0 shadow-soft bg-gradient-to-br from-pink-50 to-pink-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-pink-600">Total Projects</p>
								<p className="text-3xl font-bold text-pink-900">{translateComments.length}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-pink-500 flex items-center justify-center">
								<MessageSquare className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-blue-50 to-blue-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600">Total Comments</p>
								<p className="text-3xl font-bold text-blue-900">{totalComments}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
								<Users className="h-6 w-6 text-white" />
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
								<FileVideo className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-orange-50 to-orange-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-orange-600">Avg Duration</p>
								<p className="text-3xl font-bold text-orange-900">{avgDuration}s</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
								<Target className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Projects Grid */}
			{translateComments.length === 0 ? (
				<Card className="border-0 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
								<MessageSquare className="h-12 w-12 text-pink-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No comment projects yet</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first comment translation project. Turn social media comments into engaging videos.</p>
							<Link to="/app/translate-comment/new">
								<Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white">
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
						<Card key={project.id} className="group border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex gap-2 mb-3">
										<Badge variant="secondary" className="bg-pink-100 text-pink-700">
											{project.comments?.length || 0} Comments
										</Badge>
										{project.outputFilePath && (
											<Badge variant="secondary" className="bg-green-100 text-green-700">
												Rendered
											</Badge>
										)}
										<Badge variant="secondary" className="bg-blue-100 text-blue-700">
											{project.mode}
										</Badge>
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
									{project.translatedTitle || `Comment Project ${project.id.slice(0, 8)}`}
								</CardTitle>
								<CardDescription className="flex items-center text-sm text-gray-600">
									<MessageSquare className="h-4 w-4 mr-1" />
									Comment Translation Project
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Project Info */}
									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Comments</p>
											<p className="text-sm font-medium text-gray-700">{project.comments?.length || 0}</p>
										</div>
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Duration</p>
											<p className="text-sm font-medium text-gray-700">{project.coverDurationInSeconds}s</p>
										</div>
									</div>

									{/* Download Info */}
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-xs text-gray-500 mb-1">Download ID</p>
										<p className="text-sm text-gray-700 truncate font-mono">{project.downloadId}</p>
									</div>

									{/* Job ID if exists */}
									{project.jobId && (
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Job ID</p>
											<p className="text-sm text-gray-700 truncate font-mono">{project.jobId}</p>
										</div>
									)}

									{/* Date */}
									<div className="flex items-center text-xs text-gray-500">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(project.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/translate-comment/${project.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300">
												<Play className="h-3 w-3 mr-1" />
												View
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/translate-comment/${project.id}/delete`}>
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
