import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CircularProgress, 
  Alert, 
  Button, 
  Container, 
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  Fab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WorkoutDetail from '../components/WorkoutDetail';

function WorkoutDetailPage({ fetchWorkoutDetail }) {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Find current day of week to determine which workout to start
  const getCurrentDayWorkout = () => {
    if (!workout) return null;
    
    const daysOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const currentDay = daysOfWeek[new Date().getDay()].toLowerCase();
    
    // Find the workout that matches today's day
    const treinoDays = Object.keys(workout)
      .filter(key => key.startsWith('Treino '));
      
    for (const treinoKey of treinoDays) {
      const treinoData = workout[treinoKey];
      const treinoDays = treinoData['Dia'] || [];
      
      // Check if any of the days match the current day
      const matchesDay = treinoDays.some(day => 
        day.toLowerCase().includes(currentDay)
      );
      
      if (matchesDay) {
        return { key: treinoKey, data: treinoData };
      }
    }
    
    // If no workout for today, return the first workout
    if (treinoDays.length > 0) {
      const firstKey = treinoDays[0];
      return { key: firstKey, data: workout[firstKey] };
    }
    
    return null;
  };

  const handleStartWorkout = () => {
    const currentWorkout = getCurrentDayWorkout();
    if (currentWorkout) {
      navigate(`/workout/${id}/execute/${encodeURIComponent(currentWorkout.key)}`);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchWorkoutDetail(id)
      .then(response => {
        setWorkout(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error fetching workout detail for ${id}:`, err);
        setError(`Failed to load details for workout ${id}.`);
        setLoading(false);
      });
  }, [id, fetchWorkoutDetail]);
  
  // Get the current day's workout
  const todayWorkout = workout ? getCurrentDayWorkout() : null;

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, px: isMobile ? 1 : 3, pb: 10 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Workouts
      </Button>
      
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {workout && !loading && (
        <>
          <WorkoutDetail workout={workout} />
          
          {todayWorkout && (
            <Box 
              sx={{ 
                position: 'fixed', 
                bottom: 20, 
                right: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000 
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: 3,
                  p: 2
                }}
              >
                <Typography variant="body2" gutterBottom sx={{ color: 'white' }}>
                  Start today's workout: {todayWorkout.key}
                </Typography>
                <Fab
                  color="primary"
                  aria-label="start workout"
                  onClick={handleStartWorkout}
                  sx={{ mt: 1 }}
                >
                  <PlayArrowIcon />
                </Fab>
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default WorkoutDetailPage; 