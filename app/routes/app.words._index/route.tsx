import { json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { format } from 'date-fns'
import { desc, eq, sql } from 'drizzle-orm'
import { BookOpen, ChevronLeft, ChevronRight, Plus, Trash } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { db, schema } from '~/lib/drizzle'
import type { WordSentence } from '~/types'

// Number of items per page
const ITEMS_PER_PAGE = 10

export const loader = async ({ request }: { request: Request }) => {
	const url = new URL(request.url)
	const page = Number.parseInt(url.searchParams.get('page') || '1')
	const currentPage = Number.isNaN(page) || page < 1 ? 1 : page

	// Get total count for pagination
	const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(schema.words)

	const totalCount = totalCountResult[0]?.count || 0
	const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

	// Get paginated results
	const words = await db.query.words.findMany({
		orderBy: desc(schema.words.createdAt),
		limit: ITEMS_PER_PAGE,
		offset: (currentPage - 1) * ITEMS_PER_PAGE,
	})

	return json({
		words,
		pagination: {
			currentPage,
			totalPages,
			totalCount,
		},
	})
}

export default function AppWordsIndexPage() {
	const { words, pagination } = useLoaderData<typeof loader>()
	const [searchParams] = useSearchParams()
	const currentPage = pagination.currentPage
	const deleteFetcher = useFetcher()

	// Helper function to generate pagination URL
	const getPaginationUrl = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', page.toString())
		return `?${params.toString()}`
	}

	return (
		<div className="p-8 max-w-7xl mx-auto space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Words</h1>
					<p className="text-muted-foreground mt-1">Manage your word sentences collection</p>
				</div>
				<Link to="/app/words/create">
					<Button size="lg" className="gap-2">
						<Plus className="w-5 h-5" />
						<span>Create New</span>
					</Button>
				</Link>
			</div>

			<div className="border rounded-lg overflow-hidden">
				<Table>
					<TableCaption>
						{words.length === 0 ? (
							<div className="py-12 text-center">
								<p className="text-muted-foreground">No words created yet</p>
								<Link to="/app/words/create" className="mt-4 inline-block">
									<Button variant="outline" size="sm" className="gap-2">
										<Plus className="w-4 h-4" />
										<span>Create your first word entry</span>
									</Button>
								</Link>
							</div>
						) : (
							`Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1} to ${Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalCount)} of ${pagination.totalCount} entries`
						)}
					</TableCaption>
					{words.length > 0 && (
						<>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[20%]">ID</TableHead>
									<TableHead className="w-[15%]">Sentences</TableHead>
									<TableHead className="w-[15%]">FPS</TableHead>
									<TableHead className="w-[20%]">Created At</TableHead>
									<TableHead className="text-right w-[30%]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{words.map((word) => (
									<TableRow key={word.id}>
										<TableCell className="font-medium">{word.id}</TableCell>
										<TableCell>{(word.sentences as WordSentence[]).length}</TableCell>
										<TableCell>{word.fps}</TableCell>
										<TableCell>{format(word.createdAt, 'yyyy-MM-dd HH:mm')}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Link to={`/app/words/${word.id}`}>
													<Button variant="outline" size="sm" className="gap-2">
														<BookOpen className="w-4 h-4" />
														<span>View</span>
													</Button>
												</Link>
												<deleteFetcher.Form method="post" action={`/app/words/${word.id}/delete`}>
													<Button variant="outline" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive gap-2" type="submit">
														<Trash className="w-4 h-4" />
														<span>Delete</span>
													</Button>
												</deleteFetcher.Form>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</>
					)}
				</Table>
			</div>

			{/* Pagination controls */}
			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 py-4">
					<Link to={getPaginationUrl(Math.max(1, currentPage - 1))} className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}>
						<Button variant="outline" size="icon">
							<ChevronLeft className="h-4 w-4" />
						</Button>
					</Link>

					<div className="text-sm">
						Page {currentPage} of {pagination.totalPages}
					</div>

					<Link
						to={getPaginationUrl(Math.min(pagination.totalPages, currentPage + 1))}
						className={`${currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}`}
					>
						<Button variant="outline" size="icon">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			)}
		</div>
	)
}
