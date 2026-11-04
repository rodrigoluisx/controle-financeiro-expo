import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useTransactions } from '@/hooks/useTransactions';

const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};

export default function NewTransaction() {
  const {add}=useTransactions();
  const [type,setType]=useState<'income'|'expense'>('income');
  const [description,setDescription]=useState('');
  const [amount,setAmount]=useState('');
  const [date,setDate]=useState(today());
  const [busy,setBusy]=useState(false);

  async function save(){
    const value=Number(amount.trim().replace(/\./g,'').replace(',','.'));
    if(!description.trim()||!amount.trim()||!date.trim()){Alert.alert('Campos obrigatórios','Informe observação, valor e data.');return;}
    if(!Number.isFinite(value)||value<=0){Alert.alert('Valor inválido','Digite um valor maior que zero. Exemplo: 125,50.');return;}
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){Alert.alert('Data inválida','Use AAAA-MM-DD. Exemplo: 2026-11-03.');return;}
    setBusy(true);const {error}=await add(description.trim(),value,type,date);setBusy(false);
    if(error){Alert.alert('Não foi possível salvar',error.message);return;}
    setDescription('');setAmount('');setDate(today());Alert.alert('Lançamento salvo','Sua movimentação foi registrada.');router.replace('/(tabs)/extrato');
  }

  return <KeyboardAvoidingView style={s.container} behavior={Platform.OS==='ios'?'padding':undefined}>
    <Text style={s.title}>Novo lançamento</Text><Text style={s.subtitle}>Registre o dinheiro que entrou ou saiu.</Text>
    <View style={s.toggle}><Pressable onPress={()=>setType('income')} style={[s.toggleButton,type==='income'&&s.income]}><Text style={[s.toggleText,type==='income'&&s.selected]}>Entrada</Text></Pressable><Pressable onPress={()=>setType('expense')} style={[s.toggleButton,type==='expense'&&s.expense]}><Text style={[s.toggleText,type==='expense'&&s.selected]}>Saída</Text></Pressable></View>
    <Text style={s.label}>Observação</Text><TextInput value={description} onChangeText={setDescription} placeholder="Ex.: salário, mercado, transporte..." placeholderTextColor="#718096" style={s.input}/>
    <Text style={s.label}>Valor (R$)</Text><TextInput value={amount} onChangeText={setAmount} placeholder="0,00" placeholderTextColor="#718096" keyboardType="decimal-pad" style={s.input}/>
    <Text style={s.label}>Data (AAAA-MM-DD)</Text><TextInput value={date} onChangeText={setDate} placeholder="2026-11-03" placeholderTextColor="#718096" style={s.input}/>
    <Pressable onPress={save} disabled={busy} style={s.save}><Text style={s.saveText}>{busy?'Salvando...':'Salvar lançamento'}</Text></Pressable>
  </KeyboardAvoidingView>;
}
const s=StyleSheet.create({container:{flex:1,backgroundColor:'#0B1220',paddingHorizontal:20,paddingTop:58},title:{color:'#F8FAFC',fontSize:27,fontWeight:'800'},subtitle:{color:'#8190A5',marginTop:5,marginBottom:25},toggle:{flexDirection:'row',backgroundColor:'#131E2E',borderRadius:13,padding:5,marginBottom:22},toggleButton:{flex:1,padding:13,alignItems:'center',borderRadius:10},income:{backgroundColor:'#35D39A'},expense:{backgroundColor:'#FF7185'},toggleText:{color:'#A8B4C5',fontWeight:'700'},selected:{color:'#071A15'},label:{color:'#CBD5E1',fontWeight:'600',fontSize:13,marginBottom:8,marginTop:13},input:{backgroundColor:'#131E2E',color:'#F8FAFC',borderWidth:1,borderColor:'#263449',borderRadius:12,padding:15,fontSize:15},save:{backgroundColor:'#35D39A',padding:17,alignItems:'center',borderRadius:13,marginTop:28},saveText:{color:'#06251C',fontWeight:'800',fontSize:16}});
