import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from 'react-native-vector-icons';
import Slider from '@react-native-assets/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

const TrackDetails = ({ route, navigation }) => {
    const { item, tracks, index } = route.params;
    const [currentTrack, setCurrentTrack] = useState(item);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [playbackStatus, setPlaybackStatus] = useState(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
            });
            setFontsLoaded(true);
        };

        loadFonts();
        loadSound(currentTrack);

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [currentTrack]);

    const loadSound = async (track) => {
        setIsLoading(true);
        try {
            const { sound: soundObject } = await Audio.Sound.createAsync(
                { uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
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
                    await saveTrack(currentTrack);
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
            tracks = tracks.filter(t => t.url !== track.url);
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

    const handleNextTrack = () => {
        if (index < tracks.length - 1) {
            setCurrentTrack(tracks[index + 1]);
            navigation.setParams({ item: tracks[index + 1], index: index + 1 });
        }
    };

    const handlePreviousTrack = () => {
        if (index > 0) {
            setCurrentTrack(tracks[index - 1]);
            navigation.setParams({ item: tracks[index - 1], index: index - 1 });
        }
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const formatListeners = (listeners) => {
        if (listeners >= 1000000) {
            return `${(listeners / 1000000).toFixed(1)}M`;
        } else if (listeners >= 1000) {
            return `${(listeners / 1000).toFixed(1)}K`;
        }
        return listeners.toString();
    };

    if (!fontsLoaded) {
        return <Text style={{ color: '#fff' }}>Loading Fonts...</Text>;
    }

    return (
        <LinearGradient
            colors={['#00ff00', '#004B00', '#000900']}
            style={styles.container}
        >
            <Image source={{ uri: currentTrack.image[3]['#text'] }} style={styles.image} />
            <Text style={styles.title}>{currentTrack.name}</Text>
            <Text style={styles.artist}>{currentTrack.artist.name}</Text>

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
                        <TouchableOpacity onPress={handlePreviousTrack}>
                            <FontAwesome name="backward" size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePlayPause}>
                            <FontAwesome name={isPlaying ? "pause" : "play"} size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextTrack}>
                            <FontAwesome name="forward" size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <FontAwesome name="clock-o" size={24} color="#FFFFFF" />
                    <Text style={styles.infoText}>{formatDuration(currentTrack.duration)}</Text>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name="user" size={24} color="#FFFFFF" />
                    <Text style={styles.infoText}>{formatListeners(currentTrack.listeners)}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('home')} style={styles.homeButton}>
                <Text style={styles.homeButtonText}>Regresar al Home</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontFamily: 'Nunito-Bold',
        marginBottom: 10,
    },
    artist: {
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'Nunito-Bold',
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
        marginVertical: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Nunito-Bold',
        marginLeft: 5,
    },
    homeButton: {
        backgroundColor: '#1DB954',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
    },
});

export default TrackDetails;