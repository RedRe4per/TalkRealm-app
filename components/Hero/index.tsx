import Link from "next/link";

export default function Hero() {
  return (
    <div className="bg-primary-300">
      <div className="mx-auto max-w-7xl"> 
        <div className="relative isolate overflow-hidden rounded-lg bg-primary-300 px-6 pt-16 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-heading-large-4 tracking-tight text-secondary-100 sm:text-heading-large-5">
            Enhance Your Communication.
              <br />
              Connect with Our App Today.
            </h2>
            <p className="mt-6 text-text-3-standard leading-8 text-secondary">
            Revolutionize your virtual meetings with high-quality video calls. Start your journey with us today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="#"
                className="rounded-md bg-quaternary px-3.5 py-2.5 text-text-2 font-semibold text-secondary-100 shadow-sm hover:bg-quaternary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Create new room
              </a>
              <a href="#" className="text-heading-small-8 leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
              alt="App screenshot"
              width={1824}
              height={1080}
            />
          </div>
        </div>
       </div>
    </div>
  )
}
