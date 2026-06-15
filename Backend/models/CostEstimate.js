const mongoose = require('mongoose');

const costEstimateSchema = new mongoose.Schema({
  floors: Number,
  area: Number,
  bedrooms: Number,
  washrooms: Number,
  quality: String,
  costBreakdown: {
    brickCost: Number,
    cementCost: Number,
    steelCost: Number,
    sanitaryCost: Number,
    laborCost: Number,
    paintCost: Number,
    electricalCost: Number,
    plumbingCost: Number,
    tilesCost: Number,
    woodworkCost: Number,
    miscellaneousCost: Number,
    totalCost: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('CostEstimate', costEstimateSchema);