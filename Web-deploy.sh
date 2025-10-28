#!/usr/bin/env bash
set -euo pipefail

echo "=============================================="
echo "(Stock-Demo) === 雲端部署 - Cloudflare Pages ==="
echo "=============================================="
echo
echo "用途:"
echo "  此腳本會將專案以 Next.js 靜態匯出 (output: export) 建置到 out/，"
echo "  並使用 Cloudflare Wrangler 部署到 Cloudflare Pages。"
echo "  生產環境 API 由 functions/api/stocks.js 提供 /api/stocks，無需 Next.js 內建 API。"
echo
echo "部署步驟摘要:"
echo "  1) 輸入 Cloudflare Pages 專案名稱 (預設: stock-demo)"
echo "  2) 安裝套件 (npm install)"
echo "  3) 臨時套用 cloud/next.config.js 並暫時移除 Next API 路由避免衝突後建置 (npm run build)"
echo "  4) 部署 out/ 到 Cloudflare Pages (wrangler pages deploy)"
echo
echo "注意: 首次部署前，請先登入 Cloudflare 帳號:"
echo "  -> npx --yes wrangler@latest login"
echo "  登入時可能會開啟瀏覽器進行授權。"
echo

# 檢查 Node.js / npm
if ! command -v node >/dev/null 2>&1; then
  echo "未找到 Node.js，請先安裝 Node.js 後再重試"; exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "未找到 npm，請確認 Node.js 安裝完整"; exit 1
fi

# 檢查 wrangler
if command -v wrangler >/dev/null 2>&1; then
  USE_NPX_WRANGLER=0
else
  USE_NPX_WRANGLER=1
fi
echo "Wrangler 狀態:"
if [ "$USE_NPX_WRANGLER" = "1" ]; then
  echo "  未偵測到全域 wrangler，將改用 npx 執行 wrangler"
else
  echo "  偵測到全域 wrangler，可直接使用"
fi
echo "  若尚未登入，請先執行: npx --yes wrangler@latest login"
echo

# 讀取專案名稱
PROJECT_NAME="${1:-}"
if [ -z "$PROJECT_NAME" ]; then
  read -rp "請輸入 Cloudflare Pages 專案名稱 (預設: stock-demo): " PROJECT_NAME
  PROJECT_NAME=${PROJECT_NAME:-stock-demo}
fi

echo "(1/3) 安裝前端相依套件..."
npm install

echo "(2/3) 建置靜態輸出至 out/ (使用 cloud/next.config.js) ..."
NEXT_CONFIG_JS="$(pwd)/cloud/next.config.js"
ORIGINAL_NEXT_CONFIG="$(pwd)/next.config.js"
TEMP_BACKUP="$(pwd)/next.config.local.backup"
API_ROUTE_PATH="$(pwd)/src/app/api/stocks/route.ts"
API_ROUTE_BACKUP="$(pwd)/src/app/api/stocks/route.ts.off"

if [ ! -f "$NEXT_CONFIG_JS" ]; then
  echo "找不到 cloud/next.config.js"; exit 1
fi

# 在 export 建置時，暫時移除 Next.js 內建 API 路由以避免衝突
if [ -f "$API_ROUTE_PATH" ]; then
  mv -f "$API_ROUTE_PATH" "$API_ROUTE_BACKUP" || true
fi

# 備份與替換 next.config.js
if [ -f "$ORIGINAL_NEXT_CONFIG" ]; then
  cp -f "$ORIGINAL_NEXT_CONFIG" "$TEMP_BACKUP"
fi
cp -f "$NEXT_CONFIG_JS" "$ORIGINAL_NEXT_CONFIG"

# 建置
if ! npm run build; then
  echo "npm run build 失敗"
  if [ -f "$TEMP_BACKUP" ]; then cp -f "$TEMP_BACKUP" "$ORIGINAL_NEXT_CONFIG"; fi
  if [ -f "$API_ROUTE_BACKUP" ]; then mv -f "$API_ROUTE_BACKUP" "$API_ROUTE_PATH"; fi
  exit 1
fi

# 建置後還原原始 next.config.js 與 API 路由
if [ -f "$TEMP_BACKUP" ]; then cp -f "$TEMP_BACKUP" "$ORIGINAL_NEXT_CONFIG" && rm -f "$TEMP_BACKUP"; fi
if [ -f "$API_ROUTE_BACKUP" ]; then mv -f "$API_ROUTE_BACKUP" "$API_ROUTE_PATH"; fi

echo "(3/3) 部署到 Cloudflare Pages (專案名稱: $PROJECT_NAME)"
echo
echo "部署說明:"
echo "  - 首次部署時，Wrangler 可能提示: 'Would you like to use an existing project or create a new one?'"
echo "    * 若你已在 Cloudflare 介面建立過同名專案，請選 'Use an existing project' 並選擇 $PROJECT_NAME"
echo "    * 若尚未建立，請選 'Create a new project'，再輸入專案名稱為 $PROJECT_NAME"
echo "    * 出現 'Enter the production branch name' 時，選 main"
echo "  - 若出現權限或登入相關錯誤，請先登入: npx --yes wrangler@latest login"
echo

if [ "$USE_NPX_WRANGLER" = "1" ]; then
  npx --yes wrangler@latest pages deploy "out" --project-name "$PROJECT_NAME" --commit-dirty=true
else
  wrangler pages deploy "out" --project-name "$PROJECT_NAME" --commit-dirty=true
fi

echo "(完成) 部署成功!"
echo "說明: 本專案已包含 functions/api/stocks.js，部署後可使用 /api/stocks 搜尋與股價API。"
echo "若需查看部署結果，請至 Cloudflare Pages 後台或使用 wrangler 列出專案。"


