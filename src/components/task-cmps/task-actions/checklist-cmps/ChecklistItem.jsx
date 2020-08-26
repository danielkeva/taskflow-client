import React, { useState, useEffect } from 'react'
import TextEditor from '../../../TextEditor';
import useOnClickOutside from '../../../../hooks/useOnClickOutSide';
import { useRef } from 'react';
import { BsTrash } from "react-icons/bs";


const ChecklistItem = ({ item, onSubmit, onRemoveItem }) => {
    const [itemCopy, setItem] = useState({ ...item });
    const [isEditing, setIsEditing] = useState(false);
    const wrapperRef = useRef(null)
    const initialRender = useRef(true)


    useOnClickOutside(wrapperRef, () => {
        if (isEditing) {
            setIsEditing(false)
            // setNewItem(null)
            console.log('yes');
        }
    });

    // useEffect(() => {
    //     setItem({ ...item })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    useEffect(() => {
        if (!initialRender.current) {
            updateItem()
        } else {
            initialRender.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemCopy.isDone])

    const handleChange = (ev) => {
        const target = ev.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name; setItem({ ...itemCopy, [name]: value });
    }
    const handleClose = () => {
        // when escape is pressed on 'TextEditor.jsx'
        setIsEditing(false)
    }

    const updateItem = () => {
        if (!itemCopy.title) {
            setIsEditing(true)

            return;
        }
        setIsEditing(false)
        onSubmit({ ...itemCopy })
    }

    const handleRemove = () => {
        onRemoveItem(itemCopy.id)
    }
    return (
        <div ref={wrapperRef} className="checklist-item" >
            <div className={'checklist-item-edit space-between ' + (itemCopy.isDone ? 'done' : '')}>
                <div className="flex align-center">
                    {itemCopy && <input type="checkbox" name="isDone" checked={itemCopy.isDone} onChange={handleChange} />}
                    <div onClick={() => setIsEditing(true)}>
                        <TextEditor
                            text={item.title}
                            onChange={handleChange}
                            onSubmit={updateItem}
                            onEscape={handleClose}
                            blurInput={!isEditing}
                            isFocused={isEditing}
                            type="p"
                            name="title"
                        />
                    </div>
                </div>
                <button className="remove-item-btn clear-btn" onClick={handleRemove}>
                    <BsTrash />
                </button>
            </div>
            {isEditing &&
                <div className="flex">
                    <button>Save</button>
                    <button>sds</button>
                    <div className="spacer" onClick={handleClose}></div>
                </div>}
        </div>
    )
}

export default ChecklistItem
