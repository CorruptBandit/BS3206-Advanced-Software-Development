import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Card, CardHeader, CircularProgress } from '@mui/material';
import { fNumber } from '../../../utils/formatNumber';
import { useChart } from '../../../components/chart';

AppDietaryTracking.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    chartData: PropTypes.array.isRequired,
};

export default function AppDietaryTracking({ title, subheader, chartData, ...other }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const sortedChartData = chartData.slice().sort((a, b) => new Date(a.label) - new Date(b.label));

    const chartLabels = sortedChartData.map((i) => i.label);
    const chartSeries = sortedChartData.map((i) => i.value);

    const chartOptions = useChart({
        tooltip: {
            marker: { show: false },
            y: {
                formatter: (seriesName) => fNumber(seriesName),
                title: {
                    formatter: () => '',
                },
            },
        },
        plotOptions: {
            bar: { vertical: true, barHeight: '35%', borderRadius: 2 },
        },
        xaxis: {
            categories: chartLabels,
        },
    });

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
            {loading ? ( // Conditionally render loading indicator
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 364 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ mx: 3 }} dir="ltr">
                    <ReactApexChart type="line" series={[{ data: chartSeries }]} options={chartOptions} height={364} />
                </Box>
            )}
        </Card>
    );
}
