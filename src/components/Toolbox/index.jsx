
import { useContext, useState } from 'react';
import classes from './index.module.css'
import { COLORS, STROKE_TOOL_TYPES, TOOL_ITEMS, FILL_TOOL_TYPES, SIZE_TOOL_TYPES } from '../../constants';
import BoardContext from '../../store/board-context';
import toolboxContext from '../../store/toolbox.context';
import cx from 'classnames';
const index = () => {
    const { activeToolItem } = useContext(BoardContext);
    const { toolboxState, changeStrokeHandler, changeFillHandler, changeSizeHandler } = useContext(toolboxContext);
    const strokeColor = toolboxState[activeToolItem]?.stroke;
    const fillColor = toolboxState[activeToolItem]?.fill;
    const size = toolboxState[activeToolItem]?.size;
    return (
        <div className={classes.container}>

            {STROKE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLable}>
                    Stroke Color
                </div>
                <div className={classes.colorsContainer}>

                    <div>
                        <input
                            className={classes.colorPicker}
                            type="color"
                            value={strokeColor}
                            onChange={(e) => changeStrokeHandler(activeToolItem, e.target.value)}
                        />
                    </div>

                    {
                        Object.keys(COLORS).map((c, index) => {
                            return <div className={cx(classes.colorBox,
                                { [classes.activeColorBox]: strokeColor === COLORS[c] })}
                                style={{ backgroundColor: COLORS[c] }}
                                onClick={() => changeStrokeHandler(activeToolItem, COLORS[c])}
                                key={index}
                            >
                            </div>

                        })
                    }
                </div>
            </div>
            }

            {FILL_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLable}>
                    Fill Color
                </div>
                <div className={classes.colorsContainer}>
                    {fillColor === null ? <div
                        className={cx(classes.colorPicker, classes.noFillColorBox)}
                        onClick={() => changeFillHandler(activeToolItem, COLORS.BLACK)}
                    >
                    </div>

                        :
                        <div>
                            <input
                                className={classes.colorPicker}
                                type="color"
                                value={strokeColor}
                                onChange={(e) => changeFillHandler(activeToolItem, e.target.value)}
                            />
                        </div>
                    }
                  <div
                        className={cx(
                            classes.colorBox,               
                            classes.noFillColorBox,          
                            {
                                [classes.activeColorBox]:     
                                    fillColor === null         
                            }
                        )}
                        onClick={() => changeFillHandler(activeToolItem,null)}
                    ></div>

                    {
                        Object.keys(COLORS).map((c, index) => {
                            return <div className={cx(classes.colorBox,
                                { [classes.activeColorBox]: fillColor === COLORS[c] })}
                                style={{ backgroundColor: COLORS[c] }}
                                onClick={() => changeFillHandler(activeToolItem, COLORS[c])}
                                key={index}
                            >
                            </div>

                        })
                    }

                    


                </div>
            </div>
            }

            {SIZE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLable}>
                    {activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
                </div>
                <input
                    type="range"
                    min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
                    max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
                    step={1}
                    value={size}
                    onChange={(event) => changeSizeHandler(activeToolItem, event.target.value)}
                />

            </div>
            }
        </div >
    )
}

export default index