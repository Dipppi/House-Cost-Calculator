import React, { useState } from 'react';
import './Calculator.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

const Calculator = () => {
    const [floors, setFloors] = useState('');
    const [area, setArea] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [washrooms, setWashrooms] = useState('');
    const [quality, setQuality] = useState('basic');
    const [costBreakdown, setCostBreakdown] = useState(null);
    const [loading, setLoading] = useState(false);

    const formatINR = (num) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num);

    const handleCalculate = () => {
        const parsedFloors = Number(floors);
        const parsedArea = Number(area);
        const parsedBedrooms = Number(bedrooms);
        const parsedWashrooms = Number(washrooms);

        // 🔴 BASIC VALIDATION
        if (
            parsedFloors <= 0 ||
            parsedArea <= 0 ||
            parsedBedrooms < 0 ||
            parsedWashrooms < 0 ||
            isNaN(parsedFloors) ||
            isNaN(parsedArea)
        ) {
            alert("Please enter valid values!");
            return;
        }

        // 🔥 REAL-WORLD VALIDATION (IMPORTANT)
        if (parsedFloors > 5) {
            alert("Max 5 floors allowed");
            return;
        }

        if (parsedArea < 200) {
            alert("Minimum area should be 200 sq ft");
            return;
        }

        if (parsedArea > 10000) {
            alert("Area too large");
            return;
        }

        if (parsedBedrooms > 10) {
            alert("Too many bedrooms");
            return;
        }

        if (parsedWashrooms > parsedBedrooms + 2) {
            alert("Washrooms unrealistic compared to bedrooms");
            return;
        }

        const prices = {
            basic: {
                brick: 6, cement: 40, steel: 80, sanitary: 300,
                labor: 150, paint: 70, electrical: 90,
                plumbing: 100, tiles: 50, woodwork: 200, miscellaneous: 50,
            },
            medium: {
                brick: 10, cement: 42, steel: 100, sanitary: 600,
                labor: 250, paint: 100, electrical: 120,
                plumbing: 120, tiles: 100, woodwork: 300, miscellaneous: 100,
            },
            high: {
                brick: 20, cement: 65, steel: 120, sanitary: 1200,
                labor: 350, paint: 150, electrical: 150,
                plumbing: 150, tiles: 200, woodwork: 500, miscellaneous: 150,
            },
        };

        const totalArea = parsedFloors * parsedArea;
        const selected = prices[quality];

        const steelMultiplier = 1 + (parsedBedrooms * 0.1) + (parsedWashrooms * 0.05);

        const brickCost = totalArea * selected.brick;
        const cementCost = totalArea * selected.cement;
        const steelCost = totalArea * selected.steel * steelMultiplier;
        const laborCost = totalArea * selected.labor;
        const paintCost = totalArea * selected.paint;
        const electricalCost = totalArea * selected.electrical;
        const plumbingCost = totalArea * selected.plumbing;
        const tilesCost = totalArea * selected.tiles;
        const miscellaneousCost = totalArea * selected.miscellaneous;

        const sanitaryCost = (parsedBedrooms + parsedWashrooms) * selected.sanitary;
        const woodworkCost = parsedBedrooms * selected.woodwork;

        const totalCost =
            brickCost + cementCost + steelCost + sanitaryCost +
            laborCost + paintCost + electricalCost +
            plumbingCost + tilesCost + woodworkCost + miscellaneousCost;

        const breakdown = {
            brickCost, cementCost, steelCost, sanitaryCost,
            laborCost, paintCost, electricalCost,
            plumbingCost, tilesCost, woodworkCost,
            miscellaneousCost, totalCost,
        };

        setCostBreakdown(breakdown);

        // ✅ send to backend
        sendDataToServer({
            floors: parsedFloors,
            area: parsedArea,
            bedrooms: parsedBedrooms,
            washrooms: parsedWashrooms,
            quality,
            costBreakdown: breakdown
        });
    };

    const sendDataToServer = async (data) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/cost-estimates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Saved successfully!');
            } else {
                alert('Error saving data');
            }
        } catch (err) {
            alert('Server not running!');
        } finally {
            setLoading(false);
        }
    };

    const chartData = costBreakdown
        ? [
            { name: 'Brick', value: costBreakdown.brickCost },
            { name: 'Cement', value: costBreakdown.cementCost },
            { name: 'Steel', value: costBreakdown.steelCost },
            { name: 'Labor', value: costBreakdown.laborCost },
            { name: 'Finishing', value: costBreakdown.paintCost + costBreakdown.tilesCost },
        ]
        : [];

    return (
        <div className="calculator-page">
            <div className="calculator">

                <h2>Construction Cost Estimator</h2>

                <div className="input-group">
                    <label>Floors</label>
                    <input type="number" min="1" max="5"
                        value={floors}
                        onChange={(e) => setFloors(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Area (sq ft)</label>
                    <input type="number" min="200" max="10000"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Bedrooms</label>
                    <input type="number" min="0" max="10"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Washrooms</label>
                    <input type="number" min="0" max="10"
                        value={washrooms}
                        onChange={(e) => setWashrooms(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Quality</label>
                    <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                        <option value="basic">Basic</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <button onClick={handleCalculate} disabled={loading}>
                    {loading ? 'Saving...' : 'Calculate'}
                </button>

                {costBreakdown && (
                    <>
                        <div className="cost-breakdown">
                            <h3>Cost Breakdown</h3>

                            <p>Brick: {formatINR(costBreakdown.brickCost)}</p>
                            <p>Cement: {formatINR(costBreakdown.cementCost)}</p>
                            <p>Steel: {formatINR(costBreakdown.steelCost)}</p>
                            <p>Sanitary: {formatINR(costBreakdown.sanitaryCost)}</p>
                            <p>Labor: {formatINR(costBreakdown.laborCost)}</p>

                            <h4>Total: {formatINR(costBreakdown.totalCost)}</h4>
                        </div>

                        <div className="chart-container">
                            <PieChart width={300} height={300}>
                                <Pie data={chartData} dataKey="value" outerRadius={100} label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Calculator;