import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
import { WorkoutListHead, WorkoutListToolbar } from '../sections/@dashboard/workout';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'workoutName', label: 'Workout Name', alignRight: false },
  { id: 'exercises', label: 'Exercises', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_workout) => _workout.workoutName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function WorkoutsPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('workoutName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [workoutId, setWorkoutId] = useState(null);
  const [workoutData, setWorkoutData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);

  const fetchData = async (collection) => {
    try {
      const response = await fetch(`/api/getCollection?collection=${collection}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection}`);
      }
      const data = await response.json();

      // Map _id to workoutId for Workouts data
      if (collection === 'workouts') {
        const mappedData = data.map((item) => ({ ...item, workoutId: item._id }));
        setWorkoutData(mappedData);
      } else if (collection === 'exercises') {
        setExerciseData(data);
      }
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error);
    }
  };

  useEffect(() => {
    fetchData('workouts');
    fetchData('exercises');
  }, []);

  const handleOpenMenu = (event, workoutId) => {
    setWorkoutId(workoutId);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = workoutData.map((n) => n.workoutName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, workoutName) => {
    const selectedIndex = selected.indexOf(workoutName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, workoutName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - workoutData.length) : 0;

  const filteredWorkouts = applySortFilter(workoutData, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredWorkouts.length && !!filterName;

  // Updated function to format exercises with exercise names instead of IDs
  const formatExercises = (exercises) => {
    return exercises.map((exercise) => {
      // Find the exercise object with matching _id
      const foundExercise = exerciseData.find((ex) => ex._id === exercise.exerciseId);
      return (
        <div key={exercise.exerciseId}>
          {foundExercise?.exerciseName}: {exercise.sets} sets x {exercise.reps} reps @ {exercise.targetWeight}kg
        </div>
      );
    });
  };

  return (
    <>
      <Helmet>
        <title> Workouts</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Workouts
          </Typography>
          <Button component={Link} to="/dashboard/workout-editor" variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Workout
          </Button>
        </Stack>

        <Card>
          <WorkoutListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 600 }}>
              <Table>
                <WorkoutListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={workoutData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredWorkouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { workoutId, workoutName, exercises } = row;
                    const selectedWorkout = selected.indexOf(workoutName) !== -1;

                    return (
                      <TableRow hover key={workoutId} tabIndex={-1} role="checkbox" selected={selectedWorkout}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedWorkout} onChange={(event) => handleClick(event, workoutName)} />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {workoutName}
                        </TableCell>
                        <TableCell align="left">
                          {formatExercises(exercises)}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, workoutId)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={workoutData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem component={Link} to={`/dashboard/workout-tracker?workoutId=${workoutId}`}>
          <Iconify icon={'eva:pin-outline'} sx={{ mr: 2 }} />
          Track
        </MenuItem>

        <MenuItem component={Link} to={`/dashboard/workout-editor?workoutId=${workoutId}`}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
