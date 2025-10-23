import { Stock, StockSearchResult, PriceData } from '@/types/stock'
import { searchTaiwanStock, getTaiwanStockName } from './taiwanStocks'

// 從原 Python 程式碼移植的股價取得邏輯
const getStockPriceFromYahoo = async (ticker: string): Promise<number | null> => {
    try {
        // 這裡會連接到真實的 Yahoo Finance API
        // 由於前端無法直接呼叫 Yahoo Finance，需要透過後端 API
        const response = await fetch(`/api/stocks?action=prices&symbols=${ticker}`)

        if (!response.ok) {
            throw new Error('API 呼叫失敗')
        }

        const data = await response.json()

        if (data && data.length > 0 && data[0].close_price) {
            return data[0].close_price
        }

        return null
    } catch (error) {
        console.error(`獲取 ${ticker} 股價失敗:`, error)
        return null
    }
}

// 模擬股價資料（作為後端 API 的參考）
const mockPriceData: { [key: string]: number } = {
    'AAPL': 0.0,
    'GOOGL': 0.0,
    'MSFT': 0.0,
    '2330.TW': 0.0,
    '2317.TW': 0.0,
    '2454.TW': 0.0,
    '2882.TW': 0.0,
    '2603.TW': 0.0,
}

export const searchStock = async (keyword: string): Promise<StockSearchResult[]> => {
    try {
        // 呼叫後端API進行真實的股票搜尋
        console.log(`前端搜尋股票: ${keyword}`)
        const response = await fetch(`/api/stocks?action=search&q=${encodeURIComponent(keyword)}`)

        if (!response.ok) {
            console.error(`API搜尋失敗: ${response.status} ${response.statusText}`)
            throw new Error('API搜尋失敗')
        }

        const data = await response.json()
        console.log(`搜尋結果:`, data)

        // 確保返回的資料格式正確
        if (Array.isArray(data)) {
            return data.map(item => ({
                ticker: item.ticker,
                name: item.name,
                exchange: item.exchange || 'UNKNOWN',
                type: 'stock'
            }))
        }

        console.error('API返回的資料格式不正確:', data)
        return []

    } catch (error) {
        console.error('搜尋股票失敗:', error)

        // 如果API呼叫失敗，回退到本地模擬搜尋
        console.log('使用本地模擬搜尋作為備用')
        const results: StockSearchResult[] = []
        const trimmedKeyword = keyword.trim()

        // 本地模擬搜尋邏輯
        const mockUSStocks: { [key: string]: string } = {
            'AAPL': 'Apple Inc.',
            'GOOGL': 'Alphabet Inc.',
            'MSFT': 'Microsoft Corporation',
            'TSLA': 'Tesla, Inc.',
            'AMZN': 'Amazon.com, Inc.',
            'META': 'Meta Platforms, Inc.',
        }

        // 搜尋美股
        if (/^[A-Za-z]+$/.test(trimmedKeyword) && trimmedKeyword.length <= 5) {
            for (const [ticker, name] of Object.entries(mockUSStocks)) {
                if (ticker.toLowerCase() === trimmedKeyword.toLowerCase()) {
                    results.push({
                        ticker: ticker,
                        name: name,
                        exchange: 'NASDAQ',
                        type: 'stock'
                    })
                    break
                }
            }
        }

        // 搜尋台股
        const taiwanTicker = searchTaiwanStock(keyword)
        if (taiwanTicker) {
            const name = getTaiwanStockName(taiwanTicker) || taiwanTicker.replace('.TW', '')
            results.push({
                ticker: taiwanTicker,
                name: name,
                exchange: 'TWSE',
                type: 'stock'
            })
        }

        console.log(`本地模擬搜尋結果:`, results)
        return results
    }
}

export const getStockPrice = async (ticker: string): Promise<number | null> => {
    try {
        // 優先使用Yahoo Finance真實資料
        const price = await getStockPriceFromYahoo(ticker)
        if (price !== null) {
            return price
        }

        // 如果Yahoo Finance失敗，使用本地模擬資料作為後備
        console.warn(`Yahoo Finance API失敗，使用本地模擬資料: ${ticker}`)
        await new Promise(resolve => setTimeout(resolve, 100))
        return mockPriceData[ticker] || null
    } catch (error) {
        console.error(`獲取 ${ticker} 股價失敗:`, error)
        // API失敗後，嘗試使用本地模擬資料
        try {
            await new Promise(resolve => setTimeout(resolve, 100))
            return mockPriceData[ticker] || null
        } catch {
            return null
        }
    }
}

export const getMultipleStockPrices = async (tickers: string[]): Promise<PriceData[]> => {
    const results: PriceData[] = []

    for (const ticker of tickers) {
        const price = await getStockPrice(ticker)
        if (price !== null) {
            results.push({
                ticker,
                close_price: price,
                timestamp: new Date().toISOString()
            })
        }
    }

    return results
}

export const calculatePriceChange = (currentPrice: number, previousPrice: number) => {
    const change = currentPrice - previousPrice
    const changePercent = previousPrice === 0 ? 0 : (change / previousPrice) * 100
    
    return {
        change,
        changePercent,
        isPositive: change > 0,
        isUnchanged: change === 0
    }
}
