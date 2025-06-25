import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { serverEndpoint } from '../config';
const Logout = () => {

    const dispatch  = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${serverEndpoint}/auth/logout`,{} ,  {
                withCredentials : true // This ensures that cookies are sent with the request
            });
           
            if(response.data.success){
                dispatch({
                    type : 'CLEAR_USER',
                }) // Clear user details on logout
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
