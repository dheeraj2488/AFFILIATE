import React from "react";
import { useState } from "react";

const Signin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <h1>Sign In to continue</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
         
        }}
      >
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">UserName:</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
          />
          <br /> <br />
          <label htmlFor="pass">Password:</label>
          <input
            type="password"
            id="pass"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
