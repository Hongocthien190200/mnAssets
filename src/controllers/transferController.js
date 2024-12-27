const TransferRecord = require('../models/TransferRecord');
const departmentController = {

    transferAsset: async (req, res) => {
        try {
            const transfer = new TransferRecord(req.body);
            await transfer.save();
            res.status(201).json(transfer);
        } catch (err) {
            res.status(400).json({ message: 'Failed to transfer asset', error: err.message });
        }
    },
    getAllTransfers: async (req, res) => {
        try {
            const transfers = await TransferRecord.find().populate('asset fromLocation toLocation');
            res.status(200).json(transfers);
        } catch (err) {
            res.status(400).json({ message: 'Failed to get transfer records', error: err.message });
        }
    },
}
module.exports = departmentController;
