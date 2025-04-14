import { useFetcher } from '@remix-run/react'
import { Headphones, Trash2, Upload } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import type { RemotionFillInBlankSentence } from '~/types'

type SentencesProps = {
	sentences: RemotionFillInBlankSentence[]
}
export default function Sentences({ sentences }: SentencesProps) {
	const uploadCoverFetcher = useFetcher()
	const deleteFetcher = useFetcher()

	return (
		<div className="space-y-6">
			{sentences.map((sentence, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<div key={index} className="group relative rounded-xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-md">
					{/* Delete Button */}
					<deleteFetcher.Form method="post" action="delete-sentence" className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
						<input type="hidden" name="index" value={index} />
						<Button variant="ghost" type="submit" size="icon" className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500">
							<Trash2 className="h-4 w-4" />
						</Button>
					</deleteFetcher.Form>

					{/* Content */}
					<div className="space-y-4">
						{/* English & Chinese Text */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-lg font-medium text-gray-900">{sentence.sentence}</p>
								{(sentence.audioFilePath || sentence.publicAudioPath) && (
									<Badge className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
										<Headphones className="h-3 w-3" />
										<span className="text-xs">Audio Ready</span>
									</Badge>
								)}
							</div>
							<p className="text-base text-gray-600">{sentence.sentenceZh}</p>
						</div>

						{/* Word Info */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4">
								<div className="flex-1">
									<div className="flex items-baseline gap-2">
										<span className="text-lg font-medium text-blue-900">{sentence.word}</span>
										{sentence.wordPronunciation && <span className="text-sm font-medium text-purple-700">{sentence.wordPronunciation}</span>}
									</div>
									<span className="text-sm text-blue-700">{sentence.wordZh}</span>
								</div>
							</div>
						</div>

						{/* Image Preview */}
						{sentence.publicCoverPath && (
							<div className="relative aspect-video overflow-hidden rounded-lg">
								<img src={sentence.publicCoverPath} alt={sentence.word} className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105" />
							</div>
						)}

						{/* Upload Form */}
						<uploadCoverFetcher.Form method="post" action="upload-cover" encType="multipart/form-data" className="flex items-center gap-3">
							<input hidden name="index" value={index} readOnly />
							<div className="relative flex-1">
								<input
									type="file"
									name="file"
									accept=".png,.jpg,.jpeg"
									className="w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 
										file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm 
										file:font-medium file:text-blue-700 hover:border-blue-300 hover:file:bg-blue-100
										focus:border-blue-500 focus:outline-none"
									required
								/>
							</div>
							<Button type="submit" variant="outline" size="icon" className="h-10 w-10 rounded-lg hover:bg-blue-50 hover:text-blue-600">
								<Upload className="h-4 w-4" />
							</Button>
						</uploadCoverFetcher.Form>

						{/* Audio Preview */}
						{(sentence.audioFilePath || sentence.publicAudioPath) && (
							<div className="mt-2">
								{sentence.publicAudioPath && (
									<audio controls className="w-full h-8">
										<source src={sentence.publicAudioPath} type="audio/mpeg" />
										<track kind="captions" />
										Your browser does not support the audio element.
									</audio>
								)}
								{sentence.audioDuration && <p className="text-xs text-gray-500 mt-1">Duration: {sentence.audioDuration.toFixed(2)}s</p>}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	)
}
