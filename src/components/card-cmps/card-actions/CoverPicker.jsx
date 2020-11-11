import React, { useRef, useState } from 'react'
import useOnClickOutside from '../../../hooks/useOnClickOutSide';

import cloudinaryService from '../../../services/cloudinary.service';
import { utilService } from '../../../services/util.service';

import styled from 'styled-components'
import ScaleLoader from "react-spinners/ScaleLoader";
import { RiCloseLine } from 'react-icons/ri'




const HalfBgcWrapper = styled.div`
${props => props.cover.type === 'color' ?
        { backgroundColor: props.cover.background } :
        { backgroundImage: "url(" + props.cover.background + ")", backgroundSize: 'cover' }}
`;


const FullBgcWrapper = styled.div`
${props => props.cover.type === 'color' ?
        { backgroundColor: props.cover.background } :
        {
            backgroundImage: props.cover.theme === 'light' ?
                'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(' + props.cover.background + ')'
                : 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(' + props.cover.background + ')', backgroundSize: 'cover', backgroundPosition: '50%'
        }

    }
`;

const CoverPicker = ({ card, onCloseModal, onCardUpdated, bounds, exceptionRef }) => {
    const [selectedCover, setSelectedCover] = useState(card.cover)
    const [loading, setLoading] = useState(false);

    const wrapperRef = useRef(null)

    useOnClickOutside(wrapperRef, () => {
        onCloseModal()
    }, exceptionRef);

    const coverColors = [
        '#61bd4f',
        '#f2d600',
        '#ff9f1a',
        '#c377e0',
        '#eb5a46',
        '#055a8c',
        '#705cc1',
        '#00c2e0',
        '#ff78cb',
    ]
    const handleSelected = (cover) => {
        const cardCopy = { ...card }
        if (cover.id) {
            setSelectedCover({ ...selectedCover, background: cover.url, type: 'img' })
            cardCopy.cover.type = 'img'
            cardCopy.cover.background = cover.url
        } else {
            setSelectedCover({ ...selectedCover, background: cover, type: 'color' })
            cardCopy.cover.type = 'color'
            cardCopy.cover.background = cover
        }
        onCardUpdated(cardCopy)
    }
    const handleLayout = (isFull) => {
        if (!card.cover.background) return;
        setSelectedCover({ ...selectedCover, isFull: isFull })
        const cardCopy = { ...card }
        cardCopy.cover.isFull = isFull
        onCardUpdated(cardCopy)
    }
    const handleThemeChange = (theme) => {
        if (theme === selectedCover.theme) return;
        setSelectedCover({ ...selectedCover, theme: theme })
        const cardCopy = { ...card }
        cardCopy.cover.theme = theme
        onCardUpdated(cardCopy)
    }
    const handleUpload = async (ev) => {
        console.log('yes mame');
        setLoading(true);
        const res = await cloudinaryService.uploadImg(ev);
        const { url } = res;
        setSelectedCover({ ...selectedCover, background: url, type: 'img' })
        const cardCopy = { ...card }
        const img = { id: utilService.makeId(), url: url, isCover: true }
        cardCopy.images.push(img)
        cardCopy.cover.background = url
        cardCopy.cover.type = 'img'
        onCardUpdated(cardCopy)
        setLoading(false);
    }
    const handleRemove = () => {
        setSelectedCover({ ...selectedCover, background: null, type: null, isFull: null, theme: null })
        const cardCopy = { ...card }
        cardCopy.cover = { ...cardCopy.cover, background: null, type: null, isFull: null, theme: null }
        // console.log('card', cardCopy);
        onCardUpdated(cardCopy)
        onCloseModal()
    }
    return (

        <div className={`pop-up cover-picker ${bounds ? '' : 'absolute'}`} ref={wrapperRef} style={bounds}>
            <div className="pop-up-header">
                <span className="pop-up-title">Cover</span>
                <button className="pop-up-close-btn clear-btn icon-lg" onClick={onCloseModal}>
                    <RiCloseLine />
                </button>
            </div>
            <span className="pop-up-title">Size</span>
            <div className="cover-size-picker">
                <FullBgcWrapper
                    cover={selectedCover}
                    className={'cover-size ' + (card.cover.background ? (selectedCover.isFull ? 'selected' : '') : 'disabled')}
                    onClick={() => handleLayout(true)}
                >
                    <div className={`line-wrapper ${card.cover.type === 'img' ? (card.cover.theme === 'dark' ? 'dark' : '') : ''}`}>
                        <div className="line line1"></div>
                        <div className="line line2"></div>
                        <div className="line line3"></div>
                    </div>
                </FullBgcWrapper>
                <div
                    className={'cover-size half ' + (card.cover.background ? (selectedCover.isFull ? '' : 'selected') : 'disabled')}
                    onClick={() => handleLayout(false)}>
                    <HalfBgcWrapper className="half" cover={selectedCover}></HalfBgcWrapper>
                    <div className="line-wrapper">
                        <div className="line line1"></div>
                        <div className="line line2"></div>
                        <div className="line line3"></div>
                    </div>
                </div>
            </div>
            {card.cover.background && <button className="modal-btn" onClick={handleRemove}>Remove Cover</button>}
            {(selectedCover.type === 'img' && selectedCover.isFull) &&
                <div className="cover-txt-color">
                    <span className="pop-up-title">Text color</span>
                    <div className="flex justify-center">
                        <div
                            onClick={() => handleThemeChange('light')}
                            className="cover-txt light"
                            style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(${selectedCover.background})` }}>
                            <h3>{card.title}</h3>
                        </div>
                        <div
                            onClick={() => handleThemeChange('dark')}
                            className="cover-txt dark"
                            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${selectedCover.background})` }}>
                            <h3>{card.title}</h3>
                        </div>
                    </div>
                </div>}

            <span className="pop-up-title">Colors</span>
            <div className="cover-palette">
                {coverColors.map((color, idx) => (
                    <span
                        className={'cover-color ' + (color === selectedCover.background ? 'selected' : '')}
                        style={{ backgroundColor: color }}
                        key={idx}
                        onClick={() => handleSelected(color)}
                    ></span>
                ))}
            </div>
            {card.images.length > 0 && <span className="pop-up-title">Images</span>}
            {card.images.length > 0 &&
                <div className="cover-img-wrapper">
                    {card.images.map(img => (
                        <span
                            // check id in case the same img has been uploaded
                            className={'cover-img-preview ' + ((img.url + img.id) === (selectedCover.background + img.id) ? 'selected' : '')}
                            style={{ backgroundImage: `url(${img.url})` }}
                            onClick={() => handleSelected(img)}
                            key={img.id}></span>
                    ))}
                </div>}
            <div className="upload-img-container flex space-between align-center">
                <p>Upload image:</p>
                <input onChange={handleUpload} id="file" type="file" title="Upload Image" />
                <label className="btn-3" htmlFor="file">
                    {!loading ? <span>Upload</span> : <ScaleLoader height={9} width={5} color={"#2c3e50"} loading={loading} />}
                </label>
            </div>
            <hr className="divider" />
        </div>
    )
}

export default CoverPicker
