'use client';

import { motion } from 'framer-motion';
import { FlaskConical, Gift, Users, ShieldCheck } from 'lucide-react';

const trustItems = [
  {
    icon: FlaskConical,
    title: 'Без псевдонауки',
    description:
      'Все материалы основаны на данных когнитивной психологии и нейронауки. Мы честны в том, что тренировки могут и чего не могут дать.',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Gift,
    title: 'Бесплатно',
    description:
      'Базовая тренировка доступна без оплаты. Никаких скрытых платежей или обязательных подписок для основного функционала.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Users,
    title: 'Для всей семьи',
    description:
      'Подходит детям от 7 лет и взрослым. Адаптивная сложность обеспечивает комфортную тренировку для любого уровня.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: ShieldCheck,
    title: 'Конфиденциальность',
    description:
      'Данные пользователей защищены. Мы не передаём личную информацию третьим лицам и минимизируем сбор данных.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function TrustSection() {
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-4">
            Доверие
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Почему Поймай Жука
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Мы создаём продукт, которому можно доверять
          </p>
        </motion.div>

        {/* Trust Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustItems.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${item.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
