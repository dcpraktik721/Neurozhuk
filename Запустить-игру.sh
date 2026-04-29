#!/bin/bash
# ──────────────────────────────────────────────────────────────
# Поймай Жука — лаунчер для Linux
# Запуск из файлового менеджера или из терминала: ./Запустить-игру.sh
# ──────────────────────────────────────────────────────────────

# Переходим в папку проекта (поддержка пробелов и кириллицы)
cd "$(dirname "$0")" || {
    echo "Не удалось перейти в папку проекта."
    read -r -p "Нажмите Enter для выхода..." _
    exit 1
}

# Подключаем общие функции
if [ ! -f "scripts/launcher-common.sh" ]; then
    echo "❌  Не найден файл scripts/launcher-common.sh"
    echo "Похоже, проект распакован не полностью."
    read -r -p "Нажмите Enter для выхода..." _
    exit 1
fi

# shellcheck source=scripts/launcher-common.sh
source "scripts/launcher-common.sh"

# Корректное завершение по Ctrl+C
trap 'echo ""; print_info "Останавливаю игру... Спасибо за игру!"; exit 0' INT TERM

print_banner

# 1. Проверка Node.js
if ! check_node; then
    pause_before_exit
    exit 1
fi

# 2. Установка зависимостей при первом запуске
if ! install_deps; then
    pause_before_exit
    exit 1
fi

# 3. Открыть браузер через 5 секунд (xdg-open, fallback — печать URL)
URL="http://localhost:3000"
if command -v xdg-open >/dev/null 2>&1; then
    (wait_and_open "$URL" "xdg-open") &
else
    (
        sleep 5
        echo ""
        echo -e "\033[1;33m🌐  Откройте в браузере вручную: $URL\033[0m"
    ) &
fi

# 4. Запуск Next.js dev-сервера в foreground
echo ""
print_info "Запускаю игру... (для остановки нажмите Ctrl+C)"
echo ""

npm run dev
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -ne 0 ]; then
    print_error "Сервер завершился с ошибкой (код $EXIT_CODE)."
else
    print_success "Игра остановлена."
fi

pause_before_exit
exit $EXIT_CODE
