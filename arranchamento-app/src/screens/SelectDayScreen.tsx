import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectDay'>;

const next7Days = Array.from({ length: 7 }).map((_, i) => {
  const d = addDays(new Date(), i);
  return {
    date: d,
    label: `${format(d, 'EEE', { locale: ptBR })} · ${format(d, 'd LLL', { locale: ptBR })}`,
    iso: format(d, 'yyyy-MM-dd'),
    isToday: i === 0,
  };
});

export default function SelectDayScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Próximos 7 dias</Text>

      <FlatList
        data={next7Days}
        keyExtractor={(item) => item.iso}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, item.isToday && styles.itemActive]}
            onPress={() => navigation.navigate('Menu', { dateISO: item.iso, label: item.label })}
          >
            <Text style={styles.itemText}>{item.label}</Text>
            {item.isToday && <Text style={styles.tag}>Hoje</Text>}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EFEFF3' },
  header: { fontWeight: '600', marginBottom: 10, color: colors.muted },
  item: {
    padding: 16,
    backgroundColor: colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemActive: { borderColor: colors.primary },
  itemText: { fontSize: 16 },
  tag: { color: colors.bg, backgroundColor: '#276624ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
});
