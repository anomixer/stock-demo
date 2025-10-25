#!/bin/bash

# 股票即時監控系統 - Web版本執行腳本 (macOS/Linux)
# 此腳本會檢查環境並執行 Web 版本

echo "========================================"
echo "  📈 股票即時監控系統 - Web版本執行"
echo "========================================"
echo ""

# 檢查 Node.js 是否已安裝
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤：未偵測到 Node.js"
    echo ""
    echo "請先執行安裝腳本："
    echo "  ./Web-install.sh"
    echo ""
    exit 1
fi

# 檢查 npm 是否已安裝
if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤：未偵測到 npm"
    echo ""
    echo "請先執行安裝腳本："
    echo "  ./Web-install.sh"
    echo ""
    exit 1
fi

# 檢查 package.json 是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 錯誤：找不到 package.json"
    echo ""
    echo "請確認您在正確的目錄中"
    exit 1
fi

# 檢查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "❌ 錯誤：未找到 node_modules"
    echo ""
    echo "請先執行安裝腳本："
    echo "  ./Web-install.sh"
    echo ""
    exit 1
fi

# "檢查必要套件是否已安裝"
echo "🔍 檢查必要套件..."
if ! npm list --depth=0 >/dev/null 2>&1; then
    echo "❌ 錯誤：缺少必要套件"
    echo ""
    echo "請先執行安裝腳本："
    echo "  ./Web-install.sh"
    echo ""
    exit 1
fi

echo "✓ 環境檢查完成"
echo ""

# 檢查是否有 .next 目錄（建置後的檔案）
if [ ! -d ".next" ]; then
    echo "🔨 建置生產版本..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 建置失敗"
        exit 1
    fi
    echo "✓ 建置完成"
    echo ""
fi

echo "🚀 啟動 Web 版本..."
echo ""
echo "提示：按 Ctrl+C 停止程式"
echo ""
echo "啟動後請在瀏覽器打開："
echo "  http://localhost:3000"
echo ""

# 執行 Web 程式
npm run start

echo ""
echo "程式已結束"