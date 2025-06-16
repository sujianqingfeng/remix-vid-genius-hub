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
		<div className="flex h-screen bg-background">
			{/* Sidebar */}
			<div
				className={`${isSidebarCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 ease-in-out relative z-10 flex flex-col border-r border-border bg-card/50 backdrop-blur-sm`}
			>
				{/* Sidebar Content */}
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="h-16 border-b border-border flex items-center relative px-4">
						{!isSidebarCollapsed ? (
							<div className="flex items-center space-x-3">
								<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
									<Sparkles className="h-4 w-4 text-primary-foreground" />
								</div>
								<div>
									<h1 className="text-sm font-semibold text-foreground">Video Genius Hub</h1>
									<p className="text-xs text-muted-foreground">AI-Powered Content Tools</p>
								</div>
							</div>
						) : (
							<div className="w-full flex justify-center">
								<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
									<Sparkles className="h-4 w-4 text-primary-foreground" />
								</div>
							</div>
						)}

						{/* Toggle Button */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
							className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-background border border-border shadow-sm hover:shadow-md transition-all duration-200 p-0"
						>
							{isSidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
						</Button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
						{!isSidebarCollapsed && (
							<div className="px-3 mb-4">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Features</p>
							</div>
						)}

						{menuItems.map((item) => {
							const Icon = item.icon
							return (
								<NavLink
									key={item.to}
									className={({ isActive }) => `
										group flex items-center rounded-lg transition-all duration-200 relative
										${isActive ? 'bg-primary/10 text-primary accent-border' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
										${isSidebarCollapsed ? 'p-2 justify-center' : 'p-2'}
									`}
									to={item.to}
									title={item.title}
								>
									{({ isActive }) => (
										<>
											{/* Icon */}
											<div className={`flex items-center justify-center ${isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'}`}>
												<Icon className="w-full h-full" />
											</div>

											{/* Text Content */}
											{!isSidebarCollapsed && (
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between">
														<span className="font-medium text-sm truncate">{item.text}</span>
														{item.badge && <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">{item.badge}</span>}
													</div>
													{item.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>}
												</div>
											)}
										</>
									)}
								</NavLink>
							)
						})}
					</nav>

					{/* Bottom Section */}
					{!isSidebarCollapsed && (
						<div className="p-3 border-t border-border space-y-3">
							{/* Quick Actions */}
							<div className="flex space-x-2">
								<Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
									<Settings className="h-3 w-3 mr-1" />
									Settings
								</Button>
								<Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
									<HelpCircle className="h-3 w-3 mr-1" />
									Help
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-hidden flex flex-col">
				{/* Top Bar */}
				<div className="h-14 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-6">
					<div className="flex items-center space-x-3">
						<div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
							<User className="h-4 w-4 text-muted-foreground" />
						</div>
						<div>
							<p className="text-sm font-medium text-foreground">Welcome back!</p>
							<p className="text-xs text-muted-foreground">Ready to create amazing content?</p>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
							<span className="text-xs font-medium text-primary-foreground">U</span>
						</div>
					</div>
				</div>

				{/* Page Content */}
				<div className="flex-1 overflow-auto bg-background">
					<div className="max-w-[1400px] mx-auto p-6 lg:p-8">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
