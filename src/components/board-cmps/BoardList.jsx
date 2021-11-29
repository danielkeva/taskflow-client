import React from "react";
import { NavLink } from "react-router-dom";
const BoardList = ({ boards, onToggleEdit }) => {
  return (
    <div className='boards-wrap'>
      {boards.map((board) => (
        <div key={board._id} className='board-item'>
          <NavLink
            to={`/board/${board._id}`}
            style={board.style.type === "color" ? { backgroundColor: `${board.style.background}` } : { backgroundImage: `url(${board.style.background})` }}
          >
            <div>{board.title}</div>
          </NavLink>
        </div>
      ))}
      <div onClick={onToggleEdit}>Add new board</div>
    </div>
  );
};

export default BoardList;
