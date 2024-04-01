/* eslint-disable prettier/prettier */
import axios from 'axios';
const { backendUrl } = require('../config.ts');
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, StyleSheet, View, Text, ScrollView, Button, RefreshControl } from 'react-native';
import Context from '../Context';

export default function Orders({ route, navigation }: { route: RouteProp<any>, navigation: NavigationProp<any> }) {
    const { token, ClientId } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [restaurantNames, setRestaurantNames] = useState<{ [key: string]: string }>({});
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshAsked, setRefreshAsked] = useState(false);
    const [collectCode, setCollectCode] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [noOrders, setNoOrders] = useState(false);
    const [hasObtainedOrder, setObtainedOrder] = useState(false);
    const [currentResto, setCurrentResto] = useState(0);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setRefreshAsked(!refreshAsked);
        setOrders([]);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setNoOrders(false);
            const response = await axios.get(`${backendUrl}/order/user/${ClientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const orders = response.data["User orders"];
            if (!orders) {
                setNoOrders(true);
                setRefreshing(false);
                return;
            }
            setOrders(orders); // Mettre à jour l'état avec les ordres récupérés
            setRefreshing(false);
            let _restaurantNames: { [name: string]: string } = restaurantNames;
            for (const order of orders) {
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

    const pickOrder = (orderId: string, restaurantId: number) => async () => {
        setObtainedOrder(false);
        axios.get(`${backendUrl}/order/pick/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            console.log('Order picked:', response.data.Code);
            setCollectCode(response.data.Code);
            setCurrentResto(restaurantId);
            setModalVisible(true);
        })
            .catch(error => {
                console.error('Error picking order:', error);
            });
    }

    const voteAffluence = (affluence: string) => {
        const restaurantId = currentResto;
        console.log('Voting affluence:', affluence, restaurantId)
        axios.patch(`${backendUrl}/client/affluence/${restaurantId}/${affluence}`, {
            affluence: affluence
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            console.log('Affluence voted:', response.data);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        })
            .catch(error => {
                console.error('Error voting affluence:', error);
            });
    }

    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                {!hasObtainedOrder ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 10, flex: 0.35, width: "80%", alignItems: "center" }}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.collectCode}>{collectCode}</Text>
                            <View style={{ width: "80%" }}>
                                <Button title="OK" color="#1355A2" onPress={() => { setObtainedOrder(true) }} />
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white" }}>
                        <Text adjustsFontSizeToFit style={{ color: 'black', fontSize: 30 }}>Merci pour votre commande !</Text>
                        <Text numberOfLines={2} adjustsFontSizeToFit style={{ color: 'black', fontSize: 30, textAlign: "center" }}>S'il-vous-plaît, quelle est l'affluence dans le restaurant ?</Text>
                        <View style={{ width: "80%" }}>
                            <View style={{ margin: 5, borderRadius: 80, overflow: "hidden" }}>
                                <Button color="#007a21" title="Faible" onPress={() => { voteAffluence("LOW") }} />
                            </View>
                            <View style={{ margin: 5, borderRadius: 80, overflow: "hidden" }}>
                                <Button color="#ff9d00" title="Modérée" onPress={() => { voteAffluence("MODERATE") }} />
                            </View>
                            <View style={{ margin: 5, borderRadius: 80, overflow: "hidden" }}>
                                <Button color="darkred" title="Forte" onPress={() => { voteAffluence("HIGH") }} />
                            </View>
                            <View style={{ margin: 5, borderRadius: 80, overflow: "hidden" }}>
                                <Button color="#1355A2" title="Ne sait pas" onPress={() => { setModalVisible(false) }} />
                            </View>
                        </View>
                    </View>}
            </Modal >
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
                        {order.status === "READY" ? <Button title="Récupérer la commande" color="#1355A2"
                            onPress={pickOrder(order.id, order.restaurantId)} />
                            : null}
                        {/* Vous pouvez ajouter d'autres détails de la commande ici */}
                    </View>
                ))
                    : (noOrders) ? (<Text style={{ color: "black", fontSize: 40, alignSelf: "center" }}>Aucune commande</Text>)
                        : (Array.from({ length: 8 }).map((_, index: number) => (<View key={index} style={styles.orderContainer}>
                            {/* Affichage durant le chargement */}
                        </View>)))
                }
            </ScrollView>
        </View >
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
    collectCode: {
        fontSize: 200,
        color: "black",
        alignSelf: 'center',
        margin: 50,
    }
});

