type HeaderProps = {
  course: string;
};

function Header({ course }: HeaderProps) {
  return <h1>{course}</h1>;
}

export default Header;
