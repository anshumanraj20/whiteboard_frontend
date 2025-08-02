import React, { useEffect, useState } from 'react';
import classes from './index.module.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Modal from '../../components/Modal'
const apiUrl = import.meta.env.VITE_API_URL;
const CanvasDashboard = () => {
  const [canvases, setCanvases] = useState([]);
  const [Sharing,setSharing] = useState(null);
   let token = localStorage.getItem('auth_token');
  const navigate= useNavigate();

useEffect(() => {
  const fetchData = async () => {
    console.log("hrerr");
    if (!token) {
     
      navigate('/login');
      return;
    }
 try {
     const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 

      if (decoded.exp < currentTime) {
        
        localStorage.removeItem('auth_token'); 
        
      const response = await fetch(`${apiUrl}/api/token`, {
     headers:{
        'ngrok-skip-browser-warning': 'any-value' ,
     },
  method: 'GET', 
  credentials: 'include', 
});

      if(response.status === 403){
         
        navigate('/login');
        return;
      }
      const newToken = response.headers.get('Authorization')?.split(' ')[1];

      localStorage.setItem('auth_token',newToken);
      token =newToken;

      }
      
      // console.log(token)
   
      const response = await fetch(`${apiUrl}/api/canvas/list`, {
        method: "GET",
        headers: {
         
   
             'ngrok-skip-browser-warning': 'any-value' ,
          'Authorization': `Bearer ${token}` 
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log(data);
      setCanvases(data);
    } catch (error) {
        alert("no saved canvases")
      console.log("unable to fetch canvas", error.message);
    }
  };

  fetchData();
}, []);


  const handleCreate = async() => {
    
   

    console.log(token)
  
  try { 
      const val =  prompt("Enter name");

      if(!val){
        return ;
      }
    const response = await fetch(`${apiUrl}/api/canvas/create?name=${val}`, {
      method: "POST",
      headers: {
          'ngrok-skip-browser-warning': 'any-value' ,
        'Authorization': `Bearer ${token}` 
      },
      
    });

    const newCanvas = await response.json();

    if (!response.ok) {
      throw new Error(newCanvas.message || "Failed to create canvas");
    }

    setCanvases([...canvases, newCanvas]);
    
    
    
  } catch (error) {
    console.log("Unable to create canvas", error.message);
  }
  };



  const handleDelete = async(id) => {
    

   
  
  try { 
     
    const response = await fetch(`${apiUrl}/api/canvas/${id}`, {
      method: "DELETE",
      headers: {
          'ngrok-skip-browser-warning': 'any-value' ,
         'Authorization': `Bearer ${token}` 
      },
      
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || "Failed to delete canvas");
    }

   setCanvases(canvases.filter(canvas => canvas._id !== id));

    console.log(res.message);
    
    
  } catch (error) {
    alert("eror in deletion")
    console.log("Unable to delete canvas", error.message);
  }
    
  };

  const handleShare = (id) => {
    setSharing(id);
  
  };

  const openCanvas =(id)=>{
      navigate(`/canvas/${id}`);
  };
  const handleLogout =() =>{
    localStorage.removeItem('auth_token');
    navigate('/login');
  }
  const closeModal = (shouldClose)=>{
    setSharing(!shouldClose);
  }
  
   let userId = null;
   if(token){
    userId= jwtDecode(token)._id;
   }
  return (
    <div className={classes.container}>
        { Sharing &&<Modal  canvasId={Sharing}closeModal={closeModal} />

            }
      <div className={classes.header}>
        <h1>Canvas Dashboard</h1>
        <button className={classes.createBtn} onClick={handleCreate}>
          + Create New Canvas
        </button>
        <button className={classes.createBtn} style={{backgroundColor: "red"}} onClick={handleLogout}>
          Logout
        </button>
      </div>
    <h2> Original Canvas</h2>
      {canvases.map((canvas) => (
       (canvas.owner === userId) &&
        <div key={canvas._id} className={classes.canvas}>
          <button onClick={()=>openCanvas(canvas._id)}>{canvas.name}</button>
          <button onClick={() => handleDelete(canvas._id)}>Delete</button>
          <button onClick={() => handleShare(canvas._id)}>Share</button>
        </div>
        
      ))}
 <h2> Shared Canvas</h2>
{canvases.map((canvas) => (
       (canvas.owner !== userId) &&
        <div key={canvas._id} className={classes.canvas}>
          <button onClick={()=>openCanvas(canvas._id)}>{canvas.name}</button>
        <button onClick={() => handleShare(canvas._id)}>Share</button>
        </div>
        
      ))}

    </div>
  );
};

export default CanvasDashboard;
