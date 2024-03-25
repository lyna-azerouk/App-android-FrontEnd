import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {Button} from 'react-native';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Context from '../components/Context';
const {backendUrl} = require('../config.ts');

enum Status {
  ENATTENTE = 'PENDING',
  ENCOURS = 'INPROGRESS',
  PRET = 'READY',
  COLLECTE = 'COMPLETED',
}

const Orders = ({route}) => {
  const {token} = route.params;
  const {RestaurantId} = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/order/restaurant/${RestaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(token);
        const fetchedOrders = response.data['Restaurant orders'];
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [RestaurantId, token]);

  const fetchRestaurantName = async (restaurantId: string) => {
    const response = await axios.get(
      `${backendUrl}/restaurant/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.restaurant.restaurantDetails.tags.name;
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleOpenClose = () => {
    Alert.alert(
      'Confirmation',
      `Êtes-vous sûr de vouloir changer le statut à ${
        isOpen ? 'Fermé' : 'Ouvert'
      }?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: () => setIsOpen(!isOpen),
        },
      ],
    );
  };

  const handleConfirm = async orderId => {
    try {
      const response = await axios.patch(
        `${backendUrl}/order/accept/${orderId}`,
        {
          status: Status.ENCOURS,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              status: Status.ENCOURS,
            };
          } else {
            return order;
          }
        });

        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  const handleDecline = orderId => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
  };

  const handleReady = orderId => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: Status.PRET,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  const handleCollect = orderId => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: Status.COLLECTE,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/order_image.jpg')}
        style={styles.headerImage}
      />

      <ScrollView style={styles.content}>
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={handleMenuPress}>
            <Image
              source={require('../assets/menu_icon.png')}
              style={styles.menuButton}
            />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Commandes</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.headerText}>Commande ID</Text>
          <Text style={styles.headerText}>Client</Text>
          <Text style={styles.headerText}>Statut</Text>
          <Text style={styles.headerText}>Prix</Text>
          <Text style={styles.headerText}>Action</Text>
        </View>
        {orders.map((order: any, index: number) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderItemText}>{order.id}</Text>
            <Text style={styles.orderItemText}>{order.clientId}</Text>
            <Text style={styles.orderItemText}>{order.status}</Text>
            <Text style={styles.orderItemText}>{order.price} €</Text>

            <View style={[styles.orderItemText, styles.buttonsContainer]}>
              {order.status === Status.ENATTENTE && (
                <TouchableOpacity
                  style={[styles.buttonConfirm, {backgroundColor: 'green'}]}
                  onPress={() => handleConfirm(order.id)}>
                  <Text style={styles.buttonText}>✓</Text>
                </TouchableOpacity>
              )}
              {order.status === Status.ENATTENTE && (
                <TouchableOpacity
                  style={[styles.buttonConfirm, {backgroundColor: 'red'}]}
                  onPress={() => handleDecline(order.id)}>
                  <Text style={styles.buttonText}>✗</Text>
                </TouchableOpacity>
              )}
              {order.status === Status.ENCOURS && (
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: 'orange'}]}
                  onPress={() => handleReady(order.id)}>
                  <Text style={styles.buttonText}>Pret</Text>
                </TouchableOpacity>
              )}
              {order.status === Status.PRET && (
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#03428C'}]}
                  onPress={() => handleCollect(order.id)}>
                  <Text style={styles.buttonText}>Collecte</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.menu}>
        <Button
          title={isOpen ? 'Ouvert' : 'Fermé'}
          onPress={handleOpenClose}
          color={isOpen ? 'green' : 'red'}
        />
        <Text>Affluence ||</Text>
        <Text>RestaurantNom</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 100,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 25,
    height: 25,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  orderItemText: {
    flex: 1,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonConfirm: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default Orders;
