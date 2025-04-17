import { useFetcher } from '@remix-run/react'
import { AlertTriangle, Check, HelpCircle, Languages, Pencil, Split, Trash, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import type { Comment } from '~/types'

export default function Comments({ comments }: { comments: Comment[] }) {
	const deleteFetcher = useFetcher()
	const translateFetcher = useFetcher()
	const splitFetcher = useFetcher()
	const updateContentFetcher = useFetcher()
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [editContent, setEditContent] = useState('')

	const handleEdit = (index: number, content: string) => {
		setEditingIndex(index)
		setEditContent(content)
	}

	const handleCancel = () => {
		setEditingIndex(null)
		setEditContent('')
	}

	const handleSave = (index: number) => {
		updateContentFetcher.submit(
			{
				index: index.toString(),
				translatedContent: editContent,
			},
			{ method: 'post', action: 'update-content' },
		)
		setEditingIndex(null)
	}

	return (
		<div className="flex flex-col gap-4">
			{comments.map((comment, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<div key={index} className={`rounded-lg bg-card p-4 shadow-sm transition-all hover:shadow-md ${comment.sensitive ? 'border-l-4 border-amber-500' : ''}`}>
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
						<div className="flex items-center gap-2 min-w-0 flex-shrink">
							<span className="font-medium text-primary truncate">
								{comment.author.startsWith('@') ? '' : '@'}
								{comment.author}
							</span>
							<span className="text-sm text-muted-foreground flex-shrink-0">·</span>
							<span className="text-sm text-muted-foreground flex-shrink-0">{(comment as any).publishedTime}</span>
							{comment.sensitive && (
								<div className="flex items-center gap-1">
									<span className="inline-flex items-center gap-1 text-amber-500 text-xs px-2 py-1 bg-amber-100 rounded-full">
										<AlertTriangle size={12} />
										Sensitive
									</span>
									{comment.sensitiveReason && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button variant="ghost" size="icon" className="h-6 w-6 text-amber-500">
														<HelpCircle size={14} />
													</Button>
												</TooltipTrigger>
												<TooltipContent className="max-w-xs">
													<p className="text-xs">{comment.sensitiveReason}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</div>
							)}
						</div>

						<div className="flex gap-1 ml-auto flex-shrink-0">
							<translateFetcher.Form method="post" action="translate">
								<input type="hidden" name="index" value={index} />
								<input type="hidden" name="action" value="translate-single" />
								<Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10 hover:text-primary">
									<Languages size={14} />
								</Button>
							</translateFetcher.Form>

							<splitFetcher.Form method="post" action="split-comment">
								<input type="hidden" name="index" value={index} />
								<Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10 hover:text-primary">
									<Split size={14} />
								</Button>
							</splitFetcher.Form>

							<deleteFetcher.Form method="post" action="delete-comment">
								<input type="hidden" name="index" value={index} />
								<Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive">
									<Trash size={14} />
								</Button>
							</deleteFetcher.Form>
						</div>
					</div>
					<div className="space-y-3">
						<p className="text-sm text-foreground/90 leading-relaxed break-words">{comment.content}</p>
						<div className="bg-muted/50 p-3 rounded-md">
							{editingIndex === index ? (
								<div className="flex flex-col gap-2">
									<Textarea
										value={editContent}
										onChange={(e) => setEditContent(e.target.value)}
										className="flex-1 bg-background text-sm min-h-[80px] resize-y"
										placeholder="Enter translation..."
									/>
									<div className="flex justify-end gap-2">
										<Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive text-destructive" onClick={handleCancel}>
											<X size={14} className="mr-1" />
											Cancel
										</Button>
										<Button variant="ghost" size="sm" className="hover:bg-green-100 hover:text-green-600 text-green-600" onClick={() => handleSave(index)}>
											<Check size={14} className="mr-1" />
											Save
										</Button>
									</div>
								</div>
							) : (
								<div className="flex items-start gap-2">
									<p className="text-sm flex-1 text-primary font-medium break-words whitespace-pre-wrap">{comment.translatedContent}</p>
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7 flex-shrink-0 hover:bg-primary/10 hover:text-primary"
										onClick={() => handleEdit(index, comment.translatedContent || '')}
									>
										<Pencil size={14} />
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
