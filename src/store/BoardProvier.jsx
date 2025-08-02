import { useCallback, useEffect, useRef, useReducer } from 'react'
import BoardContext from './board-context'

import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants'
import { createElement } from '../utils/element'

import { isPointNearElement } from '../utils/element'
import { initSocket, getSocket } from '../utils/socket'
import _ from "lodash";
import { throttle } from 'lodash';
const BoardProvier = ({ data, id, children }) => {


  const [boardState, dispactBoardActions] = useReducer((state, action) => {

    switch (action.type) {

      case "text_element_changing":{
        const newElement = [...state.elements];
        const index = newElement.length-1;
      newElement[index] = {
              ...newElement[index], // Create new element object
             text: action.payload,
            };
        return {
          ...state,
          elements: newElement,
        }
      }
      case "socket_update":
        if (_.isEqual(state.elements, action.payload)) {
          return state;
        }
       
       
        return {
          ...state,
          elements: action.payload,
          
        
        }
      case "initial_render":
        
        return {
          ...state,
          elements: data,
             
        }

      case BOARD_ACTIONS.CHANGE_TOOL:
        return {
          ...state,
          activeToolItem: action.payload,
        };
      case BOARD_ACTIONS.CHANGE_ACTION_TYPE:

        return {
          ...state,
          toolActionType: action.payload.actionType,
        }
      case BOARD_ACTIONS.DRAW_DOWN: {

        const { clientX, clientY, stroke, fill, size } = action.payload;

        let newElement = createElement(
          state.elements.length,
          clientX,
          clientY,
          clientX,
          clientY,
          {
            type: state.activeToolItem,
            stroke,
            fill,
            size,
          }
        );

        return {
          ...state,
          elements: [...state.elements, newElement],
          toolActionType: state.activeToolItem === TOOL_ITEMS.TEXT ? TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
        }
      }

      case BOARD_ACTIONS.DRAW_MOVE: {
        let newElement = [...state.elements];
        const index = state.elements.length - 1;
        const { type } = newElement[index];
        const { clientX, clientY } = action.payload;
        switch (type) {
          case TOOL_ITEMS.LINE:
          case TOOL_ITEMS.RECTANGLE:
          case TOOL_ITEMS.CIRCLE:
          case TOOL_ITEMS.ARROW:


            let prev_x = newElement[index].x1;
            let prev_y = newElement[index].y1;



            newElement[index] = createElement(
              index,
              prev_x,
              prev_y,
              clientX,
              clientY,
              {
                type: state.activeToolItem,
                stroke: newElement[index].stroke,
                fill: newElement[index].fill,
                size: newElement[index].size,

              }
            );

            return {
              ...state, elements: newElement,

            }




          case TOOL_ITEMS.BRUSH:


            newElement[index] = {
              ...newElement[index], // Create new element object
              points: [...newElement[index].points, { x: clientX, y: clientY }]
            };
            return {
              ...state,
              elements: newElement
            }


          default:
            break;
        }





      }


      case BOARD_ACTIONS.ERASE: {
        const { clientX, clientY } = action.payload;
        let newElements = [...state.elements];
        let old_size = newElements.length;
        newElements = newElements.filter((element) => {
          return !isPointNearElement(element, clientX, clientY);
        });
        let newone = newElements.length;


        const newHistory = state.history.slice(0, state.index + 1);
        let delta = 0;
        if (newone !== old_size) {
          newHistory.push(newElements);
          delta = 1;
        }
        return {
          ...state,
          elements: newElements,
          history: newHistory,
          index: state.index + delta,
        }

      }

      case BOARD_ACTIONS.CHANGE_TEXT: {
        const index = state.elements.length - 1;
        const newElements = [...state.elements];
        newElements[index].text = action.payload.text;
        const newHistory = state.history.slice(0, state.index + 1);
        newHistory.push(newElements);
        return {
          ...state,
          toolActionType: TOOL_ACTION_TYPES.NONE,
          elements: newElements,
          history: newHistory,
          index: state.index + 1,

        }
      }

      case BOARD_ACTIONS.DRAW_UP: {

        const elementCopy = [...state.elements];
        const newHistory = state.history.slice(0, state.index + 1);
        newHistory.push(elementCopy);
        return {
          ...state,
          history: newHistory,
          index: state.index + 1,
        }
      }
      case BOARD_ACTIONS.UNDO: {

        if (state.index <= 0) return state;
        return {
          ...state,
          elements: state.history[state.index - 1],
          index: state.index - 1,
        };
      }
      case BOARD_ACTIONS.REDO: {
        if (state.index >= state.history.length - 1) return state;
        return {
          ...state,
          elements: state.history[state.index + 1],
          index: state.index + 1,
        };
      }


      default:
        return state;
    }
  }
    , {
      activeToolItem: TOOL_ITEMS.BRUSH,
      elements: [],
      history: [[]],
      index: 0,
      id,
      toolActionType: TOOL_ACTION_TYPES.NONE,


    });

  useEffect(() => {

    dispactBoardActions({
      type: "initial_render",
    })

  }, [data]);



  const useSocketEmission = (elements, id) => {
    const prevElements = useRef(elements);
    const isSocketUpdate = useRef(false);


    const throttledEmit = useCallback(
      throttle((elements) => {
        const socket = getSocket();
        if (socket?.connected && id ) {
          console.log(`${socket.id} sending drawing update - LOCAL CHANGE`)
          socket.emit("drawingUpdate", {
            canvasId: id,
            elements: elements,
            senderId: socket.id,
          });
        }
      }, 10),
      [id]
    );









    useEffect(() => {

      console.log(elements, prevElements.current)
      // 💾 ALWAYS update our memory first
      const shouldEmit = !isSocketUpdate.current && !_.isEqual(prevElements.current, elements);
      prevElements.current = elements;

      // Reset the socket flag
      if (isSocketUpdate.current) {
        isSocketUpdate.current = false;
        console.log("Skipping emit - this was a socket update");
        return;
      }

      // 🚪 GATE: Are the elements actually different?
      if (!shouldEmit) {
        console.log("Elements are equal, skipping emit");
        return;
      }




      throttledEmit(elements);

    }, [elements, id, throttledEmit]);

    return {
      markAsSocketUpdate: () => {
        isSocketUpdate.current = true;
      }
    };
  };

  // ✅ Usage in your component:
  const { markAsSocketUpdate } = useSocketEmission(boardState.elements, id);














  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const socket = initSocket(token);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("receiveDrawingUpdate", ({ elements, senderId }) => {
      console.log(senderId, socket.id);
      if (senderId === socket.id) return;

      console.log("getting update elements")

      // Mark the next state update as socket update
      markAsSocketUpdate();

      dispactBoardActions({
        type: "socket_update",
        payload: elements,
      });
    });

    return () => {
      socket.off("receiveDrawingUpdate");
    };
  }, []);



  const changeToolHandler = (tool) => {
    dispactBoardActions({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: tool,
    })

  }
  const boardMouseDownHandler = (event, toolboxState) => {


    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) {
      return;
    }


    const { clientX, clientY } = event;

    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {



      dispactBoardActions({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        }
      }
      )
      return;
    }
    dispactBoardActions({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke,
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,

      },
    })

  }
  const boardMouseMoveHandler = (event) => {


    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) {
      return;
    }

    const { clientX, clientY } = event;

    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {


      dispactBoardActions({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        },
      })
    }


    else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {

      dispactBoardActions({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      })


    }
  }
  const boardMouseUpHandler = (event) => {


    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {

      dispactBoardActions({
        type: BOARD_ACTIONS.DRAW_UP,
      })
    }

    dispactBoardActions({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      }
    })

  }

  const textAreaBlurHandler = (text) => {

    dispactBoardActions({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text,
      }
    })
  }

  const boardUndoHandler = useCallback(() => {
    dispactBoardActions({
      type: BOARD_ACTIONS.UNDO,
    })

  }, []);
  const boardRedoHandler = useCallback(() => {
    dispactBoardActions({
      type: BOARD_ACTIONS.REDO,
    })
  }, []);

  const changeTextElement =(value)=>{
         dispactBoardActions({
          type: "text_element_changing",
          payload: value,
         })
  }

  const boardContextValue = {
    activeToolItem: boardState.activeToolItem,
    elements: boardState.elements,
    changeToolHandler,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    toolActionType: boardState.toolActionType,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo: boardUndoHandler,
    redo: boardRedoHandler,
    id,

    changeTextElement,

  }

  return (
    <BoardContext.Provider value={boardContextValue} >{children}</BoardContext.Provider>
  )
}

export default BoardProvier;