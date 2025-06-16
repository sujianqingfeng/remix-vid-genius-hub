import { useNavigate } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'

export default function BackPrevious() {
	const navigate = useNavigate()

	const goBack = () => {
		navigate(-1)
	}

	return (
		<Button variant="ghost" size="sm" onClick={goBack} className="h-8 w-8 p-0">
			<ArrowLeft className="h-4 w-4" />
		</Button>
	)
}
