import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCompanySearch, useCompanyAnalysis } from './useCompany';
import '@testing-library/jest-dom';

globalThis.fetch = vi.fn();

describe('useCompanySearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com os estados corretos', () => {
    const { result } = renderHook(() => useCompanySearch());
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar dados da empresa com sucesso e limpar o CNPJ na URL', async () => {
    const mockCompany = { razaoSocial: 'Empresa Teste S.A.', leadScore: 'A' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompany,
    });

    const { result } = renderHook(() => useCompanySearch());

    await act(async () => {
      await result.current.searchCompany('12.345.678/0001-99');
    });

    // 🌟 Atualizado para usar a variável de ambiente dinamicamente
    expect(fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/company/12345678000199`, expect.any(Object));
    expect(result.current.data).toEqual(mockCompany);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('deve tratar erros de resposta da API corretamente', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'CNPJ inválido ou não encontrado' }),
    });

    const { result } = renderHook(() => useCompanySearch());

    await act(async () => {
      await result.current.searchCompany('00000000000000');
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe('CNPJ inválido ou não encontrado');
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useCompanyAnalysis Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar os estados de analise corretamente', () => {
    const { result } = renderHook(() => useCompanyAnalysis());
    expect(result.current.analysis).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar a analise do Sales Bot com sucesso', async () => {
    const mockAnalysis = {
      summary: 'Analise de mercado concluida',
      painPoints: ['Falta de automacao'],
      approachSuggestion: 'Abordagem via WhatsApp',
      actionPlan: ['Passo 1'],
      estimatedPotential: 'Alto',
      estimatedPotentialReason: 'Grande porte'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalysis,
    });

    const { result } = renderHook(() => useCompanyAnalysis());

    await act(async () => {
      await result.current.fetchAnalysis('12345678000199');
    });

    // 🌟 Atualizado para usar a variável de ambiente dinamicamente
    expect(fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/company/12345678000199/analysis`, expect.any(Object));
    expect(result.current.analysis).toEqual(mockAnalysis);
    expect(result.current.isLoading).toBe(false);
  });
});