import React from 'react';
import {
    Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function WorkoutDetail({ workout }) {
    if (!workout) {
        return null;
    }

    // Helper function to render each training day
    const renderTrainingDay = (dayKey, dayData) => {
        if (!dayData) return null;

        const exercises = dayData['Exercícios'] || {}; // Correct key from JSON
        const muscleGroup = dayData['Musculação'] || 'N/A'; // Correct key
        const restInterval = dayData['Intervalo de descanso'] || 'N/A'; // Correct key
        const dayOfWeek = (dayData['Dia'] || []).join(', '); // Correct key

        return (
            <Accordion key={dayKey} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{dayKey} ({dayOfWeek}) - {muscleGroup}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body1">
                        <strong>Rest Interval:</strong> {restInterval}
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead sx={{ backgroundColor: 'grey.200' }}>
                                <TableRow>
                                    <TableCell>Exercise</TableCell>
                                    <TableCell>Sets x Reps (SxR)</TableCell>
                                    <TableCell>Advanced Technique</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(exercises).map(([exName, exDetails]) => (
                                    <TableRow key={exName}>
                                        <TableCell component="th" scope="row">{exName}</TableCell>
                                        <TableCell>{exDetails['SxR']}</TableCell>
                                        <TableCell>{exDetails['Técnica Avançada'] || 'None'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
        );
    };

    // Extract treino days dynamically
    const treinoDays = Object.keys(workout)
        .filter(key => key.startsWith('Treino '))
        .sort(); // Sort keys like Treino A, Treino B...

    return (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Workout Details: {workout.tipo_de_treino} (ID: {workout.id})
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                <strong>Owner:</strong> {workout.dono_do_treino}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                <strong>Description:</strong> {workout.obs?.['Descrição'] || 'No description'}
            </Typography>

             {/* Display Access List if needed */}
             {workout.access && workout.access.length > 0 && (
                 <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" component="span" sx={{ mr: 1 }}><strong>Access:</strong></Typography>
                    {workout.access.map((acc, index) => (
                         <Chip key={index} label={acc === 'me' ? 'Me' : `User ${index + 1}`} size="small" sx={{ mr: 0.5 }}/>
                    ))}
                 </Box>
             )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {treinoDays.map(dayKey => renderTrainingDay(dayKey, workout[dayKey]))}
            </Box>
        </Paper>
    );
}

export default WorkoutDetail; 