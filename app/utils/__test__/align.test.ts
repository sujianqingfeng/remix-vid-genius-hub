import fsp from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { alignWordsAndSentences, splitTextToSentences, splitTextToSentencesWithAI } from '../align'

const getWords = async () => {
	const currentDir = import.meta.dirname
	const p = path.join(currentDir, './test.json')
	const result = await fsp.readFile(p, 'utf-8')
	const data = JSON.parse(result)

	const words = data.transcription.map((item: any) => ({
		word: item.text,
		start: item.offsets.from / 1000,
		end: item.offsets.to / 1000,
	}))

	const text = words.reduce((acc: string, item: any) => {
		return acc + item.word
	}, '')

	return { words, text }
}

describe(
	'align',
	() => {
		it('splitTextToSentences', async () => {
			const { text, words } = await getWords()
			// console.log(text)
			// const sentences = await splitTextToSentencesWithAI(text)
			// expect(sentences).toMatchInlineSnapshot(`

			// `)

			const sentences = [
				"It's the moment we've all been waiting for.",
				'A brand new, game-changing, blazingly fast JavaScript framework just hit the timeline.',
				'Yesterday, ByteDance, the company that gave the world the gift of social media crack via TikTok,',
				'gave the world another gift in the form of an open-source, multi-platform app development framework called Lynx.',
				'Developers can throw fossilized relics like React Native and Flutter in the garbage',
				'and rewrite their native mobile apps from scratch with shiny new Rust-based tooling',
				'and a high-performance, dual-threaded UI rendering engine.',
				'Like React Native, it empowers web developers to build shoddy iOS and Android apps with JavaScript,',
				'but Lynx claims to achieve smoother, pixel-perfect UIs and faster launch times compared to other cross-platform tools.',
				"That's a big claim, and in today's video we'll try out Lynx and find out if it's a legit React Native killer.",
				"It is March 6, 2025, and you're watching The Code Report.",
				'Lynx is not just another half-baked GitHub project written by a 19-year-old on prescription amphetamines.',
				"It's not the terminal browser with the same name,",
				"but rather a production-ready framework that's already in use in high-traffic apps at TikTok.",
				"It doesn't power the main TikTok app where you would post your cringe dance videos,",
				'but it does power the search panel, TikTok Studio, and a bunch of other ancillary apps.',
				'I find this very interesting because ByteDance was one of the early adopters of Flutter',
				'and is still on the Flutter showcase today.',
				'In addition, if they wanted to use web technologies to build mobile apps,',
				'why not just use something like React Native, Ionic, or NativeScript instead of reinventing the wheel?',
				'Well, the unspoken reason is that creating new frameworks gives us developers job security,',
				'but the official reason in their blog post is mostly about performance.',
				'Performance.',
				'Throughout history, many people have criticized React Native for not feeling truly native,',
				"and that's because it relies on a single-threaded JavaScript bridge",
				'that allows JavaScript code to communicate with native code, like Swift on iOS or Kotlin on Android,',
				'but that single-threaded bridge is a big bottleneck that can create performance issues.',
				"Are you saying there's something wrong with my gear?",
				"Is that what you're saying to me?",
				'The React Native team has addressed this by building a custom engine called Hermes',
				'and released the fabric renderer a few years ago,',
				'which some have called the new and improved bridge or a bridgeless architecture.',
				'But ByteDance has taken a different approach with Lynx using a dual-threaded architecture,',
				'where user code and framework code are split into two distinct runtimes.',
				'The main thread is powered by Prim.js, which itself is built on Quick.js,',
				'which is a tiny 210-kilobyte JavaScript engine.',
				'Its job is to handle synchronous UI tasks like event handling,',
				'while user code runs on a separate thread,',
				"which means the crappy, inefficient code you write won't block the main thread and degrade performance.",
				'And the end result is instant first frame rendering for the end user.',
				'Or in other words, no blank screens.',
				"That's pretty cool, but what's even more awesome is that this engine is framework-agnostic.",
				"You don't have to use React, and could build your app and Svelte, Vue, or whatever framework you want.",
				'In addition, it supports actual native CSS features for styling,',
				'like transition animations, variables, gradients, and so on.',
				"And that's a lot more intuitive for web developers.",
				"The major problem, though, is that there's virtually no ecosystem around this framework.",
				"There's no expo tooling to solve all your problems,",
				"and there's no massive widget library like you have in Flutter.",
				"That being said, let's go ahead and try it out to find out if it has any potential.",
				"When you generate a project, the first thing you'll notice is that it uses RSPack,",
				"which is a Rust-based module bundler that's supposedly even faster than Vite.",
				"That'll generate a starter template in TypeScript,",
				'and if we look at the code, it looks like a basic React.js project,',
				'where the UI is represented with HTML and CSS.',
				"But if we take a closer look at the markup, you'll notice we're using non-standard elements like Vue, Text, and Image.",
				'These look like HTML tags, but they actually correspond to native elements on different platforms,',
				'like Vue is UIView in iOS, or VueGroup in Android,',
				'but would translate to a div on the web.',
				"And what's especially awesome here is that we can use regular CSS or even Tailwind to style these elements,",
				"which is something you can't really do in React Native,",
				'although you could use tools like NativeWind.',
				"But now let's go ahead and run it.",
				'The easiest way to run it on mobile is to use the Lynx Explorer app,',
				'which allows you to live preview it on your phone.',
				'But when I tried to compile it on Windows, I immediately got an error.',
				'So I tried to switch to the Windows subsystem for Linux,',
				'and while it compiled, I could never actually get it to run on the Explorer app.',
				'So finally, I had to dust off my old MacBook,',
				'and everything seemed to work a lot smoother on macOS.',
				'And as you can see here, when I make changes to my code locally,',
				"it'll automatically re-render the demo on my phone.",
				'Impressive, very nice, I think Lynx has a lot of potential.',
				"And that's bad news because it means I need to rewrite all my code with this shiny new object.",
				'At least I can review all that code automatically thanks to CodeRabbit,',
				"the sponsor of today's video.",
				'An AI co-pilot for code reviews that gives you instant feedback on every pull request.',
				'Unlike basic linters, it understands your entire code base,',
				'so it can catch more subtle issues like bad code style or missing test coverage.',
				'Then it will suggest simple one-click fixes to help you get things cleaned up quickly.',
				'CodeRabbit keeps learning from your PRs over time,',
				'so the more you use it, the smarter it gets.',
				"It's 100% free for open source projects,",
				'but you can get one month free for your team using the code Fireship with the link below.',
				'This has been The Code Report, thanks for watching,',
				'and I will see you in the next one.',
			]

			const result = alignWordsAndSentences(words, sentences)
			expect(result).toMatchInlineSnapshot(`
				[
				  {
				    "end": 1.76,
				    "start": 0.09,
				    "text": "It's the moment we've all been waiting for.",
				    "words": [
				      {
				        "end": 0.09,
				        "start": 0.09,
				        "word": " It",
				      },
				      {
				        "end": 0.18,
				        "start": 0.09,
				        "word": "'s",
				      },
				      {
				        "end": 0.31,
				        "start": 0.18,
				        "word": " the",
				      },
				      {
				        "end": 0.58,
				        "start": 0.31,
				        "word": " moment",
				      },
				      {
				        "end": 0.67,
				        "start": 0.58,
				        "word": " we",
				      },
				      {
				        "end": 0.8,
				        "start": 0.67,
				        "word": "'ve",
				      },
				      {
				        "end": 0.93,
				        "start": 0.8,
				        "word": " all",
				      },
				      {
				        "end": 1.11,
				        "start": 0.93,
				        "word": " been",
				      },
				      {
				        "end": 1.43,
				        "start": 1.11,
				        "word": " waiting",
				      },
				      {
				        "end": 1.56,
				        "start": 1.43,
				        "word": " for",
				      },
				      {
				        "end": 1.76,
				        "start": 1.56,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 6.16,
				    "start": 1.76,
				    "text": "A brand new, game-changing, blazingly fast JavaScript framework just hit the timeline.",
				    "words": [
				      {
				        "end": 1.93,
				        "start": 1.76,
				        "word": " A",
				      },
				      {
				        "end": 2.13,
				        "start": 1.93,
				        "word": " brand",
				      },
				      {
				        "end": 2.24,
				        "start": 2.13,
				        "word": " new",
				      },
				      {
				        "end": 2.35,
				        "start": 2.24,
				        "word": ",",
				      },
				      {
				        "end": 2.57,
				        "start": 2.35,
				        "word": " game",
				      },
				      {
				        "end": 2.62,
				        "start": 2.57,
				        "word": "-",
				      },
				      {
				        "end": 3.06,
				        "start": 2.62,
				        "word": "changing",
				      },
				      {
				        "end": 3.17,
				        "start": 3.06,
				        "word": ",",
				      },
				      {
				        "end": 3.33,
				        "start": 3.17,
				        "word": " bla",
				      },
				      {
				        "end": 3.55,
				        "start": 3.33,
				        "word": "zing",
				      },
				      {
				        "end": 3.66,
				        "start": 3.55,
				        "word": "ly",
				      },
				      {
				        "end": 3.88,
				        "start": 3.66,
				        "word": " fast",
				      },
				      {
				        "end": 4.43,
				        "start": 3.88,
				        "word": " JavaScript",
				      },
				      {
				        "end": 4.93,
				        "start": 4.43,
				        "word": " framework",
				      },
				      {
				        "end": 5.15,
				        "start": 4.93,
				        "word": " just",
				      },
				      {
				        "end": 5.31,
				        "start": 5.15,
				        "word": " hit",
				      },
				      {
				        "end": 5.47,
				        "start": 5.31,
				        "word": " the",
				      },
				      {
				        "end": 5.91,
				        "start": 5.47,
				        "word": " timeline",
				      },
				      {
				        "end": 6.16,
				        "start": 5.91,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 10.99,
				    "start": 6.16,
				    "text": "Yesterday, ByteDance, the company that gave the world the gift of social media crack via TikTok,",
				    "words": [
				      {
				        "end": 6.7,
				        "start": 6.16,
				        "word": " Yesterday",
				      },
				      {
				        "end": 6.82,
				        "start": 6.7,
				        "word": ",",
				      },
				      {
				        "end": 6.96,
				        "start": 6.82,
				        "word": " By",
				      },
				      {
				        "end": 7.06,
				        "start": 6.96,
				        "word": "te",
				      },
				      {
				        "end": 7.21,
				        "start": 7.06,
				        "word": "D",
				      },
				      {
				        "end": 7.36,
				        "start": 7.21,
				        "word": "ance",
				      },
				      {
				        "end": 7.48,
				        "start": 7.36,
				        "word": ",",
				      },
				      {
				        "end": 7.66,
				        "start": 7.48,
				        "word": " the",
				      },
				      {
				        "end": 8.08,
				        "start": 7.66,
				        "word": " company",
				      },
				      {
				        "end": 8.33,
				        "start": 8.08,
				        "word": " that",
				      },
				      {
				        "end": 8.56,
				        "start": 8.33,
				        "word": " gave",
				      },
				      {
				        "end": 8.74,
				        "start": 8.56,
				        "word": " the",
				      },
				      {
				        "end": 9.07,
				        "start": 8.74,
				        "word": " world",
				      },
				      {
				        "end": 9.29,
				        "start": 9.07,
				        "word": " the",
				      },
				      {
				        "end": 9.46,
				        "start": 9.29,
				        "word": " gift",
				      },
				      {
				        "end": 9.58,
				        "start": 9.46,
				        "word": " of",
				      },
				      {
				        "end": 9.94,
				        "start": 9.58,
				        "word": " social",
				      },
				      {
				        "end": 10.27,
				        "start": 9.94,
				        "word": " media",
				      },
				      {
				        "end": 10.54,
				        "start": 10.27,
				        "word": " crack",
				      },
				      {
				        "end": 10.74,
				        "start": 10.54,
				        "word": " via",
				      },
				      {
				        "end": 10.99,
				        "start": 10.74,
				        "word": " TikTok",
				      },
				    ],
				  },
				  {
				    "end": 16.48,
				    "start": 11.08,
				    "text": "gave the world another gift in the form of an open-source, multi-platform app development framework called Lynx.",
				    "words": [
				      {
				        "end": 11.31,
				        "start": 11.08,
				        "word": " gave",
				      },
				      {
				        "end": 11.48,
				        "start": 11.31,
				        "word": " the",
				      },
				      {
				        "end": 11.77,
				        "start": 11.48,
				        "word": " world",
				      },
				      {
				        "end": 12.18,
				        "start": 11.77,
				        "word": " another",
				      },
				      {
				        "end": 12.41,
				        "start": 12.18,
				        "word": " gift",
				      },
				      {
				        "end": 12.52,
				        "start": 12.41,
				        "word": " in",
				      },
				      {
				        "end": 12.69,
				        "start": 12.52,
				        "word": " the",
				      },
				      {
				        "end": 12.92,
				        "start": 12.69,
				        "word": " form",
				      },
				      {
				        "end": 13.03,
				        "start": 12.92,
				        "word": " of",
				      },
				      {
				        "end": 13.14,
				        "start": 13.03,
				        "word": " an",
				      },
				      {
				        "end": 13.37,
				        "start": 13.14,
				        "word": " open",
				      },
				      {
				        "end": 13.42,
				        "start": 13.37,
				        "word": "-",
				      },
				      {
				        "end": 13.77,
				        "start": 13.42,
				        "word": "source",
				      },
				      {
				        "end": 13.98,
				        "start": 13.77,
				        "word": ",",
				      },
				      {
				        "end": 14.28,
				        "start": 13.98,
				        "word": " multi",
				      },
				      {
				        "end": 14.32,
				        "start": 14.28,
				        "word": "-",
				      },
				      {
				        "end": 14.55,
				        "start": 14.32,
				        "word": "plat",
				      },
				      {
				        "end": 14.78,
				        "start": 14.55,
				        "word": "form",
				      },
				      {
				        "end": 14.95,
				        "start": 14.78,
				        "word": " app",
				      },
				      {
				        "end": 15.62,
				        "start": 14.95,
				        "word": " development",
				      },
				      {
				        "end": 16.14,
				        "start": 15.62,
				        "word": " framework",
				      },
				      {
				        "end": 16.48,
				        "start": 16.14,
				        "word": " called",
				      },
				    ],
				  },
				  {
				    "end": 20.64,
				    "start": 16.9,
				    "text": "Developers can throw fossilized relics like React Native and Flutter in the garbage",
				    "words": [
				      {
				        "end": 17.26,
				        "start": 16.9,
				        "word": " Develop",
				      },
				      {
				        "end": 17.41,
				        "start": 17.26,
				        "word": "ers",
				      },
				      {
				        "end": 17.57,
				        "start": 17.41,
				        "word": " can",
				      },
				      {
				        "end": 17.82,
				        "start": 17.57,
				        "word": " throw",
				      },
				      {
				        "end": 18.13,
				        "start": 17.82,
				        "word": " fossil",
				      },
				      {
				        "end": 18.34,
				        "start": 18.13,
				        "word": "ized",
				      },
				      {
				        "end": 18.5,
				        "start": 18.34,
				        "word": " rel",
				      },
				      {
				        "end": 18.64,
				        "start": 18.5,
				        "word": "ics",
				      },
				      {
				        "end": 18.85,
				        "start": 18.64,
				        "word": " like",
				      },
				      {
				        "end": 19.12,
				        "start": 18.85,
				        "word": " React",
				      },
				      {
				        "end": 19.42,
				        "start": 19.12,
				        "word": " Native",
				      },
				      {
				        "end": 19.57,
				        "start": 19.42,
				        "word": " and",
				      },
				      {
				        "end": 19.67,
				        "start": 19.57,
				        "word": " Fl",
				      },
				      {
				        "end": 19.93,
				        "start": 19.67,
				        "word": "utter",
				      },
				      {
				        "end": 20.03,
				        "start": 19.93,
				        "word": " in",
				      },
				      {
				        "end": 20.18,
				        "start": 20.03,
				        "word": " the",
				      },
				      {
				        "end": 20.64,
				        "start": 20.18,
				        "word": " garbage",
				      },
				    ],
				  },
				  {
				    "end": 24.66,
				    "start": 20.64,
				    "text": "and rewrite their native mobile apps from scratch with shiny new Rust-based tooling",
				    "words": [
				      {
				        "end": 20.82,
				        "start": 20.64,
				        "word": " and",
				      },
				      {
				        "end": 21.2,
				        "start": 20.82,
				        "word": " rewrite",
				      },
				      {
				        "end": 21.48,
				        "start": 21.2,
				        "word": " their",
				      },
				      {
				        "end": 21.81,
				        "start": 21.48,
				        "word": " native",
				      },
				      {
				        "end": 22.14,
				        "start": 21.81,
				        "word": " mobile",
				      },
				      {
				        "end": 22.36,
				        "start": 22.14,
				        "word": " apps",
				      },
				      {
				        "end": 22.58,
				        "start": 22.36,
				        "word": " from",
				      },
				      {
				        "end": 22.97,
				        "start": 22.58,
				        "word": " scratch",
				      },
				      {
				        "end": 23.19,
				        "start": 22.97,
				        "word": " with",
				      },
				      {
				        "end": 23.47,
				        "start": 23.19,
				        "word": " shiny",
				      },
				      {
				        "end": 23.64,
				        "start": 23.47,
				        "word": " new",
				      },
				      {
				        "end": 23.86,
				        "start": 23.64,
				        "word": " Rust",
				      },
				      {
				        "end": 23.91,
				        "start": 23.86,
				        "word": "-",
				      },
				      {
				        "end": 24.19,
				        "start": 23.91,
				        "word": "based",
				      },
				      {
				        "end": 24.66,
				        "start": 24.19,
				        "word": " tooling",
				      },
				    ],
				  },
				  {
				    "end": 27.64,
				    "start": 24.66,
				    "text": "and a high-performance, dual-threaded UI rendering engine.",
				    "words": [
				      {
				        "end": 24.82,
				        "start": 24.66,
				        "word": " and",
				      },
				      {
				        "end": 24.87,
				        "start": 24.82,
				        "word": " a",
				      },
				      {
				        "end": 25.08,
				        "start": 24.87,
				        "word": " high",
				      },
				      {
				        "end": 25.13,
				        "start": 25.08,
				        "word": "-",
				      },
				      {
				        "end": 25.72,
				        "start": 25.13,
				        "word": "performance",
				      },
				      {
				        "end": 25.82,
				        "start": 25.72,
				        "word": ",",
				      },
				      {
				        "end": 26.03,
				        "start": 25.82,
				        "word": " dual",
				      },
				      {
				        "end": 26.08,
				        "start": 26.03,
				        "word": "-",
				      },
				      {
				        "end": 26.24,
				        "start": 26.08,
				        "word": "th",
				      },
				      {
				        "end": 26.39,
				        "start": 26.24,
				        "word": "read",
				      },
				      {
				        "end": 26.49,
				        "start": 26.39,
				        "word": "ed",
				      },
				      {
				        "end": 26.59,
				        "start": 26.49,
				        "word": " UI",
				      },
				      {
				        "end": 27.07,
				        "start": 26.59,
				        "word": " rendering",
				      },
				      {
				        "end": 27.39,
				        "start": 27.07,
				        "word": " engine",
				      },
				      {
				        "end": 27.64,
				        "start": 27.39,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 32.44,
				    "start": 27.64,
				    "text": "Like React Native, it empowers web developers to build shoddy iOS and Android apps with JavaScript,",
				    "words": [
				      {
				        "end": 27.87,
				        "start": 27.64,
				        "word": " Like",
				      },
				      {
				        "end": 28.16,
				        "start": 27.87,
				        "word": " React",
				      },
				      {
				        "end": 28.5,
				        "start": 28.16,
				        "word": " Native",
				      },
				      {
				        "end": 28.61,
				        "start": 28.5,
				        "word": ",",
				      },
				      {
				        "end": 28.75,
				        "start": 28.61,
				        "word": " it",
				      },
				      {
				        "end": 28.89,
				        "start": 28.75,
				        "word": " emp",
				      },
				      {
				        "end": 29.18,
				        "start": 28.89,
				        "word": "owers",
				      },
				      {
				        "end": 29.35,
				        "start": 29.18,
				        "word": " web",
				      },
				      {
				        "end": 29.93,
				        "start": 29.35,
				        "word": " developers",
				      },
				      {
				        "end": 30.04,
				        "start": 29.93,
				        "word": " to",
				      },
				      {
				        "end": 30.33,
				        "start": 30.04,
				        "word": " build",
				      },
				      {
				        "end": 30.44,
				        "start": 30.33,
				        "word": " sh",
				      },
				      {
				        "end": 30.55,
				        "start": 30.44,
				        "word": "od",
				      },
				      {
				        "end": 30.66,
				        "start": 30.55,
				        "word": "dy",
				      },
				      {
				        "end": 30.83,
				        "start": 30.66,
				        "word": " iOS",
				      },
				      {
				        "end": 31,
				        "start": 30.83,
				        "word": " and",
				      },
				      {
				        "end": 31.4,
				        "start": 31,
				        "word": " Android",
				      },
				      {
				        "end": 31.63,
				        "start": 31.4,
				        "word": " apps",
				      },
				      {
				        "end": 31.86,
				        "start": 31.63,
				        "word": " with",
				      },
				      {
				        "end": 32.44,
				        "start": 31.86,
				        "word": " JavaScript",
				      },
				    ],
				  },
				  {
				    "end": 39.34,
				    "start": 32.64,
				    "text": "but Lynx claims to achieve smoother, pixel-perfect UIs and faster launch times compared to other cross-platform tools.",
				    "words": [
				      {
				        "end": 32.88,
				        "start": 32.64,
				        "word": " but",
				      },
				      {
				        "end": 33.04,
				        "start": 32.88,
				        "word": " Lyn",
				      },
				      {
				        "end": 33.1,
				        "start": 33.04,
				        "word": "x",
				      },
				      {
				        "end": 33.51,
				        "start": 33.1,
				        "word": " claims",
				      },
				      {
				        "end": 33.64,
				        "start": 33.51,
				        "word": " to",
				      },
				      {
				        "end": 34.12,
				        "start": 33.64,
				        "word": " achieve",
				      },
				      {
				        "end": 34.67,
				        "start": 34.12,
				        "word": " smoother",
				      },
				      {
				        "end": 34.83,
				        "start": 34.67,
				        "word": ",",
				      },
				      {
				        "end": 35.16,
				        "start": 34.83,
				        "word": " pixel",
				      },
				      {
				        "end": 35.2,
				        "start": 35.16,
				        "word": "-",
				      },
				      {
				        "end": 35.4,
				        "start": 35.2,
				        "word": "per",
				      },
				      {
				        "end": 35.67,
				        "start": 35.4,
				        "word": "fect",
				      },
				      {
				        "end": 35.74,
				        "start": 35.67,
				        "word": " U",
				      },
				      {
				        "end": 35.98,
				        "start": 35.74,
				        "word": "Is",
				      },
				      {
				        "end": 36.18,
				        "start": 35.98,
				        "word": " and",
				      },
				      {
				        "end": 36.59,
				        "start": 36.18,
				        "word": " faster",
				      },
				      {
				        "end": 37.01,
				        "start": 36.59,
				        "word": " launch",
				      },
				      {
				        "end": 37.36,
				        "start": 37.01,
				        "word": " times",
				      },
				      {
				        "end": 37.84,
				        "start": 37.36,
				        "word": " compared",
				      },
				      {
				        "end": 37.93,
				        "start": 37.84,
				        "word": " to",
				      },
				      {
				        "end": 38.24,
				        "start": 37.93,
				        "word": " other",
				      },
				      {
				        "end": 38.5,
				        "start": 38.24,
				        "word": " cross",
				      },
				      {
				        "end": 38.58,
				        "start": 38.5,
				        "word": "-",
				      },
				      {
				        "end": 38.72,
				        "start": 38.58,
				        "word": "plat",
				      },
				      {
				        "end": 38.91,
				        "start": 38.72,
				        "word": "form",
				      },
				      {
				        "end": 39.16,
				        "start": 38.91,
				        "word": " tools",
				      },
				      {
				        "end": 39.34,
				        "start": 39.16,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 44.48,
				    "start": 39.34,
				    "text": "That's a big claim, and in today's video we'll try out Lynx and find out if it's a legit React Native killer.",
				    "words": [
				      {
				        "end": 39.56,
				        "start": 39.34,
				        "word": " That",
				      },
				      {
				        "end": 39.69,
				        "start": 39.56,
				        "word": "'s",
				      },
				      {
				        "end": 39.72,
				        "start": 39.69,
				        "word": " a",
				      },
				      {
				        "end": 39.88,
				        "start": 39.72,
				        "word": " big",
				      },
				      {
				        "end": 40.16,
				        "start": 39.88,
				        "word": " claim",
				      },
				      {
				        "end": 40.27,
				        "start": 40.16,
				        "word": ",",
				      },
				      {
				        "end": 40.44,
				        "start": 40.27,
				        "word": " and",
				      },
				      {
				        "end": 40.54,
				        "start": 40.44,
				        "word": " in",
				      },
				      {
				        "end": 40.82,
				        "start": 40.54,
				        "word": " today",
				      },
				      {
				        "end": 40.93,
				        "start": 40.82,
				        "word": "'s",
				      },
				      {
				        "end": 41.21,
				        "start": 40.93,
				        "word": " video",
				      },
				      {
				        "end": 41.32,
				        "start": 41.21,
				        "word": " we",
				      },
				      {
				        "end": 41.48,
				        "start": 41.32,
				        "word": "'ll",
				      },
				      {
				        "end": 41.64,
				        "start": 41.48,
				        "word": " try",
				      },
				      {
				        "end": 41.84,
				        "start": 41.64,
				        "word": " out",
				      },
				      {
				        "end": 41.96,
				        "start": 41.84,
				        "word": " Lyn",
				      },
				      {
				        "end": 42.01,
				        "start": 41.96,
				        "word": "x",
				      },
				      {
				        "end": 42.17,
				        "start": 42.01,
				        "word": " and",
				      },
				      {
				        "end": 42.39,
				        "start": 42.17,
				        "word": " find",
				      },
				      {
				        "end": 42.55,
				        "start": 42.39,
				        "word": " out",
				      },
				      {
				        "end": 42.67,
				        "start": 42.55,
				        "word": " if",
				      },
				      {
				        "end": 42.77,
				        "start": 42.67,
				        "word": " it",
				      },
				      {
				        "end": 42.88,
				        "start": 42.77,
				        "word": "'s",
				      },
				      {
				        "end": 42.92,
				        "start": 42.88,
				        "word": " a",
				      },
				      {
				        "end": 43.21,
				        "start": 42.92,
				        "word": " legit",
				      },
				      {
				        "end": 43.49,
				        "start": 43.21,
				        "word": " React",
				      },
				      {
				        "end": 43.82,
				        "start": 43.49,
				        "word": " Native",
				      },
				      {
				        "end": 44.15,
				        "start": 43.82,
				        "word": " killer",
				      },
				      {
				        "end": 44.48,
				        "start": 44.15,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 47.98,
				    "start": 44.48,
				    "text": "It is March 6, 2025, and you're watching The Code Report.",
				    "words": [
				      {
				        "end": 44.59,
				        "start": 44.48,
				        "word": " It",
				      },
				      {
				        "end": 44.79,
				        "start": 44.59,
				        "word": " is",
				      },
				      {
				        "end": 44.98,
				        "start": 44.79,
				        "word": " March",
				      },
				      {
				        "end": 45.15,
				        "start": 44.98,
				        "word": " 6",
				      },
				      {
				        "end": 45.26,
				        "start": 45.15,
				        "word": ",",
				      },
				      {
				        "end": 45.94,
				        "start": 45.26,
				        "word": " 2025",
				      },
				      {
				        "end": 46.05,
				        "start": 45.94,
				        "word": ",",
				      },
				      {
				        "end": 46.22,
				        "start": 46.05,
				        "word": " and",
				      },
				      {
				        "end": 46.39,
				        "start": 46.22,
				        "word": " you",
				      },
				      {
				        "end": 46.56,
				        "start": 46.39,
				        "word": "'re",
				      },
				      {
				        "end": 47.01,
				        "start": 46.56,
				        "word": " watching",
				      },
				      {
				        "end": 47.18,
				        "start": 47.01,
				        "word": " The",
				      },
				      {
				        "end": 47.4,
				        "start": 47.18,
				        "word": " Code",
				      },
				      {
				        "end": 47.74,
				        "start": 47.4,
				        "word": " Report",
				      },
				      {
				        "end": 47.98,
				        "start": 47.74,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 52.62,
				    "start": 47.98,
				    "text": "Lynx is not just another half-baked GitHub project written by a 19-year-old on prescription amphetamines.",
				    "words": [
				      {
				        "end": 48.13,
				        "start": 47.98,
				        "word": " Lyn",
				      },
				      {
				        "end": 48.18,
				        "start": 48.13,
				        "word": "x",
				      },
				      {
				        "end": 48.28,
				        "start": 48.18,
				        "word": " is",
				      },
				      {
				        "end": 48.43,
				        "start": 48.28,
				        "word": " not",
				      },
				      {
				        "end": 48.64,
				        "start": 48.43,
				        "word": " just",
				      },
				      {
				        "end": 48.99,
				        "start": 48.64,
				        "word": " another",
				      },
				      {
				        "end": 49.21,
				        "start": 48.99,
				        "word": " half",
				      },
				      {
				        "end": 49.26,
				        "start": 49.21,
				        "word": "-",
				      },
				      {
				        "end": 49.31,
				        "start": 49.26,
				        "word": "b",
				      },
				      {
				        "end": 49.56,
				        "start": 49.31,
				        "word": "aked",
				      },
				      {
				        "end": 49.82,
				        "start": 49.56,
				        "word": " GitHub",
				      },
				      {
				        "end": 50.18,
				        "start": 49.82,
				        "word": " project",
				      },
				      {
				        "end": 50.54,
				        "start": 50.18,
				        "word": " written",
				      },
				      {
				        "end": 50.69,
				        "start": 50.54,
				        "word": " by",
				      },
				      {
				        "end": 50.69,
				        "start": 50.69,
				        "word": " a",
				      },
				      {
				        "end": 51,
				        "start": 50.69,
				        "word": " 19",
				      },
				      {
				        "end": 51.05,
				        "start": 51,
				        "word": "-",
				      },
				      {
				        "end": 51.25,
				        "start": 51.05,
				        "word": "year",
				      },
				      {
				        "end": 51.3,
				        "start": 51.25,
				        "word": "-",
				      },
				      {
				        "end": 51.45,
				        "start": 51.3,
				        "word": "old",
				      },
				      {
				        "end": 51.55,
				        "start": 51.45,
				        "word": " on",
				      },
				      {
				        "end": 52.18,
				        "start": 51.55,
				        "word": " prescription",
				      },
				      {
				        "end": 52.28,
				        "start": 52.18,
				        "word": " am",
				      },
				      {
				        "end": 52.48,
				        "start": 52.28,
				        "word": "phet",
				      },
				      {
				        "end": 52.62,
				        "start": 52.48,
				        "word": "am",
				      },
				    ],
				  },
				  {
				    "end": 54.96,
				    "start": 53.08,
				    "text": "It's not the terminal browser with the same name,",
				    "words": [
				      {
				        "end": 53.17,
				        "start": 53.08,
				        "word": " It",
				      },
				      {
				        "end": 53.26,
				        "start": 53.17,
				        "word": "'s",
				      },
				      {
				        "end": 53.4,
				        "start": 53.26,
				        "word": " not",
				      },
				      {
				        "end": 53.59,
				        "start": 53.4,
				        "word": " the",
				      },
				      {
				        "end": 53.92,
				        "start": 53.59,
				        "word": " terminal",
				      },
				      {
				        "end": 54.25,
				        "start": 53.92,
				        "word": " browser",
				      },
				      {
				        "end": 54.49,
				        "start": 54.25,
				        "word": " with",
				      },
				      {
				        "end": 54.58,
				        "start": 54.49,
				        "word": " the",
				      },
				      {
				        "end": 54.77,
				        "start": 54.58,
				        "word": " same",
				      },
				      {
				        "end": 54.96,
				        "start": 54.77,
				        "word": " name",
				      },
				    ],
				  },
				  {
				    "end": 59.24,
				    "start": 55.05,
				    "text": "but rather a production-ready framework that's already in use in high-traffic apps at TikTok.",
				    "words": [
				      {
				        "end": 55.19,
				        "start": 55.05,
				        "word": " but",
				      },
				      {
				        "end": 55.48,
				        "start": 55.19,
				        "word": " rather",
				      },
				      {
				        "end": 55.52,
				        "start": 55.48,
				        "word": " a",
				      },
				      {
				        "end": 55.99,
				        "start": 55.52,
				        "word": " production",
				      },
				      {
				        "end": 56.04,
				        "start": 55.99,
				        "word": "-",
				      },
				      {
				        "end": 56.28,
				        "start": 56.04,
				        "word": "ready",
				      },
				      {
				        "end": 56.82,
				        "start": 56.28,
				        "word": " framework",
				      },
				      {
				        "end": 57.04,
				        "start": 56.82,
				        "word": " that",
				      },
				      {
				        "end": 57.15,
				        "start": 57.04,
				        "word": "'s",
				      },
				      {
				        "end": 57.54,
				        "start": 57.15,
				        "word": " already",
				      },
				      {
				        "end": 57.65,
				        "start": 57.54,
				        "word": " in",
				      },
				      {
				        "end": 57.84,
				        "start": 57.65,
				        "word": " use",
				      },
				      {
				        "end": 57.93,
				        "start": 57.84,
				        "word": " in",
				      },
				      {
				        "end": 58.12,
				        "start": 57.93,
				        "word": " high",
				      },
				      {
				        "end": 58.2,
				        "start": 58.12,
				        "word": "-",
				      },
				      {
				        "end": 58.3,
				        "start": 58.2,
				        "word": "tra",
				      },
				      {
				        "end": 58.54,
				        "start": 58.3,
				        "word": "ffic",
				      },
				      {
				        "end": 58.71,
				        "start": 58.54,
				        "word": " apps",
				      },
				      {
				        "end": 58.8,
				        "start": 58.71,
				        "word": " at",
				      },
				      {
				        "end": 59.08,
				        "start": 58.8,
				        "word": " TikTok",
				      },
				      {
				        "end": 59.24,
				        "start": 59.08,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 62.64,
				    "start": 59.24,
				    "text": "It doesn't power the main TikTok app where you would post your cringe dance videos,",
				    "words": [
				      {
				        "end": 59.34,
				        "start": 59.24,
				        "word": " It",
				      },
				      {
				        "end": 59.62,
				        "start": 59.34,
				        "word": " doesn",
				      },
				      {
				        "end": 59.69,
				        "start": 59.62,
				        "word": "'t",
				      },
				      {
				        "end": 59.94,
				        "start": 59.69,
				        "word": " power",
				      },
				      {
				        "end": 60.09,
				        "start": 59.94,
				        "word": " the",
				      },
				      {
				        "end": 60.29,
				        "start": 60.09,
				        "word": " main",
				      },
				      {
				        "end": 60.59,
				        "start": 60.29,
				        "word": " TikTok",
				      },
				      {
				        "end": 60.74,
				        "start": 60.59,
				        "word": " app",
				      },
				      {
				        "end": 61.05,
				        "start": 60.74,
				        "word": " where",
				      },
				      {
				        "end": 61.14,
				        "start": 61.05,
				        "word": " you",
				      },
				      {
				        "end": 61.41,
				        "start": 61.14,
				        "word": " would",
				      },
				      {
				        "end": 61.59,
				        "start": 61.41,
				        "word": " post",
				      },
				      {
				        "end": 61.82,
				        "start": 61.59,
				        "word": " your",
				      },
				      {
				        "end": 62.13,
				        "start": 61.82,
				        "word": " cringe",
				      },
				      {
				        "end": 62.34,
				        "start": 62.13,
				        "word": " dance",
				      },
				      {
				        "end": 62.64,
				        "start": 62.34,
				        "word": " videos",
				      },
				    ],
				  },
				  {
				    "end": 67.44,
				    "start": 62.8,
				    "text": "but it does power the search panel, TikTok Studio, and a bunch of other ancillary apps.",
				    "words": [
				      {
				        "end": 63.07,
				        "start": 62.8,
				        "word": " but",
				      },
				      {
				        "end": 63.1,
				        "start": 63.07,
				        "word": " it",
				      },
				      {
				        "end": 63.34,
				        "start": 63.1,
				        "word": " does",
				      },
				      {
				        "end": 63.64,
				        "start": 63.34,
				        "word": " power",
				      },
				      {
				        "end": 63.82,
				        "start": 63.64,
				        "word": " the",
				      },
				      {
				        "end": 64.18,
				        "start": 63.82,
				        "word": " search",
				      },
				      {
				        "end": 64.48,
				        "start": 64.18,
				        "word": " panel",
				      },
				      {
				        "end": 64.6,
				        "start": 64.48,
				        "word": ",",
				      },
				      {
				        "end": 64.98,
				        "start": 64.6,
				        "word": " TikTok",
				      },
				      {
				        "end": 65.32,
				        "start": 64.98,
				        "word": " Studio",
				      },
				      {
				        "end": 65.44,
				        "start": 65.32,
				        "word": ",",
				      },
				      {
				        "end": 65.61,
				        "start": 65.44,
				        "word": " and",
				      },
				      {
				        "end": 65.68,
				        "start": 65.61,
				        "word": " a",
				      },
				      {
				        "end": 65.98,
				        "start": 65.68,
				        "word": " bunch",
				      },
				      {
				        "end": 66.12,
				        "start": 65.98,
				        "word": " of",
				      },
				      {
				        "end": 66.4,
				        "start": 66.12,
				        "word": " other",
				      },
				      {
				        "end": 66.52,
				        "start": 66.4,
				        "word": " an",
				      },
				      {
				        "end": 66.75,
				        "start": 66.52,
				        "word": "cill",
				      },
				      {
				        "end": 66.94,
				        "start": 66.75,
				        "word": "ary",
				      },
				      {
				        "end": 67.18,
				        "start": 66.94,
				        "word": " apps",
				      },
				      {
				        "end": 67.44,
				        "start": 67.18,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 71.02,
				    "start": 67.44,
				    "text": "I find this very interesting because ByteDance was one of the early adopters of Flutter",
				    "words": [
				      {
				        "end": 67.64,
				        "start": 67.44,
				        "word": " I",
				      },
				      {
				        "end": 67.7,
				        "start": 67.64,
				        "word": " find",
				      },
				      {
				        "end": 67.91,
				        "start": 67.7,
				        "word": " this",
				      },
				      {
				        "end": 68.12,
				        "start": 67.91,
				        "word": " very",
				      },
				      {
				        "end": 68.71,
				        "start": 68.12,
				        "word": " interesting",
				      },
				      {
				        "end": 69.09,
				        "start": 68.71,
				        "word": " because",
				      },
				      {
				        "end": 69.19,
				        "start": 69.09,
				        "word": " By",
				      },
				      {
				        "end": 69.29,
				        "start": 69.19,
				        "word": "te",
				      },
				      {
				        "end": 69.34,
				        "start": 69.29,
				        "word": "D",
				      },
				      {
				        "end": 69.55,
				        "start": 69.34,
				        "word": "ance",
				      },
				      {
				        "end": 69.71,
				        "start": 69.55,
				        "word": " was",
				      },
				      {
				        "end": 69.87,
				        "start": 69.71,
				        "word": " one",
				      },
				      {
				        "end": 69.97,
				        "start": 69.87,
				        "word": " of",
				      },
				      {
				        "end": 70.13,
				        "start": 69.97,
				        "word": " the",
				      },
				      {
				        "end": 70.4,
				        "start": 70.13,
				        "word": " early",
				      },
				      {
				        "end": 70.61,
				        "start": 70.4,
				        "word": " adop",
				      },
				      {
				        "end": 70.88,
				        "start": 70.61,
				        "word": "ters",
				      },
				      {
				        "end": 70.92,
				        "start": 70.88,
				        "word": " of",
				      },
				      {
				        "end": 71.02,
				        "start": 70.92,
				        "word": " Fl",
				      },
				    ],
				  },
				  {
				    "end": 73.34,
				    "start": 71.42,
				    "text": "and is still on the Flutter showcase today.",
				    "words": [
				      {
				        "end": 71.57,
				        "start": 71.42,
				        "word": " and",
				      },
				      {
				        "end": 71.67,
				        "start": 71.57,
				        "word": " is",
				      },
				      {
				        "end": 71.92,
				        "start": 71.67,
				        "word": " still",
				      },
				      {
				        "end": 72.02,
				        "start": 71.92,
				        "word": " on",
				      },
				      {
				        "end": 72.17,
				        "start": 72.02,
				        "word": " the",
				      },
				      {
				        "end": 72.27,
				        "start": 72.17,
				        "word": " Fl",
				      },
				      {
				        "end": 72.52,
				        "start": 72.27,
				        "word": "utter",
				      },
				      {
				        "end": 72.92,
				        "start": 72.52,
				        "word": " showcase",
				      },
				      {
				        "end": 73.17,
				        "start": 72.92,
				        "word": " today",
				      },
				      {
				        "end": 73.34,
				        "start": 73.17,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 76.42,
				    "start": 73.52,
				    "text": "In addition, if they wanted to use web technologies to build mobile apps,",
				    "words": [
				      {
				        "end": 73.61,
				        "start": 73.52,
				        "word": " In",
				      },
				      {
				        "end": 74,
				        "start": 73.61,
				        "word": " addition",
				      },
				      {
				        "end": 74.09,
				        "start": 74,
				        "word": ",",
				      },
				      {
				        "end": 74.18,
				        "start": 74.09,
				        "word": " if",
				      },
				      {
				        "end": 74.37,
				        "start": 74.18,
				        "word": " they",
				      },
				      {
				        "end": 74.69,
				        "start": 74.37,
				        "word": " wanted",
				      },
				      {
				        "end": 74.75,
				        "start": 74.69,
				        "word": " to",
				      },
				      {
				        "end": 74.89,
				        "start": 74.75,
				        "word": " use",
				      },
				      {
				        "end": 75.03,
				        "start": 74.89,
				        "word": " web",
				      },
				      {
				        "end": 75.61,
				        "start": 75.03,
				        "word": " technologies",
				      },
				      {
				        "end": 75.7,
				        "start": 75.61,
				        "word": " to",
				      },
				      {
				        "end": 75.94,
				        "start": 75.7,
				        "word": " build",
				      },
				      {
				        "end": 76.23,
				        "start": 75.94,
				        "word": " mobile",
				      },
				      {
				        "end": 76.42,
				        "start": 76.23,
				        "word": " apps",
				      },
				    ],
				  },
				  {
				    "end": 81.34,
				    "start": 76.62,
				    "text": "why not just use something like React Native, Ionic, or NativeScript instead of reinventing the wheel?",
				    "words": [
				      {
				        "end": 76.81,
				        "start": 76.62,
				        "word": " why",
				      },
				      {
				        "end": 76.92,
				        "start": 76.81,
				        "word": " not",
				      },
				      {
				        "end": 77.16,
				        "start": 76.92,
				        "word": " just",
				      },
				      {
				        "end": 77.27,
				        "start": 77.16,
				        "word": " use",
				      },
				      {
				        "end": 77.73,
				        "start": 77.27,
				        "word": " something",
				      },
				      {
				        "end": 77.93,
				        "start": 77.73,
				        "word": " like",
				      },
				      {
				        "end": 78.18,
				        "start": 77.93,
				        "word": " React",
				      },
				      {
				        "end": 78.49,
				        "start": 78.18,
				        "word": " Native",
				      },
				      {
				        "end": 78.59,
				        "start": 78.49,
				        "word": ",",
				      },
				      {
				        "end": 78.64,
				        "start": 78.59,
				        "word": " I",
				      },
				      {
				        "end": 78.84,
				        "start": 78.64,
				        "word": "onic",
				      },
				      {
				        "end": 78.94,
				        "start": 78.84,
				        "word": ",",
				      },
				      {
				        "end": 79.04,
				        "start": 78.94,
				        "word": " or",
				      },
				      {
				        "end": 79.35,
				        "start": 79.04,
				        "word": " Native",
				      },
				      {
				        "end": 79.66,
				        "start": 79.35,
				        "word": "Script",
				      },
				      {
				        "end": 80.02,
				        "start": 79.66,
				        "word": " instead",
				      },
				      {
				        "end": 80.12,
				        "start": 80.02,
				        "word": " of",
				      },
				      {
				        "end": 80.53,
				        "start": 80.12,
				        "word": " reinvent",
				      },
				      {
				        "end": 80.68,
				        "start": 80.53,
				        "word": "ing",
				      },
				      {
				        "end": 80.84,
				        "start": 80.68,
				        "word": " the",
				      },
				      {
				        "end": 81.08,
				        "start": 80.84,
				        "word": " wheel",
				      },
				      {
				        "end": 81.34,
				        "start": 81.08,
				        "word": "?",
				      },
				    ],
				  },
				  {
				    "end": 85.44,
				    "start": 81.34,
				    "text": "Well, the unspoken reason is that creating new frameworks gives us developers job security,",
				    "words": [
				      {
				        "end": 81.57,
				        "start": 81.34,
				        "word": " Well",
				      },
				      {
				        "end": 81.65,
				        "start": 81.57,
				        "word": ",",
				      },
				      {
				        "end": 81.81,
				        "start": 81.65,
				        "word": " the",
				      },
				      {
				        "end": 81.96,
				        "start": 81.81,
				        "word": " uns",
				      },
				      {
				        "end": 82.02,
				        "start": 81.96,
				        "word": "p",
				      },
				      {
				        "end": 82.23,
				        "start": 82.02,
				        "word": "oken",
				      },
				      {
				        "end": 82.55,
				        "start": 82.23,
				        "word": " reason",
				      },
				      {
				        "end": 82.65,
				        "start": 82.55,
				        "word": " is",
				      },
				      {
				        "end": 82.86,
				        "start": 82.65,
				        "word": " that",
				      },
				      {
				        "end": 83.28,
				        "start": 82.86,
				        "word": " creating",
				      },
				      {
				        "end": 83.44,
				        "start": 83.28,
				        "word": " new",
				      },
				      {
				        "end": 83.97,
				        "start": 83.44,
				        "word": " frameworks",
				      },
				      {
				        "end": 84.23,
				        "start": 83.97,
				        "word": " gives",
				      },
				      {
				        "end": 84.33,
				        "start": 84.23,
				        "word": " us",
				      },
				      {
				        "end": 84.86,
				        "start": 84.33,
				        "word": " developers",
				      },
				      {
				        "end": 85.02,
				        "start": 84.86,
				        "word": " job",
				      },
				      {
				        "end": 85.44,
				        "start": 85.02,
				        "word": " security",
				      },
				    ],
				  },
				  {
				    "end": 89.06,
				    "start": 85.64,
				    "text": "but the official reason in their blog post is mostly about performance.",
				    "words": [
				      {
				        "end": 85.8,
				        "start": 85.64,
				        "word": " but",
				      },
				      {
				        "end": 85.96,
				        "start": 85.8,
				        "word": " the",
				      },
				      {
				        "end": 86.4,
				        "start": 85.96,
				        "word": " official",
				      },
				      {
				        "end": 86.73,
				        "start": 86.4,
				        "word": " reason",
				      },
				      {
				        "end": 86.84,
				        "start": 86.73,
				        "word": " in",
				      },
				      {
				        "end": 87.11,
				        "start": 86.84,
				        "word": " their",
				      },
				      {
				        "end": 87.33,
				        "start": 87.11,
				        "word": " blog",
				      },
				      {
				        "end": 87.59,
				        "start": 87.33,
				        "word": " post",
				      },
				      {
				        "end": 87.66,
				        "start": 87.59,
				        "word": " is",
				      },
				      {
				        "end": 87.99,
				        "start": 87.66,
				        "word": " mostly",
				      },
				      {
				        "end": 88.25,
				        "start": 87.99,
				        "word": " about",
				      },
				      {
				        "end": 88.86,
				        "start": 88.25,
				        "word": " performance",
				      },
				      {
				        "end": 89.06,
				        "start": 88.86,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 89.68,
				    "start": 89.06,
				    "text": "Performance.",
				    "words": [
				      {
				        "end": 89.54,
				        "start": 89.06,
				        "word": " Performance",
				      },
				      {
				        "end": 89.68,
				        "start": 89.54,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 93.62,
				    "start": 89.68,
				    "text": "Throughout history, many people have criticized React Native for not feeling truly native,",
				    "words": [
				      {
				        "end": 90.2,
				        "start": 89.68,
				        "word": " Throughout",
				      },
				      {
				        "end": 90.55,
				        "start": 90.2,
				        "word": " history",
				      },
				      {
				        "end": 90.7,
				        "start": 90.55,
				        "word": ",",
				      },
				      {
				        "end": 90.85,
				        "start": 90.7,
				        "word": " many",
				      },
				      {
				        "end": 91.15,
				        "start": 90.85,
				        "word": " people",
				      },
				      {
				        "end": 91.42,
				        "start": 91.15,
				        "word": " have",
				      },
				      {
				        "end": 91.85,
				        "start": 91.42,
				        "word": " criticized",
				      },
				      {
				        "end": 92.14,
				        "start": 91.85,
				        "word": " React",
				      },
				      {
				        "end": 92.41,
				        "start": 92.14,
				        "word": " Native",
				      },
				      {
				        "end": 92.56,
				        "start": 92.41,
				        "word": " for",
				      },
				      {
				        "end": 92.71,
				        "start": 92.56,
				        "word": " not",
				      },
				      {
				        "end": 93.07,
				        "start": 92.71,
				        "word": " feeling",
				      },
				      {
				        "end": 93.32,
				        "start": 93.07,
				        "word": " truly",
				      },
				      {
				        "end": 93.62,
				        "start": 93.32,
				        "word": " native",
				      },
				    ],
				  },
				  {
				    "end": 97,
				    "start": 93.8,
				    "text": "and that's because it relies on a single-threaded JavaScript bridge",
				    "words": [
				      {
				        "end": 93.96,
				        "start": 93.8,
				        "word": " and",
				      },
				      {
				        "end": 94.18,
				        "start": 93.96,
				        "word": " that",
				      },
				      {
				        "end": 94.29,
				        "start": 94.18,
				        "word": "'s",
				      },
				      {
				        "end": 94.67,
				        "start": 94.29,
				        "word": " because",
				      },
				      {
				        "end": 94.78,
				        "start": 94.67,
				        "word": " it",
				      },
				      {
				        "end": 95.11,
				        "start": 94.78,
				        "word": " relies",
				      },
				      {
				        "end": 95.22,
				        "start": 95.11,
				        "word": " on",
				      },
				      {
				        "end": 95.27,
				        "start": 95.22,
				        "word": " a",
				      },
				      {
				        "end": 95.6,
				        "start": 95.27,
				        "word": " single",
				      },
				      {
				        "end": 95.69,
				        "start": 95.6,
				        "word": "-",
				      },
				      {
				        "end": 95.76,
				        "start": 95.69,
				        "word": "th",
				      },
				      {
				        "end": 96,
				        "start": 95.76,
				        "word": "read",
				      },
				      {
				        "end": 96.09,
				        "start": 96,
				        "word": "ed",
				      },
				      {
				        "end": 96.64,
				        "start": 96.09,
				        "word": " JavaScript",
				      },
				      {
				        "end": 97,
				        "start": 96.64,
				        "word": " bridge",
				      },
				    ],
				  },
				  {
				    "end": 102.34,
				    "start": 97,
				    "text": "that allows JavaScript code to communicate with native code, like Swift on iOS or Kotlin on Android,",
				    "words": [
				      {
				        "end": 97.22,
				        "start": 97,
				        "word": " that",
				      },
				      {
				        "end": 97.57,
				        "start": 97.22,
				        "word": " allows",
				      },
				      {
				        "end": 98.08,
				        "start": 97.57,
				        "word": " JavaScript",
				      },
				      {
				        "end": 98.32,
				        "start": 98.08,
				        "word": " code",
				      },
				      {
				        "end": 98.41,
				        "start": 98.32,
				        "word": " to",
				      },
				      {
				        "end": 98.94,
				        "start": 98.41,
				        "word": " communicate",
				      },
				      {
				        "end": 99.26,
				        "start": 98.94,
				        "word": " with",
				      },
				      {
				        "end": 99.64,
				        "start": 99.26,
				        "word": " native",
				      },
				      {
				        "end": 99.92,
				        "start": 99.64,
				        "word": " code",
				      },
				      {
				        "end": 99.92,
				        "start": 99.92,
				        "word": ",",
				      },
				      {
				        "end": 100.08,
				        "start": 100.04,
				        "word": "",
				      },
				      {
				        "end": 100.34,
				        "start": 100.08,
				        "word": " like",
				      },
				      {
				        "end": 100.71,
				        "start": 100.34,
				        "word": " Swift",
				      },
				      {
				        "end": 100.86,
				        "start": 100.71,
				        "word": " on",
				      },
				      {
				        "end": 101.08,
				        "start": 100.86,
				        "word": " iOS",
				      },
				      {
				        "end": 101.23,
				        "start": 101.08,
				        "word": " or",
				      },
				      {
				        "end": 101.45,
				        "start": 101.23,
				        "word": " Kot",
				      },
				      {
				        "end": 101.67,
				        "start": 101.45,
				        "word": "lin",
				      },
				      {
				        "end": 101.82,
				        "start": 101.67,
				        "word": " on",
				      },
				      {
				        "end": 102.34,
				        "start": 101.82,
				        "word": " Android",
				      },
				    ],
				  },
				  {
				    "end": 106.16,
				    "start": 102.52,
				    "text": "but that single-threaded bridge is a big bottleneck that can create performance issues.",
				    "words": [
				      {
				        "end": 102.66,
				        "start": 102.52,
				        "word": " but",
				      },
				      {
				        "end": 102.84,
				        "start": 102.66,
				        "word": " that",
				      },
				      {
				        "end": 103.12,
				        "start": 102.84,
				        "word": " single",
				      },
				      {
				        "end": 103.16,
				        "start": 103.12,
				        "word": "-",
				      },
				      {
				        "end": 103.26,
				        "start": 103.16,
				        "word": "th",
				      },
				      {
				        "end": 103.43,
				        "start": 103.26,
				        "word": "read",
				      },
				      {
				        "end": 103.53,
				        "start": 103.43,
				        "word": "ed",
				      },
				      {
				        "end": 103.79,
				        "start": 103.53,
				        "word": " bridge",
				      },
				      {
				        "end": 103.89,
				        "start": 103.79,
				        "word": " is",
				      },
				      {
				        "end": 103.93,
				        "start": 103.89,
				        "word": " a",
				      },
				      {
				        "end": 104.07,
				        "start": 103.93,
				        "word": " big",
				      },
				      {
				        "end": 104.44,
				        "start": 104.07,
				        "word": " bottlene",
				      },
				      {
				        "end": 104.53,
				        "start": 104.44,
				        "word": "ck",
				      },
				      {
				        "end": 104.71,
				        "start": 104.53,
				        "word": " that",
				      },
				      {
				        "end": 104.85,
				        "start": 104.71,
				        "word": " can",
				      },
				      {
				        "end": 105.13,
				        "start": 104.85,
				        "word": " create",
				      },
				      {
				        "end": 105.67,
				        "start": 105.13,
				        "word": " performance",
				      },
				      {
				        "end": 105.92,
				        "start": 105.67,
				        "word": " issues",
				      },
				      {
				        "end": 106.16,
				        "start": 105.92,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 107.86,
				    "start": 106.16,
				    "text": "Are you saying there's something wrong with my gear?",
				    "words": [
				      {
				        "end": 106.27,
				        "start": 106.16,
				        "word": " Are",
				      },
				      {
				        "end": 106.38,
				        "start": 106.27,
				        "word": " you",
				      },
				      {
				        "end": 106.6,
				        "start": 106.38,
				        "word": " saying",
				      },
				      {
				        "end": 106.84,
				        "start": 106.6,
				        "word": " there",
				      },
				      {
				        "end": 106.85,
				        "start": 106.84,
				        "word": "'s",
				      },
				      {
				        "end": 107.18,
				        "start": 106.85,
				        "word": " something",
				      },
				      {
				        "end": 107.35,
				        "start": 107.18,
				        "word": " wrong",
				      },
				      {
				        "end": 107.5,
				        "start": 107.35,
				        "word": " with",
				      },
				      {
				        "end": 107.64,
				        "start": 107.5,
				        "word": " my",
				      },
				      {
				        "end": 107.71,
				        "start": 107.64,
				        "word": " gear",
				      },
				      {
				        "end": 107.86,
				        "start": 107.71,
				        "word": "?",
				      },
				    ],
				  },
				  {
				    "end": 109.58,
				    "start": 107.86,
				    "text": "Is that what you're saying to me?",
				    "words": [
				      {
				        "end": 107.97,
				        "start": 107.86,
				        "word": " Is",
				      },
				      {
				        "end": 108.2,
				        "start": 107.97,
				        "word": " that",
				      },
				      {
				        "end": 108.43,
				        "start": 108.2,
				        "word": " what",
				      },
				      {
				        "end": 108.71,
				        "start": 108.43,
				        "word": " you",
				      },
				      {
				        "end": 108.77,
				        "start": 108.71,
				        "word": "'re",
				      },
				      {
				        "end": 109.12,
				        "start": 108.77,
				        "word": " saying",
				      },
				      {
				        "end": 109.23,
				        "start": 109.12,
				        "word": " to",
				      },
				      {
				        "end": 109.33,
				        "start": 109.23,
				        "word": " me",
				      },
				      {
				        "end": 109.58,
				        "start": 109.33,
				        "word": "?",
				      },
				    ],
				  },
				  {
				    "end": 113.01,
				    "start": 109.58,
				    "text": "The React Native team has addressed this by building a custom engine called Hermes",
				    "words": [
				      {
				        "end": 109.76,
				        "start": 109.58,
				        "word": " The",
				      },
				      {
				        "end": 109.99,
				        "start": 109.76,
				        "word": " React",
				      },
				      {
				        "end": 110.3,
				        "start": 109.99,
				        "word": " Native",
				      },
				      {
				        "end": 110.5,
				        "start": 110.3,
				        "word": " team",
				      },
				      {
				        "end": 110.65,
				        "start": 110.5,
				        "word": " has",
				      },
				      {
				        "end": 111.12,
				        "start": 110.65,
				        "word": " addressed",
				      },
				      {
				        "end": 111.36,
				        "start": 111.12,
				        "word": " this",
				      },
				      {
				        "end": 111.42,
				        "start": 111.36,
				        "word": " by",
				      },
				      {
				        "end": 111.83,
				        "start": 111.42,
				        "word": " building",
				      },
				      {
				        "end": 111.91,
				        "start": 111.83,
				        "word": " a",
				      },
				      {
				        "end": 112.19,
				        "start": 111.91,
				        "word": " custom",
				      },
				      {
				        "end": 112.5,
				        "start": 112.19,
				        "word": " engine",
				      },
				      {
				        "end": 112.81,
				        "start": 112.5,
				        "word": " called",
				      },
				      {
				        "end": 113.01,
				        "start": 112.81,
				        "word": " Herm",
				      },
				    ],
				  },
				  {
				    "end": 115.24,
				    "start": 113.2,
				    "text": "and released the fabric renderer a few years ago,",
				    "words": [
				      {
				        "end": 113.35,
				        "start": 113.2,
				        "word": " and",
				      },
				      {
				        "end": 113.76,
				        "start": 113.35,
				        "word": " released",
				      },
				      {
				        "end": 113.94,
				        "start": 113.76,
				        "word": " the",
				      },
				      {
				        "end": 114.27,
				        "start": 113.94,
				        "word": " fabric",
				      },
				      {
				        "end": 114.53,
				        "start": 114.27,
				        "word": " render",
				      },
				      {
				        "end": 114.63,
				        "start": 114.53,
				        "word": "er",
				      },
				      {
				        "end": 114.75,
				        "start": 114.63,
				        "word": " a",
				      },
				      {
				        "end": 114.83,
				        "start": 114.75,
				        "word": " few",
				      },
				      {
				        "end": 115.09,
				        "start": 114.83,
				        "word": " years",
				      },
				      {
				        "end": 115.24,
				        "start": 115.09,
				        "word": " ago",
				      },
				    ],
				  },
				  {
				    "end": 118.76,
				    "start": 115.4,
				    "text": "which some have called the new and improved bridge or a bridgeless architecture.",
				    "words": [
				      {
				        "end": 115.64,
				        "start": 115.4,
				        "word": " which",
				      },
				      {
				        "end": 115.84,
				        "start": 115.64,
				        "word": " some",
				      },
				      {
				        "end": 116.09,
				        "start": 115.84,
				        "word": " have",
				      },
				      {
				        "end": 116.3,
				        "start": 116.09,
				        "word": " called",
				      },
				      {
				        "end": 116.44,
				        "start": 116.3,
				        "word": " the",
				      },
				      {
				        "end": 116.58,
				        "start": 116.44,
				        "word": " new",
				      },
				      {
				        "end": 116.72,
				        "start": 116.58,
				        "word": " and",
				      },
				      {
				        "end": 117.1,
				        "start": 116.72,
				        "word": " improved",
				      },
				      {
				        "end": 117.38,
				        "start": 117.1,
				        "word": " bridge",
				      },
				      {
				        "end": 117.48,
				        "start": 117.38,
				        "word": " or",
				      },
				      {
				        "end": 117.51,
				        "start": 117.48,
				        "word": " a",
				      },
				      {
				        "end": 117.7,
				        "start": 117.51,
				        "word": " brid",
				      },
				      {
				        "end": 117.74,
				        "start": 117.7,
				        "word": "g",
				      },
				      {
				        "end": 117.97,
				        "start": 117.74,
				        "word": "eless",
				      },
				      {
				        "end": 118.54,
				        "start": 117.97,
				        "word": " architecture",
				      },
				      {
				        "end": 118.76,
				        "start": 118.54,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 122.79,
				    "start": 118.76,
				    "text": "But ByteDance has taken a different approach with Lynx using a dual-threaded architecture,",
				    "words": [
				      {
				        "end": 118.92,
				        "start": 118.76,
				        "word": " But",
				      },
				      {
				        "end": 119.04,
				        "start": 118.92,
				        "word": " By",
				      },
				      {
				        "end": 119.12,
				        "start": 119.04,
				        "word": "te",
				      },
				      {
				        "end": 119.22,
				        "start": 119.12,
				        "word": "D",
				      },
				      {
				        "end": 119.44,
				        "start": 119.22,
				        "word": "ance",
				      },
				      {
				        "end": 119.54,
				        "start": 119.44,
				        "word": " has",
				      },
				      {
				        "end": 119.81,
				        "start": 119.54,
				        "word": " taken",
				      },
				      {
				        "end": 119.85,
				        "start": 119.81,
				        "word": " a",
				      },
				      {
				        "end": 120.33,
				        "start": 119.85,
				        "word": " different",
				      },
				      {
				        "end": 120.75,
				        "start": 120.33,
				        "word": " approach",
				      },
				      {
				        "end": 120.99,
				        "start": 120.75,
				        "word": " with",
				      },
				      {
				        "end": 121.12,
				        "start": 120.99,
				        "word": " Lyn",
				      },
				      {
				        "end": 121.17,
				        "start": 121.12,
				        "word": "x",
				      },
				      {
				        "end": 121.43,
				        "start": 121.17,
				        "word": " using",
				      },
				      {
				        "end": 121.48,
				        "start": 121.43,
				        "word": " a",
				      },
				      {
				        "end": 121.69,
				        "start": 121.48,
				        "word": " dual",
				      },
				      {
				        "end": 121.74,
				        "start": 121.69,
				        "word": "-",
				      },
				      {
				        "end": 121.84,
				        "start": 121.74,
				        "word": "th",
				      },
				      {
				        "end": 122.05,
				        "start": 121.84,
				        "word": "read",
				      },
				      {
				        "end": 122.2,
				        "start": 122.05,
				        "word": "ed",
				      },
				      {
				        "end": 122.79,
				        "start": 122.2,
				        "word": " architecture",
				      },
				    ],
				  },
				  {
				    "end": 127.22,
				    "start": 122.98,
				    "text": "where user code and framework code are split into two distinct runtimes.",
				    "words": [
				      {
				        "end": 123.36,
				        "start": 122.98,
				        "word": " where",
				      },
				      {
				        "end": 123.57,
				        "start": 123.36,
				        "word": " user",
				      },
				      {
				        "end": 123.83,
				        "start": 123.57,
				        "word": " code",
				      },
				      {
				        "end": 124.03,
				        "start": 123.83,
				        "word": " and",
				      },
				      {
				        "end": 124.63,
				        "start": 124.03,
				        "word": " framework",
				      },
				      {
				        "end": 124.92,
				        "start": 124.63,
				        "word": " code",
				      },
				      {
				        "end": 125.09,
				        "start": 124.92,
				        "word": " are",
				      },
				      {
				        "end": 125.42,
				        "start": 125.09,
				        "word": " split",
				      },
				      {
				        "end": 125.68,
				        "start": 125.42,
				        "word": " into",
				      },
				      {
				        "end": 125.88,
				        "start": 125.68,
				        "word": " two",
				      },
				      {
				        "end": 126.41,
				        "start": 125.88,
				        "word": " distinct",
				      },
				      {
				        "end": 126.67,
				        "start": 126.41,
				        "word": " runt",
				      },
				      {
				        "end": 126.93,
				        "start": 126.67,
				        "word": "imes",
				      },
				      {
				        "end": 127.22,
				        "start": 126.93,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 130.48,
				    "start": 127.48,
				    "text": "The main thread is powered by Prim.js, which itself is built on Quick.js,",
				    "words": [
				      {
				        "end": 127.63,
				        "start": 127.48,
				        "word": " The",
				      },
				      {
				        "end": 127.85,
				        "start": 127.63,
				        "word": " main",
				      },
				      {
				        "end": 128.13,
				        "start": 127.85,
				        "word": " thread",
				      },
				      {
				        "end": 128.23,
				        "start": 128.13,
				        "word": " is",
				      },
				      {
				        "end": 128.59,
				        "start": 128.23,
				        "word": " powered",
				      },
				      {
				        "end": 128.68,
				        "start": 128.59,
				        "word": " by",
				      },
				      {
				        "end": 128.88,
				        "start": 128.68,
				        "word": " Prim",
				      },
				      {
				        "end": 129.03,
				        "start": 128.88,
				        "word": ".",
				      },
				      {
				        "end": 129.13,
				        "start": 129.03,
				        "word": "js",
				      },
				      {
				        "end": 129.27,
				        "start": 129.13,
				        "word": ",",
				      },
				      {
				        "end": 129.48,
				        "start": 129.27,
				        "word": " which",
				      },
				      {
				        "end": 129.81,
				        "start": 129.48,
				        "word": " itself",
				      },
				      {
				        "end": 129.88,
				        "start": 129.81,
				        "word": " is",
				      },
				      {
				        "end": 130.15,
				        "start": 129.88,
				        "word": " built",
				      },
				      {
				        "end": 130.23,
				        "start": 130.15,
				        "word": " on",
				      },
				      {
				        "end": 130.48,
				        "start": 130.23,
				        "word": " Quick",
				      },
				    ],
				  },
				  {
				    "end": 134.12,
				    "start": 130.86,
				    "text": "which is a tiny 210-kilobyte JavaScript engine.",
				    "words": [
				      {
				        "end": 131.19,
				        "start": 130.86,
				        "word": " which",
				      },
				      {
				        "end": 131.32,
				        "start": 131.19,
				        "word": " is",
				      },
				      {
				        "end": 131.38,
				        "start": 131.32,
				        "word": " a",
				      },
				      {
				        "end": 131.66,
				        "start": 131.38,
				        "word": " tiny",
				      },
				      {
				        "end": 132.23,
				        "start": 131.66,
				        "word": " 210",
				      },
				      {
				        "end": 132.29,
				        "start": 132.23,
				        "word": "-",
				      },
				      {
				        "end": 132.47,
				        "start": 132.29,
				        "word": "kil",
				      },
				      {
				        "end": 132.67,
				        "start": 132.47,
				        "word": "oby",
				      },
				      {
				        "end": 132.85,
				        "start": 132.67,
				        "word": "te",
				      },
				      {
				        "end": 133.46,
				        "start": 132.85,
				        "word": " JavaScript",
				      },
				      {
				        "end": 133.85,
				        "start": 133.46,
				        "word": " engine",
				      },
				      {
				        "end": 134.12,
				        "start": 133.85,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 137.18,
				    "start": 134.12,
				    "text": "Its job is to handle synchronous UI tasks like event handling,",
				    "words": [
				      {
				        "end": 134.3,
				        "start": 134.12,
				        "word": " Its",
				      },
				      {
				        "end": 134.5,
				        "start": 134.3,
				        "word": " job",
				      },
				      {
				        "end": 134.6,
				        "start": 134.5,
				        "word": " is",
				      },
				      {
				        "end": 134.72,
				        "start": 134.6,
				        "word": " to",
				      },
				      {
				        "end": 135.08,
				        "start": 134.72,
				        "word": " handle",
				      },
				      {
				        "end": 135.76,
				        "start": 135.08,
				        "word": " synchronous",
				      },
				      {
				        "end": 135.86,
				        "start": 135.76,
				        "word": " UI",
				      },
				      {
				        "end": 136.16,
				        "start": 135.86,
				        "word": " tasks",
				      },
				      {
				        "end": 136.42,
				        "start": 136.16,
				        "word": " like",
				      },
				      {
				        "end": 136.71,
				        "start": 136.42,
				        "word": " event",
				      },
				      {
				        "end": 137.18,
				        "start": 136.71,
				        "word": " handling",
				      },
				    ],
				  },
				  {
				    "end": 139.33,
				    "start": 137.32,
				    "text": "while user code runs on a separate thread,",
				    "words": [
				      {
				        "end": 137.64,
				        "start": 137.32,
				        "word": " while",
				      },
				      {
				        "end": 137.85,
				        "start": 137.64,
				        "word": " user",
				      },
				      {
				        "end": 138.09,
				        "start": 137.85,
				        "word": " code",
				      },
				      {
				        "end": 138.33,
				        "start": 138.09,
				        "word": " runs",
				      },
				      {
				        "end": 138.45,
				        "start": 138.33,
				        "word": " on",
				      },
				      {
				        "end": 138.51,
				        "start": 138.45,
				        "word": " a",
				      },
				      {
				        "end": 138.98,
				        "start": 138.51,
				        "word": " separate",
				      },
				      {
				        "end": 139.33,
				        "start": 138.98,
				        "word": " thread",
				      },
				    ],
				  },
				  {
				    "end": 143.82,
				    "start": 139.48,
				    "text": "which means the crappy, inefficient code you write won't block the main thread and degrade performance.",
				    "words": [
				      {
				        "end": 139.72,
				        "start": 139.48,
				        "word": " which",
				      },
				      {
				        "end": 139.94,
				        "start": 139.72,
				        "word": " means",
				      },
				      {
				        "end": 140.08,
				        "start": 139.94,
				        "word": " the",
				      },
				      {
				        "end": 140.41,
				        "start": 140.08,
				        "word": " crappy",
				      },
				      {
				        "end": 140.45,
				        "start": 140.41,
				        "word": ",",
				      },
				      {
				        "end": 140.98,
				        "start": 140.45,
				        "word": " inefficient",
				      },
				      {
				        "end": 141.16,
				        "start": 140.98,
				        "word": " code",
				      },
				      {
				        "end": 141.3,
				        "start": 141.16,
				        "word": " you",
				      },
				      {
				        "end": 141.53,
				        "start": 141.3,
				        "word": " write",
				      },
				      {
				        "end": 141.7,
				        "start": 141.53,
				        "word": " won",
				      },
				      {
				        "end": 141.76,
				        "start": 141.7,
				        "word": "'t",
				      },
				      {
				        "end": 141.99,
				        "start": 141.76,
				        "word": " block",
				      },
				      {
				        "end": 142.2,
				        "start": 141.99,
				        "word": " the",
				      },
				      {
				        "end": 142.32,
				        "start": 142.2,
				        "word": " main",
				      },
				      {
				        "end": 142.6,
				        "start": 142.32,
				        "word": " thread",
				      },
				      {
				        "end": 142.74,
				        "start": 142.6,
				        "word": " and",
				      },
				      {
				        "end": 142.83,
				        "start": 142.74,
				        "word": " de",
				      },
				      {
				        "end": 143.08,
				        "start": 142.83,
				        "word": "grade",
				      },
				      {
				        "end": 143.59,
				        "start": 143.08,
				        "word": " performance",
				      },
				      {
				        "end": 143.82,
				        "start": 143.59,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 147.5,
				    "start": 143.82,
				    "text": "And the end result is instant first frame rendering for the end user.",
				    "words": [
				      {
				        "end": 144,
				        "start": 143.82,
				        "word": " And",
				      },
				      {
				        "end": 144.24,
				        "start": 144,
				        "word": " the",
				      },
				      {
				        "end": 144.36,
				        "start": 144.24,
				        "word": " end",
				      },
				      {
				        "end": 144.73,
				        "start": 144.36,
				        "word": " result",
				      },
				      {
				        "end": 144.85,
				        "start": 144.73,
				        "word": " is",
				      },
				      {
				        "end": 145.28,
				        "start": 144.85,
				        "word": " instant",
				      },
				      {
				        "end": 145.59,
				        "start": 145.28,
				        "word": " first",
				      },
				      {
				        "end": 145.9,
				        "start": 145.59,
				        "word": " frame",
				      },
				      {
				        "end": 146.46,
				        "start": 145.9,
				        "word": " rendering",
				      },
				      {
				        "end": 146.64,
				        "start": 146.46,
				        "word": " for",
				      },
				      {
				        "end": 146.82,
				        "start": 146.64,
				        "word": " the",
				      },
				      {
				        "end": 147,
				        "start": 146.82,
				        "word": " end",
				      },
				      {
				        "end": 147.24,
				        "start": 147,
				        "word": " user",
				      },
				      {
				        "end": 147.5,
				        "start": 147.24,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 149.52,
				    "start": 147.5,
				    "text": "Or in other words, no blank screens.",
				    "words": [
				      {
				        "end": 147.74,
				        "start": 147.5,
				        "word": " Or",
				      },
				      {
				        "end": 147.75,
				        "start": 147.74,
				        "word": " in",
				      },
				      {
				        "end": 148.04,
				        "start": 147.75,
				        "word": " other",
				      },
				      {
				        "end": 148.34,
				        "start": 148.04,
				        "word": " words",
				      },
				      {
				        "end": 148.46,
				        "start": 148.34,
				        "word": ",",
				      },
				      {
				        "end": 148.58,
				        "start": 148.46,
				        "word": " no",
				      },
				      {
				        "end": 148.88,
				        "start": 148.58,
				        "word": " blank",
				      },
				      {
				        "end": 149.3,
				        "start": 148.88,
				        "word": " screens",
				      },
				      {
				        "end": 149.52,
				        "start": 149.3,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 154.06,
				    "start": 149.52,
				    "text": "That's pretty cool, but what's even more awesome is that this engine is framework-agnostic.",
				    "words": [
				      {
				        "end": 149.79,
				        "start": 149.52,
				        "word": " That",
				      },
				      {
				        "end": 149.85,
				        "start": 149.79,
				        "word": "'s",
				      },
				      {
				        "end": 150.18,
				        "start": 149.85,
				        "word": " pretty",
				      },
				      {
				        "end": 150.4,
				        "start": 150.18,
				        "word": " cool",
				      },
				      {
				        "end": 150.51,
				        "start": 150.4,
				        "word": ",",
				      },
				      {
				        "end": 150.72,
				        "start": 150.51,
				        "word": " but",
				      },
				      {
				        "end": 150.89,
				        "start": 150.72,
				        "word": " what",
				      },
				      {
				        "end": 151,
				        "start": 150.89,
				        "word": "'s",
				      },
				      {
				        "end": 151.22,
				        "start": 151,
				        "word": " even",
				      },
				      {
				        "end": 151.44,
				        "start": 151.22,
				        "word": " more",
				      },
				      {
				        "end": 151.83,
				        "start": 151.44,
				        "word": " awesome",
				      },
				      {
				        "end": 151.94,
				        "start": 151.83,
				        "word": " is",
				      },
				      {
				        "end": 152.16,
				        "start": 151.94,
				        "word": " that",
				      },
				      {
				        "end": 152.42,
				        "start": 152.16,
				        "word": " this",
				      },
				      {
				        "end": 152.71,
				        "start": 152.42,
				        "word": " engine",
				      },
				      {
				        "end": 152.82,
				        "start": 152.71,
				        "word": " is",
				      },
				      {
				        "end": 153.32,
				        "start": 152.82,
				        "word": " framework",
				      },
				      {
				        "end": 153.37,
				        "start": 153.32,
				        "word": "-",
				      },
				      {
				        "end": 153.53,
				        "start": 153.37,
				        "word": "agn",
				      },
				      {
				        "end": 153.8,
				        "start": 153.53,
				        "word": "ostic",
				      },
				      {
				        "end": 154.06,
				        "start": 153.8,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 158.46,
				    "start": 154.33,
				    "text": "You don't have to use React, and could build your app and Svelte, Vue, or whatever framework you want.",
				    "words": [
				      {
				        "end": 154.45,
				        "start": 154.33,
				        "word": " You",
				      },
				      {
				        "end": 154.63,
				        "start": 154.45,
				        "word": " don",
				      },
				      {
				        "end": 154.7,
				        "start": 154.63,
				        "word": "'t",
				      },
				      {
				        "end": 154.89,
				        "start": 154.7,
				        "word": " have",
				      },
				      {
				        "end": 155,
				        "start": 154.89,
				        "word": " to",
				      },
				      {
				        "end": 155.15,
				        "start": 155,
				        "word": " use",
				      },
				      {
				        "end": 155.41,
				        "start": 155.15,
				        "word": " React",
				      },
				      {
				        "end": 155.51,
				        "start": 155.41,
				        "word": ",",
				      },
				      {
				        "end": 155.66,
				        "start": 155.51,
				        "word": " and",
				      },
				      {
				        "end": 155.94,
				        "start": 155.66,
				        "word": " could",
				      },
				      {
				        "end": 156.18,
				        "start": 155.94,
				        "word": " build",
				      },
				      {
				        "end": 156.38,
				        "start": 156.18,
				        "word": " your",
				      },
				      {
				        "end": 156.53,
				        "start": 156.38,
				        "word": " app",
				      },
				      {
				        "end": 156.68,
				        "start": 156.53,
				        "word": " and",
				      },
				      {
				        "end": 156.73,
				        "start": 156.68,
				        "word": " S",
				      },
				      {
				        "end": 156.94,
				        "start": 156.73,
				        "word": "vel",
				      },
				      {
				        "end": 156.98,
				        "start": 156.94,
				        "word": "te",
				      },
				      {
				        "end": 157.08,
				        "start": 156.98,
				        "word": ",",
				      },
				      {
				        "end": 157.13,
				        "start": 157.08,
				        "word": " V",
				      },
				      {
				        "end": 157.24,
				        "start": 157.13,
				        "word": "ue",
				      },
				      {
				        "end": 157.33,
				        "start": 157.24,
				        "word": ",",
				      },
				      {
				        "end": 157.43,
				        "start": 157.33,
				        "word": " or",
				      },
				      {
				        "end": 157.84,
				        "start": 157.43,
				        "word": " whatever",
				      },
				      {
				        "end": 158.31,
				        "start": 157.84,
				        "word": " framework",
				      },
				      {
				        "end": 158.46,
				        "start": 158.31,
				        "word": " you",
				      },
				    ],
				  },
				  {
				    "end": 162.29,
				    "start": 158.96,
				    "text": "In addition, it supports actual native CSS features for styling,",
				    "words": [
				      {
				        "end": 159.08,
				        "start": 158.96,
				        "word": " In",
				      },
				      {
				        "end": 159.57,
				        "start": 159.08,
				        "word": " addition",
				      },
				      {
				        "end": 159.69,
				        "start": 159.57,
				        "word": ",",
				      },
				      {
				        "end": 159.81,
				        "start": 159.69,
				        "word": " it",
				      },
				      {
				        "end": 160.3,
				        "start": 159.81,
				        "word": " supports",
				      },
				      {
				        "end": 160.66,
				        "start": 160.3,
				        "word": " actual",
				      },
				      {
				        "end": 161.03,
				        "start": 160.66,
				        "word": " native",
				      },
				      {
				        "end": 161.2,
				        "start": 161.03,
				        "word": " CSS",
				      },
				      {
				        "end": 161.69,
				        "start": 161.2,
				        "word": " features",
				      },
				      {
				        "end": 161.87,
				        "start": 161.69,
				        "word": " for",
				      },
				      {
				        "end": 162.29,
				        "start": 161.87,
				        "word": " styling",
				      },
				    ],
				  },
				  {
				    "end": 165.7,
				    "start": 162.46,
				    "text": "like transition animations, variables, gradients, and so on.",
				    "words": [
				      {
				        "end": 162.72,
				        "start": 162.46,
				        "word": " like",
				      },
				      {
				        "end": 163.21,
				        "start": 162.72,
				        "word": " transition",
				      },
				      {
				        "end": 163.75,
				        "start": 163.21,
				        "word": " animations",
				      },
				      {
				        "end": 163.88,
				        "start": 163.75,
				        "word": ",",
				      },
				      {
				        "end": 164.5,
				        "start": 163.88,
				        "word": " variables",
				      },
				      {
				        "end": 164.63,
				        "start": 164.5,
				        "word": ",",
				      },
				      {
				        "end": 164.89,
				        "start": 164.63,
				        "word": " grad",
				      },
				      {
				        "end": 165.24,
				        "start": 164.89,
				        "word": "ients",
				      },
				      {
				        "end": 165.37,
				        "start": 165.24,
				        "word": ",",
				      },
				      {
				        "end": 165.57,
				        "start": 165.37,
				        "word": " and",
				      },
				      {
				        "end": 165.7,
				        "start": 165.57,
				        "word": " so",
				      },
				    ],
				  },
				  {
				    "end": 167.9,
				    "start": 166.1,
				    "text": "And that's a lot more intuitive for web developers.",
				    "words": [
				      {
				        "end": 166.22,
				        "start": 166.1,
				        "word": " And",
				      },
				      {
				        "end": 166.39,
				        "start": 166.22,
				        "word": " that",
				      },
				      {
				        "end": 166.45,
				        "start": 166.39,
				        "word": "'s",
				      },
				      {
				        "end": 166.49,
				        "start": 166.45,
				        "word": " a",
				      },
				      {
				        "end": 166.61,
				        "start": 166.49,
				        "word": " lot",
				      },
				      {
				        "end": 166.77,
				        "start": 166.61,
				        "word": " more",
				      },
				      {
				        "end": 167.12,
				        "start": 166.77,
				        "word": " intuitive",
				      },
				      {
				        "end": 167.24,
				        "start": 167.12,
				        "word": " for",
				      },
				      {
				        "end": 167.36,
				        "start": 167.24,
				        "word": " web",
				      },
				      {
				        "end": 167.75,
				        "start": 167.36,
				        "word": " developers",
				      },
				      {
				        "end": 167.9,
				        "start": 167.75,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 171.76,
				    "start": 167.9,
				    "text": "The major problem, though, is that there's virtually no ecosystem around this framework.",
				    "words": [
				      {
				        "end": 168.04,
				        "start": 167.9,
				        "word": " The",
				      },
				      {
				        "end": 168.28,
				        "start": 168.04,
				        "word": " major",
				      },
				      {
				        "end": 168.61,
				        "start": 168.28,
				        "word": " problem",
				      },
				      {
				        "end": 168.7,
				        "start": 168.61,
				        "word": ",",
				      },
				      {
				        "end": 168.98,
				        "start": 168.7,
				        "word": " though",
				      },
				      {
				        "end": 169.07,
				        "start": 168.98,
				        "word": ",",
				      },
				      {
				        "end": 169.17,
				        "start": 169.07,
				        "word": " is",
				      },
				      {
				        "end": 169.35,
				        "start": 169.17,
				        "word": " that",
				      },
				      {
				        "end": 169.59,
				        "start": 169.35,
				        "word": " there",
				      },
				      {
				        "end": 169.68,
				        "start": 169.59,
				        "word": "'s",
				      },
				      {
				        "end": 170.11,
				        "start": 169.68,
				        "word": " virtually",
				      },
				      {
				        "end": 170.2,
				        "start": 170.11,
				        "word": " no",
				      },
				      {
				        "end": 170.63,
				        "start": 170.2,
				        "word": " ecosystem",
				      },
				      {
				        "end": 170.91,
				        "start": 170.63,
				        "word": " around",
				      },
				      {
				        "end": 171.1,
				        "start": 170.91,
				        "word": " this",
				      },
				      {
				        "end": 171.53,
				        "start": 171.1,
				        "word": " framework",
				      },
				      {
				        "end": 171.76,
				        "start": 171.53,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 174.04,
				    "start": 171.76,
				    "text": "There's no expo tooling to solve all your problems,",
				    "words": [
				      {
				        "end": 172.03,
				        "start": 171.76,
				        "word": " There",
				      },
				      {
				        "end": 172.14,
				        "start": 172.03,
				        "word": "'s",
				      },
				      {
				        "end": 172.25,
				        "start": 172.14,
				        "word": " no",
				      },
				      {
				        "end": 172.41,
				        "start": 172.25,
				        "word": " exp",
				      },
				      {
				        "end": 172.48,
				        "start": 172.41,
				        "word": "o",
				      },
				      {
				        "end": 172.84,
				        "start": 172.48,
				        "word": " tooling",
				      },
				      {
				        "end": 172.95,
				        "start": 172.84,
				        "word": " to",
				      },
				      {
				        "end": 173.23,
				        "start": 172.95,
				        "word": " solve",
				      },
				      {
				        "end": 173.38,
				        "start": 173.23,
				        "word": " all",
				      },
				      {
				        "end": 173.6,
				        "start": 173.38,
				        "word": " your",
				      },
				      {
				        "end": 174.04,
				        "start": 173.6,
				        "word": " problems",
				      },
				    ],
				  },
				  {
				    "end": 176.78,
				    "start": 174.2,
				    "text": "and there's no massive widget library like you have in Flutter.",
				    "words": [
				      {
				        "end": 174.39,
				        "start": 174.2,
				        "word": " and",
				      },
				      {
				        "end": 174.57,
				        "start": 174.39,
				        "word": " there",
				      },
				      {
				        "end": 174.68,
				        "start": 174.57,
				        "word": "'s",
				      },
				      {
				        "end": 174.75,
				        "start": 174.68,
				        "word": " no",
				      },
				      {
				        "end": 175.07,
				        "start": 174.75,
				        "word": " massive",
				      },
				      {
				        "end": 175.35,
				        "start": 175.07,
				        "word": " widget",
				      },
				      {
				        "end": 175.67,
				        "start": 175.35,
				        "word": " library",
				      },
				      {
				        "end": 175.85,
				        "start": 175.67,
				        "word": " like",
				      },
				      {
				        "end": 175.99,
				        "start": 175.85,
				        "word": " you",
				      },
				      {
				        "end": 176.17,
				        "start": 175.99,
				        "word": " have",
				      },
				      {
				        "end": 176.26,
				        "start": 176.17,
				        "word": " in",
				      },
				      {
				        "end": 176.35,
				        "start": 176.26,
				        "word": " Fl",
				      },
				      {
				        "end": 176.58,
				        "start": 176.35,
				        "word": "utter",
				      },
				      {
				        "end": 176.78,
				        "start": 176.58,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 180.34,
				    "start": 176.78,
				    "text": "That being said, let's go ahead and try it out to find out if it has any potential.",
				    "words": [
				      {
				        "end": 176.98,
				        "start": 176.78,
				        "word": " That",
				      },
				      {
				        "end": 177.23,
				        "start": 176.98,
				        "word": " being",
				      },
				      {
				        "end": 177.43,
				        "start": 177.23,
				        "word": " said",
				      },
				      {
				        "end": 177.53,
				        "start": 177.43,
				        "word": ",",
				      },
				      {
				        "end": 177.68,
				        "start": 177.53,
				        "word": " let",
				      },
				      {
				        "end": 177.77,
				        "start": 177.68,
				        "word": "'s",
				      },
				      {
				        "end": 177.88,
				        "start": 177.77,
				        "word": " go",
				      },
				      {
				        "end": 178.13,
				        "start": 177.88,
				        "word": " ahead",
				      },
				      {
				        "end": 178.28,
				        "start": 178.13,
				        "word": " and",
				      },
				      {
				        "end": 178.42,
				        "start": 178.28,
				        "word": " try",
				      },
				      {
				        "end": 178.53,
				        "start": 178.42,
				        "word": " it",
				      },
				      {
				        "end": 178.68,
				        "start": 178.53,
				        "word": " out",
				      },
				      {
				        "end": 178.78,
				        "start": 178.68,
				        "word": " to",
				      },
				      {
				        "end": 178.97,
				        "start": 178.78,
				        "word": " find",
				      },
				      {
				        "end": 179.13,
				        "start": 178.97,
				        "word": " out",
				      },
				      {
				        "end": 179.23,
				        "start": 179.13,
				        "word": " if",
				      },
				      {
				        "end": 179.33,
				        "start": 179.23,
				        "word": " it",
				      },
				      {
				        "end": 179.48,
				        "start": 179.33,
				        "word": " has",
				      },
				      {
				        "end": 179.63,
				        "start": 179.48,
				        "word": " any",
				      },
				      {
				        "end": 180.09,
				        "start": 179.63,
				        "word": " potential",
				      },
				      {
				        "end": 180.34,
				        "start": 180.09,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 183.91,
				    "start": 180.34,
				    "text": "When you generate a project, the first thing you'll notice is that it uses RSPack,",
				    "words": [
				      {
				        "end": 180.61,
				        "start": 180.34,
				        "word": " When",
				      },
				      {
				        "end": 180.73,
				        "start": 180.61,
				        "word": " you",
				      },
				      {
				        "end": 181.18,
				        "start": 180.73,
				        "word": " generate",
				      },
				      {
				        "end": 181.25,
				        "start": 181.18,
				        "word": " a",
				      },
				      {
				        "end": 181.62,
				        "start": 181.25,
				        "word": " project",
				      },
				      {
				        "end": 181.75,
				        "start": 181.62,
				        "word": ",",
				      },
				      {
				        "end": 181.9,
				        "start": 181.75,
				        "word": " the",
				      },
				      {
				        "end": 182.2,
				        "start": 181.9,
				        "word": " first",
				      },
				      {
				        "end": 182.46,
				        "start": 182.2,
				        "word": " thing",
				      },
				      {
				        "end": 182.63,
				        "start": 182.46,
				        "word": " you",
				      },
				      {
				        "end": 182.8,
				        "start": 182.63,
				        "word": "'ll",
				      },
				      {
				        "end": 183.14,
				        "start": 182.8,
				        "word": " notice",
				      },
				      {
				        "end": 183.24,
				        "start": 183.14,
				        "word": " is",
				      },
				      {
				        "end": 183.47,
				        "start": 183.24,
				        "word": " that",
				      },
				      {
				        "end": 183.59,
				        "start": 183.47,
				        "word": " it",
				      },
				      {
				        "end": 183.8,
				        "start": 183.59,
				        "word": " uses",
				      },
				      {
				        "end": 183.91,
				        "start": 183.8,
				        "word": " RS",
				      },
				    ],
				  },
				  {
				    "end": 187.79,
				    "start": 184.34,
				    "text": "which is a Rust-based module bundler that's supposedly even faster than Vite.",
				    "words": [
				      {
				        "end": 184.63,
				        "start": 184.34,
				        "word": " which",
				      },
				      {
				        "end": 184.73,
				        "start": 184.63,
				        "word": " is",
				      },
				      {
				        "end": 184.78,
				        "start": 184.73,
				        "word": " a",
				      },
				      {
				        "end": 185,
				        "start": 184.78,
				        "word": " Rust",
				      },
				      {
				        "end": 185.05,
				        "start": 185,
				        "word": "-",
				      },
				      {
				        "end": 185.33,
				        "start": 185.05,
				        "word": "based",
				      },
				      {
				        "end": 185.68,
				        "start": 185.33,
				        "word": " module",
				      },
				      {
				        "end": 185.89,
				        "start": 185.68,
				        "word": " bund",
				      },
				      {
				        "end": 186.06,
				        "start": 185.89,
				        "word": "ler",
				      },
				      {
				        "end": 186.28,
				        "start": 186.06,
				        "word": " that",
				      },
				      {
				        "end": 186.39,
				        "start": 186.28,
				        "word": "'s",
				      },
				      {
				        "end": 186.96,
				        "start": 186.39,
				        "word": " supposedly",
				      },
				      {
				        "end": 187.18,
				        "start": 186.96,
				        "word": " even",
				      },
				      {
				        "end": 187.52,
				        "start": 187.18,
				        "word": " faster",
				      },
				      {
				        "end": 187.74,
				        "start": 187.52,
				        "word": " than",
				      },
				      {
				        "end": 187.79,
				        "start": 187.74,
				        "word": " V",
				      },
				    ],
				  },
				  {
				    "end": 190.37,
				    "start": 188.22,
				    "text": "That'll generate a starter template in TypeScript,",
				    "words": [
				      {
				        "end": 188.42,
				        "start": 188.22,
				        "word": " That",
				      },
				      {
				        "end": 188.57,
				        "start": 188.42,
				        "word": "'ll",
				      },
				      {
				        "end": 188.97,
				        "start": 188.57,
				        "word": " generate",
				      },
				      {
				        "end": 189.02,
				        "start": 188.97,
				        "word": " a",
				      },
				      {
				        "end": 189.37,
				        "start": 189.02,
				        "word": " starter",
				      },
				      {
				        "end": 189.77,
				        "start": 189.37,
				        "word": " template",
				      },
				      {
				        "end": 189.87,
				        "start": 189.77,
				        "word": " in",
				      },
				      {
				        "end": 190.08,
				        "start": 189.87,
				        "word": " Type",
				      },
				      {
				        "end": 190.37,
				        "start": 190.08,
				        "word": "Script",
				      },
				    ],
				  },
				  {
				    "end": 193.98,
				    "start": 190.5,
				    "text": "and if we look at the code, it looks like a basic React.js project,",
				    "words": [
				      {
				        "end": 190.71,
				        "start": 190.5,
				        "word": " and",
				      },
				      {
				        "end": 190.77,
				        "start": 190.71,
				        "word": " if",
				      },
				      {
				        "end": 190.88,
				        "start": 190.77,
				        "word": " we",
				      },
				      {
				        "end": 191.1,
				        "start": 190.88,
				        "word": " look",
				      },
				      {
				        "end": 191.21,
				        "start": 191.1,
				        "word": " at",
				      },
				      {
				        "end": 191.42,
				        "start": 191.21,
				        "word": " the",
				      },
				      {
				        "end": 191.59,
				        "start": 191.42,
				        "word": " code",
				      },
				      {
				        "end": 191.72,
				        "start": 191.59,
				        "word": ",",
				      },
				      {
				        "end": 191.85,
				        "start": 191.72,
				        "word": " it",
				      },
				      {
				        "end": 192.19,
				        "start": 191.85,
				        "word": " looks",
				      },
				      {
				        "end": 192.44,
				        "start": 192.19,
				        "word": " like",
				      },
				      {
				        "end": 192.5,
				        "start": 192.44,
				        "word": " a",
				      },
				      {
				        "end": 192.83,
				        "start": 192.5,
				        "word": " basic",
				      },
				      {
				        "end": 193.16,
				        "start": 192.83,
				        "word": " React",
				      },
				      {
				        "end": 193.35,
				        "start": 193.16,
				        "word": ".",
				      },
				      {
				        "end": 193.48,
				        "start": 193.35,
				        "word": "js",
				      },
				      {
				        "end": 193.98,
				        "start": 193.48,
				        "word": " project",
				      },
				    ],
				  },
				  {
				    "end": 196.66,
				    "start": 193.98,
				    "text": "where the UI is represented with HTML and CSS.",
				    "words": [
				      {
				        "end": 194.31,
				        "start": 193.98,
				        "word": " where",
				      },
				      {
				        "end": 194.51,
				        "start": 194.31,
				        "word": " the",
				      },
				      {
				        "end": 194.64,
				        "start": 194.51,
				        "word": " UI",
				      },
				      {
				        "end": 194.77,
				        "start": 194.64,
				        "word": " is",
				      },
				      {
				        "end": 195.5,
				        "start": 194.77,
				        "word": " represented",
				      },
				      {
				        "end": 195.76,
				        "start": 195.5,
				        "word": " with",
				      },
				      {
				        "end": 196.02,
				        "start": 195.76,
				        "word": " HTML",
				      },
				      {
				        "end": 196.22,
				        "start": 196.02,
				        "word": " and",
				      },
				      {
				        "end": 196.42,
				        "start": 196.22,
				        "word": " CSS",
				      },
				      {
				        "end": 196.66,
				        "start": 196.42,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 202.34,
				    "start": 197.02,
				    "text": "But if we take a closer look at the markup, you'll notice we're using non-standard elements like Vue, Text, and Image.",
				    "words": [
				      {
				        "end": 197.15,
				        "start": 197.02,
				        "word": " But",
				      },
				      {
				        "end": 197.26,
				        "start": 197.15,
				        "word": " if",
				      },
				      {
				        "end": 197.33,
				        "start": 197.26,
				        "word": " we",
				      },
				      {
				        "end": 197.51,
				        "start": 197.33,
				        "word": " take",
				      },
				      {
				        "end": 197.55,
				        "start": 197.51,
				        "word": " a",
				      },
				      {
				        "end": 197.81,
				        "start": 197.55,
				        "word": " closer",
				      },
				      {
				        "end": 198.02,
				        "start": 197.81,
				        "word": " look",
				      },
				      {
				        "end": 198.14,
				        "start": 198.02,
				        "word": " at",
				      },
				      {
				        "end": 198.22,
				        "start": 198.14,
				        "word": " the",
				      },
				      {
				        "end": 198.44,
				        "start": 198.22,
				        "word": " mark",
				      },
				      {
				        "end": 198.49,
				        "start": 198.44,
				        "word": "up",
				      },
				      {
				        "end": 198.64,
				        "start": 198.49,
				        "word": ",",
				      },
				      {
				        "end": 198.81,
				        "start": 198.64,
				        "word": " you",
				      },
				      {
				        "end": 198.96,
				        "start": 198.81,
				        "word": "'ll",
				      },
				      {
				        "end": 199.28,
				        "start": 198.96,
				        "word": " notice",
				      },
				      {
				        "end": 199.38,
				        "start": 199.28,
				        "word": " we",
				      },
				      {
				        "end": 199.54,
				        "start": 199.38,
				        "word": "'re",
				      },
				      {
				        "end": 199.81,
				        "start": 199.54,
				        "word": " using",
				      },
				      {
				        "end": 199.96,
				        "start": 199.81,
				        "word": " non",
				      },
				      {
				        "end": 200.02,
				        "start": 199.96,
				        "word": "-",
				      },
				      {
				        "end": 200.3,
				        "start": 200.02,
				        "word": "stand",
				      },
				      {
				        "end": 200.45,
				        "start": 200.3,
				        "word": "ard",
				      },
				      {
				        "end": 200.88,
				        "start": 200.45,
				        "word": " elements",
				      },
				      {
				        "end": 201.09,
				        "start": 200.88,
				        "word": " like",
				      },
				      {
				        "end": 201.14,
				        "start": 201.09,
				        "word": " V",
				      },
				      {
				        "end": 201.24,
				        "start": 201.14,
				        "word": "ue",
				      },
				      {
				        "end": 201.34,
				        "start": 201.24,
				        "word": ",",
				      },
				      {
				        "end": 201.57,
				        "start": 201.34,
				        "word": " Text",
				      },
				      {
				        "end": 201.65,
				        "start": 201.57,
				        "word": ",",
				      },
				      {
				        "end": 201.84,
				        "start": 201.65,
				        "word": " and",
				      },
				      {
				        "end": 202.08,
				        "start": 201.84,
				        "word": " Image",
				      },
				      {
				        "end": 202.34,
				        "start": 202.08,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 207.55,
				    "start": 202.34,
				    "text": "These look like HTML tags, but they actually correspond to native elements on different platforms,",
				    "words": [
				      {
				        "end": 202.65,
				        "start": 202.34,
				        "word": " These",
				      },
				      {
				        "end": 202.9,
				        "start": 202.65,
				        "word": " look",
				      },
				      {
				        "end": 203.15,
				        "start": 202.9,
				        "word": " like",
				      },
				      {
				        "end": 203.4,
				        "start": 203.15,
				        "word": " HTML",
				      },
				      {
				        "end": 203.68,
				        "start": 203.4,
				        "word": " tags",
				      },
				      {
				        "end": 203.77,
				        "start": 203.68,
				        "word": ",",
				      },
				      {
				        "end": 203.95,
				        "start": 203.77,
				        "word": " but",
				      },
				      {
				        "end": 204.2,
				        "start": 203.95,
				        "word": " they",
				      },
				      {
				        "end": 204.73,
				        "start": 204.2,
				        "word": " actually",
				      },
				      {
				        "end": 205.37,
				        "start": 204.73,
				        "word": " correspond",
				      },
				      {
				        "end": 205.44,
				        "start": 205.37,
				        "word": " to",
				      },
				      {
				        "end": 205.81,
				        "start": 205.44,
				        "word": " native",
				      },
				      {
				        "end": 206.31,
				        "start": 205.81,
				        "word": " elements",
				      },
				      {
				        "end": 206.43,
				        "start": 206.31,
				        "word": " on",
				      },
				      {
				        "end": 206.99,
				        "start": 206.43,
				        "word": " different",
				      },
				      {
				        "end": 207.55,
				        "start": 206.99,
				        "word": " platforms",
				      },
				    ],
				  },
				  {
				    "end": 210.81,
				    "start": 207.74,
				    "text": "like Vue is UIView in iOS, or VueGroup in Android,",
				    "words": [
				      {
				        "end": 208.09,
				        "start": 207.74,
				        "word": " like",
				      },
				      {
				        "end": 208.11,
				        "start": 208.09,
				        "word": " V",
				      },
				      {
				        "end": 208.26,
				        "start": 208.11,
				        "word": "ue",
				      },
				      {
				        "end": 208.42,
				        "start": 208.26,
				        "word": " is",
				      },
				      {
				        "end": 208.48,
				        "start": 208.42,
				        "word": " U",
				      },
				      {
				        "end": 208.63,
				        "start": 208.48,
				        "word": "IV",
				      },
				      {
				        "end": 208.84,
				        "start": 208.63,
				        "word": "iew",
				      },
				      {
				        "end": 209,
				        "start": 208.84,
				        "word": " in",
				      },
				      {
				        "end": 209.22,
				        "start": 209,
				        "word": " iOS",
				      },
				      {
				        "end": 209.37,
				        "start": 209.22,
				        "word": ",",
				      },
				      {
				        "end": 209.52,
				        "start": 209.37,
				        "word": " or",
				      },
				      {
				        "end": 209.59,
				        "start": 209.52,
				        "word": " V",
				      },
				      {
				        "end": 209.74,
				        "start": 209.59,
				        "word": "ue",
				      },
				      {
				        "end": 210.12,
				        "start": 209.74,
				        "word": "Group",
				      },
				      {
				        "end": 210.31,
				        "start": 210.12,
				        "word": " in",
				      },
				      {
				        "end": 210.81,
				        "start": 210.31,
				        "word": " Android",
				      },
				    ],
				  },
				  {
				    "end": 213.62,
				    "start": 210.95,
				    "text": "but would translate to a div on the web.",
				    "words": [
				      {
				        "end": 211.16,
				        "start": 210.95,
				        "word": " but",
				      },
				      {
				        "end": 211.55,
				        "start": 211.16,
				        "word": " would",
				      },
				      {
				        "end": 212.23,
				        "start": 211.55,
				        "word": " translate",
				      },
				      {
				        "end": 212.37,
				        "start": 212.23,
				        "word": " to",
				      },
				      {
				        "end": 212.45,
				        "start": 212.37,
				        "word": " a",
				      },
				      {
				        "end": 212.67,
				        "start": 212.45,
				        "word": " div",
				      },
				      {
				        "end": 212.82,
				        "start": 212.67,
				        "word": " on",
				      },
				      {
				        "end": 213.04,
				        "start": 212.82,
				        "word": " the",
				      },
				      {
				        "end": 213.26,
				        "start": 213.04,
				        "word": " web",
				      },
				      {
				        "end": 213.62,
				        "start": 213.26,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 218.9,
				    "start": 213.62,
				    "text": "And what's especially awesome here is that we can use regular CSS or even Tailwind to style these elements,",
				    "words": [
				      {
				        "end": 213.8,
				        "start": 213.62,
				        "word": " And",
				      },
				      {
				        "end": 214.06,
				        "start": 213.8,
				        "word": " what",
				      },
				      {
				        "end": 214.16,
				        "start": 214.06,
				        "word": "'s",
				      },
				      {
				        "end": 214.76,
				        "start": 214.16,
				        "word": " especially",
				      },
				      {
				        "end": 215.18,
				        "start": 214.76,
				        "word": " awesome",
				      },
				      {
				        "end": 215.42,
				        "start": 215.18,
				        "word": " here",
				      },
				      {
				        "end": 215.54,
				        "start": 215.42,
				        "word": " is",
				      },
				      {
				        "end": 215.78,
				        "start": 215.54,
				        "word": " that",
				      },
				      {
				        "end": 215.91,
				        "start": 215.78,
				        "word": " we",
				      },
				      {
				        "end": 216.08,
				        "start": 215.91,
				        "word": " can",
				      },
				      {
				        "end": 216.26,
				        "start": 216.08,
				        "word": " use",
				      },
				      {
				        "end": 216.68,
				        "start": 216.26,
				        "word": " regular",
				      },
				      {
				        "end": 216.86,
				        "start": 216.68,
				        "word": " CSS",
				      },
				      {
				        "end": 217,
				        "start": 216.86,
				        "word": " or",
				      },
				      {
				        "end": 217.22,
				        "start": 217,
				        "word": " even",
				      },
				      {
				        "end": 217.49,
				        "start": 217.22,
				        "word": " Tail",
				      },
				      {
				        "end": 217.7,
				        "start": 217.49,
				        "word": "wind",
				      },
				      {
				        "end": 217.82,
				        "start": 217.7,
				        "word": " to",
				      },
				      {
				        "end": 218.12,
				        "start": 217.82,
				        "word": " style",
				      },
				      {
				        "end": 218.42,
				        "start": 218.12,
				        "word": " these",
				      },
				      {
				        "end": 218.9,
				        "start": 218.42,
				        "word": " elements",
				      },
				    ],
				  },
				  {
				    "end": 221.18,
				    "start": 219.04,
				    "text": "which is something you can't really do in React Native,",
				    "words": [
				      {
				        "end": 219.28,
				        "start": 219.04,
				        "word": " which",
				      },
				      {
				        "end": 219.37,
				        "start": 219.28,
				        "word": " is",
				      },
				      {
				        "end": 219.81,
				        "start": 219.37,
				        "word": " something",
				      },
				      {
				        "end": 219.95,
				        "start": 219.81,
				        "word": " you",
				      },
				      {
				        "end": 220.17,
				        "start": 219.95,
				        "word": " can",
				      },
				      {
				        "end": 220.18,
				        "start": 220.17,
				        "word": "'t",
				      },
				      {
				        "end": 220.47,
				        "start": 220.18,
				        "word": " really",
				      },
				      {
				        "end": 220.56,
				        "start": 220.47,
				        "word": " do",
				      },
				      {
				        "end": 220.65,
				        "start": 220.56,
				        "word": " in",
				      },
				      {
				        "end": 220.89,
				        "start": 220.65,
				        "word": " React",
				      },
				      {
				        "end": 221.18,
				        "start": 220.89,
				        "word": " Native",
				      },
				    ],
				  },
				  {
				    "end": 223.42,
				    "start": 221.27,
				    "text": "although you could use tools like NativeWind.",
				    "words": [
				      {
				        "end": 221.66,
				        "start": 221.27,
				        "word": " although",
				      },
				      {
				        "end": 221.8,
				        "start": 221.66,
				        "word": " you",
				      },
				      {
				        "end": 222.04,
				        "start": 221.8,
				        "word": " could",
				      },
				      {
				        "end": 222.17,
				        "start": 222.04,
				        "word": " use",
				      },
				      {
				        "end": 222.42,
				        "start": 222.17,
				        "word": " tools",
				      },
				      {
				        "end": 222.61,
				        "start": 222.42,
				        "word": " like",
				      },
				      {
				        "end": 222.9,
				        "start": 222.61,
				        "word": " Native",
				      },
				      {
				        "end": 223.09,
				        "start": 222.9,
				        "word": "Wind",
				      },
				      {
				        "end": 223.42,
				        "start": 223.09,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 224.8,
				    "start": 223.42,
				    "text": "But now let's go ahead and run it.",
				    "words": [
				      {
				        "end": 223.56,
				        "start": 223.42,
				        "word": " But",
				      },
				      {
				        "end": 223.7,
				        "start": 223.56,
				        "word": " now",
				      },
				      {
				        "end": 223.84,
				        "start": 223.7,
				        "word": " let",
				      },
				      {
				        "end": 223.93,
				        "start": 223.84,
				        "word": "'s",
				      },
				      {
				        "end": 224.02,
				        "start": 223.93,
				        "word": " go",
				      },
				      {
				        "end": 224.25,
				        "start": 224.02,
				        "word": " ahead",
				      },
				      {
				        "end": 224.39,
				        "start": 224.25,
				        "word": " and",
				      },
				      {
				        "end": 224.53,
				        "start": 224.39,
				        "word": " run",
				      },
				      {
				        "end": 224.62,
				        "start": 224.53,
				        "word": " it",
				      },
				      {
				        "end": 224.8,
				        "start": 224.62,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 227.95,
				    "start": 224.99,
				    "text": "The easiest way to run it on mobile is to use the Lynx Explorer app,",
				    "words": [
				      {
				        "end": 225.13,
				        "start": 224.99,
				        "word": " The",
				      },
				      {
				        "end": 225.53,
				        "start": 225.13,
				        "word": " easiest",
				      },
				      {
				        "end": 225.7,
				        "start": 225.53,
				        "word": " way",
				      },
				      {
				        "end": 225.81,
				        "start": 225.7,
				        "word": " to",
				      },
				      {
				        "end": 225.98,
				        "start": 225.81,
				        "word": " run",
				      },
				      {
				        "end": 226.09,
				        "start": 225.98,
				        "word": " it",
				      },
				      {
				        "end": 226.2,
				        "start": 226.09,
				        "word": " on",
				      },
				      {
				        "end": 226.54,
				        "start": 226.2,
				        "word": " mobile",
				      },
				      {
				        "end": 226.65,
				        "start": 226.54,
				        "word": " is",
				      },
				      {
				        "end": 226.76,
				        "start": 226.65,
				        "word": " to",
				      },
				      {
				        "end": 226.95,
				        "start": 226.76,
				        "word": " use",
				      },
				      {
				        "end": 227.1,
				        "start": 226.95,
				        "word": " the",
				      },
				      {
				        "end": 227.29,
				        "start": 227.1,
				        "word": " Lyn",
				      },
				      {
				        "end": 227.32,
				        "start": 227.29,
				        "word": "x",
				      },
				      {
				        "end": 227.78,
				        "start": 227.32,
				        "word": " Explorer",
				      },
				      {
				        "end": 227.95,
				        "start": 227.78,
				        "word": " app",
				      },
				    ],
				  },
				  {
				    "end": 230.28,
				    "start": 228.16,
				    "text": "which allows you to live preview it on your phone.",
				    "words": [
				      {
				        "end": 228.42,
				        "start": 228.16,
				        "word": " which",
				      },
				      {
				        "end": 228.69,
				        "start": 228.42,
				        "word": " allows",
				      },
				      {
				        "end": 228.83,
				        "start": 228.69,
				        "word": " you",
				      },
				      {
				        "end": 228.92,
				        "start": 228.83,
				        "word": " to",
				      },
				      {
				        "end": 229.11,
				        "start": 228.92,
				        "word": " live",
				      },
				      {
				        "end": 229.45,
				        "start": 229.11,
				        "word": " preview",
				      },
				      {
				        "end": 229.54,
				        "start": 229.45,
				        "word": " it",
				      },
				      {
				        "end": 229.64,
				        "start": 229.54,
				        "word": " on",
				      },
				      {
				        "end": 229.82,
				        "start": 229.64,
				        "word": " your",
				      },
				      {
				        "end": 230.06,
				        "start": 229.82,
				        "word": " phone",
				      },
				      {
				        "end": 230.28,
				        "start": 230.06,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 233.4,
				    "start": 230.28,
				    "text": "But when I tried to compile it on Windows, I immediately got an error.",
				    "words": [
				      {
				        "end": 230.43,
				        "start": 230.28,
				        "word": " But",
				      },
				      {
				        "end": 230.63,
				        "start": 230.43,
				        "word": " when",
				      },
				      {
				        "end": 230.68,
				        "start": 230.63,
				        "word": " I",
				      },
				      {
				        "end": 230.93,
				        "start": 230.68,
				        "word": " tried",
				      },
				      {
				        "end": 231.03,
				        "start": 230.93,
				        "word": " to",
				      },
				      {
				        "end": 231.39,
				        "start": 231.03,
				        "word": " compile",
				      },
				      {
				        "end": 231.49,
				        "start": 231.39,
				        "word": " it",
				      },
				      {
				        "end": 231.59,
				        "start": 231.49,
				        "word": " on",
				      },
				      {
				        "end": 231.95,
				        "start": 231.59,
				        "word": " Windows",
				      },
				      {
				        "end": 232.05,
				        "start": 231.95,
				        "word": ",",
				      },
				      {
				        "end": 232.09,
				        "start": 232.05,
				        "word": " I",
				      },
				      {
				        "end": 232.67,
				        "start": 232.09,
				        "word": " immediately",
				      },
				      {
				        "end": 232.82,
				        "start": 232.67,
				        "word": " got",
				      },
				      {
				        "end": 232.92,
				        "start": 232.82,
				        "word": " an",
				      },
				      {
				        "end": 233.17,
				        "start": 232.92,
				        "word": " error",
				      },
				      {
				        "end": 233.4,
				        "start": 233.17,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 235.79,
				    "start": 233.4,
				    "text": "So I tried to switch to the Windows subsystem for Linux,",
				    "words": [
				      {
				        "end": 233.5,
				        "start": 233.4,
				        "word": " So",
				      },
				      {
				        "end": 233.61,
				        "start": 233.5,
				        "word": " I",
				      },
				      {
				        "end": 233.82,
				        "start": 233.61,
				        "word": " tried",
				      },
				      {
				        "end": 233.92,
				        "start": 233.82,
				        "word": " to",
				      },
				      {
				        "end": 234.24,
				        "start": 233.92,
				        "word": " switch",
				      },
				      {
				        "end": 234.32,
				        "start": 234.24,
				        "word": " to",
				      },
				      {
				        "end": 234.5,
				        "start": 234.32,
				        "word": " the",
				      },
				      {
				        "end": 234.88,
				        "start": 234.5,
				        "word": " Windows",
				      },
				      {
				        "end": 235.09,
				        "start": 234.88,
				        "word": " subs",
				      },
				      {
				        "end": 235.36,
				        "start": 235.09,
				        "word": "ystem",
				      },
				      {
				        "end": 235.52,
				        "start": 235.36,
				        "word": " for",
				      },
				      {
				        "end": 235.79,
				        "start": 235.52,
				        "word": " Linux",
				      },
				    ],
				  },
				  {
				    "end": 239.34,
				    "start": 235.96,
				    "text": "and while it compiled, I could never actually get it to run on the Explorer app.",
				    "words": [
				      {
				        "end": 236.12,
				        "start": 235.96,
				        "word": " and",
				      },
				      {
				        "end": 236.4,
				        "start": 236.12,
				        "word": " while",
				      },
				      {
				        "end": 236.51,
				        "start": 236.4,
				        "word": " it",
				      },
				      {
				        "end": 236.95,
				        "start": 236.51,
				        "word": " compiled",
				      },
				      {
				        "end": 237.08,
				        "start": 236.95,
				        "word": ",",
				      },
				      {
				        "end": 237.13,
				        "start": 237.08,
				        "word": " I",
				      },
				      {
				        "end": 237.45,
				        "start": 237.13,
				        "word": " could",
				      },
				      {
				        "end": 237.67,
				        "start": 237.45,
				        "word": " never",
				      },
				      {
				        "end": 238.1,
				        "start": 237.67,
				        "word": " actually",
				      },
				      {
				        "end": 238.26,
				        "start": 238.1,
				        "word": " get",
				      },
				      {
				        "end": 238.38,
				        "start": 238.26,
				        "word": " it",
				      },
				      {
				        "end": 238.48,
				        "start": 238.38,
				        "word": " to",
				      },
				      {
				        "end": 238.64,
				        "start": 238.48,
				        "word": " run",
				      },
				      {
				        "end": 238.75,
				        "start": 238.64,
				        "word": " on",
				      },
				      {
				        "end": 238.91,
				        "start": 238.75,
				        "word": " the",
				      },
				      {
				        "end": 239.34,
				        "start": 238.91,
				        "word": " Explorer",
				      },
				    ],
				  },
				  {
				    "end": 241.74,
				    "start": 239.72,
				    "text": "So finally, I had to dust off my old MacBook,",
				    "words": [
				      {
				        "end": 239.83,
				        "start": 239.72,
				        "word": " So",
				      },
				      {
				        "end": 240.23,
				        "start": 239.83,
				        "word": " finally",
				      },
				      {
				        "end": 240.34,
				        "start": 240.23,
				        "word": ",",
				      },
				      {
				        "end": 240.39,
				        "start": 240.34,
				        "word": " I",
				      },
				      {
				        "end": 240.56,
				        "start": 240.39,
				        "word": " had",
				      },
				      {
				        "end": 240.67,
				        "start": 240.56,
				        "word": " to",
				      },
				      {
				        "end": 240.89,
				        "start": 240.67,
				        "word": " dust",
				      },
				      {
				        "end": 241.07,
				        "start": 240.89,
				        "word": " off",
				      },
				      {
				        "end": 241.17,
				        "start": 241.07,
				        "word": " my",
				      },
				      {
				        "end": 241.34,
				        "start": 241.17,
				        "word": " old",
				      },
				      {
				        "end": 241.74,
				        "start": 241.34,
				        "word": " MacBook",
				      },
				    ],
				  },
				  {
				    "end": 244,
				    "start": 241.9,
				    "text": "and everything seemed to work a lot smoother on macOS.",
				    "words": [
				      {
				        "end": 242.15,
				        "start": 241.9,
				        "word": " and",
				      },
				      {
				        "end": 242.55,
				        "start": 242.15,
				        "word": " everything",
				      },
				      {
				        "end": 242.85,
				        "start": 242.55,
				        "word": " seemed",
				      },
				      {
				        "end": 242.95,
				        "start": 242.85,
				        "word": " to",
				      },
				      {
				        "end": 243.15,
				        "start": 242.95,
				        "word": " work",
				      },
				      {
				        "end": 243.2,
				        "start": 243.15,
				        "word": " a",
				      },
				      {
				        "end": 243.35,
				        "start": 243.2,
				        "word": " lot",
				      },
				      {
				        "end": 243.75,
				        "start": 243.35,
				        "word": " smoother",
				      },
				      {
				        "end": 243.85,
				        "start": 243.75,
				        "word": " on",
				      },
				      {
				        "end": 244,
				        "start": 243.85,
				        "word": " mac",
				      },
				    ],
				  },
				  {
				    "end": 247.08,
				    "start": 244.28,
				    "text": "And as you can see here, when I make changes to my code locally,",
				    "words": [
				      {
				        "end": 244.44,
				        "start": 244.28,
				        "word": " And",
				      },
				      {
				        "end": 244.57,
				        "start": 244.44,
				        "word": " as",
				      },
				      {
				        "end": 244.72,
				        "start": 244.57,
				        "word": " you",
				      },
				      {
				        "end": 244.87,
				        "start": 244.72,
				        "word": " can",
				      },
				      {
				        "end": 245.02,
				        "start": 244.87,
				        "word": " see",
				      },
				      {
				        "end": 245.25,
				        "start": 245.02,
				        "word": " here",
				      },
				      {
				        "end": 245.36,
				        "start": 245.25,
				        "word": ",",
				      },
				      {
				        "end": 245.58,
				        "start": 245.36,
				        "word": " when",
				      },
				      {
				        "end": 245.63,
				        "start": 245.58,
				        "word": " I",
				      },
				      {
				        "end": 245.85,
				        "start": 245.63,
				        "word": " make",
				      },
				      {
				        "end": 246.23,
				        "start": 245.85,
				        "word": " changes",
				      },
				      {
				        "end": 246.34,
				        "start": 246.23,
				        "word": " to",
				      },
				      {
				        "end": 246.45,
				        "start": 246.34,
				        "word": " my",
				      },
				      {
				        "end": 246.67,
				        "start": 246.45,
				        "word": " code",
				      },
				      {
				        "end": 247.08,
				        "start": 246.67,
				        "word": " locally",
				      },
				    ],
				  },
				  {
				    "end": 249.74,
				    "start": 247.22,
				    "text": "it'll automatically re-render the demo on my phone.",
				    "words": [
				      {
				        "end": 247.32,
				        "start": 247.22,
				        "word": " it",
				      },
				      {
				        "end": 247.48,
				        "start": 247.32,
				        "word": "'ll",
				      },
				      {
				        "end": 248.19,
				        "start": 247.48,
				        "word": " automatically",
				      },
				      {
				        "end": 248.29,
				        "start": 248.19,
				        "word": " re",
				      },
				      {
				        "end": 248.34,
				        "start": 248.29,
				        "word": "-",
				      },
				      {
				        "end": 248.66,
				        "start": 248.34,
				        "word": "render",
				      },
				      {
				        "end": 248.85,
				        "start": 248.66,
				        "word": " the",
				      },
				      {
				        "end": 249.03,
				        "start": 248.85,
				        "word": " demo",
				      },
				      {
				        "end": 249.13,
				        "start": 249.03,
				        "word": " on",
				      },
				      {
				        "end": 249.23,
				        "start": 249.13,
				        "word": " my",
				      },
				      {
				        "end": 249.52,
				        "start": 249.23,
				        "word": " phone",
				      },
				      {
				        "end": 249.74,
				        "start": 249.52,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 252.66,
				    "start": 249.74,
				    "text": "Impressive, very nice, I think Lynx has a lot of potential.",
				    "words": [
				      {
				        "end": 249.91,
				        "start": 249.74,
				        "word": " Imp",
				      },
				      {
				        "end": 250.28,
				        "start": 249.91,
				        "word": "ressive",
				      },
				      {
				        "end": 250.38,
				        "start": 250.28,
				        "word": ",",
				      },
				      {
				        "end": 250.6,
				        "start": 250.38,
				        "word": " very",
				      },
				      {
				        "end": 250.82,
				        "start": 250.6,
				        "word": " nice",
				      },
				      {
				        "end": 250.92,
				        "start": 250.82,
				        "word": ",",
				      },
				      {
				        "end": 250.97,
				        "start": 250.92,
				        "word": " I",
				      },
				      {
				        "end": 251.27,
				        "start": 250.97,
				        "word": " think",
				      },
				      {
				        "end": 251.4,
				        "start": 251.27,
				        "word": " Lyn",
				      },
				      {
				        "end": 251.45,
				        "start": 251.4,
				        "word": "x",
				      },
				      {
				        "end": 251.61,
				        "start": 251.45,
				        "word": " has",
				      },
				      {
				        "end": 251.66,
				        "start": 251.61,
				        "word": " a",
				      },
				      {
				        "end": 251.84,
				        "start": 251.66,
				        "word": " lot",
				      },
				      {
				        "end": 251.93,
				        "start": 251.84,
				        "word": " of",
				      },
				      {
				        "end": 252.42,
				        "start": 251.93,
				        "word": " potential",
				      },
				      {
				        "end": 252.66,
				        "start": 252.42,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 256.9,
				    "start": 252.66,
				    "text": "And that's bad news because it means I need to rewrite all my code with this shiny new object.",
				    "words": [
				      {
				        "end": 252.94,
				        "start": 252.66,
				        "word": " And",
				      },
				      {
				        "end": 253.03,
				        "start": 252.94,
				        "word": " that",
				      },
				      {
				        "end": 253.13,
				        "start": 253.03,
				        "word": "'s",
				      },
				      {
				        "end": 253.29,
				        "start": 253.13,
				        "word": " bad",
				      },
				      {
				        "end": 253.5,
				        "start": 253.29,
				        "word": " news",
				      },
				      {
				        "end": 253.88,
				        "start": 253.5,
				        "word": " because",
				      },
				      {
				        "end": 253.98,
				        "start": 253.88,
				        "word": " it",
				      },
				      {
				        "end": 254.25,
				        "start": 253.98,
				        "word": " means",
				      },
				      {
				        "end": 254.3,
				        "start": 254.25,
				        "word": " I",
				      },
				      {
				        "end": 254.51,
				        "start": 254.3,
				        "word": " need",
				      },
				      {
				        "end": 254.62,
				        "start": 254.51,
				        "word": " to",
				      },
				      {
				        "end": 254.99,
				        "start": 254.62,
				        "word": " rewrite",
				      },
				      {
				        "end": 255.15,
				        "start": 254.99,
				        "word": " all",
				      },
				      {
				        "end": 255.25,
				        "start": 255.15,
				        "word": " my",
				      },
				      {
				        "end": 255.46,
				        "start": 255.25,
				        "word": " code",
				      },
				      {
				        "end": 255.67,
				        "start": 255.46,
				        "word": " with",
				      },
				      {
				        "end": 255.88,
				        "start": 255.67,
				        "word": " this",
				      },
				      {
				        "end": 256.15,
				        "start": 255.88,
				        "word": " shiny",
				      },
				      {
				        "end": 256.31,
				        "start": 256.15,
				        "word": " new",
				      },
				      {
				        "end": 256.63,
				        "start": 256.31,
				        "word": " object",
				      },
				      {
				        "end": 256.9,
				        "start": 256.63,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 259.71,
				    "start": 256.9,
				    "text": "At least I can review all that code automatically thanks to CodeRabbit,",
				    "words": [
				      {
				        "end": 257,
				        "start": 256.9,
				        "word": " At",
				      },
				      {
				        "end": 257.26,
				        "start": 257,
				        "word": " least",
				      },
				      {
				        "end": 257.31,
				        "start": 257.26,
				        "word": " I",
				      },
				      {
				        "end": 257.47,
				        "start": 257.31,
				        "word": " can",
				      },
				      {
				        "end": 257.75,
				        "start": 257.47,
				        "word": " review",
				      },
				      {
				        "end": 257.9,
				        "start": 257.75,
				        "word": " all",
				      },
				      {
				        "end": 258.15,
				        "start": 257.9,
				        "word": " that",
				      },
				      {
				        "end": 258.3,
				        "start": 258.15,
				        "word": " code",
				      },
				      {
				        "end": 258.96,
				        "start": 258.3,
				        "word": " automatically",
				      },
				      {
				        "end": 259.25,
				        "start": 258.96,
				        "word": " thanks",
				      },
				      {
				        "end": 259.36,
				        "start": 259.25,
				        "word": " to",
				      },
				      {
				        "end": 259.56,
				        "start": 259.36,
				        "word": " Code",
				      },
				      {
				        "end": 259.61,
				        "start": 259.56,
				        "word": "R",
				      },
				      {
				        "end": 259.71,
				        "start": 259.61,
				        "word": "ab",
				      },
				    ],
				  },
				  {
				    "end": 261.58,
				    "start": 260.04,
				    "text": "the sponsor of today's video.",
				    "words": [
				      {
				        "end": 260.21,
				        "start": 260.04,
				        "word": " the",
				      },
				      {
				        "end": 260.6,
				        "start": 260.21,
				        "word": " sponsor",
				      },
				      {
				        "end": 260.71,
				        "start": 260.6,
				        "word": " of",
				      },
				      {
				        "end": 260.99,
				        "start": 260.71,
				        "word": " today",
				      },
				      {
				        "end": 261.1,
				        "start": 260.99,
				        "word": "'s",
				      },
				      {
				        "end": 261.38,
				        "start": 261.1,
				        "word": " video",
				      },
				      {
				        "end": 261.58,
				        "start": 261.38,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 266.28,
				    "start": 261.58,
				    "text": "An AI co-pilot for code reviews that gives you instant feedback on every pull request.",
				    "words": [
				      {
				        "end": 261.7,
				        "start": 261.58,
				        "word": " An",
				      },
				      {
				        "end": 261.82,
				        "start": 261.7,
				        "word": " AI",
				      },
				      {
				        "end": 261.94,
				        "start": 261.82,
				        "word": " co",
				      },
				      {
				        "end": 262,
				        "start": 261.94,
				        "word": "-",
				      },
				      {
				        "end": 262.06,
				        "start": 262,
				        "word": "p",
				      },
				      {
				        "end": 262.31,
				        "start": 262.06,
				        "word": "ilot",
				      },
				      {
				        "end": 262.5,
				        "start": 262.31,
				        "word": " for",
				      },
				      {
				        "end": 262.85,
				        "start": 262.5,
				        "word": " code",
				      },
				      {
				        "end": 263.19,
				        "start": 262.85,
				        "word": " reviews",
				      },
				      {
				        "end": 263.44,
				        "start": 263.19,
				        "word": " that",
				      },
				      {
				        "end": 263.75,
				        "start": 263.44,
				        "word": " gives",
				      },
				      {
				        "end": 263.94,
				        "start": 263.75,
				        "word": " you",
				      },
				      {
				        "end": 264.38,
				        "start": 263.94,
				        "word": " instant",
				      },
				      {
				        "end": 264.88,
				        "start": 264.38,
				        "word": " feedback",
				      },
				      {
				        "end": 265,
				        "start": 264.88,
				        "word": " on",
				      },
				      {
				        "end": 265.34,
				        "start": 265,
				        "word": " every",
				      },
				      {
				        "end": 265.56,
				        "start": 265.34,
				        "word": " pull",
				      },
				      {
				        "end": 266,
				        "start": 265.56,
				        "word": " request",
				      },
				      {
				        "end": 266.28,
				        "start": 266,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 269.12,
				    "start": 266.28,
				    "text": "Unlike basic linters, it understands your entire code base,",
				    "words": [
				      {
				        "end": 266.62,
				        "start": 266.28,
				        "word": " Unlike",
				      },
				      {
				        "end": 266.9,
				        "start": 266.62,
				        "word": " basic",
				      },
				      {
				        "end": 267.07,
				        "start": 266.9,
				        "word": " lin",
				      },
				      {
				        "end": 267.29,
				        "start": 267.07,
				        "word": "ters",
				      },
				      {
				        "end": 267.4,
				        "start": 267.29,
				        "word": ",",
				      },
				      {
				        "end": 267.51,
				        "start": 267.4,
				        "word": " it",
				      },
				      {
				        "end": 268.13,
				        "start": 267.51,
				        "word": " understands",
				      },
				      {
				        "end": 268.35,
				        "start": 268.13,
				        "word": " your",
				      },
				      {
				        "end": 268.69,
				        "start": 268.35,
				        "word": " entire",
				      },
				      {
				        "end": 268.91,
				        "start": 268.69,
				        "word": " code",
				      },
				      {
				        "end": 269.12,
				        "start": 268.91,
				        "word": " base",
				      },
				    ],
				  },
				  {
				    "end": 273.58,
				    "start": 269.3,
				    "text": "so it can catch more subtle issues like bad code style or missing test coverage.",
				    "words": [
				      {
				        "end": 269.49,
				        "start": 269.3,
				        "word": " so",
				      },
				      {
				        "end": 269.54,
				        "start": 269.49,
				        "word": " it",
				      },
				      {
				        "end": 269.72,
				        "start": 269.54,
				        "word": " can",
				      },
				      {
				        "end": 270.03,
				        "start": 269.72,
				        "word": " catch",
				      },
				      {
				        "end": 270.28,
				        "start": 270.03,
				        "word": " more",
				      },
				      {
				        "end": 270.65,
				        "start": 270.28,
				        "word": " subtle",
				      },
				      {
				        "end": 271.02,
				        "start": 270.65,
				        "word": " issues",
				      },
				      {
				        "end": 271.27,
				        "start": 271.02,
				        "word": " like",
				      },
				      {
				        "end": 271.48,
				        "start": 271.27,
				        "word": " bad",
				      },
				      {
				        "end": 271.74,
				        "start": 271.48,
				        "word": " code",
				      },
				      {
				        "end": 272.04,
				        "start": 271.74,
				        "word": " style",
				      },
				      {
				        "end": 272.13,
				        "start": 272.04,
				        "word": " or",
				      },
				      {
				        "end": 272.57,
				        "start": 272.13,
				        "word": " missing",
				      },
				      {
				        "end": 272.82,
				        "start": 272.57,
				        "word": " test",
				      },
				      {
				        "end": 273.32,
				        "start": 272.82,
				        "word": " coverage",
				      },
				      {
				        "end": 273.58,
				        "start": 273.32,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 277.6,
				    "start": 273.58,
				    "text": "Then it will suggest simple one-click fixes to help you get things cleaned up quickly.",
				    "words": [
				      {
				        "end": 273.79,
				        "start": 273.58,
				        "word": " Then",
				      },
				      {
				        "end": 273.89,
				        "start": 273.79,
				        "word": " it",
				      },
				      {
				        "end": 274.09,
				        "start": 273.89,
				        "word": " will",
				      },
				      {
				        "end": 274.48,
				        "start": 274.09,
				        "word": " suggest",
				      },
				      {
				        "end": 274.8,
				        "start": 274.48,
				        "word": " simple",
				      },
				      {
				        "end": 274.96,
				        "start": 274.8,
				        "word": " one",
				      },
				      {
				        "end": 275.01,
				        "start": 274.96,
				        "word": "-",
				      },
				      {
				        "end": 275.3,
				        "start": 275.01,
				        "word": "click",
				      },
				      {
				        "end": 275.57,
				        "start": 275.3,
				        "word": " fixes",
				      },
				      {
				        "end": 275.71,
				        "start": 275.57,
				        "word": " to",
				      },
				      {
				        "end": 275.86,
				        "start": 275.71,
				        "word": " help",
				      },
				      {
				        "end": 276.02,
				        "start": 275.86,
				        "word": " you",
				      },
				      {
				        "end": 276.18,
				        "start": 276.02,
				        "word": " get",
				      },
				      {
				        "end": 276.5,
				        "start": 276.18,
				        "word": " things",
				      },
				      {
				        "end": 276.88,
				        "start": 276.5,
				        "word": " cleaned",
				      },
				      {
				        "end": 276.98,
				        "start": 276.88,
				        "word": " up",
				      },
				      {
				        "end": 277.36,
				        "start": 276.98,
				        "word": " quickly",
				      },
				      {
				        "end": 277.6,
				        "start": 277.36,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 279.96,
				    "start": 277.87,
				    "text": "CodeRabbit keeps learning from your PRs over time,",
				    "words": [
				      {
				        "end": 278.04,
				        "start": 277.87,
				        "word": " Code",
				      },
				      {
				        "end": 278.09,
				        "start": 278.04,
				        "word": "R",
				      },
				      {
				        "end": 278.19,
				        "start": 278.09,
				        "word": "ab",
				      },
				      {
				        "end": 278.34,
				        "start": 278.19,
				        "word": "bit",
				      },
				      {
				        "end": 278.6,
				        "start": 278.34,
				        "word": " keeps",
				      },
				      {
				        "end": 279.01,
				        "start": 278.6,
				        "word": " learning",
				      },
				      {
				        "end": 279.23,
				        "start": 279.01,
				        "word": " from",
				      },
				      {
				        "end": 279.41,
				        "start": 279.23,
				        "word": " your",
				      },
				      {
				        "end": 279.52,
				        "start": 279.41,
				        "word": " PR",
				      },
				      {
				        "end": 279.56,
				        "start": 279.52,
				        "word": "s",
				      },
				      {
				        "end": 279.77,
				        "start": 279.56,
				        "word": " over",
				      },
				      {
				        "end": 279.96,
				        "start": 279.77,
				        "word": " time",
				      },
				    ],
				  },
				  {
				    "end": 282.42,
				    "start": 280.14,
				    "text": "so the more you use it, the smarter it gets.",
				    "words": [
				      {
				        "end": 280.26,
				        "start": 280.14,
				        "word": " so",
				      },
				      {
				        "end": 280.44,
				        "start": 280.26,
				        "word": " the",
				      },
				      {
				        "end": 280.69,
				        "start": 280.44,
				        "word": " more",
				      },
				      {
				        "end": 280.87,
				        "start": 280.69,
				        "word": " you",
				      },
				      {
				        "end": 281.05,
				        "start": 280.87,
				        "word": " use",
				      },
				      {
				        "end": 281.17,
				        "start": 281.05,
				        "word": " it",
				      },
				      {
				        "end": 281.4,
				        "start": 281.17,
				        "word": ",",
				      },
				      {
				        "end": 281.51,
				        "start": 281.4,
				        "word": " the",
				      },
				      {
				        "end": 281.9,
				        "start": 281.51,
				        "word": " smarter",
				      },
				      {
				        "end": 282.01,
				        "start": 281.9,
				        "word": " it",
				      },
				      {
				        "end": 282.23,
				        "start": 282.01,
				        "word": " gets",
				      },
				      {
				        "end": 282.42,
				        "start": 282.23,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 284.87,
				    "start": 282.42,
				    "text": "It's 100% free for open source projects,",
				    "words": [
				      {
				        "end": 282.59,
				        "start": 282.42,
				        "word": " It",
				      },
				      {
				        "end": 282.66,
				        "start": 282.59,
				        "word": "'s",
				      },
				      {
				        "end": 283.23,
				        "start": 282.66,
				        "word": " 100",
				      },
				      {
				        "end": 283.29,
				        "start": 283.23,
				        "word": "%",
				      },
				      {
				        "end": 283.57,
				        "start": 283.29,
				        "word": " free",
				      },
				      {
				        "end": 283.73,
				        "start": 283.57,
				        "word": " for",
				      },
				      {
				        "end": 283.98,
				        "start": 283.73,
				        "word": " open",
				      },
				      {
				        "end": 284.36,
				        "start": 283.98,
				        "word": " source",
				      },
				      {
				        "end": 284.87,
				        "start": 284.36,
				        "word": " projects",
				      },
				    ],
				  },
				  {
				    "end": 289.2,
				    "start": 285.06,
				    "text": "but you can get one month free for your team using the code Fireship with the link below.",
				    "words": [
				      {
				        "end": 285.22,
				        "start": 285.06,
				        "word": " but",
				      },
				      {
				        "end": 285.4,
				        "start": 285.22,
				        "word": " you",
				      },
				      {
				        "end": 285.58,
				        "start": 285.4,
				        "word": " can",
				      },
				      {
				        "end": 285.76,
				        "start": 285.58,
				        "word": " get",
				      },
				      {
				        "end": 285.94,
				        "start": 285.76,
				        "word": " one",
				      },
				      {
				        "end": 286.25,
				        "start": 285.94,
				        "word": " month",
				      },
				      {
				        "end": 286.48,
				        "start": 286.25,
				        "word": " free",
				      },
				      {
				        "end": 286.66,
				        "start": 286.48,
				        "word": " for",
				      },
				      {
				        "end": 286.94,
				        "start": 286.66,
				        "word": " your",
				      },
				      {
				        "end": 287.18,
				        "start": 286.94,
				        "word": " team",
				      },
				      {
				        "end": 287.43,
				        "start": 287.18,
				        "word": " using",
				      },
				      {
				        "end": 287.58,
				        "start": 287.43,
				        "word": " the",
				      },
				      {
				        "end": 287.78,
				        "start": 287.58,
				        "word": " code",
				      },
				      {
				        "end": 287.92,
				        "start": 287.78,
				        "word": " F",
				      },
				      {
				        "end": 288.03,
				        "start": 287.92,
				        "word": "ires",
				      },
				      {
				        "end": 288.2,
				        "start": 288.03,
				        "word": "hip",
				      },
				      {
				        "end": 288.44,
				        "start": 288.2,
				        "word": " with",
				      },
				      {
				        "end": 288.59,
				        "start": 288.44,
				        "word": " the",
				      },
				      {
				        "end": 288.73,
				        "start": 288.59,
				        "word": " link",
				      },
				      {
				        "end": 288.98,
				        "start": 288.73,
				        "word": " below",
				      },
				      {
				        "end": 289.2,
				        "start": 288.98,
				        "word": ".",
				      },
				    ],
				  },
				  {
				    "end": 291.25,
				    "start": 289.2,
				    "text": "This has been The Code Report, thanks for watching,",
				    "words": [
				      {
				        "end": 289.4,
				        "start": 289.2,
				        "word": " This",
				      },
				      {
				        "end": 289.53,
				        "start": 289.4,
				        "word": " has",
				      },
				      {
				        "end": 289.72,
				        "start": 289.53,
				        "word": " been",
				      },
				      {
				        "end": 289.86,
				        "start": 289.72,
				        "word": " The",
				      },
				      {
				        "end": 290.05,
				        "start": 289.86,
				        "word": " Code",
				      },
				      {
				        "end": 290.34,
				        "start": 290.05,
				        "word": " Report",
				      },
				      {
				        "end": 290.43,
				        "start": 290.34,
				        "word": ",",
				      },
				      {
				        "end": 290.72,
				        "start": 290.43,
				        "word": " thanks",
				      },
				      {
				        "end": 290.86,
				        "start": 290.72,
				        "word": " for",
				      },
				      {
				        "end": 291.25,
				        "start": 290.86,
				        "word": " watching",
				      },
				    ],
				  },
				  {
				    "end": 292.8,
				    "start": 291.33,
				    "text": "and I will see you in the next one.",
				    "words": [
				      {
				        "end": 291.47,
				        "start": 291.33,
				        "word": " and",
				      },
				      {
				        "end": 291.51,
				        "start": 291.47,
				        "word": " I",
				      },
				      {
				        "end": 291.7,
				        "start": 291.51,
				        "word": " will",
				      },
				      {
				        "end": 291.84,
				        "start": 291.7,
				        "word": " see",
				      },
				      {
				        "end": 291.98,
				        "start": 291.84,
				        "word": " you",
				      },
				      {
				        "end": 292.07,
				        "start": 291.98,
				        "word": " in",
				      },
				      {
				        "end": 292.21,
				        "start": 292.07,
				        "word": " the",
				      },
				      {
				        "end": 292.4,
				        "start": 292.21,
				        "word": " next",
				      },
				      {
				        "end": 292.54,
				        "start": 292.4,
				        "word": " one",
				      },
				      {
				        "end": 292.8,
				        "start": 292.54,
				        "word": ".",
				      },
				    ],
				  },
				]
			`)
		})
	},
	{ timeout: 50000 },
)
