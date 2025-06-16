import type { ReactNode } from 'react'

interface PageHeaderProps {
	title: string
	description?: string
	children?: ReactNode
	className?: string
}

export function PageHeader({ title, description, children, className = '' }: PageHeaderProps) {
	return (
		<div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${className}`}>
			<div>
				<h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
				{description && <p className="text-lg text-muted-foreground">{description}</p>}
			</div>
			{children && <div className="flex items-center gap-3">{children}</div>}
		</div>
	)
}
