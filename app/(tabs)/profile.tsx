import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = ({ navigation }: any) => {
    const [tracks, setTracks] = useState<any[]>([]);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
            });
            setFontsLoaded(true);
        };

        loadFonts();
        fetchPlayedTracks();
    }, []);

    const fetchPlayedTracks = async () => {
        try {
            const storedTracks = await AsyncStorage.getItem('playedTracks');
            const parsedTracks = storedTracks ? JSON.parse(storedTracks) : [];
            setTracks(parsedTracks);
        } catch (error) {
            console.error('Error fetching played tracks:', error);
        }
    };

    if (!fontsLoaded) {
        return <Text style={{ color: '#fff' }}>Loading Fonts...</Text>;
    }


    const resetTracks = async () => {
        try {
            await AsyncStorage.removeItem('playedTracks');
            setTracks([]);
        } catch (error) {
            console.error('Error resetting tracks:', error);
        }
    };

    return (
        <LinearGradient
            colors={['#00ff00', '#000900', '#000900']}
            style={styles.container}
        >
            <Text style={styles.title}>Mis Canciones Reproducidas</Text>
            <FlatList
                data={tracks}
                keyExtractor={(item) => item.url}
                renderItem={({ item, index }) => (
                    <View style={styles.trackContainer}>
                        <Image
                            source={{ uri: item.image[0]['#text'] }}
                            style={styles.trackImage}
                        />
                        <View style={styles.trackInfo}>
                            <Text style={styles.trackName}>{index + 1}. {item.name}</Text>
                            <Text style={styles.trackArtist}>{item.artist.name}</Text>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity onPress={resetTracks} style={styles.button}>
                <Text style={styles.buttonText}>Resetear Lista</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('home')} style={styles.button}>
                <Text style={styles.buttonText}>Volver a Home</Text>
            </TouchableOpacity>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Nunito-Bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop:100,
    },
    trackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#3a3a3a',
        padding: 10,
        borderRadius: 5,
    },
    trackImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    trackInfo: {
        flex: 1,
    },
    trackName: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Nunito-Bold',
    },
    trackArtist: {
        fontSize: 16,
        color: '#AAAAAA',
        fontFamily: 'Nunito-Bold',
    },
    button: {
        backgroundColor: '#1DB954',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
    },
});

export default Profile;