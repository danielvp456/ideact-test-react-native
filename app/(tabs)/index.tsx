import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>  Hello Home </Text>
      <Image source={{ uri: 'http://res.cloudinary.com/dedinuqpd/image/upload/v1713234252/Portfolio/zmrbiuhxexib2w29lb8r.jpg' }}
        style={styles.image} />
      <TouchableOpacity style={styles.button} accessibilityLabel='Learn much more about this jej' onPress={() => { Alert.alert("Button clicked"); }}>
        <Text style={styles.buttonText}> Learn more </Text>
      </TouchableOpacity>
    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#292929' },
  title: { fontSize: 30, color: '#FFFFFF' },
  image: { height: 250, width: 250, borderRadius: 20 },
  button: { backgroundColor: '#000000',color: '#FFFFFF', marginTop: 10},
  buttonText: { color: '#fff', fontSize:20}
});

export default Home;