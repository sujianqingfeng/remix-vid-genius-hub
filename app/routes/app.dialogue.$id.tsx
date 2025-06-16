import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { Player } from '@remotion/player'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import BackPrevious from '~/components/BackPrevious'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import Dialogues from '~/components/business/dialogue/Dialogues'
import { Button } from '~/components/ui/button'
import { db, schema } from '~/lib/drizzle'
import { Dialogue } from '~/remotion'
import { buildDialogueRenderData } from '~/utils/dialogue'
import { safeCopyFileToPublic } from '~/utils/file'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const where = eq(schema.dialogues.id, id)

	const dialogue = await db.query.dialogues.findFirst({
		where,
	})

	invariant(dialogue, 'dialogue not found')

	const renderInfo = buildDialogueRenderData({
		dialogues: dialogue.dialogues,
		fps: dialogue.fps,
	})

	const audioFilePaths = dialogue.dialogues.map((d) => d.audioFilePath).filter(Boolean)

	await Promise.all(
		audioFilePaths.map(async (audioFilePath) => {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			await safeCopyFileToPublic(audioFilePath!)
		}),
	)

	return { dialogue, renderInfo }
}

export default function DialoguePage() {
	const { dialogue, renderInfo } = useLoaderData<typeof loader>()

	const generateAudioFetcher = useFetcher()
	const renderFetcher = useFetcher()

	return (
		<div className="h-screen flex flex-col mx-auto w-full">
			<div className="flex-none px-4 py-3">
				<BackPrevious />
			</div>

			<div className="flex-1 grid grid-cols-1 lg:grid-cols-7 gap-4 px-4 pb-4 min-h-0">
				<div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
					<div className="bg-card rounded-lg shadow-soft p-5 flex-none border-border/50">
						<Player
							component={Dialogue}
							inputProps={{
								dialogues: renderInfo.remotionDialogues,
							}}
							durationInFrames={renderInfo.totalDurationInFrames}
							compositionWidth={renderInfo.compositionWidth}
							compositionHeight={renderInfo.compositionHeight}
							fps={dialogue.fps}
							style={{
								width: '100%',
								height: 'auto',
								aspectRatio: `${renderInfo.compositionWidth} / ${renderInfo.compositionHeight}`,
							}}
							controls
						/>
					</div>

					<div className="bg-card rounded-lg shadow-soft p-5 flex-none border-border/50">
						<div className="flex flex-wrap gap-4 items-center">
							<generateAudioFetcher.Form method="post" action="generate-audio">
								<LoadingButtonWithState state={generateAudioFetcher.state} idleText="Generate Audio" className="shadow-soft font-medium min-w-[140px]" />
							</generateAudioFetcher.Form>

							<renderFetcher.Form method="post" action="render">
								<LoadingButtonWithState state={renderFetcher.state} idleText="Render Video" className="shadow-soft font-medium min-w-[140px]" />
							</renderFetcher.Form>

							{dialogue.outputFilePath && (
								<Link to="local-download" target="_blank" rel="noopener noreferrer">
									<Button className="bg-success hover:bg-success/90 text-success-foreground font-medium min-w-[140px] shadow-soft">Download Video</Button>
								</Link>
							)}
						</div>
					</div>
				</div>

				<div className="lg:col-span-2 flex flex-col min-h-0">
					<div className="bg-card rounded-lg shadow-soft p-5 flex flex-col flex-1 min-h-0 border-border/50">
						<h2 className="text-lg font-semibold mb-4 flex-none text-foreground">Dialogues</h2>
						<div className="overflow-y-auto flex-1 -mx-5 px-5">
							<Dialogues dialogues={dialogue.dialogues} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
