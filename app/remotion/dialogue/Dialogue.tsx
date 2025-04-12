import { AbsoluteFill, Audio, Sequence, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { RemotionDialogue } from '~/types'

type DialogueProps = {
	dialogues: RemotionDialogue[]
}

export default function Dialogue({ dialogues }: DialogueProps) {
	const { fps, width, height } = useVideoConfig()
	const frame = useCurrentFrame()

	// Calculate duration based on fps (6 seconds * fps)
	const DIALOGUE_DURATION = 6 * fps

	return (
		<AbsoluteFill>
			{/* Background with subtle pattern */}
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
				{/* Decorative elements */}
				{Array.from({ length: 8 }).map((_, i) => {
					const size = 20 + random(i) * 150
					const x = random(i * 2) * width
					const y = random(i * 3) * height
					const opacity = 0.03 + random(i) * 0.05
					const rotation = random(i) * 360

					return (
						<div
							key={`decorative-element-${i}-${size}-${x.toFixed(0)}`}
							className="absolute rounded-full"
							style={{
								width: size,
								height: size,
								left: x,
								top: y,
								background: i % 2 === 0 ? 'linear-gradient(45deg, #4F46E5, #818CF8)' : 'linear-gradient(45deg, #C084FC, #F0ABFC)',
								opacity,
								transform: `rotate(${rotation}deg)`,
							}}
						/>
					)
				})}

				{/* Content container */}
				<div className="absolute inset-0 flex items-center justify-center">
					{dialogues.map((dialogue, index) => {
						const startFrame = index * DIALOGUE_DURATION
						const isRole1 = dialogue.roleLabel === 1

						// Animation calculations
						const opacity = spring({ fps, frame: frame - startFrame, config: { damping: 15, mass: 0.8 } })
						const scale = spring({ fps, frame: frame - startFrame, from: 0.8, to: 1, config: { damping: 12 } })
						const slideY = spring({ fps, frame: frame - startFrame, from: 50, to: 0, config: { damping: 12 } })
						const avatarScale = spring({ fps, frame: frame - startFrame, from: 0.5, to: 1, config: { damping: 14 } })
						const avatarRotate = spring({ fps, frame: frame - startFrame, from: isRole1 ? -15 : 15, to: 0, config: { damping: 10 } })

						// Random offset for natural feel
						const randomOffset = (random(index) * 2 - 1) * 20

						return (
							<Sequence key={`${dialogue.roleLabel}-${dialogue.content}-${index}`} from={startFrame} durationInFrames={DIALOGUE_DURATION}>
								<div
									className="absolute inset-0 px-20 py-16 flex flex-col"
									style={{
										justifyContent: isRole1 ? 'flex-start' : 'flex-end',
										alignItems: isRole1 ? 'flex-start' : 'flex-end',
									}}
								>
									{/* Card Container */}
									<div
										className={`
											relative
											max-w-[80%]
											${isRole1 ? 'ml-12 mt-12' : 'mr-12 mb-12'}
											rounded-2xl
											shadow-2xl
											bg-white/90
											backdrop-blur-lg
											p-1
											overflow-hidden
										`}
										style={{
											opacity,
											transform: `scale(${scale}) translateY(${slideY}px) translateX(${randomOffset}px)`,
											boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
										}}
									>
										{/* Colored accent on top/bottom */}
										<div
											className={`
												absolute 
												${isRole1 ? 'top-0 left-0 right-0 h-2' : 'bottom-0 left-0 right-0 h-2'}
												${isRole1 ? 'bg-gradient-to-r from-blue-600 to-indigo-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}
											`}
										/>

										{/* Card content */}
										<div className="p-8 pt-10">
											{/* Avatar and content layout */}
											<div className={`flex ${isRole1 ? 'flex-row' : 'flex-row-reverse'} items-start gap-6`}>
												{/* Avatar */}
												<div
													className="flex-shrink-0"
													style={{
														transform: `scale(${avatarScale}) rotate(${avatarRotate}deg)`,
													}}
												>
													<div
														className={`
															h-28 w-28
															rounded-xl
															overflow-hidden
															shadow-lg
															border-2
															${isRole1 ? 'border-blue-300' : 'border-purple-300'}
															flex items-center justify-center
															${isRole1 ? 'bg-blue-50' : 'bg-purple-50'}
															transform
															${isRole1 ? 'rotate-3' : '-rotate-3'}
														`}
													>
														{isRole1 ? (
															// First avatar - blue themed professional
															<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-labelledby="avatar1Title">
																<title id="avatar1Title">Professional Avatar</title>

																{/* Background */}
																<circle cx="50" cy="50" r="45" fill="#EFF6FF" />
																<circle cx="50" cy="50" r="50" fill="#3B82F6" fillOpacity="0.2" />

																{/* Face */}
																<circle cx="50" cy="45" r="25" fill="#EFF6FF" />

																{/* Eyes */}
																<circle cx="40" cy="40" r="3" fill="#1E40AF" />
																<circle cx="60" cy="40" r="3" fill="#1E40AF" />

																{/* Eyebrows */}
																<path d="M35 35 Q40 32, 45 35" stroke="#1E40AF" strokeWidth="2" fill="transparent" />
																<path d="M55 35 Q60 32, 65 35" stroke="#1E40AF" strokeWidth="2" fill="transparent" />

																{/* Smile */}
																<path d="M40 50 Q50 60, 60 50" stroke="#1E40AF" strokeWidth="2" fill="transparent" />

																{/* Hair */}
																<path d="M25 30 Q50 10, 75 30 L75 40 Q50 20, 25 40 Z" fill="#1E3A8A" />

																{/* Suit */}
																<path d="M25 85 L40 70 L50 75 L60 70 L75 85 L75 100 L25 100 Z" fill="#1E3A8A" />
																<rect x="45" y="70" width="10" height="20" fill="#EFF6FF" />
															</svg>
														) : (
															// Second avatar - casual style
															<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-labelledby="avatar2Title">
																<title id="avatar2Title">Casual Avatar</title>

																{/* Background */}
																<circle cx="50" cy="50" r="45" fill="#F3F4F6" />
																<circle cx="50" cy="50" r="50" fill="#C084FC" fillOpacity="0.2" />

																{/* Face */}
																<circle cx="50" cy="45" r="25" fill="#F3F4F6" />

																{/* Eyes */}
																<circle cx="40" cy="40" r="3" fill="#4B5563" />
																<circle cx="60" cy="40" r="3" fill="#4B5563" />

																{/* Eyebrows */}
																<path d="M35 35 Q40 33, 45 35" stroke="#4B5563" strokeWidth="2" fill="transparent" />
																<path d="M55 35 Q60 33, 65 35" stroke="#4B5563" strokeWidth="2" fill="transparent" />

																{/* Smile */}
																<path d="M35 50 Q50 58, 65 50" stroke="#4B5563" strokeWidth="2" fill="transparent" />

																{/* Hair */}
																<path d="M30 25 C30 15, 70 15, 70 25 C75 35, 65 40, 60 38 L40 38 C35 40, 25 35, 30 25" fill="#6B7280" />

																{/* Casual clothes */}
																<path d="M35 75 L30 100 L70 100 L65 75 L50 85 Z" fill="#6B7280" />
																<path d="M35 75 L65 75 L60 68 L40 68 Z" fill="#E5E7EB" />
															</svg>
														)}
													</div>
												</div>

												{/* Content with text */}
												<div
													className={`
													flex-1
													${isRole1 ? 'text-left' : 'text-right'}
													p-2
												`}
												>
													<p
														className={`
														text-4xl 
														font-semibold 
														leading-relaxed 
														tracking-wide 
														${isRole1 ? 'text-blue-900' : 'text-purple-900'}
													`}
													>
														{dialogue.content}
													</p>
													<p
														className={`
														mt-4 
														text-2xl 
														font-medium 
														${isRole1 ? 'text-blue-700' : 'text-purple-700'}
													`}
													>
														{dialogue.contentZh}
													</p>
												</div>
											</div>

											{/* Time indicator */}
											<div
												className={`
												mt-6 
												text-lg 
												font-medium 
												${isRole1 ? 'text-right text-blue-400' : 'text-left text-purple-400'}
												opacity-70
											`}
											>
												{(isRole1 ? '09:' : '09:') + (10 + index).toString().padStart(2, '0')}
											</div>
										</div>
									</div>
								</div>
								{dialogue.publicAudioPath && <Audio src={staticFile(dialogue.publicAudioPath)} />}
							</Sequence>
						)
					})}
				</div>
			</div>
		</AbsoluteFill>
	)
}
