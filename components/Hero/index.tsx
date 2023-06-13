import Link from "next/link";
import Carousel from "./Carousel";

export default function Hero() {
  return (
    <div className="bg-primary-300">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-lg bg-primary-300 px-6 pt-16 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-heading-large-4 tracking-tight text-secondary-100 sm:text-heading-large-5">
              Enhance Your Communication.
              <br />
              Connect with Our App Now.
            </h2>
            <p className="mt-6 text-text-3-standard leading-8 text-secondary">
              Revolutionize your virtual meetings with high-quality video calls.
              Start your journey with us today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link
                href="#"
                className="rounded-md bg-quaternary px-3.5 py-2.5 text-text-2 font-semibold text-secondary-100 shadow-sm hover:bg-quaternary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Create new room
              </Link>
              <Link
                href="#"
                className="text-heading-small-8 leading-6 text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <section className="relative mt-16 h-80 hidden lg:mt-8 lg:block">
            <div className="absolute left-0 top-0 max-w-none bg-white/5 ring-1 ring-white/10">
              <Carousel />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
