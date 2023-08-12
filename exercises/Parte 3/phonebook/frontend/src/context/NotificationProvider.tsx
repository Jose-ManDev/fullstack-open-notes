import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import NotificationContainer from "../features/NotificationContainer";

type NotificationFunction = (info: Omit<NotificationInfo, "id">) => void;

const NotificationContext = createContext<NotificationFunction>(
  () => undefined
);

export function useNotificationContext() {
  return useContext(NotificationContext);
}

type NotificationProviderProps = {
  children: ReactNode;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);

  const createNotification = (info: Omit<NotificationInfo, "id">) => {
    setNotifications((prevNotifications) =>
      prevNotifications.concat({ id: uuidv4(), ...info })
    );
  };

  useEffect(() => {
    const lastNotification = notifications[notifications.length - 1];

    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification !== lastNotification
        )
      );
    }, 2500);
  }, [notifications]);

  return (
    <NotificationContext.Provider value={createNotification}>
      <NotificationContainer notifications={notifications} />
      {children}
    </NotificationContext.Provider>
  );
}
