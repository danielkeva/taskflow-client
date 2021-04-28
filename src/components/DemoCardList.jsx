import React from 'react'

const DemoCardList = () => {
    return (
        <div className="demo-board">
            <div className="board-title">
                <h3>Tasks</h3>
            </div>
            <div className="lists">
                <div className="list-wrapper">
                    <div className="list">
                        <div className="list-header">
                            <p>To Do</p>
                        </div>
                        <div className="list-content">
                            <div className='card-preview'>
                                <div className='card-preview-content'>
                                    <div className='label' style={{ backgroundColor: "#61bd4f" }}></div>
                                    <div className='card-preview-title'>Staff meeting</div>
                                    <div className='badges'>
                                    </div>
                                </div>
                            </div>
                            <div className='card-preview'>
                                <div className='card-preview-content'>
                                    <div className='label' style={{ backgroundColor: "#c377e0" }}></div>
                                    <div className='card-preview-title'>Website redesign</div>
                                    <div className='badges'>
                                    </div>
                                </div>
                            </div>
                            <div className='card-preview'>
                                <div className='card-preview-content'>
                                    <div className='label' style={{ backgroundColor: "#f2d600" }}></div>
                                    <div className='card-preview-title'>Client meeting</div>
                                    <div className='badges'>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="list-footer">Add new card ..</div>
                    </div >
                </div >

                <div className="list-wrapper">
                    <div className="list">
                        <div className="list-header">
                            <p>Done</p>
                        </div>
                        <div className="list-content">
                            <div className='card-preview'>
                                <div className='card-preview-content'>
                                    <div className='label' style={{ backgroundColor: "#61bd4f" }}></div>
                                    <div className='card-preview-title'>Publish blog</div>
                                    <div className='badges'>
                                    </div>
                                </div>
                            </div>
                            <div className='card-preview'>
                                <div className='card-preview-content'>
                                    <div className='label' style={{ backgroundColor: "#c377e0" }}></div>
                                    <div className='card-preview-title'>Lunch new campaign</div>
                                    <div className='badges'>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="list-footer">Add new card ..</div>
                    </div >
                </div >
            </div>

        </div>)
}

export default DemoCardList;
