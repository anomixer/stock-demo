'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Sun, Moon } from 'lucide-react'

type Theme = 'light' | 'dark'

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>('dark')

    // 載入儲存的主題設定
    useEffect(() => {
        const savedTheme = localStorage.getItem('stockMonitor_theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
            applyTheme(savedTheme)
        } else {
            // 檢查系統偏好設定
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const initialTheme = prefersDark ? 'dark' : 'light'
            setTheme(initialTheme)
            applyTheme(initialTheme)
        }
    }, [])

    // 監聽系統主題變更
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e: MediaQueryListEvent) => {
            // 只有在沒有手動設定主題時才跟隨系統主題
            const savedTheme = localStorage.getItem('stockMonitor_theme')
            if (!savedTheme) {
                const newTheme = e.matches ? 'dark' : 'light'
                setTheme(newTheme)
                applyTheme(newTheme)
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const applyTheme = (newTheme: Theme) => {
        const root = window.document.documentElement

        if (newTheme === 'dark') {
            root.classList.add('dark')
            document.body.classList.add('dark')
        } else {
            root.classList.remove('dark')
            document.body.classList.remove('dark')
        }

        // 儲存主題設定
        localStorage.setItem('stockMonitor_theme', newTheme)
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        applyTheme(newTheme)
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
            title={`目前${theme === 'dark' ? '暗色' : '亮色'}主題，點擊切換`}
        >
            {theme === 'dark' ? (
                <Moon className="w-4 h-4" />
            ) : (
                <Sun className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
                {theme === 'dark' ? '暗色' : '亮色'}
            </span>
        </Button>
    )
}
