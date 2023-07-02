import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const navigation = [
  { name: "User1", href: "#", current: true },
  // {
  //   name: 'Teams',
  //   current: false,
  //   children: [
  //     { name: 'Engineering', href: '#' },
  //     { name: 'Human Resources', href: '#' },
  //     { name: 'Customer Success', href: '#' },
  //   ],
  // },
  // {
  //   name: 'Projects',
  //   current: false,
  //   children: [
  //     { name: 'GraphQL API', href: '#' },
  //     { name: 'iOS App', href: '#' },
  //     { name: 'Android App', href: '#' },
  //     { name: 'New Customer Portal', href: '#' },
  //   ],
  // },
  { name: "User2", href: "#", current: false },
  { name: "User3", href: "#", current: false },
  { name: "User4", href: "#", current: false },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ChannelBar({ userList }: any) {
  return (
    <div className="scrollbar-sidebar mt-20 flex grow flex-col gap-y-5 overflow-y-auto border-r border-primary-100 bg-primary px-6">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1 flex flex-col gap-1">
              {userList.map((userObj: any) => (
                <li
                  className="p-2 hover:bg-primary-200 rounded-md text-secondary-100 text-heading-small-7-standard whitespace-nowrap overflow-hidden text-ellipsis"
                  key={userObj.userPeerId}
                >
                  {userObj.userName}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
