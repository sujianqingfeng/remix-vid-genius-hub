import { NavLink, Outlet } from '@remix-run/react'
import {
	ChevronLeft,
	ChevronRight,
	Download as DownloadIcon,
	FileText,
	FileVideo,
	GraduationCap,
	Image,
	ListTodo,
	type LucideIcon,
	MessageCircleMore,
	MessagesSquare,
	Subtitles,
	Twitter,
	Type,
} from 'lucide-react'
import { useState } from 'react'

interface MenuItem {
	to: string
	title: string
	icon: LucideIcon
	text: string
}

const menuItems: MenuItem[] = [
	{
		to: '/app/downloads',
		title: 'Downloads',
		icon: DownloadIcon,
		text: 'Downloads',
	},
	{
		to: '/app/translate-video',
		title: 'Video Translation',
		icon: FileVideo,
		text: 'Video Translation',
	},
	{
		to: '/app/subtitle-translations',
		title: 'Subtitle Translations',
		icon: Subtitles,
		text: 'Subtitle Translations',
	},
	{
		to: '/app/translate-comment',
		title: 'Comment Translation',
		icon: MessagesSquare,
		text: 'Comment Translation',
	},
	{
		to: '/app/general-comment',
		title: 'Twitter Comment',
		icon: Twitter,
		text: 'Twitter Comment',
	},
	{
		to: '/app/words',
		title: 'Words',
		icon: GraduationCap,
		text: 'Words',
	},
	{
		to: '/app/cover-generator',
		title: 'Cover Generator',
		icon: Image,
		text: 'Cover Generator',
	},
	{
		to: '/app/fill-in-blank',
		title: 'Fill in Blanks',
		icon: FileText,
		text: 'Fill in Blanks',
	},
	{
		to: '/app/dialogue',
		title: 'Dialogue',
		icon: MessageCircleMore,
		text: 'Dialogue',
	},
	{
		to: '/app/tasks',
		title: 'Tasks',
		icon: ListTodo,
		text: 'Tasks',
	},
]

export default function LayoutPage() {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

	return (
		<div className="flex h-screen bg-gray-50/50">
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateX(1rem);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				.animate-fadeIn {
					animation: fadeIn ease;
				}
				
				.nav-link-active {
					position: relative;
				}
				
				.nav-link-active::before {
					content: '';
					position: absolute;
					left: 0;
					top: 8px;
					bottom: 8px;
					width: 3px;
					background: #3b82f6;
					border-radius: 0 4px 4px 0;
				}
			`}</style>
			{/* Sidebar */}
			<div className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 ease-in-out relative z-10`}>
				<div className="h-[85px] border-b border-gray-200 flex items-center relative">
					<div
						className={`absolute inset-0 p-5 transition-all duration-300 ${
							isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
						} ${!isSidebarCollapsed ? 'animate-fadeIn' : ''}`}
						style={{
							animationDelay: '150ms',
							animationDuration: '300ms',
							animationFillMode: 'forwards',
						}}
					>
						<h1 className="text-xl font-semibold text-gray-800">Workspace</h1>
						<p className="text-sm text-gray-500 mt-1">Select a feature to use</p>
					</div>
					{isSidebarCollapsed && (
						<div className="w-full flex justify-center">
							<div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
								<Type size={20} />
							</div>
						</div>
					)}
				</div>

				{/* Toggle Button */}
				<button
					type="button"
					onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
					className="absolute -right-3.5 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors z-20"
					aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
				</button>

				<nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
					{menuItems.map((item) => {
						const Icon = item.icon
						return (
							<NavLink
								key={item.to}
								className={({ isActive }) => `
									flex items-center
									py-2.5 rounded-lg min-h-[44px] whitespace-nowrap transition-all
									${isActive ? 'bg-blue-50 text-blue-600 font-medium nav-link-active' : 'text-gray-600 hover:bg-gray-100'}
									${isSidebarCollapsed ? 'px-2 justify-center' : 'px-4'}
								`}
								to={item.to}
								title={item.title}
							>
								<div className={`flex items-center justify-center ${isSidebarCollapsed ? 'w-8 h-8' : ''}`}>
									<Icon size={isSidebarCollapsed ? 22 : 18} />
								</div>
								<span className={`ml-3 transition-all duration-300 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 delay-100 w-auto'}`}>
									{item.text}
								</span>
							</NavLink>
						)
					})}
				</nav>

				{!isSidebarCollapsed && (
					<div className="p-4 border-t border-gray-200 mt-auto">
						<div className="p-3 bg-blue-50 rounded-lg">
							<p className="text-sm text-blue-800 font-medium">Need help?</p>
							<p className="text-xs text-blue-600 mt-1">Check our documentation for guidance</p>
						</div>
					</div>
				)}
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-auto">
				<div className="max-w-[1600px] mx-auto p-6 md:p-8">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
