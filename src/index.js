






import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
// import App from './App';
import { ThemeProvider } from './ThemeContext';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login';
import IncubatorTopbar from './components/incubators/components/topbar/Topbar';
import IncubatorHome from './components/incubators/pages/home/Home';
import IncubatorSidebar from './components/incubators/components/sidebar/Sidebar';
import IncubatorsAssociated from './components/incubators/pages/IncubatorsAssociated/IncubatorsAssociated';
import IncubatorPeople from './components/incubators/pages/IncubatorPeople/IncubatorPeople';
import IncubatedStartups from './components/incubators/pages/Incubated_Startups/IncubatedStartups';
import ProductList from './components/incubators/pages/Infrastructure_Incubator/ProductList';
import IncubatorInfo from './components/incubators/pages/IncubatorInfo/IncubatorInfo';
import AppliedStartups from './components/incubators/pages/AppliedStartups/AppliedStartups';
import IncubatorPartners from './components/incubators/pages/Partners/Partners';
import StartupTopbar from './components/startups/components/topbar/Topbar';
import StartupSidebar from './components/startups/components/sidebar/Sidebar';
import StartupHome from './components/startups/pages/home/Home';
import StartupPeople from './components/startups/pages/StartupPeople/StartupPeople';
import Award from './components/startups/pages/Award/Award';
// import Product1 from './components/startups/pages/product/Product';
// import User1 from './components/startups/pages/user/User';
import StartupProductList from './components/startups/pages/Funding/ProductList';
import StartupInfo from './components/startups/pages/StartupInfo/StartupInfo';
import IntellectualProperties from './components/startups/pages/IntellectualProperties/IntellectualProperties';
import Partners from './components/startups/pages/Partners/Partners';

import {router} from './App'
import App from './App'


ReactDOM.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    {/* </BrowserRouter> */}
  </React.StrictMode>,                      
  document.getElementById('root')
);                    













