# X Barber - App de Agendamento

Aplicação completa base para barbearias e cabeleireiros, com cliente mobile em React Native/Expo, painel web de administração, Supabase e preparação para Stripe.

## Estrutura

- `mobile/`: app Expo com autenticação, home, feed, agendamento, perfil, agendamentos, sobre nós e definições.
- `admin/`: painel web Vite + React para gestão operacional.
- `mobile/supabase/schema.sql`: schema Supabase com tabelas, índices, RLS e dados iniciais.

## Funcionalidades incluídas

- Login email/password, registo e OAuth Google via Supabase.
- Português por padrão e Inglês nas definições.
- Modo claro/escuro persistente.
- Barra inferior fixa: Início, Agendar, Agendamentos, Perfil, Definições.
- Home com avatar, saudação, pontos de fidelidade, seletor de localização e feed visual.
- Fluxo de agendamento em 5 passos: localização, serviço, barbeiro, data/hora e confirmação.
- Serviços base: corte normal, degradê, cabelo + barba, barba à máquina e sobrancelhas.
- Notificação push local na confirmação e ponto de ligação para email via Supabase Edge Function.
- Perfil com upload de avatar por galeria ou câmara, dados editáveis e estatísticas.
- Agendamentos próximos, histórico e cancelamento até X horas antes.
- Sobre Nós com história, equipa, mapa, horário, telefone, Instagram e Facebook.
- Admin web com localizações, serviços, barbeiros, calendário/lista, bloqueios e clientes.
- Stripe Provider configurado no mobile para pagamentos com PaymentIntent criado no backend.

## Configuração local

### Mobile

```bash
cd mobile
cp .env.example .env
npm install
npm run start
```

Preenche `mobile/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Supabase

1. Cria um projeto no Supabase.
2. Executa `mobile/supabase/schema.sql`.
3. Ativa Auth por Email e Google.
4. Cria buckets `avatars` e `fotos-local`.
5. Para produção, adiciona uma role/admin claim e políticas RLS específicas para o painel admin.

### Stripe

O mobile já tem `@stripe/stripe-react-native` e `StripeProvider`. O fluxo recomendado é:

1. Criar uma Supabase Edge Function para gerar `PaymentIntent`.
2. Guardar `stripe_payment_intent` e `stripe_status` em `agendamentos`.
3. Confirmar pagamento antes de marcar o agendamento como `confirmado`.

### Admin web

```bash
cd admin
npm install
npm run dev
```

O admin usa dados locais de demonstração para abrir de imediato. Para produção, troca os arrays por queries/mutations Supabase nas tabelas correspondentes.
