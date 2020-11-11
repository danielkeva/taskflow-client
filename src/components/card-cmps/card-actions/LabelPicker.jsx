import React, { useRef, useState,useEffect } from 'react'
import useOnClickOutside from '../../../hooks/useOnClickOutSide';

import { RiCloseLine } from "react-icons/ri";
import { GoPencil } from "react-icons/go";

import TextEditor from '../../TextEditor';


const LabelPicker = ({ card, labels, onCloseModal, onCardUpdated, labelsUpdated, bounds, exceptionRef }) => {
    const [selectedLabel, setSelectedLabel] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const wrapperRef = useRef(null)

    useOnClickOutside(wrapperRef, () => {
        onCloseModal()
    }, exceptionRef);

    const selectLabelToEdit = (label) => {
        if (selectedLabel !== null && selectedLabel.id === label.id) {
            setIsEditing(false)
        } else {
            setSelectedLabel({ ...label })
            setIsEditing(true)
        }
    }

    const handleChange = (ev) => {
        setSelectedLabel({ ...selectedLabel, [ev.target.name]: ev.target.value })
    }
    const updateLabel = () => {
        const labelsCopy = [...labels];
        const labelIdx = labelsCopy.findIndex(label => label.id === selectedLabel.id)
        labelsCopy.splice(labelIdx, 1, selectedLabel)
        labelsUpdated([...labelsCopy], selectedLabel)
        setIsEditing(false);
        setSelectedLabel(null)
    }

    useEffect(() => {
        if (!isEditing && selectedLabel) {
            const cardCopy = JSON.parse(JSON.stringify(card));
            const cardLabelIdx = cardCopy.labels.findIndex(label => label.id === selectedLabel.id)
            if (cardLabelIdx !== -1) {
                cardCopy.labels.splice(cardLabelIdx, 1, selectedLabel)
                onCardUpdated(cardCopy)
            }
        }

    }, [isEditing])


    const toggleLabels = (selectedLabel) => {
        let labelExist;
        const cardCopy = JSON.parse(JSON.stringify(card));
        labelExist = cardCopy.labels.find(label => label.id === selectedLabel.id)
        if (!labelExist) {
            cardCopy.labels.push(selectedLabel)
        } else {
            const idx = cardCopy.labels.findIndex(label => label.id === selectedLabel.id)
            cardCopy.labels.splice(idx, 1)
        }
        onCardUpdated(cardCopy)
    }

    const labelToEdit = (label) => {
        if (selectedLabel) {
            // console.log(label.id === selectedLabel.id)
            return label.id === selectedLabel.id
        }
    }
    return (

        <div className="pop-up labels" ref={wrapperRef} style={bounds}>
            <div className="pop-up-header">
                <span className="pop-up-title">Labels</span>
                <button className="pop-up-close-btn clear-btn icon-lg" onClick={onCloseModal}>
                    <RiCloseLine />
                </button>
            </div>
            <ul>
                {labels.map(label => (
                    <li className="label-container" key={label.id}>
                        <span
                            className="card-label"
                            style={{ backgroundColor: label.color }}
                            onClick={() => toggleLabels(label)}
                        >
                            {!labelToEdit(label) && <span className="label-title">{label.title}</span>}
                            {labelToEdit(label) && isEditing && <TextEditor
                                type="p"
                                name="title"
                                isFocused={isEditing}
                                text={label.title}
                                onChange={handleChange}
                                onInputBlur={updateLabel}
                            />}
                            <span className="label-selected">
                            </span>
                        </span>
                        <button className="clear-btn" onClick={() => selectLabelToEdit(label)}>
                            <GoPencil />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LabelPicker
