import PropTypes from 'prop-types';
import {useState} from 'react';
import {
    Stack,
    Checkbox,
    FormControlLabel,
    IconButton,
    Popover,
    MenuItem,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CardHeader,
    Card
} from '@mui/material';
import Iconify from '../../../components/iconify';
import {Controller, useForm} from "react-hook-form";

AppGoals.propTypes = {
    title: PropTypes.string, subheader: PropTypes.string, list: PropTypes.array.isRequired,
};

export default function AppGoals({title, subheader, list, ...other}) {
    const {control} = useForm({
        defaultValues: {
            taskCompleted: ['2'],
        },
    });

    return (<Card {...other}>
        <CardHeader title={title} subheader={subheader}/>
        <Controller
            name="taskCompleted"
            control={control}
            render={({field}) => {
                const onSelected = (task) => field.value.includes(task) ? field.value.filter((value) => value !== task) : [...field.value, task];

                return (<>
                    {list.map((task) => (<GoalItem
                        key={task.id}
                        task={task}
                        checked={field.value.includes(task.id)}
                        onChange={() => field.onChange(onSelected(task.id))}
                    />))}
                </>);
            }}
        />
    </Card>);
}

GoalItem.propTypes = {
    checked: PropTypes.bool, onChange: PropTypes.func, task: PropTypes.shape({
        id: PropTypes.string, label: PropTypes.string,
    }),
};

function GoalItem({task, checked, onChange}) {
    const [open, setOpen] = useState(null);
    const [goalName, setGoalName] = useState('');
    const [achieveByDate, setAchieveByDate] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addClicked, setAddClicked] = useState(false); // State to track if "Add" button has been clicked

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleMarkComplete = () => {
        handleCloseMenu();
        console.log('MARK COMPLETE', task.id);
    };

    const handleGoal = () => {
        handleCloseMenu();
        setDialogOpen(true);
    };

    const handleEdit = () => {
        handleCloseMenu();
        console.log('EDIT', task.id);
    };

    const handleDelete = () => {
        handleCloseMenu();
        console.log('DELETE', task.id);
    };

    const handleAddClick = () => {
        setAddClicked(true);
        const isFutureDate = new Date(achieveByDate) > new Date();
        const isGoalNameValid = !!goalName;

        if (isFutureDate && isGoalNameValid) {
            console.log('New Goal:', goalName);
            handleDialogClose();
        } else {
            if (!isFutureDate) {
                console.log('Date must be in the future');
            }
            if (!isGoalNameValid) {
                console.log('Goal name cannot be empty');
            }
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setGoalName('');
        setAchieveByDate('');
        setAddClicked(false);
    };

    return (<Stack
            direction="row"
            sx={{
                px: 2, py: 0.75, ...(checked && {
                    color: 'text.disabled', textDecoration: 'line-through',
                }),
            }}
        >
            <FormControlLabel
                control={<Checkbox checked={checked} onChange={onChange}/>}
                label={task.label}
                sx={{flexGrow: 1, m: 0}}
            />

            <IconButton size="large" color="inherit" sx={{opacity: 0.48}} onClick={handleOpenMenu}>
                <Iconify icon={'eva:more-vertical-fill'}/>
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 1, '& .MuiMenuItem-root': {
                            px: 1, typography: 'body2', borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={handleGoal}>
                    <Iconify icon={'eva:plus-circle-fill'} sx={{mr: 2}}/>
                    Add Goal
                </MenuItem>
                <MenuItem onClick={handleMarkComplete}>
                    <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{mr: 2}}/>
                    Mark Complete
                </MenuItem>

                <MenuItem onClick={handleEdit}>
                    <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
                    Edit
                </MenuItem>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <MenuItem onClick={handleDelete} sx={{color: 'error.main'}}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Goal Name"
                        fullWidth
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        error={!goalName && addClicked} // Show error after add button clicked
                        helperText={!goalName && addClicked ? "Goal name cannot be empty" : ""}
                    />
                    <TextField
                        margin="dense"
                        label="Date to be achieved by"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={achieveByDate}
                        onChange={(e) => setAchieveByDate(e.target.value)}
                        inputProps={{
                            min: new Date().toISOString().split("T")[0],
                        }}
                        error={achieveByDate && new Date(achieveByDate) <= new Date()}
                        helperText={achieveByDate && new Date(achieveByDate) <= new Date() ? "Date must be in the future" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleAddClick}>Add</Button>
                </DialogActions>
            </Dialog>
        </Stack>);
}

