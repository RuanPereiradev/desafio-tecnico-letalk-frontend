import { api } from '../lib/axios';
import type { CompanyDTO, SearchFormData } from '../types/company';

export const companyService = {
  async getDetails(cnpj: string): Promise<CompanyDTO> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const { data } = await api.get<CompanyDTO>(`/company/${cleanCnpj}`);
    return data;
  },

  async saveLead(payload: SearchFormData): Promise<void> {
    await api.post('/leads', payload);
  },
};