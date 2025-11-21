import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, typography } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useContext(AuthContext);

  async function handleLogin() {
    try {
      const ok = await login(email, senha);
      if (!ok) {
        Alert.alert('Erro', 'Credenciais inválidas');
      }
    } catch (err) {
      Alert.alert('Erro', 'Falha ao conectar com API');
    }
  }

  return (
    <Screen keyboard scrollable contentStyle={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.badge}>Bem-vindo</Text>
        <Text style={styles.title}>WorkBalance</Text>
        <Text style={styles.subtitle}>Monitore seu bem-estar e mantenha uma rotina equilibrada.</Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@empresa.com"
        />
        <TextField
          label="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          placeholder="********"
          style={{ marginTop: spacing.md }}
        />
        <Text style={styles.hint}>Dica de teste: usuário admin / senha admin</Text>

        <PrimaryButton label="Entrar" onPress={handleLogin} style={{ marginTop: spacing.lg }} />
        <PrimaryButton
          label="Criar conta"
          variant="secondary"
          style={{ marginTop: spacing.sm }}
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
  },
  hero: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: spacing.xl,
  },
  badge: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  form: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
