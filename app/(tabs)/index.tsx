import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, FlatList, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('window');

function Home({ navigation }: any) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&limit=10&api_key=c19c47264b0dfd0973d63aa54cb6788c&format=json`);
        const data = await response.json();
        setTracks(data.tracks.track);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudieron obtener las pistas principales");
        setLoading(false);
      }
    };

    const loadFonts = async () => {
      await Font.loadAsync({
        'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    fetchTopTracks();
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text style={{ color: '#fff' }}>Loading Fonts...</Text>;
  }

  const toggleModal = (track: any) => {
    setSelectedTrack(track);
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello Home</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('profile')}>
        <Text style={styles.buttonText}>Mi Perfil</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
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
                <Text style={styles.trackName}>{item.name}</Text>
                <Text style={styles.trackArtist}>{item.artist.name}</Text>
                <Text style={styles.trackDuration}>Duration: {item.duration}</Text>
                <Text style={styles.trackListeners}>Listeners: {item.listeners}</Text>
                <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('trackDetails', { item, tracks, index })}>
                  <FontAwesome name="play" size={15} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton} onPress={() => toggleModal(item)}>
                  <FontAwesome name="ellipsis-v" size={15} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {selectedTrack && (
            <>
              <Text style={styles.modalTitle}>{selectedTrack.name}</Text>
              <Text style={styles.modalText}>Artist: {selectedTrack.artist.name}</Text>
              <Text style={styles.modalText}>Duration: {selectedTrack.duration}</Text>
              <Text style={styles.modalText}>Listeners: {selectedTrack.listeners}</Text>
            </>
          )}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212'},
  header: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#121212',
    marginTop:40
  },
  title: { fontSize: 30, color: '#FFFFFF', fontFamily: 'Nunito-Bold', textAlign: 'center' },
  button: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  buttonText: { color: '#fff', fontSize: 18, fontFamily: 'Nunito-Bold' },
  loadingText: { color: '#fff', marginTop: 20 },
  trackContainer: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    marginVertical: 10,
    borderRadius: 10,
    width: width * 0.9,
    padding: 10,
    alignItems: 'center',
  },
  trackImage: {
    width: '30%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 5,
  },
  trackInfo: {
    width: '70%',
    paddingLeft: 10,
  },
  trackName: { color: '#fff', fontSize: 20, fontFamily: 'Nunito-Bold' },
  trackArtist: { color: '#a1a1a1', fontSize: 14 },
  trackDuration: { color: '#a1a1a1', fontSize: 12 },
  trackListeners: { color: '#a1a1a1', fontSize: 12 },
  playButton: {
    backgroundColor: '#1DB954',
    borderRadius: 100,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 4,
    right: 10,
    width: 30,
    height: 30,
    zIndex: 1,
  },
  moreButton: {
    position: 'absolute',
    width: 15,
    height: 30,
    top: 4,
    right: 0,
    zIndex: 2,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.5,
  },
  modalTitle: { fontSize: 24, color: '#fff', fontFamily: 'Nunito-Bold', marginBottom: 20 },
  modalText: { color: '#a1a1a1', fontSize: 16, marginBottom: 10 },
  closeButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: { color: '#fff', fontSize: 18, fontFamily: 'Nunito-Bold' },
});

export default Home;