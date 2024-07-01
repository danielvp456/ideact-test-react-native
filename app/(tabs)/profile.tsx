import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#292929',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    trackContainer: {
        flexDirection: 'row',
        backgroundColor: '#1c1c1c',
        marginVertical: 10,
        borderRadius: 10,
        width: '100%',
        padding: 10,
        alignItems: 'center',
    },
    trackImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    trackInfo: {
        marginLeft: 10,
    },
    trackName: {
        color: '#fff',
        fontSize: 18,
    },
    trackArtist: {
        color: '#fff',
        fontSize: 14,
    },
});

export default Profile;