/* eslint-disable prettier/prettier */
import axios from 'axios';
const { backendUrl } = require('../config.ts');
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text } from 'react-native'; // Supposez que vous utilisiez React Native

export default function Orders({ route }: { route: RouteProp<any> }) {
    const token = route.params?.token;
    const client_id = route.params?.client_id; 
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/order/user/${client_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Response:', response.data);
                setOrders(response.data["User orders"]); // Mettre à jour l'état avec les ordres récupérés
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: '#fff',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        orderContainer: {
            marginBottom: 20,
            padding: 10,
            backgroundColor: '#f8f8f8',
        },
        orderText: {
            fontSize: 16,
        },
        itemContainer: {
            marginBottom: 10,
        },
        itemText: {
            fontSize: 14,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Orders:</Text>
            {orders.map((order: any, index: number) => (
                <View key={index} style={styles.orderContainer}>
                    <Text style={styles.orderText}>Order Date: {order.date}</Text>
                    <Text style={styles.orderText}>Restaurant ID: {order.restaurantId}</Text>
                    <Text style={styles.orderText}>Status: {order.status}</Text>
                    {order.items && order.items.map((item: any, index: number) => {
                        return (
                            <View key={index} style={styles.itemContainer}>
                                <Text style={styles.itemText}>Menu ID: {item.menuId}</Text>
                                <Text style={styles.itemText}>Quantity: {item.count}</Text>
                            </View>
                        );
                    })}
                    {/* Vous pouvez ajouter d'autres détails de la commande ici */}
                </View>
            ))}
        </View>
    );
}

    