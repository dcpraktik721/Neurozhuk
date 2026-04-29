'use client';

import { motion } from 'framer-motion';
import {
  Bug,
  Heart,
  BookOpen,
  Shield,
  Lightbulb,
  Users,
  CheckCircle,
} from 'lucide-react';

const values = [
  {
    icon: BookOpen,
    title: 'Научная достоверность',
    description:
      'Все материалы основаны на исследованиях когнитивной психологии. Мы не делаем необоснованных заявлений о «прокачке мозга».',
  },
  {
    icon: Shield,
    title: 'Честность и прозрачность',
    description:
      'Мы открыто говорим о возможностях и ограничениях когнитивных тренировок. Никаких завышенных обещаний.',
  },
  {
    icon: Heart,
    title: 'Забота о пользователях',
    description:
      'Безопасная среда, адаптированная для детей. Без рекламы, лишних покупок и отвлекающих элементов.',
  },
  {
    icon: Lightbulb,
    title: 'Доступность',
    description:
      'Базовый функционал бесплатен. Мы верим, что доступ к качественным тренировкам не должен зависеть от финансов.',
  },
];

const features = [
  'Математическая аркада с адаптивной сложностью',
  'Научно-популярные статьи о когнитивных функциях',
  'Система рангов и достижений для мотивации',
  'Подробная статистика и отслеживание прогресса',
  'Подходит для детей от 7 лет и взрослых',
  'Рекомендации для родителей и педагогов',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <Bug className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
              О проекте Поймай Жука
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/85 leading-relaxed">
              Платформа для развития когнитивных навыков, которая делает
              тренировку мозга доступной, увлекательной и честной.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-4">
              Наша миссия
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
              Сделать когнитивное развитие доступным для каждого
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600 space-y-4">
              <p>
                Поймай Жука — это онлайн-платформа, которая объединяет игровую
                механику и научный подход к когнитивному развитию. Мы помогаем
                детям и взрослым тренировать внимание, скорость мышления и
                арифметические навыки в увлекательной форме.
              </p>
              <p>
                В основе платформы лежит простая идея: регулярная тренировка
                когнитивных функций может принести пользу каждому. Мы не обещаем
                &laquo;сделать вас гением&raquo; — но предлагаем инструмент,
                который поможет поддерживать и развивать умственную активность.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Поймай Жука */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
              Что мы делаем
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
              Что такое Поймай Жука
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Это комплексная платформа, включающая в себя:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold mb-4">
              Для кого
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
              Кому подходит Поймай Жука
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6 text-center">
                <span className="text-4xl mb-3 block">👧</span>
                <h3 className="font-bold text-slate-900 mb-2">Дети 7&ndash;14 лет</h3>
                <p className="text-sm text-slate-600">
                  Развитие устного счёта, внимания и усидчивости в игровой форме
                </p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 text-center">
                <span className="text-4xl mb-3 block">👨‍💼</span>
                <h3 className="font-bold text-slate-900 mb-2">Взрослые</h3>
                <p className="text-sm text-slate-600">
                  Поддержание когнитивной активности и тренировка скорости
                  мышления
                </p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 text-center">
                <span className="text-4xl mb-3 block">👩‍🏫</span>
                <h3 className="font-bold text-slate-900 mb-2">Педагоги</h3>
                <p className="text-sm text-slate-600">
                  Дополнительный инструмент для учебного процесса и внеклассных
                  занятий
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold mb-4">
              Ценности
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              Чем мы отличаемся
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-50 mb-4">
                  <value.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Project values */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 text-white mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-5">
              Проект, созданный с заботой
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed mb-4">
              Поймай Жука — это проект, который объединяет увлечение образовательными
              технологиями и стремление создать полезный продукт для развития.
            </p>
            <p className="max-w-2xl mx-auto text-slate-500 leading-relaxed">
              Мы постоянно совершенствуем платформу, добавляем новые упражнения и
              материалы, опираясь на обратную связь пользователей и актуальные
              исследования в области когнитивной науки.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
