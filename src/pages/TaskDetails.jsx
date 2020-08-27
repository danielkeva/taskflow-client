import React, { useState, useContext, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import TextEditor from '../components/TextEditor';
import { BoardContext } from '../store/contexts/BoardContext';
import TaskActions from '../components/task-cmps/task-actions/TaskActions';
import Moment from 'react-moment';
import TaskChecklist from '../components/task-cmps/task-actions/checklist-cmps/TaskChecklist';
import LabelList from '../components/task-cmps/task-actions/LabelList';
const TaskDetails = () => {
    const [isActive, setIsActive] = useState(true)
    const { loadTask, board, saveBoard, currTask, updateTask } = useContext(BoardContext)
    const [taskCopy, setTask] = useState(null)

    const { taskId } = useParams();
    const history = useHistory();

    useEffect(() => {
        if (board) {
            loadTask(taskId)
            console.log('tas',taskId);
        }
    }, [board])

    useEffect(() => {
        const setTaskCopy = () => {
            setTask({ ...currTask })
        }

        setTaskCopy()

    }, [currTask])

    const closeModal = () => {
        history.push(`/board/${board._id}`)
    }

    const handleChange = (ev) => {
        setTask({ ...taskCopy, [ev.target.name]: ev.target.value })
    }

    const onUpdateTask = (task) => {
        if (task) {
            console.log('tasdetails', task);
            updateTask({ ...task })
        } else {
            updateTask({ ...taskCopy })
        }
    }
    const updateBoardLabels = (updatedLabels) => {
        const boardCopy = JSON.parse(JSON.stringify(board));

        boardCopy.labels = updatedLabels
        // debugger 
        saveBoard(boardCopy)
        // setTimeout(() => { console.log('sad', board); }, 2000)
    }
    const calendarStrings = {
        lastDay: '[Yesterday ] ',
        sameDay: '[Today ] ',
        nextDay: '[Tomorrow ] ',
        lastWeek: 'DD/MM/YYYY',
        nextWeek: 'DD/MM/YYYY',
        sameElse: 'DD/MM/YYYY'
    };
    return (
        <div className={'cover ' + (isActive ? 'active' : '')} onClick={closeModal}>
            {taskCopy && currTask &&
                < div className={'task-modal ' + (isActive ? 'active' : '')} onClick={(ev) => ev.stopPropagation()} >
                    <div className="left-side">
                        <div className="modal-module">
                            <div className="task-header">
                                <TextEditor type="h3" name="title" text={taskCopy.title} onChange={handleChange} onInputBlur={onUpdateTask} />
                            </div>
                        </div>
                        <div className="modal-module">
                            <div className="task-labels-date">
                                <div className="task-labels-list">
                                    <h3>Labels</h3>
                                    {taskCopy.labels && <LabelList labels={taskCopy.labels} />}
                                </div>
                                {taskCopy.dueDate &&
                                    <div className="task-due-date">
                                        <h3>Due date</h3>
                                        <Moment calendar={calendarStrings} date={taskCopy.dueDate} />
                                    </div>}
                            </div>
                        </div>
                        <div className="modal-module">
                            <div className="task-description">
                                <i className="far fa-file-alt"></i>
                                <h3>Description</h3>
                            </div>
                            <TextEditor type="p" name="description" text={taskCopy.description} onChange={handleChange} onInputBlur={onUpdateTask} isWide={true} />
                        </div>
                        <div className="modal-module">
                            {taskCopy.checklists && taskCopy.checklists.map(checklist => (
                                <TaskChecklist
                                    checklist={checklist}
                                    key={checklist.id}
                                    task={taskCopy}
                                    onUpdateTask={onUpdateTask}
                                />
                            ))}
                        </div>
                        <div className="modal-module">
                            <h3>Activity</h3>
                            {/* <activity-log :taskId="taskCopy.id" /> */}
                        </div>
                    </div>
                    <div className="right-side">
                        <h3>Add to card</h3>
                        {board && <TaskActions
                            task={taskCopy}
                            labels={board.labels}
                            onUpdateTask={onUpdateTask}
                            onLabelsUpdated={updateBoardLabels}
                        />}
                    </div>
                </div>
            }
        </div >
    )
}

export default TaskDetails
