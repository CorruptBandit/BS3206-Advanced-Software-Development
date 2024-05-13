const FetchGoals = async (userId, task) => {
    try {
        const goalResponse = await fetch(`/api/getCollection?collection=goals&userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!goalResponse.ok) {
            console.log(`Failed to fetch goals`);
        }

        const goals = await goalResponse.json();
        const goal = goals.find((g) => g.goalName === task.label);

        if (!goal) {
            console.log(`Failed to fetch goals`);
        }
        return goal;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

export default FetchGoals;
