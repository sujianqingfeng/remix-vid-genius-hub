import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import type { CreateNewDownloadActionData } from '~/api/types'
import FormLabel from '~/components/FormLabel'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useHydrated } from '~/hooks/useHydrated'
import { downloadsInsertSchema } from '~/schema'

export default function NewDownloadDialog() {
	const isHydrated = useHydrated()
	const createFetcher = useFetcher<CreateNewDownloadActionData>()
	const isSubmitting = createFetcher.state === 'submitting'

	const [form, fields] = useForm({
		lastResult: createFetcher.data?.submissionReply,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: downloadsInsertSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (createFetcher.data?.success) {
			setOpen(false)
		}
	}, [createFetcher.data?.success])

	const buttonElement = <Button>New Download</Button>

	if (!isHydrated) {
		return buttonElement
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{buttonElement}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Download</DialogTitle>
					<DialogDescription>Create a new download</DialogDescription>
				</DialogHeader>
				<createFetcher.Form action="create-new" method="post" {...getFormProps(form)}>
					<div className="space-y-2">
						<div>
							<FormLabel name={fields.type.name} />
							<Select key={fields.type.key} name={fields.type.name} defaultValue="youtube">
								<SelectTrigger>
									<SelectValue placeholder="Please select a type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="youtube">Youtube</SelectItem>
									<SelectItem value="tiktok">Tiktok</SelectItem>
								</SelectContent>
							</Select>
							<div className="text-red-500 text-sm">{fields.type.errors}</div>
						</div>

						<div>
							<FormLabel name={fields.link.name} />
							<Input type="url" key={fields.link.key} name={fields.link.name} placeholder="Please enter a link" defaultValue={fields.link.value} />
							<div className="text-red-500 text-sm">{fields.link.errors}</div>
						</div>

						<DialogFooter>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Creating...' : 'Confirm'}
							</Button>
						</DialogFooter>
					</div>
				</createFetcher.Form>
			</DialogContent>
		</Dialog>
	)
}
