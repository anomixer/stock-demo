'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Stock } from '@/types/stock'
import { getMultipleStockPrices, calculatePriceChange } from '@/lib/stockApi'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { StockSearchModal } from './StockSearchModal'
import { ThemeToggle } from './ThemeToggle'
import { StockMenu } from './StockMenu'
import { Search, Plus, Trash2, TrendingUp, TrendingDown, Minus, AlertTriangle, Download, Upload } from 'lucide-react'

export const StockDashboard = () => {
    const [stocks, setStocks] = useState<Stock[]>([
        { ticker: 'AAPL', name: 'Apple Inc.' },
        { ticker: '2330.TW', name: '台積電' },
        { ticker: '2317.TW', name: '鴻海' }
    ])

    const [prices, setPrices] = useState<{ [ticker: string]: number }>({})
    const [previousPrices, setPreviousPrices] = useState<{ [ticker: string]: number }>({})
    const [loading, setLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const [editingTicker, setEditingTicker] = useState<string | null>(null)
    const [tempName, setTempName] = useState('')
    const [countdown, setCountdown] = useState(60)
    const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>('medium')

    // Search Modal State
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

    // Confirmation Dialog States
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; stock: Stock | null }>({ isOpen: false, stock: null })
    const [importConfirm, setImportConfirm] = useState<{ isOpen: boolean; data: any | null; dataType: 'json' | null }>({ isOpen: false, data: null, dataType: null })
    const [resetConfirm, setResetConfirm] = useState<{ isOpen: boolean }>({ isOpen: false })

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    // Load stocks and prices from localStorage on initial render
    useEffect(() => {
        const savedStocks = localStorage.getItem('stockMonitor_stocks')
        if (savedStocks) {
            try {
                setStocks(JSON.parse(savedStocks))
            } catch (error) {
                console.error('Failed to load stocks:', error)
            }
        }

        const savedPrices = localStorage.getItem('stockMonitor_prices')
        if (savedPrices) {
            try {
                const lastPrices = JSON.parse(savedPrices)
                setPrices(lastPrices) // Load as current prices for the first render
            } catch (error) {
                console.error('Failed to load prices:', error)
            }
        }
    }, [])

    // Price update logic
    const updatePrices = async () => {
        if (stocks.length === 0) return
        setLoading(true)
        try {
            setPreviousPrices(prices) // Move current prices to previous
            const tickers = stocks.map(stock => stock.ticker)
            const priceData = await getMultipleStockPrices(tickers)
            const newPrices: { [ticker: string]: number } = {}
            priceData.forEach(data => {
                if (data.close_price && !isNaN(data.close_price)) {
                    newPrices[data.ticker] = data.close_price
                }
            })

            if (Object.keys(newPrices).length > 0) {
                setPrices(newPrices)
                localStorage.setItem('stockMonitor_prices', JSON.stringify(newPrices))
            }
            setLastUpdate(new Date())
        } catch (error) {
            console.error('Failed to update prices:', error)
        } finally {
            setLoading(false)
        }
    }

    // Auto-update prices every 60 seconds
    useEffect(() => {
        const updateAndReset = () => {
            updatePrices()
            setCountdown(60)
        }

        updateAndReset() // Initial call

        const priceInterval = setInterval(updateAndReset, 60000)
        const countdownInterval = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => {
            clearInterval(priceInterval)
            clearInterval(countdownInterval)
        }
    }, [stocks]) // Re-run if stocks change

    // Utility to save stocks to state and localStorage
    const saveStocks = (newStocks: Stock[]) => {
        setStocks(newStocks)
        localStorage.setItem('stockMonitor_stocks', JSON.stringify(newStocks))
    }

    // Stock manipulation handlers
    const handleAddStock = (newStock: { ticker: string; name: string }) => {
        if (stocks.some(stock => stock.ticker === newStock.ticker)) {
            alert('This stock is already in the monitoring list.')
            return
        }
        const updatedStocks = [...stocks, newStock]
        saveStocks(updatedStocks)
        setIsSearchModalOpen(false)
    }

    const confirmDeleteStock = (stock: Stock) => {
        setDeleteConfirm({ isOpen: true, stock })
    }

    const executeDeleteStock = () => {
        if (deleteConfirm.stock) {
            const newStocks = stocks.filter(s => s.ticker !== deleteConfirm.stock!.ticker)
            saveStocks(newStocks)
        }
        setDeleteConfirm({ isOpen: false, stock: null })
    }

    // In-place editing handlers
    const handleStartEditing = (stock: Stock) => {
        setEditingTicker(stock.ticker)
        setTempName(stock.name)
    }

    const handleNameChange = (ticker: string) => {
        if (tempName.trim() === '') {
            setEditingTicker(null)
            return
        }
        const newStocks = stocks.map(s =>
            s.ticker === ticker ? { ...s, name: tempName.trim() } : s
        )
        saveStocks(newStocks)
        setEditingTicker(null)
    }

    const handleCancelEditing = () => {
        setEditingTicker(null)
    }

    // Import/Export/Reset handlers
    const exportStocks = () => {
        try {
            const exportData = {
                version: "1.0",
                exported_at: new Date().toISOString(),
                name: "我的股票組合",
                stocks: stocks.map((stock, index) => ({
                    ticker: stock.ticker,
                    name: stock.name,
                    added_at: new Date().toISOString(),
                    order: index
                }))
            }
            const dataStr = JSON.stringify(exportData, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `股票組合_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('匯出失敗:', error)
            alert('匯出失敗，請檢查控制台訊息')
        }
    }

    const importStocks = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.toLowerCase().endsWith('.json')) {
            alert('請選擇JSON格式的文件')
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string
                const importData = JSON.parse(content)

                if (!importData.stocks || !Array.isArray(importData.stocks)) {
                    alert('無效的JSON格式，請檢查文件內容')
                    return
                }

                const validatedStocks = importData.stocks.filter((stock: any) =>
                    typeof stock === 'object' && typeof stock.ticker === 'string' && typeof stock.name === 'string'
                );

                if (validatedStocks.length === 0) {
                    alert('文件中沒有有效的股票數據')
                    return
                }

                setImportConfirm({ isOpen: true, data: validatedStocks, dataType: 'json' })

            } catch (error) {
                console.error('解析JSON失敗:', error)
                alert('文件內容不是有效的JSON格式')
            }
        }
        reader.readAsText(file)
        e.target.value = ''
    }

    const executeImportStocks = () => {
        if (importConfirm.data && importConfirm.dataType === 'json') {
            const importedStocks = importConfirm.data
            const existingTickers = new Set(stocks.map(s => s.ticker))
            const newStocks = importedStocks.filter((s: Stock) => !existingTickers.has(s.ticker))
            saveStocks([...stocks, ...newStocks])
        }
        setImportConfirm({ isOpen: false, data: null, dataType: null })
    }

    const cancelImportStocks = () => {
        setImportConfirm({ isOpen: false, data: null, dataType: null })
    }

    const confirmResetData = () => {
        setResetConfirm({ isOpen: true })
    }

    const executeResetData = () => {
        localStorage.removeItem('stockMonitor_prices')
        localStorage.removeItem('stockMonitor_stocks')
        setStocks([
            { ticker: 'AAPL', name: 'Apple Inc.' },
            { ticker: '2330.TW', name: '台積電' },
            { ticker: '2317.TW', name: '鴻海' }
        ])
        setPrices({})
        setPreviousPrices({})
        setResetConfirm({ isOpen: false })
        window.location.reload()
    }

    const cancelResetData = () => {
        setResetConfirm({ isOpen: false })
    }

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setDraggedIndex(null)
        setDragOverIndex(null)
        e.currentTarget.style.opacity = '1'
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault()
        if (index !== draggedIndex) {
            setDragOverIndex(index)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        if (draggedIndex === null) return
        const newStocks = [...stocks]
        const [draggedStock] = newStocks.splice(draggedIndex, 1)
        newStocks.splice(dropIndex, 0, draggedStock)
        saveStocks(newStocks)
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const stockSummary = useMemo(() => {
        let up = 0, down = 0, unchanged = 0;
        stocks.forEach(stock => {
            const current = prices[stock.ticker];
            const previous = previousPrices[stock.ticker];
            if (current !== undefined && previous !== undefined) {
                if (current > previous) up++;
                else if (current < previous) down++;
                else unchanged++;
            }
        });
        return { up, down, unchanged, total: stocks.length };
    }, [stocks, prices, previousPrices]);

    const getCardClass = (size: 'small' | 'medium' | 'large') => {
        switch (size) {
            case 'small': return 'p-4'
            case 'medium': return 'p-6'
            case 'large': return 'p-8'
        }
    }

    const getTextSize = (size: 'small' | 'medium' | 'large') => {
        switch (size) {
            case 'small': return 'text-lg'
            case 'medium': return 'text-xl'
            case 'large': return 'text-2xl'
        }
    }

    const getGridClass = (size: 'small' | 'medium' | 'large') => {
        switch (size) {
            case 'small': return 'grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
            case 'medium': return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            case 'large': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }
    }

    const cycleCardSize = () => {
        if (cardSize === 'small') setCardSize('medium')
        else if (cardSize === 'medium') setCardSize('large')
        else setCardSize('small')
    }

    const getSizeLabel = (size: 'small' | 'medium' | 'large') => {
        switch (size) {
            case 'small': return '小'
            case 'medium': return '中'
            case 'large': return '大'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">📈 股票即時監控系統</h1>
                        <p className="text-gray-600 dark:text-gray-400">即時監控您的投資組合，每 60 秒自動更新股價</p>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>總共: {stockSummary.total} | </span>
                            <span className="text-red-600"> 漲: {stockSummary.up}</span> |
                            <span className="text-green-600"> 跌: {stockSummary.down}</span> |
                            <span> 平: {stockSummary.unchanged}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={cycleCardSize}
                            className="px-3 py-1 text-sm"
                        >
                            卡片: {getSizeLabel(cardSize)}
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Control Panel */}
                <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4">
                        <Button onClick={updatePrices} disabled={loading}>{loading ? '更新中...' : '立即更新'}</Button>
                        <Button variant="outline" onClick={() => setIsSearchModalOpen(true)}><Plus className="w-4 h-4 mr-2" />新增股票</Button>
                        <Button
                            variant="outline"
                            onClick={exportStocks}
                            className="flex items-center gap-2"
                            disabled={stocks.length === 0}
                        >
                            <Upload className="w-4 h-4" />
                            匯出組合
                        </Button>
                        <Button
                            variant="outline"
                            onClick={importStocks}
                            className="flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            匯入組合
                        </Button>
                        <Button
                            variant="outline"
                            onClick={confirmResetData}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                            🗑️ 重置所有數據
                        </Button>
                    </div>
                    {lastUpdate && <div className="text-sm text-gray-500 dark:text-gray-400">最後更新：{lastUpdate.toLocaleTimeString('zh-TW')} ({countdown}秒後更新)</div>}
                </div>

                {/* Stock List */}
                {stocks.length === 0 ? (
                    <Card className="p-8 text-center"><p>尚未新增任何股票</p></Card>
                ) : (
                    <div className={`grid gap-4 ${getGridClass(cardSize)}`}>
                        {stocks.map((stock, index) => {
                            const currentPrice = prices[stock.ticker]
                            const previousPrice = previousPrices[stock.ticker]
                            const hasPrice = currentPrice !== undefined
                            const changeInfo = (hasPrice && previousPrice !== undefined) ? calculatePriceChange(currentPrice, previousPrice) : null

                            return (
                                <Card
                                    key={stock.ticker}
                                    className={`${getCardClass(cardSize)} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-move transition-all duration-200 ${draggedIndex === index ? 'opacity-50' : ''} ${dragOverIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDrop={(e) => handleDrop(e, index)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            {editingTicker === stock.ticker ? (
                                                <input
                                                    type="text"
                                                    value={tempName}
                                                    onChange={(e) => setTempName(e.target.value)}
                                                    onBlur={() => handleNameChange(stock.ticker)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleNameChange(stock.ticker)
                                                        if (e.key === 'Escape') handleCancelEditing()
                                                    }}
                                                    className={`w-full px-2 py-1 ${cardSize === 'small' ? 'text-sm' : cardSize === 'medium' ? 'text-lg' : 'text-xl'} font-semibold bg-gray-100 dark:bg-gray-700 border border-blue-500 rounded-md outline-none`}
                                                    autoFocus
                                                />
                                            ) : (
                                                <h3 className={`font-semibold ${cardSize === 'small' ? 'text-sm' : cardSize === 'medium' ? 'text-lg' : 'text-xl'} text-gray-900 dark:text-gray-100`}>{stock.name}</h3>
                                            )}
                                            <p className={`${cardSize === 'small' ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 font-mono`}>{stock.ticker}</p>
                                        </div>
                                        <StockMenu stock={stock} onEdit={handleStartEditing} onDelete={confirmDeleteStock} />
                                    </div>

                                    <div className="space-y-2">
                                        <div className={`${getTextSize(cardSize)} font-bold text-gray-900 dark:text-gray-100`}>
                                            {hasPrice ? `$${currentPrice.toFixed(2)}` : <span className="text-gray-400">載入中...</span>}
                                        </div>
                                        {changeInfo && (
                                            <div className={`flex items-center gap-2 ${cardSize === 'small' ? 'text-xs' : 'text-sm'} ${changeInfo.isUnchanged ? 'text-gray-500' : changeInfo.isPositive ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {changeInfo.isUnchanged ? <Minus className="w-4 h-4" /> : changeInfo.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                <span>
                                                    {changeInfo.isUnchanged ? '0.00 (0.00%)' : `${changeInfo.change > 0 ? '+' : ''}${changeInfo.change.toFixed(2)} (${changeInfo.change > 0 ? '+' : ''}${changeInfo.changePercent.toFixed(2)}%)`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            <StockSearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} onAddStock={handleAddStock} />

            {deleteConfirm.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">確認刪除</h3>
                            <p className="mb-6">確定要刪除股票「{deleteConfirm.stock?.name}」嗎？</p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setDeleteConfirm({ isOpen: false, stock: null })}>取消</Button>
                                <Button variant="primary" onClick={executeDeleteStock} className="bg-red-600 hover:bg-red-700">確認刪除</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Import Confirmation Modal */}
            {importConfirm.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">確認匯入</h3>
                            <p className="mb-4">即將匯入 {importConfirm.data.length} 支股票。是否繼續？</p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={cancelImportStocks}>取消</Button>
                                <Button variant="primary" onClick={executeImportStocks}>確認匯入</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {resetConfirm.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">確認重置</h3>
                            <p className="mb-6">確定要重置所有數據嗎？此動作將清除所有自訂股票並恢復為預設值。</p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={cancelResetData}>取消</Button>
                                <Button variant="primary" onClick={executeResetData} className="bg-red-600 hover:bg-red-700">確認重置</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    )
}