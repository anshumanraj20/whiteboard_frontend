import React, { useState } from 'react';
import classes from './index.module.css';
import { useNavigate } from 'react-router-dom'; 
const apiUrl = import.meta.env.VITE_API_URL;
const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const loginHandler = (event) => {
  event.preventDefault();
  console.log("Form Data:", formData);

  const registerUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/users`, {
        method: 'POST',
        headers: {
            'ngrok-skip-browser-warning': 'any-value' ,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      const token = response.headers.get('Authorization')?.split(' ')[1];
      console.log(token);
      localStorage.setItem('auth_token', token); 

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      navigate('/');

      console.log("User registered successfully:", data);
      // optionally clear form or redirect user
    } catch (err) {
      alert("error registering user , try again");
      console.error("Error registering user:", err.message);
    }
  };

  registerUser(); // don't forget to call it!
};


  const handleChange = (e) => {
    const { id } = e.target;
  const value = e.target.value.trim();
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
   
    <div className={classes.container}>
    <h1 className={classes.heading}>Register</h1>
      <form onSubmit={loginHandler} className={classes.form}>
        

        <input
          type="text"
          id="name"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
        />

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
    </div>
  );
};

export default Index;
