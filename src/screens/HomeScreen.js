import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, Image, ActivityIndicator, RefreshControl } from "react-native";
import { theme } from '../styles/theme';
import { FloatingNav } from "../components/FloatingNav";
import { useProducts } from '../hooks/useProducts'; 
import { FoodCard } from '../components/FoodCard';

const HomeScreen = ({ navigation }) => {
    const { products, loading, refresh } = useProducts();
    const [isScrolling, setIsScrolling] = useState(false);

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolling(offsetY > 50);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.colors.primary} />
                }
            >
                {/* Hero Refinado */}
                <View style={styles.hero}>
                    <Text style={styles.tagline}>TAQUERÍA ENRIQUEZ</Text>
                    <Text style={styles.title}>Sabor Oaxaqueño del Bueno!</Text>
                    <Text style={styles.tagline}>Todo recién hecho y bien servido!</Text>

                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000' }}
                            style={styles.heroImage}
                        />
                        {/* Overlay para dar profundidad */}
                        <View style={styles.heroOverlay} />
                    </View>
                </View>

                {/* Sección de Productos Dinámicos */}
            <View style={styles.section}>
    <Text style={styles.sectionTitle}>Nuestro Menú</Text>
    
    {products.length === 0 && !loading ? (
        <Text style={styles.emptyText}>No hay platillos disponibles en este momento.</Text>
    ) : (
        products.map((item) => (
            <FoodCard 
                key={item.id}
                item={{
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: Number(item.price), // Forzamos a que sea número
                    image: item.image_url, // Pasamos image_url a la prop 'image'
                    category: item.categories?.name || 'General',
                    rating: "4.9"
                }}
                onPress={() => navigation.navigate('FoodDetail', { item })} 
            />
        ))
    )}
</View>
            </ScrollView>

            <FloatingNav isScrolling={isScrolling} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingBottom: 120 },
    hero: { padding: theme.spacing.l, marginTop: 40 },
    tagline: { color: theme.colors.primary, fontWeight: '800', letterSpacing: 2, fontSize: 12, marginBottom: 5 },
    title: { fontSize: 34, fontWeight: 'bold', color: theme.colors.text, lineHeight: 40 },
    imageContainer: { marginTop: 20, borderRadius: theme.borderRadius.m, overflow: 'hidden', elevation: 8 },
    heroImage: { width: '100%', height: 220 },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
    section: { paddingHorizontal: theme.spacing.l, marginTop: 10 },
    sectionHeader: { marginBottom: 20 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text },
    sectionSubtitle: { color: theme.colors.textlight, fontSize: 14, marginTop: 2 }
});

export default HomeScreen;