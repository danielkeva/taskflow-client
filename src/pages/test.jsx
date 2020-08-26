import React from 'react'

const test = () => {
    return (
        <section className="board-details">
            <h1>board details</h1>
            {board ? (
                <div className="list-container">
                    {/* <div> */}
                    {board.taskLists.map(taskList => (
                        <div key={taskList.id}>
                            <TaskList key={taskList.id} taskList={taskList} onRemoveList={removeList} onListUpdated={updateList} />
                        </div>
                    ))}
                    {/* </div> */}
                    <AddTaskList onBoardUpdated={saveBoard} board={board} />
                </div>)
                : (<p>asd</p>)}
            <Route path={`${path}/:taskId`} component={TaskDetails} />
        </section >
    )
}

export default test
