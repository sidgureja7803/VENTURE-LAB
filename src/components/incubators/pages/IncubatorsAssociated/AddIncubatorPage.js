// AddIncubatorPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ventureLabImage from "./Venture Lab.png";
import { Button } from "@material-ui/core";
import { Save } from "@material-ui/icons";

const AddIncubatorPage = () => {
  const [selectedCards, setSelectedCards] = useState([]);

  const handleSave = () => {
    console.log("Selected Cards:", selectedCards);
  };

  return (
    <div className="add-incubator-page-container">
      <div className="search-bar">
        {/* Implement your search bar here */}
        <input type="text" placeholder="Search..." />
      </div>
      <div className="incubator-cards">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="incubator-card">
            <div className="card-top-right">
              <input
                type="checkbox"
                checked={selectedCards.includes(index)}
                onChange={() => {
                  if (selectedCards.includes(index)) {
                    setSelectedCards(selectedCards.filter((card) => card !== index));
                  } else {
                    setSelectedCards([...selectedCards, index]);
                  }
                }}
              />
            </div>
            <div className="card-content">
              <div className="logo-container">
                <img src={ventureLabImage} alt="Logo" className="logo-preview" />
              </div>
              <div className="name-container">Venture Lab</div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="contained" color="primary" onClick={handleSave} endIcon={<Save />}>
        Save
      </Button>
    </div>
  );
};

export default AddIncubatorPage;
