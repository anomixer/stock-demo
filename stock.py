import yfinance as yf
import pandas as pd
import time
import os
import json
from datetime import datetime

# 檔案路徑
config_file = os.path.abspath('./stock_config.json')
history_file = os.path.abspath('./stock_history.csv')

# 預設股票列表
default_stocks = [
    {'ticker': 'AAPL', 'name': 'Apple'},
    {'ticker': 'GOOGL', 'name': 'Alphabet'},
    {'ticker': 'MSFT', 'name': 'Microsoft'},
    {'ticker': '2330.TW', 'name': '台積電'}
]

# 常見台股代碼對照表（可擴充）
taiwan_stocks = {
    '台積電': '2330.TW',
    '鴻海': '2317.TW',
    '聯發科': '2454.TW',
    '台達電': '2308.TW',
    '中華電': '2412.TW',
    '統一': '1216.TW',
    '國泰金': '2882.TW',
    '富邦金': '2881.TW',
    '玉山金': '2884.TW',
    '兆豐金': '2886.TW',
    '第一金': '2892.TW',
    '聯電': '2303.TW',
    '日月光投控': '3711.TW',
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
    '華碩': '2357.TW',
    '廣達': '2382.TW',
    '和碩': '4938.TW',
    '緯創': '3231.TW',
    '仁寶': '2324.TW',
    '友達': '2409.TW',
    '群創': '3481.TW',
    '大立光': '3008.TW',
    '玉晶光': '3406.TW',
    '聯詠': '3034.TW',
    '瑞昱': '2379.TW',
    '祥碩': '5269.TW',
    '信驊': '5274.TW',
}

def clear_screen():
    """清除螢幕"""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header(title):
    """印出標題"""
    print('='*50)
    # 計算中文寬度：中文字算2個寬度，Emoji等2個寬度
    display_width = 0
    for char in title:
        if ord(char) > 127:  # 中文或Emoji
            display_width += 2
        else:
            display_width += 1
    
    padding = (50 - display_width) // 2
    print(' ' * padding + title)
    print('='*50)

def load_stock_config():
    """載入股票設定檔"""
    if os.path.exists(config_file):
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f'讀取設定檔錯誤：{e}，使用預設設定')
            return default_stocks
    else:
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(default_stocks, f, ensure_ascii=False, indent=2)
        return default_stocks

def save_stock_config(stocks):
    """儲存股票設定檔"""
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(stocks, f, ensure_ascii=False, indent=2)

def save_price_to_history(data):
    """儲存股價到歷史檔案"""
    df = pd.DataFrame(data)
    if os.path.exists(history_file):
        existing_df = pd.read_csv(history_file)
        combined_df = pd.concat([existing_df, df], ignore_index=True)
        combined_df = combined_df.drop_duplicates(subset='ticker', keep='last')
        combined_df.to_csv(history_file, index=False)
    else:
        df.to_csv(history_file, index=False)

def load_history():
    """讀取歷史股價資料"""
    try:
        if os.path.exists(history_file):
            return pd.read_csv(history_file)
        return None
    except Exception as e:
        return None

def calculate_change(current_price, previous_price):
    """計算漲跌幅"""
    change = current_price - previous_price
    change_percent = (change / previous_price) * 100
    return change, change_percent

def get_stock_price(ticker):
    """獲取單一股票的即時價格"""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period='5d')
        if not data.empty:
            return data['Close'].iloc[-1]
        return None
    except Exception as e:
        return None

def search_taiwan_stock(keyword):
    """搜尋台股（支援中文名稱和代碼）"""
    # 先檢查是否為完整的中文名稱
    if keyword in taiwan_stocks:
        ticker = taiwan_stocks[keyword]
        return {'ticker': ticker, 'name': keyword}
    
    # 模糊搜尋中文名稱
    matches = []
    for name, ticker in taiwan_stocks.items():
        if keyword in name:  # 改為簡單的 in 檢查，支援部分比對
            matches.append({'ticker': ticker, 'name': name})
    
    if matches:
        return matches
    
    # 檢查是否為股票代碼（純數字）
    if keyword.isdigit():
        ticker = f'{keyword}.TW'
        # 驗證是否有效
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            if 'symbol' in info and info.get('symbol'):
                name = info.get('longName') or info.get('shortName', ticker.replace('.TW', ''))
                return {'ticker': ticker, 'name': name}
        except:
            pass
    
    return None

def search_stock(ticker_or_keyword):
    """搜尋股票（支援美股代碼和台股）"""
    keyword = ticker_or_keyword.strip()
    
    # 如果包含中文或純數字，優先嘗試台股搜尋
    if any(ord(c) > 127 for c in keyword) or keyword.isdigit():
        tw_result = search_taiwan_stock(keyword)
        if tw_result:
            return tw_result
    
    # 美股搜尋（確保不是純數字才搜尋美股）
    if not keyword.isdigit():
        try:
            # 確保美股代碼為大寫
            ticker = keyword.upper()
            stock = yf.Ticker(ticker)
            info = stock.info
            
            # 檢查是否有效
            if 'symbol' in info and info.get('symbol'):
                return {
                    'ticker': info.get('symbol', ticker),
                    'name': info.get('longName') or info.get('shortName', '未知')
                }
        except:
            pass
    
    return None

def list_stocks(stocks):
    """列出所有股票"""
    clear_screen()
    print_header('📋 目前監控的股票清單')
    
    if not stocks:
        print('\n目前沒有任何股票\n')
        return
    
    print('\n{:<5} {:<12} {:<20}'.format('編號', '股票代碼', '公司名稱'))
    print('-'*50)
    for idx, stock in enumerate(stocks, 1):
        name = stock['name'][:18] if len(stock['name']) > 18 else stock['name']
        print('{:<5} {:<12} {:<20}'.format(idx, stock['ticker'], name))
    print()

def add_stock(stocks):
    """新增股票"""
    clear_screen()
    print_header('➕ 新增股票')
    
    print('\n提示：')
    print('  - 美股：輸入代碼（AAPL, TSLA, GOOGL）')
    print('  - 台股：輸入中文名稱（台積電、鴻海）或代碼（2330, 2317）')
    print('  - 輸入 q 返回主選單\n')
    
    while True:
        keyword = input('請輸入股票代碼或名稱：').strip()
        
        if keyword.lower() == 'q':
            return stocks
        
        if not keyword:
            print('❌ 請輸入有效的股票代碼或名稱\n')
            continue
        
        print(f'🔍 正在搜尋 "{keyword}"...')
        result = search_stock(keyword)
        
        if result:
            # 如果返回多個結果（模糊搜尋）
            if isinstance(result, list):
                print(f'\n找到 {len(result)} 個相符的股票：\n')
                for idx, stock in enumerate(result, 1):
                    print(f'  {idx}. {stock["name"]} ({stock["ticker"]})')
                
                choice = input(f'\n請選擇 (1-{len(result)}) 或按 Enter 取消：').strip()
                try:
                    idx = int(choice) - 1
                    if 0 <= idx < len(result):
                        result = result[idx]
                    else:
                        print('❌ 無效的選擇\n')
                        continue
                except (ValueError, IndexError):
                    print('❌ 已取消\n')
                    continue
            
            # 檢查是否已存在
            if any(s['ticker'] == result['ticker'] for s in stocks):
                print(f'⚠️  股票 {result["ticker"]} 已經在監控清單中\n')
                continue
            
            print(f'\n找到股票：')
            print(f'  代碼：{result["ticker"]}')
            print(f'  名稱：{result["name"]}')
            
            confirm = input('\n確認新增？(y/n)：').strip().lower()
            if confirm == 'y':
                stocks.append(result)
                save_stock_config(stocks)
                print(f'✓ 已新增 {result["ticker"]}\n')
            else:
                print('❌ 已取消\n')
        else:
            print(f'❌ 找不到股票 "{keyword}"')
            print('提示：台股請輸入中文名稱（如：鴻海）或代碼（如：2317）\n')
        
        cont = input('繼續新增？(y/n)：').strip().lower()
        if cont != 'y':
            break
    
    return stocks

def delete_stock(stocks):
    """刪除股票"""
    while True:
        list_stocks(stocks)
        
        if not stocks:
            input('\n按 Enter 返回...')
            return stocks
        
        print_header('🗑️  刪除股票')
        choice = input('\n請輸入要刪除的編號（輸入 q 返回）：').strip()
        
        if choice.lower() == 'q':
            return stocks
        
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(stocks):
                deleted = stocks[idx]
                confirm = input(f'\n確認刪除 {deleted["ticker"]} ({deleted["name"]})？(y/n)：').strip().lower()
                if confirm == 'y':
                    stocks.pop(idx)
                    save_stock_config(stocks)
                    print(f'✓ 已刪除 {deleted["ticker"]}\n')
                    time.sleep(1)
                else:
                    print('❌ 已取消\n')
                    time.sleep(1)
            else:
                print('❌ 無效的編號\n')
                time.sleep(1)
        except ValueError:
            print('❌ 請輸入有效的數字\n')
            time.sleep(1)

def edit_stock(stocks):
    """編輯股票名稱"""
    while True:
        list_stocks(stocks)
        
        if not stocks:
            input('\n按 Enter 返回...')
            return stocks
        
        print_header('✏️  編輯股票名稱')
        choice = input('\n請輸入要編輯的編號（輸入 q 返回）：').strip()
        
        if choice.lower() == 'q':
            return stocks
        
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(stocks):
                stock = stocks[idx]
                print(f'\n目前資訊：')
                print(f'  代碼：{stock["ticker"]}')
                print(f'  名稱：{stock["name"]}')
                
                new_name = input(f'\n請輸入新的名稱（直接按 Enter 取消）：').strip()
                if new_name:
                    stocks[idx]['name'] = new_name
                    save_stock_config(stocks)
                    print(f'✓ 已更新\n')
                    time.sleep(1)
                else:
                    print('❌ 已取消\n')
                    time.sleep(1)
            else:
                print('❌ 無效的編號\n')
                time.sleep(1)
        except ValueError:
            print('❌ 請輸入有效的數字\n')
            time.sleep(1)

def show_taiwan_stock_list():
    """顯示支援的台股列表"""
    clear_screen()
    print_header('📊 支援的台股列表（部分）')
    
    print('\n以下台股可直接用中文名稱搜尋：\n')
    
    # 分類顯示
    categories = {
        '科技股': ['台積電', '聯發科', '華碩', '廣達', '和碩', '聯電', '日月光投控', '聯詠', '瑞昱'],
        '金融股': ['國泰金', '富邦金', '玉山金', '兆豐金', '第一金', '中信金'],
        '傳產股': ['台塑', '南亞', '台化', '中鋼', '台泥', '遠東新'],
        '航運股': ['長榮', '陽明', '萬海'],
        '其他': ['鴻海', '台達電', '中華電', '統一']
    }
    
    for category, stocks_list in categories.items():
        print(f'{category}：')
        for i in range(0, len(stocks_list), 4):
            line = stocks_list[i:i+4]
            print('  ' + '、'.join(f'{name}({taiwan_stocks[name].replace(".TW", "")})' for name in line))
        print()
    
    print('提示：也可以直接輸入股票代碼（例如：2330）\n')
    input('按 Enter 返回...')

def monitor_stocks(stocks):
    """即時監控股票"""
    if not stocks:
        clear_screen()
        print_header('📊 即時監控')
        print('\n❌ 沒有股票可以監控，請先新增股票\n')
        input('按 Enter 返回...')
        return
    
    print('\n開始監控，按 Ctrl+C 停止...\n')
    time.sleep(2)
    
    first_run = True
    
    try:
        while True:
            clear_screen()
            print_header('📊 即時股價監控')
            print(f'更新時間：{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
            print('='*50 + '\n')
            
            # 第一次執行時顯示獲取進度
            if first_run:
                print('正在獲取股價資料...')
            
            data = []
            current_data = []
            
            for stock in stocks:
                ticker = stock['ticker']
                
                if first_run:
                    print(f'  獲取 {ticker}...', end=' ', flush=True)
                
                close_price = get_stock_price(ticker)
                
                if close_price is None or pd.isna(close_price):
                    if first_run:
                        print('❌')
                    data.append({
                        '公司名稱': stock['name'],
                        '股票代碼': ticker,
                        '即時股價': '無資料',
                        '漲跌': 'N/A',
                        '漲跌幅': 'N/A'
                    })
                    continue
                
                if first_run:
                    print('✓')
                
                # 計算漲跌
                history_df = load_history()
                if history_df is not None and ticker in history_df['ticker'].values:
                    previous_price = history_df[history_df['ticker'] == ticker]['close_price'].iloc[-1]
                    change, change_percent = calculate_change(close_price, previous_price)
                    change_str = f'{change:+.2f}'
                    change_percent_str = f'{change_percent:+.2f}%'
                else:
                    change_str = 'N/A'
                    change_percent_str = 'N/A'

                data.append({
                    '公司名稱': stock['name'],
                    '股票代碼': ticker,
                    '即時股價': f'${close_price:.2f}',
                    '漲跌': change_str,
                    '漲跌幅': change_percent_str
                })
                
                current_data.append({'ticker': ticker, 'close_price': close_price})

            # 清除畫面重新顯示
            if first_run:
                time.sleep(1)
                clear_screen()
                print_header('📊 即時股價監控')
                print(f'更新時間：{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
                print('='*50 + '\n')
                first_run = False
            
            df = pd.DataFrame(data)
            pd.set_option('display.unicode.east_asian_width', True)
            pd.set_option('display.max_columns', None)
            pd.set_option('display.width', 50)
            pd.set_option('display.max_colwidth', 10)
            
            print(df.to_string(index=False))
            print('\n' + '='*50)
            next_update = datetime.now().timestamp() + 60
            print(f'下次更新：{datetime.fromtimestamp(next_update).strftime("%H:%M:%S")}')
            print('按 Ctrl+C 停止監控')
            print('='*50)

            # 儲存歷史
            if current_data:
                save_price_to_history(current_data)

            time.sleep(60)
            
    except KeyboardInterrupt:
        print('\n\n✓ 已停止監控')
        time.sleep(2)

def main_menu():
    """主選單"""
    stocks = load_stock_config()
    
    while True:
        clear_screen()
        print_header('📈 股票即時監控系統 v0.1')
        
        print('\n主選單：\n')
        print('  1. 📊 開始監控股票')
        print('  2. 📋 查看股票清單')
        print('  3. ➕ 新增股票')
        print('  4. 🗑️ 刪除股票')
        print('  5. ✏️ 編輯股票')
        print('  6. 📖 查看支援的台股')
        print('  7. 🚪 離開程式')
        print()
        
        choice = input('請選擇功能 (1-7)：').strip()
        
        if choice == '1':
            monitor_stocks(stocks)
        elif choice == '2':
            list_stocks(stocks)
            input('\n按 Enter 返回...')
        elif choice == '3':
            stocks = add_stock(stocks)
        elif choice == '4':
            stocks = delete_stock(stocks)
        elif choice == '5':
            stocks = edit_stock(stocks)
        elif choice == '6':
            show_taiwan_stock_list()
        elif choice == '7':
            clear_screen()
            print('\n👋 感謝使用，再見！\n')
            break
        else:
            print('\n❌ 無效的選項，請重新選擇\n')
            time.sleep(1)

if __name__ == '__main__':
    try:
        main_menu()
    except KeyboardInterrupt:
        clear_screen()
        print('\n\n👋 程式已中斷，再見！\n')
    except Exception as e:
        print(f'\n❌ 發生錯誤：{e}\n')
