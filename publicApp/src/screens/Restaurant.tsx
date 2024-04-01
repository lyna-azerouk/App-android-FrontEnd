import React, { useContext, useEffect, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert } from 'react-native';
import axios from 'axios';
import Context from '../Context';

const { backendUrl } = require('../config.ts');

interface MenuItem {
    menuId: number;
    count: number;
}

interface OrderRequestBody {
    ClientId: number;
    RestaurantId: number;
    items: MenuItem[];
}


const Restaurant = ({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any> }) => {
    const { token, ClientId } = useContext(Context);
    //const restaurantId = 158603712; EN DUR POUR DEBUG (The Village Terrazza)
    const restaurantId = route.params?.restaurant_id;
    const [restaurantData, setRestaurantData] = useState<any>(null);
    const [items, setItems] = useState<MenuItem[]>([]); // Fix: Update the initial state value to an empty array of type MenuItem[]
    const [hasAtLeastOne, setHasAtLeastOne] = useState(false);
    const [menuNumber, setMenuNumber] = useState(0);
    const [affluenceActuelle, setAffluence] = useState("faible");

    const updateAffluence = (affluence: string) => {
        if(affluence==="LOW") setAffluence("faible");
        else if(affluence==="MODERATE") setAffluence("moyenne");
        else setAffluence("forte");
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(restaurantId);
                const response = await axios.get(`${backendUrl}/restaurant/${restaurantId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const getAffluence = await axios.get(`${backendUrl}/affluence/${restaurantId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data);
                setRestaurantData(response.data.restaurant);
                updateAffluence(getAffluence.data.Affluence);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token]);

    const addMenuToItems = (menu: any) => {
        let newItems = [...items];
        let found = false;
        for (let item of newItems) {
          if (item.menuId === menu.id) {
            item.count = (item.count) + 1;
            found = true;
            break;
          }
        }
        if (!found) {
          newItems.push({ menuId: menu.id, count: 1 });
        }
        setItems(newItems);
      }
      
      const removeMenuFromItems = (menu: any) => {
        let newItems = [...items];
        for (let item of newItems) {
          if (item.menuId === menu.id) {
            item.count = String(Number(item.count) - 1);
            if (Number(item.count) === 0) {
              newItems = newItems.filter(i => i.menuId !== menu.id);
            }
            break;
          }
        }
        setItems(newItems);
      }

    const placeOrder = async () => {
        try {
            const requestBody: OrderRequestBody = {
                ClientId: ClientId,
                RestaurantId: restaurantId,
                items: items
            };
            console.log("place order request:",requestBody);
            const response = await axios.post(`${backendUrl}/order`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                Alert.alert("Commande passée", "Votre commande a bien été passée");
                navigation.reset({
                    index: 1,
                    routes: [{ name: 'Home' }, {name:"Orders"}],
                });
            }).catch(error => {
                console.error('Error placing order:', error);
            });
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };


    return (
        <View style={styles.container}>
            {restaurantData && (
                <View style={{ width: "100%", height: "100%" }}>
                    <View style={styles.title}>
                        <View style={styles.backButton}>
                            <Button color="#1355A2" onPress={() => { navigation.goBack() }} title="<" />
                        </View>
                        <Text style={styles.titleText}>{restaurantData.restaurantDetails.tags.name}</Text>
                    </View>
                    <View style={styles.infos}>
                        <ScrollView>
                            <Image source={{ uri: "https://images.assetsdelivery.com/compings_v2/luka007/luka0071601/luka007160100612.jpg" }}
                                style={{ borderRadius: 100 }} />
                            <Text style={styles.text}>Durée moyenne d'une commande : {restaurantData.order_average_duration} minutes</Text>
                            <Text style={styles.text}>À l'heure actuelle, l'affluence dans le restaurant est {affluenceActuelle}.</Text>
                            <Text style={styles.text}>Menus :</Text>
                            {restaurantData.menus.map((menu: any) => (
                                <View key={menu.id} style={styles.menuView}>
                                    <Text style={styles.text}>{menu.name}</Text>
                                    <Text style={styles.text}>Prix : {menu.price}</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={styles.menuButtonView}>
                                            <Button disabled={!items.find(item => item.menuId === menu.id)} color="darkred" title='-'
                                                onPress={() => {
                                                    if (menuNumber === 1) { setHasAtLeastOne(false); }
                                                    setMenuNumber(menuNumber - 1);
                                                    removeMenuFromItems(menu);
                                                }} />
                                        </View>
                                        <View style={styles.menuButtonView}>
                                            <Button color="#1355A2" title='+'
                                                onPress={() => {
                                                    setHasAtLeastOne(true);
                                                    setMenuNumber(menuNumber + 1);
                                                    addMenuToItems(menu);
                                                }} />
                                        </View>
                                    </View>
                                    <Text style={styles.text}>Dans le panier : {items.find(item => item.menuId === menu.id)?.count || 0}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View>
                            <Button disabled={!hasAtLeastOne} color="#1355A2" title="Commander" onPress={placeOrder} />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 20,
    },
    title: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#1355A2",
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        color: "white",
        fontSize: 25,
    },
    text: {
        color: "black",
        fontSize: 20,
    },
    infos: {
        flex: 10,
    },
    menuView: {
        flex: 1,
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        overflow: 'hidden',
        margin: 20,
        padding: 10,
    },
    backButton: {
        borderRadius: 100,
        overflow: "hidden",
        left: 10,
        position: "absolute",
        width: "18%",
    },
    menuButtonView: {
        flex: 1,
        margin: 5,
        borderRadius: 100,
        overflow: 'hidden'
    }
});


export default Restaurant;