import type { ActionFunctionArgs } from '@remix-run/node'
import { Form, redirect, useFetcher } from '@remix-run/react'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import invariant from 'tiny-invariant'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { db, schema } from '~/lib/drizzle'
import type { FillInBlankSentence } from '~/types'

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()
	const sentencesStr = formData.get('sentences')
	invariant(typeof sentencesStr === 'string', 'sentences is required')

	const sentences = JSON.parse(sentencesStr) as FillInBlankSentence[]

	const [result] = await db
		.insert(schema.fillInBlanks)
		.values({
			sentences: sentences,
		})
		.returning({
			id: schema.fillInBlanks.id,
		})

	return redirect(`/app/fill-in-blank/${result.id}`)
}

const defaultPromptText =
	'你是一个英语老师，需要给学生出填空题，需要根据给定的主题出10道题，每道题需要包含一个全量的英文句子，一个对应的中文翻译的句子， 一个对应在英文句子中的单词，一个对应的单词发音，一个对应中文翻译句子中的中文词。另外，请提供一个额外的字段，表示这个单词在中文句子中的实际形式（wordInSentenceZh），因为有时候单词的直接翻译和在句子中的表现形式会有所不同。请确保每次生成的内容都不一样，句子的难度也要有变化，从简单到中等难度都要覆盖。主题：xxxx'

export default function AppFillInBlankCreatePage() {
	const generateFetcher = useFetcher<FillInBlankSentence[]>()
	const [sentences, setSentences] = useState<FillInBlankSentence[]>([])
	const [prompt, setPrompt] = useState(defaultPromptText)

	const onDelete = (index: number) => {
		setSentences((prev) => prev.filter((_, i) => i !== index))
	}

	const onEdit = (index: number, field: keyof FillInBlankSentence, value: string) => {
		setSentences((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
	}

	useEffect(() => {
		if (generateFetcher.data) {
			setSentences((prev) => [...prev, ...(generateFetcher.data as FillInBlankSentence[])])
		}
	}, [generateFetcher.data])

	return (
		<div className="flex flex-col flex-auto p-6 gap-6 bg-gray-50 min-h-screen">
			<generateFetcher.Form method="post" action="/app/fill-in-blank/generate" className="bg-white p-6 rounded-lg shadow-sm border">
				<div className="space-y-4">
					<div className="space-y-2">
						<h2 className="text-lg font-semibold">Generate Fill-in-blank Sentences</h2>
						<p className="text-sm text-gray-500">Use AI to generate sentences for your fill-in-blank exercise.</p>
					</div>
					<Textarea name="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[120px]" />
					<LoadingButtonWithState state={generateFetcher.state} idleText="Generate Sentences" loadingText="Generating Sentences..." className="w-full sm:w-auto" />
				</div>
			</generateFetcher.Form>

			<div className="flex-auto overflow-auto space-y-6">
				{sentences.map((sentence, index) => (
					<div key={`${sentence.word}-${sentence.sentence}-${index}`} className="p-6 space-y-4 border bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex justify-between items-center border-b pb-4">
							<h3 className="font-semibold text-lg text-gray-900">Sentence {index + 1}</h3>
							<Button variant="ghost" size="icon" onClick={() => onDelete(index)} className="hover:bg-red-50 hover:text-red-500 transition-colors">
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
						<div className="grid gap-4">
							<div className="space-y-2">
								<label htmlFor={`sentence-${index}`} className="text-sm font-medium text-gray-700">
									English Sentence
								</label>
								<Input
									id={`sentence-${index}`}
									placeholder="Enter the complete English sentence"
									value={sentence.sentence}
									onChange={(e) => onEdit(index, 'sentence', e.target.value)}
									className="focus:ring-2 focus:ring-blue-100"
								/>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label htmlFor={`word-${index}`} className="text-sm font-medium text-gray-700">
										Target Word
									</label>
									<Input
										id={`word-${index}`}
										placeholder="Word to fill in"
										value={sentence.word}
										onChange={(e) => onEdit(index, 'word', e.target.value)}
										className="focus:ring-2 focus:ring-blue-100"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor={`pronunciation-${index}`} className="text-sm font-medium text-gray-700">
										Pronunciation
									</label>
									<Input
										id={`pronunciation-${index}`}
										placeholder="Word pronunciation"
										value={sentence.wordPronunciation}
										onChange={(e) => onEdit(index, 'wordPronunciation', e.target.value)}
										className="focus:ring-2 focus:ring-blue-100"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label htmlFor={`sentence-zh-${index}`} className="text-sm font-medium text-gray-700">
									Chinese Translation
								</label>
								<Input
									id={`sentence-zh-${index}`}
									placeholder="Chinese translation of the sentence"
									value={sentence.sentenceZh}
									onChange={(e) => onEdit(index, 'sentenceZh', e.target.value)}
									className="focus:ring-2 focus:ring-blue-100"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor={`word-zh-${index}`} className="text-sm font-medium text-gray-700">
									Chinese Word
								</label>
								<Input
									id={`word-zh-${index}`}
									placeholder="Chinese translation of the target word"
									value={sentence.wordZh}
									onChange={(e) => onEdit(index, 'wordZh', e.target.value)}
									className="focus:ring-2 focus:ring-blue-100"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor={`word-in-sentence-zh-${index}`} className="text-sm font-medium text-gray-700">
									Word Form in Chinese Sentence
								</label>
								<Input
									id={`word-in-sentence-zh-${index}`}
									placeholder="How the word actually appears in Chinese sentence"
									value={sentence.wordInSentenceZh}
									onChange={(e) => onEdit(index, 'wordInSentenceZh', e.target.value)}
									className="focus:ring-2 focus:ring-blue-100"
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="flex gap-4 sticky bottom-0 bg-white/80 backdrop-blur-sm py-4 px-6 -mx-6 border-t">
				<Form method="post" className="flex-1">
					<input type="hidden" name="sentences" value={JSON.stringify(sentences)} />
					<Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
						Create Exercise
					</Button>
				</Form>
			</div>
		</div>
	)
}
