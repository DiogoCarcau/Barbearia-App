import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-12-18.acacia' });
const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  try {
    const event = await stripe.webhooks.constructEventAsync(body, signature ?? '', Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '');
    if (event.type.startsWith('payment_intent.')) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const agendamentoId = paymentIntent.metadata.agendamento_id;
      const tenantId = paymentIntent.metadata.tenant_id;
      const estado = paymentIntent.status === 'succeeded' ? 'confirmado' : undefined;
      if (agendamentoId && tenantId) {
        await supabase
          .from('agendamentos')
          .update({ stripe_status: paymentIntent.status, ...(estado ? { estado } : {}) })
          .eq('id', agendamentoId)
          .eq('tenant_id', tenantId);
      }
    }
    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
});
