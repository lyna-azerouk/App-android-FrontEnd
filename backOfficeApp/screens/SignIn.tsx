import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  Alert,
  TouchableHighlight,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
const {backendUrl} = require('../config.ts');
import axios from 'axios';

export default function SignIn({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');

  const sendSignInForm = () => {
    const numericId = parseInt(id, 10);
    if (id && password) {
      const formData = {
        id: numericId,
        password: password,
      };
      axios
        .post(backendUrl + '/auth/restaurant', formData)
        .then(response => {
          const token = response.data.token;
          navigation.navigate('Orders', {token: token});
        })
        .catch(error => {
          console.error('Authentification failed', error);
        });
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    }
  };

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
        <Text style={styles.title}>Connexion</Text>
        <TextInput
          value={id}
          onChangeText={setId}
          style={styles.input}
          placeholder="ID"
          keyboardType="numeric"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={true}
          placeholder="Mot de passe"
          keyboardType="numeric"
        />
        <TouchableHighlight
          underlayColor="darkred"
          style={styles.button}
          onPress={sendSignInForm}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableHighlight>
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
  button: {
    width: 150,
    height: 40,
    borderRadius: 5,
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
