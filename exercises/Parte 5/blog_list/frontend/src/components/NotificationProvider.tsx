import {
  NotificationQueueContext,
  CreateNotificationContext,
} from "../context/notificationContext";
import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

type NotificationProviderProps = {
  children: ReactNode;
};

function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationObject[]>([]);

  const removeNotification = (id: string) => {
    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const createNotification = (
    type: NotificationType,
    message: string,
    title?: string
  ) => {
    const id = uuidv4();
    const onRemove = () => removeNotification(id);
    const notification: NotificationObject = {
      id,
      type,
      title,
      message,
      onRemove,
    };
    setNotifications(notifications.concat(notification));
    setTimeout(onRemove, 2500);
  };

  const notification = {
    info: (message: string, title?: string) => {
      createNotification("INFO", message, title);
    },
    success: (message: string, title?: string) => {
      createNotification("SUCCESS", message, title);
    },
    warning: (message: string, title?: string) => {
      createNotification("WARNING", message, title);
    },
    error: (message: string, title?: string) => {
      createNotification("ERROR", message, title);
    },
  };

  return (
    <NotificationQueueContext.Provider value={notifications}>
      <CreateNotificationContext.Provider value={notification}>
        {children}
      </CreateNotificationContext.Provider>
    </NotificationQueueContext.Provider>
  );
}

export default NotificationProvider;
