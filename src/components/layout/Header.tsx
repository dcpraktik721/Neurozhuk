'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bug, Menu, X, User, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'О проекте', href: '/about' },
  { name: 'Теория', href: '/theory' },
  { name: 'Играть', href: '/play' },
  { name: 'Для родителей', href: '/parents' },
  { name: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-md border-b border-slate-100'
          : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <Bug className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Поймай <span className="gradient-text">Жука</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3 min-h-[40px]">
            {loading ? null : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="max-w-[160px] truncate">
                    {profile?.displayName || user.email}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Войти
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-xl hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <User className="w-4 h-4" />
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 pt-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
              {loading ? null : user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="truncate">
                      {profile?.displayName || user.email}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Войти
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 mx-4 px-5 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-md transition-all"
                  >
                    <User className="w-4 h-4" />
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
