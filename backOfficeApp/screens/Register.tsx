/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View, Text, Image, TextInput} from 'react-native';

export default function Register() {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image
          source={require('../assets/connect_image.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.middleSection}>
        <Text style={styles.title}>Inscription</Text>
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Mot de passe"
        />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Confirmer mot de passe"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
