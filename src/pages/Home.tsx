import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchForm } from '../components/SearchForm';
import { CompanyDashboard } from '../components/CompanyDashboard';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { Building2, ArrowRight, Cpu } from 'lucide-react';
import { useCompanySearch } from '../hooks/useCompany';

export function Home() {
  const [isRotating, setIsRotating] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const { data, isLoading, isError, error, searchCompany } = useCompanySearch();

  useEffect(() => {
    if (isLoading) {
      setIsRotating(true);
      setShowDashboard(false);
    }
    
    if (!isLoading && data) {
      const timer = setTimeout(() => {
        setIsRotating(false);
        setShowDashboard(true);
      }, 600);
      return () => clearTimeout(timer);
    }

    if (isError) {
      setIsRotating(false);
      setShowDashboard(false);
    }
  }, [isLoading, data, isError]);

  const handleSearch = (cnpj: string) => {
    searchCompany(cnpj);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased flex flex-col justify-between font-sans selection:bg-purple-900 selection:text-purple-100 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="py-5 px-8 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-400" />
            <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase font-semibold">Letalk.Insights</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 flex items-center justify-center py-12 lg:py-0">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch min-h-[560px]"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl shadow-black/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-purple-500 to-indigo-500" />
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center perspective-1000">
            <motion.div
              className="w-full h-full"
              animate={{ rotateY: isRotating ? 360 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center">
                    <DashboardSkeleton />
                  </motion.div>
                )}

                {isError && !isLoading && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center">
                    <div className="bg-red-950/20 border border-red-900/30 p-8 rounded-2xl text-center w-full max-w-md shadow-sm">
                      <p className="text-red-400 font-semibold text-sm">Erro na validação do Lead</p>
                      <p className="text-zinc-500 text-xs mt-2 font-mono">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}

                {!isLoading && !isError && !showDashboard && (
                  <motion.div 
                    key="welcome"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full bg-zinc-900 border border-zinc-800 p-8 lg:p-12 rounded-2xl flex flex-col justify-between shadow-xl shadow-black/30 relative overflow-hidden group"
                  >
                    <div className="absolute -top-12 -right-12 w-[280px] h-[280px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="space-y-6 max-w-xl relative z-10">
                      <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 w-fit px-3 py-1 rounded-full text-[11px] text-purple-400 font-mono tracking-wider">
                        <Cpu className="h-3 w-3 text-purple-400" />
                        ENGINE ENRICHMENT B2B v1.0
                      </div>
                      
                      <div className="space-y-3">
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight">
                          Transforme CNPJs brutos em <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-600">Inteligência Comercial</span>
                        </h1>
                        <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                          Acelere sua prospecção outbound conectando diretamente o marketing às informações cadastrais da Receita Federal. Valide o fit de mercado, analise o capital social e descubra o score do lead antes da primeira abordagem.
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-800 mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-zinc-500">Fastify Gateway Ativo</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-400 font-semibold">
                        Insira os dados ao lado para iniciar <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {showDashboard && data && !isLoading && !isError && (
                    <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
                        <CompanyDashboard 
                        data={{
                            ...data,
                            socios: data.socios ? data.socios.map((socio: any) => ({
                              nome: socio.nome || socio.name,
                              qualificacao: socio.qualificacao || socio.role
                            })) : []
                        }} 
                        />
                    </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

