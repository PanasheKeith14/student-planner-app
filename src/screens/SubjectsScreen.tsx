import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Card, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { getSubjects, createSubject, updateSubject, testAPI, Subject } from '../services/api';

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  // Test API connection on mount
  useEffect(() => {
    checkAPI();
    fetchSubjects();
  }, []);

  const checkAPI = async () => {
    const connected = await testAPI();
    setApiConnected(connected);
    console.log('API Connected:', connected);
  };

  // GET - Fetch subjects
  const fetchSubjects = async () => {
    setLoading(true);
    const data = await getSubjects();
    setSubjects(data);
    setLoading(false);
  };

  // POST - Create new subject
  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !newSubjectCode.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setAdding(true);
    const newSubject = await createSubject({
      name: newSubjectName.trim(),
      code: newSubjectCode.trim().toUpperCase(),
      instructor: 'To be assigned',
    });

    if (newSubject) {
      // Add to beginning of list
      setSubjects([newSubject, ...subjects]);
      setNewSubjectName('');
      setNewSubjectCode('');
      Alert.alert('Success', 'Subject added successfully!');
      
      // Refresh list to show real data if API is working
      if (apiConnected) {
        fetchSubjects();
      }
    } else {
      Alert.alert('Error', 'Failed to add subject');
    }
    setAdding(false);
  };

  // PUT - Mark as favorite
  const toggleFavorite = async (subject: Subject) => {
    Alert.alert(
      'PUT Request Example',
      `This would update subject "${subject.name}" via PUT request.\n\nIn a real app, this would send: PUT /subjects/${subject.id} with updated data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate PUT', 
          onPress: async () => {
            const updated = await updateSubject(subject.id, {
              instructor: 'Favorite Teacher',
            });
            
            if (updated) {
              // Update in local state
              setSubjects(subjects.map(s => 
                s.id === subject.id ? { ...s, instructor: 'Favorite Teacher' } : s
              ));
              Alert.alert('Success', 'Subject marked as favorite (PUT simulated)');
            }
          }
        }
      ]
    );
  };

  // Refresh subjects
  const handleRefresh = () => {
    fetchSubjects();
    checkAPI();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Subjects</Text>

      {/* API Status */}
      <Card style={styles.statusCard}>
        <Card.Content>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>API Status:</Text>
            <View style={[
              styles.statusIndicator, 
              apiConnected === null ? styles.statusUnknown : 
              apiConnected ? styles.statusConnected : styles.statusDisconnected
            ]} />
            <Text style={[
              styles.statusText,
              apiConnected === null ? styles.statusUnknownText :
              apiConnected ? styles.statusConnectedText : styles.statusDisconnectedText
            ]}>
              {apiConnected === null ? 'Checking...' : apiConnected ? 'Connected' : 'Using Mock Data'}
            </Text>
          </View>
          <Button 
            mode="outlined" 
            onPress={handleRefresh}
            icon="refresh"
            style={styles.refreshButton}
          >
            Refresh Data
          </Button>
        </Card.Content>
      </Card>

      {/* POST Example Form */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.formTitle}>Add New Subject (POST Example)</Text>
          <TextInput
            label="Subject Name"
            value={newSubjectName}
            onChangeText={setNewSubjectName}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                primary: '#4c9aff',
                text: '#e8eaed',
                placeholder: '#a8b0bd',
                background: 'transparent',
              }
            }}
            outlineColor="#2a3a5a"
            activeOutlineColor="#4c9aff"
            textColor="#e8eaed"
            placeholderTextColor="#a8b0bd"
          />
          <TextInput
            label="Subject Code"
            value={newSubjectCode}
            onChangeText={setNewSubjectCode}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                primary: '#4c9aff',
                text: '#e8eaed',
                placeholder: '#a8b0bd',
                background: 'transparent',
              }
            }}
            outlineColor="#2a3a5a"
            activeOutlineColor="#4c9aff"
            textColor="#e8eaed"
            placeholderTextColor="#a8b0bd"
          />
          <Button 
            mode="contained" 
            onPress={handleAddSubject}
            loading={adding}
            disabled={adding}
            style={styles.addButton}
          >
            {adding ? 'Adding...' : 'Add Subject (POST)'}
          </Button>
          <Text style={styles.apiNote}>
            Note: Uses POST method to create new resource
          </Text>
        </Card.Content>
      </Card>

      {/* GET Example - Display subjects */}
      <Text style={styles.sectionTitle}>Current Subjects (GET Example)</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4c9aff" />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      ) : subjects.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>No subjects yet. Add one above!</Text>
            <Text style={styles.emptySubtext}>
              This list is fetched using GET method
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card style={styles.subjectCard}>
              <Card.Content>
                <View style={styles.subjectHeader}>
                  <View>
                    <Text style={styles.subjectName}>{item.name}</Text>
                    <Text style={styles.subjectCode}>{item.code}</Text>
                  </View>
                  <View style={styles.apiBadge}>
                    <Text style={styles.apiBadgeText}>GET</Text>
                  </View>
                </View>
                <Text style={styles.subjectInstructor}>Instructor: {item.instructor}</Text>
                <Text style={styles.subjectDate}>
                  Added: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                {/* PUT Example Button */}
                <Button 
                  mode="outlined" 
                  style={styles.favButton}
                  onPress={() => toggleFavorite(item)}
                  icon="star-outline"
                >
                  Mark as Favorite (PUT Example)
                </Button>
              </Card.Content>
            </Card>
          )}
          ListFooterComponent={
            <Text style={styles.footerText}>
              Showing {subjects.length} subject(s){'\n'}
              API Methods demonstrated: GET, POST, PUT
            </Text>
          }
        />
      )}
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
    marginBottom: 16,
  },
  statusCard: {
    marginBottom: 20,
    backgroundColor: '#1a2235',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    color: '#e8eaed',
    fontSize: 14,
    marginRight: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusConnected: {
    backgroundColor: '#00C853',
  },
  statusDisconnected: {
    backgroundColor: '#FF3D00',
  },
  statusUnknown: {
    backgroundColor: '#FFB300',
  },
  statusConnectedText: {
    color: '#00C853',
  },
  statusDisconnectedText: {
    color: '#FF3D00',
  },
  statusUnknownText: {
    color: '#FFB300',
  },
  refreshButton: {
    marginTop: 5,
  },
  formCard: {
    marginBottom: 20,
    backgroundColor: '#1a2235',
  },
  formTitle: {
    color: '#e8eaed',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#0f1420',
  },
  addButton: {
    marginTop: 8,
  },
  apiNote: {
    color: '#a8b0bd',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#e8eaed',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#a8b0bd',
    marginTop: 12,
  },
  emptyCard: {
    backgroundColor: '#1a2235',
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#e8eaed',
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#a8b0bd',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  subjectCard: {
    marginBottom: 12,
    backgroundColor: '#1a2235',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  subjectName: {
    color: '#e8eaed',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subjectCode: {
    color: '#4c9aff',
    fontSize: 14,
    marginTop: 2,
  },
  apiBadge: {
    backgroundColor: '#4c9aff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  apiBadgeText: {
    color: '#0f1420',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subjectInstructor: {
    color: '#a8b0bd',
    fontSize: 14,
    marginTop: 4,
  },
  subjectDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  favButton: {
    marginTop: 8,
  },
  footerText: {
    color: '#a8b0bd',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    lineHeight: 18,
  },
});