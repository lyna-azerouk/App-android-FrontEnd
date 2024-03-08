import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavigationProp, RouteProp } from '@react-navigation/native';
const { backendUrl } = require('../config.ts');
import { View, ScrollView, Text, StyleSheet, Button } from 'react-native';

export default function Home({ route, navigation }: { route: RouteProp<any>, navigation: NavigationProp<any> }) {
    const token = route.params?.token;
    const [restaurants, setRestaurants] = useState<any[]>([]);

    useEffect(() => {
        axios.get(`${backendUrl}/restaurants/2/42/0.01`, { ///to do: get the alt et long  
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setRestaurants(response.data.restaurants)
            })
            .catch(error => {
                console.error('Error fetching restaurants:', error);
            });
    }, [token]);
    return (
        <ScrollView  contentContainerStyle={styles.container}>
            <Text >Email: { }</Text>
            <View style={styles.container}>
            <View>
                <Text style={styles.header}>Liste des restaurants:</Text>
                {restaurants.map(restaurant => (restaurant.tags.name)? (
                    <View key={restaurant.id} style={styles.restaurantContainer}>
                        <Button color="#1355A2" title={restaurant.tags.name}/>
                    </View>
                ): null
                
                )}
            </View>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        color: "black"
    },
    restaurantContainer: {
        marginBottom: 20,
        padding: 0,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black"
    },
    restaurantDescription: {
        fontSize: 16,
        color: "black"

    },
});