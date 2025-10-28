# 📈 股票即時監控系統

## 📜 目錄 (Table of Contents)

- [✨ 主要特色](#-主要特色)
- [🚀 版本功能比較](#-版本功能比較)
- [🎯 使用場景建議](#-使用場景建議)
- [🚀 快速開始](#-快速開始)
  - [🖥️ CLI 版本 (Python)](#️-cli-版本-python)
  - [🌐 Web 版本 (Next.js)](#-web-版本-nextjs)
- [📖 使用說明](#-使用說明)
  - [🖥️ CLI 版本](#️-cli-版本)
  - [🌐 Web 版本](#-web-版本)
- [📂 專案結構](#-專案結構)
- [🔧 進階設定](#-進階設定)
- [🎯 支援的股票市場](#-支援的股票市場)
- [🐛 常見問題](#-常見問題)
- [🤝 貢獻指南](#-貢獻指南)
- [📝 授權條款](#-授權條款)
- [🙏 致謝](#-致謝)
- [📧 聯絡方式](#-聯絡方式)

---

一套完整的股票監控解決方案，提供 **CLI (命令列)** 和 **Web (網頁)** 兩個版本，讓您隨心所欲地監控全球股市動態！

## ✨ 主要特色

### 🖥️ CLI 版本
- **友善的 TUI 介面** - 全中文互動式選單操作
- **智慧搜尋功能** - 支援中文名稱、股票代碼模糊搜尋
- **即時股價監控** - 每 60 秒自動更新股價資訊
- **漲跌幅計算** - 自動計算與顯示股價變化
- **多市場支援** - 美股、台股、港股等
- **資料持久化** - JSON 設定檔 + CSV 歷史紀錄
- **40+ 台股快速查詢** - 內建常見台股中文名稱對照

### 🌐 Web 版本
- **現代化儀表板** - 即時顯示所有監控股票的股價
- **拖拽排序** - 整張卡片可拖曳排序、新增、編輯、刪除
- **彩色狀態指示** - 清晰顯示上漲（紅）、下跌（綠）、不變（灰）
- **統計面板** - 清楚呈現投資組合概況 (總數、漲跌平)
- **智能倒數計時** - 每 60 秒自動更新，並顯示下次更新倒數
- **即時編輯** - 直接在卡片上點擊編輯股票名稱
- **JSON匯入匯出** - 輕鬆備份與還原股票組合
- **安全重置數據** - 帶有確認機制的數據重置功能
- **主題切換** - 支援亮色與暗色主題
- **響應式設計** - 完美支援手機、平板、桌面
- **卡片大小切換** - 支援大中小三種尺寸，預設中


---

## 🚀 版本功能比較

| 功能特色 | CLI版本 (終端機) | Web版本 (網頁) |
|---------|----------------|----------------|
| **🎯 核心功能** | 即時監控、漲跌計算 | 即時監控、拖拽排序、主題切換、股票總數與漲跌平統計、倒數計時 |
| **🔍 搜尋方式** | 中文模糊搜尋 | 智慧即時搜尋、API驅動 |
| **📊 顯示效果** | 文字表格 | 卡片式設計、響應式、3欄顯示、股票名稱即時編輯 |
| **🎨 使用介面** | 命令列介面 | 現代化網頁UI、暗色主題 |
| **💾 資料儲存** | 本地JSON/CSV | localStorage + 匯入匯出JSON、安全重置 |
| **⚡ 執行方式** | `python stock.py` | `npm install` `npm run build` `npm run start` |
| **🔧 開發語言** | Python 3.7+ | TypeScript + React |
| **📚 套件需求** | yfinance, pandas | Next.js, Axios |
| **🌐 網路依賴** | Yahoo Finance API | Yahoo Finance API + Cloudflare Workers |
| **📱 行動支援** | ❌ 僅終端機 | ✅ 響應式設計 |
| **📏 卡片自訂** | ❌ 不支援 | ✅ 大中小尺寸切換 |
| **⚙️ 自訂程度** | 高 (程式碼修改) | 中 (組件調整) |
| **☁️ 部署平台** | 僅本機執行 | Cloudflare Pages 免費 |
| **🚀 部署難度** | ⭐ 本機執行 | ⭐⭐ Cloudflare Pages 自動部署 |

---

## 🚀 快速開始

### 🖥️ CLI 版本 (Python)

#### 系統需求
- Python 3.7 或更高版本
- pip (Python 套件管理工具)

#### 安裝步驟
我們提供了自動安裝腳本，一鍵完成環境設定。

**CLI版本：**

macOS / Linux:
```bash
# 賦予腳本執行權限
chmod +x CLI-install.sh

# 執行安裝
./CLI-install.sh
```

Windows:
```cmd
# 直接執行批次檔
CLI-install.bat
```

**Web版本：**

macOS / Linux:
```bash
# 賦予腳本執行權限
chmod +x Web-install.sh

# 執行安裝
./Web-install.sh
```

Windows:
```cmd
# 直接執行批次檔
Web-install.bat
```

安裝完成後，即可執行主程式。

**執行程式：**

**CLI版本：**
```bash
# macOS/Linux
./CLI-run.sh

# Windows
CLI-run.bat
```

**Web版本：**
```bash
# macOS/Linux
./Web-run.sh

# Windows
Web-run.bat
```

### 🌐 Web 版本 (Next.js)


#### 本地開發
如果您想在本地端運行或進行二次開發：

**系統需求:**
- Node.js (LTS 版本)
- npm 或 yarn

**安裝與啟動:**
```bash
# 1. 下載專案
git clone https://github.com/anomixer/stock-demo.git
cd stock-demo

# 2. 安裝依賴套件
# macOS/Linux
./Web-install.sh

# Windows
Web-install.bat

# 3. 啟動生產伺服器
# macOS/Linux
./Web-run.sh

# Windows
Web-run.bat
```
啟動後，在瀏覽器打開 `http://localhost:3000` 即可看到應用程式。

**注意**: 專案已配置 favicon.ico，瀏覽器標籤頁會顯示自訂圖標。

---

## 🎯 使用場景建議

### 🤖 程式開發者 / IT專業人士
**推薦**: CLI版本
- 習慣命令列操作
- 注重資料準確性
- 需要長期運作監控

### 👔 一般投資者 / 業餘使用者
**推薦**: Web版本
- 喜歡圖形化介面
- 需要美觀的顯示效果
- 經常用手機查看

### 📊 金融專業人士
**推薦**: 雙版本並用
- CLI版本用於快速查詢和長期監控
- Web版本用於展示和分享投資組合

## 🚀 CLI版本 快速開始

### 系統需求

- Python 3.7 或更高版本
- pip (Python 套件管理工具)

### 📦 Python 安裝指南

如果您是第一次使用 Python，請根據您的作業系統選擇對應的安裝方式：

#### 🍎 macOS

**方法一：使用 Homebrew（推薦）**
```bash
# 如果還沒安裝 Homebrew，先安裝它
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

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

**CLI版本：**

macOS / Linux:
```bash
chmod +x CLI-install.sh
./CLI-install.sh
```

Windows:
```cmd
CLI-install.bat
```

**Web版本：**

macOS / Linux:
```bash
chmod +x Web-install.sh
./Web-install.sh
```

Windows:
```cmd
Web-install.bat
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

**CLI版本：**

macOS / Linux:
```bash
pip3 install -r requirements.txt
```

Windows:
```cmd
pip install -r requirements.txt
```

**Web版本：**

macOS / Linux:
```bash
npm install
```

Windows:
```cmd
npm install
```

或手動安裝：
```bash
pip install yfinance pandas
```

3. **執行程式**

**CLI版本：**

macOS / Linux:
```bash
./CLI-run.sh
```

Windows:
```cmd
CLI-run.bat
```

**Web版本：**

macOS / Linux:
```bash
./Web-run.sh
```

Windows:
```cmd
Web-run.bat
```


## 📖 CLI版本 使用說明

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
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   └── api/
│   │       └── stocks/
│   │           └── route.ts        # 本機 Web 版 API（Next.js App Router）
│   ├── components/
│   │   ├── StockDashboard.tsx
│   │   ├── StockSearchModal.tsx
│   │   ├── StockMenu.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   ├── lib/
│   │   ├── stockApi.ts
│   │   └── taiwanStocks.ts
│   └── types/
│       └── stock.ts
├── functions/
│   └── api/
│       └── stocks.js              # Cloudflare Pages Functions（生產用 /api/stocks）
├── cloud/
│   └── next.config.js            # 部署（export）專用設定
├── Web-deploy.sh                 # macOS/Linux 部署到 Cloudflare Pages
├── WEB-deploy.bat                # Windows 部署到 Cloudflare Pages（互動輸入專案名）
├── Web-install.sh                # macOS/Linux Web 安裝
├── Web-install.bat               # Windows Web 安裝
├── Web-run.sh                    # macOS/Linux 本機啟動（生產模式）
├── Web-run.bat                   # Windows 本機啟動（生產模式）
├── stock.py                      # CLI 主程式（Python）
├── requirements.txt              # CLI 相依套件（Python）
├── stock_config.json             # CLI 用戶設定（可忽略版控）
├── stock_history.csv             # CLI 歷史資料（可忽略版控）
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── wrangler.toml                 # Cloudflare 專案設定（Pages 用）
├── README.md
├── context.md
└── .gitignore
```

## 🎯 資料檔案格式

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


## 🚀 Web版本 快速開始

### 📋 系統需求

- 現代網頁瀏覽器（Chrome、Firefox、Safari、Edge）
- 網路連線（用於獲取即時股價）

#### Windows 用戶提示
為了獲得最佳體驗，建議使用 **Windows Terminal** 而非傳統的 Command Prompt：
1. 在 Microsoft Store 搜尋並安裝 "Windows Terminal"
2. 設定 UTF-8 編碼以正確顯示中文和 emoji
3. 享受現代化的終端機體驗

#### 1. **準備環境**
```bash
# 安裝 Node.js (如果還沒安裝)
# 前往 https://nodejs.org/ 下載安裝

# 驗證安裝
node --version
npm --version
```

#### 2. **下載專案**
```bash
git clone https://github.com/anomixer/stock-demo.git
cd stock-demo
```

#### 3. **安裝相依套件**
```bash
npm install
```

#### 4. **啟動生產服務器**
```bash
# macOS/Linux
./Web-run.sh

# Windows
Web-run.bat
```

#### 5. **開啟瀏覽器**
前往 `http://localhost:3000` 開始使用

#### 6. **部署到 Cloudflare Pages**
（可選）
```cmd
REM 第一次請先登入 Cloudflare 帳號（會開瀏覽器授權）
call npx --yes wrangler@latest login

REM 執行部署（會詢問專案名稱，預設 stock-demo）
WEB-deploy.bat
```
macOS / Linux:
```bash
# 第一次請先登入 Cloudflare 帳號（會開瀏覽器授權）
npx --yes wrangler@latest login

# 執行部署（可傳入專案名稱，或依提示輸入）
./Web-deploy.sh stock-demo
```
說明：
- 本專案以靜態匯出（`output: export`）部署到 Cloudflare Pages，靜態檔位於 `out/`。
- 生產環境的 `/api/stocks` 由 `functions\api\stocks.js`（Pages Functions）提供，無需 Next.js 內建 API。
- 首次部署時 Wrangler 可能詢問「使用既有專案或建立新專案」，依你的專案選擇即可。
- 若選擇建立新專案，提示 `Enter the production branch name` 時請選 `main`。

### 📱 行動裝置使用

應用程式支援響應式設計，在行動裝置上也能完美運行：

- 📱 **iOS Safari** - 支援完整功能
- 🤖 **Android Chrome** - 支援完整功能
- 💡 **離線模式** - 可在網路不穩時使用基本功能

## 📖 Web版本 使用說明

### 🏠 主頁面功能

#### **儀表板監控**
- 📈 即時顯示所有監控股票的股價
- 🧮 自動計算漲跌金額與漲跌幅百分比
- 📊 彩色指示器顯示漲跌狀態（紅色上漲、綠色下跌、灰色不變）
- ⏳ **智能倒數計時** - 每 60 秒自動更新資料，並顯示下次更新的倒數時間。

#### **股票搜尋**
點擊「新增股票」按鈕開啟搜尋功能：
- **美股**：輸入代碼如 `AAPL`、`TSLA`、`GOOGL`
- **台股**：輸入中文名稱如「台積電」、「鴻海」或代碼如「2330」
- **智慧搜尋**：支援模糊搜尋，輸入部分名稱即可找到對應股票

#### **股票管理**
- ➕ **新增股票** - 搜尋並加入監控清單
- 🗑️ **刪除股票** - 從監控清單移除不需要的股票
- ✏️ **編輯名稱** - 直接在卡片上點擊編輯股票顯示名稱。
- 📥 **匯入組合** - 從JSON檔案匯入股票清單，方便跨設備同步。
- 📤 **匯出組合** - 將當前股票清單匯出為JSON檔案，用於備份或分享。
- 🔄 **重置所有數據** - 清除所有自訂股票和價格數據，恢復為預設狀態（需確認）。

#### **卡片大小切換**
- 在主頁面右上方點擊「卡片: 中」按鈕循環切換大小（小 → 中 → 大 → 小...），預設為中。
- **小**：顯示更多列 (4-6 列)，卡片更緊湊，適合快速瀏覽
- **中**：標準顯示 (2-4 列)，平衡視覺和資訊
- **大**：顯示較少列 (1-3 列)，卡片更大，適合詳細查看
- 同時調整 padding、字體大小等，適應不同顯示需求。

### 🎯 支援的股票市場

| 市場 | 代碼格式 | 範例 | 說明 |
|------|---------|------|------|
| 美股 | 直接使用代碼 | `AAPL`, `GOOGL`, `TSLA` | Apple、Alphabet、Tesla |
| 台股 | 代碼 + `.TW` | `2330.TW`, `2317.TW` | 台積電、鴻海 |
| 港股 | 代碼 + `.HK` | `0700.HK`, `9988.HK` | 騰訊、阿里巴巴 |

### 🔍 智慧搜尋範例

| 輸入 | 結果 | 說明 |
|------|------|------|
| `台積電` | 台積電 (2330.TW) | 直接中文名稱搜尋 |
| `積電` | 台積電 (2330.TW) | 模糊搜尋 |
| `2330` | 台積電 (2330.TW) | 股票代碼搜尋 |
| `AAPL` | Apple Inc. (AAPL) | 美股代碼搜尋 |
| `蘋果` | Apple Inc. (AAPL) | 中文名稱搜尋（如果支援） |

## 📂 專案結構（精簡版）

```
stock-demo/
├── public/
├── src/ (app, components, lib, types)
├── functions/api/stocks.js
├── cloud/next.config.js
├── Web-deploy.sh, WEB-deploy.bat
├── Web-install.sh, Web-install.bat
├── Web-run.sh, Web-run.bat
├── stock.py, requirements.txt
├── next.config.js, package.json, tailwind.config.js, tsconfig.json, wrangler.toml
└── README.md, context.md, .gitignore
```

## ⚙️ 設定選項

### 更新頻率設定
在 `src/lib/constants.ts` 中調整更新間隔：
```typescript
export const UPDATE_INTERVAL = 60000; // 60 秒
```

### 新增台股對照表
編輯 `src/lib/taiwanStocks.ts`：
```typescript
export const taiwanStocks = {
  '台積電': '2330.TW',
  '鴻海': '2317.TW',
  // 新增更多股票...
};
```

## 🔧 開發指南

### 技術架構
- **前端框架**：Next.js 14 (App Router)
- **語言**：TypeScript
- **樣式**：Tailwind CSS
- **狀態管理**：React Query
- **後端 API（生產）**：Cloudflare Pages Functions
- **部署**：Cloudflare Pages（靜態站點 + Functions）

### 開發指令
```bash
# 啟動生產服務器
# macOS/Linux
./Web-run.sh

# Windows
Web-run.bat

# 建置生產版本
npm run build

# 啟動開發服務器（開發時使用）
npm run dev

# 執行測試
npm run test

# 程式碼檢查
npm run lint
```

### v0.2 (新增Web版本)
- 🌐 全新的網頁版介面
- 📱 響應式設計，支援行動裝置
- 🖱️ 簡化拖曳介面，整張卡片皆可拖曳排序。
- ⚡ Serverless 架構，提升效能
- 🎨 現代化 UI/UX 設計
- 🔄 即時資料同步
- 💾 雲端資料儲存
- ✏️ 股票名稱支援卡片上即時編輯。
- 📤 支援JSON格式匯入匯出股票組合。
- 🗑️ 增加安全重置數據功能。
- ☁️ 可部署至 Cloudflare Pages（靜態匯出 + Pages Functions）


### v0.1 (終端機版本)
- ✅ 基本終端機介面
- ✅ 美股、台股支援
- ✅ 中文名稱搜尋
- ✅ 即時監控功能


## 🐛 常見問題

### Q: 為什麼股價沒有更新？顯示「無資料」？
A: 可能原因：
- 市場休市（週末、國定假日）
- 網路連線問題
- 股票代碼錯誤
- Yahoo Finance API 暫時無法取得資料

### Q: 如何新增其他市場的股票？
A: 目前支援美股、台股、港股。如需其他市場，請修改搜尋邏輯並確保 API 支援。

### Q: 如何新增港股或其他市場？
A: 使用完整的股票代碼，例如：
- 港股：`0700.HK`（騰訊）
- 日股：`7203.T`（Toyota）
- 歐股：`BMW.DE`（BMW）

### Q: 資料會儲存在哪裡？
A: 股票清單和歷史資料會儲存在瀏覽器的 localStorage，以及雲端資料庫中。

### Q: 支援離線使用嗎？
A: 基本功能支援離線瀏覽，但即時股價需要網路連線。

### Q: 為什麼CLI版的中文標題沒有置中？
A: 程式已針對中文字元寬度進行優化，確保您的終端機支援 UTF-8 編碼。

### Q: 可以同時監控多少支股票？
A: 理論上沒有限制，但建議不超過 20 支以維持更新速度與顯示品質。

### Q: Windows 上執行出現編碼錯誤怎麼辦？
A: 在命令提示字元中執行以下指令設定 UTF-8 編碼：
```cmd
chcp 65001
```

### Q: Windows 下 emoji 或中文無法正常顯示？
A: 建議使用 Windows Terminal 而非傳統 Command Prompt：
1. 在 Microsoft Store 搜尋並安裝 "Windows Terminal"
2. 設定 UTF-8 編碼以正確顯示中文和 emoji
3. 享受現代化的終端機體驗

### Q: macOS/Linux 提示權限不足？
A: 使用 `pip3` 而非 `pip`，或加上 `--user` 參數：
```bash
pip3 install --user -r requirements.txt
```


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
