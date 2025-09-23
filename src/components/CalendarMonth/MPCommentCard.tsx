import { supabase } from "@/lib/supabaseClient";
import type { EventComment, User } from "@/types/global";
import { useEffect, useState } from "react";

type MPCommentCardProps = {
  comment: EventComment;
};

const MPCommentCard = ({ comment }: MPCommentCardProps) => {
  // State for the author of the event
  const [author, setAuthor] = useState<User>();

  // Helper function to get the author
  async function get_author() {
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", comment.author_id);

    if (users) {
      setAuthor(users[0]);
    }

    if (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    get_author();
  }, [open]);

  return (
    <div className="border border-b-amber-50 shadow p-2 rounded-sm text-white">
      <div className="flex flex-row gap-2 items-center justify-between text-right">
        <div>
          {author?.first_name} {author?.last_name}
        </div>
        <div className="text-sm">
          {new Date(comment.created_at).toLocaleString()}
        </div>
      </div>

      <div className="italic text-sm p-2">{comment.text}</div>
    </div>
  );
};

export default MPCommentCard;
