import React from 'react';
import { 
  Typography, 
  CircularProgress, 
  Alert, 
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import WorkoutList from '../components/WorkoutList';

function WorkoutsListPage({ workouts, loading, error }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, px: isMobile ? 1 : 3 }}>
      <Typography 
        variant={isMobile ? "h4" : "h3"} 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ mb: isMobile ? 2 : 4 }}
      >
        Workout Viewer
      </Typography>
    
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {!loading && !error && (
        <WorkoutList workouts={workouts} />
      )}
    </Container>
  );
}

export default WorkoutsListPage; 