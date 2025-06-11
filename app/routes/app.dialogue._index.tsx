import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { desc } from 'drizzle-orm'
import { BookOpen, Calendar, FileText, MessageSquare, Play, Plus, Trash, Users, Zap } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'

export async function loader() {
	const dialogues = await db.query.dialogues.findMany({
		orderBy: desc(schema.dialogues.createdAt),
	})

	return {
		dialogues,
	}
}

export default function DialoguePage() {
	const { dialogues } = useLoaderData<typeof loader>()
	const deleteFetcher = useFetcher()

	const totalDialogues = dialogues.reduce((sum, dialogue) => sum + (dialogue.dialogues?.length || 0), 0)
	const withOutput = dialogues.filter((dialogue) => dialogue.outputFilePath).length
	const avgFps = dialogues.length > 0 ? Math.round(dialogues.reduce((sum, dialogue) => sum + dialogue.fps, 0) / dialogues.length) : 0

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Dialogues" description="Create and manage interactive dialogue exercises with AI-powered conversations">
				<Link to="/app/dialogue/new">
					<Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
						<Plus className="h-4 w-4 mr-2" />
						New Dialogue
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-0 shadow-soft bg-gradient-to-br from-indigo-50 to-indigo-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-indigo-600">Total Projects</p>
								<p className="text-3xl font-bold text-indigo-900">{dialogues.length}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center">
								<MessageSquare className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-purple-50 to-purple-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-purple-600">Total Dialogues</p>
								<p className="text-3xl font-bold text-purple-900">{totalDialogues}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
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
								<FileText className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-orange-50 to-orange-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-orange-600">Avg FPS</p>
								<p className="text-3xl font-bold text-orange-900">{avgFps}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
								<Zap className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Dialogues Grid */}
			{dialogues.length === 0 ? (
				<Card className="border-0 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
								<MessageSquare className="h-12 w-12 text-indigo-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No dialogues yet</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first dialogue exercise. Build engaging conversations with AI assistance.</p>
							<Link to="/app/dialogue/new">
								<Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
									<Plus className="h-4 w-4 mr-2" />
									Create Your First Dialogue
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{dialogues.map((dialogue) => (
						<Card key={dialogue.id} className="group border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex gap-2 mb-3">
										<Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
											{dialogue.dialogues?.length || 0} Conversations
										</Badge>
										{dialogue.outputFilePath && (
											<Badge variant="secondary" className="bg-green-100 text-green-700">
												Rendered
											</Badge>
										)}
										<Badge variant="secondary" className="bg-orange-100 text-orange-700">
											{dialogue.fps} FPS
										</Badge>
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">Dialogue {dialogue.id.slice(0, 8)}</CardTitle>
								<CardDescription className="flex items-center text-sm text-gray-600">
									<MessageSquare className="h-4 w-4 mr-1" />
									Interactive Dialogue Exercise
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Dialogue Info */}
									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Conversations</p>
											<p className="text-sm font-medium text-gray-700">{dialogue.dialogues?.length || 0}</p>
										</div>
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Frame Rate</p>
											<p className="text-sm font-medium text-gray-700">{dialogue.fps} FPS</p>
										</div>
									</div>

									{/* Job ID if exists */}
									{dialogue.jobId && (
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Job ID</p>
											<p className="text-sm text-gray-700 truncate font-mono">{dialogue.jobId}</p>
										</div>
									)}

									{/* Date */}
									<div className="flex items-center text-xs text-gray-500">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(dialogue.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/dialogue/${dialogue.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300">
												<Play className="h-3 w-3 mr-1" />
												View
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/dialogue/${dialogue.id}/delete`}>
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
