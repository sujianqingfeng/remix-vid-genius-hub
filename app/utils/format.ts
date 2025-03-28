export const formatLikes = (count: number) => {
	if (count >= 10000) {
		return `${(count / 10000).toFixed(1)}w`
	}
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}k`
	}
	return count.toString()
}

export function formatSubTitleTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	const milliseconds = Math.floor((seconds % 1) * 1000)

	return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
}

export function formatAmountText(amount?: number) {
	if (!amount) {
		return ''
	}
	if (amount >= 1000000000) {
		return `${(amount / 1000000000).toFixed(1)}B`
	}
	if (amount >= 1000000) {
		return `${(amount / 1000000).toFixed(1)}M`
	}
	if (amount >= 1000) {
		return `${(amount / 1000).toFixed(1)}K`
	}
	return amount.toString()
}
