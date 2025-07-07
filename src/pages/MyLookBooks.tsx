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

    console.log(lookbooks);

    if (error) {
      console.log(error);
      return;
    }

    setMyLookbooks(lookbooks ?? undefined);
  }

  useEffect(() => {
    // Clear all toast
    toast.dismiss();

    get_lookbooks();
  }, []);

  return (
    <div>
      {myLookbooks?.map((lookbook, index) => (
        <Button
          key={index}
          onClick={() => {
            navigate(`/lookbookgenerator/${lookbook.lookbook_id}`);
          }}
        >
          {lookbook.project_name}
        </Button>
      ))}
      <Button
        onClick={() => {
          navigate(`/lookbookgenerator/${uuidv4()}`);
        }}
      >
        Create New Lookbook
      </Button>
    </div>
  );
};

export default MyLookBooks;
