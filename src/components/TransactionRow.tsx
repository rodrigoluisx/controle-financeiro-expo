import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Transaction } from '@/types/transaction';

const money = (n:number) => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

export function TransactionRow({item,onDelete}:{item:Transaction;onDelete?:()=>void}) {
  const incoming = item.type === 'income';
  return <Pressable onLongPress={onDelete} style={s.row}>
    <View style={[s.icon,{backgroundColor:incoming?'#123B32':'#40242C'}]}><Text style={{color:incoming?'#35D39A':'#FF7185',fontSize:19,fontWeight:'800'}}>{incoming?'↙':'↗'}</Text></View>
    <View style={s.info}><Text style={s.desc} numberOfLines={1}>{item.description}</Text><Text style={s.date}>{item.transaction_date.split('-').reverse().join('/')}</Text></View>
    <Text style={[s.amount,{color:incoming?'#35D39A':'#FF7185'}]}>{incoming?'+':'-'} {money(Number(item.amount))}</Text>
  </Pressable>;
}
const s=StyleSheet.create({row:{flexDirection:'row',alignItems:'center',backgroundColor:'#131E2E',padding:14,borderRadius:15,marginBottom:10},icon:{width:42,height:42,borderRadius:13,alignItems:'center',justifyContent:'center',marginRight:12},info:{flex:1,marginRight:8},desc:{color:'#F1F5F9',fontWeight:'600',fontSize:14},date:{color:'#8190A5',fontSize:12,marginTop:5},amount:{fontWeight:'700',fontSize:13}});
