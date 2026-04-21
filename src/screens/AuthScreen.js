import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';
import { theme } from '../styles/theme';

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) return;
        setLoading(true);

        try {
            if (isRegistering) {
                // Registro: Pasamos full_name en los metadatos para el Trigger de la DB
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } }
                });
                if (error) throw error;
                Alert.alert("Verifica tu correo", "Te hemos enviado un enlace de confirmación.");
            } else {
                // Login
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isRegistering ? 'Crear Cuenta' : 'Bienvenido'}</Text>
            
            {isRegistering && (
                <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    value={fullName}
                    onChangeText={setFullName}
                />
            )}

            <TextInput
  style={styles.input}
  placeholder="Correo electrónico"
  placeholderTextColor="#595959" // Asegura que se vea
  value={email}
  onChangeText={setEmail}
  autoCapitalize="none"
  keyboardType="email-address"
/>
<TextInput
  style={styles.input}
  placeholder="Contraseña"
  placeholderTextColor="#585858"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
/>

            <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : (
                    <Text style={styles.buttonText}>{isRegistering ? 'Registrarse' : 'Entrar'}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                <Text style={styles.switchText}>
                    {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: theme.spacing.l, backgroundColor: theme.colors.background },
    title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 30, textAlign: 'center' },
    input: { backgroundColor: theme.colors.surface, padding: 15, borderRadius: theme.borderRadius.m, marginBottom: 15, borderWidth: 1, borderColor: '#DDD' },
    button: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: theme.borderRadius.m, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    switchText: { marginTop: 20, textAlign: 'center', color: theme.colors.primaryLight, fontWeight: '600' }
});

export default AuthScreen;