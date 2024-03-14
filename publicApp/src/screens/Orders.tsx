/* eslint-disable prettier/prettier */
import axios from 'axios';
const { backendUrl } = require('../config.ts');
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Button, RefreshControl } from 'react-native'; // Supposez que vous utilisiez React Native
import Context from '../Context';

export default function Orders({ route, navigation }: { route: RouteProp<any>, navigation: NavigationProp<any> }) {
    const { token, ClientId } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [restaurantNames, setRestaurantNames] = useState<{ [key: string]: string }>({});
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshAsked, setRefreshAsked] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setRefreshAsked(!refreshAsked);
        setOrders([]);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/order/user/${ClientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data["User orders"]); // Mettre à jour l'état avec les ordres récupérés
            setRefreshing(false);
            let _restaurantNames: { [name: string]: string } = {};
            for (const order of response.data["User orders"]) {
                if (!_restaurantNames[order.restaurantId]) {
                    const name = await fetchRestaurantName(order.restaurantId);
                    _restaurantNames[order.restaurantId] = name;
                    setRestaurantNames(_restaurantNames);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchRestaurantName = async (restaurantId: string) => {
        const response = await axios.get(`${backendUrl}/restaurant/${restaurantId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.restaurant.restaurantDetails.tags.name;
    }

    const pickOrder = (orderId: string) => async () => {
        axios.get(`${backendUrl}/order/pick/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            console.log('Order picked:', response.data.Code);
            navigation.navigate('Home');
        })
            .catch(error => {
                console.error('Error picking order:', error);
            });
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.title}>
                <View style={styles.backButton}>
                    <Button color="#1355A2" onPress={() => { navigation.goBack() }} title="<" />
                </View>
                <Text style={styles.titleText}>Mes Commandes</Text>
            </View>
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {(orders.length > 0) ? orders.map((order: any, index: number) => (
                    <View key={index} style={styles.orderContainer}>
                        <Text style={styles.orderText}>Date de la commande : {order.date}</Text>
                        <Text style={styles.orderText}>Restaurant : {restaurantNames[order.restaurantId]}</Text>
                        <Text style={styles.orderText}>Statut : {order.status}</Text>
                        {order.items && order.items.map((item: any, index: number) => {
                            return (
                                <View key={index} style={styles.itemContainer}>
                                    <Text style={styles.itemText}>Menu ID: {item.menuId}</Text>
                                    <Text style={styles.itemText}>Quantité: {item.count}</Text>
                                </View>
                            );
                        })}
                        <Text style={styles.orderText}>Prix : {order.price}</Text>
                        {order.status === "COMPLETED" ? <Button title="Récupérer la commande" color="#1355A2"
                            onPress={pickOrder(order.id)} />
                            : null}
                        {/* Vous pouvez ajouter d'autres détails de la commande ici */}
                    </View>
                ))
                    : (Array.from({ length: 8 }).map((_, index: number) => (<View key={index} style={styles.orderContainer}>
                        {/* Affichage durant le chargement */}
                    </View>)))
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 10,
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        flex: 0.1,
        backgroundColor: "#1355A2",
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        color: "white",
        fontSize: 25,
    },
    orderContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f8f8f8',
        minHeight: 100,
    },
    orderText: {
        fontSize: 16,
        color: "black"
    },
    itemContainer: {
        marginBottom: 10,
    },
    itemText: {
        fontSize: 14,
        color: "black"
    },
    backButton: {
        borderRadius: 100,
        overflow: "hidden",
        left: 10,
        position: "absolute",
        width: "18%",
    },
});

