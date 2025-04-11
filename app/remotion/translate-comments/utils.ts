interface CalculateFontSizeParams {
	text: string
	availableWidth: number
	availableHeight: number
	minFontSize?: number
	maxFontSize?: number
	lineHeightRatio?: number
	charWidthRatio?: number
}

export function calculateOptimalFontSize({
	text,
	availableWidth,
	availableHeight,
	minFontSize = 10,
	maxFontSize = 60,
	lineHeightRatio = 1.1,
	charWidthRatio = 1.2,
}: CalculateFontSizeParams): number {
	let currentMin = minFontSize
	let currentMax = maxFontSize
	let fontSize = 50

	while (currentMax - currentMin > 1) {
		fontSize = Math.floor((currentMin + currentMax) / 2)

		const charsPerLine = Math.floor(availableWidth / (fontSize * charWidthRatio))
		const estimatedLines = Math.ceil(text.length / charsPerLine)
		const totalHeight = estimatedLines * fontSize * lineHeightRatio

		if (totalHeight > availableHeight) {
			currentMax = fontSize
		} else {
			currentMin = fontSize
		}
	}

	return currentMin
}
