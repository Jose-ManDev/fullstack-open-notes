import { ReactNode } from "react";

type FeedbackFormProps = {
  children: ReactNode;
};

export default function FeedbackForm({ children }: FeedbackFormProps) {
  return (
    <form action="" onSubmit={(e) => e.preventDefault()}>
      <h1>Give Feedback</h1>
      {children}
    </form>
  );
}
