// Importing global types
import { Button } from "@/components/ui/button";
import type { LookBook } from "@/types/global";

// Import database
import { supabase } from "@/lib/supabaseClient";

// Import dependencies
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// Import UI Components
import { toast } from "sonner";
import LookBookPreview from "@/components/lookbook/LookBookPreview";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const MyLookBooks = () => {
  const navigate = useNavigate();

  // State for lookbooks
  const [myLookbooks, setMyLookbooks] = useState<LookBook[]>();

  // Get the current user's lookbooks
  async function get_lookbooks() {
    let { data: lookbooks, error } = await supabase
      .from("lookbooks")
      .select("*")
      .eq("author_id", localStorage.getItem("PlayletUserID"));

    if (error) {
      console.log(error);
      return;
    }

    setMyLookbooks(lookbooks ?? undefined);
  }

  // Handle the search
  async function search_lookbooks(search: string) {
    if (search) {
      let { data: lookbooks, error } = await supabase
        .from("lookbooks")
        .select("*")
        .eq("author_id", localStorage.getItem("PlayletUserID"))
        .ilike("project_name", `%${search.trimStart().trimEnd()}%`);

      if (error) {
        console.log(error);
        return;
      }

      setMyLookbooks(lookbooks ?? undefined);
    } else {
      get_lookbooks();
    }
  }

  useEffect(() => {
    // Clear all toast
    toast.dismiss();

    get_lookbooks();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="text-5xl font-semibold">My Lookbooks</div>

      {/* Search bar and filter button */}
      <Input
        placeholder="Search Project Name..."
        onChange={(e) => search_lookbooks(e.target.value)}
      />

      {myLookbooks?.length ? (
        <div className="flex flex-col gap-3">
          {myLookbooks.map((lookbook, index) => (
            <LookBookPreview key={index} lookbook={lookbook} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center my-10 text-3xl">
          No Lookbooks Found!
        </div>
      )}

      <Button
        className="w-full bg-green-500 hover:cursor-pointer hover:bg-green-600"
        onClick={() => {
          navigate(`/lookbookgenerator/${uuidv4()}`);
        }}
      >
        Create New Lookbook <Plus />
      </Button>
    </div>
  );
};

export default MyLookBooks;
