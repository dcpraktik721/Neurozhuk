'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Flame,
  Award,
  TrendingUp,
  Calendar,
  Star,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Ежедневная статистика',
    description: 'Отслеживайте результаты каждой тренировки',
  },
  {
    icon: Flame,
    title: 'Серии побед',
    description: 'Не прерывайте серию ежедневных тренировок',
  },
  {
    icon: Award,
    title: 'Достижения',
    description: 'Открывайте ачивки за выдающиеся результаты',
  },
  {
    icon: TrendingUp,
    title: 'Система рангов',
    description: 'От Новичка до Абсолютного Чемпиона',
  },
];

// Mock progress bars for the illustration
const mockScores = [
  { day: 'Пн', score: 65, color: 'bg-green-400' },
  { day: 'Вт', score: 78, color: 'bg-green-500' },
  { day: 'Ср', score: 55, color: 'bg-teal-400' },
  { day: 'Чт', score: 92, color: 'bg-emerald-500' },
  { day: 'Пт', score: 85, color: 'bg-teal-500' },
  { day: 'Сб', score: 70, color: 'bg-green-400' },
  { day: 'Вс', score: 95, color: 'bg-emerald-500' },
];

export default function ProgressPreviewSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Mock Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-lg">
              {/* Mock header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Недельный отчёт</p>
                    <p className="text-xs text-slate-50">Очки за неделю</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </div>
              </div>

              {/* Mock bar chart */}
              <div className="flex items-end justify-between gap-2 h-32 mb-4">
                {mockScores.map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative rounded-t-lg overflow-hidden bg-slate-200" style={{ height: '100%' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${item.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`absolute bottom-0 left-0 right-0 ${item.color} rounded-t-lg`}
                      />
                    </div>
                    <span className="text-xs text-slate-50">{item.day}</span>
                  </div>
                ))}
              </div>

              {/* Mock stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                  <p className="text-lg font-bold text-slate-900">540</p>
                  <p className="text-xs text-slate-50">Лучший счёт</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <p className="text-lg font-bold text-slate-900">7</p>
                  </div>
                  <p className="text-xs text-slate-50">Дней подряд</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <p className="text-lg font-bold text-slate-900">92%</p>
                  </div>
                  <p className="text-xs text-slate-50">Точность</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-4">
              Прогресс
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5">
              Отслеживай свой прогресс
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Подробная статистика поможет вам видеть результаты тренировок и
              оставаться мотивированным. Каждый день — шаг к новому рангу.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <feature.icon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {feature.title}
                    </p>
                    <p className="text-xs text-slate-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Зарегистрироваться бесплатно
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
