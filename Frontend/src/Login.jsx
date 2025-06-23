import React from 'react';
import { useState } from 'react';
import axios from 'axios';
function Login({updateUserDetails}) {
    const [formData, setFormData]=useState({
        username:"",
        password:""
    });
    const [errors, setErrors]=useState({});
    // const [message,setMessage]=useState(null);

    const handleChange=(event)=>{
        const name=event.target.name;
        const value=event.target.value;

        setFormData({
            ...formData,
            [name]:value
        });
    };
    const validate=()=>{
        let newErrors={};
        let isValid=true;
        if(formData.username.length===0){
            newErrors.username="Username is Mandatory";
            isValid=false;
            
        }
        if(formData.password.length===0){
            newErrors.password="Password is Mandatory";
            isValid=false;

        }
        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit= async (event)=>{
        event.preventDefault(); 
        // We use event.preventDefault() to stop the default form behavior (page reload) and handle submission in our own way using JavaScript.
        if(validate()){
            // if(formData.username==='admin'&&formData.password==='admin'){ // always check the client side first by doing hardcoding
            //     setMessage('Correct Credentials');

            //     updateUserDetails({
            //         name:'john cena',
            //         email : 'johncena.com'
            //     });
            // }
            // else{
            //     setMessage('Invalid Credentials');
            // }
            const configuration = { 
                withCredentials : true   // it is used to send cookies with the request
             };

            try{    

                 const response= await axios.post('http://localhost:6001/auth/login',formData , configuration);
                //  console.log(response);
                updateUserDetails(response.data.userDetails);

            }catch(err){

                setErrors({message : "something went wrong , please try again"});

            }
        }
    };
  return (
    <div className="container text-center">
      <h1>Welcome to Login Page</h1>
      {/* {message && ( message )} */}

      {errors.message && errors.message}

      <form onSubmit={handleSubmit}>
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
            {errors.password &&(errors.password)}
            
        </div>
        <div>
            <button>Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;