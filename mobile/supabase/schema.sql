create extension if not exists pgcrypto;

create table public.utilizadores (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  email text unique not null,
  telemovel text,
  data_nascimento date,
  avatar text,
  total_visitas int not null default 0,
  nivel_fidelidade text not null default 'Bronze' check (nivel_fidelidade in ('Bronze','Prata','Ouro')),
  total_gasto numeric(10,2) not null default 0,
  membro_desde timestamptz not null default now(),
  push_token text,
  idioma text not null default 'pt' check (idioma in ('pt','en')),
  notificacoes_ativas boolean not null default true
);

create table public.localizacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  morada text not null,
  telefone text,
  instagram_url text,
  facebook_url text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  horario jsonb not null default '{}'::jsonb,
  foto_capa text,
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  nome_en text,
  preco numeric(10,2) not null,
  duracao_min int not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.barbeiros (
  id uuid primary key default gen_random_uuid(),
  localizacao_id uuid not null references public.localizacoes(id) on delete cascade,
  nome text not null,
  bio text,
  foto text,
  disponibilidade jsonb not null default '{}'::jsonb,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.fotos_local (
  id uuid primary key default gen_random_uuid(),
  localizacao_id uuid not null references public.localizacoes(id) on delete cascade,
  url text not null,
  categoria text not null check (categoria in ('progresso','resultado','equipa','espaco')),
  legenda text,
  created_at timestamptz not null default now()
);

create table public.disponibilidade_barbeiro (
  id uuid primary key default gen_random_uuid(),
  barbeiro_id uuid not null references public.barbeiros(id) on delete cascade,
  data date not null,
  slot time not null,
  disponivel boolean not null default true,
  motivo_bloqueio text,
  unique (barbeiro_id, data, slot)
);

create table public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  utilizador_id uuid references public.utilizadores(id) on delete set null,
  localizacao_id uuid not null references public.localizacoes(id),
  barbeiro_id uuid not null references public.barbeiros(id),
  servico_id uuid not null references public.servicos(id),
  data date not null,
  hora time not null,
  estado text not null check (estado in ('pendente','confirmado','cancelado','concluido')) default 'pendente',
  cancelavel_ate timestamptz,
  stripe_payment_intent text,
  stripe_status text,
  notas text,
  created_at timestamptz not null default now(),
  unique (barbeiro_id, data, hora)
);

create index agendamentos_utilizador_idx on public.agendamentos(utilizador_id, data desc);
create index agendamentos_barbeiro_dia_idx on public.agendamentos(barbeiro_id, data, hora);
create index fotos_local_feed_idx on public.fotos_local(localizacao_id, created_at desc);

alter table public.utilizadores enable row level security;
alter table public.localizacoes enable row level security;
alter table public.servicos enable row level security;
alter table public.barbeiros enable row level security;
alter table public.fotos_local enable row level security;
alter table public.disponibilidade_barbeiro enable row level security;
alter table public.agendamentos enable row level security;

create policy "public read active locations" on public.localizacoes for select using (ativa = true);
create policy "public read active services" on public.servicos for select using (ativo = true);
create policy "public read active barbers" on public.barbeiros for select using (ativo = true);
create policy "public read feed photos" on public.fotos_local for select using (true);
create policy "public read availability" on public.disponibilidade_barbeiro for select using (true);

create policy "users read own profile" on public.utilizadores for select using (auth.uid() = id);
create policy "users update own profile" on public.utilizadores for update using (auth.uid() = id);
create policy "users insert own profile" on public.utilizadores for insert with check (auth.uid() = id);

create policy "users read own appointments" on public.agendamentos for select using (auth.uid() = utilizador_id);
create policy "users create own appointments" on public.agendamentos for insert with check (auth.uid() = utilizador_id);
create policy "users cancel own appointments" on public.agendamentos for update using (auth.uid() = utilizador_id) with check (estado in ('cancelado','pendente','confirmado'));

insert into public.localizacoes (id, nome, descricao, morada, telefone, instagram_url, facebook_url, latitude, longitude, horario, foto_capa) values
('11111111-1111-4111-8111-111111111111', 'Barbearia Central', 'Cortes clássicos, degradês e barba no centro da cidade.', 'Rua Garrett 32, Lisboa', '+351910000000', 'https://instagram.com/xbbarbearia', 'https://facebook.com/xbbarbearia', 38.7105000, -9.1418000, '{"seg-sab":"09:00-20:00"}', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200'),
('22222222-2222-4222-8222-222222222222', 'Studio Norte', 'Espaço moderno para cabelo, barba e sobrancelha.', 'Rua das Flores 88, Porto', '+351920000000', 'https://instagram.com/xbbarbearia', 'https://facebook.com/xbbarbearia', 41.1457000, -8.6109000, '{"ter-dom":"10:00-21:00"}', 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=1200');

insert into public.servicos (id, nome, nome_en, preco, duracao_min) values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Corte normal', 'Classic cut', 18, 30),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Degradê', 'Fade', 22, 40),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Cabelo + Barba', 'Hair + Beard', 32, 60),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'Barba à máquina', 'Machine beard trim', 12, 20),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5', 'Tratamento de sobrancelha', 'Eyebrow treatment', 8, 15),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6', 'Sobrancelha à navalha', 'Razor eyebrow detail', 10, 15);

insert into public.barbeiros (id, localizacao_id, nome, bio, foto, disponibilidade) values
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', '11111111-1111-4111-8111-111111111111', 'Tiago Mendes', 'Especialista em degradê e cortes clássicos.', 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=500', '{"seg-sex":"09:00-18:00"}'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', '11111111-1111-4111-8111-111111111111', 'Mara Silva', 'Barba, cabelo e detalhes de sobrancelha.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', '{"ter-sab":"11:00-20:00"}'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', '22222222-2222-4222-8222-222222222222', 'Rui Costa', 'Cortes modernos e finalização premium.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500', '{"ter-dom":"10:00-19:00"}');
