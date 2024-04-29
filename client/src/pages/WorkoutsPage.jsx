import React from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const TABLE_HEAD = [
  { id: 'name', label: 'Workout Name', alignRight: false },
  { id: 'exercises', label: 'Exercises', alignRight: false },
];

const workoutData = [
  {
    "workout_id": 1,
    "workout_name": "workout 1",
    "exercises": [
      { "exercise_id": 1, "sets": 3, "reps": 5, "target_weight": 44 },
      { "exercise_id": 2, "sets": 4, "reps": 6, "target_weight": 55 }
    ]
  },
  {
    "workout_id": 2,
    "workout_name": "workout 2",
    "exercises": [
      { "exercise_id": 2, "sets": 6, "reps": 5, "target_weight": 66 },
      { "exercise_id": 3, "sets": 4, "reps": 4, "target_weight": 33 },
      { "exercise_id": 4, "sets": 2, "reps": 2, "target_weight": 22 }
    ]
  }
];

export default function WorkoutPage() {
  // ... rest of the component logic

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Workouts
      </Typography>

      <TableContainer sx={{ minWidth: 600 }}>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_HEAD.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {workoutData.map((workout) => {
              const { workout_id, workout_name, exercises } = workout;

              // Function to format exercise details for display
              const formatExercises = (exercises) => {
                return exercises.map((exercise) => (
                  <div key={exercise.exercise_id}>
                    {exercise.exercise_id} ({exercise.sets} sets x {exercise.reps} reps @ {exercise.target_weight} kg)
                  </div>
                ));
              };

              return (
                <TableRow key={workout_id}>
                  <TableCell component="th" scope="row">
                    {workout_name}
                  </TableCell>
                  <TableCell align="left">
                    {formatExercises(exercises)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
