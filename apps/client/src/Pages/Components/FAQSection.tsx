import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: ' Is Place to Pee free to use?',
    answer:
      'Yes! Place to Pee is a free service. We believe in providing accessible information for everyone, everywhere',
  },
  {
    question: 'Who is behind Place to Pee',
    answer:
      'We are a grassroots initiative driven by a community of users just like you. We are not affiliated with any organization. Our aim is to make finding a bathroom a hassle-free experience for everyone.',
  },
  {
    question: 'How accurate are the locations on Place to Pee',
    answer:
      "The locations on Place to Pee are community-sourced, so while we strive for accuracy, we can't guarantee perfection. Our map points are generally in close proximity to the locations provided by our users.",
  },
  {
    question: 'Who verifies the accuracy of the locations?',
    answer:
      ' Both community members and appointed community admins regularly audit the locations provided. Our goal is to ensure the validity and usefulness of each point on our map.',
  },
  {
    question: 'How can I contribute to Place to Pee',
    answer:
      'As a community-driven platform, we welcome and value your contributions! You can help us by adding new bathroom locations, verifying existing ones, or sharing our app with others to grow our community.',
  },

];

export default function FAQSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-5">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Can’t find the answer you’re looking for? Reach out to our{' '}
              <a href="#" className="font-semibold text-cyan-600 hover:text-cyan-500">
                customer support
              </a>{' '}
              team.
            </p>
          </aside>
          <article className="mt-10 lg:col-span-7 lg:mt-0">
            <dl className="space-y-10">
              {faqs.map((faq) => (
                <React.Fragment key={faq.question}>
                  <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
                </React.Fragment>
              ))}
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}

