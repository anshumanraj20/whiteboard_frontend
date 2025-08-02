import { useContext, useEffect,useState ,useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import BoardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import classes from './index.module.css'
import toolboxContext from "../../store/toolbox.context";
import { getSvgPathFromStroke } from '../../utils/element'
import { getStroke } from 'perfect-freehand';
const Board = () => {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const { elements, boardMouseDownHandler,changeTextElement, boardMouseMoveHandler, boardMouseUpHandler, textAreaBlurHandler, toolActionType ,undo,redo} = useContext(BoardContext);
  const { toolboxState } = useContext(toolboxContext);
const [textState, setTextState] = useState({
  value: "",
  isEditing: false,
});

  
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;


    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


  }, []);

  useLayoutEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.save();
    if (!canvas) return;
    const rc = rough.canvas(canvas);
    const index= elements.length-1;
  // console.log(elements);
    elements.forEach((element,ind) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          rc.draw(element.roughEle);

          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          const path = new Path2D(getSvgPathFromStroke(getStroke(element.points)));
          context.fill(path);
          context.restore();
          break;
  // newElement[index].path = new Path2D(getSvgPathFromStroke(getStroke(newElement[index].points)));
            // newElement[index].path = getSvgPathFromStroke(getStroke(newElement[index].points));
        case TOOL_ITEMS.TEXT:
          
        if(textState.isEditing && index ==ind ){
          break;
        }
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
        
          break;
          
        default:
          throw new Error("type not recognized");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [elements]);

  //using for textbox tool 
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();

      }, 0);
    }
  }, [toolActionType]);
  useEffect(()=>{
    const handleKeyDown =(e)=>{
        if(e.ctrlKey && e.key === 'z'){
          undo();

        }
        else if(e.ctrlKey && e.key === 'y'){
          redo();
        }
    };

    document.addEventListener("keydown", handleKeyDown);

    return ()=>{
      document.removeEventListener("keydown",handleKeyDown);
    }
  },[undo,redo]);



  const handleMouseDown = (e) => {
    boardMouseDownHandler(e, toolboxState);

  }
  const handleMouseMove = (e) => {
    //  if(toolActionType===TOOL_ACTION_TYPES.DRAWING || toolActionType === TOOL_ACTION_TYPES.ERASING)
    boardMouseMoveHandler(e);

  }

  const handleMouseUp = (e) => {

    boardMouseUpHandler(e);
  }
  const textFillHandler =(e)=>{
    setTextState({value: e.target.value,isEditing:true});
    changeTextElement(e.target.value);
  }

  const selectedElement = elements[elements.length - 1];
  return (
    <>
      {
        toolActionType === TOOL_ACTION_TYPES.WRITING &&
        <textarea type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          value={textState.value}
          onChange = {(e)=>textFillHandler(e)}
          style={{
            top: selectedElement.y1,
            left: selectedElement.x1,
            fontSize: `${selectedElement?.size}px`,
            color: selectedElement?.stroke,
          }}
          onBlur={() => {textAreaBlurHandler(textState.value); setTextState({value: "", isEditing: false})}}

        />
      }
      <canvas
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
      />

    </>

  );
};

export default Board;