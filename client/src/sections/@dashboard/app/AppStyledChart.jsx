import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import {styled} from '@mui/material/styles';
import {Card, CardHeader} from '@mui/material';
// components
import {useChart} from '../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 225;

const LEGEND_HEIGHT = 48;

const StyledChartWrapper = styled('div')(({theme}) => ({
    height: CHART_HEIGHT, marginTop: theme.spacing(0), '& .apexcharts-canvas svg': {
        height: CHART_HEIGHT,
    }, '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
        overflow: 'visible',
    }, '& .apexcharts-legend': {
        height: LEGEND_HEIGHT,
        alignContent: 'center',
        position: 'relative !important',
        borderTop: `solid 1px ${theme.palette.divider}`,
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
    },
}));

// ----------------------------------------------------------------------

AppCurrentSubject.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    chartData: PropTypes.array.isRequired,
    chartColors: PropTypes.arrayOf(PropTypes.string).isRequired,
    chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppCurrentSubject({title, subheader, chartData, chartColors, chartLabels, ...other}) {
    const chartOptions = useChart({
        stroke: {width: 2}, fill: {opacity: 0.48}, legend: {floating: true, horizontalAlign: 'center'}, xaxis: {
            categories: chartLabels, labels: {
                style: {
                    colors: chartColors,
                },
            },
        },
    });

    return (<Card {...other}>
        <CardHeader title={title} subheader={subheader}/>

        <StyledChartWrapper dir="ltr">
            <ReactApexChart type="radar" series={chartData} options={chartOptions} height={200}/>
        </StyledChartWrapper>
    </Card>);
}