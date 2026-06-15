import React, { useEffect, useState } from "react";
import "./History.css"; 
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(stored);
    }, []);

    const removeFavorite = (id) => {
        const updated = favorites.filter(item => item._id !== id);
        setFavorites(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
    };

    const handleDownload = async (index) => {
        const element = document.getElementById(`fav-pdf-${index}`);

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
        pdf.save(`favorite-${index + 1}.pdf`);
    };

    return (
        <div className="history-page">
            <h2>⭐ Favorite Estimates</h2>

            {favorites.length === 0 ? (
                <p>No favorites yet</p>
            ) : (
                <div className="history-container">
                    {favorites.map((item, index) => (
                        <div key={item._id || index} className="history-card">

                            <div id={`fav-pdf-${index}`} className="pdf-content">
                                <h3>Favorite #{index + 1}</h3>

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

                                <button onClick={() => removeFavorite(item._id)}>
                                    Remove
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;