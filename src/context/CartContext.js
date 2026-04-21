import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // EFECTO 1: Al abrir la app, cargar lo que estaba guardado
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = await AsyncStorage.getItem('@tacon_madre_cart');
                if (savedCart !== null) {
                    setCart(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error("Error cargando el carrito:", error);
            }
        };
        loadCart();
    }, []);

    // EFECTO 2: Cada vez que el carrito cambie, guardarlo en la memoria
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('@tacon_madre_cart', JSON.stringify(cart));
            } catch (error) {
                console.error("Error guardando el carrito:", error);
            }
        };
        saveCart();
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(item => 
                item.id === product.id && item.selectedOption === product.selectedOption
            );
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.selectedOption === product.selectedOption) 
                    ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const getTotal = () => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);