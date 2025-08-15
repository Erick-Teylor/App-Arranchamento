import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  question: string;
};

export default function MealCard({ title, subtitle, value, onChange, question }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.row}>
        <Text style={styles.question}>{question}</Text>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Não</Text>
          <Switch value={value} onValueChange={onChange} />
          <Text style={styles.label}>Sim</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  subtitle: { color: colors.muted, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: colors.muted },
  question: { color: colors.text, marginRight: 10 },
});
