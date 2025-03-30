import React from 'react';
import {
    Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Chip,
    useTheme, useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function WorkoutDetail({ workout }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                    <Typography 
                        variant={isMobile ? "subtitle1" : "h6"}
                        sx={{ 
                            width: '100%', 
                            flexShrink: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {dayKey} ({dayOfWeek}) - {muscleGroup}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: isMobile ? 1 : 2 }}>
                    <Typography variant="body1">
                        <strong>Rest Interval:</strong> {restInterval}
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size={isMobile ? "small" : "medium"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Exercise</TableCell>
                                    <TableCell>Sets x Reps</TableCell>
                                    <TableCell sx={{ display: isMobile ? 'none' : 'table-cell' }}>
                                        Advanced Technique
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(exercises).map(([exName, exDetails]) => (
                                    <TableRow key={exName}>
                                        <TableCell component="th" scope="row" 
                                            sx={{ 
                                                fontSize: isMobile ? '0.8rem' : 'inherit',
                                                padding: isMobile ? '8px' : '16px'
                                            }}
                                        >
                                            {exName}
                                        </TableCell>
                                        <TableCell
                                            sx={{ 
                                                fontSize: isMobile ? '0.8rem' : 'inherit',
                                                padding: isMobile ? '8px' : '16px'
                                            }}
                                        >
                                            {exDetails['SxR']}
                                        </TableCell>
                                        <TableCell 
                                            sx={{ 
                                                display: isMobile ? 'none' : 'table-cell',
                                                fontSize: isMobile ? '0.8rem' : 'inherit'
                                            }}
                                        >
                                            {exDetails['Técnica Avançada'] || 'None'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {/* Show advanced techniques in mobile as a separate section */}
                    {isMobile && Object.entries(exercises).some(([_, exDetails]) => exDetails['Técnica Avançada']) && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>Advanced Techniques:</Typography>
                            {Object.entries(exercises)
                                .filter(([_, exDetails]) => exDetails['Técnica Avançada'])
                                .map(([exName, exDetails]) => (
                                    <Typography key={exName} variant="body2" sx={{ mb: 1 }}>
                                        <strong>{exName}:</strong> {exDetails['Técnica Avançada']}
                                    </Typography>
                                ))
                            }
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>
        );
    };

    // Extract treino days dynamically
    const treinoDays = Object.keys(workout)
        .filter(key => key.startsWith('Treino '))
        .sort(); // Sort keys like Treino A, Treino B...

    return (
        <Paper elevation={3} sx={{ mt: 4, p: isMobile ? 2 : 3 }}>
            <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="h2" 
                gutterBottom
                sx={{ wordBreak: 'break-word' }}
            >
                Workout Details: {workout.tipo_de_treino} (ID: {workout.id})
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                <strong>Owner:</strong> {workout.dono_do_treino}
            </Typography>
            <Typography 
                variant="body1" 
                gutterBottom 
                sx={{ mb: 2, fontSize: isMobile ? '0.9rem' : 'inherit' }}
            >
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 2 }}>
                {treinoDays.map(dayKey => renderTrainingDay(dayKey, workout[dayKey]))}
            </Box>
        </Paper>
    );
}

export default WorkoutDetail; 