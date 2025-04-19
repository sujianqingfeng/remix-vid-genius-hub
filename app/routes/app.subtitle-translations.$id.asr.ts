import { type ChildProcess, spawn } from 'node:child_process'
import fsp from 'node:fs/promises'
import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'

// Convert Windows path to WSL path
function convertToWslPath(windowsPath: string): string {
	// Handle WSL network path (\\wsl.localhost\...)
	if (windowsPath.startsWith('\\\\wsl.localhost\\')) {
		// Remove \\wsl.localhost\distribution_name prefix and convert to WSL path
		const wslPath = windowsPath
			.replace(/^\\\\wsl\.localhost\\[^\\]+\\/, '') // Remove network prefix and distribution name
			.replace(/\\/g, '/') // Convert backslashes to forward slashes
		return `/${wslPath}` // Add leading slash
	}

	// Handle regular Windows path
	const normalizedPath = windowsPath.replace(/\\/g, '/')
	const match = normalizedPath.match(/^([A-Za-z]):(.+)/)
	if (!match) {
		throw new Error(`Invalid Windows path: ${windowsPath}`)
	}
	const [, driveLetter, remainingPath] = match
	return `/mnt/${driveLetter.toLowerCase()}${remainingPath}`
}

// Check if running on Windows
const isWindows = process.platform === 'win32'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	const formData = await request.formData()
	const model = formData.get('model')
	invariant(model === 'whisper-large' || model === 'whisper-medium', 'Invalid model')

	const where = eq(schema.subtitleTranslations.id, id)
	const subtitleTranslation = await db.query.subtitleTranslations.findFirst({
		where,
	})
	invariant(subtitleTranslation, 'subtitleTranslation not found')
	invariant(subtitleTranslation.audioFilePath, 'audioFilePath is required')

	const whisperProjectPath = process.env.WHISPER_PROJECT_PATH
	invariant(whisperProjectPath, 'WHISPER_PROJECT_PATH is required')

	let executablePath: string
	let modelPath: string
	let audioPath: string
	let spawnCommand: string
	let spawnArgs: string[]
	let wslAudioPath: string | null = null
	let wslScriptPath: string | null = null
	let wslJsonPath: string | null = null

	if (isWindows) {
		// WSL paths
		const wslProjectPath = convertToWslPath(whisperProjectPath)
		const originalAudioPath = convertToWslPath(subtitleTranslation.audioFilePath)

		console.log('WSL Project Path:', wslProjectPath)
		console.log('Original Audio Path:', originalAudioPath)

		// First, copy the audio file to WSL's tmp directory
		const audioFileName = path.basename(subtitleTranslation.audioFilePath)
		wslAudioPath = `/tmp/${audioFileName}`
		wslJsonPath = `${wslAudioPath}.json`

		// Create a temporary shell script with proper escaping
		const scriptContent = `#!/bin/bash
set -e

# Copy audio file
cp '${originalAudioPath}' '${wslAudioPath}'

# Run whisper
'${path.posix.join(wslProjectPath, 'build/bin/whisper-cli')}' \\
    -m '${path.posix.join(wslProjectPath, model === 'whisper-large' ? 'models/ggml-large-v3-turbo-q8_0.bin' : 'models/ggml-medium.bin')}' \\
    -p 2 \\
    -t 8 \\
    -f '${wslAudioPath}' \\
    -ml 1 \\
    -oj

# Create output directory if needed
mkdir -p "$(dirname '${originalAudioPath}')"

# Copy result file back to Windows
cp '${wslJsonPath}' '${originalAudioPath}.json'

# Cleanup
rm -f '${wslAudioPath}' '${wslJsonPath}'
`

		// Write the shell script to a temporary file
		wslScriptPath = `/tmp/whisper_${id}.sh`
		await new Promise<void>((resolve, reject) => {
			const writeCmd = spawn('wsl', [
				'bash',
				'-c',
				`cat > '${wslScriptPath}' << 'EOL'
${scriptContent}
EOL
chmod +x '${wslScriptPath}'`,
			])

			writeCmd.on('error', (error) => {
				reject(new Error(`Failed to create script: ${error.message}`))
			})

			writeCmd.on('close', (code) => {
				if (code === 0) {
					resolve()
				} else {
					reject(new Error(`Failed to create script, exit code: ${code}`))
				}
			})
		})

		// Execute the script
		spawnCommand = 'wsl'
		spawnArgs = ['bash', wslScriptPath]
	} else {
		// Direct paths for Mac/Linux
		executablePath = path.join(whisperProjectPath, 'build/bin/whisper-cli')
		modelPath = model === 'whisper-large' ? path.join(whisperProjectPath, 'models/ggml-large-v3-turbo-q8_0.bin') : path.join(whisperProjectPath, 'models/ggml-medium.bin')
		audioPath = subtitleTranslation.audioFilePath
		spawnCommand = executablePath
		spawnArgs = ['-p', '4', '-t', '8', '-m', modelPath, '-f', audioPath, '-ml', '1', '-oj']
	}

	try {
		await new Promise<void>((resolve, reject) => {
			console.log('Executing command:', spawnCommand, spawnArgs.join(' '))

			const whisperCmd = spawn(spawnCommand, spawnArgs, {
				stdio: ['ignore', 'pipe', 'pipe'],
			}) as ChildProcess

			let stderr = ''

			if (whisperCmd.stderr) {
				whisperCmd.stderr.on('data', (data: Buffer) => {
					const output = data.toString()
					stderr += output
					console.log('stderr:', output)
				})
			}

			if (whisperCmd.stdout) {
				whisperCmd.stdout.on('data', (data: Buffer) => {
					console.log('stdout:', data.toString())
				})
			}

			whisperCmd.on('error', (error: Error) => {
				console.error('Spawn error:', error)
				reject(new Error(`process error: ${error.message}`))
			})

			whisperCmd.on('close', (code: number | null) => {
				if (code === 0) {
					console.log('Whisper finished successfully')
					resolve()
				} else {
					console.error('Whisper stderr:', stderr)
					reject(new Error(`Whisper process exited with code ${code}\n${stderr}`))
				}
			})
		})

		const resultPath = `${subtitleTranslation.audioFilePath}.json`
		const text = await fsp.readFile(resultPath, 'utf-8')
		const data = JSON.parse(text)

		const words = data.transcription.map((item: any) => ({
			word: item.text,
			start: item.offsets.from / 1000,
			end: item.offsets.to / 1000,
		}))

		await db
			.update(schema.subtitleTranslations)
			.set({
				withTimeWords: words,
			})
			.where(where)

		return {
			success: true,
			message: `ASR conversion completed successfully using ${model} model`,
			wordCount: words.length,
		}
	} finally {
		// Clean up the temporary script file in WSL if it exists
		if (wslScriptPath) {
			try {
				await new Promise<void>((resolve) => {
					const rmCmd = spawn('wsl', ['rm', '-f', wslScriptPath])
					rmCmd.on('close', () => resolve())
				})
			} catch (error) {
				console.error('Failed to clean up temporary script file:', error)
			}
		}
	}
}
