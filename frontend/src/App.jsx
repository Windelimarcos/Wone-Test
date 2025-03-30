import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CssBaseline,
  useMediaQuery 
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import theme
import darkTheme from './theme/darkTheme';

// Import pages
import WorkoutsListPage from './pages/WorkoutsListPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import WorkoutExecutionPage from './pages/WorkoutExecutionPage';

// Configure the base URL for your FastAPI backend
const API_BASE_URL = 'http://localhost:8000'; // Adjust if your backend runs elsewhere

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));

  // Fetch the list of workouts on component mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get(`${API_BASE_URL}/workouts`)
      .then(response => {
        setWorkouts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching workout list:", err);
        setError('Failed to load workout list. Is the backend running?');
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch details for a selected workout
  const fetchWorkoutDetail = (workoutId) => {
    return axios.get(`${API_BASE_URL}/workouts/${workoutId}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Ensures consistent baseline styling */}
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <WorkoutsListPage 
                workouts={workouts} 
                loading={loading} 
                error={error} 
              />
            } 
          />
          <Route 
            path="/workout/:id" 
            element={<WorkoutDetailPage fetchWorkoutDetail={fetchWorkoutDetail} />} 
          />
          <Route 
            path="/workout/:id/execute/:treinoKey" 
            element={<WorkoutExecutionPage fetchWorkoutDetail={fetchWorkoutDetail} />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 