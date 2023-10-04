
interface ContactInfo {
  title: string;
  email?: string;
  phoneNumber?: string;
  address?: string[];
}

const contacts: ContactInfo[] = [
  {
    title: 'Collaborate',
    email: 'collaborate@example.com',
    phoneNumber: '+1 (555) 905-2345',
  },
  {
    title: 'Press',
    email: 'press@example.com',
    phoneNumber: '+1 (555) 905-3456',
  },
  {
    title: 'Join our team',
    email: 'careers@example.com',
    phoneNumber: '+1 (555) 905-4567',
  },
  {
    title: 'Say hello',
    email: 'hello@example.com',
    phoneNumber: '+1 (555) 905-5678',
  },
];

const locations: ContactInfo[] = [
  {
    title: 'Los Angeles',
    address: ['4556 Brendan Ferry', 'Los Angeles, CA 90210'],
  },
  {
    title: 'New York',
    address: ['886 Walter Street', 'New York, NY 12345'],
  },
  {
    title: 'Toronto',
    address: ['7363 Cynthia Pass', 'Toronto, ON N3Y 4H8'],
  },
  {
    title: 'Chicago',
    address: ['726 Mavis Island', 'Chicago, IL 60601'],
  },
];

export default function ContactSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <article className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
          <header className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get in touch</h2>
              <p className="mt-4 leading-7 text-gray-600">
                Quam nunc nunc eu sed. Sed rhoncus quis ultricies ac pellentesque.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              {contacts.map((contact) => (
                <div key={contact.title} className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">{contact.title}</h3>
                  <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                    {contact.email && (
                      <div>
                        <dt className="sr-only">Email</dt>
                        <dd>
                          <a className="font-semibold text-indigo-600" href={`mailto:${contact.email}`}>
                            {contact.email}
                          </a>
                        </dd>
                      </div>
                    )}
                    {contact.phoneNumber && (
                      <div className="mt-1">
                        <dt className="sr-only">Phone number</dt>
                        <dd>{contact.phoneNumber}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </div>
          </header>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-16 lg:grid-cols-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Locations</h2>
              <p className="mt-4 leading-7 text-gray-600">
                Consequat sunt cillum cillum elit sint. Qui occaecat nisi in ipsum commodo.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              {locations.map((location) => (
                <div key={location.title} className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">{location.title}</h3>
                  <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                    {location.address?.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </address>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}