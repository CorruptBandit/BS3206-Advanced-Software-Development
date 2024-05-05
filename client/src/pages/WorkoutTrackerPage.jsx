import { Link, useLocation } from 'react-router-dom';
import {
  Button,
  Container,
  Typography,
  Grid,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Paper,
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function WorkoutTracker() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workoutId = searchParams.get('workoutId');

  // State variables for form fields
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);

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

  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {workoutName && `Track Workout ${workoutName} - ${formattedDate}`}
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                      <Typography variant="h6">
                          Exercise
                      </Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="h6">
                          Targets
                      </Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="h6">
                          Sets
                      </Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="h6">
                          Next Target Weight (kg)
                      </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exercises.map((exercise, index) => (
                  <TableRow key={index}>
                    <TableCell>
                        <Typography variant="subtitle1">
                          {exercise.exerciseName}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle1">
                            {"Target Reps: " + exercise.reps}
                        </Typography>

                        <Typography variant="subtitle1">
                            {"Target Weight: " + exercise.targetWeight + "kg"}
                        </Typography>
                    </TableCell>
                    <TableCell>
                      {[...Array(Number(exercise.sets))].map((_, setIndex) => (
                        <div key={setIndex} style={{ paddingTop: '10px' }}>
                          <Typography variant="subtitle1">
                            Set {setIndex + 1}
                          </Typography>
                          <TextField style={{ marginRight: "10px" }}
                            required
                            label={`Reps Done`}
                            type="number"
                            variant="outlined"
                          />
                          <TextField
                            required
                            label={`Weight Done (kg)`}
                            type="number"
                            variant="outlined"
                          />
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <TextField
                        required
                        label={"Next Target Weight (kg)"}
                        type="number"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container justifyContent="center" mt={2}>
          <Grid item>
            <Button variant="contained" color="primary" size="large">
              Log Workout
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
    </Container>
  );
}
