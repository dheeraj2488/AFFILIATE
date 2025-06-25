import React from 'react';
import { Link } from 'react-router-dom';


function App() {
  return (
    <div className="container text-center">
      <h1>Welcome to Home Page</h1>
      <Link to='/'>Home</Link>
      <Link to='/login'>Login</Link>
      <Link to='/register'> Register </Link>
    </div>
  );
}

export default App;