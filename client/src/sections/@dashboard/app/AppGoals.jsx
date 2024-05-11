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
import {useAuth} from "../../../context/AuthContext";

AppGoals.propTypes = {
    title: PropTypes.string, subheader: PropTypes.string, list: PropTypes.array.isRequired,
};

export default function AppGoals({title, subheader, list, ...other}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [achieveByDate, setAchieveByDate] = useState('');
    const [addClicked, setAddClicked] = useState(false);
    const {email} = useAuth()
    const {control} = useForm({
        defaultValues: {
            taskCompleted: ['2'],
        },
    });


    const addGoal = async (collection, goalName, achieveByDate) => {
        try {
            const user_response = await fetch(`/api/getCollection?collection=users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const userData = await user_response.json();
            const user = userData.find(user => user.email === email);
            const userId = user ? user._id : null;
            const completed = false;

            const goalData = {
                goalName: goalName, achieveByDate: achieveByDate, userId: userId, completed: completed
            };

            const response = await fetch(`/api/insertDocument?collection=${collection}`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`,
                }, body: JSON.stringify(goalData),
            });

            if (!response.ok) {
                throw new Error(`Failed to add goal to ${collection}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error adding goal to ${collection}:`, error);
            throw error;
        }
    };

    const handleGoal = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setGoalName('');
        setAchieveByDate();
        setAddClicked(false);
    };

    const handleAddClick = async () => {
        const isFutureDate = new Date(achieveByDate) > new Date();
        const isGoalNameValid = !!goalName;

        if (isFutureDate && isGoalNameValid) {
            try {
                const addedGoal = await addGoal("goals", {goalName, achieveByDate});
                console.log("Goal added successfully:", addedGoal);
                handleDialogClose();
            } catch (error) {
                console.error("Failed to add goal:", error);
            }
        } else {
            if (!isFutureDate) {
                console.log('Date must be in the future');
            }
            if (!isGoalNameValid) {
                console.log('Goal name cannot be empty');
            }
        }
    };


    return (<Card {...other}>
        <CardHeader title={title} subheader={subheader}/>
        <Stack direction="column">
            <Stack direction="row" alignItems="center" sx={{px: 2}}>
                <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    startIcon={<Iconify icon={'eva:plus-circle-fill'}/>}
                    onClick={handleGoal}
                >
                    Add Goal
                </Button>
            </Stack>
            <Controller
                name="taskCompleted"
                control={control}
                render={({field}) => {
                    const onSelected = (task) => field.value.includes(task) ? field.value.filter((value) => value !== task) : [...field.value, task];

                    return (<>
                        {list.map((task, index) => (<GoalItem
                                key={index}
                                task={task}
                                checked={field.value.includes(task.id)}
                                onChange={() => field.onChange(onSelected(task.id))}
                            />))}
                    </>);
                }}
            />
        </Stack>
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
                    error={addClicked && !goalName.trim()}
                    helperText={addClicked && !goalName.trim() ? "Goal name cannot be empty" : ""}
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
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleAddClick}>Add</Button>
            </DialogActions>
        </Dialog>
    </Card>);
}
GoalItem.propTypes = {
    checked: PropTypes.bool, onChange: PropTypes.func, task: PropTypes.shape({
        id: PropTypes.string, label: PropTypes.string,
    }),
};

function GoalItem({task, checked, onChange}) {
    const [open, setOpen] = useState(null);


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

    const handleEdit = () => {
        handleCloseMenu();
        console.log('EDIT', task.id);
    };

    const handleDelete = () => {
        handleCloseMenu();
        console.log('DELETE', task.id);
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

    </Stack>);
}

