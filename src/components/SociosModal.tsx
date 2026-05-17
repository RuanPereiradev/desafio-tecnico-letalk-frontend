import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, X, Search } from 'lucide-react';

interface SociosModalProps {
  isOpen: boolean;
  onClose: () => void;
  socios: any[];
  razaoSocial: string;
}

export function SociosModal({ isOpen, onClose, socios, razaoSocial }: SociosModalProps) {
  const [searchSocio, setSearchSocio] = useState('');

  if (!isOpen) return null;

  const filteredSocios = (socios || []).filter((socio: any) => {
    const name = socio.nome || socio.name || '';
    return name.toLowerCase().includes(searchSocio.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div 
        className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-2xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative z-10 max-h-[85vh] flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', duration: 0.4 }}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Quadro de Sócios e Administradores</h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">{razaoSocial}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Buscar sócio ou diretor por nome..."
            value={searchSocio}
            onChange={(e) => setSearchSocio(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-purple-500/50 rounded-xl py-2 pl-9 pr-4 text-sm text-zinc-200 focus:outline-none transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar max-h-[50vh]">
          {filteredSocios.length > 0 ? (
            filteredSocios.map((socio: any, index: number) => {
              const nomeSocio = socio.nome || socio.name || 'Nome não identificado';
              const papelSocio = socio.qualificacao || socio.role || 'Cargo não informado';
              const dataEntrada = socio.joinedAt || null;

              return (
                <div key={index} className="bg-zinc-950/40 border border-zinc-800/40 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:border-zinc-700/60 transition-colors">
                  <div>
                    <p className="text-zinc-200 text-sm font-semibold tracking-tight">{nomeSocio}</p>
                    {dataEntrada && (
                      <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Entrada: {dataEntrada}</span>
                    )}
                  </div>
                  <span className="text-xs text-purple-400 font-medium font-mono bg-purple-500/5 border border-purple-500/10 px-2.5 py-1 rounded-lg">
                    {papelSocio}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-zinc-500 text-xs italic text-center py-6">Nenhum sócio encontrado.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}