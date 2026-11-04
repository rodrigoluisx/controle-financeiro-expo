import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!configured) { Alert.alert('Configuração necessária', 'Configure o Supabase conforme INSTRUCOES.txt.'); return; }
    if (!email.trim() || password.length < 6) { Alert.alert('Dados inválidos', 'Informe um e-mail e uma senha com pelo menos 6 caracteres.'); return; }
    setBusy(true);
    const result = register
      ? await supabase.auth.signUp({ email: email.trim(), password })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (result.error) { Alert.alert('Erro', result.error.message); return; }
    if (register && !result.data.session) {
      Alert.alert('Confirme seu e-mail', 'Verifique sua caixa de entrada para confirmar o cadastro.');
      setRegister(false);
      return;
    }
    router.replace('/(tabs)');
  }

  return <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={s.logo}><Text style={s.logoText}>R$</Text></View>
    <Text style={s.brand}>Meu Financeiro</Text><Text style={s.sub}>Seu dinheiro, sob controle.</Text>
    <View style={s.card}>
      <Text style={s.title}>{register ? 'Criar conta' : 'Bem-vindo de volta'}</Text>
      <Text style={s.label}>E-mail</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="seu@email.com" placeholderTextColor="#718096" autoCapitalize="none" keyboardType="email-address" style={s.input} />
      <Text style={s.label}>Senha</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Mínimo de 6 caracteres" placeholderTextColor="#718096" secureTextEntry style={s.input} />
      <Pressable onPress={submit} disabled={busy} style={s.button}><Text style={s.buttonText}>{busy ? 'Aguarde...' : register ? 'Criar minha conta' : 'Entrar'}</Text></Pressable>
      <Pressable onPress={() => setRegister(!register)} style={s.switch}><Text style={s.switchText}>{register ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastre-se'}</Text></Pressable>
    </View>
  </KeyboardAvoidingView>;
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#0B1220',justifyContent:'center',padding:24},
  logo:{width:64,height:64,borderRadius:20,backgroundColor:'#173B34',alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:14},
  logoText:{color:'#35D39A',fontSize:25,fontWeight:'800'},brand:{color:'#F5F7FA',fontSize:28,fontWeight:'800',textAlign:'center'},
  sub:{color:'#94A3B8',textAlign:'center',marginTop:6,marginBottom:28},card:{backgroundColor:'#131E2E',borderRadius:22,padding:22},
  title:{color:'#F5F7FA',fontSize:22,fontWeight:'700',marginBottom:18},label:{color:'#CBD5E1',fontSize:13,marginBottom:8,marginTop:12},
  input:{backgroundColor:'#0B1220',color:'#F8FAFC',borderWidth:1,borderColor:'#263449',borderRadius:12,padding:15,fontSize:15},
  button:{backgroundColor:'#35D39A',padding:16,borderRadius:12,alignItems:'center',marginTop:24},buttonText:{color:'#06251C',fontWeight:'800',fontSize:16},
  switch:{alignItems:'center',paddingTop:18},switchText:{color:'#35D39A',fontWeight:'600'}
});
