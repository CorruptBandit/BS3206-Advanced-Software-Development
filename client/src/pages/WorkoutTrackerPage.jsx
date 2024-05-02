import { Link, useLocation } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

export default function WorkoutTracker() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workoutId = searchParams.get('workoutId');

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
        {/*TODO: Need to get workout name not id */}
        {`Track Workout ${workoutId} - ${formattedDate}`}
      </Typography>
      <Button component={Link} to="/dashboard/workouts" variant="contained" color="primary">
        Cancel and Return to Workouts
      </Button>
    </Container>
  );
}
