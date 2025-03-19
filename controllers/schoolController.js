const db = require('../db');

// Add School API
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validation: Ensure all fields are present and correctly formatted
    if (!name || !address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Latitude and Longitude must be valid numbers' });
    }

    try {
        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4)';
        await db.query(query, [name, address, lat, lon]);
        res.status(201).json({ message: 'School added successfully' });
    } catch (err) {
        console.error('Error adding school:', err.message);
        res.status(500).json({ error: 'Database error while adding school' });
    }
};

// List Schools API (Sorted by Proximity)
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validation
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Latitude and Longitude must be valid numbers' });
    }

    try {
        const result = await db.query('SELECT * FROM schools');
        const schools = result.rows;

        if (!schools.length) {
            return res.status(404).json({ message: 'No schools found' });
        }

        // Haversine formula for distance calculation
        const toRad = (angle) => (angle * Math.PI) / 180;
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Radius of the Earth in km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        // Add distance field and sort schools
        const sortedSchools = schools
            .map((school) => ({
                ...school,
                distance: calculateDistance(lat, lon, school.latitude, school.longitude).toFixed(2),
            }))
            .sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (err) {
        console.error('Error listing schools:', err.message);
        res.status(500).json({ error: 'Database error while fetching schools' });
    }
};
