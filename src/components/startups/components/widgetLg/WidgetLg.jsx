


import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import "./widgetLg.css";
import dummyImg from "./dummyImg.png"; // Import a dummy image placeholder

export default function WidgetLg() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
                                                
  const fetchData = async () => {
    try {                                                       
      const response = await axios.get("https://incubator-crm.onrender.com/startup/people/" , {
        headers: {
           Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          }, // Replace YOUR_TOKEN with your actual token
      });
      setPeople(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // return (
//     <div className="widgetLg">
//       <h3 className="widgetLgTitle">Founder People Info</h3>
//       <div className="founderList">
//         {people.map((person, index) => (
//           <div key={person.id} className="founderItem">
//             <div className="founderImgContainer">
//               <img src={dummyImg} alt="Dummy" className="dummyImg" />
//               <img src={person.imageUrl} alt={person.name} className="founderImg" />
//             </div>
//             <div className="founderDetails">
//               <p className="founderName">{person.name}</p>
//               <p className="founderRoles">{person.primary_role} / {person.secondary_role}</p>
//               <p className="founderSocialLinks">
//                 <a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
//                 <a href={person.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
//                 <a href={person.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle"> Startup Founder People Info</h3>
      <div className="founderList">
        {people.map((person) => (
          <div key={person.id} className="founderItem">
            <div className="founderImgContainer">
              <img 
                src={person.imageUrl ? person.imageUrl : dummyImg} 
                alt={person.name ? person.name : "Dummy"} 
                className="founderImg" 
              />
            </div>
            <div className="founderDetails">
              <p className="founderName">{person.startuppeople_name}</p>
              <p className="founderRoles">{person.primary_role} / {person.secondary_role}</p>
              <div className="founderSocialLinks">
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                <a href={person.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href={person.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



