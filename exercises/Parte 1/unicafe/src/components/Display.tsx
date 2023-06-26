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
          <DisplayLine key={item.label} label={item.label} value={item.value} />
        ))}
      </ul>
    </div>
  );
}

type DisplayLineProps = {
  label: string;
  value: ReactNode;
};

function DisplayLine({ label, value }: DisplayLineProps) {
  return (
    <li>
      <span>{label}</span> <span>{value}</span>
    </li>
  );
}
