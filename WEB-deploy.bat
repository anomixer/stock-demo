@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 股票監控系統 - 網頁版部署腳本 (GitHub Pages + Cloudflare Workers)
echo ================================================================
echo.

REM 檢查 Node.js 是否安裝
call node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤：Node.js 未安裝
    echo 請前往 https://nodejs.org/ 下載安裝 Node.js
    pause
    exit /b 1
)

REM 檢查 npm 是否安裝
call npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤：npm 未安裝
    pause
    exit /b 1
)

REM 檢查 git 是否安裝
call git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤：Git 未安裝
    echo 請安裝 Git 以繼續部署
    pause
    exit /b 1
)

echo ✅ 環境檢查完成
echo.

REM 詢問 GitHub 帳號
set /p GITHUB_USERNAME="🔗 請輸入您的 GitHub 帳號 (username)："
if "%GITHUB_USERNAME%"=="" (
    echo ❌ GitHub 帳號不能為空
    pause
    exit /b 1
)

REM 詢問 Cloudflare 帳號 ID
set /p CLOUDFLARE_ACCOUNT_ID="☁️ 請輸入您的 Cloudflare 帳號 ID (從 Cloudflare Dashboard 取得)："
if "%CLOUDFLARE_ACCOUNT_ID%"=="" (
    echo ❌ Cloudflare 帳號 ID 不能為空
    pause
    exit /b 1
)

REM 詢問 Cloudflare API Token
set /p CLOUDFLARE_API_TOKEN="🔑 請輸入您的 Cloudflare API Token (從 Cloudflare Dashboard > API Tokens 取得)："
if "%CLOUDFLARE_API_TOKEN%"=="" (
    echo ❌ Cloudflare API Token 不能為空
    pause
    exit /b 1
)

echo.
echo 📦 安裝依賴套件...
call npm install

if errorlevel 1 (
    echo ❌ 依賴套件安裝失敗
    pause
    exit /b 1
)

echo ✅ 依賴套件安裝完成
echo.

echo 🔨 建置應用程式...
call npm run build

if errorlevel 1 (
    echo ❌ 應用程式建置失敗
    pause
    exit /b 1
)

echo ✅ 應用程式建置完成
echo.

echo 📄 匯出靜態檔案...
call npm run export

if errorlevel 1 (
    echo ❌ 靜態檔案匯出失敗
    pause
    exit /b 1
)

echo ✅ 靜態檔案匯出完成
echo.

echo 🔗 部署前端到 GitHub Pages...
echo.

REM 檢查是否在 git 倉庫中
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤：當前目錄不是 Git 倉庫
    echo 請先初始化 Git 倉庫並推送到 GitHub
    pause
    exit /b 1
)

REM 創建 gh-pages 分支
git checkout -b gh-pages 2>nul || git checkout gh-pages

REM 複製靜態檔案到根目錄
xcopy out\* . /E /Y >nul 2>&1

REM 添加並提交變更
git add .
git commit -m "Deploy to GitHub Pages"

REM 推送 gh-pages 分支
git push origin gh-pages

if errorlevel 1 (
    echo ❌ GitHub Pages 部署失敗
    pause
    exit /b 1
)

echo ✅ 前端部署到 GitHub Pages 完成
echo 🌐 您的網站將在 https://%GITHUB_USERNAME%.github.io/stock-demo/ 可用
echo.

echo ☁️ 部署 API 到 Cloudflare Workers...
echo.

echo 📦 安裝 Wrangler...
call npm install -g wrangler

if errorlevel 1 (
    echo ❌ Wrangler 安裝失敗
    pause
    exit /b 1
)

echo ⚙️ 設定 Wrangler...
set CLOUDFLARE_ACCOUNT_ID=%CLOUDFLARE_ACCOUNT_ID%
set CLOUDFLARE_API_TOKEN=%CLOUDFLARE_API_TOKEN%

REM 更新 wrangler.toml 中的 account_id
powershell -Command "(Get-Content wrangler.toml) -replace 'your-account-id', '%CLOUDFLARE_ACCOUNT_ID%' | Set-Content wrangler.toml"

echo 🔑 登入 Wrangler...
call wrangler login --token %CLOUDFLARE_API_TOKEN%

if errorlevel 1 (
    echo ❌ Wrangler 登入失敗
    pause
    exit /b 1
)

echo 🚀 部署 Cloudflare Pages Functions...
call wrangler pages deploy out --project-name stock-demo-api

if errorlevel 1 (
    echo ❌ Cloudflare Pages 部署失敗
    pause
    exit /b 1
)

echo ✅ API 部署到 Cloudflare Workers 完成
echo.

echo 🎉 部署完成！
echo 前端: https://%GITHUB_USERNAME%.github.io/stock-demo/
echo API: 透過 Cloudflare Pages 處理
echo.
echo 注意：請在 Cloudflare Dashboard 中設定 Pages 專案以連結 API Functions
echo.
pause