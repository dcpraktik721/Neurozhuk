@echo off
chcp 65001 > nul
title Поймай Жука — запуск игры
cd /d "%~dp0"

setlocal EnableDelayedExpansion

call "%~dp0scripts\launcher-common.bat" :print_banner

REM ===== Проверка Node.js =====
call "%~dp0scripts\launcher-common.bat" :check_node
if errorlevel 1 (
    call "%~dp0scripts\launcher-common.bat" :print_error "Node.js не установлен или версия ниже 18."
    echo.
    echo  Скачайте Node.js LTS с официального сайта:
    echo  https://nodejs.org/
    echo.
    echo  После установки перезапустите этот файл.
    echo.
    pause
    exit /b 1
)

REM ===== Установка зависимостей =====
call "%~dp0scripts\launcher-common.bat" :install_deps
if errorlevel 1 (
    call "%~dp0scripts\launcher-common.bat" :print_error "Не удалось установить зависимости."
    echo.
    echo  Проверьте подключение к интернету и попробуйте снова.
    echo.
    pause
    exit /b 1
)

REM ===== Запуск браузера через 5 секунд =====
call "%~dp0scripts\launcher-common.bat" :print_info "Браузер откроется автоматически через 5 секунд..."
start "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

REM ===== Запуск dev-сервера (блокирующий вызов) =====
call "%~dp0scripts\launcher-common.bat" :print_success "Запускаю игру Поймай Жука..."
echo.
echo  ============================================================
echo   Игра запускается на http://localhost:3000
echo   Чтобы остановить — закройте это окно или нажмите Ctrl+C
echo  ============================================================
echo.

call npm run dev

REM ===== Если сервер упал — показываем ошибку =====
if errorlevel 1 (
    echo.
    call "%~dp0scripts\launcher-common.bat" :print_error "Сервер остановился с ошибкой."
    echo.
    echo  Попробуйте:
    echo   1. Удалить папку node_modules и запустить файл заново
    echo   2. Проверить, что порт 3000 не занят другой программой
    echo   3. Обратиться к учителю / разработчику
    echo.
    pause
    exit /b 1
)

echo.
call "%~dp0scripts\launcher-common.bat" :print_info "Сервер остановлен. Окно можно закрыть."
pause
exit /b 0
