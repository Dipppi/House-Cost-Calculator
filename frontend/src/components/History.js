import React, { useEffect, useState } from "react";
import "./History.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const History = () => {
    const [data, setData] = useState([]);
    const [favorites, setFavorites] = useState([]); // ⭐ NEW STATE
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();

        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/cost-estimates");
            const result = await res.json();
            setData(result);
        } catch (err) {
            alert("Error fetching history");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (index) => {
        const element = document.getElementById(`pdf-${index}`);

        if (!element) {
            alert("PDF content not found");
            return;
        }

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`estimate-${index + 1}.pdf`);
    };

    const toggleFavorite = (item) => {
        let updated;

        const exists = favorites.find(fav => fav._id === item._id);

        if (exists) {
            updated = favorites.filter(fav => fav._id !== item._id);
        } else {
            updated = [...favorites, item];
        }

        setFavorites(updated); 
        localStorage.setItem("favorites", JSON.stringify(updated));
    };

    const isFavorite = (id) => {
        return favorites.some(fav => fav._id === id);
    };

    return (
        <div className="history-page">
            <h2>Saved Estimates</h2>

            {loading ? (
                <p>Loading...</p>
            ) : data.length === 0 ? (
                <p>No data yet</p>
            ) : (
                <div className="history-container">
                    {data.map((item, index) => (
                        <div key={item._id || index} className="history-card">

                            <div id={`pdf-${index}`} className="pdf-content">
                                <h3>Estimate #{index + 1}</h3>

                                <p><b>Floors:</b> {item.floors}</p>
                                <p><b>Area:</b> {item.area} sq ft</p>
                                <p><b>Bedrooms:</b> {item.bedrooms}</p>
                                <p><b>Washrooms:</b> {item.washrooms}</p>
                                <p><b>Quality:</b> {item.quality}</p>

                                <h4>
                                    ₹ {item.costBreakdown?.totalCost?.toLocaleString("en-IN")}
                                </h4>
                            </div>

                            <div className="button-group">
                                <button onClick={() => handleDownload(index)}>
                                    Download PDF
                                </button>

                                <button onClick={() => toggleFavorite(item)}>
                                    {isFavorite(item._id)
                                        ? "⭐ Favorited"
                                        : "☆ Add to Favorites"}
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;