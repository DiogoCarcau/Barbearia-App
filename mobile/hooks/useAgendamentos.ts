import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Agendamento } from '../lib/types';
import { useAuth } from './useAuth';
import { useTenant } from './useTenant';

export function useAgendamentos() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!tenant || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*, localizacoes(nome,morada), barbeiros(nome,foto_url), servicos(nome,preco,duracao_minutos)')
      .eq('tenant_id', tenant.id)
      .eq('utilizador_id', user.id)
      .order('data', { ascending: false });
    if (!error) setAgendamentos((data ?? []) as Agendamento[]);
    setLoading(false);
  }

  async function cancel(id: string) {
    const { error } = await supabase.from('agendamentos').update({ estado: 'cancelado' }).eq('id', id);
    if (error) throw error;
    await refresh();
  }

  useEffect(() => { refresh(); }, [tenant?.id, user?.id]);
  return { agendamentos, loading, refresh, cancel };
}
