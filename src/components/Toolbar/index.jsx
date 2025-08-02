import { useContext, useState } from 'react';
import classes from './index.module.css'
import cx from 'classnames';
import { LuRectangleHorizontal } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import BoardContext from '../../store/board-context';
import { FaSlash, FaUndoAlt, FaRedoAlt, FaRegCircle, FaArrowRight, FaPaintBrush, FaEraser, FaFont,FaDownload ,FaSave} from 'react-icons/fa';
import { TOOL_ITEMS } from '../../constants';
const apiUrl = import.meta.env.VITE_API_URL;
const Toolbar = () => {
  const navigate = useNavigate();
  const { activeToolItem, elements,changeToolHandler,undo,redo, id } = useContext(BoardContext);
  const handleDownloadClick=  ()=>{
      const canvas = document.getElementById("canvas")
      const data = canvas.toDataURL("image/png");
      const anchor =document.createElement('a');
      anchor.href=data;
      anchor.download ="board.png";
      anchor.click();
  }

  const handleSaveClick = async()=>{
try{
  console.log(elements);
    const token = localStorage.getItem('auth_token');

   const response = await fetch(`${apiUrl}/api/canvas/update`, {
      method: "PATCH",
      headers: {
          'ngrok-skip-browser-warning': 'any-value' ,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ elements ,id }),
      
    });
    
  const data = await response.json();
console.log(data)
   
    if(!response.ok){
      throw new Error("eror in saving",data.details)
    }
   
    alert("canvas saved successfully");
     navigate('/');
  }
  catch(error){
    alert("something went wrong ")
    console.log("save failed",error.message);
  }
  }
  return (
    <div className={classes.container}>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.BRUSH })} onClick={() => changeToolHandler(TOOL_ITEMS.BRUSH)}><FaPaintBrush /></div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.LINE })} onClick={() => changeToolHandler(TOOL_ITEMS.LINE)}><FaSlash /> </div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE })} onClick={() => changeToolHandler(TOOL_ITEMS.RECTANGLE)}><LuRectangleHorizontal /></div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE })} onClick={() => changeToolHandler(TOOL_ITEMS.CIRCLE)}><FaRegCircle /></div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.ARROW })} onClick={() => changeToolHandler(TOOL_ITEMS.ARROW)}><FaArrowRight /></div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.ERASER })} onClick={() => changeToolHandler(TOOL_ITEMS.ERASER)}><FaEraser /></div>
      <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.TEXT })} onClick={() => changeToolHandler(TOOL_ITEMS.TEXT)}><FaFont /></div>
      <div className={classes.toolItem} onClick={undo}><FaUndoAlt /></div>
      <div className={classes.toolItem} onClick={redo}><FaRedoAlt /></div>
      <div className={classes.toolItem} onClick={handleDownloadClick}><FaDownload /></div>
      <div className={classes.toolItem} onClick={handleSaveClick}><FaSave /></div>
    </div>
  )
}

export default Toolbar;