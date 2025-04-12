import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { db, schema } from '~/lib/drizzle'

export const action = async ({ params, request }: ActionFunctionArgs) => {
	const { id } = params
	invariant(id, 'id is required')

	// 获取单词数据
	const word = await db.query.words.findFirst({
		where: eq(schema.words.id, id),
	})

	invariant(word, 'Word not found')

	// 获取表单数据
	const formData = await request.formData()
	const title = formData.get('title')

	if (typeof title !== 'string') {
		return json({ success: false, error: 'Title is required' }, { status: 400 })
	}

	// 更新数据库中的标题
	await db
		.update(schema.words)
		.set({
			title,
		})
		.where(eq(schema.words.id, id))

	return json({ success: true, title })
}
