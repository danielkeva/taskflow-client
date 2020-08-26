import React from 'react'
import { RiCloseLine } from 'react-icons/ri'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { useState } from 'react'
import { useEffect } from 'react';

const DatePicker = ({ task, onTaskUpdated, onCloseModal }) => {
    const [value, setDate] = useState(new Date());
    useEffect(() => {
        if (task.dueDate) {
            // const date = new Date(task.dueDate)
            setDate(task.dueDate)
        }
    }, [])
    const submitDate = () => {
        // const date = value.getTime();
        const taskCopy = JSON.parse(JSON.stringify(task));
        taskCopy.dueDate = value
        console.log('trasd',taskCopy);
        onTaskUpdated(taskCopy)
        onCloseModal()
    }
    return (
        <div className="pop-up">
            <div className="pop-up-header">
                <span className="pop-up-title">Date</span>
                <button onClick={onCloseModal} className="pop-up-close-btn clear-btn icon-lg">
                    <RiCloseLine />
                </button>
            </div>
            <Calendar
                onChange={setDate}
                value={value}
            />
            <button onClick={submitDate} className="submit-btn add-date-btn">Save</button>
        </div>
    )
}

export default DatePicker
