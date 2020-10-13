import React, { useRef } from 'react'
import { useState } from 'react'
import LabelPicker from './LabelPicker'
import DatePicker from './DatePicker'
import ChecklistPicker from './checklist-cmps/ChecklistPicker'
import useOnClickOutside from '../../../hooks/useOnClickOutSide'
import CoverPicker from './CoverPicker'
import { useEffect } from 'react'
import { BsLockFill } from 'react-icons/bs'
import { useCallback } from 'react'

const TaskActions = ({ task, labels, onUpdateTask, onLabelsUpdated, onAddActivity }) => {
    const sidebarRef = useRef(null)
    const [currAction, setCurrAction] = useState(null)

    // useOnClickOutside(wrapperRef, () => {
    //     console.log('yes');

    //     if (currAction) {
    //         closeModal()
    //     }
    // });

    const [bounds, setBounds] = useState(null)
    const ref = useRef(null)

    const toggle = (ev, isActive) => {
        ref.current = ev.target.id
        const { top, left, height } = ev.target.getBoundingClientRect();
        const res = window.innerWidth - left - 304

        if (res < 50 && window.innerWidth > 770) {
            setBounds({ top: top + height, left: left - 100 })
        } else {
            setBounds({ top: top + height, left: left - 50 })
        }
        if (isActive === currAction) {
            setCurrAction(null)
            setBounds(null)
            ref.current = null
        } else {
            setCurrAction(isActive)
        }
    }
    // console.log('taskactions')
    const updateWidthAndHeight = useCallback(() => {
        if (ref.current) {
            const activeEl = document.getElementById(ref.current)
            const { top, left, height } = activeEl.getBoundingClientRect();
            const res = window.innerWidth - left - 304
            if (res < 50) {
                setBounds({ top: top + height, right: 0 })
            }
            else {
                setBounds({ top: top + height, left: left })
            }
        }
    }, [])

    useEffect(() => {
        if (currAction) {
            window.addEventListener("resize", updateWidthAndHeight);
        } else {
            window.removeEventListener("resize", updateWidthAndHeight)
        }
    }, [currAction])



    const closeModal = () => {
        setCurrAction(null)
        ref.current = null
    }

    return (
        <div className="modal-sidebar" ref={sidebarRef}>
            <h3>Add to card</h3>
            <button id="sidebar-labels" className="modal-btn" onClick={(ev) => toggle(ev, 'isLabelActive')}>Labels</button>
            {currAction === 'isLabelActive' &&
                <LabelPicker
                    bounds={bounds}
                    task={task}
                    labels={labels}
                    onCloseModal={closeModal}
                    onTaskUpdated={onUpdateTask}
                    labelsUpdated={onLabelsUpdated}
                    exceptionRef={sidebarRef}
                />}
            <button className="modal-btn" >Members</button>
            <button id="sidebar-checklist" className="modal-btn" onClick={(ev) => toggle(ev, 'isChecklistActive')}>Checklist</button>
            {currAction === 'isChecklistActive' &&
                <ChecklistPicker
                    task={task}
                    bounds={bounds}
                    onTaskUpdated={onUpdateTask}
                    onCloseModal={closeModal}
                    exceptionRef={sidebarRef}
                />}
            <button id="sidebar-date" className="modal-btn" onClick={(ev) => toggle(ev, 'isDueDateActive')}>Due date</button>
            {currAction === 'isDueDateActive' &&
                <DatePicker
                    bounds={bounds}
                    task={task}
                    onTaskUpdated={onUpdateTask}
                    onAddActivity={onAddActivity}
                    onCloseModal={closeModal}
                    exceptionRef={sidebarRef}
                />}
            {/* Show the cover button only when cover is not set (displayed in header otherwise) */}
            {!task.cover.background && <button id="sidebar-cover" className="modal-btn" onClick={(ev) => toggle(ev, 'isCoverActive')}>Cover</button>}
            {currAction === 'isCoverActive' &&
                <CoverPicker
                    bounds={bounds}
                    exceptionRef={sidebarRef}
                    task={task}
                    onCloseModal={closeModal}
                    onTaskUpdated={onUpdateTask}
                     />}
        </div>
    )
}

export default TaskActions
