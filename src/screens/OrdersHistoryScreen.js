import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '../services/supabase';
import { theme } from '../styles/theme';
import { Calendar as CalendarIcon, Package } from 'lucide-react-native';

const OrdersHistoryScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    unit_price,
                    selected_option,
                    products ( name )
                )
            `) // <-- Aquí quité los comentarios que causaban el error PGRST100
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data);
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
};
    useEffect(() => {
        fetchOrders();

        // LOGICA DE TIEMPO REAL (Ahora dentro del componente y del useEffect)
        const subscription = supabase
            .channel('orders_update')
            .on('postgres_changes', 
                { event: 'UPDATE', schema: 'public', table: 'orders' }, 
                (payload) => {
                    // Actualizamos el estado si la orden modificada pertenece a la lista actual
                    setOrders(currentOrders => 
                        currentOrders.map(order => 
                            order.id === payload.new.id 
                            ? { ...order, status: payload.new.status } 
                            : order
                        )
                    );
                }
            )
            .subscribe();

        // El return de limpieza debe estar AQUÍ
        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
                <View style={styles.idGroup}>
                    <Package size={18} color={theme.colors.primary} />
                    <Text style={styles.orderId}>Orden #{item.id.slice(0, 6).toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: (theme.status?.[item.status] || '#CCC') + '20' }]}>
                    <Text style={[styles.statusText, { color: theme.status?.[item.status] || '#666' }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.itemsList}>
    {item.order_items?.map((oi, index) => (
        <Text key={index} style={styles.productName}>
            • {oi.quantity}x {oi.products?.name} 
            {oi.selected_option && (
                <Text style={{color: theme.colors.primary}}> ({oi.selected_option})</Text>
            )}
        </Text>
    ))}
</View>

            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.totalText}>Total: ${parseFloat(item.total_price).toFixed(2)}</Text>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator style={styles.loader} color={theme.colors.primary} />;

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Mis Pedidos</Text>
            <FlatList
                data={orders}
                keyExtractor={item => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.empty}>Aún no tienes pedidos registrados.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 20 },
    screenTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginTop: 60, marginBottom: 20 },
    list: { paddingBottom: 100 },
    loader: { flex: 1, justifyContent: 'center' },
    orderCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 16, marginBottom: 16, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    idGroup: { flexDirection: 'row', alignItems: 'center' },
    orderId: { marginLeft: 8, fontWeight: 'bold', fontSize: 14 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800' },
    itemsList: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F0F0F0', paddingVertical: 10 },
    productName: { fontSize: 13, color: '#666', marginBottom: 4 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    dateText: { fontSize: 12, color: '#999' },
    totalText: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default OrdersHistoryScreen;