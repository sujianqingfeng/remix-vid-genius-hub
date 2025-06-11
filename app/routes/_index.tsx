import { Link } from '@remix-run/react'
import { ArrowRight, Download, FileText, FileVideo, GraduationCap, Image as ImageIcon, Languages, ListTodo, MessageCircleMore, MessageSquare, Sparkles, Zap } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const features = [
	{
		icon: Download,
		title: 'Smart Downloads',
		description: 'Download and manage video content from various platforms with intelligent processing',
		href: '/app/downloads',
		gradient: 'from-blue-500 to-cyan-500',
	},
	{
		icon: FileVideo,
		title: 'Video Translation',
		description: 'Translate videos with AI-powered subtitle generation and voice synthesis',
		href: '/app/translate-video',
		gradient: 'from-purple-500 to-pink-500',
	},
	{
		icon: Languages,
		title: 'Subtitle Translation',
		description: 'Professional subtitle translation with timing optimization and formatting',
		href: '/app/subtitle-translations',
		gradient: 'from-green-500 to-emerald-500',
	},
	{
		icon: MessageSquare,
		title: 'Comment Translation',
		description: 'Translate and analyze comments with sentiment analysis and context awareness',
		href: '/app/translate-comment',
		gradient: 'from-orange-500 to-red-500',
	},
	{
		icon: GraduationCap,
		title: 'Learning Tools',
		description: 'Create educational content with vocabulary building and comprehension exercises',
		href: '/app/words',
		gradient: 'from-indigo-500 to-purple-500',
	},
	{
		icon: ImageIcon,
		title: 'Cover Generator',
		description: 'Generate stunning thumbnails and covers with AI-powered design tools',
		href: '/app/cover-generator',
		gradient: 'from-pink-500 to-rose-500',
	},
]

export default function IndexPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
			{/* Navigation */}
			<nav className="relative z-10 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
							<Sparkles className="h-6 w-6 text-white" />
						</div>
						<span className="text-xl font-bold text-gray-900">Video Genius Hub</span>
					</div>
					<Link to="/app/downloads">
						<Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
							Get Started
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative px-6 py-20 lg:py-32">
				<div className="max-w-7xl mx-auto text-center">
					{/* Floating Elements */}
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float" />
						<div
							className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-float"
							style={{ animationDelay: '2s' }}
						/>
						<div
							className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-xl animate-float"
							style={{ animationDelay: '4s' }}
						/>
					</div>

					<div className="relative z-10">
						<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-8">
							<Zap className="h-4 w-4 mr-2" />
							AI-Powered Content Processing
						</div>

						<h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
							Transform Your
							<span className="block text-gradient animate-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Video Content</span>
						</h1>

						<p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
							Powerful AI tools for video translation, subtitle generation, content analysis, and educational material creation. Everything you need to make your content globally
							accessible.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link to="/app/downloads">
								<Button
									size="lg"
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
								>
									Start Creating
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link to="/app/translate-video">
								<Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 hover:bg-gray-50 transition-all duration-300">
									Explore Features
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="px-6 py-20 bg-white/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to create, translate, and optimize your video content with cutting-edge AI technology</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => {
							const Icon = feature.icon
							return (
								<Link key={feature.href} to={feature.href}>
									<Card className="group h-full hover:shadow-large transition-all duration-500 hover:-translate-y-2 border-0 shadow-soft bg-white/80 backdrop-blur-sm hover:bg-white">
										<CardHeader className="pb-4">
											<div
												className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
											>
												<Icon className="h-7 w-7 text-white" />
											</div>
											<CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
										</CardContent>
									</Card>
								</Link>
							)
						})}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="px-6 py-20">
				<div className="max-w-4xl mx-auto text-center">
					<div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 lg:p-16 shadow-large relative overflow-hidden">
						{/* Background Pattern */}
						<div className="absolute inset-0 opacity-10">
							<div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
						</div>

						<div className="relative z-10">
							<h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Transform Your Content?</h2>
							<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of creators who are already using our AI-powered tools to reach global audiences</p>
							<Link to="/app/downloads">
								<Button
									size="lg"
									className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
								>
									Get Started Now
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="px-6 py-12 bg-gray-900 text-white">
				<div className="max-w-7xl mx-auto text-center">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
							<Sparkles className="h-5 w-5 text-white" />
						</div>
						<span className="text-lg font-semibold">Video Genius Hub</span>
					</div>
					<p className="text-gray-400">Empowering creators with AI-powered video processing tools</p>
				</div>
			</footer>
		</div>
	)
}
