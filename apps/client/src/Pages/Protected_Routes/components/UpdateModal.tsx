import { Fragment, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFindBathroomById, useUpdateBathroom } from '../../../utils/hooks';
import { BathroomGender, StallType } from '../../../utils/api';
import { useMapContext } from '../../../utils/context/MapContextProvider';
import { TOGGLE_UPDATE_MODAL } from '../../../utils/actions';

export default function UpdateBathroomModal() {
  const genderRef = useRef<HTMLSelectElement>(null);
  const stallTypeRef = useRef<HTMLSelectElement>(null);
  const wheelchairAccessibleRef = useRef<HTMLInputElement>(null);
  const starsRef = useRef<HTMLInputElement>(null);
  const keyRequirementRef = useRef<HTMLInputElement>(null);
  const openTimeRef = useRef<HTMLInputElement>(null);
  const closeTimeRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const { updateBathroom } = useUpdateBathroom();
  const { dispatch, state } = useMapContext();
  const { bathroom } = useFindBathroomById(state.bathroomId, true);

  useEffect(() => {
    if (bathroom) {
      // Populate the modal with current bathroom details
      if (genderRef.current) genderRef.current.value = bathroom.gender;
      if (stallTypeRef.current) stallTypeRef.current.value = bathroom.stallType;
      if (wheelchairAccessibleRef.current) wheelchairAccessibleRef.current.checked = bathroom.wheelchairAccessible;
      if (keyRequirementRef.current) keyRequirementRef.current.checked = bathroom.keyRequirement;
      const [openTime, closeTime] = bathroom.hoursOfOperation.split(" - ");
      if (starsRef.current) starsRef.current.value = bathroom.stars.toString();
      if (openTimeRef.current) openTimeRef.current.value = openTime.slice(0, -2);
      if (closeTimeRef.current) closeTimeRef.current.value = closeTime.slice(0, -2);
      if (addressRef.current) addressRef.current.value = bathroom.address;
    }
  }, [bathroom]);

  const handleCloseAndReset = () => {
    // Reset all refs
    if (genderRef.current) genderRef.current.value = '';
    if (stallTypeRef.current) stallTypeRef.current.value = '';
    if (wheelchairAccessibleRef.current) wheelchairAccessibleRef.current.checked = false;
    if (starsRef.current) starsRef.current.value = '';
    if (keyRequirementRef.current) keyRequirementRef.current.checked = false;
    if (openTimeRef.current) openTimeRef.current.value = '';
    if (closeTimeRef.current) closeTimeRef.current.value = '';
    if (addressRef.current) addressRef.current.value = '';
    // Close the modal
    dispatch({ type: TOGGLE_UPDATE_MODAL });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Capture the values from the time spinner
    const openTime = openTimeRef.current?.value || "";
    const closeTime = closeTimeRef.current?.value || "";
    const hoursOfOperation = `${openTime}AM - ${closeTime}PM`;

    const payload = {
      bathroomId: state.bathroomId,
      data:
      {
        gender: genderRef.current?.value as BathroomGender,
        stallType: stallTypeRef.current?.value as StallType,
        wheelchairAccessible: wheelchairAccessibleRef.current?.checked || false,
        stars: parseFloat(starsRef.current?.value || '0'),
        keyRequirement: keyRequirementRef.current?.checked || false,
        hoursOfOperation: hoursOfOperation,
        address: addressRef.current?.value || ""
      }
    };
    // Call the API to submit the data
    await updateBathroom(payload);
    // Close the modal
    dispatch({ type: TOGGLE_UPDATE_MODAL });
    // Reset the confirm button state
  };

  return (
    <Transition appear show={state.isUpdateModalOpen} as={Fragment}>
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
              Update Bathroom
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
                  Gender:
                  <select ref={genderRef} defaultValue={BathroomGender.GENDERED} required className="mt-1 block w-full p-2 border rounded-md">
                    <option value={BathroomGender.GENDERED}>Gendered</option>
                    <option value={BathroomGender.GENDER_NEUTRAL}>Gender Neutral</option>
                    <option value={BathroomGender.BOTH}>Both</option>
                  </select>
                </label>

                <label className="block mt-4">
                  Stall Type:
                  <select ref={stallTypeRef} defaultValue={StallType.SINGLE_STALL} required className="mt-1 block w-full p-2 border rounded-md">
                    <option value={StallType.SINGLE_STALL}>Single Stall</option>
                    <option value={StallType.CONNECTED}>Connected</option>
                  </select>
                </label>

                <label className="block mt-4">
                  Wheelchair Accessible:
                  <input ref={wheelchairAccessibleRef} type="checkbox" className="ml-2 p-1 border rounded-md" />
                </label>

                <label className="block mt-4">
                  Rating:
                  <input
                    ref={starsRef}
                    type="number"
                    min="1"
                    max="5"
                    required
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </label>

                <label className="block mt-4">
                  Key Requirement:
                  <input ref={keyRequirementRef} type="checkbox" className="ml-2 p-1 border rounded-md" />
                </label>

                <label className="block mt-4">
                  Hours of Operation:
                  <div className="flex space-x-4">
                    <input ref={openTimeRef} type="time" className="w-1/2 p-2 border rounded-md" />
                    <input ref={closeTimeRef} type="time" className="w-1/2 p-2 border rounded-md" />
                  </div>
                </label>

                <label className="block mt-4">
                  Address:
                  <input ref={addressRef} type="text" required className="mt-1 block w-full p-2 border rounded-md" />
                </label>

                <div className="bg-orange-100 p-4 mt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-700 border border-transparent rounded-md hover:bg-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                  >
                    Update
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
