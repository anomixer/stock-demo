@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 股票即時監控系統 - CLI版本執行腳本 (Windows)
REM 此腳本會檢查環境並執行 CLI 版本

echo ========================================
echo   📈 股票即時監控系統 - CLI版本執行
echo ========================================
echo.

REM 檢查 Python 是否已安裝
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：未偵測到 Python
    echo.
    echo 請先執行安裝腳本：
    echo   CLI-install.bat
    echo.
    pause
    exit /b 1
)

REM 檢查 Python 版本是否符合需求 (>= 3.7)
python -c "import sys; exit(0 if sys.version_info >= (3, 7) else 1)" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：Python 版本不符合需求
    echo 需要 Python 3.7 或更高版本
    echo.
    echo 請先執行安裝腳本：
    echo   CLI-install.bat
    echo.
    pause
    exit /b 1
)

REM 檢查 pip 是否已安裝
where pip >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：未偵測到 pip
    echo.
    echo 請先執行安裝腳本：
    echo   CLI-install.bat
    echo.
    pause
    exit /b 1
)

REM "檢查必要套件是否已安裝"
echo 🔍 檢查必要套件...
python -c "import yfinance, pandas" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：缺少必要套件
    echo.
    echo 請先執行安裝腳本：
    echo   CLI-install.bat
    echo.
    pause
    exit /b 1
)

echo ✅ 環境檢查完成
echo.

REM 檢查 stock.py 是否存在
if not exist stock.py (
    echo ❌ 錯誤：找不到 stock.py
    echo.
    echo 請確認您在正確的目錄中
    pause
    exit /b 1
)

echo 🚀 啟動 CLI 版本...
echo.
echo 提示：按 Ctrl+C 停止程式
echo.

REM 執行 CLI 程式
python stock.py

echo.
echo 程式已結束
pause