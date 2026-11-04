import { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { TransactionRow } from '@/components/TransactionRow';
import { useTransactions } from '@/hooks/useTransactions';

export default function Statement() {
  const {transactions,loading,refresh,remove}=useTransactions();
  const [filter,setFilter]=useState<'all'|'income'|'expense'>('all');
  const visible=transactions.filter(t=>filter==='all'||t.type===filter);
  function confirmDelete(id:string){Alert.alert('Excluir lançamento','Deseja excluir esta movimentação?',[{text:'Cancelar',style:'cancel'},{text:'Excluir',style:'destructive',onPress:()=>remove(id)}]);}
  return <View style={s.container}>
    <Text style={s.title}>Extrato</Text><Text style={s.subtitle}>Suas movimentações por data</Text>
    <View style={s.filters}>{([{key:'all',label:'Todas'},{key:'income',label:'Entradas'},{key:'expense',label:'Saídas'}] as const).map(o=><Text key={o.key} onPress={()=>setFilter(o.key)} style={[s.filter,filter===o.key&&s.active]}>{o.label}</Text>)}</View>
    <FlatList data={visible} keyExtractor={i=>i.id} renderItem={({item})=><TransactionRow item={item} onDelete={()=>confirmDelete(item.id)}/>} refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#35D39A"/>} ListEmptyComponent={<Text style={s.empty}>Nenhuma movimentação encontrada.</Text>} contentContainerStyle={{paddingBottom:30}}/>
    <Text style={s.tip}>Pressione uma movimentação por alguns segundos para excluí-la.</Text>
  </View>;
}
const s=StyleSheet.create({container:{flex:1,backgroundColor:'#0B1220',paddingHorizontal:20,paddingTop:58},title:{color:'#F8FAFC',fontSize:27,fontWeight:'800'},subtitle:{color:'#8190A5',marginTop:5,marginBottom:22},filters:{flexDirection:'row',gap:9,marginBottom:18},filter:{color:'#A8B4C5',backgroundColor:'#131E2E',overflow:'hidden',paddingHorizontal:16,paddingVertical:10,borderRadius:20,fontWeight:'600'},active:{color:'#06251C',backgroundColor:'#35D39A'},empty:{color:'#8190A5',textAlign:'center',marginTop:50},tip:{color:'#718096',fontSize:11,textAlign:'center',paddingVertical:10}});
