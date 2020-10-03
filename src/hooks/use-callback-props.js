import * as React from 'react';

export function useCallbackProps(callback) {
  const ref = React.useRef(callback);
  React.useEffect(() => {
    ref.current = callback;
  });
  return React.useCallback(function () {
    return ref.current && ref.current.apply(ref, arguments);
  });
}
