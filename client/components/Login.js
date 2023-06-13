import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prompt, setPrompt] = useState(0);

  async function handleLogin(e) {
    e.preventDefault();
    window.localStorage.removeItem("token");
    await fetch(`${process.env.URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.success){
          window.localStorage.setItem("token", data.token);
          setPrompt(201)
          setTimeout(() => {
            navigate('/home')
          }, 1000)
        } else {
          setPrompt(404)
        }
      });
  }
  return (
    <div className="login__page">
      <div className="login__container">
        <input
          type="email"
          placeholder="Enter your emai-id please"
          className="login__email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password please"
          className="login__password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button__container">
          <button
            className="login__button"
            onClick={() => {
              navigate("/register");
              setPrompt(0);
            }}
          >
            Register
          </button>
          <button className="login__button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
      {prompt === 404 && (
        <div className="login__response failed">
          ⚠️User doesn't exist please <Link to="/register">Register</Link> or check
          your credentials
        </div>
      )}
      {prompt === 201 && (
        <div className="login__response success">
          ✅Successfully logged in! Please enjoy
        </div>
      )}
    </div>
  );
};

export default Login;
