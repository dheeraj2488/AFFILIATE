import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider , GoogleLogin} from '@react-oauth/google'
import { serverEndpoint } from '../src/config'; 
import { useDispatch } from 'react-redux';
function Login() {
    const [formData, setFormData]=useState({
        username:"",
        password:""
    });

    const dispatch = useDispatch();
    const [errors, setErrors]=useState({});


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
        
            const configuration = { 
                withCredentials : true   // it is used to send cookies with the request
             };

            try{    

                 const response= await axios.post(`${serverEndpoint}/auth/login`,formData , configuration);
                //  console.log(response);
                dispatch({
                    type: "SET_USER",
                    payload: response.data.userDetails,
                  });

            }catch(err){

                if(err?.response?.status === 401){
                    setErrors({message  : 'Invalid credentials'});

                }else{
                    setErrors({message : "something went wrong , please try again"});
                }

            }
        }
    };

    const handelGoogleSigin = async (authResponse) => {

        try {   
            const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
                idToken : authResponse.credential
            } , { withCredentials : true});

            dispatch({
                type: "SET_USER",
                payload: response.data.userDetails,
              });
            
        } catch (error) {
            console.log(error);
            setErrors({message : "something went wrong , please try again"});
        }
    };

    const handleGoogleSigninFailure = async (error)=> {
        console.log(error);
        setErrors({ message: 'Something went wrong while google signin'});
     };
  return (
    <div className="container text-center">
      <h1>Welcome to Login Page</h1>
    

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

      <h2>OR</h2>

      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin onSuccess={handelGoogleSigin} onError={handleGoogleSigninFailure} />
        </GoogleOAuthProvider>
    </div>
  );
}

export default Login;