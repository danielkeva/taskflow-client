import React, { useEffect, useState, useRef } from 'react'
import { useRouteMatch } from 'react-router-dom';
import useOnClickOutside from '../../../hooks/useOnClickOutSide';

import { RiCloseLine } from 'react-icons/ri'
import moment from 'moment'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { boardService } from '../../../services/board.service';

const DatePicker = ({ card, onCardUpdated, onCloseModal, bounds, exceptionRef }) => {
    const [value, setDate] = useState(new Date());
    let { url } = useRouteMatch();
    const wrapperRef = useRef(null)

    useEffect(() => {
        if (card.dueDate) {
            const date = new Date(card.dueDate)
            setDate(date)
        }
    }, [])


    useOnClickOutside(wrapperRef, () => {
        onCloseModal()
    }, exceptionRef);

    const createActivity = (timestamp, isRemoveActivity = null) => {
        const dueDate = moment(new Date(timestamp)).format("MMM Do");
        if (card.dueDate) {
            return boardService.newActivity(
                `Changed the due date of this card to  ${dueDate}`,
                `Changed [${card.title}](${url}) to be due at ${dueDate}`,
                card.id
            )
        } else if (isRemoveActivity) {
            return boardService.newActivity(
                `Removed the due date from this card`,
                `Removed [${card.title}](${url}) due date`,
                card.id
            )
        } else {
            return boardService.newActivity(
                `Set this card to be due at ${dueDate}`,
                `Set [${card.title}](${url}) to be due at ${dueDate} `,
                card.id
            )
        }
    }



    const submitDate = async () => {
        const timestamp = value.getTime();
        if (timestamp === card.dueDate) return;
        const cardCopy = JSON.parse(JSON.stringify(card));
        cardCopy.dueDate = timestamp
        const newActivity = createActivity(timestamp)
        await onCardUpdated(cardCopy, newActivity)
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
