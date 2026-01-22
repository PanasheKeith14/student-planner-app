import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput label="Full Name" mode="outlined" style={styles.input} />
      <TextInput label="Email" mode="outlined" style={styles.input} />
      <TextInput label="Password" mode="outlined" secureTextEntry style={styles.input} />
      <TextInput label="Confirm Password" mode="outlined" secureTextEntry style={styles.input} />
      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => navigation.navigate('AppTabs' as never)}
      >
        Register
      </Button>
      <Button 
        mode="outlined" 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        Back to Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#0f1420',
  },
  title: {
    color: '#e8eaed',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#1a2235',
  },
  button: {
    marginTop: 10,
  },
});