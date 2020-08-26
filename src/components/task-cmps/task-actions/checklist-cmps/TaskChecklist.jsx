import React, { useState, useRef, useEffect } from 'react'
import TextEditor from '../../../TextEditor'
import { boardService } from '../../../../services/board.service'
import useOnClickOutside from '../../../../hooks/useOnClickOutSide';
import ChecklistItem from './ChecklistItem';

import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

const TaskChecklist = ({ task, checklist, onUpdateTask }) => {
    const [newItem, setNewItem] = useState(null);
    const [progress, setProgress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const wrapperRef = useRef(null)

    useEffect(() => {
        if (!checklist.listItems.length) {
            addItem()
        }
    }, [checklist])

    useEffect(() => {
        const doneCount = checklist.listItems.reduce((acc, item) => {
            if (item.isDone) acc++
            return acc
        }, 0)
        let donePrecent = Math.round((doneCount * 100) / checklist.listItems.length)
        setProgress(donePrecent)
    }, [checklist])

    const addItem = () => {
        const emptyItem = boardService.getEmptyListItem();
        setNewItem({ ...emptyItem })
        setIsEditing(true);
    }

    const handleClose = () => {
        setIsEditing(false);
        setNewItem(null);
    }

    const handleChange = (ev) => {
        setNewItem({ ...newItem, [ev.target.name]: ev.target.value });
    }

    useOnClickOutside(wrapperRef, () => {
        if (isEditing) {
            setIsEditing(false)
            setNewItem(null)
        }
    });

    const removeItem = (itemId) => {
        const checklistCopy = { ...checklist };
        const idx = checklistCopy.listItems.findIndex(item => item.id === itemId)
        if (idx !== -1) {
            checklistCopy.listItems.splice(idx, 1)
        }
        updateTask(checklistCopy)
    }

    const updateChecklist = (item) => {
        const checklistCopy = { ...checklist };
        if (item) {
            const idx = checklistCopy.listItems.findIndex(currItem => currItem.id === item.id)
            if (idx !== -1) {
                checklistCopy.listItems.splice(idx, 1, item) // update an item 
                updateTask(checklistCopy);
            }
        } else {
            checklistCopy.listItems.push(newItem)
            updateTask(checklistCopy);
            addItem()
        }
    }

    const updateTask = (checklist) => {
        const taskCopy = JSON.parse(JSON.stringify(task));
        const idx = taskCopy.checklists.findIndex(currChecklist => currChecklist.id === checklist.id)
        taskCopy.checklists.splice(idx, 1, checklist)
        onUpdateTask(taskCopy)
        setIsEditing(false);
        setNewItem(null);
    }

    return (
        <div>
            <h3>{checklist.title}</h3>
            {checklist.listItems.length > 0 &&
                <Progress
                    percent={progress}
                />}
            {checklist && checklist.listItems.map(item => (
                <ChecklistItem
                    key={item.id}
                    onSubmit={updateChecklist}
                    onRemoveItem={removeItem}
                    item={item}
                />
            ))
            }
            {newItem && isEditing &&
                <div ref={wrapperRef}>
                    <TextEditor
                        onChange={handleChange}
                        onSubmit={updateChecklist}
                        onEscape={handleClose}
                        isFocused={isEditing}
                        type="p"
                        name="title"
                    />
                    <div className="flex">
                        <button>Save</button>
                        <button onClick={handleClose}>Close</button>
                        <div className="spacer" onClick={handleClose}></div>
                    </div>
                </div>
            }
            {!isEditing && <button className="modal-btn" onClick={addItem} >Add an item</button>}
        </div>
    )
}

export default TaskChecklist
