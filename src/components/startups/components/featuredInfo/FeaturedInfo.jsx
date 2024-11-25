
import React, { useState, useEffect } from "react";
import { Business, TrendingUp, People, AccessTime } from "@material-ui/icons";
import "./featuredInfo.css";

export default function FeaturedInfo() {
  const [incubatorFunding, setIncubatorFunding] = useState(0);
  const [externalFunding, setExternalFunding] = useState(0);
  const [teamMembers, setTeamMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incubatorResponse = await fetch("https://incubator-crm.onrender.com/startup/incubatorfunding/", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
            }`,
          },
        });
        if (!incubatorResponse.ok) {
          throw new Error("Failed to fetch incubator funding data");
        }
        const incubatorData = await incubatorResponse.json();
        const totalIncubatorFunding = incubatorData.reduce((acc, curr) => acc + curr.amount, 0);
        setIncubatorFunding(totalIncubatorFunding);

        const externalResponse = await fetch("https://incubator-crm.onrender.com/startup/externalfunding/", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
            }`,
          },
        });
        if (!externalResponse.ok) {
          throw new Error("Failed to fetch external funding data");
        }
        const externalData = await externalResponse.json();
        const totalExternalFunding = externalData.reduce((acc, curr) => acc + curr.amount, 0);
        setExternalFunding(totalExternalFunding);

        const teamResponse = await fetch("https://incubator-crm.onrender.com/startup/people/", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
            }`,
          },
        });
        if (!teamResponse.ok) {
          throw new Error("Failed to fetch team members data");
        }
        const teamData = await teamResponse.json();
        setTeamMembers(teamData.length);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardsData = [
    { title: "Incubator Funding", value: incubatorFunding, icon: <Business />, unit: "Startups" },
    { title: "External Funding", value: externalFunding, icon: <TrendingUp />, unit: "Startups" },
    { title: "Team Members", value: teamMembers, icon: <People />, unit: "members" },
    { title: "Age of Startup", value: 4, icon: <AccessTime />, unit: "years" },
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
