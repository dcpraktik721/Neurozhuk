'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Eye, Database, ArrowRight } from 'lucide-react';

const topics = [
  {
    icon: Brain,
    title: 'Что такое когнитивные функции',
    description:
      'Познакомьтесь с основными когнитивными процессами: вниманием, памятью, мышлением и их ролью в повседневной жизни.',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Eye,
    title: 'Как работает внимание',
    description:
      'Узнайте, как мозг фильтрует информацию, что такое избирательное внимание и как его тренировать.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Database,
    title: 'Зачем тренировать рабочую память',
    description:
      'Рабочая память — основа обучения и решения задач. Разберёмся, как она работает и как её укрепить.',
    color: 'from-teal-500 to-green-500',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

export default function TheoryPreviewSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-4">
              Научная основа
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5">
              Тренировки, подкреплённые наукой
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Все упражнения и материалы Поймай Жука основаны на исследованиях в
              области когнитивной психологии и нейронауки. Мы не обещаем чудес —
              мы предлагаем проверенные методы тренировки когнитивных функций.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              В разделе &laquo;Теория&raquo; вы найдёте понятные и достоверные
              материалы о том, как работает мозг, что такое когнитивные функции и
              как их можно развивать.
            </p>
            <Link
              href="/theory"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group transition-colors"
            >
              Читать все статьи
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: Topic Cards */}
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href="/theory"
                  className="group flex gap-5 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl ${topic.bgColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <topic.icon className={`w-6 h-6 ${topic.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
