/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {Button, RefreshControl, TextInput} from 'react-native';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Context from '../components/Context';
const {backendUrl} = require('../config.ts');

enum Status {
  ENATTENTE = 'PENDING',
  ENCOURS = 'IN_PROGRESS',
  PRET = 'READY',
  COLLECTE = 'COMPLETED',
}

const Orders = ({route}) => {
  const {token} = route.params;
  const {RestaurantId} = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [noOrders, setNoOrders] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [clientNames, setClientNames] = useState({});
  const [affluenceModalVisible, setAffluenceModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Affluence');
  const [buttonColor, setButtonColor] = useState('blue');
  const [clientNamesFetched, setClientNamesFetched] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [codeInputs, setCodeInputs] = useState(['', '', '', '']);

  const fetchData = async () => {
    try {
      setNoOrders(false);
      const response = await axios.get(
        `${backendUrl}/order/restaurant/${RestaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const fetchedOrders = response.data.orders;
      if (!fetchedOrders) {
        setNoOrders(true);
        return;
      }
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateAffluence = async (level: string) => {
    try {
      await axios.patch(
        `${backendUrl}/restaurant/affluence/${RestaurantId}/${level}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error('Error updating affluence:', error);
    }
  };

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Set interval to fetch data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, [RestaurantId, token]);

  useEffect(() => {
    if (!clientNamesFetched && orders.length > 0) {
      const fetchClientNames = async () => {
        const newClientNames = {...clientNames};

        for (const order of orders) {
          if (!newClientNames[order.clientId]) {
            try {
              const response = await axios.get(
                `${backendUrl}/client/${order.clientId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              newClientNames[order.clientId] =
                response.data.body.firstName +
                ' ' +
                response.data.body.lastName;
            } catch (error) {
              console.error('Error fetching client name:', error);
            }
          }
        }

        setClientNames(newClientNames);
        setClientNamesFetched(true);
      };

      fetchClientNames();
    }
  }, [clientNamesFetched, orders, token]);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const name = await fetchRestaurantName(RestaurantId);
        setRestaurantName(name);
      } catch (error) {
        console.error('Error fetching restaurant name:', error);
      }
    };

    fetchName();
  }, [RestaurantId, token]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Fetch your data here, for example, by calling a function to fetch orders
    fetchData().then(() => setRefreshing(false));
  }, []);

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

  const handleAffluencePress = () => {
    setAffluenceModalVisible(true);
  };

  const handleAffluence = option => {
    setSelectedOption(option);

    switch (option) {
      case 'LOW':
        setButtonColor('green');
        break;
      case 'MODERATE':
        setButtonColor('orange');
        break;
      case 'HIGH':
        setButtonColor('red');
        break;
      default:
        setButtonColor('blue');
    }

    updateAffluence(option);

    setAffluenceModalVisible(false);
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

  const handleDecline = async orderId => {
    try {
      const response = await axios.patch(
        `${backendUrl}/order/complete/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Failed to delete order', error);
    }
  };

  const handleReady = async orderId => {
    try {
      const response = await axios.patch(
        `${backendUrl}/order/ready/${orderId}`,
        {
          status: Status.PRET,
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
              status: Status.PRET,
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

  const handleCollect = async orderId => {
    setCodeModalVisible(true);
    const confirmationCode = codeInputs.join('');
    try {
      const response = await axios.post(
        `${backendUrl}/order/pick/${orderId}/${confirmationCode}`,
        {},
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
              status: Status.COLLECTE,
            };
          } else {
            return order;
          }
        });

        setOrders(updatedOrders);
        setCodeModalVisible(false);
      }
    } catch (error) {
      console.error('Failed to pick order:', error);
    }
  };

  const handleCodeSubmit = () => {
    // Combine the input values to form the confirmation code
    const code = codeInputs.join('');
    // Handle the code submission, e.g., validate against a stored code
    console.log('Confirmation Code:', code);
    // Close the modal
    setCodeModalVisible(false);
    // Clear the input fields
    setCodeInputs(['', '', '', '']);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/order_image.jpg')}
        style={styles.headerImage}
      />
      {clientNamesFetched ? (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
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
          {orders.length > 0 ? (
            orders.map((order: any, index: number) => (
              <View key={index} style={styles.orderItem}>
                <Text style={styles.orderItemText}>{order.id}</Text>
                <Text style={styles.orderItemText}>
                  {clientNames[order.clientId]}
                </Text>
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
            ))
          ) : noOrders ? (
            <Text style={{color: 'black'}}>NO ORDERS !</Text>
          ) : (
            Array.from({length: 8}).map((_, index: number) => (
              <View key={index} style={styles.orderItem}>
                {/* Affichage durant le chargement */}
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      )}
      <View style={styles.menu}>
        <Button
          title={isOpen ? 'Ouvert' : 'Fermé'}
          onPress={handleOpenClose}
          color={isOpen ? 'green' : 'red'}
        />
        <Button
          title={selectedOption}
          onPress={handleAffluencePress}
          color={buttonColor}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={affluenceModalVisible}
          onRequestClose={() => {
            setAffluenceModalVisible(!affluenceModalVisible);
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
              <Text style={{fontSize: 20, marginBottom: 20}}>
                Sélectionnez votre affluence
              </Text>
              <TouchableOpacity
                // eslint-disable-next-line react-native/no-inline-styles
                style={[styles.affulenceButton, {backgroundColor: 'green'}]}
                onPress={() => handleAffluence('LOW')}>
                <Text style={{color: 'white'}}>LOW</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.affulenceButton, {backgroundColor: 'orange'}]}
                onPress={() => handleAffluence('MODERATE')}>
                <Text style={{color: 'white'}}>MODERATE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.affulenceButton, {backgroundColor: 'red'}]}
                onPress={() => handleAffluence('HIGH')}>
                <Text style={{color: 'white'}}>HIGH</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exitButton}
                onPress={() => setAffluenceModalVisible(false)}>
                <Text style={{color: 'white'}}>EXIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text>{restaurantName}</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={codeModalVisible}
        onRequestClose={() => {
          setCodeModalVisible(!codeModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Confirmation Code:</Text>
            <View style={styles.codeInputContainer}>
              {codeInputs.map((input, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInput}
                  onChangeText={text => {
                    const newInputs = [...codeInputs];
                    newInputs[index] = text;
                    setCodeInputs(newInputs);
                  }}
                  value={input}
                  maxLength={1}
                  keyboardType="numeric"
                />
              ))}
            </View>
            <Button title="Submit" onPress={handleCodeSubmit} />
          </View>
        </View>
      </Modal>
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
  affulenceButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  exitButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  codeInput: {
    borderColor: 'gray',
    borderWidth: 1,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 24,
    borderRadius: 5,
  },
});

export default Orders;
