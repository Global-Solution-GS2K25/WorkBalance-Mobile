import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../theme';

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  return (
    <Screen scrollable>
      <View style={styles.hero}>
        <View>
          <Text style={styles.badge}>Painel</Text>
          <Text style={styles.title}>Bem-vindo ao WorkBalance</Text>
          <Text style={styles.subtitle}>Gerencie seus check-ins, acompanhe tendências e cuide da sua rotina.</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('NewCheckin')}
          activeOpacity={0.9}
        >
          <Text style={styles.cardEmoji}>📝</Text>
          <Text style={styles.cardTitle}>Novo Check-in</Text>
          <Text style={styles.cardText}>Registre como você está se sentindo agora.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Checkins')}
          activeOpacity={0.9}
        >
          <Text style={styles.cardEmoji}>📊</Text>
          <Text style={styles.cardTitle}>Minha Jornada</Text>
          <Text style={styles.cardText}>Veja seu histórico e tendências recentes.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Content')}
          activeOpacity={0.9}
        >
          <Text style={styles.cardEmoji}>🌿</Text>
          <Text style={styles.cardTitle}>Conteúdos</Text>
          <Text style={styles.cardText}>Dicas rápidas para equilibrar rotina e bem-estar.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Sair" variant="secondary" onPress={logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  badge: {
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  quickActions: {
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
  cardEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  cardText: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
