const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const CostEstimate = require('./models/costestimate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // ✅ modern way

mongoose.connect('mongodb://localhost:27017/construction-cost-estimator')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.post('/api/cost-estimates', async (req, res) => {
    try {
        const costEstimate = new CostEstimate(req.body);
        await costEstimate.save();
        res.status(201).json(costEstimate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/cost-estimates', async (req, res) => {
    try {
        const data = await CostEstimate.find().sort({ createdAt: -1 }); // ✅ better
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});