import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Home, Utensils, Calendar, User } from 'lucide-react-native';
import { theme } from '../styles/theme';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

export const FloatingNav = ({ isScrolling }) => {
    const navigation = useNavigation();
    const currentRoute = useNavigationState(state => state?.routes[state.index]?.name);
    const widthAnim = useRef(new Animated.Value(width * 0.85)).current;
    const soundRef = useRef(null);

    useEffect(() => {
        async function loadSound() {
            // Asegúrate de que la ruta coincida con tu archivo en assets
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/burbuja.mp3')
            );
            soundRef.current = sound;
        }
        loadSound();

        return () => {
            if (soundRef.current) soundRef.current.unloadAsync();
        };
    }, []);

    const playFeedback = async () => {
        // Respuesta háptica rápida
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // Sonido de burbuja
        if (soundRef.current) {
            try {
                await soundRef.current.replayAsync();
            } catch (error) {
                console.log("Error al reproducir sonido", error);
            }
        }
    };

    const handlePress = (routeName) => {
        playFeedback();
        navigation.navigate(routeName);
    };

    useEffect(() => {
        Animated.spring(widthAnim, {
            toValue: isScrolling ? 65 : width * 0.85,
            damping: 15,
            useNativeDriver: false,
        }).start();
    }, [isScrolling]);

    const isActive = (routeName) => currentRoute === routeName;

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.bar, { width: widthAnim }]}>
                {!isScrolling ? (
                    <View style={styles.fullNav}>
                        <NavItem icon={Home} active={isActive('Home')} onPress={() => handlePress('Home')} />
                        <NavItem icon={Utensils} active={isActive('Cart')} onPress={() => handlePress('Cart')} />
                        <NavItem icon={Calendar} active={isActive('OrdersHistory')} onPress={() => handlePress('OrdersHistory')} />
                        <NavItem icon={User} active={isActive('Profile')} onPress={() => handlePress('Profile')} />
                    </View>
                ) : (
                    <TouchableOpacity style={styles.circle} onPress={() => handlePress('Home')}>
                        <Home color="white" size={26} />
                    </TouchableOpacity>
                )}
            </Animated.View>
        </View>
    );
};

const NavItem = ({ icon: Icon, active, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    return (
        <TouchableOpacity onPress={animatePress} activeOpacity={0.7} style={styles.iconContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Icon color={active ? theme.colors.accent : "white"} size={24} />
            </Animated.View>
            {active && <View style={styles.activeDot} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { position: 'absolute', bottom: 35, width: '100%', alignItems: 'center' },
    bar: {
        height: 65,
        backgroundColor: theme.colors.primary,
        borderRadius: 35,
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 15,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    fullNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' },
    circle: { alignItems: 'center', justifyContent: 'center' },
    iconContainer: { alignItems: 'center', justifyContent: 'center', width: 50, height: 50 },
    activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: theme.colors.accent, position: 'absolute', bottom: 2 }
});