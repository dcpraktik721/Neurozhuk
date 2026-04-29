'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, CheckCircle } from 'lucide-react';
import BeetleHero from '@/components/illustrations/BeetleHero';
import BrainCircuit from '@/components/illustrations/BrainCircuit';

const childBenefits = [
  'Развитие устного счёта и математического мышления',
  'Повышение концентрации и усидчивости',
  'Игровая мотивация через ранги и достижения',
  'Подготовка к школьным занятиям',
  'Безопасная среда без рекламы и покупок',
];

const adultBenefits = [
  'Поддержание когнитивной активности',
  'Профилактика снижения когнитивных функций',
  'Тренировка скорости реакции и принятия решений',
  'Развитие навыков устного счёта',
  'Отслеживание личного прогресса и динамики',
];

export default function AudienceSection() {
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold mb-4">
            Аудитория
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Для детей и взрослых
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Поймай Жука адаптируется под любой возраст и уровень подготовки
          </p>
        </motion.div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Children */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Для детей 7&ndash;14 лет
                </h3>
                <p className="text-sm text-slate-500 font-medium">Учись играя!</p>
              </div>
            </div>

            {/* Beetle illustration for kids */}
            <div className="flex justify-center mb-5">
              <BeetleHero className="w-24 h-28 opacity-80" />
            </div>

            <ul className="space-y-3">
              {childBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Adults */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-emerald-50">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Для взрослых
                </h3>
                <p className="text-sm text-slate-500 font-medium">Держите мозг в тонусе</p>
              </div>
            </div>

            {/* Brain illustration for adults */}
            <div className="flex justify-center mb-5">
              <BrainCircuit className="w-24 h-24 opacity-80" />
            </div>

            <ul className="space-y-3">
              {adultBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Shared Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-slate-100 shadow-sm">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <p className="text-slate-700 font-medium">
              Родители и педагоги могут использовать Поймай Жука как дополнительный
              инструмент развития когнитивных навыков
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
