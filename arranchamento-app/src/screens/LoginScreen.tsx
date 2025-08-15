import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabase'; // seu arquivo api.ts
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!id || !senha) {
      return Alert.alert('Atenção', 'Preencha ID Militar e Senha');
    }

    setLoading(true);

    try {
      console.log('📡 Fazendo login no Supabase Auth...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${id.trim()}@exemplo.com`, // mesmo padrão do registro
        password: senha,
      });

      if (error) {
        console.error('❌ Erro no login:', error.message);
        Alert.alert('Erro', 'ID Militar ou senha inválidos');
        return;
      }

      console.log('✅ Login realizado, ID do usuário:', data.user?.id);
      navigation.navigate('SelectDay');
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      Alert.alert('Erro', 'Não foi possível fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arranchamento</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua ID militar"
        keyboardType="numeric"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Primeiro acesso?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link: { color: 'blue', textAlign: 'center', marginTop: 10 },
});
