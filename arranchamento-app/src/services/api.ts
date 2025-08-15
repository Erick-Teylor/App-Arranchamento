// api.ts
import { supabase } from './supabase';

export type Arranchamento = {
  id?: number;
  usuario_id: number;
  data: string;
  cafe: boolean;
  almoco: boolean;
  janta: boolean;
};

export type Presenca = {
  id?: number;
  usuario_id: number;
  companhia: string;
  data: string;
  presente: boolean;
};

// REGISTRO DE USUÁRIO
export const registerUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  return { data, error };
};

// LOGIN
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

// BUSCAR ARRANCHAMENTO
export const fetchArranchamento = async (usuario_id: number, dataDia: string) => {
  const { data, error } = await supabase
    .from<Arranchamento>('arranchamento', { schema: 'public' })
    .select('*')
    .eq('usuario_id', usuario_id)
    .eq('data', dataDia);
  return { data, error };
};

// MARCAR REFEIÇÕES
export const marcarRefeicao = async (
  usuario_id: number,
  dataDia: string,
  cafe: boolean,
  almoco: boolean,
  janta: boolean
) => {
  const { data, error } = await supabase
    .from<Arranchamento>('arranchamento', { schema: 'public' })
    .insert([{ usuario_id, data: dataDia, cafe, almoco, janta }]);
  return { data, error };
};

// MARCAR PRESENÇA (SARGENTO)
export const marcarPresenca = async (
  usuario_id: number,
  companhia: string,
  dataDia: string
) => {
  const { data, error } = await supabase
    .from<Presenca>('presenca', { schema: 'public' })
    .update({ presente: true })
    .eq('usuario_id', usuario_id)
    .eq('data', dataDia);
  return { data, error };
};
