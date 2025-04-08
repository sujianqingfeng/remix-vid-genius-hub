import type { ActionFunctionArgs } from '@remix-run/node'
import { Form, redirect, useFetcher } from '@remix-run/react'
import LoadingButtonWithState from '~/components/LoadingButtonWithState'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { db, schema } from '~/lib/drizzle'
import { GenerateDialogueSchema } from '~/schema'
import type { GenerateDialogue } from '~/types'
import { chatGPT } from '~/utils/ai'
const defaultPrompt = `
 你是一个小学英语老师，现在需要根据给定的主题，生成一个两个人的对话脚本，大概10句对话。
 主题：钓鱼
 一个对话内容包括
 - 角色 label, 数字表示
 - 对话内容
 - 对话内容中文翻译
`

async function generateDialogue(prompt: string) {
	// 生成对话
	const result = await chatGPT.generateObject({
		system: '',
		prompt,
		schema: GenerateDialogueSchema,
		temperature: 0.7,
	})

	return result.list
}

async function createDialogue(formData: FormData) {
	const dialoguesStr = formData.get('dialogue') as string
	const dialogues = JSON.parse(dialoguesStr) as GenerateDialogue['list']

	const [dialogue] = await db
		.insert(schema.dialogues)
		.values({
			dialogues,
		})
		.returning({
			id: schema.dialogues.id,
		})

	return redirect(`/app/dialogue/${dialogue.id}`)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()
	const intent = formData.get('intent')

	switch (intent) {
		case 'generate':
			// 处理生成对话的逻辑
			return generateDialogue(formData.get('prompt') as string)
		case 'create':
			// 处理创建对话的逻辑
			return createDialogue(formData)
		default:
			throw new Error('Invalid intent')
	}
}

export default function DialogueNewPage() {
	const generateFetcher = useFetcher()
	const dialogues = generateFetcher.data as GenerateDialogue['list'] | undefined

	return (
		<div className="container mx-auto max-w-4xl space-y-8 p-6">
			<Card>
				<CardHeader>
					<CardTitle>Generate New Dialogue</CardTitle>
				</CardHeader>
				<CardContent>
					<generateFetcher.Form method="post" className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="prompt">Prompt</Label>
							<Textarea id="prompt" name="prompt" defaultValue={defaultPrompt} className="min-h-[200px]" />
						</div>

						<div className="flex justify-end">
							<LoadingButtonWithState name="intent" value="generate" state={generateFetcher.state} idleText="Generate" loadingText="Generating..." />
						</div>
					</generateFetcher.Form>
				</CardContent>
			</Card>

			{dialogues && (
				<Card>
					<CardHeader>
						<CardTitle>Generated Dialogue</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="rounded-lg border">
							<table className="w-full">
								<thead className="bg-muted/50">
									<tr>
										<th className="w-20 p-3 text-left font-medium">Role</th>
										<th className="p-3 text-left font-medium">Content</th>
										<th className="p-3 text-left font-medium">Chinese</th>
									</tr>
								</thead>
								<tbody>
									{dialogues.map((item) => (
										<tr key={`${item.roleLabel}-${item.content}`} className="border-t transition-colors hover:bg-muted/30">
											<td className="p-3 font-medium">Role {item.roleLabel}</td>
											<td className="p-3">{item.content}</td>
											<td className="p-3 text-muted-foreground">{item.contentZh}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="mt-6 flex justify-end">
							<Form method="post">
								<input type="hidden" name="dialogue" value={JSON.stringify(dialogues)} />
								<Button name="intent" value="create" size="lg">
									Save Dialogue
								</Button>
							</Form>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
