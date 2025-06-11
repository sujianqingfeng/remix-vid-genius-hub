import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { format, formatDistanceToNow } from 'date-fns'
import { desc } from 'drizzle-orm'
import { Calendar, CheckCircle, Clock, Eye, FileAudio, MessageSquare, PlusCircle, Subtitles, Trash } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
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

	const withAudio = subtitleTranslations.filter((translation) => translation.audioFilePath).length
	const withSentences = subtitleTranslations.filter((translation) => translation.sentences && translation.sentences.length > 0).length
	const optimized = subtitleTranslations.filter((translation) => translation.optimizedSentences && translation.optimizedSentences.length > 0).length

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Subtitle Translations" description="Create and manage professional subtitle translations with AI assistance">
				<Link to="/app/subtitle-translations/new">
					<Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
						<PlusCircle className="h-4 w-4 mr-2" />
						New Translation
					</Button>
				</Link>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="border-0 shadow-soft bg-gradient-to-br from-green-50 to-green-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-green-600">Total Projects</p>
								<p className="text-3xl font-bold text-green-900">{subtitleTranslations.length}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
								<Subtitles className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-blue-50 to-blue-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600">With Audio</p>
								<p className="text-3xl font-bold text-blue-900">{withAudio}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
								<FileAudio className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-purple-50 to-purple-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-purple-600">With Sentences</p>
								<p className="text-3xl font-bold text-purple-900">{withSentences}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
								<MessageSquare className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-soft bg-gradient-to-br from-orange-50 to-orange-100/50">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-orange-600">Optimized</p>
								<p className="text-3xl font-bold text-orange-900">{optimized}</p>
							</div>
							<div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
								<CheckCircle className="h-6 w-6 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Translations Grid */}
			{subtitleTranslations.length === 0 ? (
				<Card className="border-0 shadow-soft">
					<CardContent className="p-12">
						<div className="text-center">
							<div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
								<Subtitles className="h-12 w-12 text-green-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No subtitle translations yet</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first subtitle translation project. Upload audio and generate professional subtitles.</p>
							<Link to="/app/subtitle-translations/new">
								<Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
									<PlusCircle className="h-4 w-4 mr-2" />
									Create Your First Project
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{subtitleTranslations.map((translation) => (
						<Card key={translation.id} className="group border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex gap-2 mb-3">
										{translation.audioFilePath && (
											<Badge variant="secondary" className="bg-blue-100 text-blue-700">
												Audio
											</Badge>
										)}
										{translation.sentences && translation.sentences.length > 0 && (
											<Badge variant="secondary" className="bg-purple-100 text-purple-700">
												{translation.sentences.length} Sentences
											</Badge>
										)}
										{translation.optimizedSentences && translation.optimizedSentences.length > 0 && (
											<Badge variant="secondary" className="bg-green-100 text-green-700">
												Optimized
											</Badge>
										)}
									</div>
								</div>
								<CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{translation.title || `Translation ${translation.id.slice(0, 8)}`}</CardTitle>
								<CardDescription className="flex items-center text-sm text-gray-600">
									<Subtitles className="h-4 w-4 mr-1" />
									Subtitle Translation Project
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="space-y-4">
									{/* Status Info */}
									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Audio Status</p>
											<p className="text-sm font-medium text-gray-700">{translation.audioFilePath ? 'Uploaded' : 'Not Uploaded'}</p>
										</div>
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-xs text-gray-500 mb-1">Sentences</p>
											<p className="text-sm font-medium text-gray-700">{translation.sentences?.length || 0}</p>
										</div>
									</div>

									{/* Date */}
									<div className="flex items-center text-xs text-gray-500">
										<Calendar className="h-3 w-3 mr-1" />
										{format(new Date(translation.createdAt), 'MMM dd, yyyy HH:mm')}
									</div>

									{/* Time ago */}
									<div className="flex items-center text-xs text-gray-500">
										<Clock className="h-3 w-3 mr-1" />
										{formatDistanceToNow(new Date(translation.createdAt), { addSuffix: true })}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Link to={`/app/subtitle-translations/${translation.id}`} className="flex-1">
											<Button variant="outline" size="sm" className="w-full h-8 text-xs border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300">
												<Eye className="h-3 w-3 mr-1" />
												View
											</Button>
										</Link>

										<deleteFetcher.Form method="post" action={`/app/subtitle-translations/${translation.id}/delete`}>
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
