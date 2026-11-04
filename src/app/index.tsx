import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { session, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1220' }}><ActivityIndicator color="#35D39A" /></View>;
  return <Redirect href={session ? '/(tabs)' : '/login'} />;
}
