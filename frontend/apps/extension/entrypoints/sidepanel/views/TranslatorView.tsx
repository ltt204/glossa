import { useEffect, useRef, useState } from 'react'
import { logout, saveWord, translate } from '../lib/api'
import { clearTokens } from '../lib/storage'
import SavedWordsView from './SavedWordsView'

type Tab = 'translate' | 'saved'

interface Props {
	onLogout: () => void
}

export default function TranslatorView({ onLogout }: Props) {
	const [tab, setTab] = useState<Tab>('translate')
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [translating, setTranslating] = useState(false)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [error, setError] = useState('')
	const inputRef = useRef<HTMLTextAreaElement>(null)

	// Pick up text selected on the page (sent by content script via App.tsx)
	useEffect(() => {
		const selection = window.__glossaSelection
		if (selection) {
			setInput(selection)
			setOutput('')
			setSaved(false)
			window.__glossaSelection = undefined
			inputRef.current?.focus()
		}
	})

	async function handleTranslate() {
		if (!input.trim()) return
		setError('')
		setOutput('')
		setSaved(false)
		setTranslating(true)
		try {
			const result = await translate(input.trim())
			setOutput(result)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Translation failed')
		} finally {
			setTranslating(false)
		}
	}

	async function handleSave() {
		if (!input.trim() || !output) return
		setSaving(true)
		try {
			await saveWord(input.trim(), output)
			setSaved(true)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Save failed')
		} finally {
			setSaving(false)
		}
	}

	async function handleLogout() {
		try {
			await logout()
		} catch {
			// ignore logout errors — clear locally regardless
		}
		await clearTokens()
		onLogout()
	}

	return (
		<div className="flex flex-col h-screen bg-white">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
				<h1 className="font-bold text-gray-900">Glossa</h1>
				<button
					onClick={handleLogout}
					className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
				>
					Logout
				</button>
			</div>

			{/* Tab nav */}
			<div className="flex border-b border-gray-100">
				{(['translate', 'saved'] as Tab[]).map((t) => (
					<button
						key={t}
						onClick={() => setTab(t)}
						className={`flex-1 py-2 text-sm font-medium transition-colors ${
							tab === t
								? 'text-blue-600 border-b-2 border-blue-600'
								: 'text-gray-400 hover:text-gray-600'
						}`}
					>
						{t === 'translate' ? 'Translate' : 'Saved Words'}
					</button>
				))}
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-4">
				{tab === 'translate' ? (
					<div className="flex flex-col gap-3">
						<textarea
							ref={inputRef}
							value={input}
							onChange={(e) => {
								setInput(e.target.value)
								setOutput('')
								setSaved(false)
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									handleTranslate()
								}
							}}
							placeholder="Enter English text…"
							rows={4}
							className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<div className="flex gap-2">
							<button
								onClick={handleTranslate}
								disabled={translating || !input.trim()}
								className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2 transition-colors"
							>
								{translating ? 'Translating…' : 'Translate'}
							</button>

							{output && (
								<button
									onClick={handleSave}
									disabled={saving || saved}
									className="px-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-lg py-2 transition-colors"
								>
									{saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save'}
								</button>
							)}
						</div>

						{error && <p className="text-sm text-red-500">{error}</p>}

						{output && (
							<div className="border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 bg-gray-50 min-h-[80px]">
								{output}
							</div>
						)}
					</div>
				) : (
					<SavedWordsView />
				)}
			</div>
		</div>
	)
}
