'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload04Icon, CpuIcon, Download01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

const steps = [
  {
    icon: Upload04Icon,
    number: '01',
    title: 'Upload Your Images',
    description: 'Drag and drop your images or upload entire folders. Support for JPG, PNG, and all major formats.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: CpuIcon,
    number: '02',
    title: 'AI Processing',
    description: 'Our advanced AI analyzes your images and generates optimized metadata, keywords, and prompts in seconds.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Download01Icon,
    number: '03',
    title: 'Export & Use',
    description: 'Download your metadata in any format or directly upload to stock platforms. Ready to boost your visibility.',
    color: 'from-cyan-500 to-teal-500'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Three simple steps to transform your images into optimized, searchable content
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
                  {/* Step number */}
                  <div className={`absolute -top-6 -left-6 w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} mb-6 mt-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <HugeiconsIcon icon={step.icon} size={48} className="text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Arrow indicator for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-12 transform -translate-y-1/2">
                      <HugeiconsIcon icon={ArrowRight01Icon} size={32} className="text-slate-300" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
