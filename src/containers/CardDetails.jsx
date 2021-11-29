import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import useOnClickOutside from "../hooks/useOnClickOutSide";

import { loadCard, saveBoard, updateCard } from "../store/actions/boardActions";
import { addActivity } from "../store/actions/activityActions";

import { boardService } from "../services/board.service";
import Color from "color-thief-react";
import { RiArrowDownSLine, RiCloseLine } from "react-icons/ri";

import TextEditor from "../components/TextEditor";
import CardActions from "../components/card-cmps/card-actions/CardActions";
import CardChecklist from "../components/card-cmps/card-actions/checklist-cmps/CardChecklist";
import LabelList from "../components/card-cmps/card-actions/LabelList";
import ActivityLog from "../components/ActivityLog";
import CoverPicker from "../components/card-cmps/card-actions/CoverPicker";
import LabelPicker from "../components/card-cmps/card-actions/LabelPicker";
import DatePicker from "../components/card-cmps/card-actions/DatePicker";

const calendarStrings = {
  lastDay: "[Yesterday]",
  sameDay: "[Today]",
  nextDay: "[Tomorrow]",
  sameElse: "MMMM D",
};

const CardDetails = () => {
  const dispatch = useDispatch();
  const currCard = useSelector((state) => state.board.currCard);
  const board = useSelector((state) => state.board.currBoard);

  const [activeAction, setActiveAction] = useState(null);
  const [cardCopy, setCard] = useState(null);

  const wrapperRef = useRef(null);
  const modalHeaderRef = useRef(null);
  const exceptionRef = useRef(null);

  const { cardId } = useParams();
  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    const load = async () => {
      const res = await dispatch(loadCard(cardId));
      if (!res) {
        history.push(`/board/${board._id}`);
      }
    };
    load();
  }, []);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      // document.body.style.overflowX = 'unset'
      document.body.style.overflowX = "unset";
    };
  }, []);

  useEffect(() => {
    const setCardCopy = () => {
      if (currCard) {
        setCard({ ...currCard });
      }
    };
    setCardCopy();
  }, [currCard]);

  const closeModal = () => {
    history.push(`/board/${board._id}`);
  };

  useOnClickOutside(wrapperRef, () => {
    closeModal();
  });

  useOnClickOutside(modalHeaderRef, () => {
    setActiveAction(null);
  });

  const handleChange = (ev) => {
    setCard({ ...cardCopy, [ev.target.name]: ev.target.value });
  };

  const onUpdateCard = (card, activity = null) => {
    card ? updateBoard({ ...card }, activity) : updateBoard({ ...cardCopy });
  };

  const updateBoard = useCallback(
    (card, activity) => {
      dispatch(updateCard(card));
      const boardCopy = JSON.parse(JSON.stringify(board));
      boardCopy.cardLists.forEach((cardList) => {
        let idx = cardList.cards.findIndex((currCard) => currCard.id === card.id);
        if (idx !== -1) {
          cardList.cards.splice(idx, 1, card);
        }
      });
      dispatch(saveBoard(boardCopy));
      if (activity) {
        dispatch(addActivity(activity));
      }
    },
    [dispatch]
  );

  const updateBoardLabels = (updatedLabels, editedLabel) => {
    const boardCopy = JSON.parse(JSON.stringify(board));
    boardCopy.labels = updatedLabels;
    boardCopy.cardLists.forEach((cardList) => {
      cardList.cards.forEach((card) => {
        let currLabel = card.labels.find((label) => label.id === editedLabel.id);
        if (currLabel) {
          currLabel.title = editedLabel.title;
        }
      });
    });
    dispatch(saveBoard(boardCopy));
  };

  const handleIsDone = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    const { checked } = ev.target;
    const updatedCard = { ...cardCopy };
    updatedCard.isDone = checked;
    const newActivity = boardService.newActivity(
      `Marked the due date ${updatedCard.isDone ? "complete" : "incomplete"}`,
      `Marked the due date ${updatedCard.isDone ? "complete" : "incomplete"} on [${updatedCard.title}](${url})`,
      updatedCard.id
    );
    updateBoard(updatedCard, newActivity);
  };

  const handleActiveAction = (ev, action) => {
    const { target } = ev;
    exceptionRef.current = target;
    if (action === activeAction) {
      setActiveAction(null);
      return;
    } else {
      setActiveAction(action);
    }
  };

  const isDue = useMemo(() => {
    if (currCard) {
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 1);
      if (currCard.isDone) {
        return { class: "card-complete", txt: "Complete" };
      }
      if (date.getTime() === currCard.dueDate) {
        return { class: "due-soon", txt: "Due soon" };
      }
      if (currCard.dueDate <= Date.now()) {
        return { class: "over-due", txt: "Over due" };
      } else return "";
    }
  }, [currCard]);

  return (
    <div className='card-details'>
      <div className='cover'></div>
      {currCard && (
        <div className='card-modal' ref={wrapperRef}>
          {currCard.cover.background && (
            <Color src={currCard.cover.background} crossOrigin='anonymous' format='hex'>
              {({ data }) => {
                return (
                  <div
                    className='modal-header '
                    style={{ backgroundImage: `url(${currCard.cover.background})`, backgroundColor: data ? data : currCard.cover.background }}
                  >
                    {currCard.cover.background && (
                      <button className='modal-btn' onClick={(ev) => handleActiveAction(ev, "coverPicker")}>
                        Cover
                      </button>
                    )}

                    {activeAction === "coverPicker" && (
                      <CoverPicker // outside CardActions
                        card={currCard}
                        onCardUpdated={onUpdateCard}
                        onCloseModal={() => handleActiveAction("coverPicker")}
                        wrapperRef={modalHeaderRef}
                        exceptionRef={exceptionRef}
                      />
                    )}
                  </div>
                );
              }}
            </Color>
          )}
          <a onClick={closeModal} className='modal-close-btn icon-lg'>
            <RiCloseLine />
          </a>
          <div className='modal-module'>
            <div className='card-title'>
              <TextEditor type='h3' name='title' text={currCard.title} onChange={handleChange} onInputBlur={onUpdateCard} />
            </div>
          </div>
          <div className='card-content'>
            <div className='left-side'>
              <div className='modal-module'>
                <div className='card-labels-date'>
                  {currCard.labels.length > 0 && (
                    <div className='card-labels'>
                      <h3 className='card-item-title'>Labels</h3>
                      <div className='card-labels-list'>
                        <LabelList expandMode={true} onLabelClicked={(ev) => handleActiveAction(ev, "labelPicker")} labels={currCard.labels} />
                      </div>
                      {activeAction === "labelPicker" && (
                        <LabelPicker // outside CardActions
                          card={currCard}
                          onCardUpdated={onUpdateCard}
                          labelsUpdated={updateBoardLabels}
                          onCloseModal={() => handleActiveAction("labelPicker")}
                          labels={board.labels}
                          exceptionRef={exceptionRef}
                        />
                      )}
                    </div>
                  )}
                  {currCard.dueDate && (
                    <div className='card-due-date'>
                      <h3 className='card-item-title'>Due date</h3>
                      <div className='modal-btn' onClick={(ev) => handleActiveAction(ev, "datePicker")}>
                        <label>
                          <input className='css-checkbox' type='checkbox' name='isDone' checked={currCard.isDone} onChange={handleIsDone} />
                          <i></i>
                        </label>
                        {/* <Moment calendar={calendarStrings} date={currCard.dueDate} /> */}
                        <span className={"card-badge " + (isDue ? isDue.class : "")}>{isDue.txt}</span>
                        <RiArrowDownSLine className='icon-lg' />
                      </div>

                      {activeAction === "datePicker" && (
                        <DatePicker
                          card={currCard}
                          onCardUpdated={onUpdateCard}
                          exceptionRef={exceptionRef}
                          onCloseModal={() => handleActiveAction("datePicker")}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className='modal-module'>
                <div className='card-description'>
                  <h3 className='section-title'>Description</h3>
                  <TextEditor
                    type='p'
                    name='description'
                    text={currCard.description}
                    onChange={handleChange}
                    onInputBlur={onUpdateCard}
                    isWide={true}
                    placeholder='Add a more detailed description…'
                  />
                </div>
              </div>
              {currCard.checklists.length > 0 && (
                <div className='modal-module'>
                  {currCard.checklists.map((checklist) => (
                    <CardChecklist checklist={checklist} key={checklist.id} card={currCard} onUpdateCard={onUpdateCard} />
                  ))}
                </div>
              )}
              <div className='modal-module'>
                <h3 className='section-title'>Activity</h3>
                <ActivityLog cardId={currCard.id} />
              </div>
            </div>
            <div className='right-side'>
              {board && <CardActions card={currCard} labels={board.labels} onUpdateCard={onUpdateCard} onLabelsUpdated={updateBoardLabels} />}
            </div>
          </div>
        </div>
      )}
    </div>
    // </section>
  );
};

export default CardDetails;
