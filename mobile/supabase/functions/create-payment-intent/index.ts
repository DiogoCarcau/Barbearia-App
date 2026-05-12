import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0';
import { corsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-12-18.acacia' });
const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { agendamento_id, tenant_id } = await req.json();
    if (!agendamento_id || !tenant_id) throw new Error('agendamento_id e tenant_id são obrigatórios.');

    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .select('id, tenant_id, preco_cobrado, stripe_payment_intent_id, servicos(preco)')
      .eq('id', agendamento_id)
      .eq('tenant_id', tenant_id)
      .single();

    if (error || !agendamento) throw new Error('Agendamento não encontrado para este tenant.');
    const amount = Math.round(Number(agendamento.preco_cobrado || agendamento.servicos?.preco || 0) * 100);
    if (amount <= 0) throw new Error('O agendamento não tem valor válido para pagamento.');

    const paymentIntent = agendamento.stripe_payment_intent_id
      ? await stripe.paymentIntents.retrieve(agendamento.stripe_payment_intent_id)
      : await stripe.paymentIntents.create({
          amount,
          currency: Deno.env.get('STRIPE_CURRENCY') ?? 'eur',
          metadata: { agendamento_id, tenant_id },
          automatic_payment_methods: { enabled: true },
        });

    await supabase
      .from('agendamentos')
      .update({ stripe_payment_intent_id: paymentIntent.id, stripe_status: paymentIntent.status })
      .eq('id', agendamento_id)
      .eq('tenant_id', tenant_id);

    return Response.json({ client_secret: paymentIntent.client_secret }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400, headers: corsHeaders });
  }
});
