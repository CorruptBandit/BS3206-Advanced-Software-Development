import PropTypes from 'prop-types';
import {Card, Typography, CardHeader, CardContent} from '@mui/material';
import {Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector} from '@mui/lab';
import {fDateTime} from '../../../utils/formatTime';

AppWorkoutHistoryTimeline.propTypes = {
    title: PropTypes.string, subheader: PropTypes.string, list: PropTypes.array.isRequired,
};

export default function AppWorkoutHistoryTimeline({title, subheader, list, ...other}) {
    const sortedList = list.slice().sort((a, b) => b.time.getTime() - a.time.getTime());


    return (<Card {...other} sx={{height: '465px', overflow: 'auto'}}>
            <CardHeader title={title} subheader={subheader}/>
            <CardContent
                sx={{
                    '& .MuiTimelineItem-missingOppositeContent:before': {
                        display: 'none',
                    },
                }}
            >
                <Timeline>
                    {sortedList.map((item, index) => (
                        <WorkoutItem key={item.id} item={item} isLast={index === sortedList.length - 1}/>))}
                </Timeline>
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
