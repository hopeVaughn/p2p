import { StarIcon as FilledStarIcon, StarIcon as EmptyStarIcon } from "@heroicons/react/24/outline";

type StarRatingProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
};

// Interactive star rating component
const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {

  const handleRating = (rate: number) => {
    onRatingChange(rate);
    onRatingChange(rate); // Pass the rating up to the parent component
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          className="hover:text-yellow-500"
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