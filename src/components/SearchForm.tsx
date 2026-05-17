import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, User, Mail, Phone, FileDigit } from 'lucide-react';

const searchFormSchema = z.object({
  nome: z.string().min(3, { message: 'Informe o nome completo (mínimo 3 letras)' }),
  email: z.string().email({ message: 'Insira um e-mail corporativo válido' }),
  telefone: z.string().min(14, { message: 'Telefone incompleto' }),
  cnpj: z.string().min(18, { message: 'CNPJ deve conter 14 dígitos' }),
});

type SearchFormData = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  onSearch: (cnpj: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
  });

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    
    value = value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
      
    setValue('cnpj', value, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else {
      value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    setValue('telefone', value, { shouldValidate: true });
  };

  const onSubmit = (data: SearchFormData) => {
    onSearch(data.cnpj);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl space-y-6">
      <div>
        <h2 className="text-base font-bold text-zinc-100 tracking-tight">Captura de Leads B2B</h2>
        <p className="text-zinc-500 text-xs mt-1">Preencha os dados do contato comercial para liberar a consulta do CNPJ.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 uppercase">Nome do Solicitante</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
            <input 
              {...register('nome')}
              placeholder="Ex: Ruan Silva"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition"
            />
          </div>
          {errors.nome && <p className="text-red-400 text-[11px] font-medium">{errors.nome.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 uppercase">E-mail Corporativo</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
            <input 
              {...register('email')}
              type="email"
              placeholder="exemplo@empresa.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition"
            />
          </div>
          {errors.email && <p className="text-red-400 text-[11px] font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 uppercase">Telefone de Contato</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
            <input 
              {...register('telefone')}
              onChange={handlePhoneChange}
              placeholder="(00) 00005-0000"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition"
            />
          </div>
          {errors.telefone && <p className="text-red-400 text-[11px] font-medium">{errors.telefone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 uppercase">CNPJ Alvo</label>
          <div className="relative">
            <FileDigit className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
            <input 
              {...register('cnpj')}
              onChange={handleCnpjChange}
              placeholder="00.000.000/0000-00"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition font-mono"
            />
          </div>
          {errors.cnpj && <p className="text-red-400 text-[11px] font-medium">{errors.cnpj.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="h-4 w-4" />
          {isLoading ? 'Enriquecendo Lead...' : 'Analisar Empresa'}
        </button>
      </form>
    </div>
  );
}