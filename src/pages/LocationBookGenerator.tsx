// importing dependencies
import { useParams } from "react-router-dom";

const LocationBookGenerator = () => {
  // Get the location book ID
  const { location_book_id } = useParams();

  return <div>Create Location Book {location_book_id}</div>;
};

export default LocationBookGenerator;
