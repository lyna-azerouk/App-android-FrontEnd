// add later for pop up confirmation code
const handleCollect = (orderId: number) => {
    Alert.prompt(
      'Code Confirmation',
      'Please enter the confirmation code:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: code => {
            if (code === 'expected confirmation code') {
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
            } else {
              Alert.alert(
                'Invalid code',
                'The confirmation code you entered is invalid.',
              );
            }
          },
        },
      ],
      'plain-text',
    );
  };