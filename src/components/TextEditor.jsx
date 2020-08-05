import React, { useState, useEffect, useRef } from 'react'

const TextEditor = ({ type, text, onInputBlur, isWide, isFocused }) => {
    const [textCopy, setText] = useState(text)
    const [isEditing, setIsEditing] = useState(false)
    const inputEl = useRef(null)

    useEffect(() => {
        if (isFocused) {
            console.log('s', isFocused);
            focusInput()
        }
    }, [isFocused])

    const ModuleText = React.createElement(
        type,
        {
            className: 'module-text',
            onClick: () => { setIsEditing(true) }
        },
        text
    );
    const updateText = () => {
        setIsEditing(false)
        onInputBlur(textCopy)
    }
    const test = (ev) => {
        const reg = /^\s+$/; // regex whitespace 
        const inputVal = ev.target.value;
        if (reg.test(inputVal) || inputVal === '') {
            setText(text)
        } else {
            setText(inputVal)

        }
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
                        <input type="text" ref={inputEl} autoFocus className="focusClass" name="name" defaultValue={text} onBlur={updateText} onChange={test} /> :
                        <textarea className="focusClass" rows="5" />) :
                    ModuleText
            }

        </div>
    )
}

export default TextEditor
