import { CSSProperties } from "react";
import { useNotificationQueue } from "../context/notificationContext";
import IconInfoCircle from "../components/IconInfo";
import IconCheckCircle from "../components/IconCheck";
import IconWarning from "../components/IconWarning";
import IconErrorCircle from "../components/IconError";
import List from "../components/List";

const listStyles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "end",
    flexDirection: "column",
    position: "fixed",
    top: "1em",
    right: "1em",
  },
};

function NotificationList() {
  const notificationQueue = useNotificationQueue();

  return (
    <List
      listType="ul"
      style={listStyles.container}
      list={notificationQueue}
      mapList={(notification) => (
        <Notification key={notification.id} notification={notification} />
      )}
    />
  );
}

type NotificationProps = {
  notification: NotificationObject;
};

const notificationStyles: Record<string, CSSProperties> = {
  container: {
    zIndex: 9999,
    padding: "4px",
    width: "320px",
    listStyleType: "none",
  },
  theme: {
    backgroundColor: "#fff",
    color: "#757575",
    position: "relative",
    minHeight: "64px",
    marginBottom: "1rem",
    padding: "8px",
    borderRadius: "4px",
    boxShadow: "0 1px 10px 0 rgba(0,0,0,.1) , 0 2px 15px 0 rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxHeight: "800px",
    overflow: "hidden",
    cursor: "pointer",
  },
  title: {
    fontWeight: "bold",
    display: "block",
  },
  messageContainer: {
    flexGrow: 1,
    paddingLeft: "16px",
  },
  INFO: {
    color: "#3498db",
  },
  SUCCESS: {
    color: "#07bc0c",
  },
  WARNING: {
    color: "#f1c40f",
  },
  ERROR: {
    color: "#e74c3c",
  },
};

const Notification = ({ notification }: NotificationProps) => {
  const icons = {
    INFO: IconInfoCircle,
    SUCCESS: IconCheckCircle,
    WARNING: IconWarning,
    ERROR: IconErrorCircle,
  };

  const Icon = icons[notification.type];

  return (
    <li style={notificationStyles.container} onClick={notification.onRemove}>
      <div style={notificationStyles.theme}>
        <Icon
          color={notificationStyles[notification.type].color}
          width={"40px"}
          height={"40px"}
        />
        <div style={notificationStyles.messageContainer}>
          {notification.title ? (
            <span style={notificationStyles.title}>{notification.title}</span>
          ) : null}
          <span>{notification.message}</span>
        </div>
      </div>
    </li>
  );
};

export default NotificationList;
