import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';
import { supabase } from '../services/supabase';
import { Trash2, ChevronLeft, CreditCard, Trash } from 'lucide-react-native';

const CartScreen = ({ navigation }) => {
    const { cart, getTotal, clearCart, removeFromCart } = useCart(); // Añadido removeFromCart
    const [loading, setLoading] = useState(false);

    const handleConfirmOrder = async () => {
        if (cart.length === 0) return;
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert("Error", "Debes iniciar sesión.");
                return;
            }

            // 1. Crear Orden
            const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{ 
        user_id: user.id, 
        total_price: getTotal(),
        table_number: 5, 
        status: 'pendiente'
    }])
    .select().single();

if (orderError) throw orderError;

// 2. Preparar Items

const orderItems = cart.map(item => ({
    order_id: orderData.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.price,
    selected_option: item.selectedOption || 'Sencilla'
}));

// ¡ESTO ES LO QUE FALTABA!
const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

if (itemsError) throw itemsError; 
// Si esto falla, saltará al catch y verás el error en consola

Alert.alert("¡Éxito!", "Tu orden ha sido enviada.");
clearCart();
navigation.navigate('Home');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo procesar el pedido.");
        } finally {
            setLoading(false);
        }
    };

    // FUNCIÓN DE RENDERIZADO CORREGIDA
    const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
        <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            {/* AÑADIR ESTO: */}
            <Text style={{ color: theme.colors.primary, fontSize: 12 }}>
                Variedad: {item.selectedOption || 'Sencilla'}
            </Text>
            <Text style={styles.itemPrice}>
                {item.quantity} x ${parseFloat(item.price).toFixed(2)}
            </Text>
        </View>
 
            
            <View style={styles.rightSide}>
                <Text style={styles.itemTotal}>${(item.quantity * item.price).toFixed(2)}</Text>
                <TouchableOpacity 
                    onPress={() => removeFromCart(item.id)}
                    style={styles.deleteBtn}
                >
                    <Trash size={18} color="#FF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft color={theme.colors.text} size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tu Pedido</Text>
                <TouchableOpacity onPress={clearCart}>
                    <Trash2 color={theme.colors.textlight} size={22} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={cart}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem} // Ahora sí pasamos la función correcta
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay productos en tu carrito.</Text>
                }
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total a pagar:</Text>
                    <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
                </View>

                <TouchableOpacity 
                    style={[styles.checkoutBtn, cart.length === 0 && styles.disabledBtn]} 
                    onPress={handleConfirmOrder}
                    disabled={loading || cart.length === 0}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                        <>
                            <CreditCard color="#FFF" size={20} style={{ marginRight: 10 }} />
                            <Text style={styles.checkoutText}>Confirmar Orden</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    listContent: { padding: 20 },
    cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    itemName: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    itemPrice: { color: theme.colors.textlight, fontSize: 14, marginTop: 4 },
    rightSide: { flexDirection: 'row', alignItems: 'center' },
    itemTotal: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, marginRight: 15 },
    deleteBtn: { padding: 5 },
    footer: { backgroundColor: '#FFF', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 15 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    totalLabel: { fontSize: 18, color: theme.colors.textlight },
    totalAmount: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
    checkoutBtn: { backgroundColor: theme.colors.primary, flexDirection: 'row', padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    disabledBtn: { backgroundColor: '#A0A0A0' },
    checkoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default CartScreen;