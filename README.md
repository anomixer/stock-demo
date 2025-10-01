# 📈 股票即時監控系統

一個功能完整的終端機介面 (TUI) 股票即時監控工具，可在任何支援Python的環境下執行。支援美股與台股查詢，提供友善的中文介面與智慧搜尋功能。

![Version](https://img.shields.io/badge/version-0.1-blue.svg)
![Python](https://img.shields.io/badge/python-3.7+-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

## ✨ 主要特色

- 🖥️ **友善的 TUI 介面** - 全中文互動式選單操作
- 🔍 **智慧搜尋功能** - 支援中文名稱、股票代碼模糊搜尋
- 📊 **即時股價監控** - 每 60 秒自動更新股價資訊
- 📈 **漲跌幅計算** - 自動計算與顯示股價變化
- 🌏 **多市場支援** - 美股、台股、港股等
- 💾 **資料持久化** - JSON 設定檔 + CSV 歷史紀錄
- 🎯 **40+ 台股快速查詢** - 內建常見台股中文名稱對照

## 📸 截圖展示

```
==================================================
            📈 股票即時監控系統 v0.1
==================================================

主選單：

  1. 📊 開始監控股票
  2. 📋 查看股票清單
  3. ➕ 新增股票
  4. 🗑️ 刪除股票
  5. ✏️ 編輯股票
  6. 📖 查看支援的台股
  7. 🚪 離開程式

請選擇功能 (1-7)：
```

## 🚀 快速開始

### 系統需求

- Python 3.7 或更高版本
- pip (Python 套件管理工具)

### 📦 Python 安裝指南

如果您是第一次使用 Python，請根據您的作業系統選擇對應的安裝方式：

#### 🍎 macOS

**方法一：使用 Homebrew（推薦）**
```bash
# 如果還沒安裝 Homebrew，先安裝它
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安裝 Python
brew install python3

# 驗證安裝
python3 --version
pip3 --version
```

**方法二：官方安裝包**
1. 前往 [Python 官網](https://www.python.org/downloads/)
2. 下載 macOS 安裝程式
3. 執行安裝程式，按照提示完成安裝
4. 打開「終端機」，輸入 `python3 --version` 驗證

#### 🐧 Linux (Ubuntu/Debian)

```bash
# 更新套件列表
sudo apt update

# 安裝 Python 3 和 pip
sudo apt install python3 python3-pip

# 驗證安裝
python3 --version
pip3 --version
```

**其他 Linux 發行版**
- **Fedora/CentOS/RHEL**: `sudo dnf install python3 python3-pip`
- **Arch Linux**: `sudo pacman -S python python-pip`
- **openSUSE**: `sudo zypper install python3 python3-pip`

#### 🪟 Windows

**方法一：Microsoft Store（推薦，適合 Windows 10/11）**
1. 打開「Microsoft Store」
2. 搜尋「Python 3.12」（或最新版本）
3. 點擊「取得」或「安裝」
4. 安裝完成後，打開「命令提示字元」或「PowerShell」
5. 輸入 `python --version` 和 `pip --version` 驗證

**方法二：官方安裝程式**
1. 前往 [Python 官網](https://www.python.org/downloads/)
2. 下載 Windows 安裝程式
3. **重要**：執行安裝時，勾選「Add Python to PATH」
4. 按照提示完成安裝
5. 打開「命令提示字元」，輸入 `python --version` 驗證

**驗證 Python 是否正確安裝**
```cmd
python --version
pip --version
```

### 💡 快速安裝（使用自動腳本）

我們提供了自動安裝腳本，可以快速完成套件安裝：

#### macOS / Linux
```bash
chmod +x install.sh
./install.sh
```

#### Windows
```cmd
install.bat
```

自動腳本會執行以下操作：
- ✅ 檢查 Python 版本
- ✅ 自動安裝所需套件
- ✅ 驗證安裝結果

### 📥 手動安裝步驟

1. **Clone 專案**
```bash
git clone https://github.com/anomixer/stock-demo
cd stock-demo
```

2. **安裝相依套件**

**macOS / Linux:**
```bash
pip3 install -r requirements.txt
```

**Windows:**
```cmd
pip install -r requirements.txt
```

或手動安裝：
```bash
pip install yfinance pandas
```

3. **執行程式**

**macOS / Linux:**
```bash
python3 stock.py
```

**Windows:**
```cmd
python stock.py
```

## 📖 使用說明

### 主選單功能

#### 1️⃣ 開始監控股票
啟動即時股價監控，每 60 秒自動更新：
- 顯示即時股價
- 計算漲跌金額與漲跌幅
- 按 `Ctrl+C` 停止監控

#### 2️⃣ 查看股票清單
列出目前監控的所有股票

#### 3️⃣ 新增股票
支援多種搜尋方式：

**美股**：
```
請輸入股票代碼或名稱：AAPL
請輸入股票代碼或名稱：TSLA
```

**台股（中文名稱）**：
```
請輸入股票代碼或名稱：台積電
請輸入股票代碼或名稱：鴻海
請輸入股票代碼或名稱：聯發科
```

**台股（代碼）**：
```
請輸入股票代碼或名稱：2330
請輸入股票代碼或名稱：2317
```

**模糊搜尋**：
```
請輸入股票代碼或名稱：積
→ 找到：台積電 (2330.TW)

請輸入股票代碼或名稱：金
→ 找到 6 個相符的股票：
   1. 國泰金 (2882.TW)
   2. 富邦金 (2881.TW)
   ...
```

#### 4️⃣ 刪除股票
選擇編號刪除指定股票

#### 5️⃣ 編輯股票
修改股票的顯示名稱

#### 6️⃣ 查看支援的台股
顯示內建的 40+ 支台股清單

## 📂 專案結構

```
stock-demo/
├── stock.py              # 主程式
├── install.sh            # macOS/Linux 自動安裝腳本
├── install.bat           # Windows 自動安裝腳本
├── stock_config.json     # 股票清單設定檔（自動生成）
├── stock_history.csv     # 股價歷史紀錄（自動生成）
├── README.md             # 專案說明文件
├── requirements.txt      # Python 套件相依清單
└── .gitignore            # Git 忽略檔案設定
```

## 📋 資料檔案格式

### stock_config.json
儲存使用者自訂的股票監控清單：
```json
[
  {
    "ticker": "AAPL",
    "name": "Apple"
  },
  {
    "ticker": "2330.TW",
    "name": "台積電"
  }
]
```

### stock_history.csv
儲存股價歷史紀錄，用於計算漲跌幅：
```csv
ticker,close_price
AAPL,225.50
2330.TW,1325.00
```

## 🎯 支援的股票市場

| 市場 | 代碼格式 | 範例 |
|------|---------|------|
| 美股 | 直接使用代碼 | `AAPL`, `GOOGL`, `TSLA` |
| 台股 | 代碼 + `.TW` | `2330.TW`, `2317.TW` |
| 港股 | 代碼 + `.HK` | `0700.HK`, `9988.HK` |

## 🔧 進階設定

### 修改更新頻率
編輯 `stock.py` 中的更新間隔（預設 60 秒）：
```python
time.sleep(60)  # 改為您想要的秒數
```

### 新增更多台股名稱對照
編輯 `taiwan_stocks` 字典：
```python
taiwan_stocks = {
    '台積電': '2330.TW',
    '您的股票': '代碼.TW',
    # ... 更多股票
}
```

## 🐛 常見問題

### Q: 顯示「無資料」怎麼辦？
A: 可能原因：
- 市場休市（週末、國定假日）
- 網路連線問題
- 股票代碼錯誤
- Yahoo Finance API 暫時無法取得資料

### Q: 如何新增港股或其他市場？
A: 使用完整的股票代碼，例如：
- 港股：`0700.HK`（騰訊）
- 日股：`7203.T`（Toyota）
- 歐股：`BMW.DE`（BMW）

### Q: 為什麼中文標題沒有置中？
A: 程式已針對中文字元寬度進行優化，確保您的終端機支援 UTF-8 編碼。

### Q: 可以同時監控多少支股票？
A: 理論上沒有限制，但建議不超過 20 支以維持更新速度與顯示品質。

### Q: Windows 上執行出現編碼錯誤怎麼辦？
A: 在命令提示字元中執行以下指令設定 UTF-8 編碼：
```cmd
chcp 65001
```

### Q: macOS/Linux 提示權限不足？
A: 使用 `pip3` 而非 `pip`，或加上 `--user` 參數：
```bash
pip3 install --user -r requirements.txt
```

## 📊 內建台股清單

### 科技股
台積電(2330)、鴻海(2317)、聯發科(2454)、華碩(2357)、廣達(2382)、和碩(4938)、聯電(2303)、日月光投控(3711)、聯詠(3034)、瑞昱(2379)

### 金融股
國泰金(2882)、富邦金(2881)、玉山金(2884)、兆豐金(2886)、第一金(2892)、中信金(2891)

### 傳產股
台塑(1301)、南亞(1303)、台化(1326)、中鋼(2002)、台泥(1101)、遠東新(1402)

### 航運股
長榮(2603)、陽明(2609)、萬海(2615)

### 其他
台達電(2308)、中華電(2412)、統一(1216)

_完整清單請參考程式內的 `taiwan_stocks` 字典_

## 🔄 更新日誌

### v0.1 (2025-10-01)
- ✨ 初始版本發布
- ✅ 基本 TUI 介面
- ✅ 美股、台股支援
- ✅ 中文名稱搜尋
- ✅ 模糊搜尋功能
- ✅ 即時監控與漲跌幅計算
- ✅ 資料持久化
- ✅ 自動安裝腳本（install.sh / install.bat）

## 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

1. Fork 此專案
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📝 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 🙏 致謝

- [yfinance](https://github.com/ranaroussi/yfinance) - Yahoo Finance 資料 API
- [pandas](https://pandas.pydata.org/) - 資料處理與分析

## 📧 聯絡方式

如有問題或建議，歡迎透過以下方式聯繫：

- 提交 [GitHub Issue](https://github.com/anomixer/stock-demo/issues)

---

⭐ 如果這個專案對您有幫助，請給我們一個 Star！
