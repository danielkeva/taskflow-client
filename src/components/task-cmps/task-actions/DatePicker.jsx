import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';

import moment from 'moment'
import { RiCloseLine } from 'react-icons/ri'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { boardService } from '../../../services/board.service';
import useOnClickOutside from '../../../hooks/useOnClickOutSide';

const DatePicker = ({ task, onTaskUpdated, onCloseModal, bounds, exceptionRef }) => {
    const [value, setDate] = useState(new Date());
    let { url } = useRouteMatch();
    const wrapperRef = useRef(null)

    useEffect(() => {
        if (task.dueDate) {
            const date = new Date(task.dueDate)
            setDate(date)
        }
    }, [])


    useOnClickOutside(wrapperRef, () => {
        onCloseModal()
    }, exceptionRef);

    const createActivity = (timestamp, isRemoveActivity = null) => {
        const dueDate = moment(new Date(timestamp)).format("MMM Do");
        if (task.dueDate) {
            return boardService.newActivity(
                `Changed the due date of this card to  ${dueDate}`,
                `Changed [${task.title}](${url}) to be due at ${dueDate}`,
                task.id
            )
        } else if (isRemoveActivity) {
            return boardService.newActivity(
                `Removed the due date from this card`,
                `Removed [${task.title}](${url}) due date`,
                task.id
            )
        } else {
            return boardService.newActivity(
                `Set this card to be due at ${dueDate}`,
                `Set [${task.title}](${url}) to be due at ${dueDate} `,
                task.id
            )
        }
    }



    const submitDate = async () => {
        const timestamp = value.getTime();
        if (timestamp === task.dueDate) return;
        const taskCopy = JSON.parse(JSON.stringify(task));
        taskCopy.dueDate = timestamp
        const newActivity = createActivity(timestamp)
        await onTaskUpdated(taskCopy, newActivity)
        onCloseModal()
    }


    const onChangeDate = (date) => {
        setDate(date)
    }
    return (
        <div className="pop-up" style={bounds} ref={wrapperRef}>
            <div className="pop-up-header">
                <span className="pop-up-title">Date</span>
                <button onClick={onCloseModal} className="pop-up-close-btn clear-btn icon-lg">
                    <RiCloseLine />
                </button>
            </div>
            <Calendar
                onChange={onChangeDate}
                value={value}
            />
            <button onClick={submitDate} className="submit-btn add-date-btn">Save</button>
        </div>
    )
}

export default DatePicker
