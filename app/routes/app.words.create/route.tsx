import { createId } from '@paralleldrive/cuid2'
import { data, redirect } from '@remix-run/node'
import { Form, useFetcher } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { ArrowLeft, Sparkles, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import AiModelSelect from '~/components/AiModelSelect'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { db, schema } from '~/lib/drizzle'
import type { GenerateWordSentencesActionData, WordSentence } from '~/types'

// Define validation schema
const WordSentenceSchema = z.object({
	word: z.string().min(1, 'Word is required'),
	wordZh: z.string().min(1, 'Chinese word is required'),
	wordPronunciationPath: z.string().optional(),
	sentence: z.string().min(1, 'Sentence is required'),
	sentenceZh: z.string().min(1, 'Chinese sentence is required'),
	sentencePronunciationPath: z.string().optional(),
})

const CreateWordSchema = z.object({
	sentences: z.array(WordSentenceSchema).min(1, 'At least one word sentence is required'),
	fps: z.coerce.number().int().min(1).default(40),
})

type FormErrors = {
	sentences?: string[]
	fps?: string[]
	_form?: string[]
}

export const action = async ({ request }: { request: Request }) => {
	const formData = await request.formData()

	try {
		const fps = formData.get('fps')
		const sentencesJson = formData.get('sentences')

		if (typeof sentencesJson !== 'string') {
			throw new Error('Invalid sentences data')
		}

		const sentences = JSON.parse(sentencesJson)

		const validatedData = CreateWordSchema.parse({
			sentences,
			fps,
		})

		// Create word entry
		const id = createId()
		await db.insert(schema.words).values({
			id,
			sentences: validatedData.sentences,
			fps: validatedData.fps,
			createdAt: new Date(),
		})

		return redirect(`/app/words/${id}`)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return data<{ success: false; errors: FormErrors }>(
				{
					success: false,
					errors: error.flatten().fieldErrors as FormErrors,
				},
				{ status: 400 },
			)
		}

		console.error('Error creating word entry:', error)
		return data<{ success: false; errors: FormErrors }>(
			{
				success: false,
				errors: { _form: ['Failed to create word entry'] },
			},
			{ status: 500 },
		)
	}
}

type ActionData = { success: false; errors: FormErrors } | undefined

export default function CreateWordPage() {
	const formFetcher = useFetcher<ActionData>()
	const generationFetcher = useFetcher<GenerateWordSentencesActionData>()
	const formErrors = formFetcher.data?.errors || ({} as FormErrors)
	const generationErrors = generationFetcher.data?.success === false ? generationFetcher.data.errors : {}

	// State to store WordSentence list
	const [wordSentences, setWordSentences] = useState<WordSentence[]>([])

	// Update word sentences when AI generates content
	useEffect(() => {
		if (generationFetcher.data?.success && generationFetcher.data.data) {
			if (Array.isArray(generationFetcher.data.data)) {
				setWordSentences(generationFetcher.data.data)
			} else {
				setWordSentences([generationFetcher.data.data])
			}
		}
	}, [generationFetcher.data])

	// Delete a word sentence from the list
	const handleDelete = (index: number) => {
		setWordSentences(wordSentences.filter((_, i) => i !== index))
	}

	return (
		<div className="p-8 max-w-3xl mx-auto">
			<div className="flex items-center gap-4 mb-8">
				<Link to="/app/words">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-5 w-5" />
					</Button>
				</Link>
				<h1 className="text-3xl font-bold tracking-tight">Create Word Entry</h1>
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Generate WordSentence List</CardTitle>
					<CardDescription>Use AI to generate a list of words and sentences.</CardDescription>
				</CardHeader>
				<CardContent>
					<generationFetcher.Form method="post" action="/app/words/create/generate" className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="prompt">Prompt</Label>
							<Textarea
								id="prompt"
								name="prompt"
								placeholder="Enter a topic or theme to generate word and sentence pairs (e.g., 'technology', 'daily conversation', 'business')"
								rows={3}
							/>
							{generationErrors.prompt && <p className="text-sm text-destructive">{generationErrors.prompt[0]}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="model">Model</Label>
							<AiModelSelect name="model" defaultValue="deepseek" />
							{generationErrors.model && <p className="text-sm text-destructive">{generationErrors.model[0]}</p>}
						</div>

						{generationErrors._form && (
							<div className="bg-destructive/10 text-destructive p-3 rounded-md">
								{generationErrors._form.map((error: string, i: number) => (
									<p key={`generation-error-${i}-${error}`}>{error}</p>
								))}
							</div>
						)}

						<LoadingButtonWithState
							type="submit"
							className="w-full"
							state={generationFetcher.state}
							idleText="Generate Content"
							loadingText="Generating..."
							icon={<Sparkles className="h-4 w-4 mr-2" />}
						/>
					</generationFetcher.Form>
				</CardContent>
			</Card>

			{wordSentences.length > 0 && (
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Generated WordSentence List</CardTitle>
						<CardDescription>Review and edit generated items before saving.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{wordSentences.map((item, index) => (
								<div key={`word-sentence-${item.word}-${index}`} className="border rounded-lg p-4 relative">
									<Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleDelete(index)}>
										<Trash className="h-4 w-4 text-destructive" />
									</Button>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
										<div>
											<p className="text-sm font-medium mb-1">Word:</p>
											<p className="text-sm">{item.word}</p>
										</div>
										<div>
											<p className="text-sm font-medium mb-1">Word (Chinese):</p>
											<p className="text-sm">{item.wordZh}</p>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
										<div>
											<p className="text-sm font-medium mb-1">Sentence:</p>
											<p className="text-sm">{item.sentence}</p>
										</div>
										<div>
											<p className="text-sm font-medium mb-1">Sentence (Chinese):</p>
											<p className="text-sm">{item.sentenceZh}</p>
										</div>
									</div>
								</div>
							))}
						</div>

						<formFetcher.Form method="post" className="mt-4">
							<input type="hidden" name="sentences" value={JSON.stringify(wordSentences)} />
							<input type="hidden" name="fps" value="40" />

							{/* Display form-level errors */}
							{formErrors._form && (
								<div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
									<h4 className="font-semibold mb-1">Form Errors:</h4>
									{formErrors._form.map((error, i) => (
										<p key={`form-error-${i}-${error}`}>{error}</p>
									))}
								</div>
							)}

							{/* Display sentences array errors */}
							{formErrors.sentences && (
								<div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
									<h4 className="font-semibold mb-1">Sentence Errors:</h4>
									{formErrors.sentences.map((error, i) => (
										<p key={`sentences-error-${i}-${error}`}>{error}</p>
									))}
								</div>
							)}

							{/* Display fps errors */}
							{formErrors.fps && (
								<div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
									<h4 className="font-semibold mb-1">FPS Errors:</h4>
									{formErrors.fps.map((error, i) => (
										<p key={`fps-error-${i}-${error}`}>{error}</p>
									))}
								</div>
							)}

							{/* Display submission errors */}
							{formFetcher.data?.success === false && (
								<div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
									<h4 className="font-semibold mb-1">Submission Errors:</h4>
									<pre className="text-xs mt-1 overflow-auto max-h-32">{JSON.stringify(formFetcher.data, null, 2)}</pre>
								</div>
							)}

							<LoadingButtonWithState
								type="submit"
								className="w-full"
								state={formFetcher.state}
								idleText="Save Word Entries"
								loadingText="Saving..."
								disabled={wordSentences.length === 0}
							/>
						</formFetcher.Form>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
