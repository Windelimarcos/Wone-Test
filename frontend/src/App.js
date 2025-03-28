import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, CircularProgress, Alert, CssBaseline } from '@mui/material';
import WorkoutList from './components/WorkoutList';
import WorkoutDetail from './components/WorkoutDetail';

// Configure the base URL for your FastAPI backend
const API_BASE_URL = 'http://localhost:8000'; // Adjust if your backend runs elsewhere

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState(null);

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
  const handleSelectWorkout = (workoutId) => {
    if (!workoutId) {
      setSelectedWorkout(null);
      return;
    }
    setLoadingDetail(true);
    setDetailError(null);
    setSelectedWorkout(null); // Clear previous detail while loading

    axios.get(`${API_BASE_URL}/workouts/${workoutId}`)
      .then(response => {
        setSelectedWorkout(response.data);
        setLoadingDetail(false);
      })
      .catch(err => {
        console.error(`Error fetching workout detail for ${workoutId}:`, err);
        setDetailError(`Failed to load details for workout ${workoutId}.`);
        setLoadingDetail(false);
      });
  };

  return (
    <>
      <CssBaseline /> {/* Ensures consistent baseline styling */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Workout Viewer
        </Typography>

        {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {!loading && !error && (
          <WorkoutList workouts={workouts} onSelectWorkout={handleSelectWorkout} />
        )}

        {loadingDetail && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />}
        {detailError && <Alert severity="error" sx={{ mt: 2 }}>{detailError}</Alert>}

        {selectedWorkout && !loadingDetail && (
          <WorkoutDetail workout={selectedWorkout} />
        )}
      </Container>
    </>
  );
}

export default App; 