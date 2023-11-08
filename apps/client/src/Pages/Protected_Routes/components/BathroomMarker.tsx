import { Marker, Popup } from "react-leaflet";
import { useMapContext } from "../../../utils/context/MapContextProvider";
import L from 'leaflet';
import { SET_IS_LOADING, SET_BATHROOM_ID, SET_CONFIRM_CREATOR, TOGGLE_ADD_RATING_MODAL, TOGGLE_ADD_REPORT_MODAL, TOGGLE_UPDATE_MODAL, REMOVE_PIN } from '../../../utils/actions';
import { confirmBathroomCreatorAPI } from "../../../utils/api";
import { LoadingSpinner } from "../../Components";
import { VerifyBathroom } from "../../../utils/api";
import { useCreateVerify, useDeleteBathroom } from "../../../utils/hooks";
import { PencilSquareIcon, CheckBadgeIcon, ShieldExclamationIcon, TrashIcon, StarIcon as EmptyStarIcon } from "@heroicons/react/24/outline";
import { StarIcon as FilledStarIcon } from "@heroicons/react/24/solid";

// Helper component to render stars based on rating

const RatingStars = ({ rating }: { rating: number; }) => {
  const filledStars = Math.floor(rating);
  const emptyStars = 5 - filledStars;

  return (
    <div className="flex items-center">
      {Array.from({ length: filledStars }, (_, index) => (
        <FilledStarIcon key={index} className="h-5 w-5 text-cyan-700" />
      ))}
      {Array.from({ length: emptyStars }, (_, index) => (
        <EmptyStarIcon key={index} className="h-5 w-5 text-cyan-700" />
      ))}
    </div>
  );
};

const customRedMarkerSVG = `
data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56">
    <path fill="%23F00" fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/>
</svg>
`;

const redMarker = new L.Icon({
  iconUrl: customRedMarkerSVG,
  iconSize: [35, 45],
});

export type BathroomMarkerProps = {
  id: React.Key | null | undefined;
  longitude: number;
  latitude: number;
  gender: string;
  stallType: string;
  hoursOfOperation: string;
  keyRequirement: boolean;
  stars: number;
  wheelchairAccessible: boolean;
  address: string;
  verification_count: number;
};

export default function BathroomMarker({ bathroom }: { bathroom: BathroomMarkerProps; }) {
  const { dispatch, state } = useMapContext();
  const { createVerify } = useCreateVerify();
  const { deleteBathroom } = useDeleteBathroom();

  const handleRateClick = () => {
    dispatch({ type: TOGGLE_ADD_RATING_MODAL });
  };

  const handleReportClick = () => {
    dispatch({ type: TOGGLE_ADD_REPORT_MODAL });
  };

  const handleVerifyClick = () => {
    const data: VerifyBathroom = {
      bathroomId: state.bathroomId,
    };
    createVerify(data);
  };

  const handleDeleteClick = (bathroomId: string) => {
    try {
      dispatch({ type: SET_IS_LOADING, payload: true });
      deleteBathroom(bathroomId);
    } catch (error) {
      console.error("Error deleting bathroom:", error);
    } finally {
      dispatch({ type: REMOVE_PIN });
      dispatch({ type: SET_IS_LOADING, payload: false });
    }
  };

  const handleUpdateClick = () => {
    dispatch({ type: TOGGLE_UPDATE_MODAL });
  };

  return (
    <Marker
      key={bathroom.id}
      position={[bathroom.longitude, bathroom.latitude]}
      icon={redMarker}
      eventHandlers={{
        click: async () => {
          try {
            dispatch({ type: SET_IS_LOADING, payload: true });
            dispatch({ type: SET_BATHROOM_ID, payload: bathroom.id as string });
            const isBathroomCreator = await confirmBathroomCreatorAPI(bathroom.id as string);
            dispatch({ type: SET_CONFIRM_CREATOR, payload: isBathroomCreator });
          } catch (error) {
            console.error("Error confirming bathroom creator:", error);
          } finally {
            dispatch({ type: SET_IS_LOADING, payload: false });
          }
        },
      }}
    >
      <Popup>
        {state.isLoading ? (
          <div className="bg-white p-3 rounded-md shadow-sm space-y-2">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white p-3 rounded-md shadow-sm space-y-2">

            <div className="text-center font-bold text-lg">Bathroom Details</div>

            <dl className="space-y-2">
              <div className="flex items-center space-x-2">
                <dt className="text-sm font-bold text-gray-600">Gender:</dt>
                <dd className="text-sm text-gray-800">{bathroom.gender}</dd>
              </div>

              <div className="flex items-center space-x-2">
                <dt className="text-sm font-bold text-gray-600">Stall Type:</dt>
                <dd className="text-sm text-gray-800">{bathroom.stallType}</dd>
              </div>

              <div className="flex items-center space-x-2">
                <dt className="text-sm font-bold text-gray-600">Hours:</dt>
                <dd className="text-sm text-gray-800">{bathroom.hoursOfOperation}</dd>
              </div>

              <div className="flex items-center space-x-2">
                <dt className="text-sm font-bold text-gray-600">Key Required:</dt>
                <dd className="text-sm text-gray-800">{bathroom.keyRequirement ? 'Yes' : 'No'}</dd>
              </div>

              <div className="flex items-center space-x-2">
                <dt className="text-sm font-bold text-gray-600">Rating:</dt>
                <dd className="text-sm text-gray-800">
                  <RatingStars rating={bathroom.stars} />
                </dd>
              </div>

              <div className="flex items-center space-x-2">
                <dt className="text-sm font-bold text-gray-600">Wheelchair Accessible:</dt>
                <dd className="text-sm text-gray-800">{bathroom.wheelchairAccessible ? 'Yes' : 'No'}</dd>
              </div>

              <div className="flex flex-wrap items-center space-x-2">
                <dt className="text-sm font-bold text-gray-600">Address Notes:</dt>
                <dd className="text-sm text-gray-800">{bathroom.address}</dd>
              </div>

              <div className="flex justify-between mt-2 space-x-4">
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={handleVerifyClick}
                >verify</button>
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={handleRateClick}
                >rate</button>
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={handleReportClick}
                >report</button>
              </div>
            </dl>
            {state.isBathroomCreator && (
              <div className="flex justify-between">
                <PencilSquareIcon
                  className="h-5 w-5 text-blue-600 cursor-pointer"
                  onClick={() => handleUpdateClick()}
                />
                <TrashIcon
                  className="h-5 w-5 text-red-700 cursor-pointer"
                  onClick={() => handleDeleteClick(bathroom.id as string)}
                />
              </div>
            )}
            <div className="flex justify-center items-center mt-4 w-full">
              {bathroom.verification_count > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">verified</span>
                  <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">awaiting verification</span>
                  <ShieldExclamationIcon className="h-5 w-5 text-red-700" />
                </div>
              )}
            </div>
          </div>
        )}
      </Popup>
    </Marker>
  );
}


