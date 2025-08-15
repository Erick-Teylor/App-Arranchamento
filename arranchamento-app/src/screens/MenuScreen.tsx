// MenuScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { colors } from '../theme';
import MealCard from '../components/MealCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchArranchamento, marcarRefeicao } from '../services/api';
import { Usuario } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export default function MenuScreen({ route, navigation }: Props) {
  const { dateISO, label } = route.params;
  const [cafe, setCafe] = useState(false);
  const [almoco, setAlmoco] = useState(false);
  const [janta, setJanta] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  // Ajusta título da tela
  useEffect(() => {
    navigation.setOptions({ title: label ? `Cardápio — ${label}` : 'Cardápio do Dia' });
  }, [label, navigation]);

  // Carrega usuário e arranchamento do dia
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('user');
      if (raw) {
        const userData = JSON.parse(raw);
        setUser(userData);

        // Buscar arranchamento do dia
        const { data, error } = await fetchArranchamento(userData.id, dateISO);
        if (error) {
          console.error('Erro ao buscar arranchamento:', error);
        } else if (data && data.length > 0) {
          setCafe(data[0].cafe);
          setAlmoco(data[0].almoco);
          setJanta(data[0].janta);
        }
      } else {
        Alert.alert('Sessão expirada', 'Faça login novamente.');
        navigation.navigate('Login');
      }
    })();
  }, [dateISO, navigation]);

  // Confirma seleção e envia para o Firebase
  async function confirmarSelecoes() {
    if (!user?.id) {
      return Alert.alert('Sessão expirada', 'Faça login novamente.');
    }

    setLoading(true);
    try {
      const { data, error } = await marcarRefeicao(user.id, dateISO, cafe, almoco, janta);
      if (error) {
        console.error('Erro ao marcar refeição:', error);
        Alert.alert('Erro', 'Não foi possível registrar.');
      } else {
        Alert.alert('Tudo certo!', 'Arranchamento registrado com sucesso.');
        // Atualiza ícone no SelectDayScreen automaticamente
        navigation.goBack();
      }
    } catch (e: any) {
      console.error('Falha na conexão:', e);
      Alert.alert('Falha na conexão', e?.message ?? 'Tente novamente');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <MealCard
          title="Café da Manhã"
          subtitle="Pão, café, leite, frutas, queijo, presunto"
          value={cafe}
          onChange={setCafe}
          question="Vai tomar café?"
        />
        <MealCard
          title="Almoço"
          subtitle="Arroz, feijão, carne, salada, sobremesa"
          value={almoco}
          onChange={setAlmoco}
          question="Vai almoçar?"
        />
        <MealCard
          title="Jantar"
          subtitle="Sopa, pão, carne, legumes, fruta"
          value={janta}
          onChange={setJanta}
          question="Vai jantar?"
        />
        <Button title={loading ? 'Confirmando...' : 'Confirmar Seleções'} onPress={confirmarSelecoes} disabled={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#EFEFF3', flexGrow: 1 },
  card: { backgroundColor: colors.bg, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border },
});
