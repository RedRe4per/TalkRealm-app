const stats = [
  { id: 1, name: "Users connected", value: "500,000+" },
  { id: 2, name: "Countries reached", value: "120+" },
  { id: 3, name: "Uptime guarantee", value: "99.99%" },
  { id: 4, name: "Hours of video calls", value: "10M+" },
];

export default function Statistic() {
  return (
    <div className="relative isolate overflow-hidden bg-primary-300 py-24 sm:py-32">
      <img
        src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/nasa-Q1p7bh3SHj8-unsplash.jpg"
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-primary-300 opacity-30"
        style={{ backdropFilter: "blur(5px)" }}
      ></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
          aria-hidden="true"
        >
          <div
            className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
          <h2 className="text-heading-large-6 text-quaternary">
            Our Achievements
          </h2>
          <p className="mt-2 text-heading-small-4 font-bold tracking-tight text-secondary-100 sm:text-heading-small-3">
            Empowering Global Communication
          </p>
          <p className="mt-6 text-text-4 text-secondary">
            We&apos;ve revolutionized digital communication, bridging the gap
            between people across the globe. Our advanced technology enables
            instant, secure, and high-quality video chats, fostering connections
            and transcending boundaries.
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-secondary sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col gap-y-3 border-l border-white/10 pl-6"
            >
              <dt className="text-text-3-standard text-secondary">{stat.name}</dt>
              <dd className="order-first text-heading-large-5 tracking-tight text-secondary-100">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
