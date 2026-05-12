create extension if not exists pgcrypto;

create type public.plano_tenant as enum ('basic', 'pro');
create type public.nivel_fidelidade as enum ('bronze', 'prata', 'ouro', 'platina');
create type public.categoria_servico as enum ('corte', 'barba', 'sobrancelha', 'tratamento', 'outro');
create type public.estado_agendamento as enum ('pendente', 'confirmado', 'concluido', 'cancelado', 'nao_compareceu');
create type public.motivo_bloqueio as enum ('folga', 'ferias', 'manutencao', 'outro');
create type public.tipo_foto_feed as enum ('antes_depois', 'trabalho', 'equipa', 'espaco');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  logo_url text,
  cor_primaria text not null default '#C7A85A',
  cor_secundaria text not null default '#111214',
  descricao text,
  morada text,
  telefone text,
  email_contacto text,
  instagram_url text,
  facebook_url text,
  stripe_customer_id text,
  plano public.plano_tenant not null default 'basic',
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.admin_tenants (
  id uuid primary key default gen_random_uuid(),
  utilizador_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'manager', 'staff')),
  criado_em timestamptz not null default now(),
  unique (utilizador_id, tenant_id)
);

create table public.localizacoes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  nome text not null,
  morada text not null,
  latitude numeric(10,7),
  longitude numeric(10,7),
  telefone text,
  horario jsonb not null default '{}'::jsonb,
  fotos text[] not null default '{}',
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.barbeiros (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  localizacao_id uuid references public.localizacoes(id) on delete set null,
  nome text not null,
  foto_url text,
  bio text,
  especialidades text[] not null default '{}',
  horario_disponivel jsonb not null default '{}'::jsonb,
  ativo boolean not null default true,
  ordem int not null default 0,
  criado_em timestamptz not null default now()
);

create table public.servicos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  nome text not null,
  descricao text,
  duracao_minutos int not null check (duracao_minutos > 0),
  preco numeric(10,2) not null check (preco >= 0),
  categoria public.categoria_servico not null default 'outro',
  foto_url text,
  ativo boolean not null default true,
  ordem int not null default 0,
  criado_em timestamptz not null default now()
);

create table public.utilizadores (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  nome text not null,
  email text not null,
  telefone text,
  data_nascimento date,
  avatar_url text,
  total_visitas int not null default 0,
  total_gasto numeric(10,2) not null default 0,
  nivel_fidelidade public.nivel_fidelidade not null default 'bronze',
  pontos int not null default 0,
  criado_em timestamptz not null default now(),
  unique (tenant_id, email)
);

create table public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  utilizador_id uuid references public.utilizadores(id) on delete set null,
  localizacao_id uuid not null references public.localizacoes(id),
  barbeiro_id uuid references public.barbeiros(id),
  servico_id uuid not null references public.servicos(id),
  data date not null,
  hora_inicio time not null,
  hora_fim time not null,
  estado public.estado_agendamento not null default 'pendente',
  notas_cliente text,
  notas_admin text,
  preco_cobrado numeric(10,2) not null default 0,
  stripe_payment_intent_id text,
  stripe_status text,
  criado_em timestamptz not null default now()
);

create table public.disponibilidade_bloqueada (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  barbeiro_id uuid references public.barbeiros(id) on delete cascade,
  localizacao_id uuid references public.localizacoes(id) on delete cascade,
  data_inicio timestamptz not null,
  data_fim timestamptz not null,
  motivo public.motivo_bloqueio not null default 'outro',
  criado_em timestamptz not null default now(),
  check (data_fim > data_inicio)
);

create table public.fotos_feed (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  localizacao_id uuid references public.localizacoes(id) on delete set null,
  url text not null,
  legenda text,
  tipo public.tipo_foto_feed not null default 'trabalho',
  ordem int not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  utilizador_id uuid not null references public.utilizadores(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  titulo text not null,
  mensagem text not null,
  lida boolean not null default false,
  tipo text not null default 'geral',
  criado_em timestamptz not null default now()
);

create index tenants_slug_idx on public.tenants(slug);
create index localizacoes_tenant_idx on public.localizacoes(tenant_id);
create index barbeiros_tenant_idx on public.barbeiros(tenant_id);
create index barbeiros_localizacao_idx on public.barbeiros(localizacao_id);
create index servicos_tenant_idx on public.servicos(tenant_id);
create index utilizadores_tenant_idx on public.utilizadores(tenant_id);
create index agendamentos_tenant_idx on public.agendamentos(tenant_id);
create index agendamentos_data_idx on public.agendamentos(data);
create index agendamentos_estado_idx on public.agendamentos(estado);
create index agendamentos_utilizador_idx on public.agendamentos(utilizador_id);
create index agendamentos_barbeiro_data_idx on public.agendamentos(barbeiro_id, data);
create index disponibilidade_tenant_idx on public.disponibilidade_bloqueada(tenant_id);
create index disponibilidade_periodo_idx on public.disponibilidade_bloqueada(data_inicio, data_fim);
create index fotos_feed_tenant_idx on public.fotos_feed(tenant_id);
create index notificacoes_tenant_idx on public.notificacoes(tenant_id);
create index notificacoes_utilizador_idx on public.notificacoes(utilizador_id);

alter table public.tenants enable row level security;
alter table public.admin_tenants enable row level security;
alter table public.localizacoes enable row level security;
alter table public.barbeiros enable row level security;
alter table public.servicos enable row level security;
alter table public.utilizadores enable row level security;
alter table public.agendamentos enable row level security;
alter table public.disponibilidade_bloqueada enable row level security;
alter table public.fotos_feed enable row level security;
alter table public.notificacoes enable row level security;

create or replace function public.is_tenant_admin(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_tenants
    where tenant_id = target_tenant and utilizador_id = auth.uid()
  );
$$;

create or replace function public.current_user_tenant(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.utilizadores
    where tenant_id = target_tenant and id = auth.uid()
  );
$$;

create policy "read active tenants" on public.tenants for select using (ativo = true or public.is_tenant_admin(id));
create policy "admins update own tenant" on public.tenants for update using (public.is_tenant_admin(id));
create policy "authenticated create tenant" on public.tenants for insert with check (auth.uid() is not null);

create policy "admins see memberships" on public.admin_tenants for select using (utilizador_id = auth.uid() or public.is_tenant_admin(tenant_id));
create policy "owners manage memberships" on public.admin_tenants for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

create policy "tenant public read locations" on public.localizacoes for select using (ativo = true or public.is_tenant_admin(tenant_id));
create policy "admins manage locations" on public.localizacoes for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

create policy "tenant public read barbers" on public.barbeiros for select using (ativo = true or public.is_tenant_admin(tenant_id));
create policy "admins manage barbers" on public.barbeiros for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

create policy "tenant public read services" on public.servicos for select using (ativo = true or public.is_tenant_admin(tenant_id));
create policy "admins manage services" on public.servicos for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

create policy "users read own profile" on public.utilizadores for select using (id = auth.uid() or public.is_tenant_admin(tenant_id));
create policy "users insert own profile" on public.utilizadores for insert with check (id = auth.uid());
create policy "users update own profile" on public.utilizadores for update using (id = auth.uid() or public.is_tenant_admin(tenant_id)) with check (id = auth.uid() or public.is_tenant_admin(tenant_id));

create policy "users and admins read appointments" on public.agendamentos for select using (utilizador_id = auth.uid() or public.is_tenant_admin(tenant_id));
create policy "users create own appointments" on public.agendamentos for insert with check (utilizador_id = auth.uid() or public.is_tenant_admin(tenant_id));
create policy "users update own cancellable appointments" on public.agendamentos for update using (utilizador_id = auth.uid() or public.is_tenant_admin(tenant_id)) with check (utilizador_id = auth.uid() or public.is_tenant_admin(tenant_id));

create policy "public read blocked availability" on public.disponibilidade_bloqueada for select using (true);
create policy "admins manage blocked availability" on public.disponibilidade_bloqueada for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

create policy "tenant public read feed" on public.fotos_feed for select using (ativo = true or public.is_tenant_admin(tenant_id));
create policy "admins manage feed" on public.fotos_feed for all using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));

create policy "users read own notifications" on public.notificacoes for select using (utilizador_id = auth.uid() or public.is_tenant_admin(tenant_id));
create policy "users update own notifications" on public.notificacoes for update using (utilizador_id = auth.uid()) with check (utilizador_id = auth.uid());
create policy "admins create notifications" on public.notificacoes for insert with check (public.is_tenant_admin(tenant_id));
