import { createContext } from "react";


const BoardContext = createContext({
    activeToolItem: "",
    elements: [],
    history:[[]],
    index: 0,
    id: "",
    toolActionType: "",
    changeToolHandler: ()=> {},
    boardMouseDownHandler: ()=>{},
    boardMouseMoveHandler: ()=>{},
    boardMouseUpHandler:()=>{},
    textAreaBlurHandler: ()=>{},
    changeTextElement: ()=>{},
 
    
})
export default BoardContext;