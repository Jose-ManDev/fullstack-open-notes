type NotificationProps = {
  type: NotificationType;
  children: string;
};

export default function Notification({ type, children }: NotificationProps) {
  const notificationStyles = {
    success: "",
    info: "",
    warning: "",
    error: "",
  };
  const style = notificationStyles[type];
  return (
    <div className={style}>
      <p>{children}</p>
    </div>
  );
}
