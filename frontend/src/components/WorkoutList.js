import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, Typography, Divider } from '@mui/material';

function WorkoutList({ workouts, onSelectWorkout }) {
  if (!workouts || workouts.length === 0) {
    return <Typography sx={{ mt: 2 }}>No workouts found.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ mt: 3 }}>
       <Typography variant="h5" component="h2" sx={{ p: 2 }}>
          Available Workouts
       </Typography>
       <Divider />
      <List disablePadding>
        {workouts.map((workout) => (
          <React.Fragment key={workout.id}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => onSelectWorkout(workout.id)}>
                <ListItemText
                  primary={`${workout.tipo_de_treino} (ID: ${workout.id})`}
                  secondary={`Owner: ${workout.dono_do_treino} - ${workout.descricao}`}
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