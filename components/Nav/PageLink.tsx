import Link from "next/link";
import { useState } from "react";

interface Props {
  href: string;
  pageName: string;
}

export default function PageLink({ href, pageName }: Props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <li>
      <Link
        href={href}
        className={`${
          isActive
            ? "bg-primary-400 text-secondary"
            : "text-secondary-200 hover:bg-primary hover:text-secondary"
        } rounded-md px-3 py-2 capitalize text-heading-small-7-standard`}
      >
        {pageName}
      </Link>
    </li>
  );
}
