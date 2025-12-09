'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileEditIcon, TagsIcon, SparklesIcon, Image02Icon, MagicWand01Icon, Database01Icon } from '@hugeicons/core-free-icons';

const features = [
  {
    icon: FileEditIcon,
    title: 'Smart Metadata Generation',
    description: 'Generate SEO-optimized titles, descriptions, and tags for Adobe Stock, Shutterstock, and other stock platforms instantly.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: TagsIcon,
    title: 'Keyword Optimization',
    description: 'AI-powered keyword suggestions that maximize your content visibility and searchability across all platforms.',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    icon: MagicWand01Icon,
    title: 'Image to Prompt',
    description: 'Transform any image into detailed prompts for Ideogram, Runway ML, Midjourney, and other AI generation tools.',
    gradient: 'from-cyan-500 to-teal-500'
  },
  {
    icon: Image02Icon,
    title: 'Batch Processing',
    description: 'Process multiple images at once and generate metadata for your entire portfolio in minutes, not hours.',
    gradient: 'from-emerald-500 to-green-500'
  },
  {
    icon: SparklesIcon,
    title: 'Multi-Platform Support',
    description: 'Optimized for Adobe Stock, Shutterstock, iStock, Getty Images, and all major stock photography platforms.',
    gradient: 'from-sky-500 to-blue-500'
  },
  {
    icon: Database01Icon,
    title: 'Export & Organize',
    description: 'Export metadata in CSV, JSON, or directly integrate with your workflow. Keep everything organized and accessible.',
    gradient: 'from-violet-500 to-indigo-500'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Creators</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to optimize your stock content and AI workflows in one intelligent platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="relative h-full p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                    <HugeiconsIcon icon={feature.icon} size={40} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
