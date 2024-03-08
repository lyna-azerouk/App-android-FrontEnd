import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavigationProp, RouteProp } from '@react-navigation/native';
const { backendUrl } = require('../config.ts');
import { View, ScrollView, Text, StyleSheet, Button, PermissionsAndroid, RefreshControl } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Geolocation Permission',
                message: 'Can we access your location?',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === 'granted') {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};


export default function Home({ route, navigation }: { route: RouteProp<any>, navigation: NavigationProp<any> }) {
    const token = route.params?.token;
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [location, setLocation] = useState<any>(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshAsked, setRefreshAsked] = useState(false);

    interface Position {
        coords: {
            latitude: number;
            longitude: number;
        }
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setRefreshAsked(!refreshAsked);
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);
    
    const getLocation = () => {
        return new Promise<Position>((resolve, reject) => {
            requestLocationPermission().then(result => {
                if (result) {
                    Geolocation.getCurrentPosition(
                        position => {
                            resolve(position);
                        },
                        error => {
                            console.error('Geolocation error:', error.code, error.message);
                            reject(error);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                    );
                } else {
                    reject(new Error('Permission denied'));
                }
            }).catch(error => {
                console.error('Error getting location:', error);
                reject(error);
            });
        });
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const location: Position = await getLocation();

                //const response = await axios.get(`${backendUrl}/restaurants/${location.coords.longitude}/${location.coords.latitude}/0.001`, {
                const response = await axios.get(`${backendUrl}/restaurants/2.3228662/48.8298353/0.0001`, {  //Provisoire
                headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRestaurants(response.data.restaurants);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [token, refreshAsked]);
    
    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={styles.container}>
            <Text >Email: { }</Text>
            <View style={styles.container}>
                <View>
                    <Text style={styles.header}>Liste des restaurants:</Text>
                    {restaurants.map(restaurant => (restaurant.tags.name) ? (
                        <View key={restaurant.id} style={styles.restaurantContainer}>
                            <Button color="#1355A2" title={restaurant.tags.name} 
                            onPress={() => {
                                navigation.navigate('Restaurant', { id: restaurant.id, token: token });
                            }}/>
                        </View>
                    ) : null

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