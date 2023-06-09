import { Disclosure } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import MobileLink from "./MobileLink";

export default function MobileNavMenu() {
  return (
    <Disclosure.Panel className="lg:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2">
        <MobileLink href="#" pageName="home" />
        <MobileLink href="#" pageName="gallery" />
        <MobileLink href="#" pageName="create room" />
        <MobileLink href="#" pageName="vote" />
      </div>
      <div className="border-t border-gray-700 pb-3 pt-4">
        <div className="flex items-center px-5">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-white">Tom Cook</div>
            <div className="text-sm font-medium text-gray-400">
              tom@example.com
            </div>
          </div>
          <button
            type="button"
            className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 space-y-1 px-2">
          <MobileLink href="#" pageName="your profile" />
          <MobileLink href="#" pageName="settings" />
          <MobileLink href="#" pageName="sign out" />
        </div>
      </div>
    </Disclosure.Panel>
  );
}
