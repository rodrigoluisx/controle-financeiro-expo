import { useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionRow } from '@/components/TransactionRow';
import { useAuth } from '@/context/AuthContext';

const money=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

export default function Home() {
  const {transactions,loading,income,expenses,balance,refresh}=useTransactions();
  const {session}=useAuth();
  const signOut=useCallback(()=>Alert.alert('Sair da conta','Deseja realmente sair?',[{text:'Cancelar',style:'cancel'},{text:'Sair',style:'destructive',onPress:async()=>{await supabase.auth.signOut();router.replace('/login');}}]),[]);
  return <View style={s.container}>
    <View style={s.header}><View><Text style={s.hello}>Olá 👋</Text><Text style={s.email}>{session?.user.email}</Text></View><Pressable onPress={signOut} style={s.logout}><Text style={s.logoutText}>Sair</Text></Pressable></View>
    <View style={s.balanceCard}><Text style={s.balanceLabel}>Saldo atual</Text><Text style={s.balance}>{money(balance)}</Text><Text style={s.hint}>Entradas menos saídas</Text></View>
    <View style={s.summary}><View style={s.summaryCard}><Text style={s.summaryLabel}>Entradas</Text><Text style={[s.summaryValue,{color:'#35D39A'}]}>{money(income)}</Text></View><View style={s.summaryCard}><Text style={s.summaryLabel}>Saídas</Text><Text style={[s.summaryValue,{color:'#FF7185'}]}>{money(expenses)}</Text></View></View>
    <View style={s.section}><Text style={s.sectionTitle}>Últimas movimentações</Text><Pressable onPress={()=>router.push('/(tabs)/extrato')}><Text style={s.seeAll}>Ver extrato</Text></Pressable></View>
    {loading?<ActivityIndicator color="#35D39A" style={{marginTop:30}}/>:<FlatList data={transactions.slice(0,5)} keyExtractor={i=>i.id} renderItem={({item})=><TransactionRow item={item}/>} refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#35D39A"/>} ListEmptyComponent={<Text style={s.empty}>Nenhuma movimentação ainda. Toque em Lançar para começar.</Text>} contentContainerStyle={{paddingBottom:20}}/>}
  </View>;
}
const s=StyleSheet.create({container:{flex:1,backgroundColor:'#0B1220',paddingHorizontal:20,paddingTop:58},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:24},hello:{color:'#F8FAFC',fontSize:23,fontWeight:'800'},email:{color:'#8190A5',fontSize:12,marginTop:4},logout:{borderWidth:1,borderColor:'#34445A',borderRadius:10,paddingHorizontal:14,paddingVertical:9},logoutText:{color:'#CBD5E1',fontWeight:'600'},balanceCard:{backgroundColor:'#17483B',padding:22,borderRadius:22,marginBottom:14},balanceLabel:{color:'#B7E8D6',fontSize:14},balance:{color:'#FFF',fontSize:31,fontWeight:'800',marginTop:10},hint:{color:'#B7E8D6',fontSize:12,marginTop:7},summary:{flexDirection:'row',gap:12,marginBottom:28},summaryCard:{flex:1,backgroundColor:'#131E2E',borderRadius:16,padding:15},summaryLabel:{color:'#94A3B8',fontSize:12},summaryValue:{fontWeight:'800',fontSize:15,marginTop:9},section:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},sectionTitle:{color:'#F8FAFC',fontSize:17,fontWeight:'700'},seeAll:{color:'#35D39A',fontWeight:'700',fontSize:13},empty:{color:'#8190A5',textAlign:'center',marginTop:35,lineHeight:21}});
