#!/bin/bash

# 股票即時監控系統 - CLI版本執行腳本 (macOS/Linux)
# 此腳本會檢查環境並執行 CLI 版本

echo "========================================"
echo "  📈 股票即時監控系統 - CLI版本執行"
echo "========================================"
echo ""

# 檢查 Python 是否已安裝
if ! command -v python3 &> /dev/null; then
    echo "❌ 錯誤：未偵測到 Python 3"
    echo ""
    echo "請先執行安裝腳本："
    echo "  ./CLI-install.sh"
    echo ""
    exit 1
fi

# 檢查 Python 版本是否符合需求 (>= 3.7)
PYTHON_MAJOR=$(python3 -c 'import sys; print(sys.version_info.major)')
PYTHON_MINOR=$(python3 -c 'import sys; print(sys.version_info.minor)')

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 7 ]); then
    echo "❌ 錯誤：Python 版本不符合需求"
    echo "需要 Python 3.7 或更高版本"
    echo ""
    echo "請先執行安裝腳本："
    echo "  ./CLI-install.sh"
    echo ""
    exit 1
fi

# 檢查 pip 是否已安裝
if ! command -v pip3 &> /dev/null; then
    echo "❌ 錯誤：未偵測到 pip3"
    echo ""
    echo "請先執行安裝腳本："
    echo "  ./CLI-install.sh"
    echo ""
    exit 1
fi

# 檢查必要套件是否已安裝
echo "🔍 檢查必要套件..."
if ! python3 -c "import yfinance, pandas" 2>/dev/null; then
    echo "❌ 錯誤：缺少必要套件"
    echo ""
    echo "請先執行安裝腳本："
    echo "  ./CLI-install.sh"
    echo ""
    exit 1
fi

echo "✓ 環境檢查完成"
echo ""

# 檢查 stock.py 是否存在
if [ ! -f "stock.py" ]; then
    echo "❌ 錯誤：找不到 stock.py"
    echo ""
    echo "請確認您在正確的目錄中"
    exit 1
fi

echo "🚀 啟動 CLI 版本..."
echo ""
echo "提示：按 Ctrl+C 停止程式"
echo ""

# 執行 CLI 程式
python3 stock.py

echo ""
echo "程式已結束"