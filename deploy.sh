#!/bin/bash

echo "🚀 股票監控系統 - 網頁版部署腳本"
echo "=================================="

# 檢查 Node.js 是否安裝
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤：Node.js 未安裝"
    echo "請前往 https://nodejs.org/ 下載安裝 Node.js"
    exit 1
fi

# 檢查 npm 是否安裝
if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤：npm 未安裝"
    exit 1
fi

echo "✅ 環境檢查完成"

# 安裝依賴套件
echo "📦 安裝依賴套件..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依賴套件安裝失敗"
    exit 1
fi

echo "✅ 依賴套件安裝完成"

# 建置應用程式
echo "🔨 建置應用程式..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 應用程式建置失敗"
    exit 1
fi

echo "✅ 應用程式建置完成"

# 匯出靜態檔案
echo "📄 匯出靜態檔案..."
npm run export

if [ $? -ne 0 ]; then
    echo "❌ 靜態檔案匯出失敗"
    exit 1
fi

echo "✅ 靜態檔案匯出完成"

echo ""
echo "🎉 部署準備完成！"
echo ""
echo "下一步："
echo "1. 將 'out' 資料夾中的檔案推送到 GitHub 儲存庫的 gh-pages 分支"
echo "2. 在 GitHub 儲存庫設定中啟用 GitHub Pages"
echo "3. 選擇 'gh-pages' 分支作為來源"
echo ""
echo "或者使用 GitHub Actions 自動部署："
echo "- 將檔案推送到 main 分支"
echo "- GitHub Actions 會自動建置並部署到 gh-pages 分支"
echo ""
echo "您的股票監控系統將在以下網址可用："
echo "https://your-username.github.io/stock-demo/"
echo ""
echo "請記得將 'your-username' 替換為您的 GitHub 用戶名稱"
