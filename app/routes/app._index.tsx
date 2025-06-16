import { Link, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import { desc } from 'drizzle-orm'
import { ArrowRight, BookOpen, Clock, Download, FileVideo, Languages, MessageSquare, Play, Plus, Sparkles, Subtitles, Target, TrendingUp, Users, Video, Zap } from 'lucide-react'
import { PageHeader } from '~/components/PageHeader'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db, schema } from '~/lib/drizzle'

export const loader = async () => {
	// Get recent activity from all modules
	const [translateVideos, subtitleTranslations, generalComments, translateComments, fillInBlanks, dialogues, downloads, tasks] = await Promise.all([
		db.query.translateVideos.findMany({
			orderBy: desc(schema.translateVideos.createdAt),
			limit: 5,
		}),
		db.query.subtitleTranslations.findMany({
			orderBy: desc(schema.subtitleTranslations.createdAt),
			limit: 5,
		}),
		db.query.generalComments.findMany({
			orderBy: desc(schema.generalComments.createdAt),
			limit: 5,
		}),
		db.query.translateComments.findMany({
			orderBy: desc(schema.translateComments.createdAt),
			limit: 5,
		}),
		db.query.fillInBlanks.findMany({
			orderBy: desc(schema.fillInBlanks.createdAt),
			limit: 5,
		}),
		db.query.dialogues.findMany({
			orderBy: desc(schema.dialogues.createdAt),
			limit: 5,
		}),
		db.query.downloads.findMany({
			orderBy: desc(schema.downloads.createdAt),
			limit: 5,
		}),
		db.query.tasks.findMany({
			orderBy: desc(schema.tasks.createdAt),
			limit: 5,
		}),
	])

	return {
		stats: {
			translateVideos: translateVideos.length,
			subtitleTranslations: subtitleTranslations.length,
			generalComments: generalComments.length,
			translateComments: translateComments.length,
			fillInBlanks: fillInBlanks.length,
			dialogues: dialogues.length,
			downloads: downloads.length,
			tasks: tasks.length,
		},
		recentActivity: [
			...translateVideos.map((item) => ({ ...item, type: 'video-translation' })),
			...subtitleTranslations.map((item) => ({ ...item, type: 'subtitle-translation' })),
			...generalComments.map((item) => ({ ...item, type: 'general-comment' })),
			...translateComments.map((item) => ({ ...item, type: 'comment-translation' })),
			...fillInBlanks.map((item) => ({ ...item, type: 'fill-in-blank' })),
			...dialogues.map((item) => ({ ...item, type: 'dialogue' })),
		]
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 10),
	}
}

export default function AppDashboard() {
	const { stats, recentActivity } = useLoaderData<typeof loader>()

	const features = [
		{
			title: 'Video Translation',
			description: 'Transform videos with AI-powered translation and dubbing',
			icon: Video,
			href: '/app/translate-video',
			color: 'from-blue-500 to-cyan-500',
			bgColor: 'from-blue-50 to-cyan-50',
			count: stats.translateVideos,
		},
		{
			title: 'Subtitle Translation',
			description: 'Generate and translate subtitles with precision',
			icon: Subtitles,
			href: '/app/subtitle-translations',
			color: 'from-green-500 to-emerald-500',
			bgColor: 'from-green-50 to-emerald-50',
			count: stats.subtitleTranslations,
		},
		{
			title: 'General Comments',
			description: 'Create engaging comment-based content',
			icon: MessageSquare,
			href: '/app/general-comment',
			color: 'from-purple-500 to-violet-500',
			bgColor: 'from-purple-50 to-violet-50',
			count: stats.generalComments,
		},
		{
			title: 'Comment Translation',
			description: 'Transform social media comments into videos',
			icon: MessageSquare,
			href: '/app/translate-comment',
			color: 'from-pink-500 to-rose-500',
			bgColor: 'from-pink-50 to-rose-50',
			count: stats.translateComments,
		},
		{
			title: 'Fill in Blanks',
			description: 'Create interactive educational exercises',
			icon: BookOpen,
			href: '/app/fill-in-blank',
			color: 'from-orange-500 to-amber-500',
			bgColor: 'from-orange-50 to-amber-50',
			count: stats.fillInBlanks,
		},
		{
			title: 'Dialogues',
			description: 'Build engaging conversation exercises',
			icon: Users,
			href: '/app/dialogue',
			color: 'from-indigo-500 to-purple-500',
			bgColor: 'from-indigo-50 to-purple-50',
			count: stats.dialogues,
		},
	]

	const getActivityTitle = (activity: any) => {
		switch (activity.type) {
			case 'video-translation':
				return activity.title || `Video ${activity.id.slice(0, 8)}`
			case 'subtitle-translation':
				return activity.title || `Subtitle ${activity.id.slice(0, 8)}`
			case 'general-comment': {
				const typeInfo = activity.typeInfo as any
				return typeInfo?.title || `Comment ${activity.id.slice(0, 8)}`
			}
			case 'comment-translation':
				return activity.translatedTitle || `Comment Project ${activity.id.slice(0, 8)}`
			case 'fill-in-blank':
				return `Exercise ${activity.id.slice(0, 8)}`
			case 'dialogue':
				return `Dialogue ${activity.id.slice(0, 8)}`
			default:
				return `Item ${activity.id.slice(0, 8)}`
		}
	}

	const getActivityHref = (activity: any) => {
		switch (activity.type) {
			case 'video-translation':
				return `/app/translate-video/${activity.id}`
			case 'subtitle-translation':
				return `/app/subtitle-translations/${activity.id}`
			case 'general-comment':
				return `/app/general-comment/${activity.id}`
			case 'comment-translation':
				return `/app/translate-comment/${activity.id}`
			case 'fill-in-blank':
				return `/app/fill-in-blank/${activity.id}`
			case 'dialogue':
				return `/app/dialogue/${activity.id}`
			default:
				return '#'
		}
	}

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'video-translation':
				return Video
			case 'subtitle-translation':
				return Subtitles
			case 'general-comment':
				return MessageSquare
			case 'comment-translation':
				return MessageSquare
			case 'fill-in-blank':
				return BookOpen
			case 'dialogue':
				return Users
			default:
				return FileVideo
		}
	}

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<PageHeader title="Dashboard" description="Welcome to your AI-powered video content creation hub">
				<div className="flex gap-3">
					<Link to="/app/downloads">
						<Button variant="outline" className="shadow-soft">
							<Download className="h-4 w-4 mr-2" />
							Downloads
						</Button>
					</Link>
					<Link to="/app/tasks">
						<Button variant="outline" className="shadow-soft">
							<Clock className="h-4 w-4 mr-2" />
							Tasks
						</Button>
					</Link>
				</div>
			</PageHeader>

			{/* Quick Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground">Total Projects</p>
								<p className="text-2xl font-bold text-foreground">{Object.values(stats).reduce((sum, count) => sum + count, 0)}</p>
							</div>
							<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
								<Sparkles className="h-4 w-4 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground">Downloads</p>
								<p className="text-2xl font-bold text-foreground">{stats.downloads}</p>
							</div>
							<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
								<Download className="h-4 w-4 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground">Active Tasks</p>
								<p className="text-2xl font-bold text-foreground">{stats.tasks}</p>
							</div>
							<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
								<Zap className="h-4 w-4 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-soft bg-card/50">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground">Success Rate</p>
								<p className="text-2xl font-bold text-foreground">98%</p>
							</div>
							<div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
								<Target className="h-4 w-4 text-success" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Features Grid */}
			<div>
				<h2 className="text-xl font-semibold text-foreground mb-6">Features</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature) => {
						const Icon = feature.icon
						return (
							<Link key={feature.href} to={feature.href}>
								<Card className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
									<CardHeader className="pb-3">
										<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
											<Icon className="h-6 w-6 text-primary" />
										</div>
										<CardTitle className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors">{feature.title}</CardTitle>
										<CardDescription className="text-sm text-muted-foreground">{feature.description}</CardDescription>
									</CardHeader>

									<CardContent className="pt-0">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Badge variant="secondary" className="bg-muted text-muted-foreground">
													{feature.count} projects
												</Badge>
											</div>
											<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
										</div>
									</CardContent>
								</Card>
							</Link>
						)
					})}
				</div>
			</div>

			{/* Recent Activity */}
			<div>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
					<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
						View All
						<ArrowRight className="h-3 w-3 ml-1" />
					</Button>
				</div>

				{recentActivity.length === 0 ? (
					<Card className="border-border/50 shadow-soft">
						<CardContent className="p-8">
							<div className="text-center">
								<div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
									<Clock className="h-8 w-8 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-semibold text-foreground mb-2">No recent activity</h3>
								<p className="text-muted-foreground mb-4">Start creating content to see your recent projects here.</p>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-3">
						{recentActivity.map((activity) => {
							const Icon = getActivityIcon(activity.type)
							return (
								<Link key={`${activity.type}-${activity.id}`} to={getActivityHref(activity)}>
									<Card className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-200 hover:bg-muted/20">
										<CardContent className="p-4">
											<div className="flex items-center gap-4">
												<div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
													<Icon className="h-5 w-5 text-muted-foreground" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="font-medium text-foreground truncate">{getActivityTitle(activity)}</p>
													<p className="text-sm text-muted-foreground capitalize">{activity.type.replace('-', ' ')}</p>
												</div>
												<div className="text-right">
													<p className="text-sm text-muted-foreground">{format(new Date(activity.createdAt), 'MMM dd')}</p>
													<p className="text-xs text-muted-foreground/70">{format(new Date(activity.createdAt), 'HH:mm')}</p>
												</div>
												<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
											</div>
										</CardContent>
									</Card>
								</Link>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
