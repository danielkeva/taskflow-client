import React, { useRef } from 'react'
import { useState } from 'react'
import LabelPicker from './LabelPicker'
import DatePicker from './DatePicker'
import ChecklistPicker from './checklist-cmps/ChecklistPicker'
import useOnClickOutside from '../../../hooks/useOnClickOutSide'
import CoverPicker from './CoverPicker'

const TaskActions = ({ task, labels, onUpdateTask, onLabelsUpdated, onAddActivity }) => {
    const wrapperRef = useRef(null)
    const [currAction, setCurrAction] = useState(null)

    useOnClickOutside(wrapperRef, () => {
        if (currAction) {
            closeModal()
        }
    });


    const toggle = (isActive) => {
        if (isActive === currAction) {
            setCurrAction(null)
        } else {
            setCurrAction(isActive)
        }
    }

    const closeModal = () => {
        setCurrAction(null)
    }

    return (
        <div className="modal-sidebar" ref={wrapperRef}>
            <button className="modal-btn" onClick={() => toggle('isLabelActive')}>Labels</button>
            {currAction === 'isLabelActive' &&
                <LabelPicker
                    task={task}
                    labels={labels}
                    onCloseModal={closeModal}
                    onTaskUpdated={onUpdateTask}
                    labelsUpdated={onLabelsUpdated}
                />}
            <button className="modal-btn" >Members</button>
            <button className="modal-btn" onClick={() => toggle('isChecklistActive')}>Checklist</button>
            {currAction === 'isChecklistActive' &&
                <ChecklistPicker
                    task={task}
                    onTaskUpdated={onUpdateTask}
                    onCloseModal={closeModal}
                />}
            <button className="modal-btn" onClick={() => toggle('isDueDateActive')}>Due date</button>
            {currAction === 'isDueDateActive' &&
                <DatePicker
                    task={task}
                    onTaskUpdated={onUpdateTask}
                    onAddActivity={onAddActivity}
                    onCloseModal={closeModal}
                />}
            {/* Show the cover button only when cover is not set (displayed in header otherwise) */}
            {!task.cover.background && <button className="modal-btn" onClick={() => toggle('isCoverActive')}>Cover</button>} 
            {currAction === 'isCoverActive' && 
                <CoverPicker
                    task={task}
                    onCloseModal={closeModal}
                    onTaskUpdated={onUpdateTask} />}           
        </div>
    )
}

export default TaskActions
