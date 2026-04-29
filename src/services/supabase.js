import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;



export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage, // Configurar para que use la memoria del cel
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
// Función ejemplo para insertar una orden robusta
export const createOrder = async (userId, cartItems, tableNumber) => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 1. Insertar en la cabecera 'orders'
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ 
            user_id: userId, 
            total_price: total, 
            table_number: tableNumber,
            status: 'pendiente' 
        }])
        .select()
        .single();

    if (orderError) throw orderError;

    // 2. Insertar los detalles 'order_items'
    const itemsToInsert = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price // Capturamos el precio del momento como pide tu DB
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (itemsError) throw itemsError;
    
    return order;
};