import type { ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import html2canvas from 'html2canvas'
import { useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import AiModelSelect from '~/components/AiModelSelect'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { type AiModel, aiGenerateText } from '~/utils/ai'

interface GenerateCoverInput {
	title: string
	description: string
	aspectRatio: string
	aiModel: AiModel
}

async function generateCoverHTML({ title, description, aspectRatio, aiModel }: GenerateCoverInput): Promise<string> {
	const systemPrompt = `
		You are a professional HTML and CSS developer specializing in minimal, modern design.
		Create a clean, contemporary HTML cover using the provided title, description, and aspect ratio.
		Follow these principles:
		- Use minimal, clean design with ample whitespace
		- Employ modern CSS techniques like flexbox, grid, and custom properties
		- Use a modern color palette with subtle gradients or solid colors
		- Incorporate contemporary typography with appropriate hierarchy
		- Focus on responsive design principles
		- Keep the HTML structure simple with semantic elements
		- Use inline CSS only and make it efficient (minimize redundant styles)
		- The output should be valid HTML that can be directly used in an iframe
		- Do not include any JavaScript
		- Do not add any attribution, copyright notices, or "Generated with AI" text
		- Do not wrap your HTML in markdown code blocks or any other formatting
		- DO NOT include \`\`\`html at the beginning or \`\`\` at the end
		- ONLY return the raw HTML without any explanation, tags, or markdown formatting
	`

	const prompt = `
		Create a minimal, modern HTML cover with the following details:
		Title: ${title}
		Description: ${description}
		Aspect Ratio: ${aspectRatio}
		
		Design requirements:
		- Create a clean, contemporary design with ample whitespace
		- Use a modern, accessible color scheme (preferably with subtle gradients)
		- Employ elegant typography with appropriate font sizes and weights
		- Make sure the design is perfectly suited for ${aspectRatio} aspect ratio
		- Focus on visual hierarchy and balance
		- Use modern CSS techniques (flexbox/grid layouts, subtle animations if appropriate)
		- Keep it minimal and visually striking
		- Do not include any attribution text or "Generated with AI" notice
		
		IMPORTANT: Only return the raw HTML code. Do not wrap it in \`\`\`html or any other markdown formatting. I need the exact HTML to render directly.
	`

	let html = await aiGenerateText({
		systemPrompt,
		prompt,
		model: aiModel,
		maxTokens: 8192,
	})

	// 清理可能的 Markdown 代码块标记
	html = html.replace(/^```html\s*/i, '').replace(/\s*```$/i, '')

	// 确保第一个字符是 < (HTML 标签开始)
	html = html.trim()
	if (!html.startsWith('<')) {
		html = html.substring(html.indexOf('<'))
	}

	return html
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()

	const title = formData.get('title') as string
	const description = formData.get('description') as string
	const aspectRatio = formData.get('aspectRatio') as string
	const aiModel = formData.get('aiModel') as AiModel

	invariant(title, 'Title is required')

	const html = await generateCoverHTML({ title, description, aspectRatio, aiModel })

	return { html }
}

export default function CoverGeneratorPage() {
	const fetcher = useFetcher()
	const isGenerating = fetcher.state !== 'idle'
	const previewRef = useRef<HTMLDivElement>(null)
	const [isDownloading, setIsDownloading] = useState(false)

	// Handle fetcher data with type assertion
	const generatedHtml = (fetcher.data as any)?.html || ''

	// Use default aspect ratio
	const defaultAspectRatio = '16:9'

	const handleDownload = async () => {
		if (!previewRef.current) return

		try {
			setIsDownloading(true)

			// Wait a short time to ensure iframe content is fully loaded
			await new Promise((resolve) => setTimeout(resolve, 500))

			// Get iframe element
			const iframe = previewRef.current.querySelector('iframe')
			if (!iframe) throw new Error('No iframe found')

			// Access iframe content window
			const iframeWindow = iframe.contentWindow
			if (!iframeWindow) throw new Error('Cannot access iframe content')

			// Use html2canvas to convert iframe document to canvas
			const canvas = await html2canvas(iframeWindow.document.body, {
				backgroundColor: 'white',
				scale: 2, // 2x scale for higher quality
				useCORS: true,
				allowTaint: true,
			})

			// Convert canvas to dataURL
			const dataUrl = canvas.toDataURL('image/png')

			// Create download link
			const link = document.createElement('a')
			link.download = `cover-${Date.now()}.png`
			link.href = dataUrl
			link.click()
		} catch (error) {
			console.error('Error converting to image:', error)
			alert('Failed to convert to image. Downloading HTML instead.')

			// Fallback: download HTML
			const element = document.createElement('a')
			const file = new Blob([generatedHtml], { type: 'text/html' })
			element.href = URL.createObjectURL(file)
			element.download = `cover-${Date.now()}.html`
			element.click()
		} finally {
			setIsDownloading(false)
		}
	}

	return (
		<div className="flex h-full min-h-screen">
			{/* Left side - Input area */}
			<div className="w-1/3 border-r p-6 flex flex-col">
				<h2 className="text-2xl font-bold mb-6">Cover Generator</h2>
				<fetcher.Form method="post" className="space-y-6 flex-1">
					<div className="space-y-4">
						<div>
							<label htmlFor="title" className="block text-sm font-medium mb-1">
								Title
							</label>
							<Input id="title" name="title" placeholder="Enter cover title" required />
						</div>

						<div>
							<label htmlFor="description" className="block text-sm font-medium mb-1">
								Description
							</label>
							<Textarea id="description" name="description" placeholder="Enter cover description" rows={4} />
						</div>

						<div>
							<label htmlFor="aspectRatio" className="block text-sm font-medium mb-1">
								Aspect Ratio
							</label>
							<Select name="aspectRatio" defaultValue="16:9">
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select aspect ratio" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="16:9">16:9 (Landscape)</SelectItem>
									<SelectItem value="9:16">9:16 (Portrait)</SelectItem>
									<SelectItem value="1:1">1:1 (Square)</SelectItem>
									<SelectItem value="4:3">4:3 (Classic)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<label htmlFor="aiModel" className="block text-sm font-medium mb-1">
								AI Model
							</label>
							<AiModelSelect name="aiModel" defaultValue="deepseek" />
						</div>
					</div>

					<div className="pt-4">
						<LoadingButtonWithState className="w-full" state={fetcher.state} idleText="Generate Cover" loadingText="Generating..." />
					</div>
				</fetcher.Form>
			</div>

			{/* Right side - Preview area */}
			<div className="w-2/3 p-6 flex flex-col">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold">Preview</h2>
					{generatedHtml && (
						<LoadingButtonWithState onClick={handleDownload} variant="outline" state={isDownloading ? 'loading' : 'idle'} idleText="Download Image" loadingText="Converting..." />
					)}
				</div>

				<div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
					{generatedHtml ? (
						<div
							ref={previewRef}
							className={`relative ${
								defaultAspectRatio === '16:9'
									? 'w-full max-w-3xl aspect-video'
									: defaultAspectRatio === '9:16'
										? 'h-full max-h-[80vh] aspect-[9/16]'
										: defaultAspectRatio === '1:1'
											? 'w-2/3 aspect-square'
											: 'w-full max-w-3xl aspect-[4/3]'
							}`}
						>
							<iframe title="Cover Preview" srcDoc={generatedHtml} className="w-full h-full border" style={{ backgroundColor: 'white' }} />
						</div>
					) : (
						<div className="text-gray-400 text-center">
							{isGenerating ? <p>Generating cover preview...</p> : <p>Fill out the form and click "Generate Cover" to see a preview</p>}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
