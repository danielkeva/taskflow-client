import React, { useState, useEffect, useRef, memo } from "react";
import { useRouteMatch } from "react-router-dom";
import useOnClickOutside from "../../../../hooks/useOnClickOutSide";

import { boardService } from "../../../../services/board.service";

import { BsTrash } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";

import TextEditor from "../../../TextEditor";

const ChecklistItem = ({ card, item, onSubmit, onRemoveItem }) => {
  const [itemCopy, setItem] = useState({ ...item });
  const [isEditing, setIsEditing] = useState(false);
  const [displayMsg, setDisplayMsg] = useState(false);
  const [unSavedTitle, setUnsavedTitle] = useState("");
  const editorRef = useRef(null);
  const initialRender = useRef(true);
  const { url } = useRouteMatch();

  useOnClickOutside(editorRef, () => {
    if (isEditing) {
      if (item.title !== itemCopy.title) {
        setUnsavedTitle(itemCopy.title);
        setItem((prevState) => ({
          ...prevState,
          title: item.title,
        }));
        setDisplayMsg(true);
      }
      setIsEditing(false);
      // setNewItem(null)
    }
  });

  useEffect(() => {
    if (!initialRender.current) {
      const newActivity = boardService.newActivity(
        `${itemCopy.isDone ? `Completed  ${item.title} on this card` : `Marked ${item.title} incomplete on this card`}`,
        `${itemCopy.isDone ? `Completed  ${item.title} on [${card.title}](${url})` : `Marked ${item.title} incomplete on [${card.title}](${url})`}`,
        card.id
      );
      updateItem(newActivity);
    } else {
      initialRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCopy.isDone]);

  const handleChange = (ev) => {
    const target = ev.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setItem({ ...itemCopy, [name]: value });
  };
  const handleClose = () => {
    // when escape is pressed on 'TextEditor.jsx'
    setIsEditing(false);
  };

  const updateItem = (activity) => {
    if (!itemCopy.title) {
      setIsEditing(true);
      return;
    }
    setIsEditing(false);
    setDisplayMsg(false);
    onSubmit({ ...itemCopy }, activity);
  };

  const handleRemove = () => {
    onRemoveItem(itemCopy.id);
  };
  const startEditing = () => {
    setItem((prevState) => ({
      ...prevState,
      title: unSavedTitle,
    }));
    setIsEditing(true);
  };

  const discardUnsaved = () => {
    setDisplayMsg(false);
  };
  // console.log('item', item.title)

  return (
    <div className='checklist-item'>
      <div className={"checklist-item-editor  " + (item.isDone ? "done" : "")}>
        {
          itemCopy && !isEditing && (
            // <label for="checkbox-1">
            <input type='checkbox' name='isDone' checked={itemCopy.isDone} onChange={handleChange} />
          )
          // </label>
        }
        <div className='item-title' onClick={() => setIsEditing(true)} ref={editorRef}>
          <TextEditor text={item.title} onChange={handleChange} onSubmit={updateItem} onEscape={handleClose} isFocused={isEditing} type='p' name='title' />
          {isEditing && (
            <div className='add-item-controls'>
              <button className='submit-btn'>Save</button>
              <button className='clear-btn icon-lg' onClick={handleClose}>
                <RiCloseLine />
              </button>
              <div className='spacer' onClick={handleClose}></div>
            </div>
          )}
        </div>
        {!isEditing && (
          <button className='remove-item-btn clear-btn' onClick={handleRemove}>
            <BsTrash />
          </button>
        )}
      </div>
      {displayMsg && !isEditing && (
        <p className='checklist-user-msg'>
          <span>You have unsaved edits on this field.</span>
          <button className='clear-btn' onClick={startEditing}>
            View edits
          </button>
          <button className='clear-btn' onClick={discardUnsaved}>
            Discard
          </button>
        </p>
      )}
    </div>
  );
};

export default memo(ChecklistItem);
// export default ChecklistItem
