import path from 'node:path'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { Languages } from 'lucide-react'
import invariant from 'tiny-invariant'
import BackPrevious from '~/components/BackPrevious'
import Transcripts from '~/components/business/translate-video/Transcripts'
import VideoPlayer from '~/components/business/translate-video/VideoPlayer'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'
import { safeCopyFileToPublic } from '~/utils/file'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const translateVideo = await db.query.translateVideos.findFirst({
		where: eq(schema.translateVideos.id, id),
	})
	invariant(translateVideo, 'translateVideo not found')

	const { outputFilePath } = translateVideo

	let playFile = ''

	if (outputFilePath) {
		await safeCopyFileToPublic(outputFilePath)
		playFile = path.basename(outputFilePath)
	}

	return {
		translateVideo,
		playFile,
	}
}

export default function TranslateVideoPage() {
	const { translateVideo, playFile } = useLoaderData<typeof loader>()

	return (
		<div className="container mx-auto py-8 px-4">
			<BackPrevious />
			<div className="flex flex-col lg:flex-row gap-8 mt-6">
				<div className="flex-1 lg:flex-[2] space-y-8">
					<Card className="group transition-all duration-300 hover:shadow-lg">
						<CardContent className="p-0 overflow-hidden rounded-lg">
							<VideoPlayer playFile={playFile} transcripts={translateVideo.transcripts ?? []} />
						</CardContent>
					</Card>

					<Card className="group transition-all duration-300 hover:shadow-lg">ff</Card>
				</div>

				<div className="w-full lg:w-[400px] lg:flex-1">
					<Card className="sticky top-4 group transition-all duration-300 hover:shadow-lg">
						<CardHeader className="sticky top-0 bg-card z-10">
							<CardTitle className="flex items-center gap-2">
								<Languages className="w-5 h-5 text-muted-foreground" />
								Transcripts
							</CardTitle>
						</CardHeader>
						<CardContent className="max-h-[calc(100vh-180px)] overflow-y-auto px-4 -mx-2">
							<Transcripts transcripts={translateVideo?.transcripts ?? []} />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
