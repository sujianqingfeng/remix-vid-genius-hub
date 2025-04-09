import fsp from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { alignWordsAndSentences } from '../align'

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

const sentences = [
	"China's embassy in Washington released a statement.",
	'It urges the White House to, quote, immediately correct its wrongdoings, end quote,',
	"warning that China's response if American tariffs stay in place will, quote, continue to the end.",
	'Perspective now from former U.N. Ambassador John Bolton,',
	'who served as national security advisor in the first Trump administration,',
	'and Richard Quest, CNN business editor at large and anchor of Quest means business.',
	"So, Ambassador Bolton, I know you're not an economist,",
	'but just from a strategic perspective, do you think China is going to blink',
	'and try to cut a deal with the White House?',
	"It certainly doesn't look like it, but what Trump is doing is a huge opportunity for China worldwide.",
	'These tariffs are a form of economic illiteracy.',
	"Trump has no idea, really, what he's talking about.",
	"He doesn't understand how tariffs works.",
	'He has said as recently as a few days ago he views trade surpluses and deficits',
	'as like a profit and loss statement, which they certainly are not.',
	"So what he's doing has put us in a very vulnerable position,",
	'and probably in the worst position possible to go after the real country problem',
	'in the international trading system, which is China.',
	"Instead of taking on the country that's stolen our intellectual property for decades,",
	'among other things, by gathering our allies together,',
	"all of whom also suffer from China's intellectual property theft,",
	"and engaging in concerted action, we're at war with our largest trading partners",
	"while we're about to go to war with China as well.",
	"It simply makes no sense, and it's just sad and depressing",
	"that more Republicans haven't stood up and said that.",
	'This is illiteracy.',
	'Richard, what does it look like for Americans if the price of everything imported from China',
	'effectively doubles overnight?',
	'How much of that gets passed on to consumers?',
	'Well, the ambassador calls it economic illiteracy.',
	"I've called it economic vandalism because if you have 104% tariffs,",
	'what the effect of things is going to happen is two things.',
	"Number one, things simply won't be imported.",
	"It's too expensive. It's become unprofitable, uneconomic.",
	'Things simply will not be imported.',
	"Think about Christmas toys that just won't arrive.",
	'But there are many things now that, as the Chinese have reminded the United States',
	'in a commentary a couple of days ago, there are many things that the U.S. only gets from China.',
	'Certain electronics, certain parts of manufacture, they can only now be received from China,',
	"and the U.S. is going to find that they're going to be left without.",
	"They're going to be trying to source it elsewhere.",
	"And one point to remember, Anderson, tonight, oh yes, you've got the 104% against China,",
	"but you've got the 24% against Japan.",
	"And of course, there's the 25% autos.",
	"You've got the 15% against South Korea, and you've got the 20% against the European Union.",
	'So wherever you look at midnight tonight, the global trading network',
	"is about to come under the most ferocious strain that it's seen,",
	'certainly since the Second World War.',
	'Ambassador Bolton, I mean, the first Trump administration,',
	'you know, some talked about a so-called madman theory',
	"that when it comes to national security, the idea that adversaries won't challenge the president",
	"if they think he's unpredictable.",
	'Does it make any sense to apply that same philosophy to allied trading partnerships?',
	'No, look, the madman theory has a rationale behind it.',
	'When Richard Nixon recommended it to Henry Kissinger dealing with China,',
	'because Richard Nixon was well-known as an anti-communist,',
	'he had made his political reputation on that.',
	'So when he told Kissinger to basically say Nixon might use nuclear weapons',
	'in the particular context they were talking about, use them against China,',
	'it made sense because Nixon believed he was a hard-line anti-communist.',
	"Trump doesn't believe in anything.",
	"He's simply transactional, anecdotal, episodic,",
	"and that's what these tariff policies have looked like in their rollout.",
	'Richard, the New York Times described the market decline',
	'as on par with the early days of the COVID-19 pandemic.',
	'Does that signal that investors view this policy decision by the president',
	'as equally volatile, as a deadly new disease with no known treatment or cure sweeping across the globe?',
	"I think there's a similarity because in both cases, we didn't know how it was going to turn out.",
	'The only difference being that in one particular case in COVID,',
	'there was this massive effort towards sorting it out',
	'and we had a vision of where he wanted to go.',
	'And everybody seemed to be moving in the same direction',
	"in this particular case because we don't know what the end game looks like.",
	"We don't know.",
	"You see, even if, just for argument's sake, let's say the tariffs all come down to zero.",
	'Just humor me. They all come down to zero.',
	"You've now got, you've still got the non-tariff barriers",
	'which would prevent the U.S. from getting into new export markets.',
	"And you've got the offensive behavior that the U.S. has put on its allies.",
	'You know, Elizabeth Warren was talking about it a second ago',
	"and the ambassador knows you can't just have a trade policy in isolation.",
	"not when you've told Canada you regard them as the 51st state",
	"and you've offended the EU talking about Denmark and Greenland.",
	"Eventually, all these strands come together so that you don't have allies.",
	'You have people wanting to do a deal.',
	"That's pure, unadulterated self-interest.",
	"But what you don't have is the commonality of view and value",
	'that will get you over the line.',
	'Ambassador, I mean, long-term, is it breaking of, you know, relationships',
	'that have taken decades to form internationally?',
	'Is there, I mean, is there a long-term cost on this, whatever the short-term impact is?',
	"I think we've incurred a lot of the cost already,",
	"not just because of Trump's tariff policy, but what he's done on Ukraine,",
	"what he's done to NATO, what he threatens to do to NATO.",
	'I can see all over the world, from Europe to the Far East,',
	'that decades of effort by many, many Americans, in government and out of government,',
	'to build up relationships of trust, of good faith, of reliance, of dependability,',
	'that the United States deserves to be the leader of the world',
	'to protect its own interests, not because of economic relations,',
	'but because people trust us.',
	"They don't trust us anymore, and it's going to be very hard to rebuild.",
	'This is the wide open gap that we have left for the Chinese to drive through,',
	"and I think they're moving along.",
	"Trump simply doesn't grasp any of that.",
	"He doesn't understand alliances as long-term propositions.",
	'He just sees them as one transaction after the other,',
	"and that's not the way they work.",
	'Starting off tonight, Senator Elizabeth Warren, Democrat of Massachusetts,',
	'who sits in the finance community and is the ranking member on the banking committee.',
	'So with these tariffs about to go into effect in China overnight, around midnight,',
	'how much more economic pain are we all facing?',
	"Well, we're facing a lot of pain,",
	'and understand, we look at the Dow Jones and the S&P because those are easy numbers to track,',
	'but the reality is this is already being felt by families,',
	'partly because prices are going up.',
	'We already see the soft data showing us that there are a lot of companies out there saying,',
	"you know what, we can tell what's coming, we're just going to raise our prices now,",
	'and then if we need to raise them more later, we will do that.',
	'The head of the Fed said on Friday that this kind of across-the-board tariffs',
	'means prices will go up for families.',
	"We'll see more inflation.",
	'But he also pointed out unemployment is likely to go up as well.',
	'So there are going to be people who lose their jobs.',
	'We talk about this recession, Goldman Sachs, J.P. Morgan.',
	"Do you think it's likely?",
	'Oh, I think that all of the signs, the economic signs, are flashing red.',
	'And remember, we lost 700,000 jobs a month in the last recession.',
	'Recessions are not just things that happen on Wall Street.',
	'They are things that happen family by family by family.',
	'And there are people who never recover from that.',
	'Do you also see long-term damage done to just the credibility, the confidence, the stability',
	'of the United States?',
	'Boy, you have put your finger on it.',
	'Yes. Donald Trump is demonstrating that so long as he is president,',
	'the United States is not a reliable trading partner,',
	'but also not a reliable ally.',
	'And domestically, think about what it means with these tariffs that are changing by the day.',
	"People are saying they're on, they're off.",
	"They're on, they're off, they're off, they're on, right?",
	'Who makes investments here?',
	"Who wants to say, I'm going to build a factory that will take me 20 years to recover my costs",
	"without having some general sense of what it's going to be like",
	'and the ability to sell your goods overseas.',
	'You cannot plan. You cannot plan.',
	'And in fact, what often happens is people start laying off hoarding their cash',
	'under these circumstances.',
	'That is the reason that it is now time for Congress to act.',
	'we have the power in the Senate and the House to roll back the authority',
	'that Donald Trump is using.',
	"It's a simple resolution.",
	'It will go to the floor.',
	'Senator Ron Wyden and I have introduced it or will be introducing it the next day in the Senate.',
	'You need how many Republicans?',
	'Well, we only need a simple majority to get it passed.',
	'We may need more than that if the president ultimately vetoes it.',
	'But you know, this is the moment for Republicans.',
	"This is the place where it's right in front of them.",
	'Either they can continue to bend a knee to Donald Trump',
	'or they can stand up for the people back home who are getting hurt by Donald Trump.',
]

describe('align', () => {
	test('alignWordsAndSentences', async () => {
		const { words } = await getWords()

		const result = alignWordsAndSentences(words, sentences)

		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "end": 1.82,
			    "start": 0.02,
			    "text": "China's embassy in Washington released a statement.",
			    "words": [
			      {
			        "end": 0.2,
			        "start": 0.02,
			        "word": " China",
			      },
			      {
			        "end": 0.29,
			        "start": 0.2,
			        "word": "'s",
			      },
			      {
			        "end": 0.54,
			        "start": 0.29,
			        "word": " embassy",
			      },
			      {
			        "end": 0.62,
			        "start": 0.54,
			        "word": " in",
			      },
			      {
			        "end": 1.04,
			        "start": 0.62,
			        "word": " Washington",
			      },
			      {
			        "end": 1.38,
			        "start": 1.04,
			        "word": " released",
			      },
			      {
			        "end": 1.43,
			        "start": 1.38,
			        "word": " a",
			      },
			      {
			        "end": 1.82,
			        "start": 1.43,
			        "word": " statement",
			      },
			    ],
			  },
			  {
			    "end": 6.04,
			    "start": 1.84,
			    "text": "It urges the White House to, quote, immediately correct its wrongdoings, end quote,",
			    "words": [
			      {
			        "end": 1.95,
			        "start": 1.84,
			        "word": " It",
			      },
			      {
			        "end": 1.96,
			        "start": 1.95,
			        "word": " ur",
			      },
			      {
			        "end": 2.35,
			        "start": 1.96,
			        "word": "ges",
			      },
			      {
			        "end": 2.4,
			        "start": 2.35,
			        "word": " the",
			      },
			      {
			        "end": 2.69,
			        "start": 2.4,
			        "word": " White",
			      },
			      {
			        "end": 2.97,
			        "start": 2.69,
			        "word": " House",
			      },
			      {
			        "end": 3.09,
			        "start": 2.97,
			        "word": " to",
			      },
			      {
			        "end": 3.2,
			        "start": 3.09,
			        "word": ",",
			      },
			      {
			        "end": 3.51,
			        "start": 3.2,
			        "word": " quote",
			      },
			      {
			        "end": 3.64,
			        "start": 3.51,
			        "word": ",",
			      },
			      {
			        "end": 4.27,
			        "start": 3.64,
			        "word": " immediately",
			      },
			      {
			        "end": 4.72,
			        "start": 4.27,
			        "word": " correct",
			      },
			      {
			        "end": 4.84,
			        "start": 4.72,
			        "word": " its",
			      },
			      {
			        "end": 5.13,
			        "start": 4.84,
			        "word": " wrong",
			      },
			      {
			        "end": 5.24,
			        "start": 5.13,
			        "word": "do",
			      },
			      {
			        "end": 5.46,
			        "start": 5.24,
			        "word": "ings",
			      },
			      {
			        "end": 5.58,
			        "start": 5.46,
			        "word": ",",
			      },
			      {
			        "end": 5.76,
			        "start": 5.58,
			        "word": " end",
			      },
			      {
			        "end": 6.04,
			        "start": 5.76,
			        "word": " quote",
			      },
			    ],
			  },
			  {
			    "end": 10.92,
			    "start": 6.2,
			    "text": "warning that China's response if American tariffs stay in place will, quote, continue to the end.",
			    "words": [
			      {
			        "end": 6.57,
			        "start": 6.2,
			        "word": " warning",
			      },
			      {
			        "end": 6.8,
			        "start": 6.57,
			        "word": " that",
			      },
			      {
			        "end": 7.04,
			        "start": 6.8,
			        "word": " China",
			      },
			      {
			        "end": 7.14,
			        "start": 7.04,
			        "word": "'s",
			      },
			      {
			        "end": 7.6,
			        "start": 7.14,
			        "word": " response",
			      },
			      {
			        "end": 7.69,
			        "start": 7.6,
			        "word": " if",
			      },
			      {
			        "end": 8.1,
			        "start": 7.69,
			        "word": " American",
			      },
			      {
			        "end": 8.49,
			        "start": 8.1,
			        "word": " tariffs",
			      },
			      {
			        "end": 8.68,
			        "start": 8.49,
			        "word": " stay",
			      },
			      {
			        "end": 8.85,
			        "start": 8.68,
			        "word": " in",
			      },
			      {
			        "end": 9.08,
			        "start": 8.85,
			        "word": " place",
			      },
			      {
			        "end": 9.34,
			        "start": 9.08,
			        "word": " will",
			      },
			      {
			        "end": 9.54,
			        "start": 9.34,
			        "word": ",",
			      },
			      {
			        "end": 9.78,
			        "start": 9.54,
			        "word": " quote",
			      },
			      {
			        "end": 9.9,
			        "start": 9.78,
			        "word": ",",
			      },
			      {
			        "end": 10.41,
			        "start": 9.9,
			        "word": " continue",
			      },
			      {
			        "end": 10.55,
			        "start": 10.41,
			        "word": " to",
			      },
			      {
			        "end": 10.73,
			        "start": 10.55,
			        "word": " the",
			      },
			      {
			        "end": 10.92,
			        "start": 10.73,
			        "word": " end",
			      },
			    ],
			  },
			  {
			    "end": 13.86,
			    "start": 11.16,
			    "text": "Perspective now from former U.N. Ambassador John Bolton,",
			    "words": [
			      {
			        "end": 11.36,
			        "start": 11.16,
			        "word": " Pers",
			      },
			      {
			        "end": 11.64,
			        "start": 11.36,
			        "word": "pect",
			      },
			      {
			        "end": 11.71,
			        "start": 11.64,
			        "word": "ive",
			      },
			      {
			        "end": 11.86,
			        "start": 11.71,
			        "word": " now",
			      },
			      {
			        "end": 12.06,
			        "start": 11.86,
			        "word": " from",
			      },
			      {
			        "end": 12.37,
			        "start": 12.06,
			        "word": " former",
			      },
			      {
			        "end": 12.52,
			        "start": 12.37,
			        "word": " U",
			      },
			      {
			        "end": 12.57,
			        "start": 12.52,
			        "word": ".",
			      },
			      {
			        "end": 12.62,
			        "start": 12.57,
			        "word": "N",
			      },
			      {
			        "end": 12.77,
			        "start": 12.62,
			        "word": ".",
			      },
			      {
			        "end": 13.28,
			        "start": 12.77,
			        "word": " Ambassador",
			      },
			      {
			        "end": 13.48,
			        "start": 13.28,
			        "word": " John",
			      },
			      {
			        "end": 13.63,
			        "start": 13.48,
			        "word": " Bol",
			      },
			      {
			        "end": 13.86,
			        "start": 13.63,
			        "word": "ton",
			      },
			    ],
			  },
			  {
			    "end": 16.45,
			    "start": 13.86,
			    "text": "who served as national security advisor in the first Trump administration,",
			    "words": [
			      {
			        "end": 13.98,
			        "start": 13.86,
			        "word": " who",
			      },
			      {
			        "end": 14.23,
			        "start": 13.98,
			        "word": " served",
			      },
			      {
			        "end": 14.31,
			        "start": 14.23,
			        "word": " as",
			      },
			      {
			        "end": 14.64,
			        "start": 14.31,
			        "word": " national",
			      },
			      {
			        "end": 14.97,
			        "start": 14.64,
			        "word": " security",
			      },
			      {
			        "end": 15.28,
			        "start": 14.97,
			        "word": " advisor",
			      },
			      {
			        "end": 15.36,
			        "start": 15.28,
			        "word": " in",
			      },
			      {
			        "end": 15.48,
			        "start": 15.36,
			        "word": " the",
			      },
			      {
			        "end": 15.68,
			        "start": 15.48,
			        "word": " first",
			      },
			      {
			        "end": 15.88,
			        "start": 15.68,
			        "word": " Trump",
			      },
			      {
			        "end": 16.45,
			        "start": 15.88,
			        "word": " administration",
			      },
			    ],
			  },
			  {
			    "end": 20.53,
			    "start": 16.56,
			    "text": "and Richard Quest, CNN business editor at large and anchor of Quest means business.",
			    "words": [
			      {
			        "end": 16.74,
			        "start": 16.56,
			        "word": " and",
			      },
			      {
			        "end": 17.16,
			        "start": 16.74,
			        "word": " Richard",
			      },
			      {
			        "end": 17.24,
			        "start": 17.16,
			        "word": " Quest",
			      },
			      {
			        "end": 17.7,
			        "start": 17.24,
			        "word": ",",
			      },
			      {
			        "end": 17.76,
			        "start": 17.7,
			        "word": " CNN",
			      },
			      {
			        "end": 18.24,
			        "start": 17.76,
			        "word": " business",
			      },
			      {
			        "end": 18.6,
			        "start": 18.24,
			        "word": " editor",
			      },
			      {
			        "end": 18.73,
			        "start": 18.6,
			        "word": " at",
			      },
			      {
			        "end": 19.04,
			        "start": 18.73,
			        "word": " large",
			      },
			      {
			        "end": 19.18,
			        "start": 19.04,
			        "word": " and",
			      },
			      {
			        "end": 19.5,
			        "start": 19.18,
			        "word": " anchor",
			      },
			      {
			        "end": 19.64,
			        "start": 19.5,
			        "word": " of",
			      },
			      {
			        "end": 19.86,
			        "start": 19.64,
			        "word": " Quest",
			      },
			      {
			        "end": 20.12,
			        "start": 19.86,
			        "word": " means",
			      },
			      {
			        "end": 20.53,
			        "start": 20.12,
			        "word": " business",
			      },
			    ],
			  },
			  {
			    "end": 22.66,
			    "start": 20.72,
			    "text": "So, Ambassador Bolton, I know you're not an economist,",
			    "words": [
			      {
			        "end": 20.87,
			        "start": 20.72,
			        "word": " So",
			      },
			      {
			        "end": 21.12,
			        "start": 20.87,
			        "word": ",",
			      },
			      {
			        "end": 21.31,
			        "start": 21.12,
			        "word": " Ambassador",
			      },
			      {
			        "end": 21.43,
			        "start": 21.31,
			        "word": " Bol",
			      },
			      {
			        "end": 21.55,
			        "start": 21.43,
			        "word": "ton",
			      },
			      {
			        "end": 21.63,
			        "start": 21.55,
			        "word": ",",
			      },
			      {
			        "end": 21.67,
			        "start": 21.63,
			        "word": " I",
			      },
			      {
			        "end": 21.84,
			        "start": 21.67,
			        "word": " know",
			      },
			      {
			        "end": 21.96,
			        "start": 21.84,
			        "word": " you",
			      },
			      {
			        "end": 22.08,
			        "start": 21.96,
			        "word": "'re",
			      },
			      {
			        "end": 22.28,
			        "start": 22.08,
			        "word": " not",
			      },
			      {
			        "end": 22.31,
			        "start": 22.28,
			        "word": " an",
			      },
			      {
			        "end": 22.66,
			        "start": 22.31,
			        "word": " economist",
			      },
			    ],
			  },
			  {
			    "end": 26.1,
			    "start": 22.84,
			    "text": "but just from a strategic perspective, do you think China is going to blink",
			    "words": [
			      {
			        "end": 22.98,
			        "start": 22.84,
			        "word": " but",
			      },
			      {
			        "end": 23.2,
			        "start": 22.98,
			        "word": " just",
			      },
			      {
			        "end": 23.36,
			        "start": 23.2,
			        "word": " from",
			      },
			      {
			        "end": 23.4,
			        "start": 23.36,
			        "word": " a",
			      },
			      {
			        "end": 23.82,
			        "start": 23.4,
			        "word": " strategic",
			      },
			      {
			        "end": 24.34,
			        "start": 23.82,
			        "word": " perspective",
			      },
			      {
			        "end": 24.46,
			        "start": 24.34,
			        "word": ",",
			      },
			      {
			        "end": 24.61,
			        "start": 24.46,
			        "word": " do",
			      },
			      {
			        "end": 24.73,
			        "start": 24.61,
			        "word": " you",
			      },
			      {
			        "end": 25.01,
			        "start": 24.73,
			        "word": " think",
			      },
			      {
			        "end": 25.29,
			        "start": 25.01,
			        "word": " China",
			      },
			      {
			        "end": 25.4,
			        "start": 25.29,
			        "word": " is",
			      },
			      {
			        "end": 25.68,
			        "start": 25.4,
			        "word": " going",
			      },
			      {
			        "end": 25.79,
			        "start": 25.68,
			        "word": " to",
			      },
			      {
			        "end": 26.1,
			        "start": 25.79,
			        "word": " blink",
			      },
			    ],
			  },
			  {
			    "end": 27.3,
			    "start": 26.1,
			    "text": "and try to cut a deal with the White House?",
			    "words": [
			      {
			        "end": 26.21,
			        "start": 26.1,
			        "word": " and",
			      },
			      {
			        "end": 26.32,
			        "start": 26.21,
			        "word": " try",
			      },
			      {
			        "end": 26.39,
			        "start": 26.32,
			        "word": " to",
			      },
			      {
			        "end": 26.53,
			        "start": 26.39,
			        "word": " cut",
			      },
			      {
			        "end": 26.54,
			        "start": 26.53,
			        "word": " a",
			      },
			      {
			        "end": 26.68,
			        "start": 26.54,
			        "word": " deal",
			      },
			      {
			        "end": 26.83,
			        "start": 26.68,
			        "word": " with",
			      },
			      {
			        "end": 26.94,
			        "start": 26.83,
			        "word": " the",
			      },
			      {
			        "end": 27.11,
			        "start": 26.94,
			        "word": " White",
			      },
			      {
			        "end": 27.3,
			        "start": 27.11,
			        "word": " House",
			      },
			    ],
			  },
			  {
			    "end": 35.83,
			    "start": 29.76,
			    "text": "It certainly doesn't look like it, but what Trump is doing is a huge opportunity for China worldwide.",
			    "words": [
			      {
			        "end": 30.05,
			        "start": 29.76,
			        "word": " It",
			      },
			      {
			        "end": 30.37,
			        "start": 30.05,
			        "word": " certainly",
			      },
			      {
			        "end": 30.65,
			        "start": 30.37,
			        "word": " doesn",
			      },
			      {
			        "end": 30.76,
			        "start": 30.65,
			        "word": "'t",
			      },
			      {
			        "end": 31.05,
			        "start": 30.76,
			        "word": " look",
			      },
			      {
			        "end": 31.2,
			        "start": 31.05,
			        "word": " like",
			      },
			      {
			        "end": 31.31,
			        "start": 31.2,
			        "word": " it",
			      },
			      {
			        "end": 31.46,
			        "start": 31.31,
			        "word": ",",
			      },
			      {
			        "end": 31.8,
			        "start": 31.46,
			        "word": " but",
			      },
			      {
			        "end": 32.14,
			        "start": 31.8,
			        "word": " what",
			      },
			      {
			        "end": 32.63,
			        "start": 32.14,
			        "word": " Trump",
			      },
			      {
			        "end": 32.88,
			        "start": 32.63,
			        "word": " is",
			      },
			      {
			        "end": 33.34,
			        "start": 32.88,
			        "word": " doing",
			      },
			      {
			        "end": 33.5,
			        "start": 33.34,
			        "word": " is",
			      },
			      {
			        "end": 33.58,
			        "start": 33.5,
			        "word": " a",
			      },
			      {
			        "end": 33.91,
			        "start": 33.58,
			        "word": " huge",
			      },
			      {
			        "end": 34.82,
			        "start": 33.91,
			        "word": " opportunity",
			      },
			      {
			        "end": 35.07,
			        "start": 34.82,
			        "word": " for",
			      },
			      {
			        "end": 35.3,
			        "start": 35.07,
			        "word": " China",
			      },
			      {
			        "end": 35.83,
			        "start": 35.3,
			        "word": " worldwide",
			      },
			    ],
			  },
			  {
			    "end": 39.46,
			    "start": 36.02,
			    "text": "These tariffs are a form of economic illiteracy.",
			    "words": [
			      {
			        "end": 36.45,
			        "start": 36.02,
			        "word": " These",
			      },
			      {
			        "end": 37.06,
			        "start": 36.45,
			        "word": " tariffs",
			      },
			      {
			        "end": 37.32,
			        "start": 37.06,
			        "word": " are",
			      },
			      {
			        "end": 37.74,
			        "start": 37.32,
			        "word": " a",
			      },
			      {
			        "end": 37.75,
			        "start": 37.74,
			        "word": " form",
			      },
			      {
			        "end": 38.06,
			        "start": 37.75,
			        "word": " of",
			      },
			      {
			        "end": 38.6,
			        "start": 38.06,
			        "word": " economic",
			      },
			      {
			        "end": 38.86,
			        "start": 38.6,
			        "word": " ill",
			      },
			      {
			        "end": 39.2,
			        "start": 38.86,
			        "word": "iter",
			      },
			      {
			        "end": 39.46,
			        "start": 39.2,
			        "word": "acy",
			      },
			    ],
			  },
			  {
			    "end": 43.55,
			    "start": 39.78,
			    "text": "Trump has no idea, really, what he's talking about.",
			    "words": [
			      {
			        "end": 40.3,
			        "start": 39.78,
			        "word": " Trump",
			      },
			      {
			        "end": 40.49,
			        "start": 40.3,
			        "word": " has",
			      },
			      {
			        "end": 40.64,
			        "start": 40.49,
			        "word": " no",
			      },
			      {
			        "end": 40.98,
			        "start": 40.64,
			        "word": " idea",
			      },
			      {
			        "end": 41.15,
			        "start": 40.98,
			        "word": ",",
			      },
			      {
			        "end": 41.67,
			        "start": 41.15,
			        "word": " really",
			      },
			      {
			        "end": 41.83,
			        "start": 41.67,
			        "word": ",",
			      },
			      {
			        "end": 42.33,
			        "start": 41.83,
			        "word": " what",
			      },
			      {
			        "end": 42.36,
			        "start": 42.33,
			        "word": " he",
			      },
			      {
			        "end": 42.52,
			        "start": 42.36,
			        "word": "'s",
			      },
			      {
			        "end": 43.12,
			        "start": 42.52,
			        "word": " talking",
			      },
			      {
			        "end": 43.55,
			        "start": 43.12,
			        "word": " about",
			      },
			    ],
			  },
			  {
			    "end": 45.64,
			    "start": 43.86,
			    "text": "He doesn't understand how tariffs works.",
			    "words": [
			      {
			        "end": 43.96,
			        "start": 43.86,
			        "word": " He",
			      },
			      {
			        "end": 44.22,
			        "start": 43.96,
			        "word": " doesn",
			      },
			      {
			        "end": 44.32,
			        "start": 44.22,
			        "word": "'t",
			      },
			      {
			        "end": 44.85,
			        "start": 44.32,
			        "word": " understand",
			      },
			      {
			        "end": 45.01,
			        "start": 44.85,
			        "word": " how",
			      },
			      {
			        "end": 45.38,
			        "start": 45.01,
			        "word": " tariffs",
			      },
			      {
			        "end": 45.64,
			        "start": 45.38,
			        "word": " works",
			      },
			    ],
			  },
			  {
			    "end": 50.84,
			    "start": 45.84,
			    "text": "He has said as recently as a few days ago he views trade surpluses and deficits",
			    "words": [
			      {
			        "end": 46.01,
			        "start": 45.84,
			        "word": " He",
			      },
			      {
			        "end": 46.25,
			        "start": 46.01,
			        "word": " has",
			      },
			      {
			        "end": 46.58,
			        "start": 46.25,
			        "word": " said",
			      },
			      {
			        "end": 46.74,
			        "start": 46.58,
			        "word": " as",
			      },
			      {
			        "end": 47.4,
			        "start": 46.74,
			        "word": " recently",
			      },
			      {
			        "end": 47.56,
			        "start": 47.4,
			        "word": " as",
			      },
			      {
			        "end": 47.64,
			        "start": 47.56,
			        "word": " a",
			      },
			      {
			        "end": 47.89,
			        "start": 47.64,
			        "word": " few",
			      },
			      {
			        "end": 48.22,
			        "start": 47.89,
			        "word": " days",
			      },
			      {
			        "end": 48.52,
			        "start": 48.22,
			        "word": " ago",
			      },
			      {
			        "end": 48.66,
			        "start": 48.52,
			        "word": " he",
			      },
			      {
			        "end": 49.02,
			        "start": 48.66,
			        "word": " views",
			      },
			      {
			        "end": 49.38,
			        "start": 49.02,
			        "word": " trade",
			      },
			      {
			        "end": 49.59,
			        "start": 49.38,
			        "word": " sur",
			      },
			      {
			        "end": 49.73,
			        "start": 49.59,
			        "word": "pl",
			      },
			      {
			        "end": 50.01,
			        "start": 49.73,
			        "word": "uses",
			      },
			      {
			        "end": 50.22,
			        "start": 50.01,
			        "word": " and",
			      },
			      {
			        "end": 50.84,
			        "start": 50.22,
			        "word": " deficits",
			      },
			    ],
			  },
			  {
			    "end": 54.57,
			    "start": 50.84,
			    "text": "as like a profit and loss statement, which they certainly are not.",
			    "words": [
			      {
			        "end": 51,
			        "start": 50.84,
			        "word": " as",
			      },
			      {
			        "end": 51.39,
			        "start": 51,
			        "word": " like",
			      },
			      {
			        "end": 51.41,
			        "start": 51.39,
			        "word": " a",
			      },
			      {
			        "end": 51.9,
			        "start": 51.41,
			        "word": " profit",
			      },
			      {
			        "end": 52.17,
			        "start": 51.9,
			        "word": " and",
			      },
			      {
			        "end": 52.47,
			        "start": 52.17,
			        "word": " loss",
			      },
			      {
			        "end": 53.21,
			        "start": 52.47,
			        "word": " statement",
			      },
			      {
			        "end": 53.42,
			        "start": 53.21,
			        "word": ",",
			      },
			      {
			        "end": 53.67,
			        "start": 53.42,
			        "word": " which",
			      },
			      {
			        "end": 53.85,
			        "start": 53.67,
			        "word": " they",
			      },
			      {
			        "end": 54.29,
			        "start": 53.85,
			        "word": " certainly",
			      },
			      {
			        "end": 54.43,
			        "start": 54.29,
			        "word": " are",
			      },
			      {
			        "end": 54.57,
			        "start": 54.43,
			        "word": " not",
			      },
			    ],
			  },
			  {
			    "end": 59.42,
			    "start": 54.76,
			    "text": "So what he's doing has put us in a very vulnerable position,",
			    "words": [
			      {
			        "end": 55.39,
			        "start": 54.76,
			        "word": " So",
			      },
			      {
			        "end": 55.55,
			        "start": 55.39,
			        "word": " what",
			      },
			      {
			        "end": 55.81,
			        "start": 55.55,
			        "word": " he",
			      },
			      {
			        "end": 56.07,
			        "start": 55.81,
			        "word": "'s",
			      },
			      {
			        "end": 56.73,
			        "start": 56.07,
			        "word": " doing",
			      },
			      {
			        "end": 57.12,
			        "start": 56.73,
			        "word": " has",
			      },
			      {
			        "end": 57.51,
			        "start": 57.12,
			        "word": " put",
			      },
			      {
			        "end": 57.82,
			        "start": 57.51,
			        "word": " us",
			      },
			      {
			        "end": 57.94,
			        "start": 57.82,
			        "word": " in",
			      },
			      {
			        "end": 58,
			        "start": 57.94,
			        "word": " a",
			      },
			      {
			        "end": 58.25,
			        "start": 58,
			        "word": " very",
			      },
			      {
			        "end": 58.88,
			        "start": 58.25,
			        "word": " vulnerable",
			      },
			      {
			        "end": 59.42,
			        "start": 58.88,
			        "word": " position",
			      },
			    ],
			  },
			  {
			    "end": 66.36,
			    "start": 59.52,
			    "text": "and probably in the worst position possible to go after the real country problem",
			    "words": [
			      {
			        "end": 59.77,
			        "start": 59.52,
			        "word": " and",
			      },
			      {
			        "end": 60.44,
			        "start": 59.77,
			        "word": " probably",
			      },
			      {
			        "end": 60.61,
			        "start": 60.44,
			        "word": " in",
			      },
			      {
			        "end": 60.86,
			        "start": 60.61,
			        "word": " the",
			      },
			      {
			        "end": 61.28,
			        "start": 60.86,
			        "word": " worst",
			      },
			      {
			        "end": 61.96,
			        "start": 61.28,
			        "word": " position",
			      },
			      {
			        "end": 62.66,
			        "start": 61.96,
			        "word": " possible",
			      },
			      {
			        "end": 62.79,
			        "start": 62.66,
			        "word": " to",
			      },
			      {
			        "end": 63.25,
			        "start": 62.79,
			        "word": " go",
			      },
			      {
			        "end": 63.75,
			        "start": 63.25,
			        "word": " after",
			      },
			      {
			        "end": 64.19,
			        "start": 63.75,
			        "word": " the",
			      },
			      {
			        "end": 64.61,
			        "start": 64.19,
			        "word": " real",
			      },
			      {
			        "end": 65.47,
			        "start": 64.61,
			        "word": " country",
			      },
			      {
			        "end": 66.36,
			        "start": 65.47,
			        "word": " problem",
			      },
			    ],
			  },
			  {
			    "end": 68.6,
			    "start": 66.36,
			    "text": "in the international trading system, which is China.",
			    "words": [
			      {
			        "end": 66.45,
			        "start": 66.36,
			        "word": " in",
			      },
			      {
			        "end": 66.59,
			        "start": 66.45,
			        "word": " the",
			      },
			      {
			        "end": 67.21,
			        "start": 66.59,
			        "word": " international",
			      },
			      {
			        "end": 67.54,
			        "start": 67.21,
			        "word": " trading",
			      },
			      {
			        "end": 67.83,
			        "start": 67.54,
			        "word": " system",
			      },
			      {
			        "end": 67.96,
			        "start": 67.83,
			        "word": ",",
			      },
			      {
			        "end": 68.23,
			        "start": 67.96,
			        "word": " which",
			      },
			      {
			        "end": 68.33,
			        "start": 68.23,
			        "word": " is",
			      },
			      {
			        "end": 68.6,
			        "start": 68.33,
			        "word": " China",
			      },
			    ],
			  },
			  {
			    "end": 74.25,
			    "start": 68.78,
			    "text": "Instead of taking on the country that's stolen our intellectual property for decades,",
			    "words": [
			      {
			        "end": 69.42,
			        "start": 68.78,
			        "word": " Instead",
			      },
			      {
			        "end": 69.67,
			        "start": 69.42,
			        "word": " of",
			      },
			      {
			        "end": 70.15,
			        "start": 69.67,
			        "word": " taking",
			      },
			      {
			        "end": 70.33,
			        "start": 70.15,
			        "word": " on",
			      },
			      {
			        "end": 70.93,
			        "start": 70.33,
			        "word": " the",
			      },
			      {
			        "end": 71.26,
			        "start": 70.93,
			        "word": " country",
			      },
			      {
			        "end": 71.53,
			        "start": 71.26,
			        "word": " that",
			      },
			      {
			        "end": 72.01,
			        "start": 71.53,
			        "word": "'s",
			      },
			      {
			        "end": 72.07,
			        "start": 72.01,
			        "word": " stolen",
			      },
			      {
			        "end": 72.27,
			        "start": 72.07,
			        "word": " our",
			      },
			      {
			        "end": 73.08,
			        "start": 72.27,
			        "word": " intellectual",
			      },
			      {
			        "end": 73.66,
			        "start": 73.08,
			        "word": " property",
			      },
			      {
			        "end": 73.85,
			        "start": 73.66,
			        "word": " for",
			      },
			      {
			        "end": 74.25,
			        "start": 73.85,
			        "word": " decades",
			      },
			    ],
			  },
			  {
			    "end": 77.19,
			    "start": 74.38,
			    "text": "among other things, by gathering our allies together,",
			    "words": [
			      {
			        "end": 74.63,
			        "start": 74.38,
			        "word": " among",
			      },
			      {
			        "end": 74.88,
			        "start": 74.63,
			        "word": " other",
			      },
			      {
			        "end": 75.18,
			        "start": 74.88,
			        "word": " things",
			      },
			      {
			        "end": 75.28,
			        "start": 75.18,
			        "word": ",",
			      },
			      {
			        "end": 75.41,
			        "start": 75.28,
			        "word": " by",
			      },
			      {
			        "end": 76.03,
			        "start": 75.41,
			        "word": " gathering",
			      },
			      {
			        "end": 76.23,
			        "start": 76.03,
			        "word": " our",
			      },
			      {
			        "end": 76.64,
			        "start": 76.23,
			        "word": " allies",
			      },
			      {
			        "end": 77.19,
			        "start": 76.64,
			        "word": " together",
			      },
			    ],
			  },
			  {
			    "end": 81.36,
			    "start": 77.36,
			    "text": "all of whom also suffer from China's intellectual property theft,",
			    "words": [
			      {
			        "end": 77.8,
			        "start": 77.36,
			        "word": " all",
			      },
			      {
			        "end": 77.82,
			        "start": 77.8,
			        "word": " of",
			      },
			      {
			        "end": 78.19,
			        "start": 77.82,
			        "word": " whom",
			      },
			      {
			        "end": 78.56,
			        "start": 78.19,
			        "word": " also",
			      },
			      {
			        "end": 79.14,
			        "start": 78.56,
			        "word": " suffer",
			      },
			      {
			        "end": 79.49,
			        "start": 79.14,
			        "word": " from",
			      },
			      {
			        "end": 79.81,
			        "start": 79.49,
			        "word": " China",
			      },
			      {
			        "end": 79.96,
			        "start": 79.81,
			        "word": "'s",
			      },
			      {
			        "end": 80.62,
			        "start": 79.96,
			        "word": " intellectual",
			      },
			      {
			        "end": 80.96,
			        "start": 80.62,
			        "word": " property",
			      },
			      {
			        "end": 81.36,
			        "start": 80.96,
			        "word": " theft",
			      },
			    ],
			  },
			  {
			    "end": 86.7,
			    "start": 81.36,
			    "text": "and engaging in concerted action, we're at war with our largest trading partners",
			    "words": [
			      {
			        "end": 81.8,
			        "start": 81.36,
			        "word": " and",
			      },
			      {
			        "end": 82.46,
			        "start": 81.8,
			        "word": " engaging",
			      },
			      {
			        "end": 82.81,
			        "start": 82.46,
			        "word": " in",
			      },
			      {
			        "end": 83.36,
			        "start": 82.81,
			        "word": " concert",
			      },
			      {
			        "end": 83.57,
			        "start": 83.36,
			        "word": "ed",
			      },
			      {
			        "end": 84.16,
			        "start": 83.57,
			        "word": " action",
			      },
			      {
			        "end": 84.38,
			        "start": 84.16,
			        "word": ",",
			      },
			      {
			        "end": 84.49,
			        "start": 84.38,
			        "word": " we",
			      },
			      {
			        "end": 84.66,
			        "start": 84.49,
			        "word": "'re",
			      },
			      {
			        "end": 84.8,
			        "start": 84.66,
			        "word": " at",
			      },
			      {
			        "end": 84.94,
			        "start": 84.8,
			        "word": " war",
			      },
			      {
			        "end": 85.24,
			        "start": 84.94,
			        "word": " with",
			      },
			      {
			        "end": 85.34,
			        "start": 85.24,
			        "word": " our",
			      },
			      {
			        "end": 85.75,
			        "start": 85.34,
			        "word": " largest",
			      },
			      {
			        "end": 86.16,
			        "start": 85.75,
			        "word": " trading",
			      },
			      {
			        "end": 86.7,
			        "start": 86.16,
			        "word": " partners",
			      },
			    ],
			  },
			  {
			    "end": 89.24,
			    "start": 86.7,
			    "text": "while we're about to go to war with China as well.",
			    "words": [
			      {
			        "end": 87.11,
			        "start": 86.7,
			        "word": " while",
			      },
			      {
			        "end": 87.16,
			        "start": 87.11,
			        "word": " we",
			      },
			      {
			        "end": 87.35,
			        "start": 87.16,
			        "word": "'re",
			      },
			      {
			        "end": 87.74,
			        "start": 87.35,
			        "word": " about",
			      },
			      {
			        "end": 87.81,
			        "start": 87.74,
			        "word": " to",
			      },
			      {
			        "end": 87.94,
			        "start": 87.81,
			        "word": " go",
			      },
			      {
			        "end": 88.07,
			        "start": 87.94,
			        "word": " to",
			      },
			      {
			        "end": 88.29,
			        "start": 88.07,
			        "word": " war",
			      },
			      {
			        "end": 88.52,
			        "start": 88.29,
			        "word": " with",
			      },
			      {
			        "end": 88.86,
			        "start": 88.52,
			        "word": " China",
			      },
			      {
			        "end": 88.98,
			        "start": 88.86,
			        "word": " as",
			      },
			      {
			        "end": 89.24,
			        "start": 88.98,
			        "word": " well",
			      },
			    ],
			  },
			  {
			    "end": 93.18,
			    "start": 89.48,
			    "text": "It simply makes no sense, and it's just sad and depressing",
			    "words": [
			      {
			        "end": 89.67,
			        "start": 89.48,
			        "word": " It",
			      },
			      {
			        "end": 90.15,
			        "start": 89.67,
			        "word": " simply",
			      },
			      {
			        "end": 90.64,
			        "start": 90.15,
			        "word": " makes",
			      },
			      {
			        "end": 90.74,
			        "start": 90.64,
			        "word": " no",
			      },
			      {
			        "end": 91.17,
			        "start": 90.74,
			        "word": " sense",
			      },
			      {
			        "end": 91.18,
			        "start": 91.17,
			        "word": ",",
			      },
			      {
			        "end": 91.4,
			        "start": 91.18,
			        "word": " and",
			      },
			      {
			        "end": 91.59,
			        "start": 91.4,
			        "word": " it",
			      },
			      {
			        "end": 91.68,
			        "start": 91.59,
			        "word": "'s",
			      },
			      {
			        "end": 92.1,
			        "start": 91.68,
			        "word": " just",
			      },
			      {
			        "end": 92.19,
			        "start": 92.1,
			        "word": " sad",
			      },
			      {
			        "end": 92.41,
			        "start": 92.19,
			        "word": " and",
			      },
			      {
			        "end": 93.18,
			        "start": 92.41,
			        "word": " depressing",
			      },
			    ],
			  },
			  {
			    "end": 96.17,
			    "start": 93.18,
			    "text": "that more Republicans haven't stood up and said that.",
			    "words": [
			      {
			        "end": 93.65,
			        "start": 93.18,
			        "word": " that",
			      },
			      {
			        "end": 93.83,
			        "start": 93.65,
			        "word": " more",
			      },
			      {
			        "end": 94.74,
			        "start": 93.83,
			        "word": " Republicans",
			      },
			      {
			        "end": 95.1,
			        "start": 94.74,
			        "word": " haven",
			      },
			      {
			        "end": 95.21,
			        "start": 95.1,
			        "word": "'t",
			      },
			      {
			        "end": 95.55,
			        "start": 95.21,
			        "word": " stood",
			      },
			      {
			        "end": 95.71,
			        "start": 95.55,
			        "word": " up",
			      },
			      {
			        "end": 95.83,
			        "start": 95.71,
			        "word": " and",
			      },
			      {
			        "end": 96,
			        "start": 95.83,
			        "word": " said",
			      },
			      {
			        "end": 96.17,
			        "start": 96,
			        "word": " that",
			      },
			    ],
			  },
			  {
			    "end": 97.58,
			    "start": 96.32,
			    "text": "This is illiteracy.",
			    "words": [
			      {
			        "end": 96.64,
			        "start": 96.32,
			        "word": " This",
			      },
			      {
			        "end": 96.8,
			        "start": 96.64,
			        "word": " is",
			      },
			      {
			        "end": 97.04,
			        "start": 96.8,
			        "word": " ill",
			      },
			      {
			        "end": 97.35,
			        "start": 97.04,
			        "word": "iter",
			      },
			      {
			        "end": 97.58,
			        "start": 97.35,
			        "word": "acy",
			      },
			    ],
			  },
			  {
			    "end": 102.18,
			    "start": 98.58,
			    "text": "Richard, what does it look like for Americans if the price of everything imported from China",
			    "words": [
			      {
			        "end": 98.9,
			        "start": 98.58,
			        "word": " Richard",
			      },
			      {
			        "end": 98.98,
			        "start": 98.9,
			        "word": ",",
			      },
			      {
			        "end": 99.22,
			        "start": 98.98,
			        "word": " what",
			      },
			      {
			        "end": 99.46,
			        "start": 99.22,
			        "word": " does",
			      },
			      {
			        "end": 99.58,
			        "start": 99.46,
			        "word": " it",
			      },
			      {
			        "end": 99.82,
			        "start": 99.58,
			        "word": " look",
			      },
			      {
			        "end": 100.13,
			        "start": 99.82,
			        "word": " like",
			      },
			      {
			        "end": 100.23,
			        "start": 100.13,
			        "word": " for",
			      },
			      {
			        "end": 100.62,
			        "start": 100.23,
			        "word": " Americans",
			      },
			      {
			        "end": 100.7,
			        "start": 100.62,
			        "word": " if",
			      },
			      {
			        "end": 100.82,
			        "start": 100.7,
			        "word": " the",
			      },
			      {
			        "end": 101.03,
			        "start": 100.82,
			        "word": " price",
			      },
			      {
			        "end": 101.09,
			        "start": 101.03,
			        "word": " of",
			      },
			      {
			        "end": 101.5,
			        "start": 101.09,
			        "word": " everything",
			      },
			      {
			        "end": 101.82,
			        "start": 101.5,
			        "word": " imported",
			      },
			      {
			        "end": 101.98,
			        "start": 101.82,
			        "word": " from",
			      },
			      {
			        "end": 102.18,
			        "start": 101.98,
			        "word": " China",
			      },
			    ],
			  },
			  {
			    "end": 103.49,
			    "start": 102.18,
			    "text": "effectively doubles overnight?",
			    "words": [
			      {
			        "end": 102.56,
			        "start": 102.18,
			        "word": " effectively",
			      },
			      {
			        "end": 103.04,
			        "start": 102.56,
			        "word": " doubles",
			      },
			      {
			        "end": 103.49,
			        "start": 103.04,
			        "word": " overnight",
			      },
			    ],
			  },
			  {
			    "end": 105.8,
			    "start": 103.64,
			    "text": "How much of that gets passed on to consumers?",
			    "words": [
			      {
			        "end": 103.82,
			        "start": 103.64,
			        "word": " How",
			      },
			      {
			        "end": 104.06,
			        "start": 103.82,
			        "word": " much",
			      },
			      {
			        "end": 104.18,
			        "start": 104.06,
			        "word": " of",
			      },
			      {
			        "end": 104.42,
			        "start": 104.18,
			        "word": " that",
			      },
			      {
			        "end": 104.66,
			        "start": 104.42,
			        "word": " gets",
			      },
			      {
			        "end": 105.02,
			        "start": 104.66,
			        "word": " passed",
			      },
			      {
			        "end": 105.14,
			        "start": 105.02,
			        "word": " on",
			      },
			      {
			        "end": 105.26,
			        "start": 105.14,
			        "word": " to",
			      },
			      {
			        "end": 105.8,
			        "start": 105.26,
			        "word": " consumers",
			      },
			    ],
			  },
			  {
			    "end": 109.08,
			    "start": 106,
			    "text": "Well, the ambassador calls it economic illiteracy.",
			    "words": [
			      {
			        "end": 106.28,
			        "start": 106,
			        "word": " Well",
			      },
			      {
			        "end": 106.42,
			        "start": 106.28,
			        "word": ",",
			      },
			      {
			        "end": 106.65,
			        "start": 106.42,
			        "word": " the",
			      },
			      {
			        "end": 107.33,
			        "start": 106.65,
			        "word": " ambassador",
			      },
			      {
			        "end": 107.69,
			        "start": 107.33,
			        "word": " calls",
			      },
			      {
			        "end": 107.82,
			        "start": 107.69,
			        "word": " it",
			      },
			      {
			        "end": 108.41,
			        "start": 107.82,
			        "word": " economic",
			      },
			      {
			        "end": 108.59,
			        "start": 108.41,
			        "word": " ill",
			      },
			      {
			        "end": 108.87,
			        "start": 108.59,
			        "word": "iter",
			      },
			      {
			        "end": 109.08,
			        "start": 108.87,
			        "word": "acy",
			      },
			    ],
			  },
			  {
			    "end": 114.2,
			    "start": 109.32,
			    "text": "I've called it economic vandalism because if you have 104% tariffs,",
			    "words": [
			      {
			        "end": 109.37,
			        "start": 109.32,
			        "word": " I",
			      },
			      {
			        "end": 109.6,
			        "start": 109.37,
			        "word": "'ve",
			      },
			      {
			        "end": 109.85,
			        "start": 109.6,
			        "word": " called",
			      },
			      {
			        "end": 109.95,
			        "start": 109.85,
			        "word": " it",
			      },
			      {
			        "end": 110.38,
			        "start": 109.95,
			        "word": " economic",
			      },
			      {
			        "end": 110.43,
			        "start": 110.38,
			        "word": " v",
			      },
			      {
			        "end": 110.7,
			        "start": 110.43,
			        "word": "andal",
			      },
			      {
			        "end": 110.9,
			        "start": 110.7,
			        "word": "ism",
			      },
			      {
			        "end": 111.64,
			        "start": 110.9,
			        "word": " because",
			      },
			      {
			        "end": 111.8,
			        "start": 111.64,
			        "word": " if",
			      },
			      {
			        "end": 112.1,
			        "start": 111.8,
			        "word": " you",
			      },
			      {
			        "end": 112.5,
			        "start": 112.1,
			        "word": " have",
			      },
			      {
			        "end": 113.39,
			        "start": 112.5,
			        "word": " 104",
			      },
			      {
			        "end": 113.5,
			        "start": 113.39,
			        "word": "%",
			      },
			      {
			        "end": 114.2,
			        "start": 113.5,
			        "word": " tariffs",
			      },
			    ],
			  },
			  {
			    "end": 116.79,
			    "start": 114.42,
			    "text": "what the effect of things is going to happen is two things.",
			    "words": [
			      {
			        "end": 114.61,
			        "start": 114.42,
			        "word": " what",
			      },
			      {
			        "end": 114.75,
			        "start": 114.61,
			        "word": " the",
			      },
			      {
			        "end": 115.03,
			        "start": 114.75,
			        "word": " effect",
			      },
			      {
			        "end": 115.12,
			        "start": 115.03,
			        "word": " of",
			      },
			      {
			        "end": 115.4,
			        "start": 115.12,
			        "word": " things",
			      },
			      {
			        "end": 115.49,
			        "start": 115.4,
			        "word": " is",
			      },
			      {
			        "end": 115.73,
			        "start": 115.49,
			        "word": " going",
			      },
			      {
			        "end": 115.82,
			        "start": 115.73,
			        "word": " to",
			      },
			      {
			        "end": 116.16,
			        "start": 115.82,
			        "word": " happen",
			      },
			      {
			        "end": 116.42,
			        "start": 116.16,
			        "word": " is",
			      },
			      {
			        "end": 116.44,
			        "start": 116.42,
			        "word": " two",
			      },
			      {
			        "end": 116.79,
			        "start": 116.44,
			        "word": " things",
			      },
			    ],
			  },
			  {
			    "end": 119.2,
			    "start": 116.98,
			    "text": "Number one, things simply won't be imported.",
			    "words": [
			      {
			        "end": 117.33,
			        "start": 116.98,
			        "word": " Number",
			      },
			      {
			        "end": 117.51,
			        "start": 117.33,
			        "word": " one",
			      },
			      {
			        "end": 117.64,
			        "start": 117.51,
			        "word": ",",
			      },
			      {
			        "end": 117.99,
			        "start": 117.64,
			        "word": " things",
			      },
			      {
			        "end": 118.34,
			        "start": 117.99,
			        "word": " simply",
			      },
			      {
			        "end": 118.51,
			        "start": 118.34,
			        "word": " won",
			      },
			      {
			        "end": 118.62,
			        "start": 118.51,
			        "word": "'t",
			      },
			      {
			        "end": 118.73,
			        "start": 118.62,
			        "word": " be",
			      },
			      {
			        "end": 119.2,
			        "start": 118.73,
			        "word": " imported",
			      },
			    ],
			  },
			  {
			    "end": 122.06,
			    "start": 119.42,
			    "text": "It's too expensive. It's become unprofitable, uneconomic.",
			    "words": [
			      {
			        "end": 119.51,
			        "start": 119.42,
			        "word": " It",
			      },
			      {
			        "end": 119.61,
			        "start": 119.51,
			        "word": "'s",
			      },
			      {
			        "end": 119.73,
			        "start": 119.61,
			        "word": " too",
			      },
			      {
			        "end": 120.13,
			        "start": 119.73,
			        "word": " expensive",
			      },
			      {
			        "end": 120.28,
			        "start": 120.13,
			        "word": ".",
			      },
			      {
			        "end": 120.38,
			        "start": 120.28,
			        "word": " It",
			      },
			      {
			        "end": 120.71,
			        "start": 120.38,
			        "word": "'s",
			      },
			      {
			        "end": 120.8,
			        "start": 120.71,
			        "word": " become",
			      },
			      {
			        "end": 120.9,
			        "start": 120.8,
			        "word": " un",
			      },
			      {
			        "end": 121.22,
			        "start": 120.9,
			        "word": "profit",
			      },
			      {
			        "end": 121.44,
			        "start": 121.22,
			        "word": "able",
			      },
			      {
			        "end": 121.53,
			        "start": 121.44,
			        "word": ",",
			      },
			      {
			        "end": 121.69,
			        "start": 121.53,
			        "word": " une",
			      },
			      {
			        "end": 122.06,
			        "start": 121.69,
			        "word": "conomic",
			      },
			    ],
			  },
			  {
			    "end": 124.36,
			    "start": 122.28,
			    "text": "Things simply will not be imported.",
			    "words": [
			      {
			        "end": 122.71,
			        "start": 122.28,
			        "word": " Things",
			      },
			      {
			        "end": 123.15,
			        "start": 122.71,
			        "word": " simply",
			      },
			      {
			        "end": 123.43,
			        "start": 123.15,
			        "word": " will",
			      },
			      {
			        "end": 123.64,
			        "start": 123.43,
			        "word": " not",
			      },
			      {
			        "end": 123.78,
			        "start": 123.64,
			        "word": " be",
			      },
			      {
			        "end": 124.36,
			        "start": 123.78,
			        "word": " imported",
			      },
			    ],
			  },
			  {
			    "end": 127.02,
			    "start": 124.6,
			    "text": "Think about Christmas toys that just won't arrive.",
			    "words": [
			      {
			        "end": 124.93,
			        "start": 124.6,
			        "word": " Think",
			      },
			      {
			        "end": 125.18,
			        "start": 124.93,
			        "word": " about",
			      },
			      {
			        "end": 125.7,
			        "start": 125.18,
			        "word": " Christmas",
			      },
			      {
			        "end": 125.96,
			        "start": 125.7,
			        "word": " toys",
			      },
			      {
			        "end": 126.21,
			        "start": 125.96,
			        "word": " that",
			      },
			      {
			        "end": 126.4,
			        "start": 126.21,
			        "word": " just",
			      },
			      {
			        "end": 126.57,
			        "start": 126.4,
			        "word": " won",
			      },
			      {
			        "end": 126.68,
			        "start": 126.57,
			        "word": "'t",
			      },
			      {
			        "end": 127.02,
			        "start": 126.68,
			        "word": " arrive",
			      },
			    ],
			  },
			  {
			    "end": 132.8,
			    "start": 127.22,
			    "text": "But there are many things now that, as the Chinese have reminded the United States",
			    "words": [
			      {
			        "end": 127.68,
			        "start": 127.22,
			        "word": " But",
			      },
			      {
			        "end": 127.86,
			        "start": 127.68,
			        "word": " there",
			      },
			      {
			        "end": 128.1,
			        "start": 127.86,
			        "word": " are",
			      },
			      {
			        "end": 128.42,
			        "start": 128.1,
			        "word": " many",
			      },
			      {
			        "end": 128.92,
			        "start": 128.42,
			        "word": " things",
			      },
			      {
			        "end": 129.16,
			        "start": 128.92,
			        "word": " now",
			      },
			      {
			        "end": 129.51,
			        "start": 129.16,
			        "word": " that",
			      },
			      {
			        "end": 129.61,
			        "start": 129.51,
			        "word": ",",
			      },
			      {
			        "end": 129.76,
			        "start": 129.61,
			        "word": " as",
			      },
			      {
			        "end": 129.99,
			        "start": 129.76,
			        "word": " the",
			      },
			      {
			        "end": 130.53,
			        "start": 129.99,
			        "word": " Chinese",
			      },
			      {
			        "end": 130.83,
			        "start": 130.53,
			        "word": " have",
			      },
			      {
			        "end": 131.48,
			        "start": 130.83,
			        "word": " reminded",
			      },
			      {
			        "end": 132.01,
			        "start": 131.48,
			        "word": " the",
			      },
			      {
			        "end": 132.26,
			        "start": 132.01,
			        "word": " United",
			      },
			      {
			        "end": 132.8,
			        "start": 132.26,
			        "word": " States",
			      },
			    ],
			  },
			  {
			    "end": 139.72,
			    "start": 132.8,
			    "text": "in a commentary a couple of days ago, there are many things that the U.S. only gets from China.",
			    "words": [
			      {
			        "end": 132.97,
			        "start": 132.8,
			        "word": " in",
			      },
			      {
			        "end": 133.05,
			        "start": 132.97,
			        "word": " a",
			      },
			      {
			        "end": 133.91,
			        "start": 133.05,
			        "word": " commentary",
			      },
			      {
			        "end": 133.99,
			        "start": 133.91,
			        "word": " a",
			      },
			      {
			        "end": 134.5,
			        "start": 133.99,
			        "word": " couple",
			      },
			      {
			        "end": 134.67,
			        "start": 134.5,
			        "word": " of",
			      },
			      {
			        "end": 135.01,
			        "start": 134.67,
			        "word": " days",
			      },
			      {
			        "end": 135.26,
			        "start": 135.01,
			        "word": " ago",
			      },
			      {
			        "end": 135.48,
			        "start": 135.26,
			        "word": ",",
			      },
			      {
			        "end": 135.94,
			        "start": 135.48,
			        "word": " there",
			      },
			      {
			        "end": 136.01,
			        "start": 135.94,
			        "word": " are",
			      },
			      {
			        "end": 136.28,
			        "start": 136.01,
			        "word": " many",
			      },
			      {
			        "end": 136.7,
			        "start": 136.28,
			        "word": " things",
			      },
			      {
			        "end": 137.07,
			        "start": 136.7,
			        "word": " that",
			      },
			      {
			        "end": 137.21,
			        "start": 137.07,
			        "word": " the",
			      },
			      {
			        "end": 137.23,
			        "start": 137.21,
			        "word": " U",
			      },
			      {
			        "end": 137.4,
			        "start": 137.23,
			        "word": ".",
			      },
			      {
			        "end": 137.46,
			        "start": 137.4,
			        "word": "S",
			      },
			      {
			        "end": 137.68,
			        "start": 137.46,
			        "word": ".",
			      },
			      {
			        "end": 138.16,
			        "start": 137.68,
			        "word": " only",
			      },
			      {
			        "end": 138.64,
			        "start": 138.16,
			        "word": " gets",
			      },
			      {
			        "end": 139.12,
			        "start": 138.64,
			        "word": " from",
			      },
			      {
			        "end": 139.72,
			        "start": 139.12,
			        "word": " China",
			      },
			    ],
			  },
			  {
			    "end": 147.86,
			    "start": 140.1,
			    "text": "Certain electronics, certain parts of manufacture, they can only now be received from China,",
			    "words": [
			      {
			        "end": 141.12,
			        "start": 140.1,
			        "word": " Certain",
			      },
			      {
			        "end": 142.81,
			        "start": 141.12,
			        "word": " electronics",
			      },
			      {
			        "end": 143.02,
			        "start": 142.81,
			        "word": ",",
			      },
			      {
			        "end": 143.61,
			        "start": 143.02,
			        "word": " certain",
			      },
			      {
			        "end": 143.93,
			        "start": 143.61,
			        "word": " parts",
			      },
			      {
			        "end": 144.08,
			        "start": 143.93,
			        "word": " of",
			      },
			      {
			        "end": 144.91,
			        "start": 144.08,
			        "word": " manufacture",
			      },
			      {
			        "end": 145.08,
			        "start": 144.91,
			        "word": ",",
			      },
			      {
			        "end": 145.56,
			        "start": 145.08,
			        "word": " they",
			      },
			      {
			        "end": 145.66,
			        "start": 145.56,
			        "word": " can",
			      },
			      {
			        "end": 145.99,
			        "start": 145.66,
			        "word": " only",
			      },
			      {
			        "end": 146.24,
			        "start": 145.99,
			        "word": " now",
			      },
			      {
			        "end": 146.4,
			        "start": 146.24,
			        "word": " be",
			      },
			      {
			        "end": 147.07,
			        "start": 146.4,
			        "word": " received",
			      },
			      {
			        "end": 147.4,
			        "start": 147.07,
			        "word": " from",
			      },
			      {
			        "end": 147.86,
			        "start": 147.4,
			        "word": " China",
			      },
			    ],
			  },
			  {
			    "end": 151.12,
			    "start": 148.27,
			    "text": "and the U.S. is going to find that they're going to be left without.",
			    "words": [
			      {
			        "end": 148.37,
			        "start": 148.27,
			        "word": " and",
			      },
			      {
			        "end": 148.52,
			        "start": 148.37,
			        "word": " the",
			      },
			      {
			        "end": 148.57,
			        "start": 148.52,
			        "word": " U",
			      },
			      {
			        "end": 148.72,
			        "start": 148.57,
			        "word": ".",
			      },
			      {
			        "end": 148.79,
			        "start": 148.72,
			        "word": "S",
			      },
			      {
			        "end": 148.94,
			        "start": 148.79,
			        "word": ".",
			      },
			      {
			        "end": 149.02,
			        "start": 148.94,
			        "word": " is",
			      },
			      {
			        "end": 149.33,
			        "start": 149.02,
			        "word": " going",
			      },
			      {
			        "end": 149.37,
			        "start": 149.33,
			        "word": " to",
			      },
			      {
			        "end": 149.58,
			        "start": 149.37,
			        "word": " find",
			      },
			      {
			        "end": 149.96,
			        "start": 149.58,
			        "word": " that",
			      },
			      {
			        "end": 150.15,
			        "start": 149.96,
			        "word": " they",
			      },
			      {
			        "end": 150.26,
			        "start": 150.15,
			        "word": "'re",
			      },
			      {
			        "end": 150.51,
			        "start": 150.26,
			        "word": " going",
			      },
			      {
			        "end": 150.56,
			        "start": 150.51,
			        "word": " to",
			      },
			      {
			        "end": 150.64,
			        "start": 150.56,
			        "word": " be",
			      },
			      {
			        "end": 150.94,
			        "start": 150.64,
			        "word": " left",
			      },
			      {
			        "end": 151.12,
			        "start": 150.94,
			        "word": " without",
			      },
			    ],
			  },
			  {
			    "end": 153.27,
			    "start": 151.3,
			    "text": "They're going to be trying to source it elsewhere.",
			    "words": [
			      {
			        "end": 151.54,
			        "start": 151.3,
			        "word": " They",
			      },
			      {
			        "end": 151.69,
			        "start": 151.54,
			        "word": "'re",
			      },
			      {
			        "end": 151.87,
			        "start": 151.69,
			        "word": " going",
			      },
			      {
			        "end": 151.96,
			        "start": 151.87,
			        "word": " to",
			      },
			      {
			        "end": 152.05,
			        "start": 151.96,
			        "word": " be",
			      },
			      {
			        "end": 152.34,
			        "start": 152.05,
			        "word": " trying",
			      },
			      {
			        "end": 152.43,
			        "start": 152.34,
			        "word": " to",
			      },
			      {
			        "end": 152.72,
			        "start": 152.43,
			        "word": " source",
			      },
			      {
			        "end": 152.86,
			        "start": 152.72,
			        "word": " it",
			      },
			      {
			        "end": 153.27,
			        "start": 152.86,
			        "word": " elsewhere",
			      },
			    ],
			  },
			  {
			    "end": 160.06,
			    "start": 153.44,
			    "text": "And one point to remember, Anderson, tonight, oh yes, you've got the 104% against China,",
			    "words": [
			      {
			        "end": 153.64,
			        "start": 153.44,
			        "word": " And",
			      },
			      {
			        "end": 153.96,
			        "start": 153.64,
			        "word": " one",
			      },
			      {
			        "end": 154.22,
			        "start": 153.96,
			        "word": " point",
			      },
			      {
			        "end": 154.37,
			        "start": 154.22,
			        "word": " to",
			      },
			      {
			        "end": 154.93,
			        "start": 154.37,
			        "word": " remember",
			      },
			      {
			        "end": 155.1,
			        "start": 154.93,
			        "word": ",",
			      },
			      {
			        "end": 155.45,
			        "start": 155.1,
			        "word": " Anderson",
			      },
			      {
			        "end": 155.54,
			        "start": 155.45,
			        "word": ",",
			      },
			      {
			        "end": 156.14,
			        "start": 155.54,
			        "word": " tonight",
			      },
			      {
			        "end": 156.3,
			        "start": 156.14,
			        "word": ",",
			      },
			      {
			        "end": 156.84,
			        "start": 156.3,
			        "word": " oh",
			      },
			      {
			        "end": 156.95,
			        "start": 156.84,
			        "word": " yes",
			      },
			      {
			        "end": 157.27,
			        "start": 156.95,
			        "word": ",",
			      },
			      {
			        "end": 157.41,
			        "start": 157.27,
			        "word": " you",
			      },
			      {
			        "end": 157.6,
			        "start": 157.41,
			        "word": "'ve",
			      },
			      {
			        "end": 157.79,
			        "start": 157.6,
			        "word": " got",
			      },
			      {
			        "end": 157.98,
			        "start": 157.79,
			        "word": " the",
			      },
			      {
			        "end": 158.58,
			        "start": 157.98,
			        "word": " 104",
			      },
			      {
			        "end": 158.64,
			        "start": 158.58,
			        "word": "%",
			      },
			      {
			        "end": 159.47,
			        "start": 158.64,
			        "word": " against",
			      },
			      {
			        "end": 160.06,
			        "start": 159.47,
			        "word": " China",
			      },
			    ],
			  },
			  {
			    "end": 164.44,
			    "start": 160.3,
			    "text": "but you've got the 24% against Japan.",
			    "words": [
			      {
			        "end": 160.66,
			        "start": 160.3,
			        "word": " but",
			      },
			      {
			        "end": 161.02,
			        "start": 160.66,
			        "word": " you",
			      },
			      {
			        "end": 161.38,
			        "start": 161.02,
			        "word": "'ve",
			      },
			      {
			        "end": 161.87,
			        "start": 161.38,
			        "word": " got",
			      },
			      {
			        "end": 162.12,
			        "start": 161.87,
			        "word": " the",
			      },
			      {
			        "end": 162.83,
			        "start": 162.12,
			        "word": " 24",
			      },
			      {
			        "end": 162.95,
			        "start": 162.83,
			        "word": "%",
			      },
			      {
			        "end": 163.8,
			        "start": 162.95,
			        "word": " against",
			      },
			      {
			        "end": 164.44,
			        "start": 163.8,
			        "word": " Japan",
			      },
			    ],
			  },
			  {
			    "end": 166.71,
			    "start": 164.44,
			    "text": "And of course, there's the 25% autos.",
			    "words": [
			      {
			        "end": 164.63,
			        "start": 164.44,
			        "word": " And",
			      },
			      {
			        "end": 164.92,
			        "start": 164.63,
			        "word": " of",
			      },
			      {
			        "end": 165.15,
			        "start": 164.92,
			        "word": " course",
			      },
			      {
			        "end": 165.28,
			        "start": 165.15,
			        "word": ",",
			      },
			      {
			        "end": 165.62,
			        "start": 165.28,
			        "word": " there",
			      },
			      {
			        "end": 165.74,
			        "start": 165.62,
			        "word": "'s",
			      },
			      {
			        "end": 165.94,
			        "start": 165.74,
			        "word": " the",
			      },
			      {
			        "end": 166.32,
			        "start": 165.94,
			        "word": " 25",
			      },
			      {
			        "end": 166.38,
			        "start": 166.32,
			        "word": "%",
			      },
			      {
			        "end": 166.57,
			        "start": 166.38,
			        "word": " aut",
			      },
			      {
			        "end": 166.71,
			        "start": 166.57,
			        "word": "os",
			      },
			    ],
			  },
			  {
			    "end": 173.84,
			    "start": 166.96,
			    "text": "You've got the 15% against South Korea, and you've got the 20% against the European Union.",
			    "words": [
			      {
			        "end": 167.32,
			        "start": 166.96,
			        "word": " You",
			      },
			      {
			        "end": 167.51,
			        "start": 167.32,
			        "word": "'ve",
			      },
			      {
			        "end": 167.86,
			        "start": 167.51,
			        "word": " got",
			      },
			      {
			        "end": 168.15,
			        "start": 167.86,
			        "word": " the",
			      },
			      {
			        "end": 168.58,
			        "start": 168.15,
			        "word": " 15",
			      },
			      {
			        "end": 168.66,
			        "start": 168.58,
			        "word": "%",
			      },
			      {
			        "end": 169.3,
			        "start": 168.66,
			        "word": " against",
			      },
			      {
			        "end": 169.75,
			        "start": 169.3,
			        "word": " South",
			      },
			      {
			        "end": 170.22,
			        "start": 169.75,
			        "word": " Korea",
			      },
			      {
			        "end": 170.22,
			        "start": 170.22,
			        "word": ",",
			      },
			      {
			        "end": 170.67,
			        "start": 170.22,
			        "word": " and",
			      },
			      {
			        "end": 170.7,
			        "start": 170.67,
			        "word": " you",
			      },
			      {
			        "end": 170.94,
			        "start": 170.7,
			        "word": "'ve",
			      },
			      {
			        "end": 171.18,
			        "start": 170.94,
			        "word": " got",
			      },
			      {
			        "end": 171.52,
			        "start": 171.18,
			        "word": " the",
			      },
			      {
			        "end": 171.9,
			        "start": 171.52,
			        "word": " 20",
			      },
			      {
			        "end": 171.98,
			        "start": 171.9,
			        "word": "%",
			      },
			      {
			        "end": 172.68,
			        "start": 171.98,
			        "word": " against",
			      },
			      {
			        "end": 172.79,
			        "start": 172.68,
			        "word": " the",
			      },
			      {
			        "end": 173.53,
			        "start": 172.79,
			        "word": " European",
			      },
			      {
			        "end": 173.84,
			        "start": 173.53,
			        "word": " Union",
			      },
			    ],
			  },
			  {
			    "end": 179.88,
			    "start": 174.55,
			    "text": "So wherever you look at midnight tonight, the global trading network",
			    "words": [
			      {
			        "end": 174.59,
			        "start": 174.55,
			        "word": " So",
			      },
			      {
			        "end": 175.14,
			        "start": 174.59,
			        "word": " wherever",
			      },
			      {
			        "end": 175.36,
			        "start": 175.14,
			        "word": " you",
			      },
			      {
			        "end": 175.65,
			        "start": 175.36,
			        "word": " look",
			      },
			      {
			        "end": 175.85,
			        "start": 175.65,
			        "word": " at",
			      },
			      {
			        "end": 176.37,
			        "start": 175.85,
			        "word": " midnight",
			      },
			      {
			        "end": 176.88,
			        "start": 176.37,
			        "word": " tonight",
			      },
			      {
			        "end": 177.06,
			        "start": 176.88,
			        "word": ",",
			      },
			      {
			        "end": 177.62,
			        "start": 177.06,
			        "word": " the",
			      },
			      {
			        "end": 178.15,
			        "start": 177.62,
			        "word": " global",
			      },
			      {
			        "end": 179,
			        "start": 178.15,
			        "word": " trading",
			      },
			      {
			        "end": 179.88,
			        "start": 179,
			        "word": " network",
			      },
			    ],
			  },
			  {
			    "end": 183.76,
			    "start": 179.88,
			    "text": "is about to come under the most ferocious strain that it's seen,",
			    "words": [
			      {
			        "end": 180.27,
			        "start": 179.88,
			        "word": " is",
			      },
			      {
			        "end": 180.41,
			        "start": 180.27,
			        "word": " about",
			      },
			      {
			        "end": 180.56,
			        "start": 180.41,
			        "word": " to",
			      },
			      {
			        "end": 180.89,
			        "start": 180.56,
			        "word": " come",
			      },
			      {
			        "end": 181.26,
			        "start": 180.89,
			        "word": " under",
			      },
			      {
			        "end": 181.5,
			        "start": 181.26,
			        "word": " the",
			      },
			      {
			        "end": 181.82,
			        "start": 181.5,
			        "word": " most",
			      },
			      {
			        "end": 181.89,
			        "start": 181.82,
			        "word": " f",
			      },
			      {
			        "end": 182.13,
			        "start": 181.89,
			        "word": "ero",
			      },
			      {
			        "end": 182.52,
			        "start": 182.13,
			        "word": "cious",
			      },
			      {
			        "end": 183.02,
			        "start": 182.52,
			        "word": " strain",
			      },
			      {
			        "end": 183.35,
			        "start": 183.02,
			        "word": " that",
			      },
			      {
			        "end": 183.39,
			        "start": 183.35,
			        "word": " it",
			      },
			      {
			        "end": 183.51,
			        "start": 183.39,
			        "word": "'s",
			      },
			      {
			        "end": 183.76,
			        "start": 183.51,
			        "word": " seen",
			      },
			    ],
			  },
			  {
			    "end": 185.21,
			    "start": 183.92,
			    "text": "certainly since the Second World War.",
			    "words": [
			      {
			        "end": 184.3,
			        "start": 183.92,
			        "word": " certainly",
			      },
			      {
			        "end": 184.5,
			        "start": 184.3,
			        "word": " since",
			      },
			      {
			        "end": 184.63,
			        "start": 184.5,
			        "word": " the",
			      },
			      {
			        "end": 184.88,
			        "start": 184.63,
			        "word": " Second",
			      },
			      {
			        "end": 185.09,
			        "start": 184.88,
			        "word": " World",
			      },
			      {
			        "end": 185.21,
			        "start": 185.09,
			        "word": " War",
			      },
			    ],
			  },
			  {
			    "end": 187.79,
			    "start": 185.38,
			    "text": "Ambassador Bolton, I mean, the first Trump administration,",
			    "words": [
			      {
			        "end": 186.06,
			        "start": 185.38,
			        "word": " Ambassador",
			      },
			      {
			        "end": 186.27,
			        "start": 186.06,
			        "word": " Bol",
			      },
			      {
			        "end": 186.46,
			        "start": 186.27,
			        "word": "ton",
			      },
			      {
			        "end": 186.62,
			        "start": 186.46,
			        "word": ",",
			      },
			      {
			        "end": 186.64,
			        "start": 186.62,
			        "word": " I",
			      },
			      {
			        "end": 186.75,
			        "start": 186.64,
			        "word": " mean",
			      },
			      {
			        "end": 186.82,
			        "start": 186.75,
			        "word": ",",
			      },
			      {
			        "end": 186.92,
			        "start": 186.82,
			        "word": " the",
			      },
			      {
			        "end": 187.19,
			        "start": 186.92,
			        "word": " first",
			      },
			      {
			        "end": 187.28,
			        "start": 187.19,
			        "word": " Trump",
			      },
			      {
			        "end": 187.79,
			        "start": 187.28,
			        "word": " administration",
			      },
			    ],
			  },
			  {
			    "end": 190.42,
			    "start": 187.88,
			    "text": "you know, some talked about a so-called madman theory",
			    "words": [
			      {
			        "end": 188.03,
			        "start": 187.88,
			        "word": " you",
			      },
			      {
			        "end": 188.23,
			        "start": 188.03,
			        "word": " know",
			      },
			      {
			        "end": 188.33,
			        "start": 188.23,
			        "word": ",",
			      },
			      {
			        "end": 188.53,
			        "start": 188.33,
			        "word": " some",
			      },
			      {
			        "end": 188.83,
			        "start": 188.53,
			        "word": " talked",
			      },
			      {
			        "end": 189.1,
			        "start": 188.83,
			        "word": " about",
			      },
			      {
			        "end": 189.16,
			        "start": 189.1,
			        "word": " a",
			      },
			      {
			        "end": 189.3,
			        "start": 189.16,
			        "word": " so",
			      },
			      {
			        "end": 189.33,
			        "start": 189.3,
			        "word": "-",
			      },
			      {
			        "end": 189.68,
			        "start": 189.33,
			        "word": "called",
			      },
			      {
			        "end": 189.86,
			        "start": 189.68,
			        "word": " mad",
			      },
			      {
			        "end": 190.03,
			        "start": 189.86,
			        "word": "man",
			      },
			      {
			        "end": 190.42,
			        "start": 190.03,
			        "word": " theory",
			      },
			    ],
			  },
			  {
			    "end": 193.72,
			    "start": 190.42,
			    "text": "that when it comes to national security, the idea that adversaries won't challenge the president",
			    "words": [
			      {
			        "end": 190.58,
			        "start": 190.42,
			        "word": " that",
			      },
			      {
			        "end": 190.77,
			        "start": 190.58,
			        "word": " when",
			      },
			      {
			        "end": 190.82,
			        "start": 190.77,
			        "word": " it",
			      },
			      {
			        "end": 191.03,
			        "start": 190.82,
			        "word": " comes",
			      },
			      {
			        "end": 191.11,
			        "start": 191.03,
			        "word": " to",
			      },
			      {
			        "end": 191.44,
			        "start": 191.11,
			        "word": " national",
			      },
			      {
			        "end": 191.77,
			        "start": 191.44,
			        "word": " security",
			      },
			      {
			        "end": 191.9,
			        "start": 191.77,
			        "word": ",",
			      },
			      {
			        "end": 192.02,
			        "start": 191.9,
			        "word": " the",
			      },
			      {
			        "end": 192.18,
			        "start": 192.02,
			        "word": " idea",
			      },
			      {
			        "end": 192.34,
			        "start": 192.18,
			        "word": " that",
			      },
			      {
			        "end": 192.58,
			        "start": 192.34,
			        "word": " advers",
			      },
			      {
			        "end": 192.82,
			        "start": 192.58,
			        "word": "aries",
			      },
			      {
			        "end": 192.93,
			        "start": 192.82,
			        "word": " won",
			      },
			      {
			        "end": 193,
			        "start": 192.93,
			        "word": "'t",
			      },
			      {
			        "end": 193.33,
			        "start": 193,
			        "word": " challenge",
			      },
			      {
			        "end": 193.43,
			        "start": 193.33,
			        "word": " the",
			      },
			      {
			        "end": 193.72,
			        "start": 193.43,
			        "word": " president",
			      },
			    ],
			  },
			  {
			    "end": 195.28,
			    "start": 193.72,
			    "text": "if they think he's unpredictable.",
			    "words": [
			      {
			        "end": 193.86,
			        "start": 193.72,
			        "word": " if",
			      },
			      {
			        "end": 194.06,
			        "start": 193.86,
			        "word": " they",
			      },
			      {
			        "end": 194.33,
			        "start": 194.06,
			        "word": " think",
			      },
			      {
			        "end": 194.44,
			        "start": 194.33,
			        "word": " he",
			      },
			      {
			        "end": 194.71,
			        "start": 194.44,
			        "word": "'s",
			      },
			      {
			        "end": 195.28,
			        "start": 194.71,
			        "word": " unpredictable",
			      },
			    ],
			  },
			  {
			    "end": 200.39,
			    "start": 195.48,
			    "text": "Does it make any sense to apply that same philosophy to allied trading partnerships?",
			    "words": [
			      {
			        "end": 195.85,
			        "start": 195.48,
			        "word": " Does",
			      },
			      {
			        "end": 196.21,
			        "start": 195.85,
			        "word": " it",
			      },
			      {
			        "end": 196.4,
			        "start": 196.21,
			        "word": " make",
			      },
			      {
			        "end": 196.68,
			        "start": 196.4,
			        "word": " any",
			      },
			      {
			        "end": 197.15,
			        "start": 196.68,
			        "word": " sense",
			      },
			      {
			        "end": 197.38,
			        "start": 197.15,
			        "word": " to",
			      },
			      {
			        "end": 198.42,
			        "start": 197.38,
			        "word": " apply",
			      },
			      {
			        "end": 198.59,
			        "start": 198.42,
			        "word": " that",
			      },
			      {
			        "end": 198.78,
			        "start": 198.59,
			        "word": " same",
			      },
			      {
			        "end": 199.26,
			        "start": 198.78,
			        "word": " philosophy",
			      },
			      {
			        "end": 199.34,
			        "start": 199.26,
			        "word": " to",
			      },
			      {
			        "end": 199.59,
			        "start": 199.34,
			        "word": " allied",
			      },
			      {
			        "end": 199.87,
			        "start": 199.59,
			        "word": " trading",
			      },
			      {
			        "end": 200.39,
			        "start": 199.87,
			        "word": " partnerships",
			      },
			    ],
			  },
			  {
			    "end": 206.58,
			    "start": 202.93,
			    "text": "No, look, the madman theory has a rationale behind it.",
			    "words": [
			      {
			        "end": 202.97,
			        "start": 202.93,
			        "word": " No",
			      },
			      {
			        "end": 203.19,
			        "start": 202.97,
			        "word": ",",
			      },
			      {
			        "end": 203.37,
			        "start": 203.19,
			        "word": " look",
			      },
			      {
			        "end": 203.5,
			        "start": 203.37,
			        "word": ",",
			      },
			      {
			        "end": 203.69,
			        "start": 203.5,
			        "word": " the",
			      },
			      {
			        "end": 203.89,
			        "start": 203.69,
			        "word": " mad",
			      },
			      {
			        "end": 204.1,
			        "start": 203.89,
			        "word": "man",
			      },
			      {
			        "end": 204.54,
			        "start": 204.1,
			        "word": " theory",
			      },
			      {
			        "end": 204.82,
			        "start": 204.54,
			        "word": " has",
			      },
			      {
			        "end": 204.91,
			        "start": 204.82,
			        "word": " a",
			      },
			      {
			        "end": 205.77,
			        "start": 204.91,
			        "word": " rationale",
			      },
			      {
			        "end": 206.34,
			        "start": 205.77,
			        "word": " behind",
			      },
			      {
			        "end": 206.58,
			        "start": 206.34,
			        "word": " it",
			      },
			    ],
			  },
			  {
			    "end": 211.28,
			    "start": 206.58,
			    "text": "When Richard Nixon recommended it to Henry Kissinger dealing with China,",
			    "words": [
			      {
			        "end": 206.81,
			        "start": 206.58,
			        "word": " When",
			      },
			      {
			        "end": 207.21,
			        "start": 206.81,
			        "word": " Richard",
			      },
			      {
			        "end": 207.5,
			        "start": 207.21,
			        "word": " Nixon",
			      },
			      {
			        "end": 208.95,
			        "start": 207.5,
			        "word": " recommended",
			      },
			      {
			        "end": 209.22,
			        "start": 208.95,
			        "word": " it",
			      },
			      {
			        "end": 209.34,
			        "start": 209.22,
			        "word": " to",
			      },
			      {
			        "end": 209.67,
			        "start": 209.34,
			        "word": " Henry",
			      },
			      {
			        "end": 209.91,
			        "start": 209.67,
			        "word": " Kiss",
			      },
			      {
			        "end": 210.23,
			        "start": 209.91,
			        "word": "inger",
			      },
			      {
			        "end": 210.68,
			        "start": 210.23,
			        "word": " dealing",
			      },
			      {
			        "end": 210.93,
			        "start": 210.68,
			        "word": " with",
			      },
			      {
			        "end": 211.28,
			        "start": 210.93,
			        "word": " China",
			      },
			    ],
			  },
			  {
			    "end": 215.6,
			    "start": 211.28,
			    "text": "because Richard Nixon was well-known as an anti-communist,",
			    "words": [
			      {
			        "end": 211.88,
			        "start": 211.28,
			        "word": " because",
			      },
			      {
			        "end": 212.48,
			        "start": 211.88,
			        "word": " Richard",
			      },
			      {
			        "end": 212.91,
			        "start": 212.48,
			        "word": " Nixon",
			      },
			      {
			        "end": 213.17,
			        "start": 212.91,
			        "word": " was",
			      },
			      {
			        "end": 213.51,
			        "start": 213.17,
			        "word": " well",
			      },
			      {
			        "end": 213.59,
			        "start": 213.51,
			        "word": "-",
			      },
			      {
			        "end": 214.06,
			        "start": 213.59,
			        "word": "known",
			      },
			      {
			        "end": 214.23,
			        "start": 214.06,
			        "word": " as",
			      },
			      {
			        "end": 214.4,
			        "start": 214.23,
			        "word": " an",
			      },
			      {
			        "end": 214.74,
			        "start": 214.4,
			        "word": " anti",
			      },
			      {
			        "end": 214.82,
			        "start": 214.74,
			        "word": "-",
			      },
			      {
			        "end": 215.35,
			        "start": 214.82,
			        "word": "commun",
			      },
			      {
			        "end": 215.6,
			        "start": 215.35,
			        "word": "ist",
			      },
			    ],
			  },
			  {
			    "end": 217.9,
			    "start": 215.8,
			    "text": "he had made his political reputation on that.",
			    "words": [
			      {
			        "end": 215.91,
			        "start": 215.8,
			        "word": " he",
			      },
			      {
			        "end": 216.08,
			        "start": 215.91,
			        "word": " had",
			      },
			      {
			        "end": 216.31,
			        "start": 216.08,
			        "word": " made",
			      },
			      {
			        "end": 216.56,
			        "start": 216.31,
			        "word": " his",
			      },
			      {
			        "end": 216.99,
			        "start": 216.56,
			        "word": " political",
			      },
			      {
			        "end": 217.56,
			        "start": 216.99,
			        "word": " reputation",
			      },
			      {
			        "end": 217.67,
			        "start": 217.56,
			        "word": " on",
			      },
			      {
			        "end": 217.9,
			        "start": 217.67,
			        "word": " that",
			      },
			    ],
			  },
			  {
			    "end": 223.32,
			    "start": 218.1,
			    "text": "So when he told Kissinger to basically say Nixon might use nuclear weapons",
			    "words": [
			      {
			        "end": 218.25,
			        "start": 218.1,
			        "word": " So",
			      },
			      {
			        "end": 218.56,
			        "start": 218.25,
			        "word": " when",
			      },
			      {
			        "end": 218.99,
			        "start": 218.56,
			        "word": " he",
			      },
			      {
			        "end": 219.04,
			        "start": 218.99,
			        "word": " told",
			      },
			      {
			        "end": 219.33,
			        "start": 219.04,
			        "word": " Kiss",
			      },
			      {
			        "end": 219.76,
			        "start": 219.33,
			        "word": "inger",
			      },
			      {
			        "end": 219.96,
			        "start": 219.76,
			        "word": " to",
			      },
			      {
			        "end": 220.87,
			        "start": 219.96,
			        "word": " basically",
			      },
			      {
			        "end": 221.18,
			        "start": 220.87,
			        "word": " say",
			      },
			      {
			        "end": 221.57,
			        "start": 221.18,
			        "word": " Nixon",
			      },
			      {
			        "end": 221.96,
			        "start": 221.57,
			        "word": " might",
			      },
			      {
			        "end": 222.19,
			        "start": 221.96,
			        "word": " use",
			      },
			      {
			        "end": 222.74,
			        "start": 222.19,
			        "word": " nuclear",
			      },
			      {
			        "end": 223.32,
			        "start": 222.74,
			        "word": " weapons",
			      },
			    ],
			  },
			  {
			    "end": 226.77,
			    "start": 223.32,
			    "text": "in the particular context they were talking about, use them against China,",
			    "words": [
			      {
			        "end": 223.43,
			        "start": 223.32,
			        "word": " in",
			      },
			      {
			        "end": 223.59,
			        "start": 223.43,
			        "word": " the",
			      },
			      {
			        "end": 224.15,
			        "start": 223.59,
			        "word": " particular",
			      },
			      {
			        "end": 224.53,
			        "start": 224.15,
			        "word": " context",
			      },
			      {
			        "end": 224.76,
			        "start": 224.53,
			        "word": " they",
			      },
			      {
			        "end": 224.98,
			        "start": 224.76,
			        "word": " were",
			      },
			      {
			        "end": 225.38,
			        "start": 224.98,
			        "word": " talking",
			      },
			      {
			        "end": 225.65,
			        "start": 225.38,
			        "word": " about",
			      },
			      {
			        "end": 225.8,
			        "start": 225.65,
			        "word": ",",
			      },
			      {
			        "end": 225.95,
			        "start": 225.8,
			        "word": " use",
			      },
			      {
			        "end": 226.15,
			        "start": 225.95,
			        "word": " them",
			      },
			      {
			        "end": 226.51,
			        "start": 226.15,
			        "word": " against",
			      },
			      {
			        "end": 226.77,
			        "start": 226.51,
			        "word": " China",
			      },
			    ],
			  },
			  {
			    "end": 231.43,
			    "start": 226.9,
			    "text": "it made sense because Nixon believed he was a hard-line anti-communist.",
			    "words": [
			      {
			        "end": 227.13,
			        "start": 226.9,
			        "word": " it",
			      },
			      {
			        "end": 227.45,
			        "start": 227.13,
			        "word": " made",
			      },
			      {
			        "end": 227.9,
			        "start": 227.45,
			        "word": " sense",
			      },
			      {
			        "end": 228.56,
			        "start": 227.9,
			        "word": " because",
			      },
			      {
			        "end": 229.02,
			        "start": 228.56,
			        "word": " Nixon",
			      },
			      {
			        "end": 229.8,
			        "start": 229.02,
			        "word": " believed",
			      },
			      {
			        "end": 229.91,
			        "start": 229.8,
			        "word": "",
			      },
			      {
			        "end": 229.92,
			        "start": 229.91,
			        "word": " he",
			      },
			      {
			        "end": 230.08,
			        "start": 229.92,
			        "word": " was",
			      },
			      {
			        "end": 230.13,
			        "start": 230.08,
			        "word": " a",
			      },
			      {
			        "end": 230.38,
			        "start": 230.13,
			        "word": " hard",
			      },
			      {
			        "end": 230.41,
			        "start": 230.38,
			        "word": "-",
			      },
			      {
			        "end": 230.64,
			        "start": 230.41,
			        "word": "line",
			      },
			      {
			        "end": 230.87,
			        "start": 230.64,
			        "word": " anti",
			      },
			      {
			        "end": 230.92,
			        "start": 230.87,
			        "word": "-",
			      },
			      {
			        "end": 231.27,
			        "start": 230.92,
			        "word": "commun",
			      },
			      {
			        "end": 231.43,
			        "start": 231.27,
			        "word": "ist",
			      },
			    ],
			  },
			  {
			    "end": 232.95,
			    "start": 231.66,
			    "text": "Trump doesn't believe in anything.",
			    "words": [
			      {
			        "end": 231.94,
			        "start": 231.66,
			        "word": " Trump",
			      },
			      {
			        "end": 232.11,
			        "start": 231.94,
			        "word": " doesn",
			      },
			      {
			        "end": 232.25,
			        "start": 232.11,
			        "word": "'t",
			      },
			      {
			        "end": 232.5,
			        "start": 232.25,
			        "word": " believe",
			      },
			      {
			        "end": 232.59,
			        "start": 232.5,
			        "word": " in",
			      },
			      {
			        "end": 232.95,
			        "start": 232.59,
			        "word": " anything",
			      },
			    ],
			  },
			  {
			    "end": 236.73,
			    "start": 233.12,
			    "text": "He's simply transactional, anecdotal, episodic,",
			    "words": [
			      {
			        "end": 233.28,
			        "start": 233.12,
			        "word": " He",
			      },
			      {
			        "end": 233.67,
			        "start": 233.28,
			        "word": "'s",
			      },
			      {
			        "end": 233.99,
			        "start": 233.67,
			        "word": " simply",
			      },
			      {
			        "end": 234.7,
			        "start": 233.99,
			        "word": " transact",
			      },
			      {
			        "end": 235.13,
			        "start": 234.7,
			        "word": "ional",
			      },
			      {
			        "end": 235.36,
			        "start": 235.13,
			        "word": ",",
			      },
			      {
			        "end": 235.82,
			        "start": 235.36,
			        "word": " anecd",
			      },
			      {
			        "end": 236.01,
			        "start": 235.82,
			        "word": "otal",
			      },
			      {
			        "end": 236.18,
			        "start": 236.01,
			        "word": ",",
			      },
			      {
			        "end": 236.59,
			        "start": 236.18,
			        "word": " episod",
			      },
			      {
			        "end": 236.73,
			        "start": 236.59,
			        "word": "ic",
			      },
			    ],
			  },
			  {
			    "end": 240.21,
			    "start": 236.9,
			    "text": "and that's what these tariff policies have looked like in their rollout.",
			    "words": [
			      {
			        "end": 237.18,
			        "start": 236.9,
			        "word": " and",
			      },
			      {
			        "end": 237.29,
			        "start": 237.18,
			        "word": " that",
			      },
			      {
			        "end": 237.4,
			        "start": 237.29,
			        "word": "'s",
			      },
			      {
			        "end": 237.62,
			        "start": 237.4,
			        "word": " what",
			      },
			      {
			        "end": 237.93,
			        "start": 237.62,
			        "word": " these",
			      },
			      {
			        "end": 238.07,
			        "start": 237.93,
			        "word": " tar",
			      },
			      {
			        "end": 238.31,
			        "start": 238.07,
			        "word": "iff",
			      },
			      {
			        "end": 238.76,
			        "start": 238.31,
			        "word": " policies",
			      },
			      {
			        "end": 238.99,
			        "start": 238.76,
			        "word": " have",
			      },
			      {
			        "end": 239.28,
			        "start": 238.99,
			        "word": " looked",
			      },
			      {
			        "end": 239.49,
			        "start": 239.28,
			        "word": " like",
			      },
			      {
			        "end": 239.59,
			        "start": 239.49,
			        "word": " in",
			      },
			      {
			        "end": 239.85,
			        "start": 239.59,
			        "word": " their",
			      },
			      {
			        "end": 240.06,
			        "start": 239.85,
			        "word": " roll",
			      },
			      {
			        "end": 240.21,
			        "start": 240.06,
			        "word": "out",
			      },
			    ],
			  },
			  {
			    "end": 243.16,
			    "start": 240.4,
			    "text": "Richard, the New York Times described the market decline",
			    "words": [
			      {
			        "end": 241.41,
			        "start": 240.4,
			        "word": " Richard",
			      },
			      {
			        "end": 241.62,
			        "start": 241.41,
			        "word": ",",
			      },
			      {
			        "end": 241.72,
			        "start": 241.62,
			        "word": " the",
			      },
			      {
			        "end": 241.82,
			        "start": 241.72,
			        "word": " New",
			      },
			      {
			        "end": 241.98,
			        "start": 241.82,
			        "word": " York",
			      },
			      {
			        "end": 242.16,
			        "start": 241.98,
			        "word": " Times",
			      },
			      {
			        "end": 242.51,
			        "start": 242.16,
			        "word": " described",
			      },
			      {
			        "end": 242.63,
			        "start": 242.51,
			        "word": " the",
			      },
			      {
			        "end": 242.87,
			        "start": 242.63,
			        "word": " market",
			      },
			      {
			        "end": 243.16,
			        "start": 242.87,
			        "word": " decline",
			      },
			    ],
			  },
			  {
			    "end": 245.98,
			    "start": 243.16,
			    "text": "as on par with the early days of the COVID-19 pandemic.",
			    "words": [
			      {
			        "end": 243.25,
			        "start": 243.16,
			        "word": " as",
			      },
			      {
			        "end": 243.36,
			        "start": 243.25,
			        "word": " on",
			      },
			      {
			        "end": 243.53,
			        "start": 243.36,
			        "word": " par",
			      },
			      {
			        "end": 243.73,
			        "start": 243.53,
			        "word": " with",
			      },
			      {
			        "end": 243.89,
			        "start": 243.73,
			        "word": " the",
			      },
			      {
			        "end": 244.15,
			        "start": 243.89,
			        "word": " early",
			      },
			      {
			        "end": 244.4,
			        "start": 244.15,
			        "word": " days",
			      },
			      {
			        "end": 244.52,
			        "start": 244.4,
			        "word": " of",
			      },
			      {
			        "end": 244.71,
			        "start": 244.52,
			        "word": " the",
			      },
			      {
			        "end": 245.02,
			        "start": 244.71,
			        "word": " COVID",
			      },
			      {
			        "end": 245.08,
			        "start": 245.02,
			        "word": "-",
			      },
			      {
			        "end": 245.46,
			        "start": 245.08,
			        "word": "19",
			      },
			      {
			        "end": 245.98,
			        "start": 245.46,
			        "word": " pandemic",
			      },
			    ],
			  },
			  {
			    "end": 250.16,
			    "start": 246.18,
			    "text": "Does that signal that investors view this policy decision by the president",
			    "words": [
			      {
			        "end": 246.66,
			        "start": 246.18,
			        "word": " Does",
			      },
			      {
			        "end": 247.5,
			        "start": 246.66,
			        "word": " that",
			      },
			      {
			        "end": 247.86,
			        "start": 247.5,
			        "word": " signal",
			      },
			      {
			        "end": 248.03,
			        "start": 247.86,
			        "word": " that",
			      },
			      {
			        "end": 248.38,
			        "start": 248.03,
			        "word": " investors",
			      },
			      {
			        "end": 248.57,
			        "start": 248.38,
			        "word": " view",
			      },
			      {
			        "end": 248.76,
			        "start": 248.57,
			        "word": " this",
			      },
			      {
			        "end": 249.03,
			        "start": 248.76,
			        "word": " policy",
			      },
			      {
			        "end": 249.44,
			        "start": 249.03,
			        "word": " decision",
			      },
			      {
			        "end": 249.54,
			        "start": 249.44,
			        "word": " by",
			      },
			      {
			        "end": 249.69,
			        "start": 249.54,
			        "word": " the",
			      },
			      {
			        "end": 250.16,
			        "start": 249.69,
			        "word": " president",
			      },
			    ],
			  },
			  {
			    "end": 255.43,
			    "start": 250.16,
			    "text": "as equally volatile, as a deadly new disease with no known treatment or cure sweeping across the globe?",
			    "words": [
			      {
			        "end": 250.73,
			        "start": 250.16,
			        "word": " as",
			      },
			      {
			        "end": 250.95,
			        "start": 250.73,
			        "word": " equally",
			      },
			      {
			        "end": 251.68,
			        "start": 250.95,
			        "word": " volatile",
			      },
			      {
			        "end": 251.68,
			        "start": 251.68,
			        "word": ",",
			      },
			      {
			        "end": 251.84,
			        "start": 251.68,
			        "word": " as",
			      },
			      {
			        "end": 251.92,
			        "start": 251.84,
			        "word": " a",
			      },
			      {
			        "end": 252.41,
			        "start": 251.92,
			        "word": " deadly",
			      },
			      {
			        "end": 252.65,
			        "start": 252.41,
			        "word": " new",
			      },
			      {
			        "end": 253.26,
			        "start": 252.65,
			        "word": " disease",
			      },
			      {
			        "end": 253.43,
			        "start": 253.26,
			        "word": " with",
			      },
			      {
			        "end": 253.51,
			        "start": 253.43,
			        "word": " no",
			      },
			      {
			        "end": 253.73,
			        "start": 253.51,
			        "word": " known",
			      },
			      {
			        "end": 254.14,
			        "start": 253.73,
			        "word": " treatment",
			      },
			      {
			        "end": 254.23,
			        "start": 254.14,
			        "word": " or",
			      },
			      {
			        "end": 254.42,
			        "start": 254.23,
			        "word": " cure",
			      },
			      {
			        "end": 254.78,
			        "start": 254.42,
			        "word": " sweeping",
			      },
			      {
			        "end": 255.06,
			        "start": 254.78,
			        "word": " across",
			      },
			      {
			        "end": 255.25,
			        "start": 255.06,
			        "word": " the",
			      },
			      {
			        "end": 255.43,
			        "start": 255.25,
			        "word": " globe",
			      },
			    ],
			  },
			  {
			    "end": 260.49,
			    "start": 255.6,
			    "text": "I think there's a similarity because in both cases, we didn't know how it was going to turn out.",
			    "words": [
			      {
			        "end": 255.64,
			        "start": 255.6,
			        "word": " I",
			      },
			      {
			        "end": 255.92,
			        "start": 255.64,
			        "word": " think",
			      },
			      {
			        "end": 256.19,
			        "start": 255.92,
			        "word": " there",
			      },
			      {
			        "end": 256.29,
			        "start": 256.19,
			        "word": "'s",
			      },
			      {
			        "end": 256.34,
			        "start": 256.29,
			        "word": " a",
			      },
			      {
			        "end": 256.92,
			        "start": 256.34,
			        "word": " similarity",
			      },
			      {
			        "end": 257.59,
			        "start": 256.92,
			        "word": " because",
			      },
			      {
			        "end": 257.78,
			        "start": 257.59,
			        "word": " in",
			      },
			      {
			        "end": 258.16,
			        "start": 257.78,
			        "word": " both",
			      },
			      {
			        "end": 258.66,
			        "start": 258.16,
			        "word": " cases",
			      },
			      {
			        "end": 258.66,
			        "start": 258.66,
			        "word": ",",
			      },
			      {
			        "end": 258.75,
			        "start": 258.66,
			        "word": " we",
			      },
			      {
			        "end": 258.94,
			        "start": 258.75,
			        "word": " didn",
			      },
			      {
			        "end": 259.03,
			        "start": 258.94,
			        "word": "'t",
			      },
			      {
			        "end": 259.24,
			        "start": 259.03,
			        "word": " know",
			      },
			      {
			        "end": 259.4,
			        "start": 259.24,
			        "word": " how",
			      },
			      {
			        "end": 259.49,
			        "start": 259.4,
			        "word": " it",
			      },
			      {
			        "end": 259.62,
			        "start": 259.49,
			        "word": " was",
			      },
			      {
			        "end": 259.86,
			        "start": 259.62,
			        "word": " going",
			      },
			      {
			        "end": 260,
			        "start": 259.86,
			        "word": " to",
			      },
			      {
			        "end": 260.28,
			        "start": 260,
			        "word": " turn",
			      },
			      {
			        "end": 260.49,
			        "start": 260.28,
			        "word": " out",
			      },
			    ],
			  },
			  {
			    "end": 264.68,
			    "start": 260.7,
			    "text": "The only difference being that in one particular case in COVID,",
			    "words": [
			      {
			        "end": 261.18,
			        "start": 260.7,
			        "word": " The",
			      },
			      {
			        "end": 261.31,
			        "start": 261.18,
			        "word": " only",
			      },
			      {
			        "end": 262.2,
			        "start": 261.31,
			        "word": " difference",
			      },
			      {
			        "end": 262.66,
			        "start": 262.2,
			        "word": " being",
			      },
			      {
			        "end": 262.93,
			        "start": 262.66,
			        "word": " that",
			      },
			      {
			        "end": 263.06,
			        "start": 262.93,
			        "word": " in",
			      },
			      {
			        "end": 263.26,
			        "start": 263.06,
			        "word": " one",
			      },
			      {
			        "end": 263.94,
			        "start": 263.26,
			        "word": " particular",
			      },
			      {
			        "end": 264.21,
			        "start": 263.94,
			        "word": " case",
			      },
			      {
			        "end": 264.34,
			        "start": 264.21,
			        "word": " in",
			      },
			      {
			        "end": 264.68,
			        "start": 264.34,
			        "word": " COVID",
			      },
			    ],
			  },
			  {
			    "end": 268.44,
			    "start": 264.86,
			    "text": "there was this massive effort towards sorting it out",
			    "words": [
			      {
			        "end": 265.28,
			        "start": 264.86,
			        "word": " there",
			      },
			      {
			        "end": 265.4,
			        "start": 265.28,
			        "word": " was",
			      },
			      {
			        "end": 265.67,
			        "start": 265.4,
			        "word": " this",
			      },
			      {
			        "end": 266.14,
			        "start": 265.67,
			        "word": " massive",
			      },
			      {
			        "end": 266.56,
			        "start": 266.14,
			        "word": " effort",
			      },
			      {
			        "end": 267.38,
			        "start": 266.56,
			        "word": " towards",
			      },
			      {
			        "end": 267.94,
			        "start": 267.38,
			        "word": " sorting",
			      },
			      {
			        "end": 268.13,
			        "start": 267.94,
			        "word": " it",
			      },
			      {
			        "end": 268.44,
			        "start": 268.13,
			        "word": " out",
			      },
			    ],
			  },
			  {
			    "end": 271.34,
			    "start": 268.44,
			    "text": "and we had a vision of where he wanted to go.",
			    "words": [
			      {
			        "end": 268.63,
			        "start": 268.44,
			        "word": " and",
			      },
			      {
			        "end": 268.76,
			        "start": 268.63,
			        "word": " we",
			      },
			      {
			        "end": 268.95,
			        "start": 268.76,
			        "word": " had",
			      },
			      {
			        "end": 269.01,
			        "start": 268.95,
			        "word": " a",
			      },
			      {
			        "end": 269.44,
			        "start": 269.01,
			        "word": " vision",
			      },
			      {
			        "end": 269.75,
			        "start": 269.44,
			        "word": " of",
			      },
			      {
			        "end": 270.13,
			        "start": 269.75,
			        "word": " where",
			      },
			      {
			        "end": 270.33,
			        "start": 270.13,
			        "word": " he",
			      },
			      {
			        "end": 270.92,
			        "start": 270.33,
			        "word": " wanted",
			      },
			      {
			        "end": 271.12,
			        "start": 270.92,
			        "word": " to",
			      },
			      {
			        "end": 271.34,
			        "start": 271.12,
			        "word": " go",
			      },
			    ],
			  },
			  {
			    "end": 274.38,
			    "start": 271.34,
			    "text": "And everybody seemed to be moving in the same direction",
			    "words": [
			      {
			        "end": 271.62,
			        "start": 271.34,
			        "word": " And",
			      },
			      {
			        "end": 272.09,
			        "start": 271.62,
			        "word": " everybody",
			      },
			      {
			        "end": 272.48,
			        "start": 272.09,
			        "word": " seemed",
			      },
			      {
			        "end": 272.61,
			        "start": 272.48,
			        "word": " to",
			      },
			      {
			        "end": 272.76,
			        "start": 272.61,
			        "word": " be",
			      },
			      {
			        "end": 273,
			        "start": 272.76,
			        "word": " moving",
			      },
			      {
			        "end": 273.15,
			        "start": 273,
			        "word": " in",
			      },
			      {
			        "end": 273.37,
			        "start": 273.15,
			        "word": " the",
			      },
			      {
			        "end": 273.68,
			        "start": 273.37,
			        "word": " same",
			      },
			      {
			        "end": 274.38,
			        "start": 273.68,
			        "word": " direction",
			      },
			    ],
			  },
			  {
			    "end": 279.28,
			    "start": 274.38,
			    "text": "in this particular case because we don't know what the end game looks like.",
			    "words": [
			      {
			        "end": 274.52,
			        "start": 274.38,
			        "word": " in",
			      },
			      {
			        "end": 274.8,
			        "start": 274.52,
			        "word": " this",
			      },
			      {
			        "end": 275.5,
			        "start": 274.8,
			        "word": " particular",
			      },
			      {
			        "end": 275.8,
			        "start": 275.5,
			        "word": " case",
			      },
			      {
			        "end": 276.47,
			        "start": 275.8,
			        "word": " because",
			      },
			      {
			        "end": 276.66,
			        "start": 276.47,
			        "word": " we",
			      },
			      {
			        "end": 276.95,
			        "start": 276.66,
			        "word": " don",
			      },
			      {
			        "end": 277.14,
			        "start": 276.95,
			        "word": "'t",
			      },
			      {
			        "end": 277.54,
			        "start": 277.14,
			        "word": " know",
			      },
			      {
			        "end": 277.84,
			        "start": 277.54,
			        "word": " what",
			      },
			      {
			        "end": 278.07,
			        "start": 277.84,
			        "word": " the",
			      },
			      {
			        "end": 278.3,
			        "start": 278.07,
			        "word": " end",
			      },
			      {
			        "end": 278.75,
			        "start": 278.3,
			        "word": " game",
			      },
			      {
			        "end": 278.98,
			        "start": 278.75,
			        "word": " looks",
			      },
			      {
			        "end": 279.28,
			        "start": 278.98,
			        "word": " like",
			      },
			    ],
			  },
			  {
			    "end": 280.19,
			    "start": 279.54,
			    "text": "We don't know.",
			    "words": [
			      {
			        "end": 279.84,
			        "start": 279.54,
			        "word": " We",
			      },
			      {
			        "end": 279.84,
			        "start": 279.84,
			        "word": " don",
			      },
			      {
			        "end": 279.95,
			        "start": 279.84,
			        "word": "'t",
			      },
			      {
			        "end": 280.19,
			        "start": 279.95,
			        "word": " know",
			      },
			    ],
			  },
			  {
			    "end": 285.73,
			    "start": 280.38,
			    "text": "You see, even if, just for argument's sake, let's say the tariffs all come down to zero.",
			    "words": [
			      {
			        "end": 280.51,
			        "start": 280.38,
			        "word": " You",
			      },
			      {
			        "end": 280.64,
			        "start": 280.51,
			        "word": " see",
			      },
			      {
			        "end": 280.74,
			        "start": 280.64,
			        "word": ",",
			      },
			      {
			        "end": 281.18,
			        "start": 280.74,
			        "word": " even",
			      },
			      {
			        "end": 281.41,
			        "start": 281.18,
			        "word": " if",
			      },
			      {
			        "end": 281.62,
			        "start": 281.41,
			        "word": ",",
			      },
			      {
			        "end": 281.96,
			        "start": 281.62,
			        "word": " just",
			      },
			      {
			        "end": 282.04,
			        "start": 281.96,
			        "word": " for",
			      },
			      {
			        "end": 282.53,
			        "start": 282.04,
			        "word": " argument",
			      },
			      {
			        "end": 282.64,
			        "start": 282.53,
			        "word": "'s",
			      },
			      {
			        "end": 282.88,
			        "start": 282.64,
			        "word": " sake",
			      },
			      {
			        "end": 283.04,
			        "start": 282.88,
			        "word": ",",
			      },
			      {
			        "end": 283.41,
			        "start": 283.36,
			        "word": "",
			      },
			      {
			        "end": 283.55,
			        "start": 283.41,
			        "word": " let",
			      },
			      {
			        "end": 283.67,
			        "start": 283.55,
			        "word": "'s",
			      },
			      {
			        "end": 283.86,
			        "start": 283.67,
			        "word": " say",
			      },
			      {
			        "end": 284.05,
			        "start": 283.86,
			        "word": " the",
			      },
			      {
			        "end": 284.5,
			        "start": 284.05,
			        "word": " tariffs",
			      },
			      {
			        "end": 284.72,
			        "start": 284.5,
			        "word": " all",
			      },
			      {
			        "end": 285.02,
			        "start": 284.72,
			        "word": " come",
			      },
			      {
			        "end": 285.3,
			        "start": 285.02,
			        "word": " down",
			      },
			      {
			        "end": 285.44,
			        "start": 285.3,
			        "word": " to",
			      },
			      {
			        "end": 285.73,
			        "start": 285.44,
			        "word": " zero",
			      },
			    ],
			  },
			  {
			    "end": 288.43,
			    "start": 285.98,
			    "text": "Just humor me. They all come down to zero.",
			    "words": [
			      {
			        "end": 286.33,
			        "start": 285.98,
			        "word": " Just",
			      },
			      {
			        "end": 286.64,
			        "start": 286.33,
			        "word": " humor",
			      },
			      {
			        "end": 286.78,
			        "start": 286.64,
			        "word": " me",
			      },
			      {
			        "end": 287.02,
			        "start": 286.78,
			        "word": ".",
			      },
			      {
			        "end": 287.29,
			        "start": 287.02,
			        "word": " They",
			      },
			      {
			        "end": 287.49,
			        "start": 287.29,
			        "word": " all",
			      },
			      {
			        "end": 287.76,
			        "start": 287.49,
			        "word": " come",
			      },
			      {
			        "end": 288.03,
			        "start": 287.76,
			        "word": " down",
			      },
			      {
			        "end": 288.17,
			        "start": 288.03,
			        "word": " to",
			      },
			      {
			        "end": 288.43,
			        "start": 288.17,
			        "word": " zero",
			      },
			    ],
			  },
			  {
			    "end": 292.74,
			    "start": 288.66,
			    "text": "You've now got, you've still got the non-tariff barriers",
			    "words": [
			      {
			        "end": 289,
			        "start": 288.66,
			        "word": " You",
			      },
			      {
			        "end": 289.13,
			        "start": 289,
			        "word": "'ve",
			      },
			      {
			        "end": 289.35,
			        "start": 289.13,
			        "word": " now",
			      },
			      {
			        "end": 289.58,
			        "start": 289.35,
			        "word": " got",
			      },
			      {
			        "end": 289.74,
			        "start": 289.58,
			        "word": ",",
			      },
			      {
			        "end": 290.01,
			        "start": 289.74,
			        "word": " you",
			      },
			      {
			        "end": 290.34,
			        "start": 290.01,
			        "word": "'ve",
			      },
			      {
			        "end": 290.72,
			        "start": 290.34,
			        "word": " still",
			      },
			      {
			        "end": 291,
			        "start": 290.72,
			        "word": " got",
			      },
			      {
			        "end": 291.41,
			        "start": 291,
			        "word": " the",
			      },
			      {
			        "end": 291.48,
			        "start": 291.41,
			        "word": " non",
			      },
			      {
			        "end": 291.56,
			        "start": 291.48,
			        "word": "-",
			      },
			      {
			        "end": 291.8,
			        "start": 291.56,
			        "word": "tar",
			      },
			      {
			        "end": 292.04,
			        "start": 291.8,
			        "word": "iff",
			      },
			      {
			        "end": 292.74,
			        "start": 292.04,
			        "word": " barriers",
			      },
			    ],
			  },
			  {
			    "end": 296.36,
			    "start": 292.74,
			    "text": "which would prevent the U.S. from getting into new export markets.",
			    "words": [
			      {
			        "end": 293.04,
			        "start": 292.74,
			        "word": " which",
			      },
			      {
			        "end": 293.34,
			        "start": 293.04,
			        "word": " would",
			      },
			      {
			        "end": 293.75,
			        "start": 293.34,
			        "word": " prevent",
			      },
			      {
			        "end": 293.91,
			        "start": 293.75,
			        "word": " the",
			      },
			      {
			        "end": 294.17,
			        "start": 293.91,
			        "word": " U",
			      },
			      {
			        "end": 294.22,
			        "start": 294.17,
			        "word": ".",
			      },
			      {
			        "end": 294.28,
			        "start": 294.22,
			        "word": "S",
			      },
			      {
			        "end": 294.52,
			        "start": 294.28,
			        "word": ".",
			      },
			      {
			        "end": 294.67,
			        "start": 294.52,
			        "word": " from",
			      },
			      {
			        "end": 294.94,
			        "start": 294.67,
			        "word": " getting",
			      },
			      {
			        "end": 295.22,
			        "start": 294.94,
			        "word": " into",
			      },
			      {
			        "end": 295.43,
			        "start": 295.22,
			        "word": " new",
			      },
			      {
			        "end": 295.87,
			        "start": 295.43,
			        "word": " export",
			      },
			      {
			        "end": 296.36,
			        "start": 295.87,
			        "word": " markets",
			      },
			    ],
			  },
			  {
			    "end": 301.29,
			    "start": 296.36,
			    "text": "And you've got the offensive behavior that the U.S. has put on its allies.",
			    "words": [
			      {
			        "end": 296.81,
			        "start": 296.36,
			        "word": " And",
			      },
			      {
			        "end": 296.94,
			        "start": 296.81,
			        "word": " you",
			      },
			      {
			        "end": 297.23,
			        "start": 296.94,
			        "word": "'ve",
			      },
			      {
			        "end": 297.57,
			        "start": 297.23,
			        "word": " got",
			      },
			      {
			        "end": 297.73,
			        "start": 297.57,
			        "word": " the",
			      },
			      {
			        "end": 298.3,
			        "start": 297.73,
			        "word": " offensive",
			      },
			      {
			        "end": 298.82,
			        "start": 298.3,
			        "word": " behavior",
			      },
			      {
			        "end": 299.19,
			        "start": 298.82,
			        "word": " that",
			      },
			      {
			        "end": 299.52,
			        "start": 299.19,
			        "word": " the",
			      },
			      {
			        "end": 299.56,
			        "start": 299.52,
			        "word": " U",
			      },
			      {
			        "end": 299.83,
			        "start": 299.56,
			        "word": ".",
			      },
			      {
			        "end": 299.92,
			        "start": 299.83,
			        "word": "S",
			      },
			      {
			        "end": 300.22,
			        "start": 299.92,
			        "word": ".",
			      },
			      {
			        "end": 300.41,
			        "start": 300.22,
			        "word": " has",
			      },
			      {
			        "end": 300.6,
			        "start": 300.41,
			        "word": " put",
			      },
			      {
			        "end": 300.72,
			        "start": 300.6,
			        "word": " on",
			      },
			      {
			        "end": 300.91,
			        "start": 300.72,
			        "word": " its",
			      },
			      {
			        "end": 301.29,
			        "start": 300.91,
			        "word": " allies",
			      },
			    ],
			  },
			  {
			    "end": 305.74,
			    "start": 301.5,
			    "text": "You know, Elizabeth Warren was talking about it a second ago",
			    "words": [
			      {
			        "end": 302.07,
			        "start": 301.5,
			        "word": " You",
			      },
			      {
			        "end": 302.13,
			        "start": 302.07,
			        "word": " know",
			      },
			      {
			        "end": 302.32,
			        "start": 302.13,
			        "word": ",",
			      },
			      {
			        "end": 303.5,
			        "start": 302.32,
			        "word": " Elizabeth",
			      },
			      {
			        "end": 304.3,
			        "start": 303.5,
			        "word": " Warren",
			      },
			      {
			        "end": 304.44,
			        "start": 304.3,
			        "word": " was",
			      },
			      {
			        "end": 304.82,
			        "start": 304.44,
			        "word": " talking",
			      },
			      {
			        "end": 305.11,
			        "start": 304.82,
			        "word": " about",
			      },
			      {
			        "end": 305.19,
			        "start": 305.11,
			        "word": " it",
			      },
			      {
			        "end": 305.25,
			        "start": 305.19,
			        "word": " a",
			      },
			      {
			        "end": 305.57,
			        "start": 305.25,
			        "word": " second",
			      },
			      {
			        "end": 305.74,
			        "start": 305.57,
			        "word": " ago",
			      },
			    ],
			  },
			  {
			    "end": 309.93,
			    "start": 305.74,
			    "text": "and the ambassador knows you can't just have a trade policy in isolation.",
			    "words": [
			      {
			        "end": 305.88,
			        "start": 305.74,
			        "word": " and",
			      },
			      {
			        "end": 306.03,
			        "start": 305.88,
			        "word": " the",
			      },
			      {
			        "end": 306.48,
			        "start": 306.03,
			        "word": " ambassador",
			      },
			      {
			        "end": 306.74,
			        "start": 306.48,
			        "word": " knows",
			      },
			      {
			        "end": 307.18,
			        "start": 306.74,
			        "word": " you",
			      },
			      {
			        "end": 307.35,
			        "start": 307.18,
			        "word": " can",
			      },
			      {
			        "end": 307.48,
			        "start": 307.35,
			        "word": "'t",
			      },
			      {
			        "end": 307.92,
			        "start": 307.48,
			        "word": " just",
			      },
			      {
			        "end": 308.26,
			        "start": 307.92,
			        "word": " have",
			      },
			      {
			        "end": 308.33,
			        "start": 308.26,
			        "word": " a",
			      },
			      {
			        "end": 308.69,
			        "start": 308.33,
			        "word": " trade",
			      },
			      {
			        "end": 309.13,
			        "start": 308.69,
			        "word": " policy",
			      },
			      {
			        "end": 309.27,
			        "start": 309.13,
			        "word": " in",
			      },
			      {
			        "end": 309.93,
			        "start": 309.27,
			        "word": " isolation",
			      },
			    ],
			  },
			  {
			    "end": 313.94,
			    "start": 310.63,
			    "text": "not when you've told Canada you regard them as the 51st state",
			    "words": [
			      {
			        "end": 310.66,
			        "start": 310.63,
			        "word": " not",
			      },
			      {
			        "end": 310.9,
			        "start": 310.66,
			        "word": " when",
			      },
			      {
			        "end": 311.08,
			        "start": 310.9,
			        "word": " you",
			      },
			      {
			        "end": 311.24,
			        "start": 311.08,
			        "word": "'ve",
			      },
			      {
			        "end": 311.5,
			        "start": 311.24,
			        "word": " told",
			      },
			      {
			        "end": 311.96,
			        "start": 311.5,
			        "word": " Canada",
			      },
			      {
			        "end": 312.13,
			        "start": 311.96,
			        "word": " you",
			      },
			      {
			        "end": 312.48,
			        "start": 312.13,
			        "word": " regard",
			      },
			      {
			        "end": 312.72,
			        "start": 312.48,
			        "word": " them",
			      },
			      {
			        "end": 312.86,
			        "start": 312.72,
			        "word": " as",
			      },
			      {
			        "end": 313.02,
			        "start": 312.86,
			        "word": " the",
			      },
			      {
			        "end": 313.43,
			        "start": 313.02,
			        "word": " 51",
			      },
			      {
			        "end": 313.57,
			        "start": 313.43,
			        "word": "st",
			      },
			      {
			        "end": 313.94,
			        "start": 313.57,
			        "word": " state",
			      },
			    ],
			  },
			  {
			    "end": 318.01,
			    "start": 313.94,
			    "text": "and you've offended the EU talking about Denmark and Greenland.",
			    "words": [
			      {
			        "end": 314.26,
			        "start": 313.94,
			        "word": " and",
			      },
			      {
			        "end": 314.38,
			        "start": 314.26,
			        "word": " you",
			      },
			      {
			        "end": 314.6,
			        "start": 314.38,
			        "word": "'ve",
			      },
			      {
			        "end": 315.22,
			        "start": 314.6,
			        "word": " offended",
			      },
			      {
			        "end": 315.61,
			        "start": 315.22,
			        "word": " the",
			      },
			      {
			        "end": 315.88,
			        "start": 315.61,
			        "word": " EU",
			      },
			      {
			        "end": 316.32,
			        "start": 315.88,
			        "word": " talking",
			      },
			      {
			        "end": 316.63,
			        "start": 316.32,
			        "word": " about",
			      },
			      {
			        "end": 317.08,
			        "start": 316.63,
			        "word": " Denmark",
			      },
			      {
			        "end": 317.55,
			        "start": 317.08,
			        "word": " and",
			      },
			      {
			        "end": 317.7,
			        "start": 317.55,
			        "word": " Green",
			      },
			      {
			        "end": 318.01,
			        "start": 317.7,
			        "word": "land",
			      },
			    ],
			  },
			  {
			    "end": 323.48,
			    "start": 318.26,
			    "text": "Eventually, all these strands come together so that you don't have allies.",
			    "words": [
			      {
			        "end": 319.08,
			        "start": 318.26,
			        "word": " Eventually",
			      },
			      {
			        "end": 319.1,
			        "start": 319.08,
			        "word": ",",
			      },
			      {
			        "end": 319.62,
			        "start": 319.1,
			        "word": " all",
			      },
			      {
			        "end": 320.09,
			        "start": 319.62,
			        "word": " these",
			      },
			      {
			        "end": 320.96,
			        "start": 320.09,
			        "word": " strands",
			      },
			      {
			        "end": 321.34,
			        "start": 320.96,
			        "word": " come",
			      },
			      {
			        "end": 321.98,
			        "start": 321.34,
			        "word": " together",
			      },
			      {
			        "end": 322.1,
			        "start": 321.98,
			        "word": " so",
			      },
			      {
			        "end": 322.35,
			        "start": 322.1,
			        "word": " that",
			      },
			      {
			        "end": 322.54,
			        "start": 322.35,
			        "word": " you",
			      },
			      {
			        "end": 322.78,
			        "start": 322.54,
			        "word": " don",
			      },
			      {
			        "end": 322.85,
			        "start": 322.78,
			        "word": "'t",
			      },
			      {
			        "end": 323.15,
			        "start": 322.85,
			        "word": " have",
			      },
			      {
			        "end": 323.48,
			        "start": 323.15,
			        "word": " allies",
			      },
			    ],
			  },
			  {
			    "end": 325.69,
			    "start": 323.7,
			    "text": "You have people wanting to do a deal.",
			    "words": [
			      {
			        "end": 324.01,
			        "start": 323.7,
			        "word": " You",
			      },
			      {
			        "end": 324.31,
			        "start": 324.01,
			        "word": " have",
			      },
			      {
			        "end": 324.84,
			        "start": 324.31,
			        "word": " people",
			      },
			      {
			        "end": 325.16,
			        "start": 324.84,
			        "word": " wanting",
			      },
			      {
			        "end": 325.29,
			        "start": 325.16,
			        "word": " to",
			      },
			      {
			        "end": 325.4,
			        "start": 325.29,
			        "word": " do",
			      },
			      {
			        "end": 325.46,
			        "start": 325.4,
			        "word": " a",
			      },
			      {
			        "end": 325.69,
			        "start": 325.46,
			        "word": " deal",
			      },
			    ],
			  },
			  {
			    "end": 329.13,
			    "start": 325.88,
			    "text": "That's pure, unadulterated self-interest.",
			    "words": [
			      {
			        "end": 326.33,
			        "start": 325.88,
			        "word": " That",
			      },
			      {
			        "end": 326.65,
			        "start": 326.33,
			        "word": "'s",
			      },
			      {
			        "end": 327.02,
			        "start": 326.65,
			        "word": " pure",
			      },
			      {
			        "end": 327.04,
			        "start": 327.02,
			        "word": ",",
			      },
			      {
			        "end": 327.32,
			        "start": 327.04,
			        "word": " un",
			      },
			      {
			        "end": 327.38,
			        "start": 327.32,
			        "word": "ad",
			      },
			      {
			        "end": 327.58,
			        "start": 327.38,
			        "word": "ul",
			      },
			      {
			        "end": 327.81,
			        "start": 327.58,
			        "word": "ter",
			      },
			      {
			        "end": 328.18,
			        "start": 327.81,
			        "word": "ated",
			      },
			      {
			        "end": 328.48,
			        "start": 328.18,
			        "word": " self",
			      },
			      {
			        "end": 328.55,
			        "start": 328.48,
			        "word": "-",
			      },
			      {
			        "end": 329.13,
			        "start": 328.55,
			        "word": "interest",
			      },
			    ],
			  },
			  {
			    "end": 333.36,
			    "start": 329.4,
			    "text": "But what you don't have is the commonality of view and value",
			    "words": [
			      {
			        "end": 329.83,
			        "start": 329.4,
			        "word": " But",
			      },
			      {
			        "end": 329.91,
			        "start": 329.83,
			        "word": " what",
			      },
			      {
			        "end": 330.13,
			        "start": 329.91,
			        "word": " you",
			      },
			      {
			        "end": 330.36,
			        "start": 330.13,
			        "word": " don",
			      },
			      {
			        "end": 330.49,
			        "start": 330.36,
			        "word": "'t",
			      },
			      {
			        "end": 330.82,
			        "start": 330.49,
			        "word": " have",
			      },
			      {
			        "end": 330.99,
			        "start": 330.82,
			        "word": " is",
			      },
			      {
			        "end": 331.15,
			        "start": 330.99,
			        "word": " the",
			      },
			      {
			        "end": 331.49,
			        "start": 331.15,
			        "word": " common",
			      },
			      {
			        "end": 331.82,
			        "start": 331.49,
			        "word": "ality",
			      },
			      {
			        "end": 332.11,
			        "start": 331.82,
			        "word": " of",
			      },
			      {
			        "end": 332.47,
			        "start": 332.11,
			        "word": " view",
			      },
			      {
			        "end": 332.8,
			        "start": 332.47,
			        "word": " and",
			      },
			      {
			        "end": 333.36,
			        "start": 332.8,
			        "word": " value",
			      },
			    ],
			  },
			  {
			    "end": 334.79,
			    "start": 333.36,
			    "text": "that will get you over the line.",
			    "words": [
			      {
			        "end": 333.66,
			        "start": 333.36,
			        "word": " that",
			      },
			      {
			        "end": 333.86,
			        "start": 333.66,
			        "word": " will",
			      },
			      {
			        "end": 334.04,
			        "start": 333.86,
			        "word": " get",
			      },
			      {
			        "end": 334.24,
			        "start": 334.04,
			        "word": " you",
			      },
			      {
			        "end": 334.46,
			        "start": 334.24,
			        "word": " over",
			      },
			      {
			        "end": 334.6,
			        "start": 334.46,
			        "word": " the",
			      },
			      {
			        "end": 334.79,
			        "start": 334.6,
			        "word": " line",
			      },
			    ],
			  },
			  {
			    "end": 341.24,
			    "start": 334.94,
			    "text": "Ambassador, I mean, long-term, is it breaking of, you know, relationships",
			    "words": [
			      {
			        "end": 336.07,
			        "start": 334.94,
			        "word": " Ambassador",
			      },
			      {
			        "end": 336.3,
			        "start": 336.07,
			        "word": ",",
			      },
			      {
			        "end": 336.33,
			        "start": 336.3,
			        "word": " I",
			      },
			      {
			        "end": 336.45,
			        "start": 336.33,
			        "word": " mean",
			      },
			      {
			        "end": 336.52,
			        "start": 336.45,
			        "word": ",",
			      },
			      {
			        "end": 336.81,
			        "start": 336.52,
			        "word": " long",
			      },
			      {
			        "end": 336.88,
			        "start": 336.81,
			        "word": "-",
			      },
			      {
			        "end": 337.17,
			        "start": 336.88,
			        "word": "term",
			      },
			      {
			        "end": 337.34,
			        "start": 337.17,
			        "word": ",",
			      },
			      {
			        "end": 337.73,
			        "start": 337.34,
			        "word": " is",
			      },
			      {
			        "end": 338.58,
			        "start": 337.73,
			        "word": " it",
			      },
			      {
			        "end": 339.08,
			        "start": 338.58,
			        "word": " breaking",
			      },
			      {
			        "end": 339.25,
			        "start": 339.08,
			        "word": " of",
			      },
			      {
			        "end": 339.42,
			        "start": 339.25,
			        "word": ",",
			      },
			      {
			        "end": 339.67,
			        "start": 339.42,
			        "word": " you",
			      },
			      {
			        "end": 340.01,
			        "start": 339.67,
			        "word": " know",
			      },
			      {
			        "end": 340.2,
			        "start": 340.01,
			        "word": ",",
			      },
			      {
			        "end": 341.24,
			        "start": 340.2,
			        "word": " relationships",
			      },
			    ],
			  },
			  {
			    "end": 344.8,
			    "start": 341.24,
			    "text": "that have taken decades to form internationally?",
			    "words": [
			      {
			        "end": 341.66,
			        "start": 341.24,
			        "word": " that",
			      },
			      {
			        "end": 341.94,
			        "start": 341.66,
			        "word": " have",
			      },
			      {
			        "end": 342.38,
			        "start": 341.94,
			        "word": " taken",
			      },
			      {
			        "end": 343.02,
			        "start": 342.38,
			        "word": " decades",
			      },
			      {
			        "end": 343.18,
			        "start": 343.02,
			        "word": " to",
			      },
			      {
			        "end": 343.55,
			        "start": 343.18,
			        "word": " form",
			      },
			      {
			        "end": 344.8,
			        "start": 343.55,
			        "word": " internationally",
			      },
			    ],
			  },
			  {
			    "end": 349.46,
			    "start": 345.06,
			    "text": "Is there, I mean, is there a long-term cost on this, whatever the short-term impact is?",
			    "words": [
			      {
			        "end": 345.19,
			        "start": 345.06,
			        "word": " Is",
			      },
			      {
			        "end": 345.52,
			        "start": 345.19,
			        "word": " there",
			      },
			      {
			        "end": 345.65,
			        "start": 345.52,
			        "word": ",",
			      },
			      {
			        "end": 345.71,
			        "start": 345.65,
			        "word": " I",
			      },
			      {
			        "end": 345.98,
			        "start": 345.71,
			        "word": " mean",
			      },
			      {
			        "end": 346.14,
			        "start": 345.98,
			        "word": ",",
			      },
			      {
			        "end": 346.25,
			        "start": 346.14,
			        "word": " is",
			      },
			      {
			        "end": 346.54,
			        "start": 346.25,
			        "word": " there",
			      },
			      {
			        "end": 346.59,
			        "start": 346.54,
			        "word": " a",
			      },
			      {
			        "end": 346.85,
			        "start": 346.59,
			        "word": " long",
			      },
			      {
			        "end": 346.87,
			        "start": 346.85,
			        "word": "-",
			      },
			      {
			        "end": 347.1,
			        "start": 346.87,
			        "word": "term",
			      },
			      {
			        "end": 347.4,
			        "start": 347.1,
			        "word": " cost",
			      },
			      {
			        "end": 347.46,
			        "start": 347.4,
			        "word": " on",
			      },
			      {
			        "end": 347.62,
			        "start": 347.46,
			        "word": " this",
			      },
			      {
			        "end": 347.62,
			        "start": 347.62,
			        "word": ",",
			      },
			      {
			        "end": 347.98,
			        "start": 347.62,
			        "word": " whatever",
			      },
			      {
			        "end": 348.11,
			        "start": 347.98,
			        "word": " the",
			      },
			      {
			        "end": 348.33,
			        "start": 348.11,
			        "word": " short",
			      },
			      {
			        "end": 348.36,
			        "start": 348.33,
			        "word": "-",
			      },
			      {
			        "end": 348.58,
			        "start": 348.36,
			        "word": "term",
			      },
			      {
			        "end": 349.25,
			        "start": 348.58,
			        "word": " impact",
			      },
			      {
			        "end": 349.46,
			        "start": 349.25,
			        "word": " is",
			      },
			    ],
			  },
			  {
			    "end": 354.34,
			    "start": 351.3,
			    "text": "I think we've incurred a lot of the cost already,",
			    "words": [
			      {
			        "end": 351.64,
			        "start": 351.3,
			        "word": " I",
			      },
			      {
			        "end": 351.87,
			        "start": 351.64,
			        "word": " think",
			      },
			      {
			        "end": 352.06,
			        "start": 351.87,
			        "word": " we",
			      },
			      {
			        "end": 352.43,
			        "start": 352.06,
			        "word": "'ve",
			      },
			      {
			        "end": 352.83,
			        "start": 352.43,
			        "word": " incur",
			      },
			      {
			        "end": 353.16,
			        "start": 352.83,
			        "word": "red",
			      },
			      {
			        "end": 353.21,
			        "start": 353.16,
			        "word": " a",
			      },
			      {
			        "end": 353.38,
			        "start": 353.21,
			        "word": " lot",
			      },
			      {
			        "end": 353.49,
			        "start": 353.38,
			        "word": " of",
			      },
			      {
			        "end": 353.7,
			        "start": 353.49,
			        "word": " the",
			      },
			      {
			        "end": 353.9,
			        "start": 353.7,
			        "word": " cost",
			      },
			      {
			        "end": 354.34,
			        "start": 353.9,
			        "word": " already",
			      },
			    ],
			  },
			  {
			    "end": 358.46,
			    "start": 354.34,
			    "text": "not just because of Trump's tariff policy, but what he's done on Ukraine,",
			    "words": [
			      {
			        "end": 354.51,
			        "start": 354.34,
			        "word": " not",
			      },
			      {
			        "end": 354.74,
			        "start": 354.51,
			        "word": " just",
			      },
			      {
			        "end": 355.16,
			        "start": 354.74,
			        "word": " because",
			      },
			      {
			        "end": 355.34,
			        "start": 355.16,
			        "word": " of",
			      },
			      {
			        "end": 355.57,
			        "start": 355.34,
			        "word": " Trump",
			      },
			      {
			        "end": 355.66,
			        "start": 355.57,
			        "word": "'s",
			      },
			      {
			        "end": 355.85,
			        "start": 355.66,
			        "word": " tar",
			      },
			      {
			        "end": 356.06,
			        "start": 355.85,
			        "word": "iff",
			      },
			      {
			        "end": 356.44,
			        "start": 356.06,
			        "word": " policy",
			      },
			      {
			        "end": 356.44,
			        "start": 356.44,
			        "word": ",",
			      },
			      {
			        "end": 356.75,
			        "start": 356.44,
			        "word": " but",
			      },
			      {
			        "end": 357.28,
			        "start": 356.75,
			        "word": " what",
			      },
			      {
			        "end": 357.36,
			        "start": 357.28,
			        "word": " he",
			      },
			      {
			        "end": 357.56,
			        "start": 357.36,
			        "word": "'s",
			      },
			      {
			        "end": 358,
			        "start": 357.56,
			        "word": " done",
			      },
			      {
			        "end": 358.1,
			        "start": 358,
			        "word": " on",
			      },
			      {
			        "end": 358.46,
			        "start": 358.1,
			        "word": " Ukraine",
			      },
			    ],
			  },
			  {
			    "end": 361.81,
			    "start": 358.56,
			    "text": "what he's done to NATO, what he threatens to do to NATO.",
			    "words": [
			      {
			        "end": 358.93,
			        "start": 358.56,
			        "word": " what",
			      },
			      {
			        "end": 359.11,
			        "start": 358.93,
			        "word": " he",
			      },
			      {
			        "end": 359.3,
			        "start": 359.11,
			        "word": "'s",
			      },
			      {
			        "end": 359.66,
			        "start": 359.3,
			        "word": " done",
			      },
			      {
			        "end": 359.84,
			        "start": 359.66,
			        "word": " to",
			      },
			      {
			        "end": 360.21,
			        "start": 359.84,
			        "word": " NATO",
			      },
			      {
			        "end": 360.42,
			        "start": 360.21,
			        "word": ",",
			      },
			      {
			        "end": 360.62,
			        "start": 360.42,
			        "word": " what",
			      },
			      {
			        "end": 360.71,
			        "start": 360.62,
			        "word": " he",
			      },
			      {
			        "end": 361.2,
			        "start": 360.71,
			        "word": " threatens",
			      },
			      {
			        "end": 361.34,
			        "start": 361.2,
			        "word": " to",
			      },
			      {
			        "end": 361.44,
			        "start": 361.34,
			        "word": " do",
			      },
			      {
			        "end": 361.56,
			        "start": 361.44,
			        "word": " to",
			      },
			      {
			        "end": 361.81,
			        "start": 361.56,
			        "word": " NATO",
			      },
			    ],
			  },
			  {
			    "end": 366.38,
			    "start": 362.02,
			    "text": "I can see all over the world, from Europe to the Far East,",
			    "words": [
			      {
			        "end": 362.14,
			        "start": 362.02,
			        "word": " I",
			      },
			      {
			        "end": 362.61,
			        "start": 362.14,
			        "word": " can",
			      },
			      {
			        "end": 362.86,
			        "start": 362.61,
			        "word": " see",
			      },
			      {
			        "end": 363.22,
			        "start": 362.86,
			        "word": " all",
			      },
			      {
			        "end": 363.71,
			        "start": 363.22,
			        "word": " over",
			      },
			      {
			        "end": 364.07,
			        "start": 363.71,
			        "word": " the",
			      },
			      {
			        "end": 364.72,
			        "start": 364.07,
			        "word": " world",
			      },
			      {
			        "end": 364.72,
			        "start": 364.72,
			        "word": ",",
			      },
			      {
			        "end": 365.02,
			        "start": 364.72,
			        "word": " from",
			      },
			      {
			        "end": 365.47,
			        "start": 365.02,
			        "word": " Europe",
			      },
			      {
			        "end": 365.74,
			        "start": 365.47,
			        "word": " to",
			      },
			      {
			        "end": 365.85,
			        "start": 365.74,
			        "word": " the",
			      },
			      {
			        "end": 366.08,
			        "start": 365.85,
			        "word": " Far",
			      },
			      {
			        "end": 366.38,
			        "start": 366.08,
			        "word": " East",
			      },
			    ],
			  },
			  {
			    "end": 371.06,
			    "start": 366.56,
			    "text": "that decades of effort by many, many Americans, in government and out of government,",
			    "words": [
			      {
			        "end": 367.03,
			        "start": 366.56,
			        "word": " that",
			      },
			      {
			        "end": 367.64,
			        "start": 367.03,
			        "word": " decades",
			      },
			      {
			        "end": 367.83,
			        "start": 367.64,
			        "word": " of",
			      },
			      {
			        "end": 368.44,
			        "start": 367.83,
			        "word": " effort",
			      },
			      {
			        "end": 368.6,
			        "start": 368.44,
			        "word": " by",
			      },
			      {
			        "end": 368.81,
			        "start": 368.6,
			        "word": " many",
			      },
			      {
			        "end": 368.93,
			        "start": 368.81,
			        "word": ",",
			      },
			      {
			        "end": 369.18,
			        "start": 368.93,
			        "word": " many",
			      },
			      {
			        "end": 369.79,
			        "start": 369.18,
			        "word": " Americans",
			      },
			      {
			        "end": 369.84,
			        "start": 369.79,
			        "word": ",",
			      },
			      {
			        "end": 369.95,
			        "start": 369.84,
			        "word": " in",
			      },
			      {
			        "end": 370.5,
			        "start": 369.95,
			        "word": " government",
			      },
			      {
			        "end": 370.59,
			        "start": 370.5,
			        "word": " and",
			      },
			      {
			        "end": 370.68,
			        "start": 370.59,
			        "word": " out",
			      },
			      {
			        "end": 370.74,
			        "start": 370.68,
			        "word": " of",
			      },
			      {
			        "end": 371.06,
			        "start": 370.74,
			        "word": " government",
			      },
			    ],
			  },
			  {
			    "end": 375.71,
			    "start": 371.16,
			    "text": "to build up relationships of trust, of good faith, of reliance, of dependability,",
			    "words": [
			      {
			        "end": 371.3,
			        "start": 371.16,
			        "word": " to",
			      },
			      {
			        "end": 371.56,
			        "start": 371.3,
			        "word": " build",
			      },
			      {
			        "end": 371.67,
			        "start": 371.56,
			        "word": " up",
			      },
			      {
			        "end": 372.46,
			        "start": 371.67,
			        "word": " relationships",
			      },
			      {
			        "end": 372.64,
			        "start": 372.46,
			        "word": " of",
			      },
			      {
			        "end": 373.1,
			        "start": 372.64,
			        "word": " trust",
			      },
			      {
			        "end": 373.35,
			        "start": 373.1,
			        "word": ",",
			      },
			      {
			        "end": 373.42,
			        "start": 373.35,
			        "word": " of",
			      },
			      {
			        "end": 373.67,
			        "start": 373.42,
			        "word": " good",
			      },
			      {
			        "end": 373.98,
			        "start": 373.67,
			        "word": " faith",
			      },
			      {
			        "end": 374.12,
			        "start": 373.98,
			        "word": ",",
			      },
			      {
			        "end": 374.32,
			        "start": 374.12,
			        "word": " of",
			      },
			      {
			        "end": 374.42,
			        "start": 374.32,
			        "word": " rel",
			      },
			      {
			        "end": 374.72,
			        "start": 374.42,
			        "word": "iance",
			      },
			      {
			        "end": 374.86,
			        "start": 374.72,
			        "word": ",",
			      },
			      {
			        "end": 374.97,
			        "start": 374.86,
			        "word": " of",
			      },
			      {
			        "end": 375.31,
			        "start": 374.97,
			        "word": " depend",
			      },
			      {
			        "end": 375.71,
			        "start": 375.31,
			        "word": "ability",
			      },
			    ],
			  },
			  {
			    "end": 379.8,
			    "start": 375.84,
			    "text": "that the United States deserves to be the leader of the world",
			    "words": [
			      {
			        "end": 376.14,
			        "start": 375.84,
			        "word": " that",
			      },
			      {
			        "end": 376.35,
			        "start": 376.14,
			        "word": " the",
			      },
			      {
			        "end": 376.79,
			        "start": 376.35,
			        "word": " United",
			      },
			      {
			        "end": 377.26,
			        "start": 376.79,
			        "word": " States",
			      },
			      {
			        "end": 378.09,
			        "start": 377.26,
			        "word": " deserves",
			      },
			      {
			        "end": 378.27,
			        "start": 378.09,
			        "word": " to",
			      },
			      {
			        "end": 378.48,
			        "start": 378.27,
			        "word": " be",
			      },
			      {
			        "end": 378.89,
			        "start": 378.48,
			        "word": " the",
			      },
			      {
			        "end": 379.26,
			        "start": 378.89,
			        "word": " leader",
			      },
			      {
			        "end": 379.36,
			        "start": 379.26,
			        "word": " of",
			      },
			      {
			        "end": 379.52,
			        "start": 379.36,
			        "word": " the",
			      },
			      {
			        "end": 379.8,
			        "start": 379.52,
			        "word": " world",
			      },
			    ],
			  },
			  {
			    "end": 383.68,
			    "start": 379.8,
			    "text": "to protect its own interests, not because of economic relations,",
			    "words": [
			      {
			        "end": 379.96,
			        "start": 379.8,
			        "word": " to",
			      },
			      {
			        "end": 380.31,
			        "start": 379.96,
			        "word": " protect",
			      },
			      {
			        "end": 380.51,
			        "start": 380.31,
			        "word": " its",
			      },
			      {
			        "end": 380.65,
			        "start": 380.51,
			        "word": " own",
			      },
			      {
			        "end": 381.17,
			        "start": 380.65,
			        "word": " interests",
			      },
			      {
			        "end": 381.32,
			        "start": 381.17,
			        "word": ",",
			      },
			      {
			        "end": 381.65,
			        "start": 381.32,
			        "word": " not",
			      },
			      {
			        "end": 382.23,
			        "start": 381.65,
			        "word": " because",
			      },
			      {
			        "end": 382.63,
			        "start": 382.23,
			        "word": " of",
			      },
			      {
			        "end": 383.01,
			        "start": 382.63,
			        "word": " economic",
			      },
			      {
			        "end": 383.68,
			        "start": 383.01,
			        "word": " relations",
			      },
			    ],
			  },
			  {
			    "end": 385.12,
			    "start": 383.68,
			    "text": "but because people trust us.",
			    "words": [
			      {
			        "end": 383.86,
			        "start": 383.68,
			        "word": " but",
			      },
			      {
			        "end": 384.3,
			        "start": 383.86,
			        "word": " because",
			      },
			      {
			        "end": 384.67,
			        "start": 384.3,
			        "word": " people",
			      },
			      {
			        "end": 384.98,
			        "start": 384.67,
			        "word": " trust",
			      },
			      {
			        "end": 385.12,
			        "start": 384.98,
			        "word": " us",
			      },
			    ],
			  },
			  {
			    "end": 388.97,
			    "start": 385.32,
			    "text": "They don't trust us anymore, and it's going to be very hard to rebuild.",
			    "words": [
			      {
			        "end": 385.54,
			        "start": 385.32,
			        "word": " They",
			      },
			      {
			        "end": 385.7,
			        "start": 385.54,
			        "word": " don",
			      },
			      {
			        "end": 385.81,
			        "start": 385.7,
			        "word": "'t",
			      },
			      {
			        "end": 386.15,
			        "start": 385.81,
			        "word": " trust",
			      },
			      {
			        "end": 386.2,
			        "start": 386.15,
			        "word": " us",
			      },
			      {
			        "end": 386.62,
			        "start": 386.2,
			        "word": " anymore",
			      },
			      {
			        "end": 386.62,
			        "start": 386.62,
			        "word": ",",
			      },
			      {
			        "end": 386.85,
			        "start": 386.62,
			        "word": " and",
			      },
			      {
			        "end": 387,
			        "start": 386.85,
			        "word": " it",
			      },
			      {
			        "end": 387.18,
			        "start": 387,
			        "word": "'s",
			      },
			      {
			        "end": 387.53,
			        "start": 387.18,
			        "word": " going",
			      },
			      {
			        "end": 387.68,
			        "start": 387.53,
			        "word": " to",
			      },
			      {
			        "end": 387.86,
			        "start": 387.68,
			        "word": " be",
			      },
			      {
			        "end": 388.12,
			        "start": 387.86,
			        "word": " very",
			      },
			      {
			        "end": 388.38,
			        "start": 388.12,
			        "word": " hard",
			      },
			      {
			        "end": 388.51,
			        "start": 388.38,
			        "word": " to",
			      },
			      {
			        "end": 388.97,
			        "start": 388.51,
			        "word": " rebuild",
			      },
			    ],
			  },
			  {
			    "end": 394.78,
			    "start": 389.2,
			    "text": "This is the wide open gap that we have left for the Chinese to drive through,",
			    "words": [
			      {
			        "end": 389.84,
			        "start": 389.2,
			        "word": " This",
			      },
			      {
			        "end": 390.26,
			        "start": 389.84,
			        "word": " is",
			      },
			      {
			        "end": 390.63,
			        "start": 390.26,
			        "word": " the",
			      },
			      {
			        "end": 391.28,
			        "start": 390.63,
			        "word": " wide",
			      },
			      {
			        "end": 391.96,
			        "start": 391.28,
			        "word": " open",
			      },
			      {
			        "end": 392.44,
			        "start": 391.96,
			        "word": " gap",
			      },
			      {
			        "end": 392.65,
			        "start": 392.44,
			        "word": " that",
			      },
			      {
			        "end": 392.75,
			        "start": 392.65,
			        "word": " we",
			      },
			      {
			        "end": 392.96,
			        "start": 392.75,
			        "word": " have",
			      },
			      {
			        "end": 393.2,
			        "start": 392.96,
			        "word": " left",
			      },
			      {
			        "end": 393.36,
			        "start": 393.2,
			        "word": " for",
			      },
			      {
			        "end": 393.54,
			        "start": 393.36,
			        "word": " the",
			      },
			      {
			        "end": 393.92,
			        "start": 393.54,
			        "word": " Chinese",
			      },
			      {
			        "end": 394.04,
			        "start": 393.92,
			        "word": " to",
			      },
			      {
			        "end": 394.35,
			        "start": 394.04,
			        "word": " drive",
			      },
			      {
			        "end": 394.78,
			        "start": 394.35,
			        "word": " through",
			      },
			    ],
			  },
			  {
			    "end": 396.59,
			    "start": 394.92,
			    "text": "and I think they're moving along.",
			    "words": [
			      {
			        "end": 395.11,
			        "start": 394.92,
			        "word": " and",
			      },
			      {
			        "end": 395.17,
			        "start": 395.11,
			        "word": " I",
			      },
			      {
			        "end": 395.48,
			        "start": 395.17,
			        "word": " think",
			      },
			      {
			        "end": 395.73,
			        "start": 395.48,
			        "word": " they",
			      },
			      {
			        "end": 395.94,
			        "start": 395.73,
			        "word": "'re",
			      },
			      {
			        "end": 396.28,
			        "start": 395.94,
			        "word": " moving",
			      },
			      {
			        "end": 396.59,
			        "start": 396.28,
			        "word": " along",
			      },
			    ],
			  },
			  {
			    "end": 399.49,
			    "start": 396.82,
			    "text": "Trump simply doesn't grasp any of that.",
			    "words": [
			      {
			        "end": 397.28,
			        "start": 396.82,
			        "word": " Trump",
			      },
			      {
			        "end": 397.83,
			        "start": 397.28,
			        "word": " simply",
			      },
			      {
			        "end": 398.29,
			        "start": 397.83,
			        "word": " doesn",
			      },
			      {
			        "end": 398.54,
			        "start": 398.29,
			        "word": "'t",
			      },
			      {
			        "end": 398.96,
			        "start": 398.54,
			        "word": " grasp",
			      },
			      {
			        "end": 399.16,
			        "start": 398.96,
			        "word": " any",
			      },
			      {
			        "end": 399.26,
			        "start": 399.16,
			        "word": " of",
			      },
			      {
			        "end": 399.49,
			        "start": 399.26,
			        "word": " that",
			      },
			    ],
			  },
			  {
			    "end": 403.65,
			    "start": 399.68,
			    "text": "He doesn't understand alliances as long-term propositions.",
			    "words": [
			      {
			        "end": 399.81,
			        "start": 399.68,
			        "word": " He",
			      },
			      {
			        "end": 400.14,
			        "start": 399.81,
			        "word": " doesn",
			      },
			      {
			        "end": 400.27,
			        "start": 400.14,
			        "word": "'t",
			      },
			      {
			        "end": 400.96,
			        "start": 400.27,
			        "word": " understand",
			      },
			      {
			        "end": 401.68,
			        "start": 400.96,
			        "word": " alliances",
			      },
			      {
			        "end": 401.85,
			        "start": 401.68,
			        "word": " as",
			      },
			      {
			        "end": 402.19,
			        "start": 401.85,
			        "word": " long",
			      },
			      {
			        "end": 402.27,
			        "start": 402.19,
			        "word": "-",
			      },
			      {
			        "end": 402.61,
			        "start": 402.27,
			        "word": "term",
			      },
			      {
			        "end": 403.13,
			        "start": 402.61,
			        "word": " propos",
			      },
			      {
			        "end": 403.65,
			        "start": 403.13,
			        "word": "itions",
			      },
			    ],
			  },
			  {
			    "end": 407.21,
			    "start": 403.94,
			    "text": "He just sees them as one transaction after the other,",
			    "words": [
			      {
			        "end": 404.32,
			        "start": 403.94,
			        "word": " He",
			      },
			      {
			        "end": 404.46,
			        "start": 404.32,
			        "word": " just",
			      },
			      {
			        "end": 404.74,
			        "start": 404.46,
			        "word": " sees",
			      },
			      {
			        "end": 405.08,
			        "start": 404.74,
			        "word": " them",
			      },
			      {
			        "end": 405.08,
			        "start": 405.08,
			        "word": "",
			      },
			      {
			        "end": 405.26,
			        "start": 405.08,
			        "word": " as",
			      },
			      {
			        "end": 405.43,
			        "start": 405.26,
			        "word": " one",
			      },
			      {
			        "end": 406.22,
			        "start": 405.43,
			        "word": " transaction",
			      },
			      {
			        "end": 406.6,
			        "start": 406.22,
			        "word": " after",
			      },
			      {
			        "end": 406.83,
			        "start": 406.6,
			        "word": " the",
			      },
			      {
			        "end": 407.21,
			        "start": 406.83,
			        "word": " other",
			      },
			    ],
			  },
			  {
			    "end": 408.6,
			    "start": 407.38,
			    "text": "and that's not the way they work.",
			    "words": [
			      {
			        "end": 407.53,
			        "start": 407.38,
			        "word": " and",
			      },
			      {
			        "end": 407.73,
			        "start": 407.53,
			        "word": " that",
			      },
			      {
			        "end": 407.83,
			        "start": 407.73,
			        "word": "'s",
			      },
			      {
			        "end": 408.07,
			        "start": 407.83,
			        "word": " not",
			      },
			      {
			        "end": 408.15,
			        "start": 408.07,
			        "word": " the",
			      },
			      {
			        "end": 408.3,
			        "start": 408.15,
			        "word": " way",
			      },
			      {
			        "end": 408.45,
			        "start": 408.3,
			        "word": " they",
			      },
			      {
			        "end": 408.6,
			        "start": 408.45,
			        "word": " work",
			      },
			    ],
			  },
			  {
			    "end": 411.25,
			    "start": 408.72,
			    "text": "Starting off tonight, Senator Elizabeth Warren, Democrat of Massachusetts,",
			    "words": [
			      {
			        "end": 409.03,
			        "start": 408.72,
			        "word": " Starting",
			      },
			      {
			        "end": 409.14,
			        "start": 409.03,
			        "word": " off",
			      },
			      {
			        "end": 409.41,
			        "start": 409.14,
			        "word": " tonight",
			      },
			      {
			        "end": 409.5,
			        "start": 409.41,
			        "word": ",",
			      },
			      {
			        "end": 409.74,
			        "start": 409.5,
			        "word": " Senator",
			      },
			      {
			        "end": 410.07,
			        "start": 409.74,
			        "word": " Elizabeth",
			      },
			      {
			        "end": 410.26,
			        "start": 410.07,
			        "word": " Warren",
			      },
			      {
			        "end": 410.34,
			        "start": 410.26,
			        "word": ",",
			      },
			      {
			        "end": 410.66,
			        "start": 410.34,
			        "word": " Democrat",
			      },
			      {
			        "end": 410.74,
			        "start": 410.66,
			        "word": " of",
			      },
			      {
			        "end": 411.25,
			        "start": 410.74,
			        "word": " Massachusetts",
			      },
			    ],
			  },
			  {
			    "end": 414.97,
			    "start": 411.34,
			    "text": "who sits in the finance community and is the ranking member on the banking committee.",
			    "words": [
			      {
			        "end": 411.48,
			        "start": 411.34,
			        "word": " who",
			      },
			      {
			        "end": 411.67,
			        "start": 411.48,
			        "word": " sits",
			      },
			      {
			        "end": 411.76,
			        "start": 411.67,
			        "word": " in",
			      },
			      {
			        "end": 411.9,
			        "start": 411.76,
			        "word": " the",
			      },
			      {
			        "end": 412.23,
			        "start": 411.9,
			        "word": " finance",
			      },
			      {
			        "end": 412.68,
			        "start": 412.23,
			        "word": " community",
			      },
			      {
			        "end": 412.81,
			        "start": 412.68,
			        "word": " and",
			      },
			      {
			        "end": 412.89,
			        "start": 412.81,
			        "word": " is",
			      },
			      {
			        "end": 413.02,
			        "start": 412.89,
			        "word": " the",
			      },
			      {
			        "end": 413.33,
			        "start": 413.02,
			        "word": " ranking",
			      },
			      {
			        "end": 413.62,
			        "start": 413.33,
			        "word": " member",
			      },
			      {
			        "end": 413.74,
			        "start": 413.62,
			        "word": " on",
			      },
			      {
			        "end": 414.07,
			        "start": 413.74,
			        "word": " the",
			      },
			      {
			        "end": 414.39,
			        "start": 414.07,
			        "word": " banking",
			      },
			      {
			        "end": 414.97,
			        "start": 414.39,
			        "word": " committee",
			      },
			    ],
			  },
			  {
			    "end": 420.51,
			    "start": 415.18,
			    "text": "So with these tariffs about to go into effect in China overnight, around midnight,",
			    "words": [
			      {
			        "end": 415.36,
			        "start": 415.18,
			        "word": " So",
			      },
			      {
			        "end": 415.72,
			        "start": 415.36,
			        "word": " with",
			      },
			      {
			        "end": 416.43,
			        "start": 415.72,
			        "word": " these",
			      },
			      {
			        "end": 416.8,
			        "start": 416.43,
			        "word": " tariffs",
			      },
			      {
			        "end": 417.13,
			        "start": 416.8,
			        "word": " about",
			      },
			      {
			        "end": 417.26,
			        "start": 417.13,
			        "word": " to",
			      },
			      {
			        "end": 417.39,
			        "start": 417.26,
			        "word": " go",
			      },
			      {
			        "end": 417.65,
			        "start": 417.39,
			        "word": " into",
			      },
			      {
			        "end": 418.08,
			        "start": 417.65,
			        "word": " effect",
			      },
			      {
			        "end": 418.29,
			        "start": 418.08,
			        "word": " in",
			      },
			      {
			        "end": 418.78,
			        "start": 418.29,
			        "word": " China",
			      },
			      {
			        "end": 419.67,
			        "start": 418.78,
			        "word": " overnight",
			      },
			      {
			        "end": 419.88,
			        "start": 419.67,
			        "word": ",",
			      },
			      {
			        "end": 420.15,
			        "start": 419.88,
			        "word": " around",
			      },
			      {
			        "end": 420.51,
			        "start": 420.15,
			        "word": " midnight",
			      },
			    ],
			  },
			  {
			    "end": 423.34,
			    "start": 420.6,
			    "text": "how much more economic pain are we all facing?",
			    "words": [
			      {
			        "end": 420.76,
			        "start": 420.6,
			        "word": " how",
			      },
			      {
			        "end": 420.98,
			        "start": 420.76,
			        "word": " much",
			      },
			      {
			        "end": 421.22,
			        "start": 420.98,
			        "word": " more",
			      },
			      {
			        "end": 421.7,
			        "start": 421.22,
			        "word": " economic",
			      },
			      {
			        "end": 421.9,
			        "start": 421.7,
			        "word": " pain",
			      },
			      {
			        "end": 422.21,
			        "start": 421.9,
			        "word": " are",
			      },
			      {
			        "end": 422.52,
			        "start": 422.21,
			        "word": " we",
			      },
			      {
			        "end": 422.72,
			        "start": 422.52,
			        "word": " all",
			      },
			      {
			        "end": 423.34,
			        "start": 422.72,
			        "word": " facing",
			      },
			    ],
			  },
			  {
			    "end": 425.64,
			    "start": 423.66,
			    "text": "Well, we're facing a lot of pain,",
			    "words": [
			      {
			        "end": 424.01,
			        "start": 423.66,
			        "word": " Well",
			      },
			      {
			        "end": 424.05,
			        "start": 424.01,
			        "word": ",",
			      },
			      {
			        "end": 424.38,
			        "start": 424.05,
			        "word": " we",
			      },
			      {
			        "end": 424.39,
			        "start": 424.38,
			        "word": "'re",
			      },
			      {
			        "end": 424.8,
			        "start": 424.39,
			        "word": " facing",
			      },
			      {
			        "end": 424.88,
			        "start": 424.8,
			        "word": " a",
			      },
			      {
			        "end": 425.13,
			        "start": 424.88,
			        "word": " lot",
			      },
			      {
			        "end": 425.34,
			        "start": 425.13,
			        "word": " of",
			      },
			      {
			        "end": 425.64,
			        "start": 425.34,
			        "word": " pain",
			      },
			    ],
			  },
			  {
			    "end": 430.95,
			    "start": 425.64,
			    "text": "and understand, we look at the Dow Jones and the S&P because those are easy numbers to track,",
			    "words": [
			      {
			        "end": 425.83,
			        "start": 425.64,
			        "word": " and",
			      },
			      {
			        "end": 426.41,
			        "start": 425.83,
			        "word": " understand",
			      },
			      {
			        "end": 426.54,
			        "start": 426.41,
			        "word": ",",
			      },
			      {
			        "end": 426.59,
			        "start": 426.54,
			        "word": " we",
			      },
			      {
			        "end": 427.25,
			        "start": 426.59,
			        "word": " look",
			      },
			      {
			        "end": 427.31,
			        "start": 427.25,
			        "word": " at",
			      },
			      {
			        "end": 427.6,
			        "start": 427.31,
			        "word": " the",
			      },
			      {
			        "end": 427.89,
			        "start": 427.6,
			        "word": " Dow",
			      },
			      {
			        "end": 428.4,
			        "start": 427.89,
			        "word": " Jones",
			      },
			      {
			        "end": 428.62,
			        "start": 428.4,
			        "word": " and",
			      },
			      {
			        "end": 428.84,
			        "start": 428.62,
			        "word": " the",
			      },
			      {
			        "end": 428.98,
			        "start": 428.84,
			        "word": " S",
			      },
			      {
			        "end": 429.01,
			        "start": 428.98,
			        "word": "&",
			      },
			      {
			        "end": 429.08,
			        "start": 429.01,
			        "word": "P",
			      },
			      {
			        "end": 429.38,
			        "start": 429.08,
			        "word": " because",
			      },
			      {
			        "end": 429.6,
			        "start": 429.38,
			        "word": " those",
			      },
			      {
			        "end": 429.8,
			        "start": 429.6,
			        "word": " are",
			      },
			      {
			        "end": 430.06,
			        "start": 429.8,
			        "word": " easy",
			      },
			      {
			        "end": 430.46,
			        "start": 430.06,
			        "word": " numbers",
			      },
			      {
			        "end": 430.6,
			        "start": 430.46,
			        "word": " to",
			      },
			      {
			        "end": 430.95,
			        "start": 430.6,
			        "word": " track",
			      },
			    ],
			  },
			  {
			    "end": 434.87,
			    "start": 431.1,
			    "text": "but the reality is this is already being felt by families,",
			    "words": [
			      {
			        "end": 431.7,
			        "start": 431.1,
			        "word": " but",
			      },
			      {
			        "end": 431.81,
			        "start": 431.7,
			        "word": " the",
			      },
			      {
			        "end": 432.54,
			        "start": 431.81,
			        "word": " reality",
			      },
			      {
			        "end": 432.78,
			        "start": 432.54,
			        "word": " is",
			      },
			      {
			        "end": 432.98,
			        "start": 432.78,
			        "word": " this",
			      },
			      {
			        "end": 433.08,
			        "start": 432.98,
			        "word": " is",
			      },
			      {
			        "end": 433.46,
			        "start": 433.08,
			        "word": " already",
			      },
			      {
			        "end": 433.91,
			        "start": 433.46,
			        "word": " being",
			      },
			      {
			        "end": 434.28,
			        "start": 433.91,
			        "word": " felt",
			      },
			      {
			        "end": 434.36,
			        "start": 434.28,
			        "word": "",
			      },
			      {
			        "end": 434.4,
			        "start": 434.36,
			        "word": " by",
			      },
			      {
			        "end": 434.87,
			        "start": 434.4,
			        "word": " families",
			      },
			    ],
			  },
			  {
			    "end": 437.29,
			    "start": 435,
			    "text": "partly because prices are going up.",
			    "words": [
			      {
			        "end": 435.61,
			        "start": 435,
			        "word": " partly",
			      },
			      {
			        "end": 436.24,
			        "start": 435.61,
			        "word": " because",
			      },
			      {
			        "end": 436.66,
			        "start": 436.24,
			        "word": " prices",
			      },
			      {
			        "end": 436.85,
			        "start": 436.66,
			        "word": " are",
			      },
			      {
			        "end": 437.17,
			        "start": 436.85,
			        "word": " going",
			      },
			      {
			        "end": 437.29,
			        "start": 437.17,
			        "word": " up",
			      },
			    ],
			  },
			  {
			    "end": 442.7,
			    "start": 437.5,
			    "text": "We already see the soft data showing us that there are a lot of companies out there saying,",
			    "words": [
			      {
			        "end": 437.73,
			        "start": 437.5,
			        "word": " We",
			      },
			      {
			        "end": 438.53,
			        "start": 437.73,
			        "word": " already",
			      },
			      {
			        "end": 438.88,
			        "start": 438.53,
			        "word": " see",
			      },
			      {
			        "end": 439.15,
			        "start": 438.88,
			        "word": " the",
			      },
			      {
			        "end": 439.51,
			        "start": 439.15,
			        "word": " soft",
			      },
			      {
			        "end": 439.88,
			        "start": 439.51,
			        "word": " data",
			      },
			      {
			        "end": 440.41,
			        "start": 439.88,
			        "word": " showing",
			      },
			      {
			        "end": 440.58,
			        "start": 440.41,
			        "word": " us",
			      },
			      {
			        "end": 441.14,
			        "start": 440.58,
			        "word": " that",
			      },
			      {
			        "end": 441.31,
			        "start": 441.14,
			        "word": " there",
			      },
			      {
			        "end": 441.48,
			        "start": 441.31,
			        "word": " are",
			      },
			      {
			        "end": 441.53,
			        "start": 441.48,
			        "word": " a",
			      },
			      {
			        "end": 441.68,
			        "start": 441.53,
			        "word": " lot",
			      },
			      {
			        "end": 441.77,
			        "start": 441.68,
			        "word": " of",
			      },
			      {
			        "end": 442.17,
			        "start": 441.77,
			        "word": " companies",
			      },
			      {
			        "end": 442.3,
			        "start": 442.17,
			        "word": " out",
			      },
			      {
			        "end": 442.54,
			        "start": 442.3,
			        "word": " there",
			      },
			      {
			        "end": 442.7,
			        "start": 442.54,
			        "word": " saying",
			      },
			    ],
			  },
			  {
			    "end": 446.16,
			    "start": 442.76,
			    "text": "you know what, we can tell what's coming, we're just going to raise our prices now,",
			    "words": [
			      {
			        "end": 442.88,
			        "start": 442.76,
			        "word": " you",
			      },
			      {
			        "end": 443.04,
			        "start": 442.88,
			        "word": " know",
			      },
			      {
			        "end": 443.2,
			        "start": 443.04,
			        "word": " what",
			      },
			      {
			        "end": 443.28,
			        "start": 443.2,
			        "word": ",",
			      },
			      {
			        "end": 443.58,
			        "start": 443.28,
			        "word": " we",
			      },
			      {
			        "end": 443.64,
			        "start": 443.58,
			        "word": " can",
			      },
			      {
			        "end": 443.82,
			        "start": 443.64,
			        "word": " tell",
			      },
			      {
			        "end": 444.06,
			        "start": 443.82,
			        "word": " what",
			      },
			      {
			        "end": 444.17,
			        "start": 444.06,
			        "word": "'s",
			      },
			      {
			        "end": 444.52,
			        "start": 444.17,
			        "word": " coming",
			      },
			      {
			        "end": 444.66,
			        "start": 444.52,
			        "word": ",",
			      },
			      {
			        "end": 444.73,
			        "start": 444.66,
			        "word": " we",
			      },
			      {
			        "end": 444.83,
			        "start": 444.73,
			        "word": "'re",
			      },
			      {
			        "end": 444.97,
			        "start": 444.83,
			        "word": " just",
			      },
			      {
			        "end": 445.16,
			        "start": 444.97,
			        "word": " going",
			      },
			      {
			        "end": 445.24,
			        "start": 445.16,
			        "word": " to",
			      },
			      {
			        "end": 445.44,
			        "start": 445.24,
			        "word": " raise",
			      },
			      {
			        "end": 445.73,
			        "start": 445.44,
			        "word": " our",
			      },
			      {
			        "end": 445.98,
			        "start": 445.73,
			        "word": " prices",
			      },
			      {
			        "end": 446.16,
			        "start": 445.98,
			        "word": " now",
			      },
			    ],
			  },
			  {
			    "end": 449.02,
			    "start": 446.3,
			    "text": "and then if we need to raise them more later, we will do that.",
			    "words": [
			      {
			        "end": 446.41,
			        "start": 446.3,
			        "word": " and",
			      },
			      {
			        "end": 446.56,
			        "start": 446.41,
			        "word": " then",
			      },
			      {
			        "end": 446.65,
			        "start": 446.56,
			        "word": " if",
			      },
			      {
			        "end": 446.72,
			        "start": 446.65,
			        "word": " we",
			      },
			      {
			        "end": 446.9,
			        "start": 446.72,
			        "word": " need",
			      },
			      {
			        "end": 446.98,
			        "start": 446.9,
			        "word": " to",
			      },
			      {
			        "end": 447.18,
			        "start": 446.98,
			        "word": " raise",
			      },
			      {
			        "end": 447.36,
			        "start": 447.18,
			        "word": " them",
			      },
			      {
			        "end": 447.54,
			        "start": 447.36,
			        "word": " more",
			      },
			      {
			        "end": 447.76,
			        "start": 447.54,
			        "word": " later",
			      },
			      {
			        "end": 447.86,
			        "start": 447.76,
			        "word": ",",
			      },
			      {
			        "end": 448.04,
			        "start": 447.86,
			        "word": " we",
			      },
			      {
			        "end": 448.52,
			        "start": 448.04,
			        "word": " will",
			      },
			      {
			        "end": 448.63,
			        "start": 448.52,
			        "word": " do",
			      },
			      {
			        "end": 449.02,
			        "start": 448.63,
			        "word": " that",
			      },
			    ],
			  },
			  {
			    "end": 454.62,
			    "start": 449.34,
			    "text": "The head of the Fed said on Friday that this kind of across-the-board tariffs",
			    "words": [
			      {
			        "end": 449.71,
			        "start": 449.34,
			        "word": " The",
			      },
			      {
			        "end": 450.06,
			        "start": 449.71,
			        "word": " head",
			      },
			      {
			        "end": 450.26,
			        "start": 450.06,
			        "word": " of",
			      },
			      {
			        "end": 450.63,
			        "start": 450.26,
			        "word": " the",
			      },
			      {
			        "end": 450.9,
			        "start": 450.63,
			        "word": " Fed",
			      },
			      {
			        "end": 451.26,
			        "start": 450.9,
			        "word": " said",
			      },
			      {
			        "end": 451.44,
			        "start": 451.26,
			        "word": " on",
			      },
			      {
			        "end": 452,
			        "start": 451.44,
			        "word": " Friday",
			      },
			      {
			        "end": 452.56,
			        "start": 452,
			        "word": " that",
			      },
			      {
			        "end": 452.73,
			        "start": 452.56,
			        "word": " this",
			      },
			      {
			        "end": 452.96,
			        "start": 452.73,
			        "word": " kind",
			      },
			      {
			        "end": 453.14,
			        "start": 452.96,
			        "word": " of",
			      },
			      {
			        "end": 453.52,
			        "start": 453.14,
			        "word": " across",
			      },
			      {
			        "end": 453.57,
			        "start": 453.52,
			        "word": "-",
			      },
			      {
			        "end": 453.77,
			        "start": 453.57,
			        "word": "the",
			      },
			      {
			        "end": 453.83,
			        "start": 453.77,
			        "word": "-",
			      },
			      {
			        "end": 454.17,
			        "start": 453.83,
			        "word": "board",
			      },
			      {
			        "end": 454.62,
			        "start": 454.17,
			        "word": " tariffs",
			      },
			    ],
			  },
			  {
			    "end": 457.05,
			    "start": 454.62,
			    "text": "means prices will go up for families.",
			    "words": [
			      {
			        "end": 455.12,
			        "start": 454.62,
			        "word": " means",
			      },
			      {
			        "end": 455.72,
			        "start": 455.12,
			        "word": " prices",
			      },
			      {
			        "end": 456.05,
			        "start": 455.72,
			        "word": " will",
			      },
			      {
			        "end": 456.22,
			        "start": 456.05,
			        "word": " go",
			      },
			      {
			        "end": 456.56,
			        "start": 456.22,
			        "word": " up",
			      },
			      {
			        "end": 456.71,
			        "start": 456.56,
			        "word": " for",
			      },
			      {
			        "end": 457.05,
			        "start": 456.71,
			        "word": " families",
			      },
			    ],
			  },
			  {
			    "end": 458.47,
			    "start": 457.2,
			    "text": "We'll see more inflation.",
			    "words": [
			      {
			        "end": 457.34,
			        "start": 457.2,
			        "word": " We",
			      },
			      {
			        "end": 457.52,
			        "start": 457.34,
			        "word": "'ll",
			      },
			      {
			        "end": 457.68,
			        "start": 457.52,
			        "word": " see",
			      },
			      {
			        "end": 457.92,
			        "start": 457.68,
			        "word": " more",
			      },
			      {
			        "end": 458.47,
			        "start": 457.92,
			        "word": " inflation",
			      },
			    ],
			  },
			  {
			    "end": 463.43,
			    "start": 458.68,
			    "text": "But he also pointed out unemployment is likely to go up as well.",
			    "words": [
			      {
			        "end": 458.96,
			        "start": 458.68,
			        "word": " But",
			      },
			      {
			        "end": 459.3,
			        "start": 458.96,
			        "word": " he",
			      },
			      {
			        "end": 459.55,
			        "start": 459.3,
			        "word": " also",
			      },
			      {
			        "end": 460.23,
			        "start": 459.55,
			        "word": " pointed",
			      },
			      {
			        "end": 460.54,
			        "start": 460.23,
			        "word": " out",
			      },
			      {
			        "end": 460.82,
			        "start": 460.54,
			        "word": "",
			      },
			      {
			        "end": 461.56,
			        "start": 460.82,
			        "word": " unemployment",
			      },
			      {
			        "end": 462.1,
			        "start": 461.56,
			        "word": " is",
			      },
			      {
			        "end": 462.46,
			        "start": 462.1,
			        "word": " likely",
			      },
			      {
			        "end": 462.66,
			        "start": 462.46,
			        "word": " to",
			      },
			      {
			        "end": 462.78,
			        "start": 462.66,
			        "word": " go",
			      },
			      {
			        "end": 462.94,
			        "start": 462.78,
			        "word": " up",
			      },
			      {
			        "end": 463.21,
			        "start": 462.94,
			        "word": " as",
			      },
			      {
			        "end": 463.43,
			        "start": 463.21,
			        "word": " well",
			      },
			    ],
			  },
			  {
			    "end": 466.41,
			    "start": 463.72,
			    "text": "So there are going to be people who lose their jobs.",
			    "words": [
			      {
			        "end": 464.26,
			        "start": 463.72,
			        "word": " So",
			      },
			      {
			        "end": 464.41,
			        "start": 464.26,
			        "word": " there",
			      },
			      {
			        "end": 464.73,
			        "start": 464.41,
			        "word": " are",
			      },
			      {
			        "end": 464.9,
			        "start": 464.73,
			        "word": " going",
			      },
			      {
			        "end": 465.07,
			        "start": 464.9,
			        "word": " to",
			      },
			      {
			        "end": 465.2,
			        "start": 465.07,
			        "word": " be",
			      },
			      {
			        "end": 465.56,
			        "start": 465.2,
			        "word": " people",
			      },
			      {
			        "end": 465.74,
			        "start": 465.56,
			        "word": " who",
			      },
			      {
			        "end": 466,
			        "start": 465.74,
			        "word": " lose",
			      },
			      {
			        "end": 466.22,
			        "start": 466,
			        "word": " their",
			      },
			      {
			        "end": 466.41,
			        "start": 466.22,
			        "word": " jobs",
			      },
			    ],
			  },
			  {
			    "end": 471.2,
			    "start": 466.56,
			    "text": "We talk about this recession, Goldman Sachs, J.P. Morgan.",
			    "words": [
			      {
			        "end": 466.7,
			        "start": 466.56,
			        "word": " We",
			      },
			      {
			        "end": 466.95,
			        "start": 466.7,
			        "word": " talk",
			      },
			      {
			        "end": 467.35,
			        "start": 466.95,
			        "word": " about",
			      },
			      {
			        "end": 467.56,
			        "start": 467.35,
			        "word": " this",
			      },
			      {
			        "end": 468.93,
			        "start": 467.56,
			        "word": " recession",
			      },
			      {
			        "end": 469.24,
			        "start": 468.93,
			        "word": ",",
			      },
			      {
			        "end": 469.9,
			        "start": 469.24,
			        "word": " Goldman",
			      },
			      {
			        "end": 470.27,
			        "start": 469.9,
			        "word": " Sach",
			      },
			      {
			        "end": 470.36,
			        "start": 470.27,
			        "word": "s",
			      },
			      {
			        "end": 470.56,
			        "start": 470.36,
			        "word": ",",
			      },
			      {
			        "end": 470.61,
			        "start": 470.56,
			        "word": " J",
			      },
			      {
			        "end": 470.74,
			        "start": 470.61,
			        "word": ".",
			      },
			      {
			        "end": 470.78,
			        "start": 470.74,
			        "word": "P",
			      },
			      {
			        "end": 470.93,
			        "start": 470.78,
			        "word": ".",
			      },
			      {
			        "end": 471.2,
			        "start": 470.93,
			        "word": " Morgan",
			      },
			    ],
			  },
			  {
			    "end": 471.91,
			    "start": 471.38,
			    "text": "Do you think it's likely?",
			    "words": [
			      {
			        "end": 471.43,
			        "start": 471.38,
			        "word": " Do",
			      },
			      {
			        "end": 471.5,
			        "start": 471.43,
			        "word": " you",
			      },
			      {
			        "end": 471.64,
			        "start": 471.5,
			        "word": " think",
			      },
			      {
			        "end": 471.69,
			        "start": 471.64,
			        "word": " it",
			      },
			      {
			        "end": 471.74,
			        "start": 471.69,
			        "word": "'s",
			      },
			      {
			        "end": 471.91,
			        "start": 471.74,
			        "word": " likely",
			      },
			    ],
			  },
			  {
			    "end": 476.72,
			    "start": 472.02,
			    "text": "Oh, I think that all of the signs, the economic signs, are flashing red.",
			    "words": [
			      {
			        "end": 472.37,
			        "start": 472.02,
			        "word": " Oh",
			      },
			      {
			        "end": 472.41,
			        "start": 472.37,
			        "word": ",",
			      },
			      {
			        "end": 472.46,
			        "start": 472.41,
			        "word": " I",
			      },
			      {
			        "end": 472.97,
			        "start": 472.46,
			        "word": " think",
			      },
			      {
			        "end": 473.26,
			        "start": 472.97,
			        "word": " that",
			      },
			      {
			        "end": 473.92,
			        "start": 473.26,
			        "word": " all",
			      },
			      {
			        "end": 474.07,
			        "start": 473.92,
			        "word": " of",
			      },
			      {
			        "end": 474.22,
			        "start": 474.07,
			        "word": " the",
			      },
			      {
			        "end": 474.46,
			        "start": 474.22,
			        "word": " signs",
			      },
			      {
			        "end": 474.56,
			        "start": 474.46,
			        "word": ",",
			      },
			      {
			        "end": 474.77,
			        "start": 474.56,
			        "word": " the",
			      },
			      {
			        "end": 475.32,
			        "start": 474.77,
			        "word": " economic",
			      },
			      {
			        "end": 475.68,
			        "start": 475.32,
			        "word": " signs",
			      },
			      {
			        "end": 475.68,
			        "start": 475.68,
			        "word": ",",
			      },
			      {
			        "end": 475.92,
			        "start": 475.68,
			        "word": " are",
			      },
			      {
			        "end": 476.5,
			        "start": 475.92,
			        "word": " flashing",
			      },
			      {
			        "end": 476.72,
			        "start": 476.5,
			        "word": " red",
			      },
			    ],
			  },
			  {
			    "end": 484.21,
			    "start": 477.41,
			    "text": "And remember, we lost 700,000 jobs a month in the last recession.",
			    "words": [
			      {
			        "end": 477.45,
			        "start": 477.41,
			        "word": " And",
			      },
			      {
			        "end": 477.81,
			        "start": 477.45,
			        "word": " remember",
			      },
			      {
			        "end": 477.92,
			        "start": 477.81,
			        "word": ",",
			      },
			      {
			        "end": 478.43,
			        "start": 477.92,
			        "word": " we",
			      },
			      {
			        "end": 479.15,
			        "start": 478.43,
			        "word": " lost",
			      },
			      {
			        "end": 480.19,
			        "start": 479.15,
			        "word": " 700",
			      },
			      {
			        "end": 480.35,
			        "start": 480.19,
			        "word": ",",
			      },
			      {
			        "end": 481.64,
			        "start": 480.35,
			        "word": "000",
			      },
			      {
			        "end": 482.36,
			        "start": 481.64,
			        "word": " jobs",
			      },
			      {
			        "end": 482.55,
			        "start": 482.36,
			        "word": " a",
			      },
			      {
			        "end": 483.12,
			        "start": 482.55,
			        "word": " month",
			      },
			      {
			        "end": 483.36,
			        "start": 483.12,
			        "word": " in",
			      },
			      {
			        "end": 483.42,
			        "start": 483.36,
			        "word": " the",
			      },
			      {
			        "end": 483.66,
			        "start": 483.42,
			        "word": " last",
			      },
			      {
			        "end": 484.21,
			        "start": 483.66,
			        "word": " recession",
			      },
			    ],
			  },
			  {
			    "end": 487.44,
			    "start": 484.42,
			    "text": "Recessions are not just things that happen on Wall Street.",
			    "words": [
			      {
			        "end": 484.58,
			        "start": 484.42,
			        "word": " Re",
			      },
			      {
			        "end": 484.95,
			        "start": 484.58,
			        "word": "cess",
			      },
			      {
			        "end": 485.24,
			        "start": 484.95,
			        "word": "ions",
			      },
			      {
			        "end": 485.49,
			        "start": 485.24,
			        "word": " are",
			      },
			      {
			        "end": 485.81,
			        "start": 485.49,
			        "word": " not",
			      },
			      {
			        "end": 485.96,
			        "start": 485.81,
			        "word": " just",
			      },
			      {
			        "end": 486.22,
			        "start": 485.96,
			        "word": " things",
			      },
			      {
			        "end": 486.44,
			        "start": 486.22,
			        "word": " that",
			      },
			      {
			        "end": 486.77,
			        "start": 486.44,
			        "word": " happen",
			      },
			      {
			        "end": 486.88,
			        "start": 486.77,
			        "word": " on",
			      },
			      {
			        "end": 487.1,
			        "start": 486.88,
			        "word": " Wall",
			      },
			      {
			        "end": 487.44,
			        "start": 487.1,
			        "word": " Street",
			      },
			    ],
			  },
			  {
			    "end": 490.92,
			    "start": 487.62,
			    "text": "They are things that happen family by family by family.",
			    "words": [
			      {
			        "end": 488.14,
			        "start": 487.62,
			        "word": " They",
			      },
			      {
			        "end": 488.16,
			        "start": 488.14,
			        "word": " are",
			      },
			      {
			        "end": 488.6,
			        "start": 488.16,
			        "word": " things",
			      },
			      {
			        "end": 488.8,
			        "start": 488.6,
			        "word": " that",
			      },
			      {
			        "end": 489.1,
			        "start": 488.8,
			        "word": " happen",
			      },
			      {
			        "end": 489.59,
			        "start": 489.1,
			        "word": " family",
			      },
			      {
			        "end": 489.75,
			        "start": 489.59,
			        "word": " by",
			      },
			      {
			        "end": 490.24,
			        "start": 489.75,
			        "word": " family",
			      },
			      {
			        "end": 490.4,
			        "start": 490.24,
			        "word": " by",
			      },
			      {
			        "end": 490.92,
			        "start": 490.4,
			        "word": " family",
			      },
			    ],
			  },
			  {
			    "end": 493.54,
			    "start": 490.92,
			    "text": "And there are people who never recover from that.",
			    "words": [
			      {
			        "end": 491.04,
			        "start": 490.92,
			        "word": " And",
			      },
			      {
			        "end": 491.25,
			        "start": 491.04,
			        "word": " there",
			      },
			      {
			        "end": 491.41,
			        "start": 491.25,
			        "word": " are",
			      },
			      {
			        "end": 491.64,
			        "start": 491.41,
			        "word": " people",
			      },
			      {
			        "end": 492.25,
			        "start": 491.64,
			        "word": " who",
			      },
			      {
			        "end": 492.29,
			        "start": 492.25,
			        "word": " never",
			      },
			      {
			        "end": 493.18,
			        "start": 492.29,
			        "word": " recover",
			      },
			      {
			        "end": 493.2,
			        "start": 493.18,
			        "word": " from",
			      },
			      {
			        "end": 493.54,
			        "start": 493.2,
			        "word": " that",
			      },
			    ],
			  },
			  {
			    "end": 501.2,
			    "start": 493.8,
			    "text": "Do you also see long-term damage done to just the credibility, the confidence, the stability",
			    "words": [
			      {
			        "end": 493.89,
			        "start": 493.8,
			        "word": " Do",
			      },
			      {
			        "end": 494.02,
			        "start": 493.89,
			        "word": " you",
			      },
			      {
			        "end": 494.2,
			        "start": 494.02,
			        "word": " also",
			      },
			      {
			        "end": 494.36,
			        "start": 494.2,
			        "word": " see",
			      },
			      {
			        "end": 494.8,
			        "start": 494.36,
			        "word": " long",
			      },
			      {
			        "end": 494.93,
			        "start": 494.8,
			        "word": "-",
			      },
			      {
			        "end": 495.38,
			        "start": 494.93,
			        "word": "term",
			      },
			      {
			        "end": 496.85,
			        "start": 495.38,
			        "word": " damage",
			      },
			      {
			        "end": 497.6,
			        "start": 496.85,
			        "word": " done",
			      },
			      {
			        "end": 497.8,
			        "start": 497.6,
			        "word": " to",
			      },
			      {
			        "end": 498.02,
			        "start": 497.8,
			        "word": " just",
			      },
			      {
			        "end": 498.18,
			        "start": 498.02,
			        "word": " the",
			      },
			      {
			        "end": 498.71,
			        "start": 498.18,
			        "word": " credibility",
			      },
			      {
			        "end": 498.82,
			        "start": 498.71,
			        "word": ",",
			      },
			      {
			        "end": 499.08,
			        "start": 498.82,
			        "word": " the",
			      },
			      {
			        "end": 500,
			        "start": 499.08,
			        "word": " confidence",
			      },
			      {
			        "end": 500.12,
			        "start": 500,
			        "word": ",",
			      },
			      {
			        "end": 500.39,
			        "start": 500.12,
			        "word": " the",
			      },
			      {
			        "end": 501.2,
			        "start": 500.39,
			        "word": " stability",
			      },
			    ],
			  },
			  {
			    "end": 502.34,
			    "start": 501.2,
			    "text": "of the United States?",
			    "words": [
			      {
			        "end": 501.52,
			        "start": 501.2,
			        "word": " of",
			      },
			      {
			        "end": 501.64,
			        "start": 501.52,
			        "word": " the",
			      },
			      {
			        "end": 501.99,
			        "start": 501.64,
			        "word": " United",
			      },
			      {
			        "end": 502.34,
			        "start": 501.99,
			        "word": " States",
			      },
			    ],
			  },
			  {
			    "end": 504.36,
			    "start": 502.52,
			    "text": "Boy, you have put your finger on it.",
			    "words": [
			      {
			        "end": 502.81,
			        "start": 502.52,
			        "word": " Boy",
			      },
			      {
			        "end": 502.96,
			        "start": 502.81,
			        "word": ",",
			      },
			      {
			        "end": 503.12,
			        "start": 502.96,
			        "word": " you",
			      },
			      {
			        "end": 503.48,
			        "start": 503.12,
			        "word": " have",
			      },
			      {
			        "end": 503.66,
			        "start": 503.48,
			        "word": " put",
			      },
			      {
			        "end": 503.94,
			        "start": 503.66,
			        "word": " your",
			      },
			      {
			        "end": 504.14,
			        "start": 503.94,
			        "word": " finger",
			      },
			      {
			        "end": 504.25,
			        "start": 504.14,
			        "word": " on",
			      },
			      {
			        "end": 504.36,
			        "start": 504.25,
			        "word": " it",
			      },
			    ],
			  },
			  {
			    "end": 510.54,
			    "start": 504.54,
			    "text": "Yes. Donald Trump is demonstrating that so long as he is president,",
			    "words": [
			      {
			        "end": 504.82,
			        "start": 504.54,
			        "word": " Yes",
			      },
			      {
			        "end": 505.1,
			        "start": 504.82,
			        "word": ".",
			      },
			      {
			        "end": 506.1,
			        "start": 506.1,
			        "word": "",
			      },
			      {
			        "end": 506.78,
			        "start": 506.1,
			        "word": " Donald",
			      },
			      {
			        "end": 507.52,
			        "start": 506.78,
			        "word": " Trump",
			      },
			      {
			        "end": 507.59,
			        "start": 507.52,
			        "word": " is",
			      },
			      {
			        "end": 508.58,
			        "start": 507.59,
			        "word": " demonstrating",
			      },
			      {
			        "end": 508.93,
			        "start": 508.58,
			        "word": " that",
			      },
			      {
			        "end": 509.1,
			        "start": 508.93,
			        "word": " so",
			      },
			      {
			        "end": 509.44,
			        "start": 509.1,
			        "word": " long",
			      },
			      {
			        "end": 509.63,
			        "start": 509.44,
			        "word": " as",
			      },
			      {
			        "end": 509.82,
			        "start": 509.63,
			        "word": " he",
			      },
			      {
			        "end": 510.24,
			        "start": 509.82,
			        "word": " is",
			      },
			      {
			        "end": 510.54,
			        "start": 510.24,
			        "word": " president",
			      },
			    ],
			  },
			  {
			    "end": 513.68,
			    "start": 510.64,
			    "text": "the United States is not a reliable trading partner,",
			    "words": [
			      {
			        "end": 511.06,
			        "start": 510.64,
			        "word": " the",
			      },
			      {
			        "end": 511.31,
			        "start": 511.06,
			        "word": " United",
			      },
			      {
			        "end": 511.78,
			        "start": 511.31,
			        "word": " States",
			      },
			      {
			        "end": 511.91,
			        "start": 511.78,
			        "word": " is",
			      },
			      {
			        "end": 512.11,
			        "start": 511.91,
			        "word": " not",
			      },
			      {
			        "end": 512.17,
			        "start": 512.11,
			        "word": " a",
			      },
			      {
			        "end": 512.72,
			        "start": 512.17,
			        "word": " reliable",
			      },
			      {
			        "end": 513.2,
			        "start": 512.72,
			        "word": " trading",
			      },
			      {
			        "end": 513.68,
			        "start": 513.2,
			        "word": " partner",
			      },
			    ],
			  },
			  {
			    "end": 515.88,
			    "start": 513.68,
			    "text": "but also not a reliable ally.",
			    "words": [
			      {
			        "end": 514.16,
			        "start": 513.68,
			        "word": " but",
			      },
			      {
			        "end": 514.35,
			        "start": 514.16,
			        "word": " also",
			      },
			      {
			        "end": 514.64,
			        "start": 514.35,
			        "word": " not",
			      },
			      {
			        "end": 514.73,
			        "start": 514.64,
			        "word": " a",
			      },
			      {
			        "end": 515.5,
			        "start": 514.73,
			        "word": " reliable",
			      },
			      {
			        "end": 515.88,
			        "start": 515.5,
			        "word": " ally",
			      },
			    ],
			  },
			  {
			    "end": 521.91,
			    "start": 516.2,
			    "text": "And domestically, think about what it means with these tariffs that are changing by the day.",
			    "words": [
			      {
			        "end": 516.89,
			        "start": 516.2,
			        "word": " And",
			      },
			      {
			        "end": 517.09,
			        "start": 516.89,
			        "word": " domest",
			      },
			      {
			        "end": 517.73,
			        "start": 517.09,
			        "word": "ically",
			      },
			      {
			        "end": 517.84,
			        "start": 517.73,
			        "word": ",",
			      },
			      {
			        "end": 518.34,
			        "start": 517.84,
			        "word": " think",
			      },
			      {
			        "end": 518.64,
			        "start": 518.34,
			        "word": " about",
			      },
			      {
			        "end": 518.96,
			        "start": 518.64,
			        "word": " what",
			      },
			      {
			        "end": 519.16,
			        "start": 518.96,
			        "word": " it",
			      },
			      {
			        "end": 519.54,
			        "start": 519.16,
			        "word": " means",
			      },
			      {
			        "end": 519.85,
			        "start": 519.54,
			        "word": " with",
			      },
			      {
			        "end": 520.08,
			        "start": 519.85,
			        "word": " these",
			      },
			      {
			        "end": 520.5,
			        "start": 520.08,
			        "word": " tariffs",
			      },
			      {
			        "end": 520.75,
			        "start": 520.5,
			        "word": " that",
			      },
			      {
			        "end": 520.93,
			        "start": 520.75,
			        "word": " are",
			      },
			      {
			        "end": 521.43,
			        "start": 520.93,
			        "word": " changing",
			      },
			      {
			        "end": 521.59,
			        "start": 521.43,
			        "word": " by",
			      },
			      {
			        "end": 521.73,
			        "start": 521.59,
			        "word": " the",
			      },
			      {
			        "end": 521.91,
			        "start": 521.73,
			        "word": " day",
			      },
			    ],
			  },
			  {
			    "end": 524.32,
			    "start": 522.14,
			    "text": "People are saying they're on, they're off.",
			    "words": [
			      {
			        "end": 522.78,
			        "start": 522.14,
			        "word": " People",
			      },
			      {
			        "end": 522.89,
			        "start": 522.78,
			        "word": " are",
			      },
			      {
			        "end": 523.4,
			        "start": 522.89,
			        "word": " saying",
			      },
			      {
			        "end": 523.57,
			        "start": 523.4,
			        "word": " they",
			      },
			      {
			        "end": 523.7,
			        "start": 523.57,
			        "word": "'re",
			      },
			      {
			        "end": 523.78,
			        "start": 523.7,
			        "word": " on",
			      },
			      {
			        "end": 523.88,
			        "start": 523.78,
			        "word": ",",
			      },
			      {
			        "end": 524.06,
			        "start": 523.88,
			        "word": " they",
			      },
			      {
			        "end": 524.19,
			        "start": 524.06,
			        "word": "'re",
			      },
			      {
			        "end": 524.32,
			        "start": 524.19,
			        "word": " off",
			      },
			    ],
			  },
			  {
			    "end": 527.15,
			    "start": 524.48,
			    "text": "They're on, they're off, they're off, they're on, right?",
			    "words": [
			      {
			        "end": 524.87,
			        "start": 524.48,
			        "word": " They",
			      },
			      {
			        "end": 524.96,
			        "start": 524.87,
			        "word": "'re",
			      },
			      {
			        "end": 524.98,
			        "start": 524.96,
			        "word": " on",
			      },
			      {
			        "end": 525.09,
			        "start": 524.98,
			        "word": ",",
			      },
			      {
			        "end": 525.31,
			        "start": 525.09,
			        "word": " they",
			      },
			      {
			        "end": 525.48,
			        "start": 525.31,
			        "word": "'re",
			      },
			      {
			        "end": 525.65,
			        "start": 525.48,
			        "word": " off",
			      },
			      {
			        "end": 525.8,
			        "start": 525.65,
			        "word": ",",
			      },
			      {
			        "end": 525.96,
			        "start": 525.8,
			        "word": " they",
			      },
			      {
			        "end": 526.08,
			        "start": 525.96,
			        "word": "'re",
			      },
			      {
			        "end": 526.2,
			        "start": 526.08,
			        "word": " off",
			      },
			      {
			        "end": 526.37,
			        "start": 526.2,
			        "word": ",",
			      },
			      {
			        "end": 526.51,
			        "start": 526.37,
			        "word": " they",
			      },
			      {
			        "end": 526.66,
			        "start": 526.51,
			        "word": "'re",
			      },
			      {
			        "end": 526.76,
			        "start": 526.66,
			        "word": " on",
			      },
			      {
			        "end": 526.88,
			        "start": 526.76,
			        "word": ",",
			      },
			      {
			        "end": 527.15,
			        "start": 526.88,
			        "word": " right",
			      },
			    ],
			  },
			  {
			    "end": 529.64,
			    "start": 527.32,
			    "text": "Who makes investments here?",
			    "words": [
			      {
			        "end": 527.6,
			        "start": 527.32,
			        "word": " Who",
			      },
			      {
			        "end": 528.2,
			        "start": 527.6,
			        "word": " makes",
			      },
			      {
			        "end": 529.17,
			        "start": 528.2,
			        "word": " investments",
			      },
			      {
			        "end": 529.64,
			        "start": 529.17,
			        "word": " here",
			      },
			    ],
			  },
			  {
			    "end": 536.08,
			    "start": 529.88,
			    "text": "Who wants to say, I'm going to build a factory that will take me 20 years to recover my costs",
			    "words": [
			      {
			        "end": 530.46,
			        "start": 529.88,
			        "word": " Who",
			      },
			      {
			        "end": 530.77,
			        "start": 530.46,
			        "word": " wants",
			      },
			      {
			        "end": 530.99,
			        "start": 530.77,
			        "word": " to",
			      },
			      {
			        "end": 531.34,
			        "start": 530.99,
			        "word": " say",
			      },
			      {
			        "end": 531.34,
			        "start": 531.34,
			        "word": ",",
			      },
			      {
			        "end": 531.48,
			        "start": 531.34,
			        "word": " I",
			      },
			      {
			        "end": 531.55,
			        "start": 531.48,
			        "word": "'m",
			      },
			      {
			        "end": 531.95,
			        "start": 531.55,
			        "word": " going",
			      },
			      {
			        "end": 532.05,
			        "start": 531.95,
			        "word": " to",
			      },
			      {
			        "end": 532.48,
			        "start": 532.05,
			        "word": " build",
			      },
			      {
			        "end": 532.55,
			        "start": 532.48,
			        "word": " a",
			      },
			      {
			        "end": 533,
			        "start": 532.55,
			        "word": " factory",
			      },
			      {
			        "end": 533.52,
			        "start": 533,
			        "word": " that",
			      },
			      {
			        "end": 533.54,
			        "start": 533.52,
			        "word": " will",
			      },
			      {
			        "end": 533.81,
			        "start": 533.54,
			        "word": " take",
			      },
			      {
			        "end": 533.94,
			        "start": 533.81,
			        "word": " me",
			      },
			      {
			        "end": 534.35,
			        "start": 533.94,
			        "word": " 20",
			      },
			      {
			        "end": 534.74,
			        "start": 534.35,
			        "word": " years",
			      },
			      {
			        "end": 534.74,
			        "start": 534.74,
			        "word": "",
			      },
			      {
			        "end": 534.9,
			        "start": 534.74,
			        "word": " to",
			      },
			      {
			        "end": 535.48,
			        "start": 534.9,
			        "word": " recover",
			      },
			      {
			        "end": 535.64,
			        "start": 535.48,
			        "word": " my",
			      },
			      {
			        "end": 536.08,
			        "start": 535.64,
			        "word": " costs",
			      },
			    ],
			  },
			  {
			    "end": 541.34,
			    "start": 536.08,
			    "text": "without having some general sense of what it's going to be like",
			    "words": [
			      {
			        "end": 536.77,
			        "start": 536.08,
			        "word": " without",
			      },
			      {
			        "end": 537.38,
			        "start": 536.77,
			        "word": " having",
			      },
			      {
			        "end": 537.7,
			        "start": 537.38,
			        "word": " some",
			      },
			      {
			        "end": 538.32,
			        "start": 537.7,
			        "word": " general",
			      },
			      {
			        "end": 538.9,
			        "start": 538.32,
			        "word": " sense",
			      },
			      {
			        "end": 539.49,
			        "start": 538.9,
			        "word": " of",
			      },
			      {
			        "end": 539.53,
			        "start": 539.49,
			        "word": " what",
			      },
			      {
			        "end": 539.74,
			        "start": 539.53,
			        "word": " it",
			      },
			      {
			        "end": 540.36,
			        "start": 539.74,
			        "word": "'s",
			      },
			      {
			        "end": 540.47,
			        "start": 540.36,
			        "word": " going",
			      },
			      {
			        "end": 540.71,
			        "start": 540.47,
			        "word": " to",
			      },
			      {
			        "end": 540.9,
			        "start": 540.71,
			        "word": " be",
			      },
			      {
			        "end": 541.34,
			        "start": 540.9,
			        "word": " like",
			      },
			    ],
			  },
			  {
			    "end": 543.12,
			    "start": 541.34,
			    "text": "and the ability to sell your goods overseas.",
			    "words": [
			      {
			        "end": 541.47,
			        "start": 541.34,
			        "word": " and",
			      },
			      {
			        "end": 541.6,
			        "start": 541.47,
			        "word": " the",
			      },
			      {
			        "end": 541.92,
			        "start": 541.6,
			        "word": " ability",
			      },
			      {
			        "end": 542.02,
			        "start": 541.92,
			        "word": " to",
			      },
			      {
			        "end": 542.23,
			        "start": 542.02,
			        "word": " sell",
			      },
			      {
			        "end": 542.44,
			        "start": 542.23,
			        "word": " your",
			      },
			      {
			        "end": 542.7,
			        "start": 542.44,
			        "word": " goods",
			      },
			      {
			        "end": 543.12,
			        "start": 542.7,
			        "word": " overseas",
			      },
			    ],
			  },
			  {
			    "end": 545.52,
			    "start": 543.3,
			    "text": "You cannot plan. You cannot plan.",
			    "words": [
			      {
			        "end": 543.59,
			        "start": 543.3,
			        "word": " You",
			      },
			      {
			        "end": 544.05,
			        "start": 543.59,
			        "word": " cannot",
			      },
			      {
			        "end": 544.38,
			        "start": 544.05,
			        "word": " plan",
			      },
			      {
			        "end": 544.66,
			        "start": 544.38,
			        "word": ".",
			      },
			      {
			        "end": 544.84,
			        "start": 544.66,
			        "word": " You",
			      },
			      {
			        "end": 545.21,
			        "start": 544.84,
			        "word": " cannot",
			      },
			      {
			        "end": 545.52,
			        "start": 545.21,
			        "word": " plan",
			      },
			    ],
			  },
			  {
			    "end": 550.86,
			    "start": 545.66,
			    "text": "And in fact, what often happens is people start laying off hoarding their cash",
			    "words": [
			      {
			        "end": 546.13,
			        "start": 545.66,
			        "word": " And",
			      },
			      {
			        "end": 546.17,
			        "start": 546.13,
			        "word": " in",
			      },
			      {
			        "end": 546.51,
			        "start": 546.17,
			        "word": " fact",
			      },
			      {
			        "end": 546.72,
			        "start": 546.51,
			        "word": ",",
			      },
			      {
			        "end": 547.35,
			        "start": 546.72,
			        "word": " what",
			      },
			      {
			        "end": 547.54,
			        "start": 547.35,
			        "word": " often",
			      },
			      {
			        "end": 548.12,
			        "start": 547.54,
			        "word": " happens",
			      },
			      {
			        "end": 548.6,
			        "start": 548.12,
			        "word": " is",
			      },
			      {
			        "end": 548.81,
			        "start": 548.6,
			        "word": " people",
			      },
			      {
			        "end": 549.32,
			        "start": 548.81,
			        "word": " start",
			      },
			      {
			        "end": 549.67,
			        "start": 549.32,
			        "word": " laying",
			      },
			      {
			        "end": 549.88,
			        "start": 549.67,
			        "word": " off",
			      },
			      {
			        "end": 550.16,
			        "start": 549.88,
			        "word": " hoard",
			      },
			      {
			        "end": 550.33,
			        "start": 550.16,
			        "word": "ing",
			      },
			      {
			        "end": 550.61,
			        "start": 550.33,
			        "word": " their",
			      },
			      {
			        "end": 550.86,
			        "start": 550.61,
			        "word": " cash",
			      },
			    ],
			  },
			  {
			    "end": 551.68,
			    "start": 550.86,
			    "text": "under these circumstances.",
			    "words": [
			      {
			        "end": 551.04,
			        "start": 550.86,
			        "word": " under",
			      },
			      {
			        "end": 551.22,
			        "start": 551.04,
			        "word": " these",
			      },
			      {
			        "end": 551.68,
			        "start": 551.22,
			        "word": " circumstances",
			      },
			    ],
			  },
			  {
			    "end": 556.83,
			    "start": 551.8,
			    "text": "That is the reason that it is now time for Congress to act.",
			    "words": [
			      {
			        "end": 552.67,
			        "start": 551.8,
			        "word": " That",
			      },
			      {
			        "end": 552.76,
			        "start": 552.67,
			        "word": " is",
			      },
			      {
			        "end": 553.1,
			        "start": 552.76,
			        "word": " the",
			      },
			      {
			        "end": 553.98,
			        "start": 553.1,
			        "word": " reason",
			      },
			      {
			        "end": 554.32,
			        "start": 553.98,
			        "word": " that",
			      },
			      {
			        "end": 554.49,
			        "start": 554.32,
			        "word": " it",
			      },
			      {
			        "end": 554.65,
			        "start": 554.49,
			        "word": " is",
			      },
			      {
			        "end": 554.95,
			        "start": 554.65,
			        "word": " now",
			      },
			      {
			        "end": 555.28,
			        "start": 554.95,
			        "word": " time",
			      },
			      {
			        "end": 555.57,
			        "start": 555.28,
			        "word": " for",
			      },
			      {
			        "end": 556.49,
			        "start": 555.57,
			        "word": " Congress",
			      },
			      {
			        "end": 556.54,
			        "start": 556.49,
			        "word": " to",
			      },
			      {
			        "end": 556.83,
			        "start": 556.54,
			        "word": " act",
			      },
			    ],
			  },
			  {
			    "end": 563.52,
			    "start": 557.81,
			    "text": "we have the power in the Senate and the House to roll back the authority",
			    "words": [
			      {
			        "end": 557.89,
			        "start": 557.81,
			        "word": " we",
			      },
			      {
			        "end": 558.36,
			        "start": 557.89,
			        "word": " have",
			      },
			      {
			        "end": 558.71,
			        "start": 558.36,
			        "word": " the",
			      },
			      {
			        "end": 559.32,
			        "start": 558.71,
			        "word": " power",
			      },
			      {
			        "end": 559.62,
			        "start": 559.32,
			        "word": " in",
			      },
			      {
			        "end": 559.72,
			        "start": 559.62,
			        "word": " the",
			      },
			      {
			        "end": 560.2,
			        "start": 559.72,
			        "word": " Senate",
			      },
			      {
			        "end": 560.44,
			        "start": 560.2,
			        "word": " and",
			      },
			      {
			        "end": 560.71,
			        "start": 560.44,
			        "word": " the",
			      },
			      {
			        "end": 561.08,
			        "start": 560.71,
			        "word": " House",
			      },
			      {
			        "end": 561.75,
			        "start": 561.08,
			        "word": " to",
			      },
			      {
			        "end": 562.14,
			        "start": 561.75,
			        "word": " roll",
			      },
			      {
			        "end": 562.86,
			        "start": 562.14,
			        "word": " back",
			      },
			      {
			        "end": 563.02,
			        "start": 562.86,
			        "word": " the",
			      },
			      {
			        "end": 563.52,
			        "start": 563.02,
			        "word": " authority",
			      },
			    ],
			  },
			  {
			    "end": 564.78,
			    "start": 563.52,
			    "text": "that Donald Trump is using.",
			    "words": [
			      {
			        "end": 563.83,
			        "start": 563.52,
			        "word": " that",
			      },
			      {
			        "end": 564.11,
			        "start": 563.83,
			        "word": " Donald",
			      },
			      {
			        "end": 564.48,
			        "start": 564.11,
			        "word": " Trump",
			      },
			      {
			        "end": 564.52,
			        "start": 564.48,
			        "word": " is",
			      },
			      {
			        "end": 564.78,
			        "start": 564.52,
			        "word": " using",
			      },
			    ],
			  },
			  {
			    "end": 566.3,
			    "start": 564.94,
			    "text": "It's a simple resolution.",
			    "words": [
			      {
			        "end": 565.07,
			        "start": 564.94,
			        "word": " It",
			      },
			      {
			        "end": 565.2,
			        "start": 565.07,
			        "word": "'s",
			      },
			      {
			        "end": 565.26,
			        "start": 565.2,
			        "word": " a",
			      },
			      {
			        "end": 565.65,
			        "start": 565.26,
			        "word": " simple",
			      },
			      {
			        "end": 566.3,
			        "start": 565.65,
			        "word": " resolution",
			      },
			    ],
			  },
			  {
			    "end": 567.99,
			    "start": 566.52,
			    "text": "It will go to the floor.",
			    "words": [
			      {
			        "end": 566.68,
			        "start": 566.52,
			        "word": " It",
			      },
			      {
			        "end": 567.17,
			        "start": 566.68,
			        "word": " will",
			      },
			      {
			        "end": 567.19,
			        "start": 567.17,
			        "word": " go",
			      },
			      {
			        "end": 567.33,
			        "start": 567.19,
			        "word": " to",
			      },
			      {
			        "end": 567.58,
			        "start": 567.33,
			        "word": " the",
			      },
			      {
			        "end": 567.99,
			        "start": 567.58,
			        "word": " floor",
			      },
			    ],
			  },
			  {
			    "end": 573.74,
			    "start": 568.28,
			    "text": "Senator Ron Wyden and I have introduced it or will be introducing it the next day in the Senate.",
			    "words": [
			      {
			        "end": 569.05,
			        "start": 568.28,
			        "word": " Senator",
			      },
			      {
			        "end": 569.38,
			        "start": 569.05,
			        "word": " Ron",
			      },
			      {
			        "end": 569.59,
			        "start": 569.38,
			        "word": " Wy",
			      },
			      {
			        "end": 569.94,
			        "start": 569.59,
			        "word": "den",
			      },
			      {
			        "end": 570.17,
			        "start": 569.94,
			        "word": " and",
			      },
			      {
			        "end": 570.26,
			        "start": 570.17,
			        "word": " I",
			      },
			      {
			        "end": 570.46,
			        "start": 570.26,
			        "word": " have",
			      },
			      {
			        "end": 570.98,
			        "start": 570.46,
			        "word": " introduced",
			      },
			      {
			        "end": 571.38,
			        "start": 570.98,
			        "word": " it",
			      },
			      {
			        "end": 571.48,
			        "start": 571.38,
			        "word": " or",
			      },
			      {
			        "end": 571.69,
			        "start": 571.48,
			        "word": " will",
			      },
			      {
			        "end": 571.79,
			        "start": 571.69,
			        "word": " be",
			      },
			      {
			        "end": 572.42,
			        "start": 571.79,
			        "word": " introducing",
			      },
			      {
			        "end": 572.6,
			        "start": 572.42,
			        "word": " it",
			      },
			      {
			        "end": 572.76,
			        "start": 572.6,
			        "word": " the",
			      },
			      {
			        "end": 572.98,
			        "start": 572.76,
			        "word": " next",
			      },
			      {
			        "end": 573.16,
			        "start": 572.98,
			        "word": " day",
			      },
			      {
			        "end": 573.28,
			        "start": 573.16,
			        "word": " in",
			      },
			      {
			        "end": 573.42,
			        "start": 573.28,
			        "word": " the",
			      },
			      {
			        "end": 573.74,
			        "start": 573.42,
			        "word": " Senate",
			      },
			    ],
			  },
			  {
			    "end": 575.06,
			    "start": 573.92,
			    "text": "You need how many Republicans?",
			    "words": [
			      {
			        "end": 574.2,
			        "start": 573.92,
			        "word": " You",
			      },
			      {
			        "end": 574.46,
			        "start": 574.2,
			        "word": " need",
			      },
			      {
			        "end": 574.58,
			        "start": 574.46,
			        "word": " how",
			      },
			      {
			        "end": 574.72,
			        "start": 574.58,
			        "word": " many",
			      },
			      {
			        "end": 575.06,
			        "start": 574.72,
			        "word": " Republicans",
			      },
			    ],
			  },
			  {
			    "end": 579.06,
			    "start": 575.16,
			    "text": "Well, we only need a simple majority to get it passed.",
			    "words": [
			      {
			        "end": 576.11,
			        "start": 575.16,
			        "word": " Well",
			      },
			      {
			        "end": 576.32,
			        "start": 576.11,
			        "word": ",",
			      },
			      {
			        "end": 576.55,
			        "start": 576.32,
			        "word": " we",
			      },
			      {
			        "end": 576.71,
			        "start": 576.55,
			        "word": " only",
			      },
			      {
			        "end": 576.97,
			        "start": 576.71,
			        "word": " need",
			      },
			      {
			        "end": 577.03,
			        "start": 576.97,
			        "word": " a",
			      },
			      {
			        "end": 577.4,
			        "start": 577.03,
			        "word": " simple",
			      },
			      {
			        "end": 577.86,
			        "start": 577.4,
			        "word": " majority",
			      },
			      {
			        "end": 578.27,
			        "start": 577.86,
			        "word": " to",
			      },
			      {
			        "end": 578.32,
			        "start": 578.27,
			        "word": " get",
			      },
			      {
			        "end": 578.5,
			        "start": 578.32,
			        "word": " it",
			      },
			      {
			        "end": 579.06,
			        "start": 578.5,
			        "word": " passed",
			      },
			    ],
			  },
			  {
			    "end": 582.35,
			    "start": 579.36,
			    "text": "We may need more than that if the president ultimately vetoes it.",
			    "words": [
			      {
			        "end": 579.49,
			        "start": 579.36,
			        "word": " We",
			      },
			      {
			        "end": 579.69,
			        "start": 579.49,
			        "word": " may",
			      },
			      {
			        "end": 579.96,
			        "start": 579.69,
			        "word": " need",
			      },
			      {
			        "end": 580.24,
			        "start": 579.96,
			        "word": " more",
			      },
			      {
			        "end": 580.41,
			        "start": 580.24,
			        "word": " than",
			      },
			      {
			        "end": 580.58,
			        "start": 580.41,
			        "word": " that",
			      },
			      {
			        "end": 580.72,
			        "start": 580.58,
			        "word": " if",
			      },
			      {
			        "end": 580.83,
			        "start": 580.72,
			        "word": " the",
			      },
			      {
			        "end": 581.22,
			        "start": 580.83,
			        "word": " president",
			      },
			      {
			        "end": 581.87,
			        "start": 581.22,
			        "word": " ultimately",
			      },
			      {
			        "end": 582.11,
			        "start": 581.87,
			        "word": " veto",
			      },
			      {
			        "end": 582.23,
			        "start": 582.11,
			        "word": "es",
			      },
			      {
			        "end": 582.35,
			        "start": 582.23,
			        "word": " it",
			      },
			    ],
			  },
			  {
			    "end": 585.94,
			    "start": 583.02,
			    "text": "But you know, this is the moment for Republicans.",
			    "words": [
			      {
			        "end": 583.04,
			        "start": 583.02,
			        "word": " But",
			      },
			      {
			        "end": 583.18,
			        "start": 583.04,
			        "word": " you",
			      },
			      {
			        "end": 583.38,
			        "start": 583.18,
			        "word": " know",
			      },
			      {
			        "end": 583.38,
			        "start": 583.38,
			        "word": ",",
			      },
			      {
			        "end": 583.84,
			        "start": 583.38,
			        "word": " this",
			      },
			      {
			        "end": 584.04,
			        "start": 583.84,
			        "word": " is",
			      },
			      {
			        "end": 584.37,
			        "start": 584.04,
			        "word": " the",
			      },
			      {
			        "end": 585.06,
			        "start": 584.37,
			        "word": " moment",
			      },
			      {
			        "end": 585.47,
			        "start": 585.06,
			        "word": " for",
			      },
			      {
			        "end": 585.94,
			        "start": 585.47,
			        "word": " Republicans",
			      },
			    ],
			  },
			  {
			    "end": 588.93,
			    "start": 586.14,
			    "text": "This is the place where it's right in front of them.",
			    "words": [
			      {
			        "end": 586.61,
			        "start": 586.14,
			        "word": " This",
			      },
			      {
			        "end": 587.15,
			        "start": 586.61,
			        "word": " is",
			      },
			      {
			        "end": 587.21,
			        "start": 587.15,
			        "word": " the",
			      },
			      {
			        "end": 587.82,
			        "start": 587.21,
			        "word": " place",
			      },
			      {
			        "end": 588.04,
			        "start": 587.82,
			        "word": " where",
			      },
			      {
			        "end": 588.12,
			        "start": 588.04,
			        "word": " it",
			      },
			      {
			        "end": 588.21,
			        "start": 588.12,
			        "word": "'s",
			      },
			      {
			        "end": 588.43,
			        "start": 588.21,
			        "word": " right",
			      },
			      {
			        "end": 588.53,
			        "start": 588.43,
			        "word": " in",
			      },
			      {
			        "end": 588.78,
			        "start": 588.53,
			        "word": " front",
			      },
			      {
			        "end": 588.83,
			        "start": 588.78,
			        "word": " of",
			      },
			      {
			        "end": 588.93,
			        "start": 588.83,
			        "word": " them",
			      },
			    ],
			  },
			  {
			    "end": 594.68,
			    "start": 589.02,
			    "text": "Either they can continue to bend a knee to Donald Trump",
			    "words": [
			      {
			        "end": 589.92,
			        "start": 589.02,
			        "word": " Either",
			      },
			      {
			        "end": 590.62,
			        "start": 589.92,
			        "word": " they",
			      },
			      {
			        "end": 590.69,
			        "start": 590.62,
			        "word": " can",
			      },
			      {
			        "end": 591.58,
			        "start": 590.69,
			        "word": " continue",
			      },
			      {
			        "end": 591.87,
			        "start": 591.58,
			        "word": " to",
			      },
			      {
			        "end": 592.45,
			        "start": 591.87,
			        "word": " bend",
			      },
			      {
			        "end": 592.6,
			        "start": 592.45,
			        "word": " a",
			      },
			      {
			        "end": 593.2,
			        "start": 592.6,
			        "word": " knee",
			      },
			      {
			        "end": 593.68,
			        "start": 593.2,
			        "word": " to",
			      },
			      {
			        "end": 594.1,
			        "start": 593.68,
			        "word": " Donald",
			      },
			      {
			        "end": 594.68,
			        "start": 594.1,
			        "word": " Trump",
			      },
			    ],
			  },
			  {
			    "end": 601.56,
			    "start": 594.68,
			    "text": "or they can stand up for the people back home who are getting hurt by Donald Trump.",
			    "words": [
			      {
			        "end": 595.25,
			        "start": 594.68,
			        "word": " or",
			      },
			      {
			        "end": 595.84,
			        "start": 595.25,
			        "word": " they",
			      },
			      {
			        "end": 596.23,
			        "start": 595.84,
			        "word": " can",
			      },
			      {
			        "end": 597.09,
			        "start": 596.23,
			        "word": " stand",
			      },
			      {
			        "end": 597.46,
			        "start": 597.09,
			        "word": " up",
			      },
			      {
			        "end": 597.91,
			        "start": 597.46,
			        "word": " for",
			      },
			      {
			        "end": 598,
			        "start": 597.91,
			        "word": " the",
			      },
			      {
			        "end": 598.52,
			        "start": 598,
			        "word": " people",
			      },
			      {
			        "end": 598.89,
			        "start": 598.52,
			        "word": " back",
			      },
			      {
			        "end": 599.26,
			        "start": 598.89,
			        "word": " home",
			      },
			      {
			        "end": 599.45,
			        "start": 599.26,
			        "word": " who",
			      },
			      {
			        "end": 599.64,
			        "start": 599.45,
			        "word": " are",
			      },
			      {
			        "end": 600.09,
			        "start": 599.64,
			        "word": " getting",
			      },
			      {
			        "end": 600.38,
			        "start": 600.09,
			        "word": " hurt",
			      },
			      {
			        "end": 600.68,
			        "start": 600.38,
			        "word": " by",
			      },
			      {
			        "end": 601.1,
			        "start": 600.68,
			        "word": " Donald",
			      },
			      {
			        "end": 601.56,
			        "start": 601.1,
			        "word": " Trump",
			      },
			    ],
			  },
			]
		`)
	})

	test('alignWordsAndSentences words count', async () => {
		const { words } = await getWords()
		const result = alignWordsAndSentences(words, sentences)

		// 计算原始sentences中的总单词数
		const originalWordCount = sentences
			.join(' ')
			.split(/\s+/)
			.filter((word) => word.trim().length > 0).length

		// 计算result中所有text属性拼接后的总单词数
		const resultWordCount = result
			.map((item) => item.text)
			.join(' ')
			.split(/\s+/)
			.filter((word) => word.trim().length > 0).length

		// 判断单词数量是否一致
		console.log(`Original sentences count: ${sentences.length}`)
		console.log(`Result sentences count: ${result.length}`)
		console.log(`Original word count: ${originalWordCount}`)
		console.log(`Result word count: ${resultWordCount}`)

		// 找出缺失的句子
		const resultTexts = result.map((item) => item.text)
		const missingSentences = sentences.filter((sentence) => !resultTexts.includes(sentence))

		if (missingSentences.length > 0) {
			console.log('Missing sentences:')
			missingSentences.forEach((sentence, index) => {
				console.log(`${index + 1}. "${sentence}"`)
			})
		}

		// 仍然执行断言，但我们已经知道可能会失败
		expect(resultWordCount).toBe(originalWordCount)
	})
})
