import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform authentication logic here
    // For simplicity, I'm just checking if username and password are not empty
    if (username.trim() !== "" && password.trim() !== "") {
      // Call the onLogin function passed from the parent component
      onLogin();
      // Redirect to the home page
      history.push("/home");
    } else {
      alert("Please enter username and password.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
