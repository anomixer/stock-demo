'use client'

import { useState } from 'react'
import { StockSearchResult } from '@/types/stock'
import { searchStock } from '@/lib/stockApi'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Search, X, Plus, Loader2 } from 'lucide-react'

interface StockSearchModalProps {
    isOpen: boolean
    onClose: () => void
    onAddStock: (stock: { ticker: string; name: string }) => void
}

export const StockSearchModal = ({ isOpen, onClose, onAddStock }: StockSearchModalProps) => {
    const [keyword, setKeyword] = useState('')
    const [results, setResults] = useState<StockSearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [searching, setSearching] = useState(false)

    const handleSearch = async () => {
        if (!keyword.trim()) return

        setLoading(true)
        setSearching(true)

        try {
            const searchResults = await searchStock(keyword.trim())
            setResults(searchResults)
        } catch (error) {
            console.error('搜尋失敗:', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleAddStock = (result: StockSearchResult) => {
        onAddStock({
            ticker: result.ticker,
            name: result.name
        })
        handleClose()
    }

    const handleClose = () => {
        setKeyword('')
        setResults([])
        setSearching(false)
        setLoading(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
                {/* 標題列 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">🔍 搜尋股票</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* 搜尋輸入 */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="輸入股票名稱或代碼（如：台積電、AAPL、2330）"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                autoFocus
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={loading || !keyword.trim()}
                            className="flex items-center gap-2 px-6"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            搜尋
                        </Button>
                    </div>

                    {/* 搜尋提示 */}
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <p>💡 搜尋提示：</p>
                        <ul className="mt-1 ml-4 list-disc space-y-1">
                            <li>美股：輸入代碼如 AAPL、TSLA、GOOGL</li>
                            <li>台股：輸入中文名稱如「台積電」、「鴻海」或代碼如「2330」</li>
                            <li>支援模糊搜尋，輸入部分名稱即可</li>
                        </ul>
                    </div>
                </div>

                {/* 搜尋結果 - 固定的滾動區域 */}
                <div className="overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800 flex-1 max-h-[500px]">
                    {searching ? (
                        results.length === 0 ? (
                            <div className="text-center py-8">
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>搜尋中...</span>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>沒有找到符合的股票</p>
                                        <p className="text-sm mt-2">請嘗試其他關鍵字或檢查股票代碼</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    搜尋結果 ({results.length} 個)
                                </h3>
                                {results.map((result, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {result.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                {result.ticker} • {result.exchange}
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddStock(result)}
                                            className="flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            新增
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>請輸入關鍵字開始搜尋</p>
                        </div>
                    )}
                </div>

                {/* 底部按鈕 */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        關閉
                    </Button>
                </div>
            </div>
        </div>
    )
}
