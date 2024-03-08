import React from 'react';
import axios from 'axios';
import { View, ImageBackground, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableHighlight, Alert } from 'react-native';

export default function Register() {
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const sendSignUpForm = () => {
        if(password && email){
            //axios.post("http://localhost:8080/signup", {})
        }
        else Alert.alert("Erreur", "Veuillez remplir tous les champs");
    }

    return (

        <ImageBackground style={{ flex: 1 }} source={require("../../assets/register-background.jpg")} resizeMode="cover">
            <KeyboardAvoidingView behavior='position' style={{ flex: 1, backgroundColor: "rgba(19, 85, 162, 0.7)" }}>
                <Text style={styles.titre}>INSCRIPTION</Text>
                <TextInput value={name} placeholder='Nom' placeholderTextColor="grey" style={styles.form} onChangeText={setName} returnKeyType='next' />
                <TextInput value={surname} placeholder='Prénom' placeholderTextColor="grey" style={styles.form} onChangeText={setSurname} returnKeyType='next' />
                <TextInput value={email} inputMode='email' placeholder='Email' placeholderTextColor="grey" style={styles.form} onChangeText={setEmail} returnKeyType='next' />
                <TextInput value={phone} maxLength={10} keyboardType="phone-pad" placeholder='Téléphone' placeholderTextColor="grey" style={styles.form} onChangeText={setPhone} returnKeyType='next' />
                <TextInput value={password} secureTextEntry={true} placeholder='Mot de passe' placeholderTextColor="grey" style={styles.form} onChangeText={setPassword} returnKeyType='next' />
                <TextInput value={confirmPassword} secureTextEntry={true} placeholder='Confirmer mot de passe' placeholderTextColor="grey" style={styles.form} onChangeText={setConfirmPassword} returnKeyType='send' />
                <TouchableHighlight underlayColor="darkred" style={styles.buttons} onPress={() => { sendSignUpForm() }}>
                    <Text style={styles.buttonText}>CONTINUER</Text>
                </TouchableHighlight>
            </KeyboardAvoidingView>
        </ImageBackground>

    )
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