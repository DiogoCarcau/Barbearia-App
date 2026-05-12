import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

const templates = {
  confirmacao: (payload: Record<string, string>) => ({
    subject: `Agendamento confirmado - ${payload.tenant_nome}`,
    html: `<h1>Agendamento confirmado</h1><p>${payload.nome}, o teu agendamento em ${payload.data} às ${payload.hora} ficou confirmado.</p>`,
  }),
  lembrete_24h: (payload: Record<string, string>) => ({
    subject: `Lembrete do teu agendamento - ${payload.tenant_nome}`,
    html: `<h1>Até amanhã</h1><p>${payload.nome}, lembramos o teu agendamento de amanhã às ${payload.hora}.</p>`,
  }),
  cancelamento: (payload: Record<string, string>) => ({
    subject: `Agendamento cancelado - ${payload.tenant_nome}`,
    html: `<h1>Agendamento cancelado</h1><p>O teu agendamento foi cancelado.</p>`,
  }),
  resumo_admin: (payload: Record<string, string>) => ({
    subject: `Resumo semanal - ${payload.tenant_nome}`,
    html: `<h1>Resumo semanal</h1><p>${payload.resumo ?? ''}</p>`,
  }),
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { to, template, payload, tenant_id } = await req.json();
    if (!to || !template || !tenant_id) throw new Error('to, template e tenant_id são obrigatórios.');
    const { data: tenant } = await supabase.from('tenants').select('nome,email_contacto').eq('id', tenant_id).single();
    const content = templates[template as keyof typeof templates]?.({ ...(payload ?? {}), tenant_nome: tenant?.nome ?? '' });
    if (!content) throw new Error('Template inválido.');

    const provider = Deno.env.get('EMAIL_PROVIDER') ?? 'resend';
    const apiKey = Deno.env.get(provider === 'sendgrid' ? 'SENDGRID_API_KEY' : 'RESEND_API_KEY');
    if (!apiKey) throw new Error('Configura RESEND_API_KEY ou SENDGRID_API_KEY.');

    const response = provider === 'sendgrid'
      ? await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: tenant?.email_contacto ?? Deno.env.get('EMAIL_FROM') },
            subject: content.subject,
            content: [{ type: 'text/html', value: content.html }],
          }),
        })
      : await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: Deno.env.get('EMAIL_FROM'),
            to,
            subject: content.subject,
            html: content.html,
          }),
        });

    if (!response.ok) throw new Error(await response.text());
    return Response.json({ sent: true }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400, headers: corsHeaders });
  }
});
