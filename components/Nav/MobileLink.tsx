import { Disclosure } from "@headlessui/react";
import { useState } from "react";

interface Props {
  href: string;
  pageName: string;
}

export default function MobileLink({ href, pageName }: Props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <Disclosure.Button
      as="a"
      href={href}
      className={`${
        isActive
          ? "bg-primary-400 text-secondary"
          : "text-secondary-200 hover:bg-primary hover:text-secondary"
      } block rounded-md px-3 py-2 capitalize text-heading-small-7-standard`}
    >
      {pageName}
    </Disclosure.Button>
  );
}
