import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createId } from '@paralleldrive/cuid2'
import { type ActionFunctionArgs, data } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'
import { createOperationDir } from '~/utils/file'

// 定义片段类型
type TrimSegment = {
	id: string
	start: number
	end: number
}

// 创建临时文件列表
async function createTempFileList(segments: TrimSegment[], videoDuration: number, videoPath: string): Promise<string> {
	// 计算要保留的片段（即不在segments中的部分）
	const keepSegments: { start: number; end: number }[] = []
	let lastEnd = 0

	// 按开始时间排序segments
	const sortedSegments = [...segments].sort((a, b) => a.start - b.start)

	// 计算要保留的片段
	for (const segment of sortedSegments) {
		if (segment.start > lastEnd) {
			keepSegments.push({
				start: lastEnd,
				end: segment.start,
			})
		}
		lastEnd = Math.max(lastEnd, segment.end)
	}

	// 添加最后一个片段（如果需要）
	if (lastEnd < videoDuration) {
		keepSegments.push({
			start: lastEnd,
			end: videoDuration,
		})
	}

	// 创建ffmpeg的concat文件
	const concatFileContent = keepSegments
		.map((segment) => {
			const duration = segment.end - segment.start
			return `file '${videoPath}'\ninpoint ${segment.start}\noutpoint ${segment.end}\n`
		})
		.join('')

	// 写入临时文件
	const tempFilePath = path.join(process.cwd(), 'tmp', `concat-${createId()}.txt`)
	await fs.mkdir(path.dirname(tempFilePath), { recursive: true })
	await fs.writeFile(tempFilePath, concatFileContent)

	return tempFilePath
}

// 使用ffmpeg的concat demuxer来合并视频片段
async function concatVideoSegments(concatFilePath: string, outputPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const ffmpeg = spawn('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', concatFilePath, '-c', 'copy', outputPath])

		let stderr = ''

		ffmpeg.stderr.on('data', (data) => {
			stderr += data.toString()
			console.log('FFmpeg progress:', data.toString())
		})

		ffmpeg.on('error', (error) => {
			reject(new Error(`FFmpeg process error: ${error.message}`))
		})

		ffmpeg.on('close', (code) => {
			if (code === 0) {
				console.log('FFmpeg finished successfully')
				resolve()
			} else {
				console.error('FFmpeg stderr:', stderr)
				reject(new Error(`FFmpeg process exited with code ${code}\n${stderr}`))
			}
		})
	})
}

export async function action({ request, params }: ActionFunctionArgs) {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const segmentsJson = formData.get('segments')
	invariant(typeof segmentsJson === 'string', 'segments is required')

	let segments: TrimSegment[]
	try {
		segments = JSON.parse(segmentsJson)
		invariant(Array.isArray(segments) && segments.length > 0, 'segments must be a non-empty array')
	} catch (error) {
		return data({ error: 'Invalid segments data' }, { status: 400 })
	}

	// Get the video information
	const translateVideo = await db.query.translateVideos.findFirst({
		where: eq(schema.translateVideos.id, id),
	})
	invariant(translateVideo, 'translateVideo not found')

	// Determine the source file path
	const sourceFilePath = translateVideo.uploadFilePath || translateVideo.outputFilePath
	invariant(sourceFilePath, 'Source file not found')

	// 计算视频总时长
	const transcripts = translateVideo.transcripts || []
	const videoDuration = transcripts.length > 0 ? Math.max(...transcripts.map((t) => t.end)) : 0

	invariant(videoDuration > 0, 'Cannot determine video duration')

	// Create a new operation directory for the trimmed video
	const operationDir = await createOperationDir(id)
	const outputFileName = `trimmed-${createId()}.mp4`
	const outputFilePath = path.join(operationDir, outputFileName)

	try {
		// 创建临时文件列表
		const concatFilePath = await createTempFileList(segments, videoDuration, sourceFilePath)

		// 合并视频片段
		await concatVideoSegments(concatFilePath, outputFilePath)

		// 清理临时文件
		await fs.unlink(concatFilePath).catch(console.error)

		// Update the database with the new output file
		await db
			.update(schema.translateVideos)
			.set({
				outputFilePath,
			})
			.where(eq(schema.translateVideos.id, id))

		return { success: true }
	} catch (error) {
		console.error('Error trimming video:', error)
		return data({ error: 'Failed to trim video' }, { status: 500 })
	}
}
