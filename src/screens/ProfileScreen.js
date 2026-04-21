import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../services/supabase';
import { theme } from '../styles/theme';
import { LogOut, Settings, ChevronRight } from 'lucide-react-native';

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
        };
        getProfile();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{profile?.full_name || 'Cargando...'}</Text>
                <Text style={styles.roleLabel}>{profile?.role === 'admin' ? 'Administrador' : 'Cliente'}</Text>
            </View>

            <View style={styles.menu}>
                {/* MOSTRAR SOLO SI ES ADMIN O SOPORTE */}
                {(profile?.role === 'admin' || profile?.role === 'support') && (
                    <TouchableOpacity 
                        style={styles.menuItem} 
                        onPress={() => navigation.navigate('AdminPanel')}
                    >
                        <Settings color={theme.colors.primary} size={22} />
                        <Text style={styles.menuText}>Gestionar Pedidos (Cocina)</Text>
                        <ChevronRight color="#CCC" size={20} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.menuItem} onPress={() => supabase.auth.signOut()}>
                    <LogOut color="#FF4444" size={22} />
                    <Text style={[styles.menuText, { color: '#FF4444' }]}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
    header: { marginTop: 60, marginBottom: 40, alignItems: 'center' },
    name: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    roleLabel: { color: theme.colors.primary, fontWeight: '700', marginTop: 5, textTransform: 'uppercase', fontSize: 12 },
    menu: { backgroundColor: '#FFF', borderRadius: 20, padding: 10, elevation: 2 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    menuText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '500' }
});

export default ProfileScreen;