import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TextEditor from '../../../TextEditor'
import { boardService } from '../../../../services/board.service'
import useOnClickOutside from '../../../../hooks/useOnClickOutSide';
import ChecklistItem from './ChecklistItem';

import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import { toggleInitialAddition } from '../../../../store/actions/generalAction';
import { RiCloseLine } from 'react-icons/ri';
import { useRouteMatch } from 'react-router-dom';
import { useMemo } from 'react';


const TaskChecklist = ({ task, checklist, onUpdateTask }) => {
    const [newItem, setNewItem] = useState(null);
    const [checklistTitle, setChecklistTitle] = useState(checklist.title);
    const [progress, setProgress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const wrapperRef = useRef(null)
    const { url } = useRouteMatch();
    const dispatch = useDispatch()
    const isInitialAddition = useSelector(state => state.general.isInitialAddition)

    useEffect(() => {
        // Checking wether or not to start editing in TaskChecklist cmp on initial render
        if (isInitialAddition) {
            addItem()
        }
    }, [])

    useMemo(() => {
        const doneCount = checklist.listItems.reduce((acc, item) => {
            if (item.isDone) acc++
            return acc
        }, 0)
        let donePrecent = Math.round((doneCount * 100) / checklist.listItems.length)
        setProgress(donePrecent)
    }, [checklist])

    const addItem = () => {
        const emptyItem = boardService.getEmptyListItem();
        setNewItem(emptyItem)
        setIsEditing(true);
        if (isInitialAddition) {
            dispatch(toggleInitialAddition(false))
        }
    }

    const handleClose = () => {
        setIsEditing(false);
        setNewItem(null);
    }

    const handleChange = (ev) => {
        setNewItem({ ...newItem, [ev.target.name]: ev.target.value });
    }
    const handleChecklistChange = (ev) => {
        setChecklistTitle(ev.target.value);
    }

    const updateChecklistTitle = () => {
        const checklistCopy = { ...checklist };
        checklistCopy.title = checklistTitle
        const newActivity = boardService.newActivity(
            `Renamed ${checklistCopy.title} from (${checklist.title})`,
            `Renamed ${checklistCopy.title} from (${checklist.title}) on <a href="${url}">${task.title}</a>`,
            task.id
        )
        updateTask(checklistCopy, newActivity);
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

    const updateChecklist = async (item, activity) => {
        const checklistCopy = { ...checklist };
        if (item) {
            const idx = checklistCopy.listItems.findIndex(currItem => currItem.id === item.id)
            if (idx !== -1) {
                checklistCopy.listItems.splice(idx, 1, item) // update an item 
                await updateTask(checklistCopy, activity);
            }
        } else { // Add  item
            if (!newItem.title) {
                handleClose()
                return;
            }
            checklistCopy.listItems.push(newItem)
            await updateTask(checklistCopy);
            addItem()
        }
    }

    const updateTask = (updatedChecklist, activity) => {
        const taskCopy = JSON.parse(JSON.stringify(task));

        if (updatedChecklist) {
            const idx = taskCopy.checklists.findIndex(currChecklist => currChecklist.id === updatedChecklist.id)
            taskCopy.checklists.splice(idx, 1, updatedChecklist)
        } else {
            taskCopy.checklists = taskCopy.checklists.filter(currChecklist => currChecklist.id !== checklist.id) // Delete checklist
            activity = boardService.newActivity(
                `Removed ${checklist.title}  on this card`,
                `Removed ${checklist.title} on [${task.title}](${url})`,
                task.id
            )
        }
        onUpdateTask(taskCopy, activity)
        setIsEditing(false);
        setNewItem(null);
    }
    // console.log('yes darling', checklist.title)
    return (
        <div className="task-checklist">
            <div className="section-title flex align-center">
                <TextEditor
                    text={checklistTitle}
                    onChange={handleChecklistChange}
                    onInputBlur={updateChecklistTitle}
                    type="h3"
                />
                <button className="modal-btn" onClick={() => updateTask()}>Delete</button>
            </div>

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
                    task={task}
                />
            ))
            }
            {newItem && isEditing &&
                <div className="add-item" ref={wrapperRef}>
                    <TextEditor
                        onChange={handleChange}
                        onSubmit={updateChecklist}
                        onEscape={handleClose}
                        isFocused={isEditing}
                        type="p"
                        name="title"
                    />

                    <div className="add-item-controls" >
                        <button className="submit-btn" onClick={() => updateChecklist()}>Save</button>
                        <button className="clear-btn icon-lg" onClick={handleClose}>
                            <RiCloseLine />
                        </button>
                        <div className="spacer" onClick={handleClose}></div>
                    </div>
                </div>

            }
            {!isEditing && <button className="modal-btn" onClick={addItem} >Add an item</button>}
        </div>
    )
}

export default TaskChecklist
