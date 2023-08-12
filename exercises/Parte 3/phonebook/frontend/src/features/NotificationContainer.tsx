import Notification from "../components/Notification";

type NotificationContainerProps = {
  notifications: NotificationInfo[];
};

function NotificationContainer({ notifications }: NotificationContainerProps) {
  return (
    <div className="">
      {notifications.map((notification) => (
        <Notification key={notification.id} type={notification.type}>
          {notification.message}
        </Notification>
      ))}
    </div>
  );
}

export default NotificationContainer;
