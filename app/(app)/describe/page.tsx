'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import UnifiedImageUpload from '@/components/ui/UnifiedImageUpload';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProcessResult {
  success: boolean;
  imageId?: string;
  filename: string;
  description?: string;
  confidence?: number;
  source?: string;
  error?: string;
  index: number;
  remainingCredits?: number;
}

export default function DescribePage() {
  const { user, loading, updateCredits } = useUser();
  const [processedResults, setProcessedResults] = useState<ProcessResult[]>([]);
  const [aiProvider, setAiProvider] = useState<'ideogram' | 'gemini'>('ideogram');

  const handleCreditsUpdate = (newCredits: number) => {
    // Update credits locally without refreshing the session
    updateCredits(newCredits);
  };

  const handleProcessingComplete = (results: ProcessResult[]) => {
    setProcessedResults(results);
  };

  const downloadAllDescriptions = () => {
    if (processedResults.length === 0) return;

    const successfulResults = processedResults.filter(result => result.success && result.description);

    if (successfulResults.length === 0) {
      alert('No successful descriptions to download.');
      return;
    }

    const textContent = successfulResults
      .map(result => result.description)
      .join('\n\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `image-descriptions-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Simplified Premium Header */}
        <div className="text-center space-y-4 mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black tracking-tight text-slate-900"
          >
            Describe <span className="text-blue-600">Workspace</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-xl max-w-2xl mx-auto font-medium"
          >
            Professional high-fidelity image descriptions powered by industry-leading AI models.
          </motion.p>
        </div>

        {/* Floating Provider Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm ring-4 ring-slate-50">
            <button
              onClick={() => setAiProvider('ideogram')}
              className={cn(
                "px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2",
                aiProvider === 'ideogram'
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Sparkles className="w-4 h-4" />
              Ideogram
            </button>
            <button
              onClick={() => setAiProvider('gemini')}
              className={cn(
                "px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2",
                aiProvider === 'gemini'
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <BrainCircuit className="w-4 h-4" />
              Gemini Pro
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-1 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <UnifiedImageUpload
            userCredits={user?.credits || 0}
            onCreditsUpdate={handleCreditsUpdate}
            onProcessingComplete={handleProcessingComplete}
            showDownloadButton={processedResults.length > 0}
            onDownloadAll={downloadAllDescriptions}
            downloadButtonText="Export Descriptions"
            aiProvider={aiProvider}
          />
        </div>

        {processedResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24 space-y-12"
          >
            <div className="flex items-end justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Output Lab</h2>
                <p className="text-slate-500 mt-1">Review and manage your generated content</p>
              </div>
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100">
                {processedResults.filter(r => r.success).length} Successfully Described
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processedResults
                .filter(result => result.success && result.description)
                .map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:border-blue-200 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full",
                        result.source === 'gemini' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {result.source}
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 border border-slate-100">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-slate-800 line-clamp-1 flex-1">
                          {result.filename}
                        </h3>
                      </div>

                      <div className="relative">
                        <p className="text-slate-600 leading-[1.8] text-lg font-medium italic">
                          &ldquo;{result.description}&rdquo;
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                          Reliability Score
                        </span>
                        <span className="text-emerald-500 font-black text-sm">
                          {result.confidence}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}