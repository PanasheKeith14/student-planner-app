const API_BASE = 'https://697181d878fec16a630108bb.mockapi.io/subjects';

export type Subject = {
  id: string;
  name: string;
  code: string;
  instructor: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  subjectId: string;
};

// Test if API is reachable
export const testAPI = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/subjects`);
    console.log('API Test response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('API Test error:', error);
    return false;
  }
};

// GET - Fetch all subjects
export const getSubjects = async (): Promise<Subject[]> => {
  try {
    console.log('GET: Fetching subjects from', `${API_BASE}/subjects`);
    const response = await fetch(`${API_BASE}/subjects`);
    console.log('GET Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('GET Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('GET Success:', data.length, 'subjects');
    return data;
  } catch (error) {
    console.error('GET Error details:', error);
    // Return mock data for development
    return [
      { id: '1', name: 'Mathematics', code: 'MATH101', instructor: 'Dr. Smith', createdAt: new Date().toISOString() },
      { id: '2', name: 'Physics', code: 'PHY102', instructor: 'Prof. Johnson', createdAt: new Date().toISOString() },
    ];
  }
};

// POST - Create new subject
export const createSubject = async (subjectData: Omit<Subject, 'id' | 'createdAt'>): Promise<Subject | null> => {
  try {
    console.log('POST: Creating subject:', subjectData);
    
    const response = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: subjectData.name,
        code: subjectData.code,
        instructor: subjectData.instructor || 'To be assigned',
      }),
    });
    
    console.log('POST Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('POST Error response:', errorText);
      
      // If API fails, return mock data for development
      console.log('Using mock response for development');
      return {
        id: Date.now().toString(),
        ...subjectData,
        createdAt: new Date().toISOString(),
      };
    }
    
    const data = await response.json();
    console.log('POST Success:', data);
    return data;
  } catch (error) {
    console.error('POST Error details:', error);
    
    // Return mock data if API fails
    return {
      id: Date.now().toString(),
      ...subjectData,
      createdAt: new Date().toISOString(),
    };
  }
};

// PUT - Update subject
export const updateSubject = async (id: string, updates: Partial<Subject>): Promise<Subject | null> => {
  try {
    console.log('PUT: Updating subject', id, 'with:', updates);
    
    const response = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    console.log('PUT Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('PUT Error response:', errorText);
      
      // Mock response for development
      console.log('Using mock response for development');
      return {
        id,
        name: updates.name || 'Updated Subject',
        code: updates.code || 'CODE101',
        instructor: updates.instructor || 'Updated Instructor',
        createdAt: new Date().toISOString(),
      };
    }
    
    const data = await response.json();
    console.log('PUT Success:', data);
    return data;
  } catch (error) {
    console.error('PUT Error details:', error);
    
    // Mock response if API fails
    return {
      id,
      name: updates.name || 'Updated Subject',
      code: updates.code || 'CODE101',
      instructor: updates.instructor || 'Updated Instructor',
      createdAt: new Date().toISOString(),
    };
  }
};

// GET - Fetch all tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('GET Tasks Error:', error);
    return [];
  }
};