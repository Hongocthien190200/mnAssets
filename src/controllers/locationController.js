const Location = require('../Models/Location');
const locationController = {
    show: async (req, res) => {
        try {
            const locations = await Location.find();
            res.status(200).json(locations);
        } catch (err) {
            res.status(400).json({ message: 'Failed to get locations', error: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const location = new Location(req.body);
            await location.save();
            res.status(201).json(location);
        } catch (err) {
            res.status(400).json({ message: 'Failed to create location', error: err.message });
        }
    },
}
module.exports = locationController;
