const db = require('../db');

// Add School
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Insert school into database
        await db.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: 'School added successfully' });
    } catch (err) {
        console.error('Error adding school:', err.message);
        res.status(500).json({ error: 'Database error while adding school' });
    }
};

// List Schools (Sorted by distance)
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validation
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        // Fetch all schools
        const [schools] = await db.execute('SELECT * FROM schools');

        // Haversine formula to calculate distance
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }

        // Add distance to each school & sort
        const sortedSchools = schools.map(school => {
            const distance = calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                school.latitude,
                school.longitude
            );
            return { ...school, distance: parseFloat(distance.toFixed(2)) };
        }).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (err) {
        console.error('Error listing schools:', err.message);
        res.status(500).json({ error: 'Database error while fetching schools' });
    }
};
