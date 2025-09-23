// Import global types
import type { EventComment } from "@/types/global";

// Importing dependencies
import { useEffect, useState } from "react";

// Importing database
import { supabase } from "@/lib/supabaseClient";
import MPCommentCard from "./MPCommentCard";

type MonthPreviewCommentsProps = {
  eventId: string;
  open: boolean;
};

const MonthPreviewComments = ({ eventId, open }: MonthPreviewCommentsProps) => {
  // State for all the comments
  const [comments, setComments] = useState<EventComment[]>([]);

  // Function to get all the comments for this event
  async function get_comments() {
    let { data: event_comments, error } = await supabase
      .from("event_comments")
      .select("*")
      .eq("event_id", eventId);

    if (event_comments) {
      setComments(event_comments);

      return;
    }

    if (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    get_comments();
  }, [open]);

  return (
    <div className="max-h-52 overflow-scroll flex flex-col gap-3 pb-3 mt-2">
      {comments.map((comment) => (
        <MPCommentCard key={comment.comment_id} comment={comment} />
      ))}
    </div>
  );
};

export default MonthPreviewComments;
