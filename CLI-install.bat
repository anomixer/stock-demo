@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 股票即時監控系統 - CLI版本自動安裝腳本 (Windows)
REM 此腳本會自動檢查 Python 版本並安裝所需套件

echo ========================================
echo   📈 股票即時監控系統 - CLI版本安裝
echo ========================================
echo.

REM 檢查 Python 是否已安裝
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：未偵測到 Python
    echo.
    echo 請先安裝 Python 3.7 或更高版本：
    echo.
    echo Windows 安裝方式：
    echo   1. 使用 Microsoft Store 搜尋 "Python 3.12"
    echo   2. 或前往 https://www.python.org/downloads/
    echo.
    echo 重要：安裝時請勾選 "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

REM 顯示 Python 版本
for /f "tokens=*" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✅ 偵測到 %PYTHON_VERSION%

REM 檢查 Python 版本是否符合需求 (>= 3.7)
python -c "import sys; exit(0 if sys.version_info >= (3, 7) else 1)" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：Python 版本過舊
    echo 需要 Python 3.7 或更高版本
    echo 目前版本：%PYTHON_VERSION%
    echo.
    echo 請更新 Python：
    echo   前往 https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo ✅ Python 版本符合需求 (^>= 3.7)
echo.

REM 檢查 pip 是否已安裝
where pip >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 錯誤：未偵測到 pip
    echo.
    echo 請重新安裝 Python 並確認已勾選 "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('pip --version 2^>^&1') do set PIP_VERSION=%%i
echo ✅ 偵測到 pip
echo.

REM 升級 pip
echo 📦 升級 pip...
python -m pip install --upgrade pip --quiet
if %ERRORLEVEL% EQU 0 (
    echo ✓ pip 已升級至最新版本
) else (
    echo ⚠️  警告：pip 升級失敗，但可以繼續安裝
)
echo.

REM 安裝相依套件
echo 📦 安裝相依套件...
echo.

if exist requirements.txt (
    pip install -r requirements.txt

    if !ERRORLEVEL! EQU 0 (
        echo.
        echo ========================================
        echo   ✅ CLI版本安裝完成！
        echo ========================================
        echo.
        echo 已安裝以下套件：
        echo   • yfinance - Yahoo Finance 資料 API
        echo   • pandas - 資料處理與分析
        echo.
        echo 執行程式：
        echo   CLI-run.bat
        echo.
        echo 提示：如果看到亂碼，請先執行：
        echo   chcp 65001
        echo.
    ) else (
        echo.
        echo ❌ 安裝失敗
        echo.
        echo 請嘗試手動安裝：
        echo   pip install yfinance pandas
        echo.
        echo 或以管理員身分執行此腳本
        pause
        exit /b 1
    )
) else (
    echo ❌ 錯誤：找不到 requirements.txt
    echo.
    echo 請確認您在正確的目錄中執行此腳本
    pause
    exit /b 1
)

echo.
echo 祝您使用愉快！ 📈
echo.
pause