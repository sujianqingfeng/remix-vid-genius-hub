import { Composition } from 'remotion'
import Words from './Words'

export function RemotionRoot() {
	return (
		<>
			<Composition id="Words" component={Words} durationInFrames={60 * 20} fps={60} width={1920} height={1080} defaultProps={{ wordSentences: [] }} />
		</>
	)
}
