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
				return 'bg-primary/10 text-primary border-primary/20'
			case 'youtube':
				return 'bg-destructive/10 text-destructive border-destructive/20'
			case 'tiktok':
				return 'bg-muted text-muted-foreground border-border'
			default:
				return 'bg-primary/10 text-primary border-primary/20'
		}
	}

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="General Comments" description="Create and manage comment-based content with AI-powered translations">
				<Link to="/app/general-comment/create">
					<Button className="shadow-soft">
						<PlusIcon className="h-4 w-4 mr-2" />
						New Comment
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
								<p className="text-3xl font-bold text-foreground">{comments.length}</p>
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
								<User className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">With Translations</p>
								<p className="text-3xl font-bold text-foreground">{withTranslations}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Languages className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">With Images</p>
								<p className="text-3xl font-bold text-foreground">{withImages}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Image className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Comments Grid */}
			{comments.length === 0 ? (
				<Card className="border-border/50 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
								<MessageSquare className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">No comments yet</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">Create your first comment project. Generate engaging content with AI assistance.</p>
							<Link to="/app/general-comment/create">
								<Button className="shadow-soft">
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
							<Card
								key={comment.id}
								className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
							>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex gap-2 mb-3">
											<Badge variant="secondary" className={getSourceStyles(comment.source)}>
												{getSourceIcon(comment.source)}
												<span className="ml-1 capitalize">{comment.source}</span>
											</Badge>
											{comment.comments && comment.comments.length > 0 && (
												<Badge variant="secondary" className="bg-success/10 text-success">
													{comment.comments.length} Comments
												</Badge>
											)}
											{typeInfo.contentZh && (
												<Badge variant="secondary" className="bg-primary/10 text-primary">
													Translated
												</Badge>
											)}
										</div>
									</div>
									<CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">{typeInfo.title || 'Untitled Comment'}</CardTitle>
									<CardDescription className="flex items-center text-sm text-muted-foreground">
										<User className="h-4 w-4 mr-1" />
										{comment.author}
									</CardDescription>
								</CardHeader>

								<CardContent className="pt-0">
									<div className="space-y-4">
										{/* Content Preview */}
										<div className="space-y-3">
											<div className="p-3 bg-muted/50 rounded-lg">
												<div className="flex items-center space-x-2 mb-2">
													<div className="h-1.5 w-1.5 rounded-full bg-primary" />
													<span className="text-xs font-medium text-muted-foreground">Original</span>
												</div>
												<p className="text-sm text-foreground line-clamp-2">{typeInfo.content}</p>
											</div>
											{typeInfo.contentZh && (
												<div className="p-3 bg-muted/50 rounded-lg">
													<div className="flex items-center space-x-2 mb-2">
														<div className="h-1.5 w-1.5 rounded-full bg-success" />
														<span className="text-xs font-medium text-muted-foreground">Translation</span>
													</div>
													<p className="text-sm text-foreground line-clamp-2">{typeInfo.contentZh}</p>
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
													<div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
														+{typeInfo.images.length - 3}
													</div>
												)}
											</div>
										)}

										{/* Date */}
										<div className="flex items-center text-xs text-muted-foreground">
											<Calendar className="h-3 w-3 mr-1" />
											{format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
										</div>

										{/* Actions */}
										<div className="flex gap-2 pt-2">
											<Link to={`/app/general-comment/${comment.id}`} className="flex-1">
												<Button variant="outline" size="sm" className="w-full h-8 text-xs shadow-soft">
													<Play className="h-3 w-3 mr-1" />
													Render
												</Button>
											</Link>

											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive">
														<Trash className="h-3 w-3" />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Are you sure?</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will permanently delete the comment and all its data.
															{deleteFetcher.state === 'submitting' && <p className="mt-2 text-sm text-warning">Deleting...</p>}
															{deleteFetcher.data?.error && <p className="mt-2 text-sm text-destructive">{deleteFetcher.data.error}</p>}
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
