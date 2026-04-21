import React, { useState, useEffect } from 'react';
import { supabase } from './src/services/supabase';
import AuthScreen from './src/screens/AuthScreen';
import RootNavigator from './src/navigation';
import { CartProvider } from './src/context/CartContext';

export default function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Obtener sesión actual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Escuchar cambios (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Envolvemos TODO el retorno en el CartProvider
    return (
        <CartProvider>
            {session ? <RootNavigator /> : <AuthScreen />}
        </CartProvider>
    );
}