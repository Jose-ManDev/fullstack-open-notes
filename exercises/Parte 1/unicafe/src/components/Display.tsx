import { ReactNode } from "react";

type DisplayProps = {
  title: string;
  data: Array<{ label: string; value: ReactNode }>;
};

export default function Display({ title, data }: DisplayProps) {
  return (
    <div>
      <h2>{title}</h2>
      <table>
        <tbody>
          {data.map((item) => (
            <DisplayLine
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type DisplayLineProps = {
  label: string;
  value: ReactNode;
};

function DisplayLine({ label, value }: DisplayLineProps) {
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  );
}
