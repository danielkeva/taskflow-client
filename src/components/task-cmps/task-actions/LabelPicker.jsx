import React, { useState } from 'react'

import { RiCloseLine } from "react-icons/ri";
import { GoPencil } from "react-icons/go";

import TextEditor from '../../TextEditor';
import { useEffect } from 'react';


const LabelPicker = ({ task, labels, onCloseModal, onTaskUpdated, labelsUpdated }) => {
    const [selectedLabel, setSelectedLabel] = useState(null)
    const [isEditing, setIsEditing] = useState(false)


    const selectLabelToEdit = (label) => {
        setSelectedLabel({ ...label })
        setIsEditing(true)
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
    }

    useEffect(() => {
        if (!isEditing && selectedLabel) {
            console.log('yesbabe');
            const taskCopy = JSON.parse(JSON.stringify(task));
            const taskLabelIdx = taskCopy.labels.findIndex(label => label.id === selectedLabel.id)
            if (taskLabelIdx !== -1) {
                console.log('yes');
                taskCopy.labels.splice(taskLabelIdx, 1, selectedLabel)
                onTaskUpdated(taskCopy)
            }
        }

    }, [isEditing])

    // useEffect(() => {
    //     if (!isEditing && selectedLabel) {
    //         const taskCopy = JSON.parse(JSON.stringify(task));
    //         const taskLabelIdx = taskCopy.labels.findIndex(label => label.id === selectedLabel.id)
    //         if (taskLabelIdx !== -1) {
    //             console.log('yes');
    //             taskCopy.labels.splice(taskLabelIdx, 1, selectedLabel)
    //             onTaskUpdated(taskCopy)
    //         }
    //     }

    // }, [isEditing])


    const toggleLabels = (selectedLabel) => {
        let labelExist;
        const taskCopy = JSON.parse(JSON.stringify(task));
        labelExist = taskCopy.labels.find(label => label.id === selectedLabel.id)
        if (!labelExist) {
            taskCopy.labels.push(selectedLabel)
        } else {
            const idx = taskCopy.labels.findIndex(label => label.id === selectedLabel.id)
            taskCopy.labels.splice(idx, 1)
        }
        onTaskUpdated(taskCopy)
    }

    const labelToEdit = (label) => {
        if (selectedLabel) {
            // console.log(label.id === selectedLabel.id)
            return label.id === selectedLabel.id
        }
    }

    return (
        <div className="pop-up labels">
            <div className="pop-up-header">
                <span className="pop-up-title">Labels</span>
                <button className="pop-up-close-btn clear-btn" onClick={onCloseModal}>
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
                            {<span className="label-title">{label.title}</span>}
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
                        <a href="#" onClick={() => selectLabelToEdit(label)}>
                            <GoPencil />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LabelPicker