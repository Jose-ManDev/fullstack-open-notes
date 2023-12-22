import { HTMLAttributes, ReactNode } from "react";

type ListProps<T> = HTMLAttributes<HTMLDivElement> & {
  listType: "ol" | "ul";
  list: Array<T>;
  mapList: (item: T) => ReactNode;
  children?: ReactNode;
};

function List<T>(props: ListProps<T>) {
  const { listType, list, mapList, children, ...defaultProps } = props;
  console.log(defaultProps);

  switch (listType) {
    case "ol": {
      return (
        <div {...defaultProps}>
          {children ? <h2>{children}</h2> : ""}
          <ol>{list.map(mapList)}</ol>
        </div>
      );
    }
    case "ul": {
      return (
        <div {...defaultProps}>
          {children ? <h2>{children}</h2> : ""}
          <ul>{list.map(mapList)}</ul>
        </div>
      );
    }
  }
}

export default List;
