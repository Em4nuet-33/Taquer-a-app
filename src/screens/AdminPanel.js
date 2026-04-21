import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';
import { theme } from '../styles/theme';

const AdminPanel = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        // Agregamos el join con order_items y products para ver qué se pidió
       const { data, error } = await supabase
    .from('orders')
    .select(`
        *,
        profiles(full_name),
        order_items(
            quantity,
            selected_option,
            products(name)
        )
    `)
    .order('created_at', { ascending: false });
        
        if (!error) setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        const subscription = supabase
        .channel('admin_orders')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
            fetchOrders(); // Recargar lista cuando entre una orden nueva
        })
        .subscribe();

    return () => supabase.removeChannel(subscription);
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);
        
        if (!error) {
            // Actualizamos localmente para no recargar todo
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
    };

    // Componente que renderiza cada orden
    const renderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.headerRow}>
                <Text style={styles.orderId}>ID: {item.id.slice(0, 8).toUpperCase()}</Text>
                <Text style={styles.tableBadge}>Mesa {item.table_number || 'N/A'}</Text>
            </View>
            
            <Text style={styles.clientLabel}>Cliente: {item.profiles?.full_name || 'Desconocido'}</Text>
            
            {/* AQUÍ SE MUESTRAN LOS PRODUCTOS QUE SE PIDIERON */}
            <View style={styles.itemsContainer}>
    {item.order_items?.map((itemPedido, index) => (
        <Text key={index} style={styles.productText}>
            • {itemPedido.quantity}x {itemPedido.products?.name} 
            {itemPedido.selected_option && (
                <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                    {" "}({itemPedido.selected_option})
                </Text>
            )}
        </Text>
    ))}
</View>

            <Text style={[styles.status, { color: item.status === 'pendiente' ? '#e74c3c' : '#27ae60' }]}>
                Estado: {item.status.toUpperCase()}
            </Text>
            
            <View style={styles.actions}>
                <TouchableOpacity 
                    onPress={() => updateStatus(item.id, 'preparando')} 
                    style={[styles.btn, item.status === 'preparando' && styles.activeBtn]}
                >
                    <Text style={styles.btnText}>Preparar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => updateStatus(item.id, 'completado')} 
                    style={styles.btnComplete}
                >
                    <Text style={styles.btnText}>Completar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Cocina</Text>
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem} // Pasamos la función renderItem aquí
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: theme.colors.background },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 50, marginBottom: 20, color: theme.colors.text },
    orderCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 15, elevation: 4 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    orderId: { fontWeight: 'bold', fontSize: 14, color: '#7f8c8d' },
    tableBadge: { backgroundColor: theme.colors.primary + '20', color: theme.colors.primary, paddingHorizontal: 8, borderRadius: 5, fontWeight: 'bold' },
    clientLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    itemsContainer: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, marginVertical: 10 },
    productText: { fontSize: 14, color: '#34495e', marginBottom: 3 },
    status: { marginVertical: 5, fontWeight: '800', letterSpacing: 0.5 },
    actions: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' },
    btn: { backgroundColor: '#3498db', padding: 12, borderRadius: 10, flex: 0.48, alignItems: 'center' },
    activeBtn: { backgroundColor: '#2980b9', borderWidth: 1, borderColor: '#FFF' },
    btnComplete: { backgroundColor: '#27ae60', padding: 12, borderRadius: 10, flex: 0.48, alignItems: 'center' },
    btnText: { color: '#FFF', fontWeight: 'bold' }
});

export default AdminPanel;