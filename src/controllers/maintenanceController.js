const MaintenanceRecord = require('../models/MaintenanceRecord');


const maintenanceController = {
    create: async (req, res) => {
        try {
            const record = new MaintenanceRecord(req.body);
            await record.save();
            res.status(201).json(record);
        } catch (err) {
            res.status(400).json({ message: 'Failed to create maintenance record', error: err.message });
        }
    },
    show: async (req, res) => {
        try {
            const records = await MaintenanceRecord.find().populate('asset');
            res.status(200).json(records);
        } catch (err) {
            res.status(400).json({ message: 'Failed to get maintenance records', error: err.message });
        }
    },
}
module.exports = maintenanceController;
