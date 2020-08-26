import React from 'react'
import { useState } from 'react'
import LabelPicker from './LabelPicker'
import DatePicker from './DatePicker'
import ChecklistPicker from './checklist-cmps/ChecklistPicker'

const TaskActions = ({ task, labels, onUpdateTask, onLabelsUpdated }) => {
    const [isActive, setIsActive] = useState(false)
    const [currAction, setCurrAction] = useState('')
    const [activeAction, setAction] = useState({
        isLabelActive: false,
        isMemberActive: false,
        isChecklistActive: false,
        isDueDateActive: false,
        isAttachmentActive: false,
    })

    const toggle = (isActive) => {
        setAction(prevState => ({
            ...prevState,
            [isActive]: !prevState[isActive]
        }));
        setCurrAction(isActive)
        setIsActive(prevState => (prevState, !prevState));
    }

    const closeModal = () => {
        setAction(prevState => ({
            ...prevState,
            [currAction]: !prevState[currAction]
        }));
        setIsActive(false);
        setCurrAction('')
    }
   
    return (
        <div className="modal-sidebar">
            <div className={'sidebar-cover ' + (isActive ? 'active' : '')} onClick={closeModal}></div>
            <button className="modal-btn" onClick={() => toggle('isLabelActive')}>Labels</button>
            {activeAction.isLabelActive &&
                <LabelPicker
                    task={task}
                    labels={labels}
                    onCloseModal={closeModal}
                    onTaskUpdated={onUpdateTask}
                    labelsUpdated={onLabelsUpdated}
                />}
            <button className="modal-btn" >Members</button>
            <button className="modal-btn" onClick={() => toggle('isChecklistActive')}>Checklist</button>
            {activeAction.isChecklistActive &&
                <ChecklistPicker
                    task={task}
                    onTaskUpdated={onUpdateTask}
                    onCloseModal={closeModal}
                />}
            <button className="modal-btn" onClick={() => toggle('isDueDateActive')}>Due date</button>
            {activeAction.isDueDateActive &&
                <DatePicker
                    task={task}
                    onTaskUpdated={onUpdateTask}
                    onCloseModal={closeModal}
                />}
            <button className="modal-btn" >Attachment</button>
            <div>Attachment</div>
            {/* <button className="modal-btn" onClick="$emit('removeTask')">Delete</button> */}
        </div>
    )
}

export default TaskActions
