export interface Stock {
    ticker: string
    name: string
    price?: number
    change?: number
    changePercent?: number
    lastUpdated?: string
}

export interface StockSearchResult {
    ticker: string
    name: string
    exchange?: string
    type?: 'stock' | 'etf' | 'index'
}

export interface PriceData {
    ticker: string
    close_price: number
    timestamp: string
}

export interface StockConfig {
    stocks: Stock[]
    lastUpdated?: string
    version: string
}

export interface TaiwanStockMap {
    [key: string]: string
}
