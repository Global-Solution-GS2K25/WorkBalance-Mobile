import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { register } = useContext(AuthContext);

  async function handleRegister() {
    try {
      const res = await register({ nome, email, senha, role: 'USER' });
      if (res && res.offline) {
        Alert.alert('Registrado offline', 'Conta salva localmente. Será sincronizada quando online. Faça login.');
      } else {
        Alert.alert('Sucesso', 'Conta criada. Faça login.');
      }
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao registrar usuário');
    }
  }

  return (
    <Screen keyboard scrollable>
      <View style={styles.header}>
        <Text style={styles.title}>Seja parte do WorkBalance</Text>
        <Text style={styles.subtitle}>Crie sua conta e acompanhe sua saúde emocional diariamente.</Text>
      </View>

      <View style={styles.card}>
        <TextField label="Nome" placeholder="Seu nome completo" value={nome} onChangeText={setNome} />
        <TextField
          label="Email"
          placeholder="voce@empresa.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginTop: spacing.md }}
        />
        <TextField
          label="Senha"
          placeholder="********"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={{ marginTop: spacing.md }}
        />
        <PrimaryButton label="Registrar" onPress={handleRegister} style={{ marginTop: spacing.lg }} />
        <PrimaryButton
          label="Já tenho conta"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
});
