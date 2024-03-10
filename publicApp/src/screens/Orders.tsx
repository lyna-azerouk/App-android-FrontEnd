/* eslint-disable prettier/prettier */
import axios from 'axios';
const { backendUrl } = require('../config.ts');
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native'; // Supposez que vous utilisiez React Native

export default function Orders({ route }: { route: RouteProp<any> }) {
    const token = route.params?.token;
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/order/user/945487980946653185`, {
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

    return (
        <View>
            <Text>Orders:</Text>
            {orders.map((order: any, index: number) => (
                <View key={index} style={{ marginBottom: 20 }}>
                    <Text>Order Date: {order.date}</Text>
                    <Text>Restaurant ID: {order.restaurantId}</Text>
                    <Text>Status: {order.status}</Text>
                    {order.items && order.items.map((item: any, index: number) => {
                        return (
                            <View key={index} style={{ marginBottom: 20 }}>
                                <Text>Menu ID: {item.menuId}</Text> {/* Rajouter une route qui recupère les information de chaque menus via son Id */}      
                                <Text>Quantity: {item.count}</Text>
                            </View>
                        );
                    })}
                    {/* Vous pouvez ajouter d'autres détails de la commande ici */}
                </View>
            ))}
        </View>
    );
}
