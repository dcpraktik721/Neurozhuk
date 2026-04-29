'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Calculator, Target } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Внимание и концентрация',
    description:
      'Учитесь фокусироваться на главном, отсекая отвлекающие факторы. Регулярные тренировки повышают устойчивость внимания.',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Zap,
    title: 'Скорость мышления',
    description:
      'Развивайте способность быстро обрабатывать информацию и принимать решения. Каждая тренировка ускоряет реакцию.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Calculator,
    title: 'Арифметические навыки',
    description:
      'Совершенствуйте устный счёт в игровой форме. От простых примеров до сложных вычислений — прогресс гарантирован.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Target,
    title: 'Точность и аккуратность',
    description:
      'Тренируйте способность давать правильные ответы без спешки. Баланс скорости и точности — ключ к высоким результатам.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function BenefitsSection() {
  return (
    <section id="benefits" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-4">
            Преимущества
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Что развивает Поймай Жука
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Комплексный подход к тренировке когнитивных функций через
            увлекательную игровую механику
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient top line */}
              <div
                className={`absolute top-0 left-6 right-6 h-1 bg-gradient-to-r ${benefit.color} rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="flex gap-5">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl ${benefit.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
