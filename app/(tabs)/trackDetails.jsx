import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from 'react-native-vector-icons';
import Slider from '@react-native-assets/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrackDetails = ({ route }) => {
    const { item } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [playbackStatus, setPlaybackStatus] = useState(null);

    useEffect(() => {
        loadSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const loadSound = async () => {
        setIsLoading(true);
        try {
            const { sound: soundObject } = await Audio.Sound.createAsync(
                { uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }, // URL directa a un archivo MP3
                { shouldPlay: false }
            );
            setSound(soundObject);
            soundObject.setOnPlaybackStatusUpdate(status => setPlaybackStatus(status));
        } catch (error) {
            console.error('Error loading sound:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayPause = async () => {
        if (sound) {
            try {
                if (isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.playAsync();
                    await saveTrack(item);
                }
                setIsPlaying(!isPlaying);
            } catch (error) {
                console.error('Error playing/pausing sound:', error);
            }
        }
    };

    const saveTrack = async (track) => {
        try {
            let tracks = await AsyncStorage.getItem('playedTracks');
            tracks = tracks ? JSON.parse(tracks) : [];
            tracks = [track, ...tracks].slice(0, 10);
            await AsyncStorage.setItem('playedTracks', JSON.stringify(tracks));
        } catch (error) {
            console.error('Error saving track:', error);
        }
    };

    const getProgress = () => {
        if (playbackStatus && playbackStatus.positionMillis != null && playbackStatus.durationMillis != null) {
            return (playbackStatus.positionMillis / playbackStatus.durationMillis) * 100;
        }
        return 0;
    };

    const handleSliderChange = async (value) => {
        if (sound && playbackStatus && playbackStatus.durationMillis != null) {
            const newPosition = value * playbackStatus.durationMillis / 100;
            await sound.setPositionAsync(newPosition);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: item.image[3]['#text'] }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.artist}>{item.artist.name}</Text>

            {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
                <>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={getProgress()}
                        onValueChange={handleSliderChange}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        thumbTintColor="#FFFFFF"
                    />
                    <View style={styles.controls}>
                        <TouchableOpacity>
                            <FontAwesome name="backward" size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePlayPause}>
                            <FontAwesome name={isPlaying ? "pause" : "play"} size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome name="forward" size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <FontAwesome name="clock-o" size={24} color="#FFFFFF" />
                    <Text style={styles.infoText}>{item.duration} sec</Text>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name="user" size={24} color="#FFFFFF" />
                    <Text style={styles.infoText}>{item.listeners} listeners</Text>
                </View>
            </View>
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
    image: {
        width: 250,
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    artist: {
        fontSize: 20,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    slider: {
        width: '80%',
        height: 40,
        marginBottom: 20,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '60%',
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 18,
        color: '#FFFFFF',
        marginLeft: 5,
    },
});

export default TrackDetails;