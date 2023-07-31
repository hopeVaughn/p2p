import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import faqs from '../../utils/faq'

interface FAQ {
  question: string;
  answer: string;
}

interface FAQProps {
  id: string;
}

const FAQComponent: React.FC<FAQProps> = ({ id }) => {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40 bg-transparent">
      <header className="mx-auto max-w-4xl divide-y divide-gray-900/10">
        <h2 className="text-4xl text-center font-bold leading-10 tracking-tight text-teal-900">Frequently asked questions</h2>
      </header>
      <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
        {faqs.map((faq: FAQ) => (
          <Disclosure as="div" key={faq.question} className="pt-6">
            {({ open }) => (
              <>
                <Disclosure.Button as="dt" className="flex w-full items-start justify-between text-left text-teal-900">
                  <span className="text-base leading-7">{faq.question}</span>
                  <span className="ml-6 flex h-7 items-center">
                    {open ? (
                      <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as="dd" className="mt-2 pr-12">
                  <p className="text-base leading-7 text-teal-800">{faq.answer}</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </dl>
    </section>
  )
}

export default FAQComponent;
