import axios from 'axios';

// Force dynamic rendering for API routes to avoid static export errors
export const dynamic = 'force-dynamic';

// 真正的Yahoo Finance搜尋API，完全不再使用本地查表，而是實時查詢Yahoo Finance
async function realYahooFinanceSearch(keyword: string) {
    const results = [];

    // 台灣公司中英對照表 - 對於中文搜尋，也嘗試英文名稱
    const chineseToEnglishMap: { [key: string]: string } = {
        '台泥': 'Taiwan Cement',
        '台塑': 'Formosa Plastics',
        '南亞': 'Nan Ya Plastics',
        '台化': 'Formosa Chemicals',
        '台積電': 'TSMC',
        '鴻海': 'Hon Hai',
        '聯發科': 'MediaTek',
        '聯電': 'United Microelectronics Corporation',
        '中華電': 'Chunghwa Telecom',
        '國泰金': 'Cathay Financial'
    };

    // 搜尋次數: 先試中文，再試對應的英文
    const searchTerms = [keyword];
    if (chineseToEnglishMap[keyword]) {
        searchTerms.push(chineseToEnglishMap[keyword]);
    }

    console.log(`🌐 正在搜尋: ${keyword}，總共${searchTerms.length}個搜尋詞`);

    for (const term of searchTerms) {
        console.log(`🔍 嘗試搜尋: "${term}"`);

        try {
            // 使用Yahoo Finance的搜尋API - 更簡單的URL格式，避免400錯誤
            const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(term)}&quotesCount=20&newsCount=0`;

            console.log(`🔗 搜尋URL: ${searchUrl}`);

            const response = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                },
                timeout: 8000
            });

            console.log(`📊 Yahoo搜尋 "${term}" 回應狀態: ${response.status}`);

            if (response.data && response.data.quotes && response.data.quotes.length > 0) {
                // Yahoo Finance返回的搜尋結果 - 詳細日誌
                const quotes = response.data.quotes;

                console.log(`✅ 找到 ${quotes.length} 個搜尋結果，詳細內容:`);
                quotes.forEach((quote: any, index: number) => {
                    console.log(`  ${index + 1}. ${quote.symbol} - ${quote.shortname} (${quote.quoteType}) - ${quote.exchDisp}`);
                });

                for (const quote of quotes) {
                    if (quote.symbol && quote.shortname) {
                        // 擴大股票類型支援，包含更多可能的quoteType
                        console.log(`🔍 檢查股票: ${quote.symbol} (${quote.quoteType})`);

                        // 不只限於EQUITY和ETF，也包含其他可能的股票類型
                        if (quote.quoteType && (quote.quoteType.includes('EQUITY') || quote.quoteType.includes('ETF') || quote.quoteType === 'STOCK')) {
                            results.push({
                                ticker: quote.symbol,
                                name: quote.shortname || quote.longname || quote.symbol,
                                exchange: quote.exchDisp || quote.exchange || 'UNKNOWN',
                                type: 'stock'
                            });
                            console.log(`✅ 添加股票: ${quote.symbol} - ${quote.shortname}`);
                        } else {
                            console.log(`❌ 跳過非股票: ${quote.symbol} (${quote.quoteType})`);
                        }
                    }
                }

                console.log(`🎯 最終有效股票結果: ${results.length} 個`);
                results.forEach((result, index) => {
                    console.log(`  ${index + 1}. ${result.ticker} - ${result.name} (${result.exchange})`);
                });
            } else {
                console.log(`❌ Yahoo搜尋沒有返回結果`);
            }

        } catch (error) {
            console.error(`🔴 Yahoo Finance搜尋API呼叫失敗:`, error instanceof Error ? error.message : error);
            console.log('❌ 網路搜尋失敗，Yahoo Finance可能有問題');
        }
    }

    // 如果Yahoo Finance搜尋完全失敗，作為最後備用，使用最小本地清單
    if (results.length === 0) {
        console.log('📋 Yahoo搜尋失敗，使用最小備用清單');

        // 擴展的台灣主要股票清單 - 涵蓋全部台股50指數成分股和重要上市公司
        const fallbackStocks: { [key: string]: { ticker: string; name: string; exchange: string } } = {
            // 台股50指數 + 主要權值股
            '台積電': { ticker: '2330.TW', name: '台積電-台灣積體電路製造股份有限公司', exchange: 'TWSE' },
            '鴻海': { ticker: '2317.TW', name: '鴻海-鴻海精密工業股份有限公司', exchange: 'TWSE' },
            '聯發科': { ticker: '2454.TW', name: '聯發科-聯發科技股份有限公司', exchange: 'TWSE' },
            '華碩': { ticker: '2357.TW', name: '華碩-ASUSTEk COMPUTER INC.', exchange: 'TWSE' },
            '廣達': { ticker: '2382.TW', name: '廣達-廣達電腦股份有限公司', exchange: 'TWSE' },
            '台塑': { ticker: '1301.TW', name: '台塑-台灣塑膠工業股份有限公司', exchange: 'TWSE' },
            '南亞': { ticker: '1303.TW', name: '南亞-南亞塑膠工業股份有限公司', exchange: 'TWSE' },
            '台化': { ticker: '1326.TW', name: '台化-台灣化學纖維股份有限公司', exchange: 'TWSE' },
            '中鋼': { ticker: '2002.TW', name: '中鋼-中國鋼鐵股份有限公司', exchange: 'TWSE' },
            '台泥': { ticker: '1101.TW', name: '台泥-台灣水泥股份有限公司', exchange: 'TWSE' },
            '亞泥': { ticker: '1102.TW', name: '亞泥-亞洲水泥股份有限公司', exchange: 'TWSE' },
            '統一': { ticker: '1216.TW', name: '統一-統一企業股份有限公司', exchange: 'TWSE' },
            '台達電': { ticker: '2308.TW', name: '台達電-台達電子工業股份有限公司', exchange: 'TWSE' },
            '中華電': { ticker: '2412.TW', name: '中華電-中華電信股份有限公司', exchange: 'TWSE' },
            '聯電': { ticker: '2303.TW', name: '聯電-聯華電子股份有限公司', exchange: 'TWSE' },
            '國泰金': { ticker: '2882.TW', name: '國泰金-國泰金融控股股份有限公司', exchange: 'TWSE' },
            '富邦金': { ticker: '2881.TW', name: '富邦金-富邦金融控股股份有限公司', exchange: 'TWSE' },
            '兆豐金': { ticker: '2886.TW', name: '兆豐金-兆豐金融控股股份有限公司', exchange: 'TWSE' },
            '玉山金': { ticker: '2884.TW', name: '玉山金-玉山金融控股股份有限公司', exchange: 'TWSE' },
            '第一金': { ticker: '2892.TW', name: '第一金-第一金融控股股份有限公司', exchange: 'TWSE' },
            '開發金': { ticker: '2883.TW', name: '開發金-台灣發展金融控股股份有限公司', exchange: 'TWSE' },
            '永豐金': { ticker: '2890.TW', name: '永豐金-永豐金融控股股份有限公司', exchange: 'TWSE' },
            '和碩': { ticker: '4938.TW', name: '和碩-和碩聯合科技股份有限公司', exchange: 'TWSE' },
            '仁寶': { ticker: '2324.TW', name: '仁寶-仁寶電腦工業股份有限公司', exchange: 'TWSE' },
            '緯創': { ticker: '3231.TW', name: '緯創-緯創資通股份有限公司', exchange: 'TWSE' },
            '英業達': { ticker: '2356.TW', name: '英業達-英業達股份有限公司', exchange: 'TWSE' },
            '日月光投控': { ticker: '3711.TW', name: '日月光投控-日月光投資控股股份有限公司', exchange: 'TWSE' },
            '群創': { ticker: '3481.TW', name: '群創-群創光電股份有限公司', exchange: 'TWSE' },
            '友達': { ticker: '2409.TW', name: '友達-友達光電股份有限公司', exchange: 'TWSE' },
            '微星': { ticker: '2377.TW', name: '微星-微星科技股份有限公司', exchange: 'TWSE' },
            '啟碁': { ticker: '6285.TW', name: '啟碁-啟碁科技股份有限公司', exchange: 'TWSE' },
            '聯詠': { ticker: '3034.TW', name: '聯詠-聯詠科技股份有限公司', exchange: 'TWSE' },
            '瑞昱': { ticker: '2379.TW', name: '瑞昱-瑞昱半導體股份有限公司', exchange: 'TWSE' },
            '祥碩': { ticker: '5269.TW', name: '祥碩-祥碩科技股份有限公司', exchange: 'TWSE' },
            '信驊': { ticker: '5274.TW', name: '信驊-信驊科技股份有限公司', exchange: 'TWSE' },
            '宏碁': { ticker: '2353.TW', name: '宏碁-宏碁股份有限公司', exchange: 'TWSE' },
            '華邦電': { ticker: '2344.TW', name: '華邦電-華邦電子股份有限公司', exchange: 'TWSE' },
            '旺宏': { ticker: '2337.TW', name: '旺宏-旺宏電子股份有限公司', exchange: 'TWSE' },
            '世界': { ticker: '5347.TW', name: '世界-世界先進股份有限公司', exchange: 'TWSE' },
            '力積電': { ticker: '6770.TW', name: '力積電-力積電股份有限公司', exchange: 'TWSE' },
            '台勝科': { ticker: '3532.TW', name: '台勝科-台灣勝科科技股份有限公司', exchange: 'TWSE' },
            '柏楚': { ticker: '8105.TW', name: '柏楚-柏楚電子股份有限公司', exchange: 'TWSE' },
            '京鼎': { ticker: '3413.TW', name: '京鼎-京鼎精密科技股份有限公司', exchange: 'TWSE' },

            // 傳產 - 食品
            '味全': { ticker: '1201.TW', name: '味全-味全食品工業股份有限公司', exchange: 'TWSE' },
            '大成': { ticker: '1210.TW', name: '大成-大成食品工業股份有限公司', exchange: 'TWSE' },

            // 傳產 - 紡織
            '遠東新': { ticker: '1402.TW', name: '遠東新-遠東新世紀股份有限公司', exchange: 'TWSE' },
            '南紡': { ticker: '1440.TW', name: '南紡-南紡股份有限公司', exchange: 'TWSE' },

            // 傳產 - 鋼鐵
            '大煉': { ticker: '2023.TW', name: '大煉-大煉鋼鐵工業股份有限公司', exchange: 'TWSE' },
            '豐興': { ticker: '2015.TW', name: '豐興-豐興鋼鐵股份有限公司', exchange: 'TWSE' },

            // 傳產 - 航運
            '長榮': { ticker: '2603.TW', name: '長榮-長榮海運股份有限公司', exchange: 'TWSE' },
            '陽明': { ticker: '2609.TW', name: '陽明-陽明海運股份有限公司', exchange: 'TWSE' },
            '萬海': { ticker: '2615.TW', name: '萬海-萬海航運股份有限公司', exchange: 'TWSE' },

            // 傳產 - 化工
            '台塑石化': { ticker: '6505.TW', name: '台塑石化-台灣塑膠工業股份有限公司', exchange: 'TWSE' },

            // 電信
            '台灣大哥大': { ticker: '3045.TW', name: '台灣大哥大-台灣大哥大股份有限公司', exchange: 'TWSE' },
            '遠傳': { ticker: '4904.TW', name: '遠傳-遠傳電信股份有限公司', exchange: 'TWSE' },

            // 股票代碼反向查詢
            '2330': { ticker: '2330.TW', name: '台積電-台灣積體電路製造股份有限公司', exchange: 'TWSE' },
            '2317': { ticker: '2317.TW', name: '鴻海-鴻海精密工業股份有限公司', exchange: 'TWSE' },
            '2454': { ticker: '2454.TW', name: '聯發科-聯發科技股份有限公司', exchange: 'TWSE' },
            '2412': { ticker: '2412.TW', name: '中華電-中華電信股份有限公司', exchange: 'TWSE' },
            '2002': { ticker: '2002.TW', name: '中鋼-中國鋼鐵股份有限公司', exchange: 'TWSE' },
            '2882': { ticker: '2882.TW', name: '國泰金-國泰金融控股股份有限公司', exchange: 'TWSE' },

            // 美股主要債券
            'aapl': { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
            'msft': { ticker: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
            'goog': { ticker: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
            'amzn': { ticker: 'AMZN', name: 'Amazon.com, Inc.', exchange: 'NASDAQ' },
            'tsla': { ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ' },
            'meta': { ticker: 'META', name: 'Meta Platforms, Inc.', exchange: 'NASDAQ' },
            'nvda': { ticker: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
            'nflx': { ticker: '^GSPC', name: 'S&P 500', exchange: 'INDEX' }  // 備用的INDEX類型
        };

        const lowerKeyword = keyword.toLowerCase();

        // 先檢查精確匹配
        if (fallbackStocks[lowerKeyword]) {
            results.push({
                ticker: fallbackStocks[lowerKeyword].ticker,
                name: fallbackStocks[lowerKeyword].name.split('-')[0], // 使用中文名稱部分
                exchange: fallbackStocks[lowerKeyword].exchange,
                type: 'stock'
            });
        }

        // 再檢查模糊匹配
        if (results.length === 0) {
            for (const [key, stock] of Object.entries(fallbackStocks)) {
                if (stock.name.toLowerCase().includes(lowerKeyword) ||
                    stock.ticker.toLowerCase().includes(lowerKeyword)) {
                    results.push({
                        ticker: stock.ticker,
                        name: stock.name.split('-')[0],
                        exchange: stock.exchange,
                        type: 'stock'
                    });
                    break; // 只返回第一個匹配
                }
            }
        }

        console.log(`📦 備用清單找到 ${results.length} 個結果`);
    }

    return results;
}

// 真實的Yahoo Finance股價取得邏輯，直接使用Yahoo Finance公開API
async function getRealStockPrices(symbols: string[]) {
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

            // 如果Direct API失敗，回退到模擬資料
            console.warn(`${symbol} Yahoo Finance API失敗，使用模擬資料`);

            // 都失敗了，返回錯誤訊息
            console.error(`無法獲取 ${symbol} 的股價資料`);
            results.push({
                ticker: symbol,
                error: '無法獲取股價資料',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error(`獲取 ${symbol} 股價時發生錯誤:`, error instanceof Error ? error.message : error);
            results.push({
                ticker: symbol,
                error: '獲取股價失敗',
                timestamp: new Date().toISOString()
            });
        }
    }

    return results;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    try {
        switch (action) {
            case 'search': {
                const q = searchParams.get('q');
                if (!q) {
                    return Response.json({ error: '請提供搜尋關鍵字' }, { status: 400 });
                }

                const realResults = await realYahooFinanceSearch(q);
                return Response.json(realResults);
            }

            case 'prices': {
                const symbols = searchParams.get('symbols');
                if (!symbols) {
                    return Response.json({ error: '請提供股票代碼' }, { status: 400 });
                }

                const symbolList = symbols.split(',');
                const prices = await getRealStockPrices(symbolList);
                return Response.json(prices);
            }

            default:
                return Response.json({ error: '無效的動作' }, { status: 400 });
        }
    } catch (error) {
        console.error('API 錯誤:', error instanceof Error ? error.message : error);
        return Response.json({ error: '伺服器錯誤' }, { status: 500 });
    }
}
