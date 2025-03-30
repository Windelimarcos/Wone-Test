import React from 'react';
import { Link } from 'react-router-dom';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Paper, 
  Typography, 
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';

function WorkoutList({ workouts }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!workouts || workouts.length === 0) {
    return <Typography sx={{ mt: 2 }}>No workouts found.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ mt: 3 }}>
       <Typography 
         variant={isMobile ? "h6" : "h5"} 
         component="h2" 
         sx={{ p: isMobile ? 1.5 : 2 }}
       >
          Available Workouts
       </Typography>
       <Divider />
      <List disablePadding>
        {workouts.map((workout) => (
          <React.Fragment key={workout.id}>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to={`/workout/${workout.id}`}
                sx={{ 
                  py: isMobile ? 1 : 1.5,
                  px: isMobile ? 1.5 : 2
                }}
              >
                <ListItemText
                  primary={`${workout.tipo_de_treino} (ID: ${workout.id})`}
                  secondary={`Owner: ${workout.dono_do_treino} - ${workout.descricao}`}
                  primaryTypographyProps={{
                    fontSize: isMobile ? '0.95rem' : 'inherit'
                  }}
                  secondaryTypographyProps={{
                    fontSize: isMobile ? '0.85rem' : 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default WorkoutList; 