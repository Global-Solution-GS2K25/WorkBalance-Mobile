import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createCheckinFallback, updateCheckinFallback } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../theme';

export default function CheckinFormScreen({ route, navigation }) {
  const editing = route.name === 'EditCheckin';
  const existing = route.params?.checkin;
  const [humor, setHumor] = useState(existing?.humor?.toString() || '3');
  const [nivelEstresse, setNivelEstresse] = useState(existing?.nivelEstresse?.toString() || '2');
  const [qualidadeSono, setQualidadeSono] = useState(existing?.qualidadeSono?.toString() || '4');
  const [sintomasFisicos, setSintomasFisicos] = useState(existing?.sintomasFisicos || '');
  const [observacoes, setObservacoes] = useState(existing?.observacoes || '');
  const [saving, setSaving] = useState(false);
  const { token, user } = useContext(AuthContext);

  async function handleSubmit() {
    if (saving) return;
    
    setSaving(true);
    
    const usuarioId = user?.usuarioId || 1;
    
    if (!usuarioId || usuarioId === 0) {
      Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
      setSaving(false);
      return;
    }
    
    const payload = {
      usuarioId: usuarioId,
      humor: Number(humor) || 3,
      nivelEstresse: Number(nivelEstresse) || 2,
      qualidadeSono: Number(qualidadeSono) || 4,
      sintomasFisicos: sintomasFisicos || '',
      observacoes: observacoes || '',
    };

    try {
      let res;
      if (editing && existing) {
        const checkinId = existing.id || existing.localId;
        if (!checkinId) {
          Alert.alert('Erro', 'ID do check-in não encontrado');
          setSaving(false);
          return;
        }
        res = await updateCheckinFallback(checkinId, payload, token || '');
      } else {
        res = await createCheckinFallback(payload, token || '');
      }
      
      setSaving(false);
      Alert.alert(
        'Sucesso', 
        editing ? 'Check-in atualizado' : 'Check-in salvo',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Checkins')
          }
        ]
      );
    } catch (err) {
      console.error('Error saving checkin:', err);
      setSaving(false);
      Alert.alert('Erro', err.message || 'Falha ao salvar check-in. Tente novamente.');
    }
  }

  function renderScale(label, value, setValue, helper) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{label}</Text>
          {helper && <Text style={styles.helper}>{helper}</Text>}
        </View>
        <View style={styles.chips}>
          {[1, 2, 3, 4, 5].map((item) => {
            const active = Number(value) === item;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setValue(String(item))}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <Screen scrollable keyboard>
      {renderScale('Como está seu humor?', humor, setHumor, '1 = baixo, 5 = excelente')}
      {renderScale('Nível de estresse', nivelEstresse, setNivelEstresse, '1 = tranquilo, 5 = muito alto')}
      {renderScale('Qualidade do sono', qualidadeSono, setQualidadeSono, '1 = ruim, 5 = renovador')}

      <View style={styles.section}>
        <TextField
          label="Sintomas físicos"
          placeholder="Ex.: dores musculares, fadiga..."
          value={sintomasFisicos}
          onChangeText={setSintomasFisicos}
        />
      </View>

      <View style={styles.section}>
        <TextField
          label="Observações"
          placeholder="Descreva acontecimentos relevantes do dia"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          inputStyle={{ height: 100, textAlignVertical: 'top' }}
        />
      </View>

      <PrimaryButton 
        label={editing ? 'Atualizar check-in' : 'Salvar check-in'} 
        onPress={handleSubmit}
        loading={saving}
        disabled={saving}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  helper: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs / 2,
  },
  chips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.text,
  },
});
