import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown:false, tabBarStyle:{backgroundColor:'#131E2E',borderTopColor:'#263449',height:62,paddingBottom:7,paddingTop:6},tabBarActiveTintColor:'#35D39A',tabBarInactiveTintColor:'#718096' }}>
    <Tabs.Screen name="index" options={{title:'Início',tabBarIcon:({color,size})=><Ionicons name="wallet-outline" color={color} size={size}/>}} />
    <Tabs.Screen name="extrato" options={{title:'Extrato',tabBarIcon:({color,size})=><Ionicons name="receipt-outline" color={color} size={size}/>}} />
    <Tabs.Screen name="novo" options={{title:'Lançar',tabBarIcon:({color,size})=><Ionicons name="add-circle-outline" color={color} size={size}/>}} />
  </Tabs>;
}
