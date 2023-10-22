import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useCreateReport } from '../../utils/hooks';
import { getUserId } from '../../utils/helpers';
import { useMapContext } from '../../utils/context/MapContextProvider';
import { TOGGLE_ADD_REPORT_MODAL } from '../../utils/actions';
type AddRatingModalProps = {
  bathroomId: string;
};

export default function AddReportModal({ bathroomId }: AddRatingModalProps) {
  const reportRef = useRef<HTMLTextAreaElement>(null);
  const { dispatch, state } = useMapContext();
  const { createReport } = useCreateReport();

  const predefinedMessagesRef = useRef([
    "It's dirty",
    "Out of order",
    "No toilet paper",
    "Other issues",
  ]);

  const handleCloseAndReset = () => {
    if (reportRef.current) reportRef.current.value = predefinedMessagesRef.current.join(', '); // Setting textarea to show predefined messages
    dispatch({ type: TOGGLE_ADD_REPORT_MODAL });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserId();

    const payload = {
      bathroomId: bathroomId,
      reportedById: userId,
      message: reportRef.current?.value, // Reading the textarea value directly
    };

    await createReport(payload);
  };

  return (
    <Transition appear show={state.isAddReportModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={handleCloseAndReset}
      >
        <div className="p-4 min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="p-4 inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 text-center"
            >
              Report a Bathroom
            </Dialog.Title>
            <button
              onClick={handleCloseAndReset}
              className="absolute top-0 right-0 p-4 text-3xl font-bold text-cyan-800 hover:text-gray-700"
            >
              &times;
            </button>
            <div className="bg-orange-100 p-4 mt-2">
              <form onSubmit={handleSubmit}>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-cyan-900">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      ref={reportRef}
                      name="message"
                      id="message"
                      rows={4}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                      defaultValue={predefinedMessagesRef.current.join(', ')} // Default to showing predefined messages
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}