// Importing Icons
import { Send } from "lucide-react";

// Importing UI Components
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Importing dependencies
import { useEffect, useState } from "react";
import { v4 } from "uuid";

// Importing database
import { supabase } from "@/lib/supabaseClient";
import type { EventComment } from "@/types/global";
import EventCommentCard from "../Comments/EventCommentCard";

type EventCardCommentsProps = {
  event_id: string;
};

const EventCardComments = ({ event_id }: EventCardCommentsProps) => {
  const [comments, setComments] = useState<EventComment[]>([]);
  const [text, setText] = useState<string>("");

  async function send_comment() {
    if (text) {
      const new_comment: EventComment = {
        comment_id: v4(),
        event_id: event_id,
        created_at: new Date(),
        text: text,
        author_id: localStorage.getItem("PlayletUserID") as string,
      };

      const { error } = await supabase
        .from("event_comments")
        .insert(new_comment)
        .select();

      if (error) {
        console.log(error);
        return;
      }

      setText("");
      get_comments();
    }
  }

  async function get_comments() {
    let { data: event_comments, error } = await supabase
      .from("event_comments")
      .select("*")
      .eq("event_id", event_id);

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
  }, []);

  return (
    <div
      className="bg-gray-100 p-2 rounded-sm"
      onKeyDownCapture={(e) => {
        if (e.key == "Enter") {
          e.preventDefault();
          send_comment();
        }
      }}
    >
      <div className="h-52 overflow-scroll flex flex-col gap-3 pb-3">
        {comments.map((comment, index) => (
          <EventCommentCard comment={comment} key={index} />
        ))}
      </div>
      <div className="flex flex-row gap-2">
        <Input
          type="text"
          className="bg-white"
          placeholder="Add Comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default EventCardComments;
