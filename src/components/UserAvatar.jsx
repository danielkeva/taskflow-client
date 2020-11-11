import React, { useRef, useState } from 'react'
import Avatar from 'react-avatar';
import { RiCloseLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import useOnClickOutside from '../hooks/useOnClickOutSide';
import { logout } from '../store/actions/userActions';
const UserAvatar = ({ email, username }) => {
    const [isOpen, toggleDropdown] = useState(false)
    const dispatch = useDispatch()
    const modalRef = useRef(null)
    const wrapperRef = useRef(null)

    useOnClickOutside(modalRef, () => {
        closeDropdown()
    }, wrapperRef);
    const handleToggle = () => {
        toggleDropdown((prevState) => (!prevState))
    }
    const closeDropdown = () => {
        toggleDropdown(false)
    }

    const handleLogout = async () => {
        await dispatch(logout())
    }
    return (
        <div className='user-avatar' ref={wrapperRef}>
            <Avatar email={email} name='Daniel Keva' round={true} size='28' textSizeRatio={1.75} onClick={handleToggle} />
            {isOpen && <div className='pop-up' ref={modalRef}>
                <div className='pop-up-header'>
                    <span className='pop-up-title'>Account</span>
                    <button className='pop-up-close-btn clear-btn icon-lg' onClick={handleToggle}>
                        <RiCloseLine />
                    </button>
                </div>
                <div className='user-menu-details'>
                    <div className='user-menu-avatar'>
                        <Avatar email={email} name='Daniel Keva' round={true} size='36' textSizeRatio={1.75} />
                    </div>
                    <div>
                        <p>{username}</p>
                        <p>{email}</p>
                    </div>
                </div>
                <ul className='pop-up-list'>
                    <li className='item-select'>Settings</li>
                    <li className='item-select'>Privacy</li>
                    <li className='item-select'>Random</li>
                    <li className='item-select'>
                        <NavLink onClick={handleLogout} to="/" className="main-navbar-nav-link">Log out</NavLink>
                    </li>
                </ul>

            </div>}
        </div>
    )
}

export default UserAvatar
