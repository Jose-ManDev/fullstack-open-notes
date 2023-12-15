type NotificationObject = {
  id: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  title?: string;
  message: string;
  onRemove: () => void;
};
