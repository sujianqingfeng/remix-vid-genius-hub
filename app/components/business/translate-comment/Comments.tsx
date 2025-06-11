import { useFetcher } from '@remix-run/react'
import { AlertTriangle, Check, Clock, HelpCircle, Languages, MessageSquare, Pencil, Split, Trash, User, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
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
		<div className="space-y-4">
			{comments.map((comment, index) => (
				<div
					key={comment.id || index}
					className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg ${
						comment.sensitive
							? 'bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200 dark:border-amber-800/50'
							: 'bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-800/80'
					}`}
				>
					{/* Sensitive indicator bar */}
					{comment.sensitive && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />}

					<div className="p-5">
						{/* Header */}
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3 min-w-0 flex-1">
								{/* Avatar */}
								<div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
									<User className="w-4 h-4 text-white" />
								</div>

								{/* Author info */}
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{comment.author.startsWith('@') ? comment.author : `@${comment.author}`}</span>
										{comment.sensitive && (
											<Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700 text-xs">
												<AlertTriangle className="w-3 h-3 mr-1" />
												Sensitive
											</Badge>
										)}
									</div>
									<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
										<Clock className="w-3 h-3" />
										<span>{(comment as any).publishedTime}</span>
										{comment.sensitiveReason && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-amber-500 hover:text-amber-600">
															<HelpCircle className="w-3 h-3" />
														</Button>
													</TooltipTrigger>
													<TooltipContent className="max-w-xs bg-slate-900 text-white">
														<p className="text-xs">{comment.sensitiveReason}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
									</div>
								</div>
							</div>

							{/* Action buttons */}
							<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<translateFetcher.Form method="post" action="translate">
												<input type="hidden" name="index" value={index} />
												<input type="hidden" name="action" value="translate-single" />
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 transition-colors"
												>
													<Languages className="w-4 h-4" />
												</Button>
											</translateFetcher.Form>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-xs">Translate comment</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<splitFetcher.Form method="post" action="split-comment">
												<input type="hidden" name="index" value={index} />
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/50 dark:hover:text-purple-400 transition-colors"
												>
													<Split className="w-4 h-4" />
												</Button>
											</splitFetcher.Form>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-xs">Split comment</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<deleteFetcher.Form method="post" action="delete-comment">
												<input type="hidden" name="index" value={index} />
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
												>
													<Trash className="w-4 h-4" />
												</Button>
											</deleteFetcher.Form>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-xs">Delete comment</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>

						{/* Content */}
						<div className="space-y-4">
							{/* Original content */}
							<div className="relative">
								<div className="flex items-center gap-2 mb-2">
									<MessageSquare className="w-4 h-4 text-slate-500" />
									<span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Original</span>
								</div>
								<div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
									<p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">{comment.content}</p>
								</div>
							</div>

							{/* Translation */}
							<div className="relative">
								<div className="flex items-center gap-2 mb-2">
									<Languages className="w-4 h-4 text-blue-600" />
									<span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Translation</span>
								</div>

								{editingIndex === index ? (
									<div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 p-4">
										<Textarea
											value={editContent}
											onChange={(e) => setEditContent(e.target.value)}
											className="w-full bg-white dark:bg-slate-900 text-sm min-h-[100px] resize-y border-blue-200 dark:border-blue-800 focus:ring-blue-500 mb-3"
											placeholder="Enter translation..."
										/>
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={handleCancel}
												className="border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
											>
												<X className="w-4 h-4 mr-1" />
												Cancel
											</Button>
											<Button size="sm" onClick={() => handleSave(index)} className="bg-blue-600 hover:bg-blue-700 text-white">
												<Check className="w-4 h-4 mr-1" />
												Save
											</Button>
										</div>
									</div>
								) : (
									<div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 p-4">
										<div className="flex items-start gap-3">
											<div className="flex-1 min-w-0">
												{comment.translatedContent ? (
													<p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed break-words whitespace-pre-wrap">{comment.translatedContent}</p>
												) : (
													<p className="text-sm text-slate-500 dark:text-slate-400 italic">No translation available</p>
												)}
											</div>
											{comment.translatedContent && (
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0 flex-shrink-0 hover:bg-blue-200/50 hover:text-blue-700 dark:hover:bg-blue-800/50 dark:hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100"
																onClick={() => handleEdit(index, comment.translatedContent || '')}
															>
																<Pencil className="w-4 h-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-xs">Edit translation</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
