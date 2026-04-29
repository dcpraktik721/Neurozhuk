'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Clock,
  BarChart3,
  Heart,
  CheckCircle,
  BookOpen,
  Brain,
  Users,
  ArrowRight,
} from 'lucide-react';

const safetyPoints = [
  'Без рекламы и всплывающих окон',
  'Нет внутриигровых покупок и скрытых платежей',
  'Подходящий контент для детей от 7 лет',
  'Никаких элементов жестокости или агрессии',
  'Минимальный сбор личных данных',
  'Возможность играть без регистрации',
];

const usageGuide = [
  {
    icon: Clock,
    title: 'Рекомендуемая продолжительность',
    description:
      'Оптимальная продолжительность тренировки — 5-15 минут в день. Короткие, но регулярные занятия эффективнее длительных и редких.',
  },
  {
    icon: BarChart3,
    title: 'Отслеживайте прогресс',
    description:
      'Система статистики позволяет видеть результаты ребёнка: баллы, точность, серии побед. Обсуждайте достижения вместе.',
  },
  {
    icon: Heart,
    title: 'Поддерживайте мотивацию',
    description:
      'Хвалите за прогресс, а не только за результат. Система рангов помогает ставить промежуточные цели.',
  },
  {
    icon: BookOpen,
    title: 'Изучайте теорию вместе',
    description:
      'Раздел "Теория" содержит научно-популярные статьи о когнитивных функциях. Читайте и обсуждайте их с ребёнком.',
  },
];

export default function ParentsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
              Для родителей и педагогов
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/85 leading-relaxed">
              Всё, что нужно знать о Поймай Жука: безопасность, польза и
              рекомендации по использованию.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why cognitive training */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl bg-emerald-50">
                <Brain className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
                  Почему когнитивные тренировки важны для детей
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Когнитивные функции — внимание, рабочая память, скорость
                    обработки информации — играют ключевую роль в обучении и
                    повседневной жизни ребёнка. Развитые когнитивные навыки
                    помогают лучше усваивать школьный материал, быть более
                    сосредоточенным и организованным.
                  </p>
                  <p>
                    Регулярные упражнения в игровой форме могут помочь
                    поддерживать и тренировать эти навыки. При этом важно
                    понимать: когнитивная тренировка — это не замена учёбе, а
                    дополнительный инструмент развития.
                  </p>
                  <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <strong>Важно:</strong> Мы не делаем заявлений о том, что
                    когнитивные тренировки повышают IQ или лечат какие-либо
                    состояния. Поймай Жука — это инструмент для тренировки
                    конкретных навыков: устного счёта, внимания и скорости
                    реакции.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Safety */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-green-50">
                <ShieldCheck className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Безопасность и соответствие
                </h2>
                <p className="text-slate-500">
                  Поймай Жука создан с заботой о детях
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {safetyPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to use */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
              Рекомендации
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
              Как использовать Поймай Жука с ребёнком
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {usageGuide.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Session duration recommendation */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl bg-emerald-100">
                  <Clock className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Рекомендуемый режим тренировок
                  </h3>
                  <div className="space-y-3 text-slate-600">
                    <p>
                      <strong>Для детей 7&ndash;10 лет:</strong> 5&ndash;10 минут в день,
                      3&ndash;5 раз в неделю. Начинайте с обычного режима.
                    </p>
                    <p>
                      <strong>Для детей 11&ndash;14 лет:</strong> 10&ndash;15 минут в день,
                      4&ndash;6 раз в неделю. Можно чередовать обычный и временной режимы.
                    </p>
                    <p>
                      <strong>Для взрослых:</strong> 5&ndash;15 минут в день по удобному
                      графику. Выбирайте режим в зависимости от целей.
                    </p>
                    <p className="text-sm text-slate-500 mt-4">
                      Регулярность важнее продолжительности. Лучше тренироваться
                      по 5 минут каждый день, чем по 30 минут раз в неделю.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-5">
              Попробуйте Поймай Жука вместе с ребёнком
            </h2>
            <p className="max-w-xl mx-auto text-slate-500 mb-8">
              Начните с бесплатной тренировки без регистрации и оцените
              платформу вместе.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/play"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Попробовать бесплатно
              </Link>
              <Link
                href="/theory"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group"
              >
                Читать теорию
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
