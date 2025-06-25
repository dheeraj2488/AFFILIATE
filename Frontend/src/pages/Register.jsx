import React from 'react'
import {useState} from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData]=useState({
        username:"",
        password:"" , 
        name  : ""
    });

    const [errors, setErrors]=useState({});

    const handelSubmit = async (event) => {
    event.preventDefault();
    
    const configuration = { 
        withCredentials : true   // it is used to send cookies with the request
     };
    try{

         const res = await axios.post(`${serverEndpoint}/auth/register`, formData , configuration);
        //  console.log(res);

         if(res.data.success){
            setErrors({});
            setFormData({
                username:"",
                password:"" , 
                name  : ""
            });
            alert("user registered successfully");
            navigate('/login');
         }

    }catch(err){

        console.log(err);
        setErrors({message : "something went wrong , please try again"});
    }   
   
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };
  return (
   <div className="container text-center">
      <h1>Welcome to Register page</h1>

      {errors.message && errors.message}

      <form onSubmit={handelSubmit}>
        <div>
            <label>Username:</label>
            <input type="text" name="username" 
            value={formData.username}
            onChange={handleChange}
            />
            {errors.username &&(errors.username)}
        </div>
        <div>
            <label>Password:</label>
            <input type="password" name="password" 
            value={formData.password}
            onChange={handleChange}
            
            />
            
        </div>
        <div>
            <label>Name:</label>
            <input type="text" name="name" 
            value={formData.name}
            onChange={handleChange}
            />
        </div>
        <div>
            <button type='submit'>Register</button>
        </div>
      </form>
    </div>
  )
}

export default Register
