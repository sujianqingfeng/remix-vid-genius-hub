import { NavLink, Outlet } from '@remix-run/react'
import {
	ChevronLeft,
	ChevronRight,
	Download as DownloadIcon,
	FileText,
	FileVideo,
	GraduationCap,
	HelpCircle,
	Image,
	ListTodo,
	type LucideIcon,
	MessageCircleMore,
	MessagesSquare,
	Settings,
	Sparkles,
	Subtitles,
	Twitter,
	User,
	Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'

interface MenuItem {
	to: string
	title: string
	icon: LucideIcon
	text: string
	badge?: string
	description?: string
}

const menuItems: MenuItem[] = [
	{
		to: '/app/downloads',
		title: 'Downloads',
		icon: DownloadIcon,
		text: 'Downloads',
		description: 'Manage your downloads',
	},
	{
		to: '/app/translate-video',
		title: 'Video Translation',
		icon: FileVideo,
		text: 'Video Translation',
		description: 'AI-powered video translation',
	},
	{
		to: '/app/subtitle-translations',
		title: 'Subtitle Translations',
		icon: Subtitles,
		text: 'Subtitle Translations',
		description: 'Professional subtitle services',
	},
	{
		to: '/app/translate-comment',
		title: 'Comment Translation',
		icon: MessagesSquare,
		text: 'Comment Translation',
		description: 'Translate video comments',
	},
	{
		to: '/app/general-comment',
		title: 'Twitter Comment',
		icon: Twitter,
		text: 'Twitter Comment',
		description: 'Social media content',
	},
	{
		to: '/app/words',
		title: 'Words',
		icon: GraduationCap,
		text: 'Words',
		description: 'Vocabulary learning tools',
	},
	{
		to: '/app/cover-generator',
		title: 'Cover Generator',
		icon: Image,
		text: 'Cover Generator',
		description: 'Create stunning thumbnails',
	},
	{
		to: '/app/fill-in-blank',
		title: 'Fill in Blanks',
		icon: FileText,
		text: 'Fill in Blanks',
		description: 'Interactive learning exercises',
	},
	{
		to: '/app/dialogue',
		title: 'Dialogue',
		icon: MessageCircleMore,
		text: 'Dialogue',
		description: 'Conversation practice',
	},
	{
		to: '/app/tasks',
		title: 'Tasks',
		icon: ListTodo,
		text: 'Tasks',
		badge: 'New',
		description: 'Task management',
	},
]

export default function LayoutPage() {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

	return (
		<div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
			{/* Sidebar */}
			<div className={`${isSidebarCollapsed ? 'w-20' : 'w-80'} transition-all duration-300 ease-in-out relative z-10 flex flex-col`}>
				{/* Sidebar Background with Glass Effect */}
				<div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-large" />

				{/* Sidebar Content */}
				<div className="relative z-10 flex flex-col h-full">
					{/* Header */}
					<div className="h-20 border-b border-gray-200/50 flex items-center relative px-6">
						{!isSidebarCollapsed ? (
							<div className="flex items-center space-x-3">
								<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
									<Sparkles className="h-6 w-6 text-white" />
								</div>
								<div>
									<h1 className="text-lg font-bold text-gray-900">Video Genius Hub</h1>
									<p className="text-xs text-gray-500">AI-Powered Content Tools</p>
								</div>
							</div>
						) : (
							<div className="w-full flex justify-center">
								<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
									<Sparkles className="h-6 w-6 text-white" />
								</div>
							</div>
						)}

						{/* Toggle Button */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
							className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 p-0"
						>
							{isSidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
						</Button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
						{!isSidebarCollapsed && (
							<div className="px-3 mb-4">
								<p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Features</p>
							</div>
						)}

						{menuItems.map((item) => {
							const Icon = item.icon
							return (
								<NavLink
									key={item.to}
									className={({ isActive }) => `
										group flex items-center rounded-xl transition-all duration-200 relative
										${isActive ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}
										${isSidebarCollapsed ? 'p-3 justify-center' : 'p-3'}
									`}
									to={item.to}
									title={item.title}
								>
									{({ isActive }) => (
										<>
											{/* Active Indicator */}
											{isActive && !isSidebarCollapsed && (
												<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
											)}

											{/* Icon */}
											<div className={`flex items-center justify-center ${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} ${isActive ? 'text-blue-600' : ''}`}>
												<Icon className="w-full h-full" />
											</div>

											{/* Text Content */}
											{!isSidebarCollapsed && (
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between">
														<span className="font-medium text-sm truncate">{item.text}</span>
														{item.badge && (
															<span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">{item.badge}</span>
														)}
													</div>
													{item.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>}
												</div>
											)}

											{/* Hover Effect */}
											<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
										</>
									)}
								</NavLink>
							)
						})}
					</nav>

					{/* Bottom Section */}
					{!isSidebarCollapsed && (
						<div className="p-4 border-t border-gray-200/50 space-y-3">
							{/* Quick Actions */}
							<div className="flex space-x-2">
								<Button variant="ghost" size="sm" className="flex-1 h-9 text-xs">
									<Settings className="h-4 w-4 mr-1" />
									Settings
								</Button>
								<Button variant="ghost" size="sm" className="flex-1 h-9 text-xs">
									<HelpCircle className="h-4 w-4 mr-1" />
									Help
								</Button>
							</div>

							{/* Upgrade Card */}
							<div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white relative overflow-hidden">
								<div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
								<div className="relative z-10">
									<div className="flex items-center mb-2">
										<Zap className="h-4 w-4 mr-2" />
										<span className="text-sm font-semibold">Pro Features</span>
									</div>
									<p className="text-xs text-blue-100 mb-3">Unlock advanced AI capabilities and premium tools</p>
									<Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 h-7 text-xs">
										Upgrade Now
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-hidden flex flex-col">
				{/* Top Bar */}
				<div className="h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 shadow-sm">
					<div className="flex items-center space-x-4">
						<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
							<User className="h-4 w-4 text-gray-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">Welcome back!</p>
							<p className="text-xs text-gray-500">Ready to create amazing content?</p>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
							<span className="text-xs font-semibold text-white">U</span>
						</div>
					</div>
				</div>

				{/* Page Content */}
				<div className="flex-1 overflow-auto bg-gradient-to-br from-white/50 to-gray-50/50">
					<div className="max-w-[1400px] mx-auto p-6 lg:p-8">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
