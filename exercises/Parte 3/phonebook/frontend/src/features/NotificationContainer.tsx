import Notification from "../components/Notification";

type NotificationContainerProps = {
  notifications: NotificationInfo[];
  handleDeletion: (id: string) => void;
};

function NotificationContainer({
  notifications,
  handleDeletion,
}: NotificationContainerProps) {
  return (
    <div className="absolute z-50 flex md:flex-col md:w-1/2 md:left-1/2 md:top-0 w-full h-screen py-1 overflow-hidden pointer-events-none">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          handleDeletion={() => handleDeletion(notification.id)}
        >
          {notification.message}
        </Notification>
      ))}
    </div>
  );
}

export default NotificationContainer;
