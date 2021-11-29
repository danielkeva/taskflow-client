import React, { useMemo } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";

import LabelList from "./card-actions/LabelList";

// import Moment from 'react-moment';
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

import { IoMdCheckboxOutline } from "react-icons/io";
import { GrTextAlignFull } from "react-icons/gr";
import { RiTimeLine } from "react-icons/ri";

const Container = styled.div`
  ${(props) =>
    props.cover.isFull
      ? props.cover.type === "color"
        ? { backgroundColor: props.cover.isFull ? props.cover.background : "" }
        : { backgroundImage: "url(" + props.cover.background + ")", minHeight: 235, backgroundSize: "cover" }
      : ""}
  font-size:${(props) => (props.cover.isFull ? "16px" : "")};
  font-family: ${(props) => (props.cover.isFull ? "LatoBold" : "")};

  ${(props) =>
    props.cover.isFull
      ? {
          display: "flex",
          fontSize: "16px",
          fontFamily: "LatoBold",
        }
      : ""}
`;

const calendarStrings = {
  lastDay: "[Yesterday]",
  sameDay: "[Today]",
  nextDay: "[Tomorrow]",
  sameElse: "MMMM D",
};

const CardPreview = ({ card, index }) => {
  let { url } = useRouteMatch();

  const doneCount = useMemo(
    () =>
      card.checklists.reduce((totalCount, checklist) => {
        if (checklist.listItems.length > 0) {
          let checklistSum = checklist.listItems.reduce((acc, item) => {
            if (item.isDone) acc++;
            return acc;
          }, 0);
          totalCount += checklistSum;
        }
        return totalCount;
      }, 0),
    [card.checklists]
  );
  const checklistItemsAmount = useMemo(
    () =>
      card.checklists.reduce((acc, checklist) => {
        if (checklist.listItems.length > 0) {
          acc += checklist.listItems.length;
        }
        return acc;
      }, 0),
    [card.checklists]
  );

  const isDue = useMemo(() => {
    if (!card.dueDate) return;
    // console.log('is due')
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);
    if (date.getTime() === card.dueDate) {
      return "due-soon";
    } else if (card.dueDate <= Date.now()) {
      return "over-due";
    } else return "";
    // }
  }, [card.dueDate]);

  return (
    <Draggable draggableId={card.id} index={index} type='card'>
      {(provided) => (
        <div className='card-preview' {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <NavLink to={`${url}/${card.id}`} className='card-link' activeClassName='active' draggable='false'>
            <Container cover={card.cover}>
              {card.cover.background && !card.cover.isFull && (
                <div>
                  {card.cover.type === "color" ? (
                    <div className={card.cover.background ? "card-cover" : ""} style={{ backgroundColor: card.cover.background }}></div>
                  ) : (
                    <img src={card.cover.background} className='card-img-cover ratio-square ' />
                  )}
                </div>
              )}
              <div
                className={`card-preview-content 
                                    ${
                                      card.cover.type === "img" && card.cover.isFull
                                        ? card.cover.theme === "dark"
                                          ? "content-wrapper dark"
                                          : "content-wrapper light"
                                        : ""
                                    }`}
              >
                {card.labels && <LabelList labels={card.labels} />}
                <div className='card-preview-title' dir='auto'>
                  {card.title}
                </div>
                <div className='badges'>
                  {card.dueDate && (
                    <div className={"badge " + isDue}>
                      <RiTimeLine className='icon-sm' />
                      {/* <Moment className='badge-text' calendar={calendarStrings} date={card.dueDate} /> */}
                    </div>
                  )}
                  {card.description && (
                    <div className='badge'>
                      <GrTextAlignFull className='icon-md' />
                    </div>
                  )}
                  {card.checklists.length > 0 && checklistItemsAmount > 0 && (
                    <div className={"badge checklist-items-badge " + (doneCount === checklistItemsAmount ? "card-complete" : "")}>
                      <IoMdCheckboxOutline className='icon-sm' />
                      <span className='badge-text'>
                        {doneCount}/{checklistItemsAmount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </NavLink>
        </div>
      )}
    </Draggable>
  );
};
export default CardPreview;
