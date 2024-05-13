import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box, Tab, Tabs, CircularProgress } from '@mui/material'; // Import CircularProgress for loading indicator
import { useChart } from '../../../components/chart';

AppExerciseTracking.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    chartData: PropTypes.array.isRequired,
    chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppExerciseTracking({ title, subheader, chartLabels, chartData, ...other }) {
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 750);

        return () => clearTimeout(timer);
    }, []);

    const handleChangeTab = (event, newValue) => {
        setTabIndex(newValue);
    };

    const chartOptions = useChart({
        plotOptions: { bar: { columnWidth: '16%' } },
        fill: { type: 'solid' },
        labels: chartLabels,
        xaxis: { type: 'datetime' },
        tooltip: {
            shared: true, intersect: false, y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                        return `${y.toFixed(0)}kg`;
                    }
                    return y;
                },
            }, "custom": ({ series, seriesIndex, dataPointIndex }) => {
                const weight = series[seriesIndex][dataPointIndex];
                return `<div>${weight}kg</div>`;
            },
        },
    });

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <Tabs value={tabIndex} onChange={handleChangeTab}>
                    {chartLabels.map((label, index) => (<Tab key={index} label={label} />))}
                </Tabs>
                {loading ? ( // Conditionally render loading indicator
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    chartData.map((data, index) => (
                        <Box key={index} hidden={tabIndex !== index}>
                            {tabIndex === index && (
                                <ReactApexChart
                                    type="bar"
                                    series={[{ data: data.data }]}
                                    options={chartOptions}
                                    height={300}
                                />
                            )}
                        </Box>
                    ))
                )}
            </Box>
        </Card>
    );
}
