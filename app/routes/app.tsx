import { NavLink, Outlet } from '@remix-run/react'
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Download,
	FileCheck,
	FileText,
	Languages,
	type LucideIcon,
	MessageCircle,
	MessageSquare,
	SquareChartGantt,
	Type,
	X,
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
		icon: Download,
		text: 'Downloads',
	},
	{
		to: '/app/translate-comment',
		title: 'Comment Translation',
		icon: MessageSquare,
		text: 'Comment Translation',
	},
	{
		to: '/app/general-comment',
		title: 'Twitter Comment',
		icon: X,
		text: 'Twitter Comment',
	},
	{
		to: '/app/translate-video',
		title: 'Video Translation',
		icon: Languages,
		text: 'Video Translation',
	},
	{
		to: '/app/subtitle-translations',
		title: 'Subtitle Translations',
		icon: FileText,
		text: 'Subtitle Translations',
	},
	{
		to: '/app/fill-in-blank',
		title: 'Fill in Blanks',
		icon: BookOpen,
		text: 'Fill in Blanks',
	},
	{
		to: '/app/cover-generator',
		title: 'Cover Generator',
		icon: SquareChartGantt,
		text: 'Cover Generator',
	},
	{
		to: '/app/dialogue',
		title: 'Dialogue',
		icon: MessageCircle,
		text: 'Dialogue',
	},
	{
		to: '/app/tasks',
		title: 'Tasks',
		icon: FileCheck,
		text: 'Tasks',
	},
]

export default function LayoutPage() {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

	return (
		<div className="flex h-screen bg-gray-50">
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
			`}</style>
			{/* Sidebar */}
			<div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r shadow-sm flex flex-col transition-all duration-300 relative`}>
				<div className="h-[85px] border-b relative">
					<div
						className={`absolute inset-0 p-4 transition-all duration-300 ${isSidebarCollapsed ? 'hidden' : 'block opacity-0 translate-x-4'} ${
							!isSidebarCollapsed ? 'animate-fadeIn' : ''
						}`}
						style={{
							animationDelay: '300ms',
							animationDuration: '300ms',
							animationFillMode: 'forwards',
						}}
					>
						<h1 className="text-xl font-semibold text-gray-800">Workspace</h1>
						<p className="text-sm text-gray-500 mt-1">Select a feature to use</p>
					</div>
				</div>

				{/* Toggle Button */}
				<button
					type="button"
					onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
					className="absolute -right-3 top-20 bg-white border rounded-full p-1 shadow-sm hover:bg-gray-50"
				>
					{isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
				</button>

				<nav className="flex-1 p-4 space-y-2 overflow-hidden">
					{menuItems.map((item) => {
						const Icon = item.icon
						return (
							<NavLink
								key={item.to}
								className={({ isActive }) => `
									flex items-center
									py-2 rounded-lg min-h-[40px] whitespace-nowrap
									${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}
									${isSidebarCollapsed ? 'px-2' : 'px-3'}
								`}
								to={item.to}
								title={item.title}
							>
								<div className={`flex items-center justify-center ${isSidebarCollapsed ? 'w-full' : ''}`}>
									<Icon size={20} />
								</div>
								<span
									className={`ml-3 transition-all duration-300 whitespace-nowrap ${
										isSidebarCollapsed ? 'opacity-0 translate-x-4 w-0 overflow-hidden' : 'opacity-100 translate-x-0 delay-150 w-auto'
									}`}
								>
									{item.text}
								</span>
							</NavLink>
						)
					})}
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-auto">
				<div className="max-w-[1600px] mx-auto p-6">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
