import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Servico } from '../lib/types';
import { useTenant } from './useTenant';

export function useServicos() {
  const { tenant } = useTenant();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!tenant) return;
    setLoading(true);
    const { data, error } = await supabase.from('servicos').select('*').eq('tenant_id', tenant.id).eq('ativo', true).order('ordem');
    if (!error) setServicos((data ?? []) as Servico[]);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, [tenant?.id]);
  return { servicos, loading, refresh };
}
