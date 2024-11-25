




// Best code  is here


import React, { useState } from 'react';   


// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import IncubatorSidebar from './components/incubators/components/sidebar/Sidebar';
import IncubatorTopbar from './components/incubators/components/topbar/Topbar';
import IncubatorHome from './components/incubators/pages/home/Home';
import IncubatorsAssociated from './components/startups/pages/IncubatorsAssociated/IncubatorsAssociated';
// import AddIncubatorPage from './components/incubators/pages/IncubatorsAssociated/AddIncubatorPage';
import InstituteAssociated from './components/incubators/pages/IncubatorsAssociated/IncubatorsAssociated';
import IncubatorPeople from './components/incubators/pages/IncubatorPeople/IncubatorPeople';
import IncubatedStartups from './components/incubators/pages/Incubated_Startups/IncubatedStartups';
import ProductList from './components/incubators/pages/Infrastructure_Incubator/ProductList';
import ProductList1 from './components/startups/pages/Funding/ProductList';
import IncubatorInfo from './components/incubators/pages/IncubatorInfo/IncubatorInfo';
import AppliedStartups from './components/incubators/pages/AppliedStartups/AppliedStartups';
import IncubatorPartners from './components/incubators/pages/Partners/Partners';
// import RentUpdates from './components/incubators/pages/RentUpdates/RentUpdates';
import StartupHome from './components/startups/pages/home/Home';
import StartupPeople from './components/startups/pages/StartupPeople/StartupPeople';
import StartupInfo from './components/startups/pages/StartupInfo/StartupInfo';
// import RentalSystem from './components/startups/pages/RentalSystem/RentalSystem';
// import IntellectualProperties from './components/startups/pages/IntellectualProperties/IntellectualProperties';
// import StartupPartners from './components/startups/pages/Partners/Partners';
import Award from "./components/startups/pages/Award/Award";
// import User1 from "./components/startups/pages/user/User";
// import NewUser1 from "./components/startups/pages/newUser/NewUser";
// import Product1 from "./components/startups/pages/product/Product";
// import NewProduct1 from "./components/startups/pages/newProduct/NewProduct";
import StartupProductList from './components/startups/pages/Funding/ProductList';
import IntellectualProperties from './components/startups/pages/IntellectualProperties/IntellectualProperties';
import Partners from './components/startups/pages/Partners/Partners';

import './App.css';

import {
  createBrowserRouter,
} from "react-router-dom";
import StartupTopbar from './components/startups/components/topbar/Topbar';
import StartupSidebar from './components/startups/components/sidebar/Sidebar';
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [userRole, setUserRole] = useState(null);
  // const navigate = useNavigate();
  console.log('Current user role:', userRole);

  const handleSetUserRole = (role) => {
    setUserRole(role);
  };

  const redirectToLogin = () => {
    return <Login setUserRole={handleSetUserRole} />;
  };


  const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup/>
  },
  {
    path:"incubator",
    // element : <IncubatorSidebar/>,

        element: <React.Fragment>
  <IncubatorTopbar />
  <IncubatorSidebar />
</React.Fragment> ,

    children:[
      {
        index:true,
        element:<IncubatorHome/>
      },
      {
        path:"institute-associated",
        element:<InstituteAssociated/>
        
      },
      {
        path:'incubator-people',
        element:<IncubatorPeople/>
      },
      {
        path:'incubated-startups',
        element:<IncubatedStartups/>
      },
      {
        path:"infrastructure-incubator",
        element:<ProductList/>
      },
      {
        path:"incubator-info",
        element:<IncubatorInfo/>
      },
      {
        path:"startups-applied-at-venture-lab",
        element:<AppliedStartups/>
      },
      {
        path:'partners',
        element:<IncubatorPartners/>
      }
      //   {
      //   path:'rent-updates',
      //   element:<RentUpdates/>
      // }
    ]
  },
  {
    path:"startup",
    // element:<StartupSidebar/>,

        element: <React.Fragment>
  <StartupTopbar />
  <StartupSidebar />
</React.Fragment> ,
    children:[{
      index:true,
      element:<StartupHome/>
    },
    {
      path:'incubator-associated',
      element:<IncubatorsAssociated/>
    },
    {
      path:'startup-people',
      element:<StartupPeople/>
    },
    {
      path:'users',
      element:<Award/>
    },
    {
      path:'products',
      element:<ProductList1/>
    },
    {
      path:'products',
      element:<StartupProductList/>
    },
    {
      path:'startup-info',
      element:<StartupInfo/>
    },
    {
      path:'intellectual-properties',
      element:<IntellectualProperties/>
    },
    {
      path:'partners',
      element:<Partners/>   
    }
    // {
    //   path:'rental-system',
    //   element:<RentalSystem/>   
    // }
  ]
  }
]);





  return (
    <Router>
      <Routes>                                          
        <Route path="/" element={<Signup setUserRole={setUserRole}/>} />
        <Route path="/login" element={<Login setUserRole={setUserRole}/>} /> 

        <Route path="incubator" element={<><IncubatorTopbar /><IncubatorSidebar/></>}>
          <Route index element={<IncubatorHome />} />                                       
          <Route path="institute-associated" element={<InstituteAssociated />} />
          {/* <Route path="incubator-associated/add-incubator" element={<AddIncubatorPage />} /> */}
          <Route path="incubator-people" element={<IncubatorPeople />} />
          <Route path="incubated-startups" element={<IncubatedStartups />} />
          <Route path="infrastructure-incubator" element={<ProductList />} />
          <Route path="incubator-info" element={<IncubatorInfo />} />
          <Route path="startups-applied-at-venture-lab" element={<AppliedStartups />} />
          <Route path="partners" element={<IncubatorPartners />} />    
            {/* <Route path="rent-updates" element={<RentUpdates />} />   */}
           {/* Add the route for AddIncubatorPage */}                  
             
        </Route>        
        <Route path="startup" element={<><StartupTopbar /><StartupSidebar/></>}>
          <Route index element={<StartupHome />} />
          <Route path="incubator-associated" element={<IncubatorsAssociated />} />
          {/* <Route path="incubator-associated/add-incubator" element={<AddIncubatorPage />} /> */}
          <Route path="startup-people" element={<StartupPeople />} />
          <Route path="users" element={<Award />} />
          <Route path="products" element = {<ProductList1/>} />
          <Route path="products" element={<StartupProductList />} />
          <Route path="startup-info" element={<StartupInfo />} />
          <Route path="intellectual-properties" element={<IntellectualProperties />} />
          <Route path="partners" element={<Partners />} />
           {/* <Route path="rental-system" element={<RentalSystem />} /> */}
           {/* Add the route for AddIncubatorPage */}
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
                    









