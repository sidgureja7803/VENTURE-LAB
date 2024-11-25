// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ component: Component, infoFilled, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) => (
//         infoFilled
//           ? <Component {...props} />
//           : <Navigate to={rest.redirectPath} />
//       )}
//     />
//   );
// };

// export default ProtectedRoute;


import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ userRole, expectedRole, ...props }) => {
  // Check if user is authenticated and has the correct role
  if (userRole && userRole === expectedRole) {
    return <Route {...props} />;
  } else {
    // Redirect to login if not authenticated or authorized
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;

