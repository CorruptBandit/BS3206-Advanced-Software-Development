const FetchCollection = async (collection) => {
    try {
        const response = await fetch(`/api/getCollection?collection=${collection}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch ${collection}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${collection}:`, error);
        throw error;
    }
};

export default FetchCollection;