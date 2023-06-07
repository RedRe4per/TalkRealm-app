import { ReactElement } from "react";
import Header from "./Layouts/Header";

interface Props {
  children: ReactElement;
}

export default function Layout({ children }: Props) {
  return (
    <section>
      <Header />
      {children}
    </section>
  );
}
