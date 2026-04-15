
const mongoose = require('mongoose');

const costEstimateSchema = new mongoose.Schema({
    floors: { type: Number, required: true },
    area: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    washrooms: { type: Number, required: true },
    quality: { type: String, enum: ['basic', 'medium', 'high'], required: true },
    costBreakdown: {
        brickCost: { type: Number, required: true },
        cementCost: { type: Number, required: true },
        steelCost: { type: Number, required: true },
        sanitaryCost: { type: Number, required: true },
        laborCost: { type: Number, required: true },
        paintCost: { type: Number, required: true },
        electricalCost: { type: Number, required: true },
        plumbingCost: { type: Number, required: true },
        tilesCost: { type: Number, required: true },
        woodworkCost: { type: Number, required: true },
        miscellaneousCost: { type: Number, required: true },
        totalCost: { type: Number, required: true },
    },
}, { timestamps: true });

module.exports = mongoose.model('CostEstimate', costEstimateSchema);