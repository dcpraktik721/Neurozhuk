# Changelog

Журнал изменений и выкладок проекта `neurozhuk`.

Правило ведения:
- добавлять запись при каждом заметном изменении UI, логики, инфраструктуры или деплоя;
- указывать дату, область изменения, краткий результат и статус выкладки.

## 2026-05-02

### Footer logo update
- Область: footer, branding
- Изменение: старый inline SVG `LevArtMark` заменен на реальный PNG-логотип `LOGO Levart.png`
- Файлы:
  - `src/components/layout/Footer.tsx`
  - `public/branding/levart-footer-logo.png`
- Статус: локально проверено, ожидает коммита и выкладки

### Home hero badge refinement
- Область: главная страница, hero badge
- Изменение: увеличены размеры badge и mobile-иконки мозга для лучшей читаемости
- Файлы:
  - `src/components/home/HeroSection.tsx`
- Статус: выкачено ранее, Timeweb revision `5ff5108`
