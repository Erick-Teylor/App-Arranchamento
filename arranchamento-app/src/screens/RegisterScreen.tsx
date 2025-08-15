import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { colors } from '../theme';
import { supabase } from '../services/supabase'; // Certifique-se que está no caminho certo

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function criarConta() {
    if (!id || !nome || !senha) {
      return Alert.alert('Atenção', 'Preencha todos os campos');
    }
    if (senha !== confirm) {
      return Alert.alert('Atenção', 'As senhas não conferem');
    }

    setLoading(true);

    try {
      console.log('📡 Criando usuário no Supabase Auth...');
      const { data, error } = await supabase.auth.signUp({
        email: `${id.trim()}@exemplo.com`, // ID Militar como email fictício
        password: senha,
      });

      if (error) {
        console.error('❌ Erro no Auth:', error.message);
        Alert.alert('Erro', error.message);
        return;
      }

      console.log('✅ Usuário criado no Auth:', data.user?.id);

      console.log('📡 Inserindo na tabela usuarios...');
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert([
          {
            id_militar: id, // Nome da coluna deve bater com o banco
            nome: nome,
            auth_id: data.user?.id,
          },
        ]);

      if (insertError) {
        console.error('❌ Erro na tabela usuarios:', insertError.message);
        Alert.alert('Erro', insertError.message);
        return;
      }

      console.log('✅ Registro salvo na tabela usuarios');
      Alert.alert('Sucesso', 'Conta criada! Faça login.');
      navigation.goBack();
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      Alert.alert('Erro', 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Primeiro Acesso</Text>
        <Text style={styles.muted}>Configure sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder="ID Militar"
          value={id}
          onChangeText={setId}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <Button
          title={loading ? 'Criando...' : 'Criar Conta'}
          onPress={criarConta}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#EFEFF3' },
  card: { backgroundColor: colors.bg, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  muted: { textAlign: 'center', color: colors.muted, marginBottom: 16, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F7F7F9',
    marginBottom: 10,
  },
});
