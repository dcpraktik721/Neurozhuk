'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ChevronDown, Sparkles, Trophy, Clock } from 'lucide-react';
import BeetleHero from '@/components/illustrations/BeetleHero';
import NeuronPattern from '@/components/illustrations/NeuronPattern';

const stats = [
  { icon: Sparkles, value: '1000+', label: 'упражнений' },
  { icon: Trophy, value: '10', label: 'уровней мастерства' },
  { icon: Clock, value: '5 минут', label: 'в день' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 min-h-[90vh] flex items-center">
      {/* Neuron background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <NeuronPattern className="w-full h-full opacity-60" />
      </div>

      {/* Gradient orbs (subtle depth) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/18 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold mb-8 shadow-lg shadow-slate-900/10"
          >
            <span className="text-lg">🧠</span>
            Бесплатная платформа для когнитивного развития
          </motion.div>

          {/* Animated beetle SVG — replaces emoji */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, type: 'spring', bounce: 0.3 }}
            className="mb-4 flex justify-center"
          >
            <div className="relative animate-float">
              <BeetleHero className="w-36 h-40 md:w-44 md:h-48 drop-shadow-2xl" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-md"
          >
            Тренируй мозг
            <br />
            <span className="text-yellow-300">играючи</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-medium"
          >
            Поймай Жука — онлайн-платформа для развития внимания, скорости мышления
            и когнитивных навыков. Для детей и взрослых.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/play"
              className="group flex items-center gap-2.5 px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Начать тренировку
            </Link>
            <a
              href="#benefits"
              className="flex items-center gap-2 px-8 py-4 bg-slate-900/20 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border border-white/35 shadow-lg shadow-slate-900/10 hover:bg-slate-900/28 transition-all duration-300"
            >
              Узнать больше
              <ChevronDown className="w-5 h-5" />
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 md:mt-20"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-0 sm:divide-x divide-white/20 bg-slate-900/18 backdrop-blur-md rounded-2xl px-6 sm:px-2 py-5 border border-white/20 shadow-xl shadow-slate-900/10">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 sm:px-8">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15">
                    <stat.icon className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/90 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80V40C240 10 480 0 720 20C960 40 1200 50 1440 40V80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
