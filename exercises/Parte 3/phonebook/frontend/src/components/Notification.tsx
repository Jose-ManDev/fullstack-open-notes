import { classNames } from "../utils/classUtils";
import Button from "./Button";
type NotificationProps = {
  type: NotificationType;
  handleDeletion: () => void;
  children: string;
};

export default function Notification({
  type,
  handleDeletion,
  children,
}: NotificationProps) {
  const notificationStyles = {
    default:
      "rounded-sm flex justify-between m-3 p-2 px-3 h-max font-semibold pointer-events-auto",
    success: "bg-green-200 text-green-700",
    info: "bg-yellow-100 text-yellow-300",
    warning: "bg-orange-200 text-orange-400",
    error: "bg-red-200 text-red-500",
  };
  const style = notificationStyles[type];

  return (
    <div className={classNames(notificationStyles.default, style)}>
      <p>{children}</p>
      <div>
        <Button handleClick={handleDeletion}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 hover:scale-110 transition-transform"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
