import React, { useEffect, useState } from 'react'
import TextEditor from '../../../TextEditor'
import { boardService } from '../../../../services/board.service'

const ChecklistPicker = ({ task, onTaskUpdated, onCloseModal }) => {
    const [checklist, setChecklist] = useState({})
    useEffect(() => {
        console.log('ONCE');
        const emptyChecklist = boardService.getEmptyCheckList();
        setChecklist({ ...emptyChecklist })
    }, [])

    const handleChange = (ev) => {
        setChecklist({ ...checklist, [ev.target.name]: ev.target.value })
    }
    const addChecklist = () => {
        const taskCopy = JSON.parse(JSON.stringify(task));
        const checklistCopy = { ...checklist }
        taskCopy.checklists.push(checklistCopy)
        onTaskUpdated(taskCopy)
        onCloseModal()
    }
    return (
        <div className="pop-up">
            <div className="pop-up-header">
                <span className="pop-up-title">Add checklist</span>
                <button className="pop-up-close-btn clear-btn">
                    {/* <i className="fas fa-times"></i> */}
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
