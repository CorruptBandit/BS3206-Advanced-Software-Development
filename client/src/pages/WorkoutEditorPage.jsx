import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  const [exercises, setExercises] = useState([{ exerciseName: '', sets: '', reps: '', targetWeight: '' }]);
  const [workoutData, setWorkoutData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);

  const handleAddExercise = () => {
    setExercises([...exercises, { exerciseName: '', sets: '', reps: '', targetWeight: '' }]);
  };

  const handleExerciseChange = (event, index, field) => {
    const newExercises = [...exercises];
    newExercises[index][field] = event.target.value;
    setExercises(newExercises);
  };

  const handleDeleteExercise = (index) => {
    if (index > 0) {
      const newExercises = [...exercises];
      newExercises.splice(index, 1);
      setExercises(newExercises);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const [workoutsResponse, exercisesResponse] = await Promise.all([
        fetch(`/api/getCollection?collection=workouts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch(`/api/getCollection?collection=exercises`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);

      if (!workoutsResponse.ok || !exercisesResponse.ok) {
        throw new Error(`Failed to fetch data`);
      }

      const dataWorkouts = await workoutsResponse.json();
      const dataExercises = await exercisesResponse.json();


      const enhancedWorkouts = dataWorkouts.map(workout => {
        const enhancedExercises = workout.exercises.map(exercise => {
          const correspondingExercise = dataExercises.find(ex => ex._id === exercise.exerciseId);
          if (correspondingExercise) {
            return {
              ...exercise,
              exerciseName: correspondingExercise.exerciseName,
            };
          }
          return exercise;
        });

        return {
          ...workout,
          exercises: enhancedExercises,
        };
      });

      setWorkoutData(enhancedWorkouts);
      setExerciseData(dataExercises);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

useEffect(() => {
  if (workoutId && workoutData.length > 0) {
    const foundWorkout = workoutData.find((workout) => workout._id === workoutId);
    if (foundWorkout) {
      setWorkoutName(foundWorkout.workoutName);
      setExercises(foundWorkout.exercises);
    }
  }
}, [workoutId, workoutData]);


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {workoutName ? `Edit Workout - ${workoutName}` : 'New Workout'}
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
                  <InputLabel>Exercise</InputLabel>
                  <Select
                    value={exercise.exerciseName}
                    onChange={(event) => handleExerciseChange(event, index, 'exerciseName')}
                  >
                    <MenuItem value="">None</MenuItem>
                    {exerciseData.map((exerciseDataItem) => (
                      <MenuItem key={exerciseDataItem._id} value={exerciseDataItem.exerciseName}>
                        {exerciseDataItem.exerciseName.toString()}
                      </MenuItem>
                    ))}
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
