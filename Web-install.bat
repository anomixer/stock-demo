@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 股票即時監控系統 - Web版本自動安裝腳本 (Windows)
REM 此腳本會自動檢查 Node.js 版本並安裝所需套件

echo ========================================
echo   📈 股票即時監控系統 - Web版本安裝
echo ========================================
echo.

REM 檢查 Node.js 是否已安裝
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：未偵測到 Node.js
    echo.
    echo 請先安裝 Node.js：
    echo.
    echo Windows 安裝方式：
    echo   1. 前往 https://nodejs.org/
    echo   2. 下載 LTS 版本並安裝
    echo.
    echo 重要：安裝時請勾選所有選項
    echo.
    pause
    exit /b 1
)

REM 顯示 Node.js 版本
for /f "tokens=*" %%i in ('node --version 2^>^&1') do set NODE_VERSION=%%i
echo ✅ 偵測到 %NODE_VERSION%

REM 檢查 npm 是否已安裝
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：未偵測到 npm
    echo.
    echo 請重新安裝 Node.js 並確認已勾選所有選項
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version 2^>^&1') do set NPM_VERSION=%%i
echo ✅ 偵測到 npm %NPM_VERSION%
echo.

REM 若曾執行過雲端部署，可能殘留設定備份；先嘗試還原以利本機開發
set ORIGINAL_NEXT_CONFIG=%CD%\next.config.js
set TEMP_BACKUP=%CD%\next.config.local.backup
if exist "%TEMP_BACKUP%" (
    echo "偵測到部署備份，還原 next.config.js ..."
    copy /Y "%TEMP_BACKUP%" "%ORIGINAL_NEXT_CONFIG%" >nul
    del /Q "%TEMP_BACKUP%" >nul 2>nul
)

set API_ROUTE_PATH=%CD%\src\app\api\stocks\route.ts
set API_ROUTE_BACKUP=%CD%\src\app\api\stocks\route.ts.off
if exist "%API_ROUTE_BACKUP%" (
    echo "偵測到 API 路由備份，還原 src\\app\\api\\stocks\\route.ts ..."
    move /Y "%API_ROUTE_BACKUP%" "%API_ROUTE_PATH%" >nul
)

REM 檢查 package.json 是否存在
if not exist package.json (
    echo ❌ 錯誤：找不到 package.json
    echo.
    echo 請確認您在正確的目錄中執行此腳本
    pause
    exit /b 1
)

REM 安裝相依套件
echo 📦 安裝相依套件...
echo.

call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ Web版本安裝完成！
    echo ========================================
    echo.
    echo 已安裝所有必要套件
    echo.
    echo 執行程式：
    echo   Web-run.bat
    echo.
    echo "（可選）部署到 Cloudflare Pages："
    echo "  1) call npx --yes wrangler@latest login"
    echo "  2) WEB-deploy.bat ^<專案名稱^>（或直接執行後依提示輸入）"
    echo.
    echo 啟動後在瀏覽器打開：
    echo   http://localhost:3000
    echo.
) else (
    echo.
    echo ❌ 安裝失敗
    echo.
    echo 請嘗試手動安裝：
    echo   npm install
    echo.
    echo 或檢查網路連線
    pause
    exit /b 1
)

echo.
echo 祝您使用愉快！ 🌐
echo.
pause