import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { colors } from '../theme';
import MealCard from '../components/MealCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, endpoints } from '../services/api';
import { ArranchamentoPayload, Usuario } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export default function MenuScreen({ route, navigation }: Props) {
  const { dateISO, label } = route.params;
  const [cafe, setCafe] = useState(false);
  const [almoco, setAlmoco] = useState(false);
  const [janta, setJanta] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: label ? `Cardápio — ${label}` : 'Cardápio do Dia' });
  }, [label, navigation]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    })();
  }, []);

  async function confirmarSelecoes() {
    if (!user?.id) {
      return Alert.alert('Sessão expirada', 'Faça login novamente.');
    }
    const payload: ArranchamentoPayload = {
      idMilitar: user.id,
      dia: dateISO,
      cafe,
      almoco,
      janta,
    };

    try {
      const { data } = await api.post(endpoints.arranchamento, payload);
      if (data?.success) {
        Alert.alert('Tudo certo!', 'Arranchamento registrado com sucesso.');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Não foi possível registrar.');
      }
    } catch (e: any) {
      Alert.alert('Falha na conexão', e?.message ?? 'Tente novamente');
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
        <Button title="Confirmar Seleções" onPress={confirmarSelecoes} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#EFEFF3', flexGrow: 1 },
  card: { backgroundColor: colors.bg, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border },
});
