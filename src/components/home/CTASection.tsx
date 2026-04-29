'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight } from 'lucide-react';
import BeetleHero from '@/components/illustrations/BeetleHero';
import NeuronPattern from '@/components/illustrations/NeuronPattern';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-teal-500 to-blue-500" />

      {/* Neuron pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <NeuronPattern className="w-full h-full opacity-40" />
      </div>

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {/* Beetle illustration instead of emoji */}
          <div className="flex justify-center mb-6">
            <div className="animate-pulse-soft">
              <BeetleHero className="w-20 h-22 drop-shadow-lg" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 drop-shadow-md">
            Готовы начать тренировку?
          </h2>

          <p className="max-w-xl mx-auto text-lg text-white/90 mb-10 leading-relaxed font-medium">
            Создайте аккаунт за 30 секунд и начните развивать когнитивные
            навыки уже сегодня.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="group flex items-center gap-2.5 px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
            >
              <UserPlus className="w-5 h-5" />
              Создать аккаунт
            </Link>

            <Link
              href="/play"
              className="flex items-center gap-2 px-8 py-4 bg-slate-900/22 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border border-white/35 shadow-lg shadow-slate-900/15 hover:bg-slate-900/30 transition-all duration-300"
            >
              или начните без регистрации
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
