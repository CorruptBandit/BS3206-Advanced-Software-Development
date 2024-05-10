import {Helmet} from 'react-helmet-async';
import {faker} from '@faker-js/faker';
// @mui
import {useTheme} from '@mui/material/styles';
import {Grid, Container, Typography, Box} from '@mui/material';

// components
import AdminPage from './AdminPage';

// sections
import {
    AppWorkoutHistoryTimeline,
    AppWidgetSummary,
    AppGoals,
    AppDietaryTracking,
    AppExerciseTracking,
    AppCalorieBreakdown
} from '../sections/@dashboard/app';

import {useAuth} from '../context/AuthContext';

export default function DashboardAppPage() {
    const theme = useTheme();
    const {isLoggedIn, isAdmin, name} = useAuth();

    if (isAdmin) {
        return <AdminPage/>; // Render AdminPage if the user is admin
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
                        <AppWidgetSummary title="Favourite Meal" data={"Breakfast"} color="info"
                                          icon={'ant-design:shopping-cart-outlined'}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AppCalorieBreakdown
                            title="Daily Calorie Breakdown"
                            chartData={[{label: 'America', value: 4344}, {label: 'Asia', value: 5435}, {
                                label: 'Europe', value: 1443
                            }, {label: 'Africa', value: 4443},]}
                            chartColors={
                            [
                                theme.palette.primary.main,
                                theme.palette.info.main,
                                theme.palette.warning.main,
                                theme.palette.error.main,
                            ]
                        }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Favourite Workout" data={"Bicep Curl"} color="success"
                                          icon={'ant-design:rocket-filled'}/>
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
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: ['1983, orders, $4220', '12 Invoices have been paid', 'Order #37745 from September', 'New order placed #XF-2356', 'New order placed #XF-2346',][index],
                                type: `order${index + 1}`,
                                time: faker.date.past(),
                            }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={9}>
                        <AppDietaryTracking
                            title="Dietary Tracking"
                            chartData={[{label: 'Italy', value: 400}, {label: 'Japan', value: 430}, {
                                label: 'China', value: 448
                            }, {label: 'Canada', value: 470}, {label: 'France', value: 540}, {
                                label: 'Germany', value: 580
                            }, {label: 'South Korea', value: 690}, {
                                label: 'Netherlands', value: 1100
                            }, {label: 'United States', value: 1200}, {label: 'United Kingdom', value: 1380},]}
                        />
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
