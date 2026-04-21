
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
           const { data, error } = await supabase
  .from('products')
  .select('*') // Primero aseguremos que esto traiga datos
  .eq('is_available', true);


            if (error) throw error;
            
           
            setProducts(data || []);
        } catch (err) {
            console.error("Error en fetchProducts:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    return { products, loading, refresh: fetchProducts };
};