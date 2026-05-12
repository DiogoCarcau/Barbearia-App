import { useTenant } from './useTenant';

export function useBarbeiros(localizacaoId?: string | null) {
  const { barbeiros } = useTenant();
  return {
    barbeiros: localizacaoId ? barbeiros.filter((barbeiro) => !barbeiro.localizacao_id || barbeiro.localizacao_id === localizacaoId) : barbeiros,
  };
}
