import { TaiwanStockMap } from '@/types/stock'

export const taiwanStocks: TaiwanStockMap = {
    // 科技股
    '台積電': '2330.TW',
    '鴻海': '2317.TW',
    '聯發科': '2454.TW',
    '華碩': '2357.TW',
    '廣達': '2382.TW',
    '和碩': '4938.TW',
    '聯電': '2303.TW',
    '日月光投控': '3711.TW',
    '聯詠': '3034.TW',
    '瑞昱': '2379.TW',
    '祥碩': '5269.TW',
    '信驊': '5274.TW',
    '緯創': '3231.TW',
    '仁寶': '2324.TW',
    '友達': '2409.TW',
    '群創': '3481.TW',
    '大立光': '3008.TW',
    '玉晶光': '3406.TW',

    // 金融股
    '國泰金': '2882.TW',
    '富邦金': '2881.TW',
    '玉山金': '2884.TW',
    '兆豐金': '2886.TW',
    '第一金': '2892.TW',
    '中信金': '2891.TW',

    // 傳產股
    '台塑': '1301.TW',
    '南亞': '1303.TW',
    '台化': '1326.TW',
    '中鋼': '2002.TW',
    '台泥': '1101.TW',
    '遠東新': '1402.TW',

    // 航運股
    '長榮': '2603.TW',
    '陽明': '2609.TW',
    '萬海': '2615.TW',

    // 其他
    '台達電': '2308.TW',
    '中華電': '2412.TW',
    '統一': '1216.TW',
}

export const searchTaiwanStock = (keyword: string): string | null => {
    // 直接搜尋完整名稱
    if (taiwanStocks[keyword]) {
        return taiwanStocks[keyword]
    }

    // 模糊搜尋
    for (const [name, ticker] of Object.entries(taiwanStocks)) {
        if (name.includes(keyword) || keyword.includes(name)) {
            return ticker
        }
    }

    return null
}

export const getTaiwanStockName = (ticker: string): string | null => {
    for (const [name, stockTicker] of Object.entries(taiwanStocks)) {
        if (stockTicker === ticker) {
            return name
        }
    }
    return null
}
