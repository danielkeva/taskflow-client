import React, { useState, useEffect, useRef } from 'react'
import useKeyPress from '../hooks/useKeypress'

const TextEditor = ({ type, text, name, onInputBlur, isWide, isFocused, blurInput, onChange, onSubmit, onEscape }) => {
    // const [textCopy, setText] = useState(text)
    const [isEditing, setIsEditing] = useState(false)
    const [initialText, setInitialText] = useState('')
    const inputEl = useRef(null)

    const enter = useKeyPress("Enter");
    const esc = useKeyPress("Escape");


    useEffect(() => {
        if (isEditing) {
            inputEl.current.focus()
        }
    }, [isEditing])



    useEffect(() => {
        if (isFocused) {
            setIsEditing(true)
        }
    }, [isFocused, isEditing]);


    useEffect(() => {
        // check if 'blurInput' prop is passed from parent 
        if (blurInput !== undefined && blurInput) {
            //and wether or not to change the isEditing state from the parent component (for bluring the input)
            setIsEditing(false)
        }
    }, [blurInput])



    useEffect(() => {
        if (isEditing) {
            setInitialText(text)
        }
    }, [isEditing]) // when input is focused save the initial text


    useEffect(() => {
        if (isEditing && !isWide) { // if input is focused and not textarea
            // if Enter is pressed, save the text and case the editor
            if (enter) {
                if (onInputBlur) {
                    onInputBlur()
                } else {
                    onSubmit()
                }
                setIsEditing(false);
            }
            // if Escape is pressed, revert the text and close the editor
            if (esc) {
                const customEv = {
                    target: {
                        name: name,
                        value: initialText
                    },
                }
                onChange(customEv)
                setIsEditing(false);
                if (onEscape) {
                    onEscape()
                }
            }
        }
    }, [enter, esc]); // watch the Enter and Escape key presses

    const ModuleText = React.createElement(
        type,
        {
            className: 'module-text',
            dir: 'auto',
            onClick: () => { setIsEditing(true) }
        },
        text
    );


    const updateText = () => {
        if (onInputBlur) {
            setIsEditing(false)
            onInputBlur()
        }
    }
    const test = (ev) => {
        const reg = /^\s+$/; // check for whitespace 
        const inputVal = ev.target.value;
        if (reg.test(inputVal) || inputVal === '') {
            return
        } else {
            onChange(ev)
        }
    }
    const handleTextareaChange = (ev) => {
        onChange(ev)
    }
    const focusInput = () => {
        if (!isEditing) {
            setIsEditing(true)
            setTimeout(() => {
                inputEl.current.focus();
            }, 0)

        }
    }
    return (
        <div className="text-editor-wrapper">
            {
                isEditing ?
                    (!isWide ?
                        <input dir="auto" type="text" ref={inputEl} autoFocus className="focusClass" name={name} defaultValue={text} onChange={test} onBlur={updateText} /> :
                        <textarea ref={inputEl} className="focusClass" autoFocus rows="5" name={name} defaultValue={text} onChange={handleTextareaChange} onBlur={updateText} />) :
                    ModuleText
            }

        </div>
    )
}

export default TextEditor
