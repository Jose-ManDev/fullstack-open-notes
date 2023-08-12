type NotificationType = "success" | "info" | "warning" | "error";

type NotificationInfo = {
  id: string;
  type: NotificationType;
  message: string;
};
