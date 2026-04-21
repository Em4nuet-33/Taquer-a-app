import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { ChevronRight, UtensilsCrossed, Star } from 'lucide-react-native';

export const FoodCard = ({ item, onPress }) => {
    if (!item) return null;

    return (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7} 
            onPress={() => onPress(item)}
        >
            {/* Icono representativo en lugar de imagen */}
            <View style={styles.iconContainer}>
                <UtensilsCrossed size={24} color={theme.colors.primary} />
            </View>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.rating}>
                        <Star size={12} color={theme.colors.accent} fill={theme.colors.accent} />
                        <Text style={styles.ratingText}>4.9</Text>
                    </View>
                </View>
                
                <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                
                <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
            </View>

            <View style={styles.arrowContainer}>
                <ChevronRight size={20} color={theme.colors.textlight} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { 
        backgroundColor: '#FFF', 
        borderRadius: 16, 
        marginBottom: 12, 
        flexDirection: 'row', 
        alignItems: 'center',
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: theme.colors.primary + '15', // Color primario con 15% de opacidad
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: { 
        flex: 1, 
        marginLeft: 15 
    },
    headerRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    title: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: theme.colors.text 
    },
    rating: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { marginLeft: 4, fontSize: 11, fontWeight: 'bold', color: theme.colors.textlight },
    desc: { 
        color: theme.colors.textlight, 
        fontSize: 12, 
        marginVertical: 2 
    },
    price: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: theme.colors.primary,
        marginTop: 2
    },
    arrowContainer: {
        marginLeft: 10
    }
});