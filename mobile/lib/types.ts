export type Tenant = {
  id: string;
  nome: string;
  slug: string;
  logo_url: string | null;
  cor_primaria: string;
  cor_secundaria: string;
  descricao: string | null;
  morada: string | null;
  telefone: string | null;
  email_contacto: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  plano: 'basic' | 'pro';
  ativo: boolean;
};

export type Localizacao = {
  id: string;
  tenant_id: string;
  nome: string;
  morada: string;
  latitude: number | null;
  longitude: number | null;
  telefone: string | null;
  horario: Record<string, { abre?: string; fecha?: string; fechado?: boolean }>;
  fotos: string[];
  ativo: boolean;
};

export type Barbeiro = {
  id: string;
  tenant_id: string;
  localizacao_id: string | null;
  nome: string;
  foto_url: string | null;
  bio: string | null;
  especialidades: string[];
  horario_disponivel: Record<string, unknown>;
  ativo: boolean;
  ordem: number;
};

export type Servico = {
  id: string;
  tenant_id: string;
  nome: string;
  descricao: string | null;
  duracao_minutos: number;
  preco: number;
  categoria: 'corte' | 'barba' | 'sobrancelha' | 'tratamento' | 'outro';
  foto_url: string | null;
  ativo: boolean;
  ordem: number;
};

export type Perfil = {
  id: string;
  tenant_id: string;
  nome: string;
  email: string;
  telefone: string | null;
  data_nascimento: string | null;
  avatar_url: string | null;
  total_visitas: number;
  total_gasto: number;
  nivel_fidelidade: 'bronze' | 'prata' | 'ouro' | 'platina';
  pontos: number;
  criado_em: string;
};

export type Agendamento = {
  id: string;
  tenant_id: string;
  utilizador_id: string | null;
  localizacao_id: string;
  barbeiro_id: string | null;
  servico_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  estado: 'pendente' | 'confirmado' | 'concluido' | 'cancelado' | 'nao_compareceu';
  notas_cliente: string | null;
  preco_cobrado: number;
  localizacoes?: Pick<Localizacao, 'nome' | 'morada'>;
  barbeiros?: Pick<Barbeiro, 'nome' | 'foto_url'> | null;
  servicos?: Pick<Servico, 'nome' | 'preco' | 'duracao_minutos'>;
};

export type FotoFeed = {
  id: string;
  tenant_id: string;
  localizacao_id: string | null;
  url: string;
  legenda: string | null;
  tipo: 'antes_depois' | 'trabalho' | 'equipa' | 'espaco';
  ordem: number;
  ativo: boolean;
};
