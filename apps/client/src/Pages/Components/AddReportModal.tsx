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
  const reportRef = useRef<HTMLSelectElement>(null);
  const { dispatch, state } = useMapContext();
  const { createReport } = useCreateReport();

  const predefinedMessagesRef = useRef([
    "This bathroom does not exist",
    "This bathroom is out of order",
    "Please review this bathroom's details",
    "Other",
  ]);

  const handleCloseAndReset = () => {
    if (reportRef.current) reportRef.current.value = ''; // Reset to default value
    dispatch({ type: TOGGLE_ADD_REPORT_MODAL });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserId();

    const payload = {
      bathroomId: bathroomId,
      reportedById: userId,
      reason: reportRef.current?.value, // Reading the selected option value directly
    };

    await createReport(payload);
    dispatch({ type: TOGGLE_ADD_REPORT_MODAL });
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
                    <select ref={reportRef} name="message" id="message" className="block w-full rounded-md px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6">
                      {predefinedMessagesRef.current.map((msg, index) => (
                        <option key={index} value={msg}>{msg}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bg-orange-100 p-4 mt-4">
                  <button type="submit" className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-700 border border-transparent rounded-md hover:bg-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}