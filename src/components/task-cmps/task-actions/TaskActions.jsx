import React, { useRef } from 'react'
import { useState } from 'react'
import LabelPicker from './LabelPicker'
import DatePicker from './DatePicker'
import ChecklistPicker from './checklist-cmps/ChecklistPicker'
import useOnClickOutside from '../../../hooks/useOnClickOutSide'
import CoverPicker from './CoverPicker'

const TaskActions = ({ task, labels, onUpdateTask, onLabelsUpdated, onAddActivity }) => {
    const wrapperRef = useRef(null)
    const [isActive, setIsActive] = useState(false)
    const [currAction, setCurrAction] = useState('')
    const [activeAction, setAction] = useState({
        isLabelActive: false,
        isMemberActive: false,
        isChecklistActive: false,
        isDueDateActive: false,
        isCoverActive: false,
    })

    useOnClickOutside(wrapperRef, () => {
        closeModal()
    });


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
        <div className="modal-sidebar" ref={wrapperRef}>
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
                    onAddActivity={onAddActivity}
                    onCloseModal={closeModal}
                />}
            <button className="modal-btn" onClick={() => toggle('isCoverActive')}>Cover</button>
            {activeAction.isCoverActive &&
                <CoverPicker
                    onCloseModal={closeModal}
                    onTaskUpdated={onUpdateTask} />}            {/* <button className="modal-btn" onClick="$emit('removeTask')">Delete</button> */}
        </div>
    )
}

export default TaskActions
