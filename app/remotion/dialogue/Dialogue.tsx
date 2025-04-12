import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { RemotionDialogue } from '~/types'

type DialogueProps = {
	dialogues: RemotionDialogue[]
}

export default function Dialogue({ dialogues }: DialogueProps) {
	const { fps } = useVideoConfig()
	const frame = useCurrentFrame()

	// Calculate duration based on fps (6 seconds * fps)
	const DIALOGUE_DURATION = 6 * fps

	return (
		<AbsoluteFill>
			<div className="bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 h-full w-full">
				{dialogues.map((dialogue, index) => {
					const startFrame = index * DIALOGUE_DURATION
					const isRole1 = dialogue.roleLabel === 1

					// Animation calculations
					const progress = Math.min(1, (frame - startFrame) / 30)
					const opacity = spring({ fps, frame: frame - startFrame, config: { damping: 15, mass: 0.8 } })
					const scale = spring({ fps, frame: frame - startFrame, from: 0.8, to: 1, config: { damping: 12 } })
					const avatarScale = spring({ fps, frame: frame - startFrame, from: 0.5, to: 1, config: { damping: 14 } })

					return (
						<Sequence key={`${dialogue.roleLabel}-${dialogue.content}-${index}`} from={startFrame} durationInFrames={DIALOGUE_DURATION}>
							<div className="absolute inset-0 flex flex-col justify-between px-24 py-36">
								{/* Avatar */}
								<div
									className={`absolute ${isRole1 ? 'left-8 top-16' : 'right-8 bottom-16'}`}
									style={{
										opacity,
										transform: `scale(${avatarScale})`,
									}}
								>
									<div
										className={`
											h-32 w-32 
											rounded-full 
											overflow-hidden
											border-4 
											${isRole1 ? 'border-blue-400' : 'border-gray-200'}
											shadow-lg
											flex items-center justify-center
											${isRole1 ? 'bg-blue-100' : 'bg-gray-100'}
										`}
									>
										{isRole1 ? (
											// First avatar - blue themed professional
											<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-labelledby="avatar1Title">
												<title id="avatar1Title">Professional Avatar</title>

												{/* Background */}
												<circle cx="50" cy="50" r="50" fill="#3B82F6" />

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
												<circle cx="50" cy="50" r="50" fill="#9CA3AF" />

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

								{/* Dialogue bubble */}
								<div
									className={`
									max-w-[65%] 
									${isRole1 ? 'self-start ml-52 mt-16 mb-auto' : 'self-end mr-52 mb-16 mt-auto'}
									p-10
									rounded-3xl 
									shadow-2xl
									${isRole1 ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'bg-gradient-to-r from-white to-gray-50 text-gray-800'}
									border-2 ${isRole1 ? 'border-blue-400' : 'border-gray-200'}
									backdrop-blur-md
									relative
								`}
									style={{
										opacity,
										transform: `scale(${scale})`,
										boxShadow: isRole1
											? '0 20px 25px -5px rgba(59, 130, 246, 0.25), 0 8px 10px -6px rgba(59, 130, 246, 0.1)'
											: '0 20px 25px -5px rgba(107, 114, 128, 0.15), 0 8px 10px -6px rgba(107, 114, 128, 0.1)',
									}}
								>
									{/* Triangle tip for dialogue bubble */}
									<div
										className={`
											absolute 
											w-6 h-6 
											transform rotate-45
											${isRole1 ? 'bg-blue-600 -left-3 top-10' : 'bg-white -right-3 bottom-10'}
											border-2
											${isRole1 ? 'border-blue-400 border-r-0 border-t-0' : 'border-gray-200 border-l-0 border-b-0'}
										`}
									/>

									<p className={`m-0 text-4xl font-semibold leading-relaxed tracking-wide ${isRole1 ? 'text-white' : 'text-gray-800'}`}>{dialogue.content}</p>
									<p className={`mt-6 text-2xl font-medium ${isRole1 ? 'text-blue-100' : 'text-gray-600'}`}>{dialogue.contentZh}</p>
								</div>
							</div>
							{dialogue.publicAudioPath && <Audio src={staticFile(dialogue.publicAudioPath)} />}
						</Sequence>
					)
				})}
			</div>
		</AbsoluteFill>
	)
}
