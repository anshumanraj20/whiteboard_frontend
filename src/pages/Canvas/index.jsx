import Board from '../../components/Board';
import Toolbar from '../../components/Toolbar';
import Toolbox from '../../components/Toolbox';
import  BoardProvider  from '../../store/BoardProvier';
import ToolBoxProvider from '../../store/ToolBoxProvider';
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { initSocket,getSocket } from '../../utils/socket';
const apiUrl = import.meta.env.VITE_API_URL;
function Canvas() {
const params = useParams();
  const [canvas, setCanvas] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("auth_token");
  initSocket(token); 
}, []);

useEffect(() => {
  const socket = getSocket();
  if (!socket || !canvas?._id) return;

  const canvasId = canvas._id;

  if (socket.connected) {
    console.log("Connected to WebSocket server:", socket.id);
  } else {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });
  }

  socket.emit("joinCanvas", { canvasId });

  const loadCanvasHandler = (initialElements) => {
    setCanvas((prev) => ({ ...prev, elements: initialElements }));
  };

  const unauthorizedHandler = () => {
    alert("Access Denied: You cannot edit this canvas.");
  };

  socket.on("loadCanvas", loadCanvasHandler);
  socket.on("unauthorized", unauthorizedHandler);

  return () => {
    socket.off("loadCanvas", loadCanvasHandler);
    socket.off("unauthorized", unauthorizedHandler);
    socket.off("connect");
  };
}, [canvas?._id]); 



useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${apiUrl}/api/canvas/load/${params.canvasId}`, {
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
      setCanvas(data);
    } catch (error) {
      console.log("unable to fetch canvas", error.message);
    }
  };

  fetchData();
}, []);



const leaveCanvas= ()=>{
   const socket = getSocket();
    const canvasId = canvas._id;
    socket.emit("leaveCanvas", { canvasId });
}

 if (!canvas) {
    return <div>Loading...</div>;
  }


  
  return(
    <>
 
    <BoardProvider data={canvas.elements} id={canvas._id} >
      <ToolBoxProvider>
    <Link onClick={leaveCanvas} to='/' style={{
  color: "#2563eb",
  fontSize: "18px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none"
}}> Back to Dashboard</Link>
    <Toolbar />
    <Board />
    <Toolbox />
    </ToolBoxProvider>
    </BoardProvider>

    </>

  ) ;

}

export default Canvas;
