'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Accessibility,
    X,
    Sun,
    Type,
    Link as LinkIcon,
    Eye,
    RotateCcw,
    Monitor
} from 'lucide-react'

type AccessibilityState = {
    fontSize: number // 0 = normal, 1 = large, 2 = extra large
    highContrast: boolean
    grayscale: boolean
    readableFont: boolean
    highlightLinks: boolean
}

const initialState: AccessibilityState = {
    fontSize: 0,
    highContrast: false,
    grayscale: false,
    readableFont: false,
    highlightLinks: false,
}

export function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [assistiveState, setAssistiveState] = useState<AccessibilityState>(initialState)

    // Apply styles to document
    useEffect(() => {
        const root = document.documentElement
        const body = document.body

        // Reset all
        root.classList.remove('text-lg', 'text-xl')
        root.classList.remove('high-contrast')
        root.classList.remove('grayscale-mode')
        root.classList.remove('readable-font')
        root.classList.remove('highlight-links')

        // Apply Font Size
        if (assistiveState.fontSize === 1) root.classList.add('text-lg')
        if (assistiveState.fontSize === 2) root.classList.add('text-xl')

        // Apply High Contrast
        if (assistiveState.highContrast) {
            root.classList.add('high-contrast')
        }

        // Apply Grayscale
        if (assistiveState.grayscale) {
            root.classList.add('grayscale-mode')
        }

        // Apply Readable Font
        if (assistiveState.readableFont) {
            root.classList.add('readable-font')
        }

        // Apply Highlight Links
        if (assistiveState.highlightLinks) {
            root.classList.add('highlight-links')
        }

    }, [assistiveState])

    const toggleOpen = () => setIsOpen(!isOpen)

    const updateState = (key: keyof AccessibilityState, value: any) => {
        setAssistiveState(prev => ({ ...prev, [key]: value }))
    }

    const resetSettings = () => {
        setAssistiveState(initialState)
    }

    // Styles Injection
    return (
        <>
            <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white/95 backdrop-blur-md border border-sage-200 rounded-2xl shadow-2xl p-4 w-72 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-sage-100">
                                <h3 className="font-display font-bold text-sage-900">נגישות</h3>
                                <button
                                    onClick={resetSettings}
                                    className="text-xs text-dusty-rose-600 hover:text-dusty-rose-800 flex items-center gap-1"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    איפוס
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {/* Font Size */}
                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-sage-50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Type className="w-5 h-5 text-sage-600" />
                                        <span className="text-sm text-sage-800">גודל טקסט</span>
                                    </div>
                                    <div className="flex gap-1 bg-sage-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => updateState('fontSize', 0)}
                                            className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition-all ${assistiveState.fontSize === 0 ? 'bg-white shadow text-sage-900' : 'text-sage-500'}`}
                                        >
                                            A
                                        </button>
                                        <button
                                            onClick={() => updateState('fontSize', 1)}
                                            className={`w-8 h-8 rounded flex items-center justify-center text-base font-bold transition-all ${assistiveState.fontSize === 1 ? 'bg-white shadow text-sage-900' : 'text-sage-500'}`}
                                        >
                                            A+
                                        </button>
                                        <button
                                            onClick={() => updateState('fontSize', 2)}
                                            className={`w-8 h-8 rounded flex items-center justify-center text-lg font-bold transition-all ${assistiveState.fontSize === 2 ? 'bg-white shadow text-sage-900' : 'text-sage-500'}`}
                                        >
                                            A++
                                        </button>
                                    </div>
                                </div>

                                {/* High Contrast */}
                                <button
                                    onClick={() => updateState('highContrast', !assistiveState.highContrast)}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${assistiveState.highContrast ? 'bg-sage-900 text-white' : 'hover:bg-sage-50 text-sage-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Sun className="w-5 h-5" />
                                        <span className="text-sm font-medium">ניגודיות גבוהה</span>
                                    </div>
                                    {assistiveState.highContrast && <div className="w-2 h-2 rounded-full bg-green-400" />}
                                </button>

                                {/* Grayscale */}
                                <button
                                    onClick={() => updateState('grayscale', !assistiveState.grayscale)}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${assistiveState.grayscale ? 'bg-sage-900 text-white' : 'hover:bg-sage-50 text-sage-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Monitor className="w-5 h-5" />
                                        <span className="text-sm font-medium">גווני אפור</span>
                                    </div>
                                    {assistiveState.grayscale && <div className="w-2 h-2 rounded-full bg-green-400" />}
                                </button>

                                {/* Readable Font */}
                                <button
                                    onClick={() => updateState('readableFont', !assistiveState.readableFont)}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${assistiveState.readableFont ? 'bg-sage-900 text-white' : 'hover:bg-sage-50 text-sage-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Type className="w-5 h-5" />
                                        <span className="text-sm font-medium">גופן קריא</span>
                                    </div>
                                    {assistiveState.readableFont && <div className="w-2 h-2 rounded-full bg-green-400" />}
                                </button>

                                {/* Highlight Links */}
                                <button
                                    onClick={() => updateState('highlightLinks', !assistiveState.highlightLinks)}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${assistiveState.highlightLinks ? 'bg-sage-900 text-white' : 'hover:bg-sage-50 text-sage-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <LinkIcon className="w-5 h-5" />
                                        <span className="text-sm font-medium">הדגשת קישורים</span>
                                    </div>
                                    {assistiveState.highlightLinks && <div className="w-2 h-2 rounded-full bg-green-400" />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={toggleOpen}
                    className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-sage-900 text-white rotate-90' : 'bg-white text-sage-900 hover:bg-sage-50'
                        }`}
                    aria-label="תפריט נגישות"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Accessibility className="w-6 h-6" />}
                </button>
            </div>
        </>
    )
}
