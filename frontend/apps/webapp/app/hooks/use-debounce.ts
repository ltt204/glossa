import { useEffect, useState } from 'react'

export default function useDebounce(value: string, delay = 800): string {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		if (value.trim() === '') {
			setDebouncedValue('')
			return
		}

		const timer = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(timer)
		}
	}, [value, delay])

	return debouncedValue
}
