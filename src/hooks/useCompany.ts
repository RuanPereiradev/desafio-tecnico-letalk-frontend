import { useState } from 'react';
import type { CompanyDTO } from '../types/company';

export interface CompanyAnalysisDTO {
  summary: string;
  painPoints: string[];
  approachSuggestion: string;
  actionPlan: string[];
  estimatedPotential: 'Alto' | 'Médio' | 'Baixo';
  estimatedPotentialReason: string;
}

export function useCompanySearch() {
  const [data, setData] = useState<CompanyDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompany = async (cnpj: string) => {
    if (!cnpj) return;
    
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/company/${cnpjLimpo}`, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });
      
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Empresa não encontrada ou erro na validação.');
      }

      setData(json);
    } catch (err: any) {
      setIsError(true);
      setError(err.message || 'Erro ao conectar com o servidor.');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, error, searchCompany };
}

export function useCompanyAnalysis() {
  const [analysis, setAnalysis] = useState<CompanyAnalysisDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (cnpj: string) => {
    if (!cnpj) return;
    
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/company/${cnpjLimpo}/analysis`, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });
      
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Falha ao processar análise estatística.');
      }

      setAnalysis(json);
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o motor de análise.');
    } finally {
      setIsLoading(false);
    }
  };

  return { analysis, fetchAnalysis, isLoading, error };
}