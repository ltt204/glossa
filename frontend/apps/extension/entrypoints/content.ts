export default defineContentScript({
	matches: ['*://*/*'],
	main() {
		let debounceTimer: ReturnType<typeof setTimeout>

		document.addEventListener('mouseup', () => {
			clearTimeout(debounceTimer)
			debounceTimer = setTimeout(() => {
				const selected = window.getSelection()?.toString().trim()
				if (selected) {
					browser.runtime.sendMessage({ type: 'SELECTION', text: selected })
				}
			}, 800)
		})
	},
})
