import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  LinearProgress,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TimerIcon from '@mui/icons-material/Timer';
import RestTimer from '../components/RestTimer';

function WorkoutExecutionPage({ fetchWorkoutDetail }) {
  const { id, treinoKey } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for workout data
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for workout execution
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [remainingSets, setRemainingSets] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  
  // Decode treino key from URL
  const decodedTreinoKey = decodeURIComponent(treinoKey);
  
  // Load workout data
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchWorkoutDetail(id)
      .then(response => {
        const workoutData = response.data;
        setWorkout(workoutData);
        
        // Get exercises for this treino
        const treinoData = workoutData[decodedTreinoKey];
        if (!treinoData) {
          setError(`Workout day "${decodedTreinoKey}" not found.`);
          setLoading(false);
          return;
        }
        
        // Extract exercises
        const exercisesObj = treinoData['Exercícios'] || {};
        const exercisesArray = Object.entries(exercisesObj).map(([name, details]) => {
          // Parse sets and reps (format is usually "3x12" or similar)
          const setsReps = details['SxR'] || '';
          let sets = 3; // Default
          let reps = 10; // Default
          
          const setsRepsMatch = setsReps.match(/(\d+)\s*x\s*(\d+)/);
          if (setsRepsMatch) {
            sets = parseInt(setsRepsMatch[1], 10);
            reps = parseInt(setsRepsMatch[2], 10);
          }
          
          return {
            name,
            sets,
            reps,
            advancedTechnique: details['Técnica Avançada'] || '',
            originalSets: sets // Keep track of original sets count
          };
        });
        
        // Get rest interval (format is usually "60s" or "45s-60s")
        let restInterval = treinoData['Intervalo de descanso'] || '60s';
        let restSeconds = 60; // Default
        
        const restMatch = restInterval.match(/(\d+)s/);
        if (restMatch) {
          restSeconds = parseInt(restMatch[1], 10);
        }
        
        setRestTime(restSeconds);
        setExercises(exercisesArray);
        
        if (exercisesArray.length > 0) {
          setRemainingSets(exercisesArray[0].sets);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error fetching workout detail for ${id}:`, err);
        setError(`Failed to load details for workout ${id}.`);
        setLoading(false);
      });
  }, [id, decodedTreinoKey, fetchWorkoutDetail]);
  
  // Get current exercise
  const currentExercise = exercises[currentExerciseIndex];
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (exercises.length === 0) return 0;
    
    const totalSets = exercises.reduce((sum, ex) => sum + ex.originalSets, 0);
    const completedExercises = exercises.slice(0, currentExerciseIndex);
    const completedSets = completedExercises.reduce((sum, ex) => sum + ex.originalSets, 0);
    const currentCompleted = currentExercise ? (currentExercise.originalSets - remainingSets) : 0;
    
    return Math.round((completedSets + currentCompleted) / totalSets * 100);
  };
  
  // Handle resting between sets
  const handleStartRest = () => {
    setIsResting(true);
  };
  
  // Handle rest completion
  const handleRestComplete = () => {
    setIsResting(false);
    
    // Decrease remaining sets
    const newRemainingSets = remainingSets - 1;
    setRemainingSets(newRemainingSets);
    
    // If no more sets for this exercise, move to next exercise
    if (newRemainingSets <= 0) {
      const nextExerciseIndex = currentExerciseIndex + 1;
      
      if (nextExerciseIndex < exercises.length) {
        setCurrentExerciseIndex(nextExerciseIndex);
        setRemainingSets(exercises[nextExerciseIndex].sets);
      } else {
        // Workout complete
        setWorkoutComplete(true);
      }
    }
  };
  
  // Handle going back to details
  const handleBackToDetails = () => {
    navigate(`/workout/${id}`);
  };
  
  // Skip current exercise
  const handleSkipExercise = () => {
    const nextExerciseIndex = currentExerciseIndex + 1;
    
    if (nextExerciseIndex < exercises.length) {
      setCurrentExerciseIndex(nextExerciseIndex);
      setRemainingSets(exercises[nextExerciseIndex].sets);
      setIsResting(false);
    } else {
      // Workout complete
      setWorkoutComplete(true);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: isMobile ? 2 : 4, px: isMobile ? 1 : 3, pb: 6 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToDetails}
        sx={{ mb: 2 }}
      >
        Back to Workout Details
      </Button>
      
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {!loading && !error && workout && (
        <>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            align="center" 
            gutterBottom
          >
            {decodedTreinoKey}
          </Typography>
          
          {/* Progress bar */}
          <Box sx={{ mb: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">{calculateProgress()}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={calculateProgress()} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          
          {workoutComplete ? (
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mt: 4 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Workout Complete!
              </Typography>
              <Typography variant="body1" paragraph>
                You've completed all exercises in this workout.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleBackToDetails}
                sx={{ mt: 2 }}
              >
                Back to Workout Details
              </Button>
            </Paper>
          ) : currentExercise ? (
            <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  {currentExercise.name}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-around',
                  flexWrap: 'wrap', 
                  gap: 2,
                  my: 3 
                }}>
                  <Chip 
                    label={`${remainingSets} / ${currentExercise.originalSets} Sets`} 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`${currentExercise.reps} Reps`} 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    icon={<TimerIcon />}
                    label={`${restTime}s Rest`} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                {currentExercise.advancedTechnique && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Advanced Technique:</Typography>
                    <Typography variant="body2">{currentExercise.advancedTechnique}</Typography>
                  </Alert>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                {isResting ? (
                  <RestTimer 
                    duration={restTime} 
                    onComplete={handleRestComplete} 
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      onClick={handleStartRest}
                      fullWidth={isMobile}
                      sx={{ py: 1.5 }}
                    >
                      Complete Set - Start Rest
                    </Button>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mt: 2 
                    }}>
                      <Button 
                        variant="text" 
                        color="inherit" 
                        size="small"
                        onClick={handleSkipExercise}
                        endIcon={<NavigateNextIcon />}
                      >
                        Skip Exercise
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          ) : (
            <Alert severity="warning">No exercises found in this workout.</Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default WorkoutExecutionPage; 