import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import MapView from 'react-native-maps';
import api from '../api/api';

export default function MapBookingScreen({ navigation }) {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [distanceKm, setDistanceKm] = useState(2.5);
  const [vehicleType, setVehicleType] = useState('bike');

  async function onConfirm() {
    const res = await api.post('/ride/request', { pickup, drop, distanceKm, vehicleType });
    const { ride, fareData } = res.data;
    navigation.navigate('BookingConfirm', { rideId: ride._id, fareData });
  }

  return (
    <View style={{flex:1}}>
      <MapView style={{flex:1}} />
      <View style={{padding:10}}>
        <Text>Pickup: ...</Text>
        <Text>Drop: ...</Text>
        <Button title="Confirm Booking" onPress={onConfirm} />
      </View>
    </View>
  );
}
