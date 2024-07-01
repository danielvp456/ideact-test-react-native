import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }: any) => {
    const [tracks, setTracks] = useState<any[]>([]);

    useEffect(() => {
        const fetchPlayedTracks = async () => {
            try {
                const storedTracks = await AsyncStorage.getItem('playedTracks');
                const parsedTracks = storedTracks ? JSON.parse(storedTracks) : [];
                setTracks(parsedTracks);
            } catch (error) {
                console.error('Error fetching played tracks:', error);
            }
        };

        fetchPlayedTracks();
    }, []);

    const resetTracks = async () => {
        try {
            await AsyncStorage.removeItem('playedTracks');
            setTracks([]);
        } catch (error) {
            console.error('Error resetting tracks:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Canciones Reproducidas</Text>
            <FlatList
                data={tracks}
                keyExtractor={(item) => item.url}
                renderItem={({ item }) => (
                    <View style={styles.trackContainer}>
                        <Image
                            source={{ uri: item.image[0]['#text'] }}
                            style={styles.trackImage}
                        />
                        <View style={styles.trackInfo}>
                            <Text style={styles.trackName}>{item.name}</Text>
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

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#292929',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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
        fontWeight: 'bold',
    },
    trackArtist: {
        fontSize: 16,
        color: '#AAAAAA',
    },
    button: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});

export default Profile;