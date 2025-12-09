import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { socket } from '../utils/socket';
import api from '../api/api';

export default function RideRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);

  useEffect(()=> {
    socket.connect();
    socket.emit('join', { type: 'driver', id: DRIVER_ID });

    socket.on('ride-request', (data) => {
      // data: rideId, pickup, drop, vehicleType
      // only show if vehicleType matches
      setRequests(prev => [{ ...data, countdown: 10 }, ...prev]);
    });

    socket.on('accept-result', (res) => {
      // show accept result
    });

    return () => {
      socket.disconnect();
      socket.off('ride-request');
    };
  }, []);

  function tryAccept(rideId) {
    // try via socket for low latency
    socket.emit('driver-try-accept', { rideId, driverId: DRIVER_ID });
  }

  return (
    <View>
      {requests.map(r => (
        <View key={r.rideId}>
          <Text>Pickup: {r.pickup?.address}</Text>
          <Text>Time left: {r.countdown}</Text>
          <Button title="Accept" onPress={()=> tryAccept(r.rideId)} />
        </View>
      ))}
    </View>
  );
}
