#!/bin/bash

# 股票即時監控系統 - Web版本自動安裝腳本 (macOS/Linux)
# 此腳本會自動檢查 Node.js 版本並安裝所需套件

echo "========================================"
echo "  📈 股票即時監控系統 - Web版本安裝"
echo "========================================"
echo ""

# 檢查 Node.js 是否已安裝
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤：未偵測到 Node.js"
    echo ""
    echo "請先安裝 Node.js："
    echo ""
    echo "安裝方式："
    echo "  1. 前往 https://nodejs.org/"
    echo "  2. 下載 LTS 版本並安裝"
    echo "  3. 或使用套件管理器："
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "     macOS: brew install node"
    else
        echo "     Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
        echo "     Fedora/CentOS: curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash - && sudo dnf install nodejs"
    fi
    echo ""
    exit 1
fi

# 顯示 Node.js 版本
NODE_VERSION=$(node --version 2>&1)
echo "✓ 偵測到 $NODE_VERSION"

# 檢查 npm 是否已安裝
if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤：未偵測到 npm"
    echo ""
    echo "請重新安裝 Node.js 並確認已勾選所有選項"
    echo ""
    exit 1
fi

NPM_VERSION=$(npm --version 2>&1)
echo "✓ 偵測到 npm $NPM_VERSION"
echo ""

# 檢查 package.json 是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 錯誤：找不到 package.json"
    echo ""
    echo "請確認您在正確的目錄中執行此腳本"
    exit 1
fi

# 安裝相依套件
echo "📦 安裝相依套件..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ✅ Web版本安裝完成！"
    echo "========================================"
    echo ""
    echo "已安裝所有必要套件"
    echo ""
    echo "執行程式："
    echo "  ./Web-run.sh"
    echo ""
    echo "啟動後在瀏覽器打開："
    echo "  http://localhost:3000"
    echo ""
else
    echo ""
    echo "❌ 安裝失敗"
    echo ""
    echo "請嘗試手動安裝："
    echo "  npm install"
    echo ""
    echo "或檢查網路連線"
    exit 1
fi

echo ""
echo "祝您使用愉快！ 🌐"
echo ""