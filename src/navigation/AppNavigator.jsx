import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CheckinListScreen from '../screens/CheckinListScreen';
import CheckinFormScreen from '../screens/CheckinFormScreen';
import ContentScreen from '../screens/ContentScreen';
import { AuthContext } from '../contexts/AuthContext';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      {token == null ? (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Criar conta', headerTransparent: true, headerTintColor: colors.text }} 
          />
        </>
      ) : ( 
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Checkins" 
            component={CheckinListScreen} 
            options={{ title: 'Meus check-ins' }} 
          />
          <Stack.Screen 
            name="NewCheckin" 
            component={CheckinFormScreen} 
            options={{ title: 'Novo check-in' }} 
          />
          <Stack.Screen 
            name="EditCheckin" 
            component={CheckinFormScreen} 
            options={{ title: 'Editar check-in' }} 
          />
          <Stack.Screen 
            name="Content" 
            component={ContentScreen} 
            options={{ title: 'Conteúdos' }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}
