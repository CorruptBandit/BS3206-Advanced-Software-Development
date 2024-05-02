import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

export default function WorkoutEditor() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workoutId = searchParams.get('workoutId');

  // State variables for form fields
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState(workoutId ? Array(5).fill({ exerciseName: '', sets: '', reps: '', targetWeight: '' }) : [{ exerciseName: '', sets: '', reps: '', targetWeight: '' }]);
  const [selectedExercise, setSelectedExercise] = useState(''); // Currently selected exercise

  // Function to add a new exercise
  const handleAddExercise = () => {
    setExercises([...exercises, { exerciseName: '', sets: '', reps: '', targetWeight: '' }]);
  };

  // Function to handle changes in exercise fields
  const handleExerciseChange = (event, index, field) => {
    const newExercises = [...exercises];
    newExercises[index][field] = event.target.value;
    setExercises(newExercises);
  };

  // Function to handle removal of an exercise
  const handleDeleteExercise = (index) => {
    if (index > 0) {
      const newExercises = [...exercises];
      newExercises.splice(index, 1);
      setExercises(newExercises);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {workoutId ? `Edit Workout ${workoutId}` : 'New Workout'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Workout Name"
            variant="outlined"
            fullWidth
            value={workoutName}
            onChange={(event) => setWorkoutName(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Exercises
          </Typography>
          {exercises.map((exercise, index) => (
            <Grid key={index} container spacing={2} mt={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id={`exercise-select-label-${index}`}>Exercise</InputLabel>
                  <Select
                    labelId={`exercise-select-label-${index}`}
                    value={selectedExercise}
                    onChange={(event) => setSelectedExercise(event.target.value)}
                  >
                    <MenuItem value="">None</MenuItem>
                    {/* Add options for existing exercises here */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Sets"
                  variant="outlined"
                  fullWidth
                  value={exercise.sets}
                  onChange={(event) => handleExerciseChange(event, index, 'sets')}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Reps"
                  variant="outlined"
                  fullWidth
                  value={exercise.reps}
                  onChange={(event) => handleExerciseChange(event, index, 'reps')}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Target Weight (kg)"
                  variant="outlined"
                  fullWidth
                  value={exercise.targetWeight}
                  onChange={(event) => handleExerciseChange(event, index, 'targetWeight')}
                />
              </Grid>
              {index > 0 && (
                <Grid item xs={2}>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteExercise(index)}>
                    Delete
                  </Button>
                </Grid>
              )}
            </Grid>
          ))}
          <Grid container justifyContent="center" mt={2}>
            <Grid item>
              <Button variant="contained" color="primary"  size="large" onClick={handleAddExercise}>
                Add Exercise
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" mt={2}>
          <Grid item>
            <Button component={Link} to="/dashboard/workouts" variant="contained" color="primary" size="large">
              Cancel and Return to Workouts
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
