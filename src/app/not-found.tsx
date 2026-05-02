import Link from 'next/link';
import { Bug, Home, Play } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
          <Bug className="h-8 w-8" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
          Ошибка 404
        </p>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          Страница не найдена
        </h1>
        <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Такой страницы нет или адрес изменился. Можно вернуться на главную
          или сразу перейти к тренировке.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
          >
            <Home className="h-4 w-4" />
            На главную
          </Link>
          <Link
            href="/play"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
          >
            <Play className="h-4 w-4" />
            Играть
          </Link>
        </div>
      </div>
    </div>
  );
}
