import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import WebSocketService from './WebSocketService';

const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const userId = useSelector((state) => state?.user?.profile?.id);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && !isInitializing && userId) {
      clientRef.current = WebSocketService;
      clientRef.current.connect(userId, () => {
        setIsConnected(true);
      });
      return () => {
        clientRef.current.disconnect();
        setIsConnected(false);
      };
    }
  }, [userId, isAuthenticated, isInitializing]);

  const subscribeTopic = (topic, callback) => {
    return clientRef.current.subscribeTopic(topic, callback);
  };

  const unsubscribeTopic = (subscription) => {
    clientRef.current.unsubscribeTopic(subscription);
  };

  const publish = (path, body) => {
    clientRef.current.publish(path, body);
  };

  if (!isAuthenticated && isInitializing && !isConnected) {
    return null;
  }

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        subscribeTopic,
        unsubscribeTopic,
        publish,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WebSocketProvider;

export const useWebSocket = () => useContext(WebSocketContext);
