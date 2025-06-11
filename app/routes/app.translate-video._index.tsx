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
					<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
						<Plus className="h-4 w-4 mr-2" />
						Create New Video
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-0 shadow-soft bg-gradient-to-br from-purple-50 to-purple-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-purple-600">Total Videos</p>
								<p className="text-3xl font-bold text-purple-900">{translateVideos.length}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
								<FileVideo className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-green-50 to-green-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-green-600">Completed</p>
								<p className="text-3xl font-bold text-green-900">{completedVideos}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
								<Languages className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-orange-50 to-orange-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-orange-600">Processing</p>
								<p className="text-3xl font-bold text-orange-900">{processingVideos}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
								<Clock className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-blue-50 to-blue-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600">Success Rate</p>
								<p className="text-3xl font-bold text-blue-900">{translateVideos.length > 0 ? Math.round((completedVideos / translateVideos.length) * 100) : 0}%</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
								<Play className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Videos Grid */}
			{translateVideos.length === 0 ? (
				<Card className="border-0 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
								<Languages className="h-12 w-12 text-purple-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">Start by creating your first video translation. Upload a video and let AI handle the rest.</p>
							<Link to="/app/translate-video/create">
								<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
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
						<Card key={video.id} className="group border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<Badge
										variant="secondary"
										className={`mb-3 ${video.outputFilePath ? 'bg-green-100 text-green-700' : video.audioFilePath ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}
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
								<CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{video.title || `Video ${video.id}`}</CardTitle>
								<CardDescription className="flex items-center text-sm text-gray-600">
									<FileVideo className="h-4 w-4 mr-1" />
									Video Translation Project
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Source Preview */}
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-xs text-gray-500 mb-1">Source</p>
										<p className="text-sm text-gray-700 truncate font-mono">{video.source}</p>
									</div>

									{/* Date */}
									<div className="flex items-center text-xs text-gray-500">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(video.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/translate-video/${video.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300">
												<Languages className="h-3 w-3 mr-1" />
												Translate
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/translate-video/${video.id}/delete`}>
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
