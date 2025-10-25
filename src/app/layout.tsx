import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: '股票即時監控系統',
    description: '現代化網頁版股票即時監控應用程式',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh-TW" suppressHydrationWarning>
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}
