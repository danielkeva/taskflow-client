import React, { useEffect,useState } from 'react'
import { useRouteMatch } from 'react-router-dom';

import moment from 'moment'
import { RiCloseLine } from 'react-icons/ri'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { boardService } from '../../../services/board.service';

const DatePicker = ({ task, onTaskUpdated, onCloseModal, onAddActivity }) => {
    const [value, setDate] = useState(new Date());
    const [isTaskUpdated, setIsUpdated] = useState(false)
    let { url } = useRouteMatch();

    useEffect(() => {
        if (task.dueDate) {
            const date = new Date(task.dueDate)
            setDate(date)
        }
    }, [])

    useEffect(() => {
        const addActivity = async () => {
            if (isTaskUpdated) {
                const dueDate = moment(new Date(task.dueDate)).format("MMM Do YY");

                const activity = boardService.newActivity(
                    `set this card to be due at ${dueDate}`,
                    `set <a href="${url}">${task.title}</a> to be due at ${dueDate}`,
                    task.id
                )
                await onAddActivity(activity)
            }
        }
        addActivity()
    }, [isTaskUpdated])



    const submitDate = async () => {
        const taskCopy = JSON.parse(JSON.stringify(task));
        taskCopy.dueDate = value
        await onTaskUpdated(taskCopy)
        setIsUpdated(true)
        onCloseModal()
    }


    const onChangeDate = (date) => {
        setDate(date)
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
                onChange={onChangeDate}
                value={value}
            />
            <button onClick={submitDate} className="submit-btn add-date-btn">Save</button>
        </div>
    )
}

export default DatePicker
