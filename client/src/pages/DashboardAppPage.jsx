import {Helmet} from 'react-helmet-async';
import {faker} from '@faker-js/faker';
// @mui
import {Grid, Container, Typography, Box} from '@mui/material';

// components
import AdminPage from './AdminPage';

// sections
import {
    AppWorkoutHistoryTimeline, AppWidgetSummary, AppGoals, AppBar
} from '../sections/@dashboard/app';

import {useAuth} from '../context/AuthContext';

export default function DashboardAppPage() {
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
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Exercises Completed" data={"12"}
                                          icon={'ant-design:heart-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Favourite Meal" data={"Breakfast"} color="info"
                                          icon={'ant-design:shopping-cart-outlined'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Favourite Workout" data={"Bicep Curl"} color="warning"
                                          icon={'ant-design:experiment-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Goals Completed" data={"3"} color="success"
                                          icon={'ant-design:star-filled'}/>
                    </Grid>
                    <Grid item xs={12} md={6} lg={9}>
                        <AppBar
                            title="Conversion Rates"
                            subheader="(+43%) than last year"
                            chartData={[{label: 'Italy', value: 400}, {label: 'Japan', value: 430}, {
                                label: 'China',
                                value: 448
                            }, {label: 'Canada', value: 470}, {label: 'France', value: 540}, {
                                label: 'Germany',
                                value: 580
                            }, {label: 'South Korea', value: 690}, {
                                label: 'Netherlands',
                                value: 1100
                            }, {label: 'United States', value: 1200}, {label: 'United Kingdom', value: 1380},]}
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
                        <AppGoals
                            title="Tasks"
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
