import React, {useState} from 'react';
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

/* DATA WITHOUT CONNECTING TO DB */
enum Status {
  ENATTENTE = 'En Attente',
  ENCOURS = 'En Cours',
  PRET = 'Pret',
  COLLECTE = 'Collecté',
}

const initialOrders = [
  {
    order_id: 13865835,
    client_name: 'Abou',
    statut: Status.ENATTENTE,
    price: 10,
  },
  {order_id: 23543545, client_name: 'Lyna', statut: Status.ENCOURS, price: 15},
  {order_id: 53526256, client_name: 'Léo', statut: Status.PRET, price: 20},
  {order_id: 87875576, client_name: 'Joumana', statut: Status.PRET, price: 20},
  {order_id: 79808675, client_name: 'STL', statut: Status.ENATTENTE, price: 8},
];
/* TO DELETE */

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [isOpen, setIsOpen] = useState(true);

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

  const handleConfirm = orderId => {
    const updatedOrders = orders.map(order => {
      if (order.order_id === orderId) {
        return {
          ...order,
          statut: Status.ENCOURS,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  const handleDecline = orderId => {
    const updatedOrders = orders.filter(order => order.order_id !== orderId);
    setOrders(updatedOrders);
  };

  const handleReady = orderId => {
    const updatedOrders = orders.map(order => {
      if (order.order_id === orderId) {
        return {
          ...order,
          statut: Status.PRET,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  const handleCollect = orderId => {
    const updatedOrders = orders.map(order => {
      if (order.order_id === orderId) {
        return {
          ...order,
          statut: Status.COLLECTE,
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
        {orders.map(order => (
          <View key={order.order_id} style={styles.orderItem}>
            <Text style={styles.orderItemText}>{order.order_id}</Text>
            <Text style={styles.orderItemText}>{order.client_name}</Text>
            <Text style={styles.orderItemText}>{order.statut}</Text>
            <Text style={styles.orderItemText}>{order.price} €</Text>

            <View style={[styles.orderItemText, styles.buttonsContainer]}>
              {order.statut === Status.ENATTENTE && (
                <TouchableOpacity
                  style={[styles.buttonConfirm, {backgroundColor: 'green'}]}
                  onPress={() => handleConfirm(order.order_id)}>
                  <Text style={styles.buttonText}>✓</Text>
                </TouchableOpacity>
              )}
              {order.statut === Status.ENATTENTE && (
                <TouchableOpacity
                  style={[styles.buttonConfirm, {backgroundColor: 'red'}]}
                  onPress={() => handleDecline(order.order_id)}>
                  <Text style={styles.buttonText}>✗</Text>
                </TouchableOpacity>
              )}
              {order.statut === Status.ENCOURS && (
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: 'orange'}]}
                  onPress={() => handleReady(order.order_id)}>
                  <Text style={styles.buttonText}>Pret</Text>
                </TouchableOpacity>
              )}
              {order.statut === Status.PRET && (
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#03428C'}]}
                  onPress={() => handleCollect(order.order_id)}>
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
