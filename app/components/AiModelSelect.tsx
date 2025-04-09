import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { AiModel } from '~/utils/ai'

interface AiModelSelectProps {
	name: string
	defaultValue: string
	onValueChange?: (value: AiModel) => void
}

export default function AiModelSelect({ name, defaultValue, onValueChange }: AiModelSelectProps) {
	return (
		<Select name={name} defaultValue={defaultValue} onValueChange={onValueChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select Model" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="r1">R1</SelectItem>
				<SelectItem value="deepseek">DeepSeek</SelectItem>
				<SelectItem value="volcanoEngineDeepseekV3">VolcanoEngine DeepSeek</SelectItem>
				<SelectItem value="openai">OpenAI</SelectItem>
				<SelectItem value="gemini">Gemini</SelectItem>
			</SelectContent>
		</Select>
	)
}
