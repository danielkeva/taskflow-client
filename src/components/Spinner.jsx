import React from 'react'
import HashLoader from "react-spinners/ClipLoader";
const override = `
display: block;
position: fixed;
z-index: 1031; 
top: calc( 50% - ( 150px / 2) ); 
right: calc( 50% - ( 150px / 2) );
`;
const Spinner = () => {
    return (
        <>
            <HashLoader css={override} size={150} color={"#2c3e50"} loading={true} />
        </>
    )
}

export default Spinner
