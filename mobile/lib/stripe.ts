import { supabase } from './supabase';

export async function createPaymentIntent(agendamentoId: string, tenantId: string) {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: { agendamento_id: agendamentoId, tenant_id: tenantId },
  });
  if (error) throw error;
  return data as { client_secret: string };
}
