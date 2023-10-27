import { useNotificationValue } from "../contexts/NotificationContext";

import "./Notification.css";

const Notification = () => {
  const message = useNotificationValue();

  if (message === null) {
    return null;
  }

  return (
    <div className={`notification ${message.type}`}>{message.message}</div>
  );
};

export default Notification;
