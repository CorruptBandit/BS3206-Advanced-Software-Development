import { Helmet } from 'react-helmet-async';
import { Button, Container, Typography, Stack } from '@mui/material';
import Iconify from '../components/iconify';

export default function RecordCaloriesPage() {
  return (
    <>
      <Helmet>
        <title> Log Calories | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Log Calories
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Log Calories
          </Button>
        </Stack>
      </Container>
    </>
  );
}
