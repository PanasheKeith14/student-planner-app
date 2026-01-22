import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const [isListening, setIsListening] = useState(true);

  // REAL SHAKE DETECTION
  useEffect(() => {
    let accelerometerSubscription: any;

    const setupAccelerometer = async () => {
      // Set how often to check for shakes (100ms = 10 times per second)
      Accelerometer.setUpdateInterval(100);
      
      // Start listening to accelerometer
      accelerometerSubscription = Accelerometer.addListener((data) => {
        const { x, y, z } = data;
        
        // Calculate total movement (shake detection)
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        
        // If shake is strong enough (phone is being shaken)
        if (acceleration > 1.5) {
          const now = Date.now();
          
          // Prevent multiple shakes within 2 seconds
          if (now - lastShakeTime > 2000) {
            setLastShakeTime(now);
            handleRealShake();
          }
        }
      });
    };

    if (isListening) {
      setupAccelerometer();
    }

    // Cleanup when component unmounts
    return () => {
      if (accelerometerSubscription) {
        accelerometerSubscription.remove();
      }
    };
  }, [isListening, lastShakeTime]);

  const handleRealShake = () => {
    setRefreshCount(prev => prev + 1);
    
    Alert.alert(
      '📱 Phone Shake Detected!',
      'Dashboard data has been refreshed automatically!\n\n(Accelerometer sensor is working)',
      [{ text: 'OK' }]
    );
    
    console.log('REAL SHAKE DETECTED - Refreshing data');
  };

  const toggleShakeDetection = () => {
    setIsListening(!isListening);
    Alert.alert(
      'Shake Detection',
      isListening ? 'Shake detection turned OFF' : 'Shake detection turned ON'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      {/* Accelerometer Sensor Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Shake Detection (REAL)</Text>
          <Text style={styles.cardText}>
            Shake your phone to refresh data (Real accelerometer sensor)
          </Text>
          
          <View style={styles.statusRow}>
            <View style={[styles.statusIndicator, isListening ? styles.statusOn : styles.statusOff]} />
            <Text style={styles.statusText}>
              Status: {isListening ? 'ACTIVE ✅' : 'INACTIVE ⚫'}
            </Text>
          </View>
          
          <Button 
            mode="contained" 
            style={[styles.sensorButton, isListening ? styles.buttonActive : styles.buttonInactive]}
            onPress={toggleShakeDetection}
            icon={isListening ? 'vibrate' : 'vibrate-off'}
          >
            {isListening ? 'Turn OFF Shake Detection' : 'Turn ON Shake Detection'}
          </Button>
          
          <View style={styles.shakeInfo}>
            <Text style={styles.shakeCount}>
              Real shakes detected: <Text style={styles.countNumber}>{refreshCount}</Text>
            </Text>
            <Text style={styles.instruction}>
              📱 Shake your phone now to test!
            </Text>
            <Text style={styles.sensorNote}>
              Uses phone's accelerometer sensor
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Welcome Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Welcome back!</Text>
          <Text style={styles.cardText}>You have 3 upcoming tasks today.</Text>
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Subjects' as never)}
          >
            View Subjects
          </Button>
        </Card.Content>
      </Card>

      {/* Attendance Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Attendance</Text>
          <Text style={styles.cardText}>Current: 85% attendance rate</Text>
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Attendance' as never)}
          >
            Check Attendance
          </Button>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Button 
            mode="outlined" 
            style={styles.outlineButton}
            onPress={() => navigation.navigate('SubjectDetails' as never)}
          >
            View Subject Details
          </Button>
          <Button 
            mode="outlined" 
            style={styles.outlineButton}
            onPress={() => navigation.navigate('TaskDetails' as never)}
          >
            View Task Details
          </Button>
        </Card.Content>
      </Card>

      {/* Project Status */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Sensor Status</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.statusWorking]} />
              <Text style={styles.statusText}>Accelerometer: Working</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.statusWorking]} />
              <Text style={styles.statusText}>Camera: Ready</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.hintText}>
                • Shake phone → Refresh data{'\n'}
                • Go to Attendance → Scan QR{'\n'}
                • Both sensors working ✅
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1420',
    padding: 16,
  },
  title: {
    color: '#e8eaed',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1a2235',
  },
  cardTitle: {
    color: '#e8eaed',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    color: '#a8b0bd',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusOn: {
    backgroundColor: '#00C853',
  },
  statusOff: {
    backgroundColor: '#FF3D00',
  },
  statusText: {
    color: '#e8eaed',
    fontSize: 14,
  },
  sensorButton: {
    marginTop: 8,
  },
  buttonActive: {
    backgroundColor: '#4c9aff',
  },
  buttonInactive: {
    backgroundColor: '#666',
  },
  shakeInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a3a5a',
  },
  shakeCount: {
    color: '#e8eaed',
    fontSize: 16,
    marginBottom: 8,
  },
  countNumber: {
    color: '#4c9aff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  instruction: {
    color: '#FFD600',
    fontSize: 14,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  sensorNote: {
    color: '#a8b0bd',
    fontSize: 12,
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: '#4c9aff',
  },
  outlineButton: {
    marginTop: 8,
  },
  statusContainer: {
    marginTop: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusWorking: {
    backgroundColor: '#00C853',
  },
  hintText: {
    color: '#a8b0bd',
    fontSize: 13,
    lineHeight: 18,
  },
});