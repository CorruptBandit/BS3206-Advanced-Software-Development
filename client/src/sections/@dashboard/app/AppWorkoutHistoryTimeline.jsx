import PropTypes from 'prop-types';
import {Card, Typography, CardHeader, CardContent, CircularProgress} from '@mui/material';
import {Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector} from '@mui/lab';
import {fDateTime} from '../../../utils/formatTime';
import {useEffect, useState} from "react";

AppWorkoutHistoryTimeline.propTypes = {
    title: PropTypes.string, subheader: PropTypes.string, list: PropTypes.array.isRequired,
};

export default function AppWorkoutHistoryTimeline({title, subheader, list, ...other}) {
    const [loading, setLoading] = useState(true);
    const sortedList = list.slice().sort((a, b) => b.time.getTime() - a.time.getTime());

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (<Card {...other} sx={{height: '465px', overflow: 'auto', position: 'relative'}}>
            <CardHeader title={title} subheader={subheader}/>
            <CardContent
                sx={{
                    '& .MuiTimelineItem-missingOppositeContent:before': {
                        display: 'none',
                    }, position: 'relative',
                }}
            >
                {loading ? ( // Conditionally render loading indicator
                    <div style={{position: 'absolute', top: '75%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                        <CircularProgress color="primary" data-testid="loading-indicator"/>
                    </div>) : (<Timeline>
                        {sortedList.map((item, index) => (
                            <WorkoutItem key={item.id} item={item} isLast={index === sortedList.length - 1}/>))}
                    </Timeline>)}
            </CardContent>
        </Card>);
}

WorkoutItem.propTypes = {
    isLast: PropTypes.bool, item: PropTypes.shape({
        time: PropTypes.instanceOf(Date), title: PropTypes.string, type: PropTypes.string,
    }),
};

function WorkoutItem({item, isLast}) {
    const {title, time} = item;
    return (<TimelineItem>
        <TimelineSeparator>
            <TimelineDot color='primary'/>
            {isLast ? null : <TimelineConnector/>}
        </TimelineSeparator>
        <TimelineContent>
            <Typography variant="subtitle2">{title}</Typography>
            <Typography variant="caption" sx={{color: 'text.secondary'}}>
                {fDateTime(time)}
            </Typography>
        </TimelineContent>
    </TimelineItem>);
}
