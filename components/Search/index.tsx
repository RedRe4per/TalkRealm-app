import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export default function Search() {
  return (
    <section className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
      <div className="w-full max-w-lg lg:max-w-xs">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full rounded-md border-0 bg-primary py-1.5 pl-10 pr-3 text-secondary placeholder:text-secondary-300 focus:bg-secondary focus:text-primary-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Search room"
            type="search"
          />
        </div>
      </div>
    </section>
  );
}
