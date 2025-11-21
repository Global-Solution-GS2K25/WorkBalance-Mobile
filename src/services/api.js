import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import localStore from './localStore';

// Default baseURL. When running emulator change to appropriate host:
// - Android emulator (AVD): http://10.0.2.2:8080
// - Expo on device: use your machine IP e.g. http://192.168.x.x:8080
const baseURL = 'http://10.0.2.2:8080';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

export const authEndpoints = {
  login: (payload) => api.post('/api/auth/login', payload),
  register: (payload) => api.post('/api/auth/register', payload),
};

export const checkinEndpoints = {
  list: (usuarioId, page = 0, size = 20, token) =>
    api.get(`/api/checkins`, { params: { usuarioId, page, size }, headers: { Authorization: `Bearer ${token}` } }),
  create: (payload, token) => api.post('/api/checkins', payload, { headers: { Authorization: `Bearer ${token}` } }),
  get: (id, token) => api.get(`/api/checkins/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  update: (id, payload, token) => api.put(`/api/checkins/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } }),
  remove: (id, token) => api.delete(`/api/checkins/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};

// Higher-level helpers with offline fallback
export async function listCheckinsFallback(usuarioId, token) {
  try {
    // Always try to get local checkins first for immediate display
    const localCheckins = await localStore.getLocalCheckins() || [];
    
    // Try to sync in background, but return local data immediately
    (async () => {
      try {
        const net = await NetInfo.fetch();
        if (net.isConnected && token) {
          try {
            const res = await checkinEndpoints.list(usuarioId, 0, 50, token);
            const list = res.data?.content || res.data || [];
            if (Array.isArray(list)) {
              await Promise.all(list.map((c) => localStore.addLocalCheckin(c)));
            }
          } catch (err) {
            // Silently fail - expected when offline
          }
        }
      } catch (err) {
        // Silently fail - expected when offline
      }
    })();

    // Return local checkins immediately
    return localCheckins;
  } catch (err) {
    console.error('Error in listCheckinsFallback:', err);
    return [];
  }
}

export async function createCheckinFallback(payload, token) {
  try {
    // Always create local version first for immediate UI update
    const localId = `local-${Date.now()}`;
    const localItem = { ...payload, localId, dataHora: new Date().toISOString() };
    
    // Save locally immediately - this should always work
    await localStore.addLocalCheckin(localItem);
    await localStore.addPending({ type: 'create', payload, localId });

    // Try to sync in background, but don't wait for it
    (async () => {
      try {
        const net = await NetInfo.fetch();
        if (net.isConnected && token) {
          try {
            const res = await checkinEndpoints.create(payload, token);
            const serverItem = res.data;
            if (serverItem) {
              // Remove the local version and add server version
              await localStore.removeLocalCheckinByLocalId(localId);
              await localStore.addLocalCheckin(serverItem);
              await localStore.removePendingByLocalId(localId);
            }
          } catch (err) {
            // Silently fail - expected when offline
          }
        }
      } catch (err) {
        // Silently fail - expected when offline
      }
    })();

    // Return immediately with local item
    return { online: false, data: localItem };
  } catch (err) {
    console.error('Error in createCheckinFallback:', err);
    throw err;
  }
}

export async function updateCheckinFallback(localOrServerId, payload, token) {
  try {
    const localCheckins = await localStore.getLocalCheckins();
    const existing = localCheckins.find(
      (c) => c.id === localOrServerId || c.localId === localOrServerId
    );
    
    if (!existing) {
      throw new Error('Check-in não encontrado');
    }

    // Always update locally first
    const updated = localCheckins.map((c) => {
      if (c.id === localOrServerId || c.localId === localOrServerId) {
        return { ...c, ...payload, dataHora: c.dataHora || new Date().toISOString() };
      }
      return c;
    });
    await localStore.saveLocalCheckins(updated);
    const updatedItem = updated.find((c) => c.id === localOrServerId || c.localId === localOrServerId);

    // Try to sync in background if it has a server id
    if (existing.id && !String(existing.id).startsWith('local-')) {
      (async () => {
        try {
          const net = await NetInfo.fetch();
          if (net.isConnected && token) {
            try {
              const res = await checkinEndpoints.update(existing.id, payload, token);
              if (res.data) {
                const synced = localCheckins.map((c) => {
                  if (c.id === existing.id) {
                    return res.data;
                  }
                  return c;
                });
                await localStore.saveLocalCheckins(synced);
              }
            } catch (err) {
              // Silently fail - expected when offline
              // Mark for sync
              const pending = await localStore.getPending();
              const hasPending = pending.some((p) => p.id === existing.id && p.type === 'update');
              if (!hasPending) {
                await localStore.addPending({ type: 'update', id: existing.id, payload, localId: `update-${existing.id}` });
              }
            }
          } else {
            // Mark for sync when online
            const pending = await localStore.getPending();
            const hasPending = pending.some((p) => p.id === existing.id && p.type === 'update');
            if (!hasPending) {
              await localStore.addPending({ type: 'update', id: existing.id, payload, localId: `update-${existing.id}` });
            }
          }
        } catch (err) {
          // Silently fail - expected when offline
        }
      })();
    } else if (existing.localId) {
      // Local-only check-in, mark for creation when synced
      const pending = await localStore.getPending();
      const hasPending = pending.some((p) => p.localId === existing.localId);
      if (!hasPending) {
        await localStore.addPending({ type: 'create', payload, localId: existing.localId });
      }
    }

    return { online: false, data: updatedItem };
  } catch (err) {
    console.error('Error in updateCheckinFallback:', err);
    throw err;
  }
}

export async function removeCheckinFallback(localOrServerId, token) {
  const net = await NetInfo.fetch();
  // if it's a localId start with 'local-' remove local
  if (String(localOrServerId).startsWith('local-')) {
    await localStore.removeLocalCheckinByLocalId(localOrServerId);
    // also remove pending create if exists
    await localStore.removePendingByLocalId(localOrServerId);
    return { online: false };
  }

  if (net.isConnected) {
    try {
      await checkinEndpoints.remove(localOrServerId, token);
      // remove from local cache too
      await localStore.removeLocalCheckinByLocalId(localOrServerId);
      return { online: true };
    } catch (err) {
      // queue deletion for later
      await localStore.addPending({ type: 'delete', id: localOrServerId, localId: `del-${localOrServerId}` });
      await localStore.removeLocalCheckinByLocalId(localOrServerId);
      return { online: false };
    }
  }

  // offline: queue
  await localStore.addPending({ type: 'delete', id: localOrServerId, localId: `del-${localOrServerId}` });
  await localStore.removeLocalCheckinByLocalId(localOrServerId);
  return { online: false };
}

export async function syncPending(token) {
  const net = await NetInfo.fetch();
  if (!net.isConnected || !token) return { synced: 0 };
  const pending = await localStore.getPending();
  let synced = 0;
  for (const p of pending) {
    try {
      if (p.type === 'create') {
        const res = await checkinEndpoints.create(p.payload, token);
        // Update local item with server response
        await localStore.removeLocalCheckinByLocalId(p.localId);
        await localStore.addLocalCheckin(res.data);
        await localStore.removePendingByLocalId(p.localId);
        synced++;
      } else if (p.type === 'update') {
        // For updates, we need the original server id
        if (p.id && !String(p.id).startsWith('local-')) {
          await checkinEndpoints.update(p.id, p.payload, token);
          await localStore.removePendingByLocalId(p.localId);
          synced++;
        }
      } else if (p.type === 'delete') {
        if (p.id && !String(p.id).startsWith('local-')) {
          await checkinEndpoints.remove(p.id, token);
          await localStore.removePendingByLocalId(p.localId);
          synced++;
        } else {
          // If it's a local-only delete, just remove from pending
          await localStore.removePendingByLocalId(p.localId);
        }
      }
    } catch (err) {
      // keep pending if sync fails - silently fail
    }
  }
  return { synced };
};
