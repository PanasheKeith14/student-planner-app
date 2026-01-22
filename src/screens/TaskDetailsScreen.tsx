import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';

export default function TaskDetailsScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Complete Math Assignment</Text>
          <Text style={styles.label}>Subject: <Text style={styles.value}>Mathematics</Text></Text>
          <Text style={styles.label}>Due Date: <Text style={styles.value}>March 15, 2025</Text></Text>
          <Text style={styles.label}>Priority: <Text style={styles.highPriority}>High</Text></Text>
          <Text style={styles.description}>
            Complete chapters 5-7 exercises. Submit PDF on learning platform.
          </Text>
          <Button mode="contained" style={styles.button}>
            Mark as Complete
          </Button>
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
  highPriority: {
    color: '#FF3D00',
    fontWeight: '600',
  },
  description: {
    color: '#e8eaed',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
});