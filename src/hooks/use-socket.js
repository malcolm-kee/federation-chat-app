import * as React from 'react';
import { useCallbackProps } from './use-callback-props';

export const useSocket = (endpoint, { onMessage, onOpen, onError }) => {
  const [status, setStatus] = React.useState('initializing');
  const onMsg = useCallbackProps(onMessage);
  const onOpe = useCallbackProps(onOpen);
  const onErr = useCallbackProps(onError);
  const wsRef = React.useRef(null);
  React.useEffect(() => {
    if (endpoint) {
      setStatus('initializing');
      const ws = new WebSocket(endpoint);
      wsRef.current = ws;
      ws.onopen = function onSocketOpen(ev) {
        setStatus('connected');
        onOpe(ev);
      };
      ws.onerror = function onSocketError(ev) {
        setStatus('error');
        onErr(ev);
      };
      ws.onmessage = function onSocketMessage(event) {
        const data = JSON.parse(event.data);
        onMsg(data);
      };
      return () => {
        ws.close();
      };
    }
  }, [endpoint, onMsg, onOpe, onErr]);

  const send = React.useCallback(function sendMessage(data) {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return [status, send];
};
