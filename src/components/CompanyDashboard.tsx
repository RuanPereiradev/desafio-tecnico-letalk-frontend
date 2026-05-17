import { useState } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { 
  Building2, Calendar, DollarSign, MapPin, Tag, Users, 
  FileText, PieChart as PieIcon, ExternalLink, Copy, Check,
  Bot, Eye, EyeOff, Target, AlertTriangle, ListChecks, Activity
} from 'lucide-react';
import { SociosModal } from './SociosModal';
import type { CompanyDTO } from '../types/company';
import { MarketFitChart } from './MarketFitChat';
import { useCompanyAnalysis } from '../hooks/useCompany';

interface CompanyDashboardProps {
  data: CompanyDTO;
}

export function CompanyDashboard({ data }: CompanyDashboardProps) {
  const [isSocioModalOpen, setIsSocioModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAnalysisVisible, setIsAnalysisVisible] = useState(true);
  
  const { analysis, fetchAnalysis, isLoading, error: analysisError } = useCompanyAnalysis();

  const scoreColors = {
    A: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', colorCode: '#10b981', glow: 'bg-emerald-500/15', level: 4 },
    B: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', colorCode: '#3b82f6', glow: 'bg-blue-500/15', level: 3 },
    C: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', colorCode: '#f59e0b', glow: 'bg-amber-500/15', level: 2 },
    D: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', colorCode: '#ef4444', glow: 'bg-rose-500/15', level: 1 },
  };

  const currentScore = scoreColors[data.leadScore] || scoreColors.C;

  const handleCopyLead = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.crmFormattedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getPorteLevel = (porteStr: string): number => {
    const p = porteStr.toLowerCase();
    const capitalLimpo = Number(data.capitalSocial.replace(/[^\d]/g, '')) / 100;

    if (capitalLimpo > 10000000 || p.includes('enterprise') || p.includes('grande') || p.includes('demais')) {
      return 4;
    }
    if (p.includes('média') || p.includes('medio')) return 3;
    if (p.includes('pequena') || p.includes('epp')) return 2;
    return 1;
  };
  const porteLevel = getPorteLevel(data.porte);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  const floatingCardClass = "bg-zinc-900/95 border border-zinc-800/70 p-6 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] motion-safe:will-change-transform hover:scale-[1.01] hover:bg-zinc-800/50 hover:border-zinc-700 hover:shadow-2xl transition-all duration-300 group";

  return (
    <div className="relative w-full">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none -z-10 transition-all duration-700">
        <div className={`w-full h-full rounded-full ${currentScore.glow} opacity-60`} />
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full p-2" 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
      >
        <motion.div variants={cardVariants} className={`md:col-span-2 flex flex-col justify-between ${floatingCardClass}`}>
          <div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono tracking-wider uppercase mb-2">
              <Building2 className="h-3.5 w-3.5" /> Dados Cadastrais
            </div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight line-clamp-2" title={data.razaoSocial}>{data.razaoSocial}</h2>
            <p className="text-zinc-400 text-sm mt-1 font-medium">{data.nomeFantasia || 'Nome fantasia não informado'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 mt-6 border-t border-zinc-800/40 text-xs font-mono text-zinc-500">
            <div><span className="block text-zinc-600">CNPJ</span><span className="text-zinc-300 font-semibold">{data.cnpj}</span></div>
            <div><span className="block text-zinc-600">SITUAÇÃO</span><span className={`font-bold ${data.situacaoCadastral.toUpperCase().includes('ATIVA') ? 'text-emerald-400' : 'text-rose-400'}`}>STATUS: {data.situacaoCadastral}</span></div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className={`${floatingCardClass} flex flex-col justify-between min-h-[180px]`}>
          <div className="flex items-center justify-between w-full">
            <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase">Lead Qualification</span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
              B2B Fit
            </span>
          </div>
          
          <div className="flex items-center gap-4 my-auto py-2">
            <div className={`w-16 h-16 shrink-0 rounded-xl ${currentScore.bg} flex items-center justify-center border ${currentScore.border} shadow-inner`}>
              <span className={`text-3xl font-black ${currentScore.text}`}>{data.leadScore}</span>
            </div>
      
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wide">Porte da Empresa</span>
              <span className="block text-sm font-bold text-zinc-200 truncate" title={data.porte}>
                {data.porte}
              </span>
              <span className="block text-[11px] text-zinc-400 font-mono mt-0.5">
                Score Nível {porteLevel} de 4
              </span>
            </div>
          </div>
          
          <div className="w-full space-y-1">
            <div className="grid grid-cols-4 gap-1.5 w-full">
              {[1, 2, 3, 4].map((lvl) => (
                <div 
                  key={lvl} 
                  className={`h-1.5 rounded-sm transition-all duration-500 ${
                    lvl <= porteLevel ? currentScore.text.replace('text', 'bg') : 'bg-zinc-800/60'
                  }`} 
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className={`md:col-span-3 ${floatingCardClass} relative`}>
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono tracking-wider uppercase mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-zinc-400" /> Resumo Executivo & Análise Comercial
            </div>
            
            <button 
              onClick={handleCopyLead}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 active:scale-95 transition-all focus:outline-none"
              title="Copiar dados formatados para o CRM"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copiar CRM</span>
                </>
              )}
            </button>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed pr-2">{data.leadScoreResumo}</p>
        </motion.div>

        <motion.div variants={cardVariants} className={`md:col-span-3 ${floatingCardClass} overflow-hidden border-indigo-500/30 bg-gradient-to-b from-zinc-900 via-zinc-900 to-indigo-950/10`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono tracking-wider uppercase mb-1">
                <Bot className="h-4 w-4 text-indigo-400" /> Letalk Sales Bot
              </div>
              <h3 className="text-sm font-bold text-zinc-200">Análise Estratégica de Abordagem Comercial</h3>
              <p className="text-zinc-500 text-xs">Motor de regras interno que identifica dores e fit de mercado.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!analysis) {
                    fetchAnalysis(data.cnpj);
                    setIsAnalysisVisible(true);
                  } else {
                    setIsAnalysisVisible(!isAnalysisVisible);
                  }
                }}
                disabled={isLoading}
                className={`w-full sm:w-auto px-5 py-2.5 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:pointer-events-none ${
                  !analysis 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_20px_rgba(79,70,229,0.3)]' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                }`}
              >
                {isLoading ? (
                  <Bot className="h-3.5 w-3.5 animate-spin" />
                ) : !analysis ? (
                  <Bot className="h-3.5 w-3.5" />
                ) : isAnalysisVisible ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}

                {isLoading ? 'Mapeando Segmento...' : !analysis ? 'Rodar Análise do Bot' : isAnalysisVisible ? 'Ocultar Análise' : 'Ver Análise Gerada'}
              </button>
            </div>
          </div>

          {analysisError && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-mono">
              ⚠️ {analysisError}
            </div>
          )}

          <AnimatePresence>
            {analysis && isAnalysisVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 pt-6 border-t border-zinc-800/60 space-y-5"
              >
                <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center relative">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase text-zinc-400 shrink-0">
                    <Activity className="h-3.5 w-3.5 text-indigo-400" /> Potencial Letalk:
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      analysis.estimatedPotential === 'Alto' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      analysis.estimatedPotential === 'Médio' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {analysis.estimatedPotential}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 italic">"{analysis.estimatedPotentialReason}"</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Sumário Analítico Gerado</span>
                  <p className="text-sm text-zinc-300 leading-relaxed text-justify sm:text-left">{analysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-xl space-y-3">
                    <h4 className="text-xs font-mono uppercase text-rose-400 flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="h-3.5 w-3.5" /> Gargalos de Atendimento Identificados
                    </h4>
                    <ul className="space-y-2">
                      {analysis.painPoints.map((pain, index) => (
                        <li key={index} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-rose-500/70 font-mono mt-0.5">•</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-indigo-950/10 border border-indigo-900/30 rounded-xl space-y-2.5">
                    <h4 className="text-xs font-mono uppercase text-indigo-400 flex items-center gap-1.5 font-bold">
                      <Target className="h-3.5 w-3.5" /> Direcionamento Comercial Sugerido
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed text-justify sm:text-left">{analysis.approachSuggestion}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-xl space-y-3">
                  <h4 className="text-xs font-mono uppercase text-emerald-400 flex items-center gap-1.5 font-bold">
                    <ListChecks className="h-3.5 w-3.5" /> Playbook de Execução Técnica (SDR / Inside Sales)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.actionPlan.map((action, index) => (
                      <div key={index} className="flex gap-2.5 items-start bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/30">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-xs text-zinc-300 leading-normal">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={cardVariants} className={`md:col-span-2 flex flex-col justify-between ${floatingCardClass}`}>
          <div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono tracking-wider uppercase mb-2">
              <Tag className="h-3.5 w-3.5" /> Segmentação de Mercado
            </div>
            <div className="inline-block bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 px-2.5 py-1 rounded-md text-xs font-semibold mb-3">{data.segmento}</div>
            <p className="text-zinc-400 text-xs font-mono"><span className="text-zinc-500 font-bold">CNAE {data.cnaePrincipal.codigo}:</span> {data.cnaePrincipal.descricao}</p>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className={`${floatingCardClass}`}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-800/60 rounded-lg border text-zinc-400"><DollarSign className="h-4 w-4" /></div>
              <div><span className="block text-[10px] font-mono uppercase text-zinc-500">Capital Social</span><span className="text-sm font-bold text-zinc-200">{data.capitalSocial}</span></div>
            </div>
            {data.telefone && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-800/60 rounded-lg border text-zinc-400 font-mono text-[10px] flex items-center justify-center h-8 w-8">TEL</div>
                <div><span className="block text-[10px] font-mono uppercase text-zinc-500">Telefone Comercial</span><span className="text-sm font-semibold text-zinc-200">{data.telefone}</span></div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-800/60 rounded-lg border text-zinc-400"><Calendar className="h-4 w-4" /></div>
              <div><span className="block text-[10px] font-mono uppercase text-zinc-500">Data de Abertura</span><span className="text-sm font-semibold text-zinc-200">{data.dataAbertura}</span></div>
            </div>
          </div>
        </motion.div>

        <motion.a href={data.googleMapsUrl} target="_blank" rel="noopener noreferrer" variants={cardVariants} className={`${floatingCardClass} md:col-span-1 flex flex-col justify-between cursor-pointer hover:border-purple-500/50 focus:outline-none`}>
          <div>
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono tracking-wider uppercase mb-3">
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Localização Corporativa</div>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:text-purple-400 transition-all duration-300" />
            </div>
            <p className="text-zinc-300 text-sm font-medium line-clamp-2">{data.enderecoCompleto}</p>
          </div>
          <p className="text-zinc-500 text-xs font-mono mt-2">{data.municipio} — {data.uf}</p>
        </motion.a>

        <motion.div variants={cardVariants} className={`${floatingCardClass} flex flex-col justify-between`}>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono tracking-wider uppercase mb-1">
            <PieIcon className="h-3.5 w-3.5 text-purple-400" /> Foco Operacional Estimado
          </div>
          <MarketFitChart segmento={data.segmento} scoreColorCode={currentScore.colorCode} />
        </motion.div>

        <motion.button onClick={() => setIsSocioModalOpen(true)} variants={cardVariants} className={`${floatingCardClass} md:col-span-2 text-left cursor-pointer hover:border-purple-500/50 w-full focus:outline-none`}>
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono tracking-wider uppercase mb-2">
            <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Quadro de Sócios</div>
            <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-mono">{data.socios?.length || 0} listados</span>
          </div>
          {data.socios && data.socios.length > 0 ? (
            <div className="space-y-3 max-h-28 overflow-hidden">
              {data.socios.slice(0, 2).map((socio: any, index: number) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-zinc-800/30 pb-1 last:border-0">
                  <p className="text-zinc-300 text-sm font-semibold truncate max-w-md">{socio.nome || socio.name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono bg-zinc-950/40 px-2 py-0.5 rounded border border-zinc-800/40">{socio.qualificacao || socio.role}</p>
                </div>
              ))}
              {data.socios.length > 2 && <p className="text-purple-400 text-xs font-medium pt-1 animate-pulse">+ Ver diretoria completa...</p>}
            </div>
          ) : (
            <p className="text-zinc-600 text-xs italic mt-2">Empresa individual ou sem sócios listados.</p>
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        <SociosModal 
          isOpen={isSocioModalOpen} 
          onClose={() => setIsSocioModalOpen(false)} 
          socios={data.socios} 
          razaoSocial={data.razaoSocial} 
        />
      </AnimatePresence>
    </div>
  );
}