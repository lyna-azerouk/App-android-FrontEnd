import React from 'react';
import axios from 'axios';
const {backendUrl} = require('../config.ts');
import { NavigationProp } from '@react-navigation/native';
import {  View, ImageBackground, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableHighlight, Alert } from 'react-native';

export default function SignIn({ navigation }: { navigation: NavigationProp<any> }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const sendSignInForm = () => {
        if (email && password) {
            const formData = {
                email: email,
                password: password
            };
            console.log("formData", formData);
            axios.post(backendUrl+'/auth/client', formData)
                .then(response => {
                    console.log("Authentification successful", response.data.token);
                    const token = response.data.token;
                    navigation.navigate("Home", { token: token })
                })
                .catch(error => {
                    console.error("Authentification failed", error);
                });
        }
        else Alert.alert("Erreur", "Veuillez remplir tous les champs");
    };

    return (
        <ImageBackground style={{ flex: 1 }} source={require("../../assets/register-background.jpg")} resizeMode="cover">
            <View style={{ flex: 1, backgroundColor: "rgba(19, 85, 162, 0.7)" }}>
                <Text style={styles.titre}>CONNEXION</Text>
                <TextInput value={email} inputMode='email' placeholder='Email' placeholderTextColor="grey" style={styles.form} onChangeText={setEmail} returnKeyType='next' />
                <TextInput value={password} secureTextEntry={true} placeholder='Mot de passe' placeholderTextColor="grey" style={styles.form} onChangeText={setPassword} returnKeyType='send' />
                <TouchableHighlight underlayColor="darkred" style={styles.buttons} onPress={sendSignInForm}>
                    <Text style={styles.buttonText}>CONTINUER</Text>
                </TouchableHighlight>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    form: {
        width: 400,
        height: 41,
        alignSelf: "center",
        borderRadius: 50,
        backgroundColor: "white",
        padding: 10,
        color: "black",
        margin: 10
    },
    titre: {
        color: "white",
        fontSize: 100,
        alignSelf: "center",
        margin: 50,
        opacity: 0.6,
        fontFamily: "times new roman"
    },
    buttons: {
        width: 350,
        height: 63,
        borderRadius: 50,
        alignSelf: "center",
        marginTop: 30,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.8
    },
    buttonText: {
        color: "white",
        alignItems: "center",
        fontSize: 30,
    }

})