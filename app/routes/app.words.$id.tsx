import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { db, schema } from '~/lib/drizzle'
import type { WordSentence } from '~/types'

export const loader = async ({ params }: { params: { id: string } }) => {
	const { id } = params

	if (!id) {
		return redirect('/app/words')
	}

	const word = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	if (!word) {
		throw new Response('Word not found', { status: 404 })
	}

	return json({ word })
}

export default function WordDetailPage() {
	const { word } = useLoaderData<typeof loader>()
	const sentences = word.sentences as WordSentence[]

	return (
		<div className="p-8 max-w-7xl mx-auto space-y-8">
			<div className="flex items-center gap-4">
				<Link to="/app/words">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-5 w-5" />
					</Button>
				</Link>
				<h1 className="text-3xl font-bold tracking-tight">Word Details</h1>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Word Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-2">
							<div className="text-muted-foreground">ID</div>
							<div>{word.id}</div>

							<div className="text-muted-foreground">FPS</div>
							<div>{word.fps}</div>

							<div className="text-muted-foreground">Job ID</div>
							<div>{word.jobId || 'N/A'}</div>

							<div className="text-muted-foreground">Created At</div>
							<div>{format(word.createdAt, 'yyyy-MM-dd HH:mm')}</div>

							<div className="text-muted-foreground">Output File</div>
							<div className="truncate">{word.outputFilePath || 'N/A'}</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Statistics</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-2">
							<div className="text-muted-foreground">Total Sentences</div>
							<div>{sentences.length}</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Sentences</CardTitle>
				</CardHeader>
				<CardContent>
					{sentences.length === 0 ? (
						<p className="text-muted-foreground text-center py-4">No sentences available</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Word</TableHead>
									<TableHead>Word (Chinese)</TableHead>
									<TableHead>Sentence</TableHead>
									<TableHead>Sentence (Chinese)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sentences.map((sentence, index) => (
									<TableRow key={`sentence-${index}-${sentence.word}`}>
										<TableCell className="font-medium">{sentence.word}</TableCell>
										<TableCell>{sentence.wordZh}</TableCell>
										<TableCell>{sentence.sentence}</TableCell>
										<TableCell>{sentence.sentenceZh}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
