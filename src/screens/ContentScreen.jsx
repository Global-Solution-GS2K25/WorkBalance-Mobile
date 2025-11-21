import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { colors, spacing } from '../theme';

const tips = [
  { icon: '⏱️', title: 'Pausas conscientes', description: 'Faça micro pausas de 5 minutos a cada 50 minutos de foco. Levante, respire e alongue o pescoço.' },
  { icon: '🌬️', title: 'Respiração guiada', description: 'Inspire por 4 segundos, segure por 4 e expire por 6. Repita 5 vezes para desacelerar.' },
  { icon: '🧘‍♀️', title: 'Alongamentos rápidos', description: 'Realize movimentos circulares com ombros e punhos para aliviar tensões.' },
  { icon: '💡', title: 'Ambiente saudável', description: 'Priorize iluminação natural e organize sua mesa para reduzir distrações.' },
  { icon: '😴', title: 'Higiene do sono', description: 'Estabeleça horário para dormir e evite telas 30 minutos antes de se deitar.' },
];

export default function ContentScreen() {
  return (
    <Screen scrollable>
      <Text style={styles.title}>Conteúdos para equilibrar mente e rotina</Text>
      <Text style={styles.subtitle}>Inspire-se com práticas simples e coloque sua saúde em primeiro lugar.</Text>

      <View style={styles.grid}>
        {tips.map((tip) => (
          <View key={tip.title} style={styles.card}>
            <Text style={styles.icon}>{tip.icon}</Text>
            <Text style={styles.cardTitle}>{tip.title}</Text>
            <Text style={styles.cardText}>{tip.description}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  grid: {
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  cardText: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
