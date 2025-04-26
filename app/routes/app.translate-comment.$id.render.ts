import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { PUBLIC_DIR } from '~/constants'
import { db, schema } from '~/lib/drizzle'
import { webpackOverride } from '~/remotion/webpack-override'
import { execCommand } from '~/utils/exec'
import { createOperationDir } from '~/utils/file'
import { bundleOnProgress, throttleRenderOnProgress } from '~/utils/remotion'
import { buildTranslateCommentRemotionRenderData } from '~/utils/translate-comment'
import { getTranslateCommentAndDownloadInfo } from '~/utils/translate-comment.server'

const entryPoint = path.join(process.cwd(), 'app', 'remotion', 'translate-comments', 'index.ts')

export const action = async ({ params }: ActionFunctionArgs) => {
	const id = params.id
	invariant(id, 'id is required')

	const { translateComment, download } = await getTranslateCommentAndDownloadInfo(id)
	const fps = translateComment.fps

	const render = await buildTranslateCommentRemotionRenderData({
		mode: translateComment.mode,
		fps,
		secondsForEvery30Words: translateComment.secondsForEvery30Words,
		coverDurationInSeconds: translateComment.coverDurationInSeconds,
		comments: translateComment.comments ?? [],
	})

	const filePath = translateComment.sourceFilePath || download.filePath
	let playFile = filePath ? path.basename(filePath) : null

	const newPlayFile = `new-${playFile}`
	const newPlayFilePath = path.join(PUBLIC_DIR, newPlayFile)
	const end = render.commentsEndFrame / translateComment.fps
	const command = `ffmpeg -y -ss 0 -i ${filePath} -t ${end} \
		-c:v libx264 \
		-preset fast \
		-crf 23 \
		-r ${fps} \
		-vf "scale=trunc(oh*a/2)*2:720" \
		-movflags +faststart \
		-c:a aac \
		-b:a 128k \
		${newPlayFilePath} -progress pipe:1`
	await execCommand(command)
	playFile = newPlayFile

	const bundled = await bundle({
		entryPoint,
		webpackOverride,
		onProgress: bundleOnProgress,
	})

	const inputProps = {
		comments: render.remotionVideoComments,
		title: translateComment.translatedTitle || '',
		playFile,
		viewCountText: download.viewCountText || '',
		coverDurationInSeconds: translateComment.coverDurationInSeconds,
		author: download.author || '',
	}

	const composition = await selectComposition({
		serveUrl: bundled,
		id: render.compositionId,
		inputProps,
	})

	composition.durationInFrames = render.totalDurationInFrames
	composition.fps = fps
	composition.height = render.compositionHeight
	composition.width = render.compositionWidth

	const dir = await createOperationDir(id)
	const outputPath = path.join(dir, `${id}-output.mp4`)

	await renderMedia({
		codec: 'h264',
		composition,
		serveUrl: bundled,
		inputProps,
		outputLocation: outputPath,
		onProgress: throttleRenderOnProgress,
		concurrency: 2,
		logLevel: 'error',
	})

	await db
		.update(schema.translateComments)
		.set({
			outputFilePath: outputPath,
		})
		.where(eq(schema.translateComments.id, id))

	return {}
}
