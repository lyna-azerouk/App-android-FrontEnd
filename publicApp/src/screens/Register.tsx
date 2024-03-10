import React from 'react';
import axios from 'axios';
const { backendUrl } = require('../config.ts');
import { View, ImageBackground, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableHighlight, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

export default function Register({ navigation }: { navigation: NavigationProp<any> }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const sendSignUpForm = () => {
        if (email && password && firstName && lastName && confirmPassword) {
            if(password !== confirmPassword) return Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
            const formData = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            };
            axios.post(backendUrl + '/signup/client', formData)
                .then(response => {
                    navigation.navigate("SignIn");
                })
                .catch(error => {
                    if (error.message.includes("409")) Alert.alert('Erreur', 'Cette adresse email est déjà utilisée');
                    else console.error("Registration failed", error);
                });
        }
        else Alert.alert("Erreur", "Veuillez remplir tous les champs");
    };

    return (
        <ImageBackground style={{ flex: 1 }} source={require("../../assets/register-background.jpg")} resizeMode="cover">
            <View style={{ flex: 1, backgroundColor: "rgba(19, 85, 162, 0.7)" }}>
                <Text style={styles.titre}>INSCRIPTION</Text>
                <TextInput value={firstName} inputMode='text' placeholder='Prénom' placeholderTextColor="grey" style={styles.form} onChangeText={setFirstName} returnKeyType='next' />
                <TextInput value={lastName} inputMode='text' placeholder='Nom de famille' placeholderTextColor="grey" style={styles.form} onChangeText={setLastName} returnKeyType='next' />
                <TextInput value={email} inputMode='email' placeholder='Email' placeholderTextColor="grey" style={styles.form} onChangeText={setEmail} returnKeyType='next' />
                <TextInput value={password} secureTextEntry={true} placeholder='Mot de passe' placeholderTextColor="grey" style={styles.form} onChangeText={setPassword} returnKeyType='send' />
                <TextInput value={confirmPassword} secureTextEntry={true} placeholder='Confirmer mot de passe' placeholderTextColor="grey" style={styles.form} onChangeText={setConfirmPassword} returnKeyType='send' />
                <TouchableHighlight underlayColor="darkred" style={styles.buttons} onPress={sendSignUpForm}>
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