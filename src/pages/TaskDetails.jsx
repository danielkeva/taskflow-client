import React, { useState, useContext, useEffect, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { loadTask, saveBoard, updateTask } from '../store/actions/boardActions';
import Color, { Palette } from "color-thief-react";
import { useColor } from 'color-thief-react'

import Moment from 'react-moment';

import TextEditor from '../components/TextEditor';
import TaskActions from '../components/task-cmps/task-actions/TaskActions';
import TaskChecklist from '../components/task-cmps/task-actions/checklist-cmps/TaskChecklist';
import LabelList from '../components/task-cmps/task-actions/LabelList';
import ActivityLog from '../components/ActivityLog';
import useOnClickOutside from '../hooks/useOnClickOutSide';
import { RiCloseLine } from 'react-icons/ri';
import CoverPicker from '../components/task-cmps/task-actions/CoverPicker';
import LabelPicker from '../components/task-cmps/task-actions/LabelPicker';

// const { loadTask, board, saveBoard, currTask, updateTask } = useContext(BoardContext)

const calendarStrings = {
    lastDay: '[Yesterday ] ',
    sameDay: '[Today ] ',
    nextDay: '[Tomorrow ] ',
    lastWeek: 'DD/MM/YYYY',
    nextWeek: 'DD/MM/YYYY',
    sameElse: 'DD/MM/YYYY'
};
const TaskDetails = () => {

    const dispatch = useDispatch()
    const currTask = useSelector(state => state.board.currTask)
    const board = useSelector(state => state.board.currBoard)

    const [activeAction, setActiveAction] = useState(null)
    const [taskCopy, setTask] = useState(null)
    
    const wrapperRef = useRef(null)
    const modalHeaderRef = useRef(null)

    const { taskId } = useParams();
    const history = useHistory();

    useEffect(() => {
        const load = async () => {
            const res = await dispatch(loadTask(taskId))
            if (!res) {
                history.push(`/board/${board._id}`)
            }
        }
        load()
    }, [])

    useEffect(() => {
        const setTaskCopy = () => {
            if (currTask) {
                setTask({ ...currTask })
            }
        }
        setTaskCopy()
    }, [currTask])


    const closeModal = () => {
        history.push(`/board/${board._id}`)
    }

    useOnClickOutside(wrapperRef, () => {
        console.log('paam ahat')
        closeModal()
    });
    useOnClickOutside(modalHeaderRef, () => {
        console.log('paam ahat')
        setActiveAction(null)
    });

    const handleChange = (ev) => {
        setTask({ ...taskCopy, [ev.target.name]: ev.target.value })
    }

    const onUpdateTask = async (task) => {
        if (task) {
            await updateBoard({ ...task })
        } else {
            updateBoard({ ...taskCopy })
        }
    }

    const updateBoard = async (task) => {
        dispatch(updateTask(task))
        const boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy.taskLists.forEach(taskList => {
            let idx = taskList.tasks.findIndex(currTask => currTask.id === task.id)
            if (idx !== -1) {
                taskList.tasks.splice(idx, 1, task)
            }
        })
        await dispatch(saveBoard(boardCopy))
    }

    const updateBoardLabels = (updatedLabels, editedLabel) => {
        const boardCopy = JSON.parse(JSON.stringify(board));

        boardCopy.labels = updatedLabels

        boardCopy.taskLists.forEach(taskList => {
            taskList.tasks.forEach(task => {
                let currLabel = task.labels.find(label => label.id === editedLabel.id)
                if (currLabel) {
                    currLabel.title = editedLabel.title
                }
            })
        })
        dispatch(saveBoard(boardCopy))
    }
    const addActivity = async (activity) => {
        // await console.log('addactivity',board)
        const boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy.activities.unshift(activity)
        await dispatch(saveBoard(boardCopy))
    }

    return (
        <section className="task-details-wrapper">
            <div className={'cover'} ></div>
            <div className="task-details">
                {taskCopy && currTask &&
                    <div className="task-modal" ref={wrapperRef}>
                        {taskCopy.cover.background &&
                            <Color src={taskCopy.cover.background} crossOrigin="anonymous" format="hex">
                                {({ data }) => {
                                    return (
                                        <div
                                            style={{ backgroundImage: `url(${taskCopy.cover.background})`, backgroundColor: data ? data : taskCopy.cover.background }}
                                            className="modal-header">
                                            {taskCopy.cover.background && <button className="modal-btn" onClick={() => setActiveAction('coverPicker')}>Cover</button>}
                                            {activeAction === 'coverPicker' &&
                                                <CoverPicker // outside TaskActions
                                                    task={taskCopy}
                                                    onTaskUpdated={onUpdateTask}
                                                    onCloseModal={() => setActiveAction(null)}
                                                    wrapperRef={modalHeaderRef} />}
                                        </div>
                                    )
                                }}
                            </Color>
                        }
                        <a onClick={closeModal} className="modal-close-btn icon-lg" >
                            <RiCloseLine />
                        </a>
                        <div className="modal-module">
                            <div className="task-title">
                                <TextEditor type="h3" name="title" text={taskCopy.title} onChange={handleChange} onInputBlur={onUpdateTask} />
                            </div>
                        </div>
                        <div className="task-content">
                            <div className="left-side">
                                <div className="modal-module">
                                    <div className="task-labels-date">
                                        <div className="task-labels-list">
                                            <h3>Labels</h3>
                                            {taskCopy.labels &&
                                                <LabelList
                                                    expandMode={true}
                                                    onLabelClicked={() => setActiveAction('labelPicker')}
                                                    labels={taskCopy.labels} />}
                                            {activeAction === 'labelPicker' &&
                                                <LabelPicker // outside TaskActions
                                                    task={taskCopy}
                                                    onTaskUpdated={onUpdateTask}
                                                    labelsUpdated={updateBoardLabels}
                                                    onCloseModal={() => setActiveAction(null)}
                                                    labels={board.labels}
                                                />}
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
                                    <ActivityLog taskId={taskCopy.id} />
                                </div>
                            </div>
                            <div className="right-side">
                                <h3>Add to card</h3>
                                {board && <TaskActions
                                    task={taskCopy}
                                    labels={board.labels}
                                    onUpdateTask={onUpdateTask}
                                    onLabelsUpdated={updateBoardLabels}
                                    onAddActivity={addActivity}
                                />}
                            </div>
                        </div>
                    </div>
                }
            </div >
        </section>
    )
}

export default TaskDetails
