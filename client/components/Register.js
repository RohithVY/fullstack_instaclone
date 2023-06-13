import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [prompt, setPrompt] = useState("none");
  const navigate = useNavigate();

  function handleRegister() {
    if (password.length === 0 || confirmPassword !== password) {
      setPrompt("fail");
      return;
    }
    fetch(`${process.env.BACKENDURL}/user/register`, {
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
        console.log(data)
        if (!data.success) {
          setPrompt("already registered");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setPrompt("success");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      });
  }

  return (
    <div className="register__page">
      <div className="register__container">
        <input
          type="email"
          className="register__email"
          placeholder="Enter your email-id"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="register__password"
          placeholder="enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="register__password"
          placeholder="confirm your password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="register__btn" onClick={handleRegister}>
          Register above details
        </button>
      </div>
      {prompt === "fail" && (
        <div className="register__response failed">
          ⚠️Password and Confirm Password doesn't match with each other
        </div>
      )}
      {prompt === "already registered" && (
        <div className="register__response failed">
          ⚠️User already registered! plase login
        </div>
      )}
      {prompt === "success" && (
        <div className="register__response success">
          ✅Registered Successfully! Please log in
        </div>
      )}
    </div>
  );
};

export default Register;
