import AsyncStorage from '@react-native-async-storage/async-storage';

const CHECKINS_KEY = '@workbalance:checkins_local';
const PENDING_KEY = '@workbalance:checkins_pending';
const USERS_KEY = '@workbalance:users_local';

async function getLocalCheckins() {
  const raw = await AsyncStorage.getItem(CHECKINS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveLocalCheckins(list) {
  await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(list));
}

async function addLocalCheckin(checkin) {
  const list = await getLocalCheckins();
  const exists = list.some(
    (c) => 
      (c.id && checkin.id && c.id === checkin.id) ||
      (c.localId && checkin.localId && c.localId === checkin.localId)
  );
  if (!exists) {
    list.unshift(checkin);
    await saveLocalCheckins(list);
    return true;
  }
  return false;
}

async function removeLocalCheckinByLocalId(localId) {
  const list = await getLocalCheckins();
  const filtered = list.filter((c) => c.localId !== localId && c.id !== localId);
  await saveLocalCheckins(filtered);
}

async function getPending() {
  const raw = await AsyncStorage.getItem(PENDING_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function addPending(item) {
  const list = await getPending();
  list.push(item);
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(list));
}

async function removePendingByLocalId(localId) {
  const list = await getPending();
  const filtered = list.filter((p) => p.localId !== localId);
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(filtered));
}

async function clearPending() {
  await AsyncStorage.removeItem(PENDING_KEY);
}

export default {
  getLocalCheckins,
  saveLocalCheckins,
  addLocalCheckin,
  removeLocalCheckinByLocalId,
  getPending,
  addPending,
  removePendingByLocalId,
  clearPending,
  getLocalUsers: async function () {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  addLocalUser: async function (user) {
    const list = await AsyncStorage.getItem(USERS_KEY);
    const arr = list ? JSON.parse(list) : [];
    arr.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(arr));
  },
  findUserByEmail: async function (email) {
    const arr = await (async () => {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    })();
    return arr.find((u) => u.email === email);
  }
};
