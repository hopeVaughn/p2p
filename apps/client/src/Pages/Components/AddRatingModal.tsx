import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useCreateRating } from '../../utils/hooks';
import { getUserId } from '../../utils/helpers';
import { useMapContext } from '../../utils/context/MapContextProvider';
import { TOGGLE_ADD_RATING_MODAL } from '../../utils/actions';

type AddRatingModalProps = {
  bathroomId: string;
};

export default function AddRatingModal({ bathroomId }: AddRatingModalProps) {
  const starsRef = useRef<HTMLInputElement>(null);
  const { dispatch, state } = useMapContext();
  const { createRating } = useCreateRating();

  const handleCloseAndReset = () => {
    if (starsRef.current) starsRef.current.value = '';
    dispatch({ type: TOGGLE_ADD_RATING_MODAL });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserId();
    // Declare the bathroomId

    const payload = {
      bathroomId: bathroomId,
      ratedById: userId,
      stars: parseFloat(starsRef.current?.value || '5'),
    };

    await createRating(payload);
    dispatch({ type: TOGGLE_ADD_RATING_MODAL });
  };

  return (
    <Transition appear show={state.isAddRatingModalOpen} as={Fragment}>
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
              Leave a Rating
            </Dialog.Title>
            <button
              onClick={handleCloseAndReset}
              className="absolute top-0 right-0 p-4 text-3xl font-bold text-cyan-800 hover:text-gray-700"
            >
              &times;
            </button>
            <div className="bg-orange-100 p-4 mt-2">
              <form onSubmit={handleSubmit}>

                <label className="block mt-4">
                  Stars (1-5):
                  <input ref={starsRef} type="number" min="1" max="5" defaultValue="1" required className="mt-1 block w-full p-2 border rounded-md" />
                </label>

                <div className="bg-orange-100 p-4 mt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-700 border border-transparent rounded-md hover:bg-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                  >
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