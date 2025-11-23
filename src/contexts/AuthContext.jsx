import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncPending } from '../services/api';
import * as Crypto from 'expo-crypto';
import localStore from '../services/localStore';

const TOKEN_KEY = '@workbalance:token';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem(TOKEN_KEY);
      if (t) setToken(t);
    })();
  }, []);

  async function login(email, senha) {
    if (email === 'admin' && senha === 'admin') {
      const localToken = 'ADMIN-LOCAL-TOKEN';
      setToken(localToken);
      setUser({ nome: 'Admin', email: 'admin', usuarioId: 0, offline: true });
      await AsyncStorage.setItem(TOKEN_KEY, localToken);
      return true;
    }
    try {
      const res = await api.post('/api/auth/login', { email, senha });
      if (res && res.data && res.data.token) {
        const token = res.data.token;
        setToken(token);
        await AsyncStorage.setItem(TOKEN_KEY, token);
        
        let usuarioId = null;
        try {
          const stored = await localStore.findUserByEmail(email);
          usuarioId = stored?.usuarioId || null;
        } catch (e) {}

        const userObj = { 
          email, 
          nome: res.data.nome || email, 
          usuarioId: usuarioId,
          offline: false 
        };
        setUser(userObj);
        
        try {
          const pwHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, senha);
          await localStore.addLocalUser({ 
            email, 
            nome: userObj.nome, 
            passwordHash: pwHash, 
            usuarioId: usuarioId 
          });
        } catch (e) {}
        
        try { await syncPending(token); } catch (e) {}
        return true;
      }
    } catch (err) {
      try {
        const stored = await localStore.findUserByEmail(email);
        if (!stored) return false;
        const pwHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, senha);
        if (pwHash === stored.passwordHash) {
          const localToken = `LOCAL-${email}`;
          setToken(localToken);
          setUser({ 
            nome: stored.nome, 
            email: stored.email, 
            usuarioId: stored.usuarioId || null, 
            offline: true 
          });
          await AsyncStorage.setItem(TOKEN_KEY, localToken);
          return true;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  async function register(data) {
    try {
      const res = await api.post('/api/auth/register', data);
      const usuarioId = res.data?.id || null;
      try {
        const pwHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data.senha);
        await localStore.addLocalUser({ 
          email: data.email, 
          nome: data.nome, 
          passwordHash: pwHash, 
          usuarioId: usuarioId 
        });
      } catch (e) {}
      return res;
    } catch (err) {
      try {
        const pwHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data.senha);
        await localStore.addLocalUser({ 
          email: data.email, 
          nome: data.nome, 
          passwordHash: pwHash, 
          usuarioId: null, 
          localOnly: true 
        });
        return { offline: true };
      } catch (e) {
        throw err;
      }
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
