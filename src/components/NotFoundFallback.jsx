import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { hideError } from '../store/actions/errorActions';

const NotFoundFallback = ({ status }) => {
  const dispatch = useDispatch()

  return (
    <div role="alert">
      <p style={{ paddingTop: '50px', fontSize: '100px' }}>Something went wrong:</p>
      {/* <pre>{error.message}</pre> */}
    </div>
  )
}

export default NotFoundFallback
