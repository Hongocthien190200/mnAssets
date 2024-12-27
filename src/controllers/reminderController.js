const MaintenanceReminder = require('../models/MaintenanceReminder');
const reminderController = {
    create: async (req, res) => {
        try {
            const reminder = new MaintenanceReminder(req.body);
            await reminder.save();
            res.status(201).json(reminder);
        } catch (err) {
            res.status(400).json({ message: 'Failed to create reminder', error: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const reminder = await MaintenanceReminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
            res.status(200).json(reminder);
        } catch (err) {
            res.status(400).json({ message: 'Failed to update reminder', error: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            await MaintenanceReminder.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Reminder deleted' });
        } catch (err) {
            res.status(400).json({ message: 'Failed to delete reminder', error: err.message });
        }
    },
    show: async (req, res) => {
        try {
            const reminders = await MaintenanceReminder.find().populate('asset');
            res.status(200).json(reminders);
        } catch (err) {
            res.status(400).json({ message: 'Failed to get reminders', error: err.message });
        }
    },
}
module.exports = reminderController;
