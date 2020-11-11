import React, { useState, useRef } from 'react'
import { RiLock2Line, RiEarthLine, RiCheckLine, RiArrowDropDownLine, RiArrowDownSLine } from "react-icons/ri";

const BoardPrivacy = ({ onPrivacyChange, privacy }) => {
    const [isOpen, toggleDropdown] = useState(false)
    const [bounds, setBounds] = useState(null)


    const handleToggle = (ev) => {
        toggleDropdown((prevState) => (!prevState))
        const { top, left, height, width } = ev.target.getBoundingClientRect();
        setBounds({ top: top + height, left: left })
    }
    const onPrivacySelected = (ev) => {
        onPrivacyChange(ev)
        toggleDropdown(false)
    }

    return (
        <div className='board-privacy'>
                <button className="clear-btn item-select" name='private' onClick={handleToggle}>
                    <span className="icon-sm"><RiLock2Line /></span>Private<span className="icon-sm"><RiArrowDownSLine/></span>
                </button>
            {isOpen &&
                <div className="pop-up" style={bounds}>
                    <div className="pop-up-header">
                        <span className="pop-up-title">Privacy visibility</span>
                    </div>
                    <div className='pop-up-list'>
                        <button className="clear-btn item-select" name='private' onClick={onPrivacySelected}>
                            <span className="icon-sm"><RiLock2Line /></span>Private<span className="icon-sm"><RiCheckLine /></span>
                            <span className="privacy-desc">Only board members can see and edit this board.</span>
                        </button>
                        <button className="clear-btn item-select" name='public' onClick={onPrivacySelected}>
                            <span className="icon-sm"><RiEarthLine /></span><span>Public</span><span className="icon-sm"><RiCheckLine /></span>
                            <span className="privacy-desc">Public boards are visible to anyone on the internet, and show up in search engines like Google.</span>
                        </button>
                    </div>
                </div>}

        </div>
    )
}

export default BoardPrivacy
