@echo off
REM ========================================================
REM  launcher-common.bat — общие функции для лаунчера
REM  Вызов: call launcher-common.bat :имя_функции [аргументы]
REM ========================================================

REM Если передан аргумент — переходим к нужной метке
if not "%~1"=="" goto %~1
goto :eof


REM ========================================================
REM :print_banner — печать баннера игры
REM ========================================================
:print_banner
echo.
echo  ============================================================
echo.
echo     [#] Поймай Жука — Поймай жука!
echo     Школьный проект на Next.js
echo.
echo  ============================================================
echo.
goto :eof


REM ========================================================
REM :print_error — печать сообщения об ошибке
REM Аргумент: %~2 — текст ошибки
REM ========================================================
:print_error
echo.
echo  [ОШИБКА] %~2
goto :eof


REM ========================================================
REM :print_success — печать сообщения об успехе
REM Аргумент: %~2 — текст
REM ========================================================
:print_success
echo  [OK] %~2
goto :eof


REM ========================================================
REM :print_info — информационное сообщение
REM Аргумент: %~2 — текст
REM ========================================================
:print_info
echo  [ИНФО] %~2
goto :eof


REM ========================================================
REM :check_node — проверка наличия Node.js версии >= 18
REM Возврат: errorlevel 0 — всё ок, 1 — нет Node или версия < 18
REM ========================================================
:check_node
call :print_info "Проверяю Node.js..."

where node >nul 2>&1
if errorlevel 1 (
    call :print_error "Node.js не найден в системе."
    exit /b 1
)

REM Получаем версию: формат vX.Y.Z
for /f "tokens=*" %%v in ('node --version 2^>nul') do set "NODE_VER=%%v"

if "%NODE_VER%"=="" (
    call :print_error "Не удалось определить версию Node.js."
    exit /b 1
)

REM Извлекаем мажорную версию: убираем 'v' и берём до первой точки
set "NODE_VER_NUM=%NODE_VER:v=%"
for /f "tokens=1 delims=." %%a in ("%NODE_VER_NUM%") do set "NODE_MAJOR=%%a"

REM Проверяем что NODE_MAJOR — число и >= 18
set /a NODE_MAJOR_INT=%NODE_MAJOR% 2>nul
if %NODE_MAJOR_INT% LSS 18 (
    call :print_error "Версия Node.js слишком старая: %NODE_VER% (нужна 18 или выше)."
    exit /b 1
)

call :print_success "Node.js %NODE_VER% — OK"
exit /b 0


REM ========================================================
REM :install_deps — установка зависимостей если нет node_modules
REM Возврат: errorlevel 0 — ок, 1 — ошибка установки
REM ========================================================
:install_deps
if exist "%~dp0..\node_modules\" (
    call :print_success "Зависимости уже установлены"
    exit /b 0
)

call :print_info "Устанавливаю зависимости (это займёт 2-3 минуты)..."
echo.
echo  Не закрывайте окно! Идёт скачивание npm-пакетов.
echo.

call npm install
if errorlevel 1 (
    call :print_error "npm install завершился с ошибкой."
    exit /b 1
)

call :print_success "Зависимости установлены"
exit /b 0
