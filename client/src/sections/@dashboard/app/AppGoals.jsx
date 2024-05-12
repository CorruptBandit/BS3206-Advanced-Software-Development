import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
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
    Card,
    Typography
} from '@mui/material';

import Iconify from '../../../components/iconify';
import {useAuth} from "../../../context/AuthContext";

AppGoals.propTypes = {
    title: PropTypes.string, subheader: PropTypes.string, list: PropTypes.array.isRequired,
};

export default function AppGoals({title, subheader, list, ...other}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [achieveByDate, setAchieveByDate] = useState(null); // Initialize to null
    const [addClicked, setAddClicked] = useState(false);
    const {email} = useAuth();

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
        setAchieveByDate(null);
        setAddClicked(false);
    };

    const handleAddClick = async () => {
        const isFutureDate = achieveByDate && new Date(achieveByDate) > new Date();
        const isGoalNameValid = !!goalName;

        if (isFutureDate && isGoalNameValid) {
            try {
                await addGoal("goals", goalName, achieveByDate);
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
        <Button
            variant="outlined"
            color="primary"
            size="medium"
            startIcon={<Iconify icon={'eva:plus-circle-fill'}/>}
            onClick={handleGoal}
        >
            Add Goal
        </Button>
        <Stack direction="column">
            {list.map((goal, index) => {
                return (<GoalItem
                    key={index}
                    task={{
                        id: index.toString(), label: goal.goalName, achieveByDate: goal.achieveByDate
                    }}
                    checked={false}
                    onChange={() => {
                    }}
                />);
            })}
        </Stack>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Add a New Goal</DialogTitle>
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
                    value={achieveByDate || ''}
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

AppGoals.propTypes = {
    title: PropTypes.string, subheader: PropTypes.string, list: PropTypes.array.isRequired,
};

function GoalItem({task, onChange}) {
    const [open, setOpen] = useState(null);
    const [checked, setChecked] = useState(task.completed || false);
    const [newGoalName, setNewGoalName] = useState(task.label);
    const [newAchieveByDate, setNewAchieveByDate] = useState(task.achieveByDate);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const {email} = useAuth();

    const fetchUserIdByEmail = async (email) => {
        try {
            const userResponse = await fetch(`/api/getCollection?collection=users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();
            const currentUser = userData.find(user => user.email === email);

            if (!currentUser) {
                console.error('User data not found for email:', email);
                return null;
            }

            return currentUser._id;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    };


    useEffect(() => {
        const storedCompletedStatus = localStorage.getItem(`goal_${task.id}_completed`);
        if (storedCompletedStatus !== null) {
            setChecked(storedCompletedStatus === 'true');
        }
    }, [task.id]);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setChecked(isChecked);
        onChange(isChecked);
        handleMarkComplete()
        localStorage.setItem(`goal_${task.id}_completed`, isChecked.toString());
    };

    const handleMarkComplete = async () => {
        handleCloseMenu();
        try {
            const userId = await fetchUserIdByEmail(email);
            if (!userId) return;

            const goalResponse = await fetch(`/api/getCollection?collection=goals&userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!goalResponse.ok) {
                throw new Error(`Failed to fetch goals`);
            }

            const goals = await goalResponse.json();
            const goal = goals.find((g) => g.goalName === task.label);

            if (!goal) {
                throw new Error(`Goal not found`);
            }

            const newCompletedStatus = !goal.completed;

            const updateGoalResponse = await fetch(`/api/updateDocument?collection=goals&docId=${goal._id}`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`,
                }, body: JSON.stringify({completed: newCompletedStatus}),
            });

            if (!updateGoalResponse.ok) {
                throw new Error(`Failed to update goal status`);
            }

            onChange();
        } catch (error) {
            console.error('Error toggling goal status:', error);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this goal?');
        try {
            if (confirmed) {
                const userId = await fetchUserIdByEmail(email);
                if (!userId) return;

                const goalResponse = await fetch(`/api/getCollection?collection=goals&userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!goalResponse.ok) {
                    throw new Error(`Failed to fetch goals`);
                }

                const goals = await goalResponse.json();
                const goal = goals.find((g) => g.goalName === task.label);

                if (!goal) {
                    throw new Error(`Goal not found`);
                }

                const response = await fetch(`/api/deleteDocument?collection=goals&docId=${goal._id}`, {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete goal`);
                }
            } else {
                handleCloseMenu();
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const handleEdit = async () => {
        handleCloseMenu();
        setEditDialogOpen(true);
    };

    const handleSaveChanges = async () => {
        try {
            const userId = await fetchUserIdByEmail(email);
            if (!userId) return;

            const goalResponse = await fetch(`/api/getCollection?collection=goals&userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!goalResponse.ok) {
                throw new Error(`Failed to fetch goals`);
            }

            const goals = await goalResponse.json();
            const goal = goals.find((g) => g.goalName === task.label);

            if (!goal) {
                throw new Error(`Goal not found`);
            }

            const updatedGoal = {
                goalName: newGoalName, achieveByDate: newAchieveByDate,
            };

            console.log(updatedGoal);

            const updateGoalResponse = await fetch(`/api/updateDocument?collection=goals&docId=${goal._id}`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`,
                }, body: JSON.stringify(updatedGoal),
            });

            if (!updateGoalResponse.ok) {
                throw new Error(`Failed to update goal`);
            }

            // Close the edit dialog
            setEditDialogOpen(false);

            // Trigger a refresh of the goal list if needed
            onChange();
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
    };

    return (<Stack
        direction="column"
        sx={{
            px: 2, py: 0.75, ...(checked && {
                color: 'text.disabled', textDecoration: 'line-through',
            }),
        }}
    >
        <Stack direction="row" alignItems="center">
            <FormControlLabel
                control={<Checkbox checked={checked} onChange={handleCheckboxChange}/>}
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
        </Stack>

        <Typography variant="body2" color="text.secondary">
            Achieve by Date: {task.achieveByDate}
        </Typography>

        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Goal Name"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Achieve by Date"
                    type="date"
                    value={newAchieveByDate}
                    onChange={(e) => setNewAchieveByDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEditDialog}>Cancel</Button>
                <Button onClick={handleSaveChanges} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    </Stack>);
}

GoalItem.propTypes = {
    checked: PropTypes.bool, onChange: PropTypes.func, task: PropTypes.shape({
        id: PropTypes.string, label: PropTypes.string, achieveByDate: PropTypes.string,
    }),
};
