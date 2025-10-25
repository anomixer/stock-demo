#!/bin/bash

echo "🚀 股票監控系統 - 網頁版部署腳本 (GitHub Pages + Cloudflare Workers)"
echo "================================================================"

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

# 檢查 git 是否安裝
if ! command -v git &> /dev/null; then
    echo "❌ 錯誤：Git 未安裝"
    echo "請安裝 Git 以繼續部署"
    exit 1
fi

echo "✅ 環境檢查完成"

# 詢問 GitHub 帳號
echo ""
echo "🔗 請輸入您的 GitHub 帳號 (username)："
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub 帳號不能為空"
    exit 1
fi

# 詢問 Cloudflare 帳號 ID
echo ""
echo "☁️ 請輸入您的 Cloudflare 帳號 ID (從 Cloudflare Dashboard 取得)："
read CLOUDFLARE_ACCOUNT_ID

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo "❌ Cloudflare 帳號 ID 不能為空"
    exit 1
fi

# 詢問 Cloudflare API Token
echo ""
echo "🔑 請輸入您的 Cloudflare API Token (從 Cloudflare Dashboard > API Tokens 取得)："
read CLOUDFLARE_API_TOKEN

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ Cloudflare API Token 不能為空"
    exit 1
fi

# 安裝依賴套件
echo ""
echo "📦 安裝依賴套件..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依賴套件安裝失敗"
    exit 1
fi

echo "✅ 依賴套件安裝完成"

# 建置應用程式
echo ""
echo "🔨 建置應用程式..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 應用程式建置失敗"
    exit 1
fi

echo "✅ 應用程式建置完成"

# 匯出靜態檔案
echo ""
echo "📄 匯出靜態檔案..."
npm run export

if [ $? -ne 0 ]; then
    echo "❌ 靜態檔案匯出失敗"
    exit 1
fi

echo "✅ 靜態檔案匯出完成"

# 部署到 GitHub Pages
echo ""
echo "🔗 部署前端到 GitHub Pages..."

# 檢查是否在 git 倉庫中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 錯誤：當前目錄不是 Git 倉庫"
    echo "請先初始化 Git 倉庫並推送到 GitHub"
    exit 1
fi

# 創建 gh-pages 分支
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# 複製靜態檔案到根目錄
cp -r out/* . 2>/dev/null || true

# 添加並提交變更
git add .
git commit -m "Deploy to GitHub Pages"

# 推送 gh-pages 分支
git push origin gh-pages

if [ $? -ne 0 ]; then
    echo "❌ GitHub Pages 部署失敗"
    exit 1
fi

echo "✅ 前端部署到 GitHub Pages 完成"
echo "🌐 您的網站將在 https://$GITHUB_USERNAME.github.io/stock-demo/ 可用"

# 部署到 Cloudflare Workers
echo ""
echo "☁️ 部署 API 到 Cloudflare Workers..."

# 安裝 Wrangler
echo "📦 安裝 Wrangler..."
npm install -g wrangler

if [ $? -ne 0 ]; then
    echo "❌ Wrangler 安裝失敗"
    exit 1
fi

# 設定 Wrangler 配置
echo "⚙️ 設定 Wrangler..."
export CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN"

# 更新 wrangler.toml 中的 account_id
sed -i "s/your-account-id/$CLOUDFLARE_ACCOUNT_ID/" wrangler.toml

# 登入 Wrangler
wrangler login --token "$CLOUDFLARE_API_TOKEN"

if [ $? -ne 0 ]; then
    echo "❌ Wrangler 登入失敗"
    exit 1
fi

# 部署 Functions
echo "🚀 部署 Cloudflare Pages Functions..."
wrangler pages deploy out --project-name stock-demo-api

if [ $? -ne 0 ]; then
    echo "❌ Cloudflare Pages 部署失敗"
    exit 1
fi

echo "✅ API 部署到 Cloudflare Workers 完成"

echo ""
echo "🎉 部署完成！"
echo "前端: https://$GITHUB_USERNAME.github.io/stock-demo/"
echo "API: 透過 Cloudflare Pages 處理"
echo ""
echo "注意：請在 Cloudflare Dashboard 中設定 Pages 專案以連結 API Functions"