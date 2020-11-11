import React, { useEffect, useState, useRef, memo } from 'react'
import { useRouteMatch } from 'react-router-dom';
import useOnClickOutside from '../../hooks/useOnClickOutSide';

import { Droppable } from "react-beautiful-dnd";
import { boardService } from '../../services/board.service';


import { RiCloseLine, RiAddLine } from 'react-icons/ri';
import { BsThreeDots } from "react-icons/bs";

import CardPreview from './CardPreview'
import TextEditor from '../TextEditor'
import ListMenu from './ListMenu';


const CardList = ({ provided, innerRef, cardList, cardListIdx, onListUpdated, onRemoveList }) => {

    const [cardListCopy, setCardListCopy] = useState({ ...cardList })
    const [newCard, setNewCard] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    let { url } = useRouteMatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const wrapperRef = useRef(null)

    useEffect(() => {
        setCardListCopy({ ...cardList })
    }, [cardList])

    const getEmptyCard = () => {
        setIsMenuOpen(false)
        const emptyCard = boardService.getEmptyCard()
        setNewCard(emptyCard)
        setIsEditing(true)
    }

    const handleListChange = (ev) => {
        setCardListCopy({ ...cardListCopy, [ev.target.name]: ev.target.value })
    }

    const handleCardChange = (ev) => {
        setNewCard({ ...newCard, [ev.target.name]: ev.target.value })

    }
    const handleListRemove = () => {
        onRemoveList(cardList.id)
    }
    const updateList = (updatedCardList, newActivity) => {
        if (updatedCardList) {
            onListUpdated(updatedCardList, newActivity)
        } else { // when card list title is edited
            if (cardListCopy.title === cardList.title) return;
            onListUpdated(cardListCopy) 
        }
        setIsEditing(false)
        setNewCard(null)
    }

    const addCard = async (clickSource = null) => {
        if (newCard && newCard.title) {
            const updatedCardList = JSON.parse(JSON.stringify(cardListCopy));
            updatedCardList.cards.push(newCard)
            const newActivity = boardService.newActivity(
                `Added this card to ${updatedCardList.title}`,
                `Added  [${newCard.title}](${url}/${newCard.id}) to ${updatedCardList.title}`,
                newCard.id
            )
            await updateList(updatedCardList, newActivity)
            if (clickSource === 'clickedOutside') return; // if click is outside the ref wrapper end editing
            setNewCard(null)
            getEmptyCard()
        }
    }

    useOnClickOutside(wrapperRef, () => {
        if (isEditing && newCard && newCard.title) {
            addCard('clickedOutside') // passing this string to add the current card and end the editing
        } else {
            stopEditing()
        }
    });
    const stopEditing = () => {
        setNewCard(null)
        setIsEditing(false)
    }



    return (
        cardListCopy &&
        <div className="list-wrapper"
            ref={innerRef}
            {...provided.draggableProps}
        >
            <div className="list">
                <div className="list-header" {...provided.dragHandleProps}>
                    {cardListCopy.title &&
                        <TextEditor
                            name="title"
                            type="h3"
                            text={cardListCopy.title}
                            onChange={handleListChange}
                            onInputBlur={updateList}
                        />}
                    <button className="list-menu-btn clear-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <BsThreeDots />
                    </button>
                    {isMenuOpen && !isEditing && <ListMenu onRemoveList={handleListRemove} onAddCard={getEmptyCard} onCloseMenu={() => setIsMenuOpen(false)} />}
                </div>
                <div className="overs">
                    <Droppable type="card" droppableId={`${cardListIdx}`}>
                        {provided => (


                            <div className="list-content custom-scrollbar" ref={provided.innerRef} >
                                {cardList.cards.map((card, index) => (
                                    <CardPreview key={card.id} card={card} index={index} />
                                ))}
                                {(isEditing && newCard) && <div className="add-card-wrapper " ref={wrapperRef}>
                                    <TextEditor
                                        name="title"
                                        type="p"
                                        text={newCard.title}
                                        onChange={handleCardChange}
                                        isFocused={isEditing}
                                        onSubmit={addCard}
                                        onEscape={stopEditing}
                                    />

                                    <div className="add-card-controls">
                                        <button onClick={addCard} className="submit-btn">Add card</button>
                                        <button onClick={stopEditing} className="clear-btn icon-lg">
                                            <RiCloseLine />
                                        </button>
                                    </div>

                                </div>}
                                {/* </div> */}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                </div>

                <div className="list-footer">
                    {(!isEditing && !newCard) &&
                        <a className="clear-btn list-footer-btn" onClick={getEmptyCard}  >
                            <span className="icon-lg add-icon"><RiAddLine /></span> <span>Add new card</span>
                        </a >
                    }
                </div>
            </div>
        </div >

    )
}

export default CardList;
