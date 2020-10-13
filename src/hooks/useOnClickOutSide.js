// hook from https://usehooks.com/useOnClickOutside/
import { useEffect } from "react";

// Hook
function useOnClickOutside(ref, handler, exceptionalRef = null) {

  useEffect(
    () => {
      const listener = event => {
        if (!ref) return;
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          // console.log('Refsdasd')
          return;
        }
        // Do nothing if  ANOTHER clicking ref's element or descendent elements 
        if (exceptionalRef !== null) {
          if (!exceptionalRef.current || exceptionalRef.current.contains(event.target)) {
            console.log('exceptionalRef', exceptionalRef)
            return
          }
        }
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, exceptionalRef, handler]
  );
}

export default useOnClickOutside;
