import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, FlatList,Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

function Home({ navigation }: any){
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&limit=10&api_key=c19c47264b0dfd0973d63aa54cb6788c&format=json`);
        const data = await response.json();
        console.log(data);
        setTracks(data.tracks.track);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudieron obtener las pistas principales");
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>  Hello Home </Text>
      <TouchableOpacity style={styles.button} accessibilityLabel='Learn much more about this jej' onPress={() => { Alert.alert("Button clicked"); }}>
        <Text style={styles.buttonText}> Learn more </Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
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
                <Text style={styles.trackDuration}>Duration: {item.duration}</Text>
                <Text style={styles.trackListeners}>Listeners: {item.listeners}</Text>
                <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('trackDetails', {item})}>
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#292929' },
  title: { fontSize: 30, color: '#FFFFFF', marginTop:100},
  image: { height: 250, width: 250, borderRadius: 20 },
  button: { backgroundColor: '#000000', color: '#FFFFFF', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 20 },
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
    width: '75%',
    paddingLeft: 10,
  },
  trackName: { color: '#fff', fontSize: 18 },
  trackArtist: { color: '#fff', fontSize: 14 },
  trackDuration: { color: '#fff', fontSize: 12 },
  trackListeners: { color: '#fff', fontSize: 12 },
  playButton: {
    backgroundColor: '#ff0000',
    borderRadius: 5,
    padding: 5,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  playButtonText: { color: '#fff', fontSize: 12 },
});

export default Home;