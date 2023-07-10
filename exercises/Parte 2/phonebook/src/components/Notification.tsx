import { CSSProperties } from "react";

type NotificationProps = {
  type: "success" | "error" | null;
  message: string;
};

const errorStyle: CSSProperties = {
  backgroundColor: "#e7bdbd",
  color: "#ba3939",
  border: "1px solid #ba3939",
};

const successStyle: CSSProperties = {
  backgroundColor: "#c5dbab",
  color: "#2b7515",
  border: "1px solid #2b7515",
};

export default function Notification({ type, message }: NotificationProps) {
  let style;

  if (type === null) return null;
  if (type === "error") style = errorStyle;
  if (type === "success") style = successStyle;

  const divStyles: CSSProperties = {
    padding: 8,
    margin: 8,
    borderRadius: 4,
  };

  const title = type === "error" ? "Error" : "Success";

  return (
    <div style={{ ...divStyles, ...style }}>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
