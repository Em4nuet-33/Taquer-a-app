import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Clock, Flame } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { Alert, ToastAndroid, Platform } from 'react-native';
const FoodDetailScreen = ({ route, navigation }) => {
    const item = route.params?.item;
    const { addToCart } = useCart();
    
    // Estado para la variedad, inicializamos con la primera opción si existe
    const [selectedOption, setSelectedOption] = useState(
        item?.options ? item.options.split(',')[0] : ''
    );

    if (!item) {
        return (
            <View style={styles.center}><Text>No se encontró el platillo</Text></View>
        );
    }

   const handleAddToCart = () => {
    const productWithOption = {
        ...item,
        selectedOption: selectedOption || 'Sencilla',
        uniqueId: `${item.id}-${selectedOption}`
    };
    addToCart(productWithOption);

    // Feedback visual según la plataforma
    if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
            `¡${item.name} (${selectedOption || 'Sencilla'}) agregado!`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        );
    } else {
        Alert.alert("Agregado", "Producto añadido al pedido");
    }
    
    navigation.goBack(); 
};
    return (
        <View style={styles.container}>
            <Image source={{ uri: item.image_url }} style={styles.mainImage} />
            
            <SafeAreaView style={styles.backButtonContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ChevronLeft color={theme.colors.text} size={28} />
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.detailsCard}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.titleRow}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}><Clock size={16} color={theme.colors.primary} /><Text style={styles.statText}>15-20 min</Text></View>
                        <View style={styles.stat}><Flame size={16} color={theme.colors.primary} /><Text style={styles.statText}>Más pedido</Text></View>
                    </View>

                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    {/* SELECTOR DE VARIEDADES */}
                    {item.options && (
                        <View style={styles.optionSection}>
                            <Text style={styles.sectionTitle}>Variedad</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedOption}
                                    onValueChange={(val) => setSelectedOption(val)}
                                    style={styles.picker}
                                >
                                    {item.options.split(',').map((opt) => (
                                        <Picker.Item key={opt} label={opt} value={opt} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}
                    
                    <View style={{ height: 120 }} /> 
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.mainButton} onPress={handleAddToCart}>
                        <Text style={styles.mainButtonText}>Agregar al pedido</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    mainImage: { width: '100%', height: 350 },
    backButtonContainer: { position: 'absolute', top: 40, left: 20 },
    backBtn: { backgroundColor: 'white', borderRadius: 12, padding: 8, elevation: 5 },
    detailsCard: { flex: 1, backgroundColor: 'white', marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, flex: 1 },
    price: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
    statsRow: { flexDirection: 'row', marginVertical: 15 },
    stat: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    statText: { marginLeft: 5, color: theme.colors.textlight, fontWeight: '600' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    description: { fontSize: 15, color: theme.colors.textlight, lineHeight: 22 },
    optionSection: { marginTop: 20 },
    pickerContainer: { backgroundColor: '#F5F5F5', borderRadius: 12, marginTop: 5, overflow: 'hidden' },
    picker: { height: 50, width: '100%' },
    footer: { position: 'absolute', bottom: 30, left: 25, right: 25 },
    mainButton: { backgroundColor: theme.colors.primary, padding: 20, borderRadius: 15, alignItems: 'center', elevation: 5 },
    mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default FoodDetailScreen;