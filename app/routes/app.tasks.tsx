import { Form, Link, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { AlertTriangle, Calendar, CheckCircle, Clock, Download, FileVideo, Pause, Play, RotateCcw, Search, Zap } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { db } from '~/lib/drizzle'
import { taskStatus } from '~/utils/remote-render'

export const loader = async () => {
	const tasks = await db.query.tasks.findMany()

	const tasksWithStatus = await Promise.all(
		tasks.map(async (task) => {
			const status = await taskStatus(task.jobId)

			return {
				...task,
				status: status.state,
				progress: status.progress,
			}
		}),
	)

	return {
		tasks: tasksWithStatus,
	}
}

export default function TasksPage() {
	const { tasks } = useLoaderData<typeof loader>()

	const completedTasks = tasks.filter((task) => task.status === 'completed').length
	const processingTasks = tasks.filter((task) => task.status === 'processing').length
	const queuedTasks = tasks.filter((task) => task.status === 'queued').length
	const failedTasks = tasks.filter((task) => task.status === 'error').length

	// Render status badge
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'completed':
				return (
					<Badge className="bg-green-100 text-green-800 border-green-200">
						<CheckCircle className="h-3 w-3 mr-1" /> Completed
					</Badge>
				)
			case 'processing':
				return (
					<Badge className="bg-orange-100 text-orange-800 border-orange-200">
						<Play className="h-3 w-3 mr-1" /> Processing
					</Badge>
				)
			case 'queued':
				return (
					<Badge className="bg-blue-100 text-blue-800 border-blue-200">
						<Clock className="h-3 w-3 mr-1" /> Queued
					</Badge>
				)
			case 'error':
				return (
					<Badge className="bg-red-100 text-red-800 border-red-200">
						<AlertTriangle className="h-3 w-3 mr-1" /> Failed
					</Badge>
				)
			default:
				return (
					<Badge variant="outline">
						<Pause className="h-3 w-3 mr-1" /> {status || 'Unknown'}
					</Badge>
				)
		}
	}

	// Format date display
	const formatDate = (timestamp: Date | number | string) => {
		const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
		return format(date, 'MMM dd, yyyy HH:mm')
	}

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Task Management" description="Monitor and manage your video rendering and processing tasks">
				<Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
					<RotateCcw className="h-4 w-4 mr-2" />
					Refresh
				</Button>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-0 shadow-soft bg-gradient-to-br from-blue-50 to-blue-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600">Total Tasks</p>
								<p className="text-3xl font-bold text-blue-900">{tasks.length}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
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
								<p className="text-3xl font-bold text-green-900">{completedTasks}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
								<CheckCircle className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-orange-50 to-orange-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-orange-600">Processing</p>
								<p className="text-3xl font-bold text-orange-900">{processingTasks}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
								<Zap className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-red-50 to-red-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-red-600">Failed</p>
								<p className="text-3xl font-bold text-red-900">{failedTasks}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-red-500 flex items-center justify-center">
								<AlertTriangle className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tasks Grid */}
			{tasks.length === 0 ? (
				<Card className="border-0 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
								<Search className="h-12 w-12 text-blue-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks available</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">Tasks will appear here when you create videos, translations, or other processing jobs.</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{tasks.map((task) => (
						<Card key={task.id} className="group border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">{renderStatusBadge(task.status)}</div>
								<CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
									{task.type.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
								</CardTitle>
								<CardDescription className="text-sm text-gray-600 line-clamp-2">{task.desc || 'Processing task'}</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Progress */}
									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-600">Progress</span>
											<span className="font-medium text-gray-900">{task.progress || 0}%</span>
										</div>
										<Progress value={Number(task.progress) || 0} className="h-2" />
									</div>

									{/* Job ID */}
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-xs text-gray-500 mb-1">Job ID</p>
										<p className="text-sm text-gray-700 truncate font-mono">{task.jobId}</p>
									</div>

									{/* Date */}
									<div className="flex items-center text-xs text-gray-500">
										<Calendar className="h-3 w-3 mr-1" />
										{formatDate(task.createdAt)}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										{task.status === 'completed' && (
											<Link to={`/app/tasks/download/${task.id}`} target="_blank" rel="noopener noreferrer" className="flex-1">
												<Button variant="outline" size="sm" className="w-full h-8 text-xs border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300">
													<Download className="h-3 w-3 mr-1" />
													Download
												</Button>
											</Link>
										)}
										{task.status === 'processing' && (
											<div className="flex-1">
												<Button variant="outline" size="sm" disabled className="w-full h-8 text-xs">
													<RotateCcw className="h-3 w-3 mr-1 animate-spin" />
													Processing...
												</Button>
											</div>
										)}
										{task.status === 'error' && (
											<div className="flex-1">
												<Button variant="outline" size="sm" className="w-full h-8 text-xs border-red-200 text-red-600 hover:bg-red-50">
													<AlertTriangle className="h-3 w-3 mr-1" />
													Retry
												</Button>
											</div>
										)}
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
