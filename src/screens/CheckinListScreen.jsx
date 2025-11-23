import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { listCheckinsFallback, removeCheckinFallback, syncPending } from '../services/api';
import localStore from '../services/localStore';
import { AuthContext } from '../contexts/AuthContext';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../theme';

export default function CheckinListScreen({ navigation }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);

  async function load() {
    setLoading(true);
    try {
      const usuarioId = user?.usuarioId || 1;
      const res = await listCheckinsFallback(usuarioId, token || '');
      const sorted = (res || []).sort((a, b) => {
        try {
          const dateA = new Date(a.dataHora || 0).getTime();
          const dateB = new Date(b.dataHora || 0).getTime();
          return dateB - dateA;
        } catch {
          return 0;
        }
      });
      setCheckins(sorted);
    } catch (err) {
      console.error('Error loading checkins:', err);
      try {
        const localCheckins = await localStore.getLocalCheckins();
        setCheckins(localCheckins || []);
      } catch (localErr) {
        console.error('Error loading local checkins:', localErr);
        setCheckins([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    try {
      await removeCheckinFallback(id, token);
      Alert.alert('Sucesso', 'Check-in removido');
      load();
    } catch (err) {
      Alert.alert('Erro', 'Falha ao remover');
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        try {
          if (token) {
            await syncPending(token);
          }
          load();
        } catch (e) {
          console.error('Error syncing on focus:', e);
          load();
        }
      })();
    });
    return unsubscribe;
  }, [navigation, token]);

  function renderItem({ item }) {
    const formattedDate = item.dataHora
      ? new Date(item.dataHora).toLocaleString()
      : 'Check-in offline';
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EditCheckin', { checkin: item })}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Humor</Text>
            <Text style={styles.metricValue}>{item.humor}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Estresse</Text>
            <Text style={styles.metricValue}>{item.nivelEstresse}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Sono</Text>
            <Text style={styles.metricValue}>{item.qualidadeSono}</Text>
          </View>
        </View>
        {item.observacoes ? <Text style={styles.note}>{item.observacoes}</Text> : null}

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => navigation.navigate('EditCheckin', { checkin: item })}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id || item.localId)}>
            <Text style={[styles.actionText, { color: colors.danger }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Meu histórico</Text>
          <Text style={styles.subtitle}>Acompanhe suas entradas recentes e mantenha a consistência.</Text>
        </View>
        <PrimaryButton
          label="+ Novo"
          onPress={() => navigation.navigate('NewCheckin')}
          style={styles.smallButton}
        />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.loaderText}>Carregando check-ins...</Text>
        </View>
      ) : (
        <FlatList
          data={checkins}
          keyExtractor={(i) => String(i.id || i.localId)}
          renderItem={renderItem}
          contentContainerStyle={checkins.length === 0 ? { flex: 1, justifyContent: 'center' } : undefined}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nenhum check-in ainda</Text>
              <Text style={styles.emptyText}>Comece registrando um check-in para visualizar seus padrões.</Text>
              <PrimaryButton label="Registrar agora" onPress={() => navigation.navigate('NewCheckin')} style={{ marginTop: spacing.md }} />
            </View>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  smallButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  note: {
    color: colors.text,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actionText: {
    color: colors.accent,
    fontWeight: '600',
  },
  empty: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
