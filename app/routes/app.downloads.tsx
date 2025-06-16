import { Form, useFetcher, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { desc } from 'drizzle-orm'
import { Calendar, Download, ExternalLink, InboxIcon, Languages, MessageSquare, Plus, Trash, User } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import NewDownloadDialog from '~/components/business/download/CreateNewDownloadDialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'

export const loader = async () => {
	const ds = await db.query.downloads.findMany({
		orderBy: desc(schema.downloads.createdAt),
	})

	return {
		downloads: ds,
	}
}

export default function DownloadsPages() {
	const { downloads } = useLoaderData<typeof loader>()
	const deleteFetcher = useFetcher()
	const downloadFetcher = useFetcher()

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Downloads" description="Manage your downloaded content and start processing">
				<NewDownloadDialog />
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
								<p className="text-3xl font-bold text-foreground">{downloads.length}</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Download className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Ready to Process</p>
								<p className="text-3xl font-bold text-foreground">{downloads.length}</p>
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
								<p className="text-sm font-medium text-muted-foreground">Processing Queue</p>
								<p className="text-3xl font-bold text-foreground">0</p>
							</div>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<MessageSquare className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Downloads Grid */}
			{downloads.length === 0 ? (
				<Card className="border-border/50 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
								<InboxIcon className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">No downloads yet</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">Start by adding your first download. You can process videos, extract content, and create translations.</p>
							<NewDownloadDialog />
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{downloads.map((download) => (
						<Card key={download.id} className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<Badge variant="secondary" className="mb-3 bg-primary/10 text-primary hover:bg-primary/20">
										{download.type}
									</Badge>
									<div className="flex items-center space-x-1">
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
											<a href={download.link} target="_blank" rel="noopener noreferrer">
												<ExternalLink className="h-4 w-4" />
											</a>
										</Button>
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">{download.title || 'Untitled'}</CardTitle>
								<CardDescription className="flex items-center text-sm text-muted-foreground">
									<User className="h-4 w-4 mr-1" />
									{download.author || 'Unknown Author'}
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* URL Preview */}
									<div className="p-3 bg-muted/50 rounded-lg">
										<p className="text-xs text-muted-foreground mb-1">Source URL</p>
										<p className="text-sm text-foreground truncate font-mono">{download.link}</p>
									</div>

									{/* Date */}
									<div className="flex items-center text-xs text-muted-foreground">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(download.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Actions */}
									<div className="flex flex-wrap gap-2 pt-2">
										<downloadFetcher.Form method="post" action="/app/downloads/download-info" className="flex-1">
											<input type="hidden" name="id" value={download.id} />
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-border hover:bg-muted">
												<Download className="h-3 w-3 mr-1" />
												Download
											</Button>
										</downloadFetcher.Form>

										<Form method="post" action={`/app/downloads/create-translate-video/${download.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-border hover:bg-muted">
												<Languages className="h-3 w-3 mr-1" />
												Translate
											</Button>
										</Form>

										<Form method="post" action={`/app/downloads/create-translate-comment/${download.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-border hover:bg-muted">
												<MessageSquare className="h-3 w-3 mr-1" />
												Comments
											</Button>
										</Form>

										<deleteFetcher.Form method="post" action={`/app/downloads/delete/${download.id}`}>
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
