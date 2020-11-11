import React, { memo, useMemo, useState,useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

import Moment from 'react-moment';
import Markdown from 'markdown-to-jsx';
// import DOMPurify from "dompurify";
// import ReactCommonmark from 'react-commonmark'

const calendarStrings = {
    lastDay: '[Yesterday at] LT',
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    lastWeek: '[last] dddd [at] LT',
    nextWeek: 'dddd [at] LT',
    sameElse: 'MMMM D [at] LT'
};
const LIMIT = 5;

const filteredActivities = () =>
    createSelector(
        state => state.activity.activities,
        (_, cardId) => cardId,
        (activities, cardId) => cardId ? activities.filter(activity => activity.cardId === cardId) : activities
    );

const ActivityLog = ({ cardId = null }) => {
    const selectFilteredActivities = useMemo(filteredActivities, []) // Ensuring that each component instance gets its own selector instance
    const activities = useSelector(state => selectFilteredActivities(state, cardId))

    const [showContent, setShowContent] = useState(true);
    const [showMore, setShowMore] = useState(true);
    const [list, setList] = useState([]);
    const [index, setIndex] = useState(LIMIT);

    const history = useHistory();

    useEffect(() => {
        if (activities.length > 0) {
            setList(activities.slice(0, LIMIT))
            setShowMore(true)
            setIndex(LIMIT)
        }
    }, [activities.length])

    const loadMore = () => {
        const newIndex = index + LIMIT;
        const newShowMore = newIndex <= (activities.length - 1);
        const newList = list.concat(activities.slice(index, newIndex));
        setIndex(newIndex);
        setList(newList);
        setShowMore(newShowMore);
    }
    const toggleContent = () => {
        setShowContent(prevState => (!prevState));
    }

    useEffect(() => {
        if (!cardId) {
            const parentNode = document.getElementById('boardActivity')
            if (parentNode && parentNode.childNodes[1]) {
                parentNode.childNodes[1].addEventListener('click', handleAnchorClick)
                return () => {
                    parentNode.childNodes[1].removeEventListener('click', handleAnchorClick)
                }
            }
        }
    }, [list])

    const handleAnchorClick = (ev) => {
        //Disabling  a tag default behavior since we are rendering it from md and not as react 'Link to'
        ev.preventDefault();
        ev.stopPropagation()
        var href = ev.target.getAttribute('href');
        history.push(href)
    }
    return (
        <div className="activity-log">
            {cardId && <button className="modal-btn" onClick={toggleContent}>{showContent ? 'Hide details' : 'Show details'}</button>}
            {showContent && list.length > 0 && list.map(activity => (
                <div className='activity-content' key={activity.id}>
                    {cardId ?
                        <p className="activity-desc">{activity.cardTxt}</p> :
                        <Markdown className="activity-desc" id='boardActivity' options={{ forceBlock: true }}>{activity.boardTxt}</Markdown>}
                    <Moment calendar={calendarStrings}>{activity.date}</Moment>
                </div>
            ))}
            {showContent && showMore && activities.length > LIMIT && <button className="clear-btn show-more-btn" onClick={loadMore}> Load More </button>}
        </div>
    )
}

export default memo(ActivityLog) 
