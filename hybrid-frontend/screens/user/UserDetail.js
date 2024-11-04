import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const UserDetail = () => {
  const route = useRoute();
  const { id } = route.params;
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'Error fetching user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [id]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const checkFriendship = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const currentUser = JSON.parse(await AsyncStorage.getItem('current_user'));
        const userId = currentUser ? currentUser.id : null;

        if (!userId || !id) return;

        const response = await axios.get(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const isFriend = response.data.some(friend => friend.id === parseInt(id));
        setIsFriend(isFriend);
      } catch (error) {
        console.error('Error checking friendship status:', error);
      }
    };
    checkFriendship();
  }, [id]);

  const handleAddFriend = async (friendId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const currentUser = JSON.parse(await AsyncStorage.getItem('current_user'));
      const userId = currentUser ? currentUser.id : null;

      if (!userId || !friendId) return;

      const response = await axios.post(
        `http://localhost:3001/api/v1/users/${friendId}/friendships`,
        { user_id: userId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Amigo agregado:', response.data);
      setIsFriend(true);
      Alert.alert('Success', 'Amigo agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      Alert.alert('Error', 'Error al agregar amigo');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const currentUser = JSON.parse(await AsyncStorage.getItem('current_user'));
      const userId = currentUser ? currentUser.id : null;

      if (!userId || !friendId) return;

      const response = await axios.delete(
        `http://localhost:3001/api/v1/users/${friendId}/friendships`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          data: { user_id: userId },
        }
      );

      console.log('Amigo eliminado:', response.data);
      setIsFriend(false);
      Alert.alert('Success', 'Amigo eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
      Alert.alert('Error', 'Error al eliminar amigo');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Text style={styles.errorText}>User not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.text}>Handle: {user.handle}</Text>
        <Text style={styles.text}>Email: {user.email}</Text>
        <Text style={styles.text}>Age: {user.age}</Text>
        <Text style={styles.text}>ID: {user.id}</Text>

        <Picker
          selectedValue={selectedEvent}
          onValueChange={(value) => setSelectedEvent(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Event" value="" />
          {events.map((event) => (
            <Picker.Item key={event.id} label={`${event.name} - ${event.date}`} value={event.id} />
          ))}
        </Picker>

        <Button
          title={isFriend ? "Remove Friend" : "Add Friend"}
          onPress={() => isFriend ? handleRemoveFriend(user.id) : handleAddFriend(user.id)}
          color={isFriend ? "red" : "blue"}
          disabled={!selectedEvent}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UserDetail;
