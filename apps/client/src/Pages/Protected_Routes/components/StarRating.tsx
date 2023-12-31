import { StarIcon as FilledStarIcon, StarIcon as EmptyStarIcon } from "@heroicons/react/24/outline";

type StarRatingProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
};

// Interactive star rating component
const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {

  const handleRating = (rate: number) => {
    onRatingChange(rate); // Pass the rating up to the parent component
  };

  console.log('Rendering StarRating with rating:', rating); // This will log every time the component re-renders

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => handleRating(star)}
          className={`hover:text-cyan-500 ${star <= rating ? 'text-cyan-700' : 'text-gray-300'}`} // Use conditional rendering for the class
          aria-label={`Rate ${star} stars`}
        >
          {star <= rating ? (
            <FilledStarIcon className="h-5 w-5 text-cyan-700" />
          ) : (
            <EmptyStarIcon className="h-5 w-5 text-cyan-700" />
          )}
        </button>
      ))}
    </div>
  );
};

export default StarRating;