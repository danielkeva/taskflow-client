import React, { useEffect, useState } from 'react'
import TextEditor from '../../../TextEditor'
import { boardService } from '../../../../services/board.service'
import useOnClickOutside from '../../../../hooks/useOnClickOutSide'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { toggleInitialAddition } from '../../../../store/actions/generalAction';
import { useRouteMatch } from 'react-router-dom'
const ChecklistPicker = ({ task, onTaskUpdated, onCloseModal, bounds, sidebarRef }) => {
    const [checklist, setChecklist] = useState({})
    const wrapperRef = useRef(null)
    const { url } = useRouteMatch();
    const dispatch = useDispatch()

    useEffect(() => {
        const emptyChecklist = boardService.getEmptyCheckList();
        setChecklist({ ...emptyChecklist })
    }, [])

    useOnClickOutside(wrapperRef, () => {
        onCloseModal()
    }, sidebarRef);

    const handleChange = (ev) => {
        setChecklist({ ...checklist, [ev.target.name]: ev.target.value })
    }
    const addChecklist = () => {
        const taskCopy = JSON.parse(JSON.stringify(task));
        const checklistCopy = { ...checklist }
        taskCopy.checklists.push(checklistCopy)
        const newActivity = boardService.newActivity(
            `Added ${checklist.title}  on this card`,
            `Added ${checklist.title} on [${task.title}](${url})`,
            task.id
        )
        onTaskUpdated(taskCopy, newActivity)
        dispatch(toggleInitialAddition(true)) // Dispatching this action to start editing on TaskChecklist cmp 
        onCloseModal()
    }
    return (
        <div className="pop-up" style={bounds} ref={wrapperRef}>
            <div className="pop-up-header">
                <span className="pop-up-title">Add checklist</span>
                <button className="pop-up-close-btn clear-btn">
                </button>
            </div>
            <TextEditor
                isFocused={true}
                onChange={handleChange}
                onSubmit={addChecklist}
                type="p"
                name="title"
            />
            <button onClick={addChecklist} className="submit-btn add-date-btn">Save</button>
        </div>
    )
}

export default ChecklistPicker
