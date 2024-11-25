import React from 'react';
import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";

export default function StartupHome() {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart data={userData} title="User Analytics" grid dataKey="Active User"/>
      <div className="homeWidgets">
        <WidgetSm/>
        <WidgetLg/>
      </div>
       {/* <footer className="footer">
        <div className="footer-left">
          © 2024 Powered by STEP-TIET. All Rights Reserved
        </div>
        <div className="footer-right">
          <a href="/about-us" className="footer-link">About us </a> 
          <a href="/blog" className="footer-link">Blog </a>
          <a href="/license" className="footer-link">License</a>
        </div>
      </footer> */}
    </div>
  );
}




// import Chart from "../../../chart/Chart";
// import FeaturedInfo from "../../../featuredInfo/FeaturedInfo";
// import "./home.css";
// import { userData } from "../../../../dummyData";
// import WidgetSm from "../../../widgetSm/WidgetSm";
// import WidgetLg from "../../../widgetLg/WidgetLg";

// export default function Home() {
//   return (
//     <div className="home">
//       <FeaturedInfo />
//       <Chart data={userData} title="User Analytics" grid dataKey="Active User"/>
//       <div className="homeWidgets">
//         <WidgetSm/>
//         <WidgetLg/>
//       </div>
//     </div>
//   );
// }


// import React from 'react';
// import Chart from "../../components/startups/pages/chart/Chart";
// import FeaturedInfo from "../../components/startups/pages/featuredInfo/FeaturedInfo";
// import "./home.css";
// import { userData } from "../../dummyData";
// import WidgetSm from "../../components/startups/pages/widgetSm/WidgetSm";
// import WidgetLg from "../../components/startups/pages/widgetLg/WidgetLg";

// export default function Home() {
//   return (
//     <div className="home">
//       <FeaturedInfo />
//       <Chart data={userData} title="User Analytics" grid dataKey="Active User"/>
//       <div className="homeWidgets">
//         <WidgetSm/>
//         <WidgetLg/>
//       </div>
//     </div>
//   );
// }
