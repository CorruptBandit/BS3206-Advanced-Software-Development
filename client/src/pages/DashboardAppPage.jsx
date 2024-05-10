import {Helmet} from 'react-helmet-async';
// @mui
import {useTheme} from '@mui/material/styles';
import {Box, Container, Grid, Typography} from '@mui/material';

// components
import AdminPage from './AdminPage';

// sections
import {
    AppCalorieBreakdown, AppExerciseTracking, AppGoals, AppWidgetSummary, AppWorkoutHistoryTimeline
} from '../sections/@dashboard/app';

import {useAuth} from '../context/AuthContext';
import {useEffect, useState} from "react";

export default function DashboardAppPage() {
    const theme = useTheme();
    const {email, name, isLoggedIn, isAdmin} = useAuth();
    const [filteredData, setDailyIntake] = useState([]);
    const [mostCommonMealType, setMostCommonMealType] = useState(null);
    const [calorieBreakdown, setCalorieBreakdown] = useState([]);
    const [workoutData, setWorkoutData] = useState([]);
    const [mostCommonExerciseName, setMostCommonExerciseName] = useState('');
    const [workoutHistoryData, setWorkoutHistoryData] = useState([]);

    useEffect(() => {
        if (filteredData.length > 0) {
            const mealCounts = filteredData.reduce((counts, item) => {
                counts[item.mealType] = (counts[item.mealType] || 0) + 1;
                return counts;
            }, {});

            const mostCommonMealType = Object.keys(mealCounts).reduce((a, b) => mealCounts[a] > mealCounts[b] ? a : b, null);
            setMostCommonMealType(mostCommonMealType ? mostCommonMealType.charAt(0).toUpperCase() + mostCommonMealType.slice(1) : null);
        }
    }, [filteredData]);

    useEffect(() => {
        if (filteredData.length > 0) {
            const calorieCounts = filteredData.reduce((counts, item) => {
                counts[item.mealType] = (counts[item.mealType] || 0) + parseInt(item.calories);
                return counts;
            }, {});

            const chartData = Object.entries(calorieCounts).map(([label, value]) => ({
                label, value
            }));
            setCalorieBreakdown(chartData);
        }
    }, [filteredData]);

    const sumCalories = () => {
        return calorieBreakdown.reduce((total, item) => total + item.value, 0);
    };

    const fetchFood = async () => {
        try {
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 6);

            const response = await fetch(`/api/getCollection?collection=food`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch food data`);
            }
            const data = await response.json();

            const currentDate = new Date().toISOString().slice(0, 10);
            const getDailyIntake = data.filter(item => item.userEmail === email && item.dateAdded === currentDate);

            setDailyIntake(getDailyIntake);
        } catch (error) {
            console.error('Error fetching food data:', error);
        }
    };

    useEffect(() => {
        fetchFood().then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, [email]);


    useEffect(() => {
        Promise.all([fetchWorkout('workouts'), fetchWorkout('workoutHistory'),])
            .then(() => {
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const fetchWorkout = async (collection) => {
        try {
            const userResponse = await fetch(`/api/getCollection?collection=users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userResponse.json();
            const currentUser = userData.find(user => user.email === email);

            if (!currentUser) {
                console.error('User data not found for email:', email);
                return [];
            }

            const userId = currentUser._id;

            const response = await fetch(`/api/getCollection?collection=${collection}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ${collection}`);
            }

            const data = await response.json();
            const filteredData = data.filter(item => item.userId === userId);

            let mostCommonExercise = null;
            let maxCount = 0;
            const exerciseCounts = {};

            if (collection === 'workouts') {
                filteredData.forEach(item => {
                    item.exercises.forEach(exercise => {
                        const exerciseId = exercise.exerciseId;
                        exerciseCounts[exerciseId] = (exerciseCounts[exerciseId] || 0) + 1;
                        if (exerciseCounts[exerciseId] > maxCount) {
                            maxCount = exerciseCounts[exerciseId];
                            mostCommonExercise = exerciseId;
                        }
                    });
                });
                const mappedData = filteredData.map((item) => ({...item, workoutId: item._id}));
                setWorkoutData(mappedData);

                const exerciseResponse = await fetch(`/api/getCollection?collection=exercises`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!exerciseResponse.ok) {
                    throw new Error('Failed to fetch exercise data');
                }

                const exerciseData = await exerciseResponse.json();
                const mostCommonExerciseData = exerciseData.find(exercise => exercise._id === mostCommonExercise);

                setMostCommonExerciseName(mostCommonExerciseData.exerciseName);

            } else if (collection === 'workoutHistory') {
                setWorkoutHistoryData(filteredData);
            }

            return data;
        } catch (error) {
            console.error(`Error fetching ${collection}:`, error);
            throw error;
        }
    };

    if (isAdmin) {
        return <AdminPage/>;
    }

    return (<>
        <Helmet>
            <title> Meals & Movement </title>
        </Helmet>

        <Container maxWidth="xl" sx={{filter: isLoggedIn ? 'none' : 'grayscale(1)'}}>
            {isLoggedIn && (<Typography variant="h4" sx={{mb: 5}}>
                Hi, Welcome back {name}
            </Typography>)}

            <Grid container spacing={3}>
                {/* Conditional rendering based on isLoggedIn state */}
                {isLoggedIn ? (<>
                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Favourite Meal" data={mostCommonMealType || "N/A"} color="info"
                                          icon={'fluent-emoji-high-contrast:shallow-pan-of-food'}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AppCalorieBreakdown
                            title="Daily Calorie Breakdown"
                            subheader={`Total Calories: ${sumCalories()}`}
                            chartData={calorieBreakdown}
                            chartColors={[theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.success.main, theme.palette.error.main]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Favourite Workout" data={mostCommonExerciseName || "N/A"}
                                          color="success"
                                          icon={'cil:weightlifitng'}/>
                    </Grid>
                    <Grid item xs={12} md={6} lg={9}>
                        <AppExerciseTracking
                            title="Exercise Tracking"
                            chartLabels={['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003',]}
                            chartData={[{
                                name: 'Team A',
                                type: 'column',
                                fill: 'solid',
                                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                            }, {
                                name: 'Team B',
                                type: 'area',
                                fill: 'gradient',
                                data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                            }, {
                                name: 'Team C',
                                type: 'line',
                                fill: 'solid',
                                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                            },]}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <AppWorkoutHistoryTimeline
                            title="Workout History"
                            list={workoutHistoryData.map((item) => ({
                                id: item._id, title: item.workoutName, type: 'workout', time: new Date(item.date),
                            }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={9}>

                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <AppGoals
                            title="Goals"
                            list={[{id: '1', label: 'Create FireStone Logo'}, {
                                id: '2', label: 'Add SCSS and JS files if required'
                            }, {id: '3', label: 'Stakeholder Meeting'}, {
                                id: '4', label: 'Scoping & Estimations'
                            }, {id: '5', label: 'Sprint Showcase'},]}
                        />
                    </Grid>
                </>) : (// Display a message or a login button when logged out
                    <Box sx={{width: '100%', textAlign: 'center', mt: 5}}>
                        <Typography variant="h5" sx={{mb: 2}}>
                            You are currently logged out
                        </Typography>
                    </Box>)}
            </Grid>
        </Container>
    </>)
}
