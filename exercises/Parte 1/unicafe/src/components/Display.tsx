import { ReactNode } from "react";

type DisplayProps = {
  title: string;
  data: Array<{ label: string; value: ReactNode }>;
};

export default function Display({ title, data }: DisplayProps) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {data.map((item) => (
          <li key={item.label}>
            {item.label} {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
