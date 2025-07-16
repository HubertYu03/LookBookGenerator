// Importing global types
import type { LocationBook } from "@/types/global";

// Import database
import { supabase } from "@/lib/supabaseClient";

// Import dependencies
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// Import UI Components
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationBookPreview from "@/components/locationbook/LocationBookPreview";

const MyLocationBooks = () => {
  const navigate = useNavigate();

  // State for lookbooks
  const [myLocationBooks, setMyLocationBooks] = useState<LocationBook[]>();

  // Get the current user's lookbooks
  async function get_locationbooks() {
    let { data: location_books, error } = await supabase
      .from("locationbook")
      .select("*")
      .eq("author_id", localStorage.getItem("PlayletUserID"));

    if (error) {
      console.log(error);
      return;
    }

    setMyLocationBooks(location_books ?? undefined);
  }

  // Handle the search
  async function search_lookbooks(search: string) {
    if (search) {
      let { data: location_books, error } = await supabase
        .from("locationbook")
        .select("*")
        .eq("author_id", localStorage.getItem("PlayletUserID"))
        .ilike("project_name", `%${search.trimStart().trimEnd()}%`);

      if (error) {
        console.log(error);
        return;
      }

      setMyLocationBooks(location_books ?? undefined);
    } else {
      get_locationbooks();
    }
  }

  useEffect(() => {
    // Clear all toast
    toast.dismiss();

    get_locationbooks();
  }, [myLocationBooks]);

  return (
    <div className="p-6 space-y-4">
      <div className="text-5xl font-semibold">My Location Books</div>

      {/* Search bar and filter button */}
      <Input
        placeholder="Search Project Name..."
        onChange={(e) => search_lookbooks(e.target.value)}
      />

      {myLocationBooks?.length ? (
        <div className="flex flex-col gap-3">
          {myLocationBooks.map((location_book, index) => (
            <LocationBookPreview
              key={index}
              location_book={location_book}
              get_location_books={get_locationbooks}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center my-10 text-3xl">
          No Location Books Found!
        </div>
      )}

      <div className="flex justify-center items-center">
        <Button
          className="w-1/2 bg-green-500 hover:cursor-pointer hover:bg-green-600"
          onClick={() => {
            navigate(`/locationbookgenerator/${uuidv4()}`);
          }}
        >
          Create New Location Book <Plus />
        </Button>
      </div>
    </div>
  );
};

export default MyLocationBooks;
