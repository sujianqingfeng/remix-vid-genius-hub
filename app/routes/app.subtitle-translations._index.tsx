import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { desc } from 'drizzle-orm'
import { PlusCircle } from 'lucide-react'
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
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { db, schema } from '~/lib/drizzle'

export const loader = async () => {
	const subtitleTranslations = await db.query.subtitleTranslations.findMany({
		orderBy: desc(schema.subtitleTranslations.createdAt),
	})

	return {
		subtitleTranslations,
	}
}

export default function SubtitleTranslationsPages() {
	const { subtitleTranslations } = useLoaderData<typeof loader>()

	const deleteFetcher = useFetcher()

	return (
		<div className="container py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Subtitle Translations</h1>
				<Button asChild>
					<Link to="/app/subtitle-translations/new">
						<PlusCircle className="mr-2 h-4 w-4" />
						New Translation
					</Link>
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Audio</TableHead>
						<TableHead>Sentences</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{subtitleTranslations.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
								No data available
							</TableCell>
						</TableRow>
					) : (
						subtitleTranslations.map((translation) => (
							<TableRow key={translation.id}>
								<TableCell className="font-medium">{translation.title}</TableCell>
								<TableCell>{formatDistanceToNow(new Date(translation.createdAt), { addSuffix: true })}</TableCell>
								<TableCell>{translation.audioFilePath ? 'Uploaded' : 'Not Uploaded'}</TableCell>
								<TableCell>{translation.sentences?.length || 0}</TableCell>
								<TableCell className="text-right space-x-2">
									<Button variant="outline" size="sm" asChild>
										<Link to={`/app/subtitle-translations/${translation.id}`}>View</Link>
									</Button>
									<deleteFetcher.Form method="post" action={`/app/subtitle-translations/${translation.id}/delete`} style={{ display: 'inline' }}>
										<Button variant="destructive" size="sm" type="submit">
											Delete
										</Button>
									</deleteFetcher.Form>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	)
}
