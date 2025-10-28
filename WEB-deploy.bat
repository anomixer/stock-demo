@echo off
setlocal enabledelayedexpansion

chcp 65001 >nul
echo ================================================
echo (Stock-Demo) === 雲端部署 - Cloudflare Pages ===
echo ================================================
echo.
echo "用途:"
echo "  此批次檔會將本專案以 Next.js 靜態匯出 (output: export) 方式建置到 out/,"
echo "  並使用 Cloudflare Wrangler 部署到 Cloudflare Pages。"
echo "  生產環境 API 由 functions\api\stocks.js 提供 /api/stocks，無需 Next.js 內建 API。"
echo.
echo "部署步驟摘要:"
echo "  1) 輸入 Cloudflare Pages 專案名稱 (預設: stock-demo)"
echo "  2) 安裝套件 (npm install)"
echo "  3) 臨時套用 cloud\\next.config.js 並暫時移除 Next API 路由避免衝突後建置 (npm run build)"
echo "  4) 部署 out/ 到 Cloudflare Pages (wrangler pages deploy)"
echo.
echo "注意: 首次部署前，請先登入 Cloudflare 帳號:"
echo "  -> call npx --yes wrangler@latest login"
echo "  登入時可能會開啟瀏覽器進行授權。"
echo.

REM "檢查 Node.js 與 npm"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo "未找到 Node.js，請先安裝 Node.js 後再重試"
    exit /b 1
)
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo "未找到 npm，請確認 Node.js 安裝完整"
    exit /b 1
)

REM "檢查 Wrangler (Cloudflare CLI)，若無則使用 npx 臨時呼叫"
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo "未找到 wrangler，將以 npx 方式執行 (無需全域安裝)"
    set USE_NPX_WRANGLER=1
) else (
    set USE_NPX_WRANGLER=0
)

echo.
echo "Wrangler 狀態:"
if "%USE_NPX_WRANGLER%"=="1" (
    echo "  未偵測到全域 wrangler，將改用 npx 執行 wrangler"
) else (
    echo "  偵測到全域 wrangler，可直接使用"
)
echo "  若尚未登入，請先執行: call npx --yes wrangler@latest login"
echo.

set PROJECT_NAME=
if not "%1"=="" (
    set PROJECT_NAME=%1
) else (
    echo "請輸入 Cloudflare Pages 專案名稱 (預設: stock-demo):"
    set /p PROJECT_NAME=^> 
    if "%PROJECT_NAME%"=="" set PROJECT_NAME=stock-demo
)

echo "(1/3) 安裝前端相依套件..."
call npm install
if %errorlevel% neq 0 (
    echo "npm install 失敗"
    exit /b 1
)

echo "(2/3) 建置靜態輸出至 out/ (使用 cloud/next.config.js) ..."
set NEXT_CONFIG_JS=%CD%\cloud\next.config.js
if not exist "%NEXT_CONFIG_JS%" (
    echo "找不到 cloud\next.config.js"
    exit /b 1
)

set NODE_OPTIONS=
set NEXT_TELEMETRY_DISABLED=1

REM "以 cloud 設定進行生產建置 (output: export)"
set ORIGINAL_NEXT_CONFIG=%CD%\next.config.js
set TEMP_BACKUP=%CD%\next.config.local.backup

REM "在 export 建置時，暫時移除 Next.js 內建 API 路由以避免與 output: export 衝突"
set API_ROUTE_PATH=%CD%\src\app\api\stocks\route.ts
set API_ROUTE_BACKUP=%CD%\src\app\api\stocks\route.ts.off
if exist "%API_ROUTE_PATH%" (
    move /Y "%API_ROUTE_PATH%" "%API_ROUTE_BACKUP%" >nul
)

if exist "%ORIGINAL_NEXT_CONFIG%" (
    copy /Y "%ORIGINAL_NEXT_CONFIG%" "%TEMP_BACKUP%" >nul
)
copy /Y "%NEXT_CONFIG_JS%" "%ORIGINAL_NEXT_CONFIG%" >nul

call npm run build
if %errorlevel% neq 0 (
    echo "npm run build 失敗"
    if exist "%TEMP_BACKUP%" copy /Y "%TEMP_BACKUP%" "%ORIGINAL_NEXT_CONFIG%" >nul
    if exist "%API_ROUTE_BACKUP%" move /Y "%API_ROUTE_BACKUP%" "%API_ROUTE_PATH%" >nul
    exit /b 1
)

REM "建置後還原原始 next.config.js，避免影響本機 Web-run"
if exist "%TEMP_BACKUP%" (
    copy /Y "%TEMP_BACKUP%" "%ORIGINAL_NEXT_CONFIG%" >nul
    del /Q "%TEMP_BACKUP%" >nul 2>nul
)

REM "還原 API 路由檔案"
if exist "%API_ROUTE_BACKUP%" (
    move /Y "%API_ROUTE_BACKUP%" "%API_ROUTE_PATH%" >nul
)

echo "(3/3) 部署到 Cloudflare Pages (專案名稱: %PROJECT_NAME%)"
echo.
echo 部署說明:
echo   - 首次部署時，Wrangler 可能提示: 'Would you like to use an existing project or create a new one?'
echo     * 若你已在 Cloudflare 介面建立過同名專案，請選 'Use an existing project' 並選擇 %PROJECT_NAME%
echo     * 若尚未建立，請選 'Create a new project'，再輸入專案名稱為 %PROJECT_NAME% 
echo     * 出現 'Enter the production branch name'時，選 main
echo   - 若出現權限或登入相關錯誤，請先登入: call npx --yes wrangler@latest login
echo.
if "%USE_NPX_WRANGLER%"=="1" (
    call npx --yes wrangler@latest pages deploy "out" --project-name "%PROJECT_NAME%" --commit-dirty=true
) else (
    call wrangler pages deploy "out" --project-name "%PROJECT_NAME%" --commit-dirty=true
)
if %errorlevel% neq 0 (
    echo "部署失敗，請檢查 Cloudflare 帳號登入與權限 (wrangler login)"
    echo "提示: 可先執行 -> call npx --yes wrangler@latest login"
    exit /b 1
)

echo "(完成) 部署成功!"
echo "說明: 本專案已包含 functions\api\stocks.js，部署後可使用 /api/stocks 搜尋與股價API。"
echo "若需查看部署結果，請至 Cloudflare Pages 後台或使用 wrangler 列出專案。"

endlocal
