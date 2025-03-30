import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button,
  useTheme
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';

function RestTimer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const theme = useTheme();
  
  // Calculate progress percentage
  const progress = ((duration - timeLeft) / duration) * 100;
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Setup countdown timer
  useEffect(() => {
    let interval;
    
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play sound when timer completes
      const audio = new Audio('/timer-complete.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Call onComplete callback
      onComplete();
    }
    
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onComplete]);
  
  // Handle pause/resume
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  // Handle skip rest
  const handleSkipRest = () => {
    setTimeLeft(0);
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      textAlign: 'center',
      my: 3 
    }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Rest Timer
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
        <CircularProgress 
          variant="determinate" 
          value={progress} 
          size={120}
          thickness={5}
          sx={{
            color: theme.palette.primary.main,
            circle: {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimerIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography
              variant="h4"
              component="div"
              color="primary"
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={togglePause}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSkipRest}
        >
          Skip Rest
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {isPaused ? 'Timer paused' : 'Rest in progress...'}
      </Typography>
    </Box>
  );
}

export default RestTimer; 