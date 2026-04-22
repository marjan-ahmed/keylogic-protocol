import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Brain, ChevronRight, BarChart3, Info, RefreshCw, Trash2, Key, Plus, FileUp, X } from 'lucide-react';
import { analyzeMCQPattern, PredictionResult, PDFData } from '../lib/gemini';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FileWrapper {
  file: File;
  id: string;
  base64: string;
}

export default function PatternDashboard() {
  const [inputVal, setInputVal] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [pdfFiles, setPdfFiles] = useState<FileWrapper[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBulkAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputVal.toUpperCase().split(/[, \n]/).filter(v => /^[A-D]$/.test(v));
    setAnswers([...answers, ...cleaned]);
    setInputVal('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newWrappers: FileWrapper[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/pdf') continue;
      
      const base64 = await fileToBase64(file);
      newWrappers.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        base64: base64.split(',')[1] // only the data part
      });
    }
    setPdfFiles([...pdfFiles, ...newWrappers]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (id: string) => {
    setPdfFiles(pdfFiles.filter(f => f.id !== id));
  };

  const clearData = () => {
    setAnswers([]);
    setPdfFiles([]);
    setResult(null);
  };

  const runAnalysis = async () => {
    if (answers.length === 0 && pdfFiles.length === 0) return;
    setLoading(true);
    
    const formattedPdfs: PDFData[] = pdfFiles.map(f => ({
      data: f.base64,
      mimeType: f.file.type
    }));

    const res = await analyzeMCQPattern(answers, formattedPdfs);
    setResult(res);
    setLoading(false);
  };

  const chartData = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(a => counts[a as keyof typeof counts]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [answers]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      
      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16">
        {/* Left: Input Panel */}
        <div className="space-y-12">
          <div>
            <h3 className="text-3xl font-serif font-black mb-2">Ingestion</h3>
            <p className="text-sm opacity-50 font-medium">Capture sequences via manual entry or PDF keys.</p>
          </div>

          <div className="space-y-8">
            {/* PDF Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Document Library</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:opacity-100 opacity-60 transition-opacity"
                >
                  <Plus className="w-3 h-3" /> Add PDF
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                multiple
                className="hidden"
              />
              
              <div className="grid gap-3">
                {pdfFiles.map((f) => (
                  <motion.div 
                    key={f.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-2xl group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black/5 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold truncate max-w-[200px]">{f.file.name}</span>
                    </div>
                    <button onClick={() => removeFile(f.id)} className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                
                {pdfFiles.length === 0 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-black/5 rounded-3xl hover:border-black/20 hover:bg-black/[0.01] transition-all"
                  >
                    <FileUp className="w-8 h-8 opacity-20 mb-3" />
                    <span className="text-xs font-bold opacity-30">Drop past paper PDF keys here</span>
                  </button>
                )}
              </div>
            </div>

            {/* Manual Entry */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Manual Sequence</span>
              <form onSubmit={handleBulkAdd} className="space-y-4">
                <div className="p-1 bg-black/5 rounded-3xl">
                  <textarea
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Enter patterns manually (A, B, C...)"
                    className="w-full bg-transparent border-none focus:ring-0 p-5 font-bold text-sm leading-relaxed min-h-[120px]"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 ink-button text-xs tracking-widest uppercase">
                    Sync Sequence
                  </button>
                  <button onClick={clearData} className="p-3 border border-black/10 rounded-full hover:bg-red-50 hover:border-red-100 text-red-500 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
            
            {/* Cache */}
            {answers.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-black/5">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Cached Sequence ({answers.length})</span>
                <div className="flex flex-wrap gap-2">
                  {answers.map((a, i) => (
                    <span key={i} className="w-7 h-7 flex items-center justify-center rounded-lg bg-black text-white text-[10px] font-bold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={runAnalysis}
            disabled={loading || (answers.length === 0 && pdfFiles.length === 0)}
            className={cn(
              "w-full py-6 rounded-full flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.2em] transition-all",
              (answers.length === 0 && pdfFiles.length === 0)
                ? "bg-black/5 text-black/20 cursor-not-allowed"
                : "bg-black text-white hover:shadow-2xl hover:shadow-black/20 active:scale-[0.98]"
            )}
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
            {loading ? "Decrypting Intelligence" : "Execute AI Predictor"}
          </button>
        </div>

        {/* Right: Analysis Panel */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                key="empty"
                className="h-full flex flex-col items-center justify-center text-center p-20 grid-bg rounded-[40px] border border-black/5"
              >
                <div className="w-24 h-24 bg-black rounded-[32%_68%_55%_45%_/_51%_44%_56%_49%] flex items-center justify-center mb-10 rotate-12">
                  <BarChart3 className="w-10 h-10 text-white opacity-40" />
                </div>
                <h3 className="text-4xl font-serif font-black mb-4">Awaiting Signal</h3>
                <p className="max-w-md text-sm font-medium opacity-40 leading-relaxed mx-auto">
                  Provide historical data via PDF or direct input to initialize the pattern analysis engine.
                </p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                className="h-full flex flex-col items-center justify-center text-center p-20 minimal-card"
              >
                <div className="relative w-32 h-32 mb-12">
                   <motion.div 
                    animate={{ rotate: 360, borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-black/5 border-2 border-black/10"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 animate-spin opacity-50" />
                   </div>
                </div>
                <h3 className="text-3xl font-serif font-black mb-3 italic">Synthesizing Data</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 animate-pulse">Mapping across multi-document sources</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Result Hero */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="minimal-card p-10 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-10">AI Probability</span>
                    <div className="space-y-4">
                      <div className="text-7xl font-serif font-black">{result?.confidence}%</div>
                      <div className="w-full h-1 bg-black/5 overflow-hidden rounded-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result?.confidence}%` }}
                          className="h-full bg-black"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="minimal-card p-10 flex flex-col justify-between bg-black text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-10">Pattern ID</span>
                    <div className="text-3xl font-serif font-bold italic leading-tight">
                      {result?.patternType}
                    </div>
                  </div>
                </div>

                {/* Forecast Sequence */}
                <div className="minimal-card p-12">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-serif font-black italic">The Next Alignment</h3>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Live Forecast</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between max-w-lg mx-auto">
                    {result?.nextAnswers.map((ans, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col items-center gap-3"
                      >
                         <span className="text-[10px] font-bold opacity-30">#{i+1}</span>
                         <span className="text-5xl font-serif font-black">{ans}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats & Rationale */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="minimal-card p-10 space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Logical Rationale</h4>
                    <p className="text-sm font-medium leading-[1.8] opacity-70">
                      {result?.rationale}
                    </p>
                  </div>
                  <div className="minimal-card p-10 space-y-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Statistical Delta</h4>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                          <Tooltip 
                            contentStyle={{ background: '#000', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '10px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Bar dataKey="value" fill="#000" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs font-semibold opacity-40 italic">
                      {result?.statisticalInsight}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
