import { Link } from '@remix-run/react'
import { ArrowRight, Download, FileText, FileVideo, GraduationCap, Image as ImageIcon, Languages, MessageCircleMore, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const features = [
	{
		icon: Download,
		title: 'Smart Downloads',
		description: 'Download and manage video content from various platforms with intelligent processing',
		href: '/app/downloads',
	},
	{
		icon: FileVideo,
		title: 'Video Translation',
		description: 'Translate videos with AI-powered subtitle generation and voice synthesis',
		href: '/app/translate-video',
	},
	{
		icon: Languages,
		title: 'Subtitle Translation',
		description: 'Professional subtitle translation with timing optimization and formatting',
		href: '/app/subtitle-translations',
	},
	{
		icon: MessageSquare,
		title: 'Comment Translation',
		description: 'Translate and analyze comments with sentiment analysis and context awareness',
		href: '/app/translate-comment',
	},
	{
		icon: GraduationCap,
		title: 'Learning Tools',
		description: 'Create educational content with vocabulary building and comprehension exercises',
		href: '/app/words',
	},
	{
		icon: ImageIcon,
		title: 'Cover Generator',
		description: 'Generate stunning thumbnails and covers with AI-powered design tools',
		href: '/app/cover-generator',
	},
]

export default function IndexPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="relative z-10 px-6 py-6">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
							<Sparkles className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="text-xl font-semibold text-foreground">Video Genius Hub</span>
					</div>
					<Link to="/app/downloads">
						<Button className="shadow-soft">
							Get Started
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative px-6 py-20 lg:py-32">
				<div className="max-w-4xl mx-auto text-center">
					<div className="animate-fade-in">
						<div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-8">AI-Powered Content Processing</div>

						<h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
							Transform Your
							<span className="block text-primary">Video Content</span>
						</h1>

						<p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed text-balance">
							Powerful AI tools for video translation, subtitle generation, content analysis, and educational material creation. Everything you need to make your content globally
							accessible.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link to="/app/downloads">
								<Button size="lg" className="px-8 py-3 shadow-medium">
									Start Creating
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link to="/app/translate-video">
								<Button variant="outline" size="lg" className="px-8 py-3">
									Explore Features
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="px-6 py-20 bg-muted/30">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16 animate-slide-up">
						<h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
							Everything you need to create, translate, and optimize your video content with cutting-edge AI technology
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => {
							const Icon = feature.icon
							return (
								<Link key={feature.href} to={feature.href}>
									<Card className="group h-full hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card">
										<CardHeader className="pb-4">
											<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
												<Icon className="h-6 w-6 text-primary" />
											</div>
											<CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{feature.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-muted-foreground leading-relaxed">{feature.description}</CardDescription>
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
					<div className="bg-primary rounded-2xl p-12 lg:p-16 shadow-large relative overflow-hidden">
						<div className="relative z-10">
							<h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6 text-balance">Ready to Transform Your Content?</h2>
							<p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-balance">
								Join thousands of creators who are already using our AI-powered tools to reach global audiences
							</p>
							<Link to="/app/downloads">
								<Button size="lg" variant="secondary" className="px-8 py-3 shadow-medium">
									Get Started Now
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="px-6 py-12 bg-muted/50 border-t border-border">
				<div className="max-w-7xl mx-auto text-center">
					<div className="flex items-center justify-center space-x-3 mb-4">
						<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
							<Sparkles className="h-4 w-4 text-primary-foreground" />
						</div>
						<span className="text-lg font-semibold text-foreground">Video Genius Hub</span>
					</div>
					<p className="text-muted-foreground">Empowering creators with AI-powered video processing tools</p>
				</div>
			</footer>
		</div>
	)
}
