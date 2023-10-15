import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';


type AddBathroomModalProps = {
  onClose: () => void;
};

export default function AddBathroomModal({ onClose }: AddBathroomModalProps) {
  const [isOpen, setIsOpen] = useState(true); // Initially set to true for demonstration

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Add Bathroom
            </Dialog.Title>
            <div className="mt-2">
              <form>
                {/* Add form fields corresponding to bathroom details here */}
                {/* Example: */}
                <label className="block mt-4">
                  Gender:
                  <select className="mt-1 block w-full">
                    <option>Gendered</option>
                    <option>Unisex</option>
                    {/* Add other options as needed */}
                  </select>
                </label>
                {/* ... other form fields ... */}
                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-700 border border-transparent rounded-md hover:bg-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
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
