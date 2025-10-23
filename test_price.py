import yfinance as yf

# Try to get TSMC stock price
ticker = '2330.TW'
try:
    stock = yf.Ticker(ticker)
    data = stock.history(period='5d')
    if not data.empty:
        current_price = data['Close'].iloc[-1]
        print(f'{ticker} Python yfinance price: {current_price}')
    else:
        print(f'{ticker} No data available')

    # Let's also check info
    info = stock.info
    if info and 'regularMarketPrice' in info:
        print(f'{ticker} regularMarketPrice: {info["regularMarketPrice"]}')

except Exception as e:
    print(f'Error: {e}')
