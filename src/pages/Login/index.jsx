import React from 'react'
import classes from './index.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
const Index = () => {
  const auth_token = localStorage.getItem('auth_token');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const loginHandler = async(event) => {
    event.preventDefault();
    console.log("Form Data:", formData);


    const login = async () => {
      try {
        const headers = {
            'ngrok-skip-browser-warning': 'any-value' ,
          'Content-Type': 'application/json',
        };

        const auth_token = localStorage.getItem('auth_token');
        if (auth_token) {
          headers['Authorization'] = `Bearer ${auth_token}`;
          headers['ngrok-skip-browser-warning'] = 'any-value';  
        }

        const response = await fetch(`${apiUrl}/api/users/login`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(formData),
        });

        const newToken = response.headers.get('Authorization')?.split(' ')[1];
        if (newToken) {
          localStorage.setItem('auth_token', newToken);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        console.log("User logged in successfully:", data);
        navigate('/');

      } catch (err) {
        alert(err.message);
        console.error("Error:", err.message);
      }
    };

   
      await login();
    }





    const handleChange = (e) => {
      const { id } = e.target;
      const value = e.target.value.trim();
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    };

    const registerHandler= ()=>{
      navigate('/register');
    }

    return (

      <div className={classes.container}>
        <h1 className={classes.heading}>Login</h1>
        <form onSubmit={loginHandler} className={classes.form}>



          <input
            type="email"
            id="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            id="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />

          <input type="submit" />
        </form>

        <button style={{ backgroundColor: "red"}} onClick={registerHandler}>Sign Up</button>
      </div>
    );

};
  export default Index;