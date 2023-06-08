import Carousel from "./Carousel";
import {
  GlobeAsiaAustraliaIcon,
  LockClosedIcon,
  CloudIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "Instant Connectivity.",
    description:
      "Connect with individuals or groups instantly, reducing waiting times and increasing productivity.",
    icon: GlobeAsiaAustraliaIcon,
  },
  {
    name: "Cross-Platform Syncing.",
    description:
      "Seamless integration across devices and platforms enables uninterrupted communication, enhancing collaboration wherever you are.",
    icon: CloudIcon,
  },
  {
    name: "Secure Conversations.",
    description:
      "Our robust security measures ensure your conversations and data stay private and protected.",
    icon: LockClosedIcon,
  },
];

export default function Feature() {
  return (
    <div className="overflow-hidden bg-primary-300 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="flex flex-col gap-x-8 gap-y-16 sm:gap-y-20 lg:flex-row">
          <section className="px-6 md:px-0 lg:pr-4 lg:pt-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-heading-large-7-standard text-ternary-300">
                Distance Dissolved
              </h2>
              <p className="mt-2 text-heading-large-2 text-secondary-100 sm:text-heading-large-3">
                Unified Interaction
              </p>
              <p className="mt-6 text-text-4 text-secondary-200">
                Seamlessly bridge gaps in communication, empowering real-time,
                intuitive connections, regardless of distance or device,
                fostering stronger relationships.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-secondary-200 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-secondary-100">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-ternary"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
          <section className="flex justify-center items-center lg:w-[50%]">
            <Carousel />
          </section>
        </div>
      </div>
    </div>
  );
}
