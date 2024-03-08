import React, {useEffect, useState} from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet} from 'react-native';
import axios from 'axios';

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


const Restaurant = ({ route, navigation }: { route: RouteProp<any>, navigation: NavigationProp<any> }) => {
    const token = route.params?.token;
    const restaurantId = route.params?.id;
    const [restaurantData, setRestaurantData] = useState<any>(null);
    const [items, setItems] = useState<any>(null);

    console.log("restaurantId", restaurantId);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get(`${backendUrl}/restaurant/${restaurantId}`, {
                headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data)
                setRestaurantData(response.data.restaurant);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [token]);

    const placeOrder = async () => {
        try {
          const requestBody: OrderRequestBody = {
            ClientId: 945487980946653185,
            RestaurantId: restaurantId,
            items: items
          };
          const response = await axios.post(`${backendUrl}/order`, requestBody, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Order placed successfully:', response.data);
        } catch (error) {
          console.error('Error placing order:', error);
        }
      };


    return (
        <View style={styles.container}>
            {restaurantData && (
                <View>
                    <Text style={styles.text}>Restaurant Name: {restaurantData.restaurantDetails.tags.name}</Text>
                    <Text style={styles.text}>Average Order Duration: {restaurantData.order_average_duration} minutes</Text>
                    <Text style={styles.text}>Menus:</Text>
                    {restaurantData.menus.map((menu: any) => (
                        <View key={menu.id}>
                            <Text style={styles.text}>- {menu.name}</Text>
                            <Text style={styles.text}>Price: {menu.price}</Text>
                        </View>
                    ))}
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
    text: {
        color: "black",
        fontSize: 20,
    }
});


export default Restaurant;