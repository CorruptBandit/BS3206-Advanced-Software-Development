// @mui
import PropTypes from 'prop-types';
import {Card, Typography, CardHeader, CardContent} from '@mui/material';
import {Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector} from '@mui/lab';
// utils
import {fDateTime} from '../../../utils/formatTime';

// ----------------------------------------------------------------------

WorkoutHistoryTimeline.propTypes = {
    title: PropTypes.string, subheader: PropTypes.string, list: PropTypes.array.isRequired,
};

export default function WorkoutHistoryTimeline({title, subheader, list, ...other}) {
    return (<Card {...other}>
        <CardHeader title={title} subheader={subheader}/>

        <CardContent
            sx={{
                '& .MuiTimelineItem-missingOppositeContent:before': {
                    display: 'none',
                },
            }}
        >
            <Timeline>
                {list.map((item, index) => (
                    <WorkoutItem key={item.id} item={item} isLast={index === list.length - 1}/>))}
            </Timeline>
        </CardContent>
    </Card>);
}

// ----------------------------------------------------------------------

WorkoutItem.propTypes = {
    isLast: PropTypes.bool, item: PropTypes.shape({
        time: PropTypes.instanceOf(Date), title: PropTypes.string, type: PropTypes.string,
    }),
};

function WorkoutItem({item, isLast}) {
    const {title, time} = item;
    return (<TimelineItem>
        <TimelineSeparator>
            <TimelineDot
                color={'primary'}
            />
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
