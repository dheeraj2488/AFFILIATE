import React from 'react';
import { useState } from 'react';

function Login({updateUserDetails}) {
    const [formData, setFormData]=useState({
        username:"",
        password:""
    });
    const [errors, setErrors]=useState({});
    const [message,setMessage]=useState(null);

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

    const handleSubmit=(event)=>{
        event.preventDefault();
        if(validate()){
            if(formData.username==='admin'&&formData.password==='admin'){
                setMessage('Correct Credentials');

                updateUserDetails({
                    name:'john cena',
                    email : 'johncena.com'
                });
            }
            else{
                setMessage('Invalid Credentials');
            }
        }
    };
  return (
    <div className="container text-center">
      <h1>Welcome to Login Page</h1>
      {message &&(
        message
      )}
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