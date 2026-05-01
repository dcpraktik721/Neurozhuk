import Link from 'next/link';
import { Bug, Globe, MessageCircle, Mail } from 'lucide-react';

const CONTACT_EMAIL = 'levart72@mail.ru';

function LevArtMark() {
  return (
    <span
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <defs>
          <radialGradient id="lev-art-fill" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#F7F3E8" />
            <stop offset="100%" stopColor="#E4DDC8" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="29" fill="#F5F2E7" />
        <circle cx="32" cy="32" r="22.5" fill="url(#lev-art-fill)" stroke="#A9A59D" strokeWidth="1.8" />
        <text
          x="13.5"
          y="37"
          fontSize="13.5"
          fontWeight="700"
          fill="#343434"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Lev
        </text>
        <circle cx="33.2" cy="33.2" r="2.2" fill="#294BDA" />
        <text
          x="37.5"
          y="37"
          fontSize="13.5"
          fontWeight="700"
          fill="#343434"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Art
        </text>
      </svg>
    </span>
  );
}

const footerLinks = {
  platform: {
    title: 'Платформа',
    links: [
      { name: 'Главная', href: '/' },
      { name: 'Играть', href: '/play' },
      { name: 'Личный кабинет', href: '/dashboard' },
      { name: 'Прогресс', href: '/progress' },
    ],
  },
  theory: {
    title: 'Теория',
    links: [
      { name: 'Когнитивные функции', href: '/theory/cognitive-functions' },
      { name: 'Как работает внимание', href: '/theory/attention' },
      { name: 'Рабочая память', href: '/theory/working-memory' },
      { name: 'О проекте', href: '/about' },
    ],
  },
  support: {
    title: 'Поддержка',
    links: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Для родителей', href: '/parents' },
      { name: 'Обратная связь', href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
  legal: {
    title: 'Правовая информация',
    links: [
      { name: 'Политика конфиденциальности', href: '/privacy' },
      { name: 'Пользовательское соглашение', href: '/terms' },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-md">
                <Bug className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Поймай Жука
              </span>
            </Link>
            <p className="text-sm text-slate-50 leading-relaxed mb-6">
              Онлайн-платформа для развития когнитивных навыков. Тренируйте внимание, скорость мышления и арифметику в игровой форме.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-50 hover:bg-slate-700 hover:text-white transition-all duration-200"
                aria-label="Сайт"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-50 hover:bg-slate-700 hover:text-white transition-all duration-200"
                aria-label="Сообщения"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-50 hover:bg-slate-700 hover:text-white transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-50 hover:text-emerald-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; 2024&ndash;2026 Поймай Жука. Все права защищены.
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <LevArtMark />
            <p>Сделано с заботой о развитии каждого</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
