import {Helmet} from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import {Grid, Container, Typography, Box} from '@mui/material';

// components
import AdminPage from './AdminPage';

// sections
import {
    WorkoutHistoryTimeline,
    AppWidgetSummary
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
                    <Grid item xs={12} md={6} lg={3}>
                        <WorkoutHistoryTimeline
                            title="Workout History"
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: ['1983, orders, $4220', '12 Invoices have been paid', 'Order #37745 from September', 'New order placed #XF-2356', 'New order placed #XF-2346',][index],
                                type: `order${index + 1}`,
                                time: faker.date.past(),
                            }))}
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
