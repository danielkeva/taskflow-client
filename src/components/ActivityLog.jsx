import React from 'react'
import { useSelector } from 'react-redux'

const ActivityLog = ({ taskId = null }) => {
    const activities = useSelector(state => {
        if (taskId) {
            return state.board.currBoard.activities.filter(activity => activity.taskId === taskId)
        } else {
            return state.board.currBoard.activities
        }
    })
    return (
        <div>
            <h1>activity</h1>
            {activities.length > 0 && activities.map(activity => (
                <div key={activity.id}>
                    {taskId ?
                        <p dangerouslySetInnerHTML={{ __html: activity.cardTxt }}></p> :
                        <p dangerouslySetInnerHTML={{ __html: activity.boardTxt }}></p>}
                </div>
            ))}
        </div>
    )
}

export default ActivityLog
