'use client';

import { motion } from 'framer-motion';
import { Gamepad2, BookOpen, TrendingUp } from 'lucide-react';
import GamePreview from '@/components/illustrations/GamePreview';

const steps = [
  {
    number: '01',
    icon: Gamepad2,
    title: 'Играй',
    description:
      'Лови жуков с правильными ответами. Решай примеры на скорость и точность. Каждый раунд — новый вызов!',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Учись',
    description:
      'Читай научно-популярные материалы о работе мозга и когнитивных функциях. Понимай, как устроено мышление.',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Расти',
    description:
      'Отслеживай прогресс, улучшай результаты и поднимайся в ранге. От Новичка до Абсолютного Чемпиона!',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
            Как это работает
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Три шага к результату
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Простой и понятный процесс тренировки, который приносит реальные результаты
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-[88px] left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-green-300 via-blue-300 to-amber-300" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Vertical connection line (mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-[50%] top-full w-0.5 h-8 bg-gradient-to-b from-slate-300 to-transparent -translate-x-1/2" />
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step Number Circle */}
                  <div className="relative mb-6">
                    <div
                      className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
                    >
                      <step.icon className="w-9 h-9" />
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-900 text-sm font-bold shadow-md border-2 border-slate-100">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Game Preview Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex justify-center"
        >
          <div className="relative max-w-lg w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 via-teal-400/20 to-blue-400/20 rounded-3xl blur-2xl" />
            <div className="relative bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-700/50">
              <GamePreview className="w-full rounded-xl" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white rounded-full shadow-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-700">Превью игрового поля</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
