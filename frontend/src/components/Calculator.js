import React, { useState, useEffect } from 'react';
import './Calculator.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Chatbot from './Chatbot';

const COLORS = ["#f4a261", "#2a9d8f", "#e76f51", "#264653", "#e9c46a", "#8ab17d", "#6d597a", "#ffb703"];

const delhiAreaRates = {
    "Saket": { basic: 3290, medium: 3600, high: 3900 },
    "Vasant Kunj": { basic: 3400, medium: 3700, high: 4000 },
    "Vasant Vihar": { basic: 3500, medium: 3800, high: 4200 },
    "Greater Kailash": { basic: 3400, medium: 3700, high: 4000 },
    "Defence Colony": { basic: 3600, medium: 3900, high: 4200 },
    "Hauz Khas": { basic: 3500, medium: 3800, high: 4100 },
    "Green Park": { basic: 3400, medium: 3700, high: 4000 },
    "Malviya Nagar": { basic: 3300, medium: 3600, high: 3900 },
    "South Extension": { basic: 3500, medium: 3800, high: 4100 },
    "Safdarjung Enclave": { basic: 3400, medium: 3700, high: 4000 },
    "New Friends Colony": { basic: 3500, medium: 3800, high: 4100 },
    "Connaught Place": { basic: 3700, medium: 4000, high: 4300 },
    "Rohini": { basic: 3055, medium: 3300, high: 3600 },
    "Dwarka": { basic: 3173, medium: 3400, high: 3700 },
    "Janakpuri": { basic: 3100, medium: 3350, high: 3700 },
    "Pitampura": { basic: 3100, medium: 3350, high: 3600 },
    "Punjabi Bagh": { basic: 3300, medium: 3600, high: 3900 },
    "Rajouri Garden": { basic: 3200, medium: 3500, high: 3800 },
    "Paschim Vihar": { basic: 3100, medium: 3400, high: 3700 },
    "Vikaspuri": { basic: 3000, medium: 3300, high: 3600 },
    "Ashok Vihar": { basic: 3200, medium: 3500, high: 3800 },
    "Model Town": { basic: 3200, medium: 3500, high: 3800 },
    "Karol Bagh": { basic: 3200, medium: 3500, high: 3800 },
    "Patel Nagar": { basic: 3100, medium: 3400, high: 3700 },
    "Laxmi Nagar": { basic: 3000, medium: 3200, high: 3500 },
    "Mayur Vihar": { basic: 3000, medium: 3300, high: 3600 },
    "Preet Vihar": { basic: 3100, medium: 3300, high: 3600 },
    "Anand Vihar": { basic: 3100, medium: 3350, high: 3600 },
    "Krishna Nagar": { basic: 2900, medium: 3100, high: 3400 },
    "Shahdara": { basic: 2800, medium: 3000, high: 3300 },
    "Dilshad Garden": { basic: 2900, medium: 3100, high: 3400 },
    "Yamuna Vihar": { basic: 2900, medium: 3100, high: 3400 },
    "Vasundhara Enclave": { basic: 3000, medium: 3300, high: 3600 },
    "Narela": { basic: 2600, medium: 2800, high: 3100 },
    "Bawana": { basic: 2500, medium: 2700, high: 3000 },
    "Najafgarh": { basic: 2700, medium: 2900, high: 3200 },
    "Uttam Nagar": { basic: 2800, medium: 3000, high: 3300 },
    "Palam": { basic: 2900, medium: 3100, high: 3400 },
    "Mahipalpur": { basic: 3000, medium: 3200, high: 3500 },
    "Mehrauli": { basic: 3000, medium: 3300, high: 3600 },
    "Chhatarpur": { basic: 3100, medium: 3400, high: 3700 },
    "Okhla": { basic: 2900, medium: 3100, high: 3400 },
    "Badarpur": { basic: 2700, medium: 2900, high: 3200 },
    "Kalkaji": { basic: 3200, medium: 3500, high: 3800 },
    "Govindpuri": { basic: 2900, medium: 3100, high: 3400 },
    "Sarita Vihar": { basic: 3100, medium: 3400, high: 3700 },
    "Nehru Place": { basic: 3200, medium: 3500, high: 3800 },
    "Khanpur": { basic: 2800, medium: 3000, high: 3300 },
    "Sainik Farm": { basic: 3300, medium: 3600, high: 3900 }
};

const Calculator = () => {
    const [floors, setFloors] = useState('');
    const [area, setArea] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [washrooms, setWashrooms] = useState('');
    const [quality, setQuality] = useState('basic');
    const [location, setLocation] = useState('Saket');

    const [costBreakdown, setCostBreakdown] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState("");
    const [recommendation, setRecommendation] = useState(null);

    const formatINR = (num) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num);

    const generateAISuggestions = (totalCost) => {
        let suggestions = [];
        if (area < 800) suggestions.push("Consider fewer rooms for better space usage.");
        if (quality === "high" && totalCost > 5000000) suggestions.push("Switching to medium quality can reduce cost.");
        if (bedrooms > 4) suggestions.push("Too many bedrooms may reduce comfort.");
        if (washrooms > bedrooms + 1) suggestions.push("Too many washrooms compared to bedrooms.");
        return suggestions.join(". ");
    };

    const generateRecommendation = (area, floors) => {
        if (!area || !floors) return null;
        const parsedArea = Number(area);
        const recommendedBedrooms = Math.max(1, Math.floor(parsedArea / 200));
        const recommendedWashrooms = Math.max(1, Math.ceil(recommendedBedrooms / 2));
        return { bedrooms: recommendedBedrooms, washrooms: recommendedWashrooms };
    };

    useEffect(() => {
        setRecommendation(generateRecommendation(area, floors));
    }, [area, floors]);

    const handleCalculate = async () => {
        const parsedFloors = Number(floors);
        const parsedArea = Number(area);
        const parsedBedrooms = Number(bedrooms);
        const parsedWashrooms = Number(washrooms);

        if (!parsedFloors || !parsedArea) return alert("Enter valid values");

        if (parsedFloors < 1 || parsedFloors > 5) return alert("Floors must be between 1 and 5");

        if (parsedArea < 300) return alert("Minimum 300 sq ft per floor required");

        if (parsedArea > 10000) return alert("Area too large for residential construction");

        const totalArea = parsedFloors * parsedArea;

        const minBedrooms = parsedFloors;
        const usablePerFloor = parsedArea * 0.6;
        const maxBedroomsPerFloor = Math.floor(usablePerFloor / 150);
        const maxBedrooms = maxBedroomsPerFloor * parsedFloors;

        if (parsedBedrooms < minBedrooms) return alert(`Minimum ${minBedrooms} bedrooms required`);

        if (parsedBedrooms > maxBedrooms) return alert(`Maximum ${maxBedrooms} bedrooms allowed`);

        const minWashrooms = Math.ceil(parsedBedrooms / 2);
        const maxWashrooms = parsedBedrooms + 1;

        if (parsedWashrooms < minWashrooms) return alert(`Minimum ${minWashrooms} washrooms required`);

        if (parsedWashrooms > maxWashrooms) return alert(`Too many washrooms`);

        const bedroomsPerFloor = parsedBedrooms / parsedFloors;
        const washroomsPerFloor = parsedWashrooms / parsedFloors;

        if (bedroomsPerFloor > 3) return alert("Too many bedrooms per floor");

        if (washroomsPerFloor > 3) return alert("Too many washrooms per floor");

        if (bedroomsPerFloor * 120 > parsedArea * 0.7) return alert("Bedrooms exceed available space");

        if (washroomsPerFloor * 40 > parsedArea * 0.3) return alert("Washrooms exceed available space");

        const ratePerSqft = delhiAreaRates[location][quality];
        const totalCost = totalArea * ratePerSqft;

        const rates = {
            basic: { brick: 200, cement: 300, steel: 500, labor: 400, paint: 120, electrical: 150, plumbing: 130, tiles: 200, woodwork: 300, misc: 100 },
            medium: { brick: 300, cement: 400, steel: 700, labor: 600, paint: 200, electrical: 250, plumbing: 220, tiles: 350, woodwork: 500, misc: 200 },
            high: { brick: 450, cement: 550, steel: 1000, labor: 900, paint: 350, electrical: 400, plumbing: 350, tiles: 600, woodwork: 900, misc: 400 }
        };

        const selected = rates[quality];

        const brickCost = totalArea * selected.brick;
        const cementCost = totalArea * selected.cement;
        const steelCost = totalArea * selected.steel;
        const laborCost = totalArea * selected.labor;
        const paintCost = totalArea * selected.paint;
        const electricalCost = totalArea * selected.electrical;
        const plumbingCost = totalArea * selected.plumbing;
        const tilesCost = totalArea * selected.tiles;
        const woodworkCost = parsedBedrooms * selected.woodwork * 10;
        const sanitaryCost = parsedWashrooms * 20000;
        const miscellaneousCost = totalArea * selected.misc;

        const baseCost =
            brickCost + cementCost + steelCost + laborCost + paintCost +
            electricalCost + plumbingCost + tilesCost + woodworkCost +
            sanitaryCost + miscellaneousCost;

        const scaleFactor = totalCost / baseCost;

        const breakdown = {
            brickCost: brickCost * scaleFactor,
            cementCost: cementCost * scaleFactor,
            steelCost: steelCost * scaleFactor,
            laborCost: laborCost * scaleFactor,
            paintCost: paintCost * scaleFactor,
            electricalCost: electricalCost * scaleFactor,
            plumbingCost: plumbingCost * scaleFactor,
            tilesCost: tilesCost * scaleFactor,
            woodworkCost: woodworkCost * scaleFactor,
            sanitaryCost: sanitaryCost * scaleFactor,
            miscellaneousCost: miscellaneousCost * scaleFactor,
            totalCost
        };

        await fetch("http://localhost:5000/api/cost-estimates", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        floors: parsedFloors,
        area: parsedArea,
        bedrooms: parsedBedrooms,
        washrooms: parsedWashrooms,
        location,
        quality,
        costBreakdown: {
            totalCost
        }
    })
});

        setCostBreakdown(breakdown);
        setAiSuggestion(generateAISuggestions(totalCost));
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
        <div className="main-layout">
            <div className="left-panel">
                <h2>Construction Cost Estimator</h2>

                <input type="number" placeholder="Floors" onChange={(e) => setFloors(e.target.value)} />
                <input type="number" placeholder="Area (sq ft)" onChange={(e) => setArea(e.target.value)} />
                <input type="number" placeholder="Bedrooms" onChange={(e) => setBedrooms(e.target.value)} />
                <input type="number" placeholder="Washrooms" onChange={(e) => setWashrooms(e.target.value)} />

                {recommendation && (
                    <div style={{ marginTop: "10px", color: "#2ecc71" }}>
                        Recommended: {recommendation.bedrooms} bedrooms, {recommendation.washrooms} washrooms
                    </div>
                )}

                <select onChange={(e) => setQuality(e.target.value)}>
                    <option value="basic">Basic</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <select onChange={(e) => setLocation(e.target.value)}>
                    {Object.keys(delhiAreaRates).map((area) => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>

                <button onClick={handleCalculate}>Calculate</button>
            </div>

            {costBreakdown && (
                <div className="right-panel">
                    <h3>Total Cost: {formatINR(costBreakdown.totalCost)}</h3>

                    <div className="breakdown">
                        <p>Brick: {formatINR(costBreakdown.brickCost)}</p>
                        <p>Cement: {formatINR(costBreakdown.cementCost)}</p>
                        <p>Steel: {formatINR(costBreakdown.steelCost)}</p>
                        <p>Labor: {formatINR(costBreakdown.laborCost)}</p>
                        <p>Paint: {formatINR(costBreakdown.paintCost)}</p>
                        <p>Electrical: {formatINR(costBreakdown.electricalCost)}</p>
                        <p>Plumbing: {formatINR(costBreakdown.plumbingCost)}</p>
                        <p>Tiles: {formatINR(costBreakdown.tilesCost)}</p>
                        <p>Woodwork: {formatINR(costBreakdown.woodworkCost)}</p>
                        <p>Sanitary: {formatINR(costBreakdown.sanitaryCost)}</p>
                        <p>Misc: {formatINR(costBreakdown.miscellaneousCost)}</p>
                    </div>

                    <PieChart width={320} height={300}>
                        <Pie data={chartData} dataKey="value" outerRadius={100} label>
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            )}

            <Chatbot
                area={area}
                bedrooms={bedrooms}
                washrooms={washrooms}
                quality={quality}
                location={location}
                totalCost={costBreakdown?.totalCost}
            />
        </div>
    );
};

export default Calculator;