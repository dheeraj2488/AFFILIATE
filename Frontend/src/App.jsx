import { Route, Routes , Navigate } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import Home from './Home';
import Login from './Login';
import { useState } from 'react';
function App() {


  const [UserDetails , setUserDetails]  = useState(null);
  const updateUserDetails = (updatedData)=>{
    setUserDetails(updatedData);
  };


  return (
    <>
 
      <Routes>
        <Route
          path="/"
          element={ UserDetails ? <Navigate to= '/dashboard'/> : 
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route  path="/login" element={ UserDetails ? <Navigate to= '/dashboard'/> :
            <AppLayout>
              <Login updateUserDetails={updateUserDetails} />
            </AppLayout>
          }
        />

        <Route path = '/dashboard' element={ UserDetails ? <Dashboard/> : <Navigate to= '/login'/>}  />

      </Routes>
    
    </>
  );
}

export default App;
