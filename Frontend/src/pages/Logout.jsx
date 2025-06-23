import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Logout = ({updateUserDetails}) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:6001/auth/logout',{} ,  {
                withCredentials : true // This ensures that cookies are sent with the request
            });
           
            if(response.data.success){
                updateUserDetails(null); // Clear user details on logout
                navigate('/login'); // Redirect to login page
            }
       
        } catch (error) {
            console.error('Error during logout:', error);

            navigate('/error')
        }
    }

    useEffect(()=>{
        handleLogout();
    },[]);

  return (
    <div>
        
    </div>
  )
}

export default Logout
