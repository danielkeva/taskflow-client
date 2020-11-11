import React, { useEffect, useCallback, useRef, useState } from 'react'

import LabelPicker from './LabelPicker'
import DatePicker from './DatePicker'
import ChecklistPicker from './checklist-cmps/ChecklistPicker'
import CoverPicker from './CoverPicker'

const CardActions = ({ card, labels, onUpdateCard, onLabelsUpdated, onAddActivity }) => {
    const sidebarRef = useRef(null)
    const [currAction, setCurrAction] = useState(null)

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
    // console.log('cardactions')
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
                    card={card}
                    labels={labels}
                    onCloseModal={closeModal}
                    onCardUpdated={onUpdateCard}
                    labelsUpdated={onLabelsUpdated}
                    exceptionRef={sidebarRef}
                />}
            <button className="modal-btn" >Members</button>
            <button id="sidebar-checklist" className="modal-btn" onClick={(ev) => toggle(ev, 'isChecklistActive')}>Checklist</button>
            {currAction === 'isChecklistActive' &&
                <ChecklistPicker
                    card={card}
                    bounds={bounds}
                    onCardUpdated={onUpdateCard}
                    onCloseModal={closeModal}
                    exceptionRef={sidebarRef}
                />}
            <button id="sidebar-date" className="modal-btn" onClick={(ev) => toggle(ev, 'isDueDateActive')}>Due date</button>
            {currAction === 'isDueDateActive' &&
                <DatePicker
                    bounds={bounds}
                    card={card}
                    onCardUpdated={onUpdateCard}
                    onAddActivity={onAddActivity}
                    onCloseModal={closeModal}
                    exceptionRef={sidebarRef}
                />}
            {/* Show the cover button only when cover is not set (displayed in header otherwise) */}
            {!card.cover.background && <button id="sidebar-cover" className="modal-btn" onClick={(ev) => toggle(ev, 'isCoverActive')}>Cover</button>}
            {currAction === 'isCoverActive' &&
                <CoverPicker
                    bounds={bounds}
                    exceptionRef={sidebarRef}
                    card={card}
                    onCloseModal={closeModal}
                    onCardUpdated={onUpdateCard}
                />}
        </div>
    )
}

export default CardActions
