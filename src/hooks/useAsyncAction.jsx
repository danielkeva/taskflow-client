import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

function useAsyncAction(action, dependeces = []) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const asyncAction = useCallback((...args) => {
        async function callback() {
            setLoading(true);
            try {
                const res = await dispatch(action(...args));
                setIsError(false);
                setLoading(false);
                return res;
            } catch (e) {
                setLoading(false);
                setIsError(true);
                return e;
            }
        }
        callback();
    },
        [action, ...dependeces],
    );
    return [asyncAction, loading, isError];
}

export default useAsyncAction;