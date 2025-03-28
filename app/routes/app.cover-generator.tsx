import { useState } from 'react'
import AiModelSelect from '~/components/AiModelSelect'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'

export default function CoverGeneratorPage() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [aspectRatio, setAspectRatio] = useState('16:9')
	const [generatedHtml, setGeneratedHtml] = useState('')
	const [isGenerating, setIsGenerating] = useState(false)

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setIsGenerating(true)

		try {
			// TODO: Implement API call to generate HTML based on inputs
			// This is a placeholder for demonstration
			setTimeout(() => {
				const html = `
					<div style="
						display: flex;
						justify-content: center;
						align-items: center;
						width: 100%;
						height: 100%;
						background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
						font-family: system-ui, sans-serif;
						padding: 20px;
					">
						<div style="
							display: flex;
							flex-direction: column;
							align-items: center;
							width: 80%;
							text-align: center;
						">
							<h1 style="
								font-size: 36px;
								font-weight: bold;
								background: linear-gradient(to right, #1a1a1a, #4a4a4a);
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
								margin-bottom: 16px;
							">${title}</h1>
							<p style="
								font-size: 18px;
								color: #666;
								max-width: 80%;
								line-height: 1.5;
							">${description}</p>
						</div>
					</div>
				`
				setGeneratedHtml(html)
				setIsGenerating(false)
			}, 2000)
		} catch (error) {
			console.error('Error generating cover:', error)
			setIsGenerating(false)
		}
	}

	const handleDownload = () => {
		const element = document.createElement('a')
		const file = new Blob([generatedHtml], { type: 'text/html' })
		element.href = URL.createObjectURL(file)
		element.download = `cover-${Date.now()}.html`
		document.body.appendChild(element)
		element.click()
		document.body.removeChild(element)
	}

	return (
		<div className="flex h-full min-h-screen">
			{/* Left side - Inputs */}
			<div className="w-1/3 border-r p-6 flex flex-col">
				<h2 className="text-2xl font-bold mb-6">Cover Generator</h2>
				<form onSubmit={handleSubmit} className="space-y-6 flex-1">
					<div className="space-y-4">
						<div>
							<label htmlFor="title" className="block text-sm font-medium mb-1">
								Title
							</label>
							<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter cover title" required />
						</div>

						<div>
							<label htmlFor="description" className="block text-sm font-medium mb-1">
								Description
							</label>
							<Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter cover description" rows={4} />
						</div>

						<div>
							<label htmlFor="aspectRatio" className="block text-sm font-medium mb-1">
								Aspect Ratio
							</label>
							<Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value)}>
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
						<Button type="submit" className="w-full" disabled={isGenerating || !title}>
							{isGenerating ? 'Generating...' : 'Generate Cover'}
						</Button>
					</div>
				</form>
			</div>

			{/* Right side - Preview */}
			<div className="w-2/3 p-6 flex flex-col">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold">Preview</h2>
					{generatedHtml && (
						<Button onClick={handleDownload} variant="outline">
							Download HTML
						</Button>
					)}
				</div>

				<div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
					{generatedHtml ? (
						<div
							className={`relative ${
								aspectRatio === '16:9'
									? 'w-full max-w-3xl aspect-video'
									: aspectRatio === '9:16'
										? 'h-full max-h-[80vh] aspect-[9/16]'
										: aspectRatio === '1:1'
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
