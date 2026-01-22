import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

export default function SubjectDetailsScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Mathematics Details</Text>
          <Text style={styles.label}>Code: <Text style={styles.value}>MATH101</Text></Text>
          <Text style={styles.label}>Instructor: <Text style={styles.value}>Dr. Smith</Text></Text>
          <Text style={styles.label}>Schedule: <Text style={styles.value}>Mon, Wed 10:00 AM</Text></Text>
          <Text style={styles.label}>Room: <Text style={styles.value}>Building A, Room 302</Text></Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1420',
    padding: 16,
  },
  card: {
    backgroundColor: '#1a2235',
  },
  title: {
    color: '#e8eaed',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: '#a8b0bd',
    fontSize: 16,
    marginBottom: 8,
  },
  value: {
    color: '#e8eaed',
    fontWeight: '600',
  },
});