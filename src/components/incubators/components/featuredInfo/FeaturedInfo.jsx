





import React, { useState, useEffect } from "react";
import { Business, TrendingUp, People, AccessTime } from "@material-ui/icons";
import "./featuredInfo.css";
import axios from "axios";

export default function FeaturedInfo() {
  const [partnerCount, setPartnerCount] = useState(0);
  const [incubatedStartupsCount, setIncubatedStartupsCount] = useState(0);
  const [teamMembersCount, setTeamMembersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnersResponse = await axios.get(
          "https://incubator-crm.onrender.com/incubator/partners/ " ,  {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
        );
        const startupsResponse = await axios.get(
          "https://incubator-crm.onrender.com/incubator/startupincubator/" ,  {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
        );
        const peopleResponse = await axios.get(
          "https://incubator-crm.onrender.com/incubator/people/" ,  {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
        );

        setPartnerCount(partnersResponse.data.length);
        setIncubatedStartupsCount(startupsResponse.data.length);
        setTeamMembersCount(peopleResponse.data.length);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();      
  }, []);

  const cardsData = [
    { title: "No of partners ", value: partnerCount, icon: <Business />, unit: "Partners" },
    { title: "Incubated Startups", value: incubatedStartupsCount, icon: <TrendingUp />, unit: "Startups" },
    { title: "Age of Incubator", value: 3, icon: <AccessTime />, unit: "years" },
    { title: "No of team members", value: teamMembersCount, icon: <People />, unit: "Members" },
  ];

  return (
    <div className="featured">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        cardsData.map((card, index) => (
          <div key={index} className="featuredItem">
            <div className="featuredTitle">
              {card.title}
              <div className="iconContainer">{card.icon}</div>
            </div>
            <div className="featuredMoneyContainer">
              <span className="featuredMoney">{card.value}</span>
            </div>
            <span className="featuredSub">{`Total ${card.unit}`}</span>
          </div>
        ))
      )}
    </div>
  );
}
