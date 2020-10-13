import React, { useState, useEffect, useRef, useMemo, memo } from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { loadTask, saveBoard, updateTask } from '../store/actions/boardActions';
import Color from 'color-thief-react';
import { boardService } from '../services/board.service';
import Moment from 'react-moment';

import TextEditor from '../components/TextEditor';
import TaskActions from '../components/task-cmps/task-actions/TaskActions';
import TaskChecklist from '../components/task-cmps/task-actions/checklist-cmps/TaskChecklist';
import LabelList from '../components/task-cmps/task-actions/LabelList';
import ActivityLog from '../components/ActivityLog';
import useOnClickOutside from '../hooks/useOnClickOutSide';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';

import CoverPicker from '../components/task-cmps/task-actions/CoverPicker';
import LabelPicker from '../components/task-cmps/task-actions/LabelPicker';
import DatePicker from '../components/task-cmps/task-actions/DatePicker';
import { useCallback } from 'react';
import { addActivity } from '../store/actions/activityActions';


const calendarStrings = {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    sameElse: 'MMMM D'
};


const TaskDetails = () => {
    const dispatch = useDispatch()
    const currTask = useSelector(state => state.board.currTask)
    const board = useSelector(state => state.board.currBoard)

    const [activeAction, setActiveAction] = useState(null)
    const [taskCopy, setTask] = useState(null)

    const wrapperRef = useRef(null)
    const modalHeaderRef = useRef(null)
    const exceptionRef = useRef(null)

    const { taskId } = useParams();
    const history = useHistory();
    const { url } = useRouteMatch();
    
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

        document.body.style.overflowX = 'hidden'
        return () => {
            // document.body.style.overflowX = 'unset'
            document.body.style.overflowX = 'unset'

        }
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
        closeModal()
    });

    useOnClickOutside(modalHeaderRef, () => {
        setActiveAction(null)
    });

    const handleChange = (ev) => {
        setTask({ ...taskCopy, [ev.target.name]: ev.target.value })
    }

    const onUpdateTask = (task, activity = null) => {
        task ? updateBoard({ ...task }, activity) : updateBoard({ ...taskCopy })
    }

    const updateBoard = useCallback((task, activity) => {
        dispatch(updateTask(task))
        const boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy.taskLists.forEach(taskList => {
            let idx = taskList.tasks.findIndex(currTask => currTask.id === task.id)
            if (idx !== -1) {
                taskList.tasks.splice(idx, 1, task)
            }
        })
        dispatch(saveBoard(boardCopy))
        if (activity) {
            dispatch(addActivity(activity))
        }
    }, [dispatch]);


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

    const handleIsDone = (ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        const { checked } = ev.target
        const updatedTask = { ...taskCopy }
        updatedTask.isDone = checked
        const newActivity = boardService.newActivity(
            `Marked the due date ${updatedTask.isDone ? 'complete' : 'incomplete'}`,
            `Marked the due date ${updatedTask.isDone ? 'complete' : 'incomplete'} on [${updatedTask.title}](${url})`,
            updatedTask.id
        )
        updateBoard(updatedTask, newActivity)
    }

    const handleActiveAction = (ev, action) => {
        const { target } = ev
        exceptionRef.current = target
        if (action === activeAction) {
            setActiveAction(null)
            return
        } else {
            setActiveAction(action)
        }
    }


    const isDue = useMemo(() => {
        if (currTask) {
            let date = new Date()
            date.setHours(0, 0, 0, 0)
            date.setDate(date.getDate() + 1)
            if (currTask.isDone) {
                return { class: 'task-complete', txt: 'Complete' }
            }
            if (date.getTime() === currTask.dueDate) {
                return { class: 'due-soon', txt: 'Due soon' }
            } if (currTask.dueDate <= Date.now()) {
                return { class: 'over-due', txt: 'Over due' }
            } else return ''

        }
    }, [currTask]);


    return (
        <div className='task-details'>
            <div className={'cover'} ></div>
            {currTask &&
                <div className='task-modal' ref={wrapperRef}>
                    {currTask.cover.background &&
                        <Color src={currTask.cover.background} crossOrigin='anonymous' format='hex'>
                            {({ data }) => {
                                return (
                                    <div
                                        className='modal-header '
                                        style={{ backgroundImage: `url(${currTask.cover.background})`, backgroundColor: data ? data : currTask.cover.background }}
                                    >
                                        {currTask.cover.background &&
                                            <button className='modal-btn' onClick={(ev) => handleActiveAction(ev, 'coverPicker')}>
                                                Cover</button>}

                                        {activeAction === 'coverPicker' &&
                                            <CoverPicker // outside TaskActions
                                                task={currTask}
                                                onTaskUpdated={onUpdateTask}
                                                onCloseModal={() => handleActiveAction('coverPicker')}
                                                wrapperRef={modalHeaderRef}
                                                exceptionRef={exceptionRef}
                                            />}
                                    </div>
                                )
                            }}
                        </Color>
                    }
                    <a onClick={closeModal} className='modal-close-btn icon-lg' >
                        <RiCloseLine />
                    </a>
                    <div className='modal-module'>
                        <div className='task-title'>
                            <TextEditor type='h3' name='title' text={currTask.title} onChange={handleChange} onInputBlur={onUpdateTask} />
                        </div>
                    </div>
                    <div className='task-content'>
                        <div className='left-side'>
                            <div className='modal-module'>
                                <div className='task-labels-date'>
                                    {currTask.labels.length > 0 &&
                                        <div className="task-labels">
                                            <h3 className='task-item-title'>Labels</h3>
                                            <div className='task-labels-list' >
                                                <LabelList
                                                    expandMode={true}
                                                    onLabelClicked={(ev) => handleActiveAction(ev, 'labelPicker')}
                                                    labels={currTask.labels} />
                                            </div>
                                            {activeAction === 'labelPicker' &&
                                                <LabelPicker // outside TaskActions
                                                    task={currTask}
                                                    onTaskUpdated={onUpdateTask}
                                                    labelsUpdated={updateBoardLabels}
                                                    onCloseModal={() => handleActiveAction('labelPicker')}
                                                    labels={board.labels}
                                                    exceptionRef={exceptionRef}
                                                />}
                                        </div>}
                                    {currTask.dueDate &&
                                        <div className='task-due-date'>
                                            <h3 className='task-item-title'>Due date</h3>
                                            <div className='modal-btn' onClick={(ev) => handleActiveAction(ev, 'datePicker')}>
                                                <label>
                                                    <input className='css-checkbox' type='checkbox' name='isDone' checked={currTask.isDone} onChange={handleIsDone} />
                                                    <i></i>
                                                </label>
                                                <Moment calendar={calendarStrings} date={currTask.dueDate} />
                                                <span className={'task-badge ' + (isDue ? isDue.class : '')}>{isDue.txt}</span>
                                                <RiArrowDownSLine className="icon-lg" />

                                            </div>

                                            {activeAction === 'datePicker' &&
                                                <DatePicker
                                                    task={currTask}
                                                    onTaskUpdated={onUpdateTask}
                                                    exceptionRef={exceptionRef}
                                                    onCloseModal={() => handleActiveAction('datePicker')}
                                                />}
                                        </div>}
                                </div>
                            </div>
                            <div className='modal-module'>
                                <div className='task-description'>
                                    <h3 className='section-title'>Description</h3>
                                    <TextEditor type='p' name='description' text={currTask.description} onChange={handleChange} onInputBlur={onUpdateTask} isWide={true} placeholder='Add a more detailed description…' />
                                </div>
                            </div>
                            {currTask.checklists.length > 0 && <div className='modal-module'>
                                {currTask.checklists.map(checklist => (
                                    <TaskChecklist
                                        checklist={checklist}
                                        key={checklist.id}
                                        task={currTask}
                                        onUpdateTask={onUpdateTask}
                                    />

                                ))}
                            </div>}
                            <div className='modal-module'>
                                <h3 className='section-title'>Activity</h3>
                                <ActivityLog taskId={currTask.id} />
                            </div>
                        </div>
                        <div className='right-side'>
                            {board && <TaskActions
                                task={currTask}
                                labels={board.labels}
                                onUpdateTask={onUpdateTask}
                                onLabelsUpdated={updateBoardLabels}
                            />}
                        </div>
                    </div>
                </div>
            }
        </div >
        // </section>
    )
}

export default TaskDetails
