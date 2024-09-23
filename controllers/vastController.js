// controllers/vastController.js
const vastService = require('../services/vastService');
const VAST = require('../models/VAST');

// Parse XML and store in DB
exports.parseAndStoreVAST = async (req, res) => {
    try {
        const { url } = req.body;
        const xmlData = await vastService.readXmlFromUrl(url);
        const parsedData = await vastService.parseXmlData(xmlData);
        const storedData = await vastService.storeParsedData(parsedData);
        res.status(200).json(storedData);
    } catch (err) {
        res.status(500).json({ message: 'Error processing VAST data', error: err.message });
    }
};

// Get VAST data by ID
exports.getVASTById = async (req, res) => {
    try {
        const vast = await VAST.findOne({ id: req.params.id });
        if (!vast) return res.status(404).json({ message: 'VAST not found' });
        res.status(200).json(vast);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching VAST data', error: err.message });
    }
};
