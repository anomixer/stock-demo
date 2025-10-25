@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 股票即時監控系統 - Web版本執行腳本 (Windows)
REM 此腳本會檢查環境並執行 Web 版本

echo ========================================
echo   📈 股票即時監控系統 - Web版本執行
echo ========================================
echo.

REM 檢查 Node.js 是否已安裝
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：未偵測到 Node.js
    echo.
    echo 請先執行安裝腳本：
    echo   Web-install.bat
    echo.
    pause
    exit /b 1
)

REM 檢查 npm 是否已安裝
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：未偵測到 npm
    echo.
    echo 請先執行安裝腳本：
    echo   Web-install.bat
    echo.
    pause
    exit /b 1
)

REM 檢查 package.json 是否存在
if not exist package.json (
    echo ❌ 錯誤：找不到 package.json
    echo.
    echo 請確認您在正確的目錄中
    pause
    exit /b 1
)

REM 檢查 node_modules 是否存在
if not exist node_modules (
    echo ❌ 錯誤：未找到 node_modules
    echo.
    echo 請先執行安裝腳本：
    echo   Web-install.bat
    echo.
    pause
    exit /b 1
)

REM "檢查必要套件是否已安裝"
echo 🔍 檢查必要套件...
call npm list --depth=0 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：缺少必要套件
    echo.
    echo 請先執行安裝腳本：
    echo   Web-install.bat
    echo.
    pause
    exit /b 1
)

echo ✅ 環境檢查完成
echo.

REM 檢查是否有 .next 目錄（建置後的檔案）
if not exist .next (
    echo 🔨 建置生產版本...
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 建置失敗
        pause
        exit /b 1
    )
    echo ✅ 建置完成
    echo.
)

echo 🚀 啟動 Web 版本...
echo.
echo 提示：按 Ctrl+C 停止程式
echo.
echo 啟動後請在瀏覽器打開：
echo   http://localhost:3000
echo.

REM 執行 Web 程式
call npm run start

echo.
echo 程式已結束
pause