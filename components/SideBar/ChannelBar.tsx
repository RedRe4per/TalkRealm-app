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

export default function ChannelBar() {
  return (
    <div className="scrollbar-sidebar mt-20 flex grow flex-col gap-y-5 overflow-y-auto border-r border-primary-100 bg-primary px-6">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item: any) => (
                <li key={item.name}>
                  {!item.children ? (
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-primary-200"
                          : "hover:bg-primary-200",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-secondary"
                      )}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Disclosure as="div">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              item.current ? "bg-gray-50" : "hover:bg-gray-50",
                              "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-secondary"
                            )}
                          >
                            {item.name}
                            <ChevronRightIcon
                              className={classNames(
                                open
                                  ? "rotate-90 text-secondary-300"
                                  : "text-secondary",
                                "ml-auto h-5 w-5 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel as="ul" className="mt-1 px-2">
                            {item.children.map((subItem: any) => (
                              <li key={subItem.name}>
                                {/* 44px */}
                                <Disclosure.Button
                                  as="a"
                                  href={subItem.href}
                                  className={
                                    "block rounded-md py-2 pr-2 pl-9 bg-gray-50 text-sm leading-6 text-secondary-100"
                                  }
                                >
                                  {subItem.name}
                                </Disclosure.Button>
                              </li>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
