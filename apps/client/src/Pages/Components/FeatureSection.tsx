import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface Feature {
  name: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
  >;
}
const features: Feature[] = [
  {
    name: 'Share Local Data',
    description:
      'Share you bathroom data with the community so they can see where potties are located in the area and how they rate.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates',
    description:
      'Our shared data is deployed on a secure host ensuring that all your data lives behind a Secure Socket Layer Certificate.',
    icon: LockClosedIcon,
  },
  {
    name: 'Updated and Verified Locations',
    description:
      'Our data set is continually being updated and verified so that our known locations continue to grow along with our community',
    icon: ArrowPathIcon,
  },
  {
    name: 'Advanced security',
    description:
      'We ask for very basic information to sign up and sign in. We store your information behind advanced security encryption and authentication processes',
    icon: FingerPrintIcon,
  },
];

export default function FeatureSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-600">Trust the Place You Pee</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Locate the closest and best reviewed potties
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            At Mother Monster, our mission is to empower individuals with real-time, community-sourced mapping solutions to locate bathrooms, fostering a more comfortable and accessible world.
          </p>
        </header>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <article key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </article>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
