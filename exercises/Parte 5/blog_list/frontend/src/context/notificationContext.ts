import { createContext, useContext } from "react";

type CreateNotification = {
  info: (message: string) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
};

const NotificationQueueContext = createContext<NotificationObject[]>([]);
const CreateNotificationContext = createContext<CreateNotification | null>(
  null
);

function useNotificationQueue() {
  return useContext(NotificationQueueContext);
}

function useCreateNotification() {
  return useContext(CreateNotificationContext);
}

export {
  NotificationQueueContext,
  useNotificationQueue,
  CreateNotificationContext,
  useCreateNotification,
};
