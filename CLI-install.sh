#!/bin/bash

# 股票即時監控系統 - CLI版本自動安裝腳本 (macOS/Linux)
# 此腳本會自動檢查 Python 版本並安裝所需套件

echo "========================================"
echo "  📈 股票即時監控系統 - CLI版本安裝"
echo "========================================"
echo ""

# 檢查 Python 是否已安裝
if ! command -v python3 &> /dev/null; then
    echo "❌ 錯誤：未偵測到 Python 3"
    echo ""
    echo "請先安裝 Python 3.7 或更高版本："
    echo ""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS 安裝方式："
        echo "  1. 使用 Homebrew: brew install python3"
        echo "  2. 或前往 https://www.python.org/downloads/"
    else
        echo "Linux 安裝方式："
        echo "  Ubuntu/Debian: sudo apt install python3 python3-pip"
        echo "  Fedora/CentOS: sudo dnf install python3 python3-pip"
        echo "  Arch Linux: sudo pacman -S python python-pip"
    fi
    echo ""
    exit 1
fi

# 顯示 Python 版本
PYTHON_VERSION=$(python3 --version 2>&1)
echo "✓ 偵測到 $PYTHON_VERSION"

# 檢查 Python 版本是否符合需求 (>= 3.7)
PYTHON_MAJOR=$(python3 -c 'import sys; print(sys.version_info.major)')
PYTHON_MINOR=$(python3 -c 'import sys; print(sys.version_info.minor)')

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 7 ]); then
    echo "❌ 錯誤：Python 版本過舊"
    echo "需要 Python 3.7 或更高版本"
    echo "目前版本：$PYTHON_VERSION"
    echo ""
    echo "請更新 Python："
    echo "  macOS: brew upgrade python3"
    echo "  Linux: 請參考您的發行版文件"
    exit 1
fi

echo "✓ Python 版本符合需求 (>= 3.7)"
echo ""

# 檢查 pip 是否已安裝
if ! command -v pip3 &> /dev/null; then
    echo "❌ 錯誤：未偵測到 pip3"
    echo ""
    echo "請安裝 pip："
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "  macOS: python3 -m ensurepip --upgrade"
    else
        echo "  Ubuntu/Debian: sudo apt install python3-pip"
        echo "  Fedora/CentOS: sudo dnf install python3-pip"
    fi
    exit 1
fi

PIP_VERSION=$(pip3 --version 2>&1)
echo "✓ 偵測到 pip ($PIP_VERSION)"
echo ""

# 升級 pip
echo "📦 升級 pip..."
python3 -m pip install --upgrade pip --quiet
echo "✓ pip 已升級至最新版本"
echo ""

# 安裝相依套件
echo "📦 安裝相依套件..."
echo ""

if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt

    if [ $? -eq 0 ]; then
        echo ""
        echo "========================================"
        echo "  ✅ CLI版本安裝完成！"
        echo "========================================"
        echo ""
        echo "已安裝以下套件："
        echo "  • yfinance - Yahoo Finance 資料 API"
        echo "  • pandas - 資料處理與分析"
        echo ""
        echo "執行程式："
        echo "  ./CLI-run.sh"
        echo ""
        echo "或直接執行："
        echo "  python3 stock.py"
        echo ""
    else
        echo ""
        echo "❌ 安裝失敗"
        echo ""
        echo "請嘗試手動安裝："
        echo "  pip3 install yfinance pandas"
        echo ""
        echo "如果遇到權限問題，請使用："
        echo "  pip3 install --user yfinance pandas"
        exit 1
    fi
else
    echo "❌ 錯誤：找不到 requirements.txt"
    echo ""
    echo "請確認您在正確的目錄中執行此腳本"
    exit 1
fi

# 讓 stock.py 可執行
if [ -f "stock.py" ]; then
    chmod +x stock.py
    echo "✓ stock.py 已設定為可執行"
fi

echo ""
echo "祝您使用愉快！ 📈"
echo ""