export type CompanySituation = 'ATIVA' | 'BAIXADA' | 'INAPTA' | 'SUSPENSA';
export type LeadScore = 'A' | 'B' | 'C' | 'D';

export interface Partner {
  name: string;
  role: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CompanyDTO {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacaoCadastral: string;
  dataAbertura: string;
  porte: string;
  capitalSocial: string; 
  enderecoCompleto: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  cnaePrincipal: {
    codigo: number;
    descricao: string;
  };
  segmento: string;
  
  socios: Array<{
    nome?: string;
    name?: string;
    qualificacao?: string;
    role?: string;
  }>;
  
  leadScore: LeadScore;
  leadScoreResumo: string;

  googleMapsUrl: string;
  crmFormattedText: string;
}

export interface SearchFormData {
  name: string;
  email: string;
  phone: string;
  cnpj: string;
}