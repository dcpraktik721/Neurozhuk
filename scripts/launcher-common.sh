#!/bin/bash
# launcher-common.sh — общие функции для лаунчеров «Поймай Жука»
# Этот файл только определяет функции и НЕ запускает ничего сам.
# Подключается через `source scripts/launcher-common.sh`.

# ──────────────────────────────────────────────────────────────
# Цветовые ANSI-коды
# ──────────────────────────────────────────────────────────────
COLOR_RESET="\033[0m"
COLOR_RED="\033[1;31m"
COLOR_GREEN="\033[1;32m"
COLOR_YELLOW="\033[1;33m"
COLOR_BLUE="\033[1;34m"
COLOR_MAGENTA="\033[1;35m"
COLOR_CYAN="\033[1;36m"
COLOR_BOLD="\033[1m"

# ──────────────────────────────────────────────────────────────
# print_banner — красивый баннер игры
# ──────────────────────────────────────────────────────────────
print_banner() {
    echo ""
    echo -e "${COLOR_MAGENTA}╔════════════════════════════════════════════════════╗${COLOR_RESET}"
    echo -e "${COLOR_MAGENTA}║                                                    ║${COLOR_RESET}"
    echo -e "${COLOR_MAGENTA}║      🎮  Поймай Жука — Поймай жука  🪲              ║${COLOR_RESET}"
    echo -e "${COLOR_MAGENTA}║                                                    ║${COLOR_RESET}"
    echo -e "${COLOR_MAGENTA}╚════════════════════════════════════════════════════╝${COLOR_RESET}"
    echo ""
}

# ──────────────────────────────────────────────────────────────
# print_error — красное сообщение об ошибке
# Аргументы: $1 — текст сообщения
# ──────────────────────────────────────────────────────────────
print_error() {
    echo -e "${COLOR_RED}❌  $1${COLOR_RESET}"
}

# ──────────────────────────────────────────────────────────────
# print_success — зелёное сообщение об успехе
# Аргументы: $1 — текст сообщения
# ──────────────────────────────────────────────────────────────
print_success() {
    echo -e "${COLOR_GREEN}✅  $1${COLOR_RESET}"
}

# ──────────────────────────────────────────────────────────────
# print_info — обычное информационное сообщение (жёлтое)
# Аргументы: $1 — текст сообщения
# ──────────────────────────────────────────────────────────────
print_info() {
    echo -e "${COLOR_YELLOW}ℹ️   $1${COLOR_RESET}"
}

# ──────────────────────────────────────────────────────────────
# pause_before_exit — пауза, чтобы окно терминала не закрылось
# ──────────────────────────────────────────────────────────────
pause_before_exit() {
    echo ""
    read -r -p "Нажмите Enter для выхода..." _
}

# ──────────────────────────────────────────────────────────────
# check_node — проверка наличия Node.js и его версии (≥ 18)
# Возвращает: 0 — всё ОК, 1 — нет node, 2 — версия слишком старая
# ──────────────────────────────────────────────────────────────
check_node() {
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js не установлен на этом компьютере."
        echo ""
        echo -e "${COLOR_CYAN}Что делать:${COLOR_RESET}"
        echo "  1. Откройте сайт https://nodejs.org"
        echo "  2. Скачайте версию LTS (рекомендуется)"
        echo "  3. Установите Node.js (нажимайте «Далее» во всех окнах)"
        echo "  4. Перезапустите этот файл"
        echo ""
        return 1
    fi

    local node_version
    node_version="$(node -v 2>/dev/null)"
    # Уберём префикс v и возьмём мажорную версию
    local major
    major="${node_version#v}"
    major="${major%%.*}"

    if ! [[ "$major" =~ ^[0-9]+$ ]]; then
        print_error "Не удалось определить версию Node.js (получили: $node_version)."
        return 2
    fi

    if [ "$major" -lt 18 ]; then
        print_error "Версия Node.js устарела: $node_version. Нужна версия 18 или новее."
        echo ""
        echo -e "${COLOR_CYAN}Что делать:${COLOR_RESET}"
        echo "  1. Откройте https://nodejs.org"
        echo "  2. Скачайте свежую LTS-версию"
        echo "  3. Установите её поверх старой"
        echo ""
        return 2
    fi

    print_success "Node.js $node_version найден."
    return 0
}

# ──────────────────────────────────────────────────────────────
# install_deps — устанавливает зависимости, если нет node_modules
# Возвращает: 0 — ОК, 1 — npm install упал
# ──────────────────────────────────────────────────────────────
install_deps() {
    if [ -d "node_modules" ]; then
        print_success "Зависимости уже установлены."
        return 0
    fi

    print_info "Первый запуск, устанавливаю зависимости (займёт 2-3 минуты)..."
    echo ""

    if ! command -v npm >/dev/null 2>&1; then
        print_error "Не найден npm. Обычно он ставится вместе с Node.js — переустановите Node.js с nodejs.org."
        return 1
    fi

    if npm install; then
        echo ""
        print_success "Зависимости установлены."
        return 0
    else
        echo ""
        print_error "Не удалось установить зависимости. Проверьте интернет и попробуйте снова."
        return 1
    fi
}

# ──────────────────────────────────────────────────────────────
# wait_and_open — ждёт 5 секунд и открывает браузер
# Аргументы:
#   $1 — URL (по умолчанию http://localhost:3000)
#   $2 — команда открытия браузера (open / xdg-open / ...)
# Запускается в фоне через `&` вызывающим скриптом.
# ──────────────────────────────────────────────────────────────
wait_and_open() {
    local url="${1:-http://localhost:3000}"
    local browser_cmd="${2:-open}"

    sleep 5

    if command -v "$browser_cmd" >/dev/null 2>&1; then
        "$browser_cmd" "$url" >/dev/null 2>&1 || true
        echo ""
        echo -e "${COLOR_GREEN}🌐  Открываю игру в браузере: $url${COLOR_RESET}"
    else
        echo ""
        echo -e "${COLOR_YELLOW}🌐  Откройте в браузере вручную: $url${COLOR_RESET}"
    fi
}
