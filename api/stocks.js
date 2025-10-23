// API 路由：股票搜尋和股價查詢
// 這將部署到 Vercel Functions

const yahooFinance = require('yahoo-finance2').default;
const axios = require('axios');

export default async function handler(req, res) {
    // 設定 CORS 標頭
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { action } = req.query;

    try {
        switch (action) {
            case 'search':
                return await handleSearch(req, res);
            case 'prices':
                return await handlePrices(req, res);
            default:
                res.status(400).json({ error: '無效的動作' });
        }
    } catch (error) {
        console.error('API 錯誤:', error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
}

async function handleSearch(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: '請提供搜尋關鍵字' });
    }

    try {
        // 這裡會連接到真實的股票搜尋 API
        // 目前先返回模擬結果
        const mockResults = await mockStockSearch(q);
        res.status(200).json(mockResults);
    } catch (error) {
        res.status(500).json({ error: '搜尋失敗' });
    }
}

async function handlePrices(req, res) {
    const { symbols } = req.query;

    if (!symbols) {
        return res.status(400).json({ error: '請提供股票代碼' });
    }

    const symbolList = symbols.split(',');

    try {
        // 真實的Yahoo Finance股價取得邏輯，參考原Python程式
        const prices = await getRealStockPrices(symbolList);
        res.status(200).json(prices);
    } catch (error) {
        console.error('獲取股價失敗:', error);
        res.status(500).json({ error: '獲取股價失敗' });
    }
}

// 模擬股票搜尋功能
async function mockStockSearch(keyword) {
    // 台股對照表
    const taiwanStocks = {
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
        '國泰金': '2882.TW',
        '富邦金': '2881.TW',
        '玉山金': '2884.TW',
        '兆豐金': '2886.TW',
        '第一金': '2892.TW',
        '中信金': '2891.TW',
        '台塑': '1301.TW',
        '南亞': '1303.TW',
        '台化': '1326.TW',
        '中鋼': '2002.TW',
        '台泥': '1101.TW',
        '遠東新': '1402.TW',
        '長榮': '2603.TW',
        '陽明': '2609.TW',
        '萬海': '2615.TW',
        '台達電': '2308.TW',
        '中華電': '2412.TW',
        '統一': '1216.TW',
    };

    const results = [];
    const upperKeyword = keyword.toUpperCase();

    // 搜尋美股
    if (/^[A-Z]+$/.test(upperKeyword) && upperKeyword.length <= 5) {
        const usStocks = {
            'AAPL': 'Apple Inc.',
            'GOOGL': 'Alphabet Inc.',
            'MSFT': 'Microsoft Corporation',
            'TSLA': 'Tesla, Inc.',
            'AMZN': 'Amazon.com, Inc.',
            'META': 'Meta Platforms, Inc.',
        };

        if (usStocks[upperKeyword]) {
            results.push({
                ticker: upperKeyword,
                name: usStocks[upperKeyword],
                exchange: 'NASDAQ',
                type: 'stock'
            });
        }
    }

    // 搜尋台股
    if (taiwanStocks[keyword]) {
        results.push({
            ticker: taiwanStocks[keyword],
            name: keyword,
            exchange: 'TWSE',
            type: 'stock'
        });
    }

    // 模糊搜尋
    if (results.length === 0) {
        for (const [name, ticker] of Object.entries(taiwanStocks)) {
            if (name.includes(keyword) || keyword.includes(name)) {
                results.push({
                    ticker: ticker,
                    name: name,
                    exchange: 'TWSE',
                    type: 'stock'
                });
            }
        }
    }

    return results;
}

// 真實的Yahoo Finance股價取得邏輯，直接使用Yahoo Finance公開API
async function getRealStockPrices(symbols) {
    const results = [];

    for (const symbol of symbols) {
        try {
            // 使用直接的Yahoo Finance API調用，完全匹配Python yfinance邏輯
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 5); // 5天前，相當於 period='5d'

            const period1 = Math.floor(startDate.getTime() / 1000);
            const period2 = Math.floor(endDate.getTime() / 1000);

            // 直接調用Yahoo Finance的chart API，相當於 yf.Ticker().history()
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1d&includePrePost=true&events=div%2Csplit`;

            console.log(`Fetching price for ${symbol} from: ${url}`);

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000
            });

            if (response.data && response.data.chart && response.data.chart.result && response.data.chart.result.length > 0) {
                const result = response.data.chart.result[0];

                if (result.indicators && result.indicators.quote && result.indicators.quote.length > 0) {
                    const quote = result.indicators.quote[0];
                    const closes = quote.close;

                    if (closes && closes.length > 0) {
                        // 取最新的收盤價，相當於原Python的data['Close'].iloc[-1]
                        let latestClose = null;

                        // 從最後往前找第一個非null的值
                        for (let i = closes.length - 1; i >= 0; i--) {
                            if (closes[i] !== null && closes[i] !== undefined && !isNaN(closes[i])) {
                                latestClose = closes[i];
                                break;
                            }
                        }

                        if (latestClose !== null) {
                            console.log(`${symbol} price found: ${latestClose}`);
                            results.push({
                                ticker: symbol,
                                close_price: latestClose,
                                timestamp: new Date().toISOString()
                            });
                            continue;
                        }
                    }
                }
            }

            // 如果直接API失敗，嘗試yahoo-finance2作為備用
            console.warn(`${symbol} 直接API失敗，嘗試yahoo-finance2`);
            try {
                const data = await yahooFinance.historical(symbol, {
                    period1: startDate.toISOString().split('T')[0],
                    period2: endDate.toISOString().split('T')[0],
                    interval: '1d'
                });

                if (data && data.length > 0) {
                    const latestData = data[data.length - 1];
                    if (latestData && latestData.close) {
                        results.push({
                            ticker: symbol,
                            close_price: latestData.close,
                            timestamp: new Date().toISOString()
                        });
                        continue;
                    }
                }
            } catch (yahooError) {
                console.warn(`${symbol} yahoo-finance2也失敗:`, yahooError.message);
            }

            // 都失敗了，返回錯誤訊息
            console.error(`無法獲取 ${symbol} 的股價資料`);
            results.push({
                ticker: symbol,
                error: '無法獲取股價資料',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error(`獲取 ${symbol} 股價時發生錯誤:`, error.message);
            results.push({
                ticker: symbol,
                error: '獲取股價失敗',
                timestamp: new Date().toISOString()
            });
        }
    }

    return results;
}

// 保留原有的模擬函數作為備用
async function mockGetPrices(symbols) {
    const mockPrices = {
        'AAPL': 175.50 + (Math.random() - 0.5) * 10,
        'GOOGL': 142.80 + (Math.random() - 0.5) * 8,
        'MSFT': 378.90 + (Math.random() - 0.5) * 15,
        '2330.TW': 765.00 + (Math.random() - 0.5) * 30,
        '2317.TW': 185.50 + (Math.random() - 0.5) * 12,
        '2454.TW': 890.00 + (Math.random() - 0.5) * 25,
        '2882.TW': 45.20 + (Math.random() - 0.5) * 3,
        '2603.TW': 125.50 + (Math.random() - 0.5) * 8,
    };

    const results = [];
    for (const symbol of symbols) {
        const price = mockPrices[symbol];
        if (price) {
            results.push({
                ticker: symbol,
                close_price: price,
                timestamp: new Date().toISOString()
            });
        } else {
            results.push({
                ticker: symbol,
                error: '模擬資料不存在',
                timestamp: new Date().toISOString()
            });
        }
    }

    return results;
}
