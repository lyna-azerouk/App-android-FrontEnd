import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { StyleSheet, Image, Text, View, TouchableHighlight, Alert } from "react-native"


export default function OnBoarding({ navigation }: { navigation: NavigationProp<any>}) {
    return <View style={styles.Page1InscriptionConnexion}>
        <Image source={require("../../assets/on-boarding.jpg")} style={styles.img} resizeMode="contain" />
        <View style={styles.buttonView}>
            <TouchableHighlight style={styles.buttons} onPress={() => { navigation.navigate("Register") }} underlayColor="darkred">
                <Text style={styles.buttonText}>INSCRIPTION</Text>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="darkred" style={styles.buttons} onPress={() => { Alert.alert("Bienvenue", "a cliqué sur Connexion") }}>
                <Text style={styles.buttonText}>CONNEXION</Text>
            </TouchableHighlight>
        </View>
    </View>
}

const styles = StyleSheet.create({
    Page1InscriptionConnexion: {
        flex: 1,
        backgroundColor: "#1355A2"
    },
    img: {
        flex: 3,
        objectFit: "cover",
        width: "100%",
        opacity: 0.75

    },
    buttonView: {
        flex: 1,
    },
    buttons: {
        width: 350,
        height: 63,
        borderRadius: 50,
        alignSelf: "center",
        marginTop: 30,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: "black",
        alignItems: "center",
        fontSize: 30,
    }
})