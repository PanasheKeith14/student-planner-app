import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Modal } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function AttendanceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [attendance, setAttendance] = useState({
    overall: 85,
    present: 34,
    total: 40,
  });

  const cameraRef = useRef<any>(null);

  // Request permission if needed
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    // Update attendance
    const newPresent = attendance.present + 1;
    const newOverall = Math.round((newPresent / attendance.total) * 100);
    
    setAttendance({
      overall: newOverall,
      present: newPresent,
      total: attendance.total,
    });
    
    Alert.alert(
      '✅ Attendance Marked!',
      `QR Type: ${type}\nData: ${data}\n\nNew attendance: ${newPresent}/${attendance.total} (${newOverall}%)`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            setScanned(false);
            setShowCamera(false);
          }
        }
      ]
    );
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to scan QR codes.');
        return;
      }
    }
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
    setScanned(false);
  };

  const takeTestPhoto = () => {
    Alert.alert(
      'Camera Test',
      'Camera is working! In real usage, point at a QR code to scan.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Overall Attendance</Text>
          <Text style={styles.percentage}>{attendance.overall}%</Text>
          <Text style={styles.cardText}>
            Present: {attendance.present}/{attendance.total} classes
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.weekContainer}>
            {['M', 'T', 'W', 'T', 'F'].map((day, index) => (
              <View key={index} style={styles.day}>
                <Text style={styles.dayText}>{day}</Text>
                <View style={[styles.status, index < 4 ? styles.present : styles.absent]} />
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>QR Code Scanner</Text>
          <Text style={styles.cardText}>
            Use camera to scan QR codes (Camera sensor working)
          </Text>
          
          <Button 
            mode="contained" 
            style={styles.scanButton} 
            icon="camera"
            onPress={openCamera}
          >
            Open Camera Scanner
          </Button>
          
          <Text style={styles.instruction}>
            Point camera at any QR code to test
          </Text>
        </Card.Content>
      </Card>

      {/* SIMPLE CAMERA MODAL */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={closeCamera}
      >
        <View style={styles.cameraContainer}>
          <View style={styles.cameraHeader}>
            <Text style={styles.cameraTitle}>QR Code Scanner</Text>
            <Button 
              icon="close" 
              onPress={closeCamera}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
          
          {permission?.granted ? (
            <View style={styles.cameraWrapper}>
              <CameraView
                style={styles.camera}
                facing="back"
                ref={cameraRef}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              />
              
              <View style={styles.overlay}>
                <View style={styles.scanFrame}>
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                </View>
                <Text style={styles.scanText}>Align QR code within frame</Text>
              </View>
              
              <View style={styles.cameraControls}>
                <Button 
                  mode="contained" 
                  onPress={takeTestPhoto}
                  style={styles.testButton}
                >
                  Test Camera
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={closeCamera}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.permissionView}>
              <Text style={styles.permissionTitle}>Camera Access Required</Text>
              <Button 
                mode="contained" 
                onPress={requestPermission}
                style={styles.permissionButton}
              >
                Allow Camera Access
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </View>
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
  percentage: {
    color: '#4c9aff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  cardText: {
    color: '#a8b0bd',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  day: {
    alignItems: 'center',
  },
  dayText: {
    color: '#e8eaed',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  status: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  present: {
    backgroundColor: '#00C853',
  },
  absent: {
    backgroundColor: '#FF3D00',
  },
  scanButton: {
    marginTop: 12,
    backgroundColor: '#4c9aff',
  },
  instruction: {
    color: '#FFD600',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a2235',
  },
  cameraTitle: {
    color: '#e8eaed',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    margin: 0,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4c9aff',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  testButton: {
    backgroundColor: '#4c9aff',
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
  },
  permissionView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#0f1420',
  },
  permissionTitle: {
    color: '#e8eaed',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#4c9aff',
    paddingHorizontal: 30,
  },
});