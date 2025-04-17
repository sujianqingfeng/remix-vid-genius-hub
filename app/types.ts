import type { SubmissionResult } from '@conform-to/react'
import type { z } from 'zod'
import type { GenerateDialogueSchema, GenerateWordSentencesSchema } from './schema'

export type SubmissionReply = {
	submissionReply?: SubmissionResult<string[]>
}

export type CreateNewDownloadActionData = {
	success: boolean
} & SubmissionReply

// youtube comment

export type YoutubeComment = {
	content: string
	author: string
	translatedContent?: string
	convertedContent?: string
	likes: string
	authorThumbnail: string
	publishedTime?: string
}

export type RemotionVideoComment = {
	author: string
	content: string
	convertedContent?: string
	translatedContent?: string
	likes: string
	authorThumbnail: string
	publishedTime?: string
	durationInFrames: number
	form: number
}

// translate video

export type Sentence = {
	words: WordWithTime[]
	text: string
	start: number
	end: number
	translation?: string
}

export interface CommentMedia {
	type: 'video' | 'photo'
	url: string
	localUrl?: string
}

export interface Comment {
	id: string
	author: string
	authorThumbnail?: string
	content: string
	translatedContent?: string
	likes: number
	media?: CommentMedia[]
	bookmarkCount?: number
	replyCount?: number
	sensitive?: boolean
	sensitiveReason?: string
}

export interface CommentData {
	comments: Comment[]
	nextPageToken?: string
}

export type CompositionInfo = {
	fps: number
	durationInFrames: number
	width: number
	height: number
}

export type WordWithTime = {
	word: string
	start: number
	end: number
}

export type Transcript = {
	text: string
	start: number
	end: number
	words: WordWithTime[]
	textLiteralTranslation?: string
	textInterpretation?: string
	sentences?: Sentence[]
	excluded?: boolean
}

// fill in blank
export type FillInBlankSentence = {
	sentence: string
	word: string
	sentenceZh: string
	wordZh: string
	wordPronunciation: string
	wordInSentenceZh: string

	audioFilePath?: string
	audioDuration?: number
	coverFilePath?: string
}

export type RemotionFillInBlankSentence = FillInBlankSentence & {
	durationInFrames: number
	form: number
	publicCoverPath?: string
	publicAudioPath?: string
}

export type GenerateDialogue = z.infer<typeof GenerateDialogueSchema>
export type Dialogue = GenerateDialogue['list'][number] & {
	audioFilePath?: string
}

export type RemotionDialogue = Dialogue & {
	durationInFrames: number
	form: number
	publicAudioPath?: string
	roleLabel: number
	content: string
	contentZh: string
}

// general comment
export type GeneralCommentTypeTextInfo = {
	title?: string
	content?: string
	contentZh?: string
	images?: string[]
	localImages?: string[]
	video?: {
		type: string
		url: string
		localUrl?: string
	}
	bookmarkCount?: number
	replyCount?: number
	likes?: number
	retweets?: number
}

export interface GeneralComment {
	id: string
	type: 'text'
	author: string
	typeInfo: GeneralCommentTypeTextInfo
	comments: Comment[]
	fps: number
	coverDurationInSeconds: number
	secondsForEvery30Words: number
	source: 'twitter' | 'youtube' | 'manual'
	audioPath?: string
	publicAudioPath?: string
}

// words
export type GenerationWordSentencesErrors = {
	prompt?: string[]
	model?: string[]
	_form?: string[]
}

export type GenerateWordSentencesActionData =
	| {
			success: true
			data: GenerateWordSentences['list']
	  }
	| {
			success: false
			errors: GenerationWordSentencesErrors
	  }

export type GenerateWordSentences = z.infer<typeof GenerateWordSentencesSchema>

export type WordSentence = GenerateWordSentences['list'][number] & {
	wordPronunciationPath?: string
	wordDuration?: number
	sentencePronunciationPath?: string
	sentenceDuration?: number
	imagePath?: string
}
