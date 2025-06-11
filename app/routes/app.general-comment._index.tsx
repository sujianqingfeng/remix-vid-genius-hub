import { PlusIcon } from '@radix-ui/react-icons'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { desc } from 'drizzle-orm'
import { Calendar, Image, Languages, MessageSquare, Play, Trash, Twitter, User, Video, Youtube } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'
import type { GeneralCommentTypeTextInfo } from '~/types'

type DeleteActionData = {
	success: boolean
	error?: string
}

export const loader = async () => {
	const comments = await db.query.generalComments.findMany({
		orderBy: desc(schema.generalComments.createdAt),
	})

	return { comments }
}

export default function AppGeneralCommentIndex() {
	const { comments } = useLoaderData<typeof loader>()
	const deleteFetcher = useFetcher<DeleteActionData>()

	const totalComments = comments.reduce((sum, comment) => sum + (comment.comments?.length || 0), 0)
	const withTranslations = comments.filter((comment) => {
		const typeInfo = comment.typeInfo as GeneralCommentTypeTextInfo
		return typeInfo.contentZh
	}).length
	const withImages = comments.filter((comment) => {
		const typeInfo = comment.typeInfo as GeneralCommentTypeTextInfo
		return typeInfo.images && typeInfo.images.length > 0
	}).length

	const handleDelete = (id: string) => {
		const formData = new FormData()
		formData.append('id', id)
		deleteFetcher.submit(formData, { method: 'post', action: 'delete' })
	}

	const getSourceIcon = (source: string) => {
		switch (source) {
			case 'twitter':
				return <Twitter className="h-4 w-4" />
			case 'youtube':
				return <Youtube className="h-4 w-4" />
			case 'tiktok':
				return <Video className="h-4 w-4" />
			default:
				return <MessageSquare className="h-4 w-4" />
		}
	}

	const getSourceStyles = (source: string): string => {
		switch (source) {
			case 'twitter':
				return 'bg-blue-100 text-blue-700 border-blue-200'
			case 'youtube':
				return 'bg-red-100 text-red-700 border-red-200'
			case 'tiktok':
				return 'bg-gray-100 text-gray-700 border-gray-200'
			default:
				return 'bg-purple-100 text-purple-700 border-purple-200'
		}
	}

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="General Comments" description="Create and manage comment-based content with AI-powered translations">
				<Link to="/app/general-comment/create">
					<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
						<PlusIcon className="h-4 w-4 mr-2" />
						New Comment
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-0 shadow-soft bg-gradient-to-br from-blue-50 to-blue-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600">Total Projects</p>
								<p className="text-3xl font-bold text-blue-900">{comments.length}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
								<MessageSquare className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-green-50 to-green-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-green-600">Total Comments</p>
								<p className="text-3xl font-bold text-green-900">{totalComments}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
								<User className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-purple-50 to-purple-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-purple-600">With Translations</p>
								<p className="text-3xl font-bold text-purple-900">{withTranslations}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
								<Languages className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-orange-50 to-orange-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-orange-600">With Images</p>
								<p className="text-3xl font-bold text-orange-900">{withImages}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
								<Image className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Comments Grid */}
			{comments.length === 0 ? (
				<Card className="border-0 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
								<MessageSquare className="h-12 w-12 text-blue-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No comments yet</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first comment project. Generate engaging content with AI assistance.</p>
							<Link to="/app/general-comment/create">
								<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
									<PlusIcon className="h-4 w-4 mr-2" />
									Create Your First Comment
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{comments.map((comment) => {
						const typeInfo = comment.typeInfo as GeneralCommentTypeTextInfo
						return (
							<Card key={comment.id} className="group border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex gap-2 mb-3">
											<Badge variant="secondary" className={getSourceStyles(comment.source)}>
												{getSourceIcon(comment.source)}
												<span className="ml-1 capitalize">{comment.source}</span>
											</Badge>
											{comment.comments && comment.comments.length > 0 && (
												<Badge variant="secondary" className="bg-green-100 text-green-700">
													{comment.comments.length} Comments
												</Badge>
											)}
											{typeInfo.contentZh && (
												<Badge variant="secondary" className="bg-purple-100 text-purple-700">
													Translated
												</Badge>
											)}
										</div>
									</div>
									<CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{typeInfo.title || 'Untitled Comment'}</CardTitle>
									<CardDescription className="flex items-center text-sm text-gray-600">
										<User className="h-4 w-4 mr-1" />
										{comment.author}
									</CardDescription>
								</CardHeader>

								<CardContent className="pt-0">
									<div className="space-y-4">
										{/* Content Preview */}
										<div className="space-y-3">
											<div className="p-3 bg-gray-50 rounded-lg">
												<div className="flex items-center space-x-2 mb-2">
													<div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
													<span className="text-xs font-medium text-gray-500">Original</span>
												</div>
												<p className="text-sm text-gray-900 line-clamp-2">{typeInfo.content}</p>
											</div>
											{typeInfo.contentZh && (
												<div className="p-3 bg-gray-50 rounded-lg">
													<div className="flex items-center space-x-2 mb-2">
														<div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
														<span className="text-xs font-medium text-gray-500">Translation</span>
													</div>
													<p className="text-sm text-gray-900 line-clamp-2">{typeInfo.contentZh}</p>
												</div>
											)}
										</div>

										{/* Images Preview */}
										{typeInfo.images && typeInfo.images.length > 0 && (
											<div className="flex gap-2 overflow-x-auto py-1">
												{typeInfo.images.slice(0, 3).map((image, index) => (
													<img key={image} src={image} alt="" className="h-12 w-12 object-cover rounded-md shadow-sm flex-shrink-0" />
												))}
												{typeInfo.images.length > 3 && (
													<div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500 flex-shrink-0">+{typeInfo.images.length - 3}</div>
												)}
											</div>
										)}

										{/* Date */}
										<div className="flex items-center text-xs text-gray-500">
											<Calendar className="h-3 w-3 mr-1" />
											{format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
										</div>

										{/* Actions */}
										<div className="flex gap-2 pt-2">
											<Link to={`/app/general-comment/${comment.id}`} className="flex-1">
												<Button variant="outline" size="sm" className="w-full h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
													<Play className="h-3 w-3 mr-1" />
													Render
												</Button>
											</Link>

											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600">
														<Trash className="h-3 w-3" />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Are you sure?</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will permanently delete the comment and all its data.
															{deleteFetcher.state === 'submitting' && <p className="mt-2 text-sm text-yellow-600">Deleting...</p>}
															{deleteFetcher.data?.error && <p className="mt-2 text-sm text-red-600">{deleteFetcher.data.error}</p>}
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction onClick={() => handleDelete(comment.id)} disabled={deleteFetcher.state === 'submitting'}>
															{deleteFetcher.state === 'submitting' ? 'Deleting...' : 'Delete'}
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}
