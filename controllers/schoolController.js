const db = require('../db');

// Add School
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        await db.execute('INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)', [name, address, latitude, longitude]);
        res.status(201).json({ message: 'School added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List Schools (with Haversine formula)
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    try {
        const [schools] = await db.execute('SELECT * FROM schools');

        // Haversine formula to calculate distance in km
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c; // Distance in km
        }

        const sorted = schools.map(school => {
            const distance = calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                school.latitude,
                school.longitude
            );
            return { ...school, distance: parseFloat(distance.toFixed(2)) }; // Rounded to 2 decimal places
        }).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sorted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
