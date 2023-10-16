import { Fragment, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useCreateBathroom } from '../../utils/hooks';
import { getUserId } from '../../utils/helpers';
import { BathroomGender, StallType } from '../../utils/api';

type AddBathroomModalProps = {
  onClose: () => void;
  coordinates: [number, number] | null;
};

export default function AddBathroomModal({ onClose, coordinates }: AddBathroomModalProps) {
  const [isOpen, setIsOpen] = useState(true); // Initially set to true for demonstration
  const genderRef = useRef<HTMLSelectElement>(null);
  const stallTypeRef = useRef<HTMLSelectElement>(null);
  const wheelchairAccessibleRef = useRef<HTMLInputElement>(null);
  const starsRef = useRef<HTMLInputElement>(null);
  const keyRequirementRef = useRef<HTMLInputElement>(null);
  const hoursOfOperationRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const { createBathroom } = useCreateBathroom();

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserId();

    // Check if coordinates are available
    if (!coordinates) {
      console.error("Coordinates not provided!");
      return;
    }

    const payload = {
      createdBy: userId,
      gender: genderRef.current?.value as BathroomGender,
      stallType: stallTypeRef.current?.value as StallType,
      wheelchairAccessible: wheelchairAccessibleRef.current?.checked || false,
      stars: parseFloat(starsRef.current?.value || '5'),
      keyRequirement: keyRequirementRef.current?.checked || false,
      hoursOfOperation: hoursOfOperationRef.current?.value || "",
      lat: coordinates[0], // Updated from the draggable marker.
      lng: coordinates[1], // Updated from the draggable marker.
      address: addressRef.current?.value || ""
    };
    // Call the API to submit the data
    await createBathroom(payload);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={handleClose}
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
              Add Bathroom
            </Dialog.Title>
            <div className="bg-orange-100 p-4 mt-2">
              <form onSubmit={handleSubmit}>
                <label className="block mt-4">
                  Gender:
                  <select ref={genderRef} defaultValue={BathroomGender.GENDERED} className="mt-1 block w-full p-2 border rounded-md">
                    <option value={BathroomGender.GENDERED}>Gendered</option>
                    <option value={BathroomGender.GENDER_NEUTRAL}>Gender Neutral</option>
                    <option value={BathroomGender.BOTH}>BOTH</option>
                  </select>
                </label>

                <label className="block mt-4">
                  Stall Type:
                  <select ref={stallTypeRef} defaultValue={StallType.SINGLE_STALL} className="mt-1 block w-full p-2 border rounded-md">
                    <option value={StallType.SINGLE_STALL}>Single Stall</option>
                    <option value={StallType.CONNECTED}>Connected</option>
                  </select>
                </label>

                <label className="block mt-4">
                  Wheelchair Accessible:
                  <input ref={wheelchairAccessibleRef} type="checkbox" className="ml-2 p-1 border rounded-md" />
                </label>

                <label className="block mt-4">
                  Stars:
                  <input ref={starsRef} type="number" min="1" max="5" defaultValue="5" className="mt-1 block w-full p-2 border rounded-md" />
                </label>

                <label className="block mt-4">
                  Key Requirement:
                  <input ref={keyRequirementRef} type="checkbox" className="ml-2 p-1 border rounded-md" />
                </label>

                <label className="block mt-4">
                  Hours of Operation:
                  <input ref={hoursOfOperationRef} type="text" className="mt-1 block w-full p-2 border rounded-md" placeholder="e.g. 8:00 AM - 9:00 PM" />
                </label>

                <label className="block mt-4">
                  Address:
                  <input ref={addressRef} type="text" className="mt-1 block w-full p-2 border rounded-md" />
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
