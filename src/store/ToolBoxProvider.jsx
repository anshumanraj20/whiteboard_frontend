import React, { useReducer } from 'react'
import toolboxContext from './toolbox.context'
import { TOOL_ITEMS ,COLORS,TOOL_BOX_ACTION} from '../constants';


function toolboxReducer (state,action){
    
    switch (action.type){
        case TOOL_BOX_ACTION.CHANGE_STOKE:
          
          return {
            ...state, 
            [action.payload.tool]:{
              ...state[action.payload.tool],
              stroke:action.payload.stroke,
            },
          };

        case TOOL_BOX_ACTION.CHANGE_FILL:
          
          
          return {
            ...state,
            [action.payload.tool]:{
              ...state[action.payload.tool],
              fill: action.payload.fill,
            }
          }

           case TOOL_BOX_ACTION.CHANGE_SIZE:
            return {
              ...state,
            [action.payload.tool]:{
              ...state[action.payload.tool],
              size: action.payload.size,
            }
            }

         

        default:
            break;    
    }

}
const initialToolBoxState = {
  [TOOL_ITEMS.BRUSH]:{
   stroke: COLORS.BLACK,
  },
 [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
 },
 [TOOL_ITEMS.RECTANGLE]:{
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
 },
  [TOOL_ITEMS.CIRCLE]:{
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
 },
  [TOOL_ITEMS.ARROW]:{
    stroke: COLORS.BLACK,
    size: 1,
 },
 [TOOL_ITEMS.TEXT]:{
    stroke: COLORS.BLACK,
    size: 32,
 },
 

}



const ToolBoxProvider = ({children}) => {
  
    const [toolboxState, dispactToolboxAction] = useReducer(toolboxReducer,initialToolBoxState);

    

const changeStrokeHandler =(tool,stroke)=>{
  dispactToolboxAction(
    {
      type: "CHANGE_STROKE",
      payload: {
        tool,
        stroke,
      }
    }
  )
}
const changeFillHandler =(tool,fill) =>{
  dispactToolboxAction(
    {
      type: "CHANGE_FILL",
      payload: {
        tool,
        fill,
      }
    }
  )
}
const changeSizeHandler =(tool,size)=>{
  
   dispactToolboxAction(
    {
      type: "CHANGE_SIZE",
      payload: {
        tool,
        size,
      }
    }
  )
}

    const toolboxContextValue ={
toolboxState,
changeStrokeHandler,
changeFillHandler,
changeSizeHandler,
};
  return (
         <toolboxContext.Provider value ={toolboxContextValue}>{children}</toolboxContext.Provider>

  )
}

export default ToolBoxProvider