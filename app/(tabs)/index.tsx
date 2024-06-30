import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, FlatList } from 'react-native';

const Home = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&limit=10&api_key=c19c47264b0dfd0973d63aa54cb6788c&format=json`);
        const data = await response.json();
        //console.log(data);
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
      <Image source={{ uri: 'http://res.cloudinary.com/dedinuqpd/image/upload/v1713234252/Portfolio/zmrbiuhxexib2w29lb8r.jpg' }}
        style={styles.image} />
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
              <Text style={styles.trackName}>{item.name}</Text>
              <Text style={styles.trackArtist}>{item.artist.name}</Text>
            </View>
          )}
        />
      )}

    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#292929' },
  title: { fontSize: 30, color: '#FFFFFF' },
  image: { height: 250, width: 250, borderRadius: 20 },
  button: { backgroundColor: '#000000', color: '#FFFFFF', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 20 },

  loadingText: { color: '#fff', marginTop: 20 },
  trackContainer: { marginTop: 10, alignItems: 'center' },
  trackName: { color: '#fff', fontSize: 18 },
  trackArtist: { color: '#fff', fontSize: 14 },
});

export default Home;