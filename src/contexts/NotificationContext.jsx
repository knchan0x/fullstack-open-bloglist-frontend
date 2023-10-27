import { createContext, useContext, useReducer } from "react";

export const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
  case "SET_MESSAGE":
    return action.payload;
  case "CLEAN_MESSAGE":
    return null;
  default:
    return state;
  }
};

export const useNotificationValue = () => {
  const [notification, dispatch] = useContext(NotificationContext);
  return notification;
};

export const useNotificationDispatch = () => {
  const [notification, dispatch] = useContext(NotificationContext);
  return dispatch;
};

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {
        // eslint-disable-next-line react/prop-types
        props.children
      }
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
