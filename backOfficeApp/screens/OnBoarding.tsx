/* eslint-disable prettier/prettier */
import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

export default function OnBoarding({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  return (
    <ImageBackground
      source={require('../assets/home_image.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.button}
          onPress={() => {
            navigation.navigate('Register');
          }}
          underlayColor="darkred">
          <Text style={styles.buttonText}>INSCRIPTION</Text>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="darkred"
          style={styles.button}
          onPress={() => {
            navigation.navigate('SignIn');
          }}>
          <Text style={styles.buttonText}>CONNEXION</Text>
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 250,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#03428C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
