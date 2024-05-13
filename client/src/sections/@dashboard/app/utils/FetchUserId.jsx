const fetchUserIdByEmail = async (email) => {
    try {
        const userResponse = await fetch(`/api/getCollection?collection=users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!userResponse.ok) {
            console.log('Failed to fetch user data');
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

export default fetchUserIdByEmail;
