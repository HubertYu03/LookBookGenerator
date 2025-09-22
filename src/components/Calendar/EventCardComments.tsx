// Importing Icons
import { ChevronDownIcon, Send } from "lucide-react";

// Importing UI Components
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Importing dependencies
import { useEffect, useState, useRef } from "react";
import { v4 } from "uuid";

// Importing database
import { supabase } from "@/lib/supabaseClient";

// Importing Global Types
import type { EventComment } from "@/types/global";

// Importing custom components
import EventCommentCard from "../Comments/EventCommentCard";

type EventCardCommentsProps = {
  event_id: string;
};

const EventCardComments = ({ event_id }: EventCardCommentsProps) => {
  const [comments, setComments] = useState<EventComment[]>([]);
  const [text, setText] = useState<string>("");

  // Recent Comment Reference for scrolling to the most recent comment
  const bottomRef = useRef<HTMLDivElement>(null);

  // Ref to help with disabling autofocus on commenting
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputEditable, setIsInputEditable] = useState(false);

  // Helper function to scroll to the most recent comment (bottom of the page)
  function scroll_to_bottom() {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Function to send the comment to the database
  async function send_comment() {
    if (text) {
      const new_comment: EventComment = {
        comment_id: v4(),
        event_id: event_id,
        created_at: new Date(),
        text: text,
        author_id: localStorage.getItem("PlayletUserID") as string,
        edited: false,
        group_id: null,
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

  // Function to get all the comments for this event
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

  // Helper function for handling enabling on mobile devices
  function handleEnableEditing() {
    if (!isInputEditable) {
      setIsInputEditable(true);
      // After setting editable, focus input manually
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  useEffect(() => {
    get_comments();

    // Remove focus on the comment input
    inputRef.current?.blur();
  }, []);

  // Scroll to the bottom of the comments when a new one is created
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [comments]);

  return (
    <div
      className="bg-gray-100 p-2 rounded-sm relative"
      onKeyDownCapture={(e) => {
        if (e.key == "Enter") {
          e.preventDefault();
          send_comment();
        }
      }}
    >
      <div className="h-52 overflow-scroll flex flex-col gap-3 pb-3">
        {comments.map((comment) => (
          <EventCommentCard
            comment={comment}
            getComments={get_comments}
            key={comment.comment_id}
          />
        ))}

        {/* If there are no comments display a message */}
        {comments.length == 0 && (
          <div className="flex h-11/12 items-center justify-center text-sm italic text-gray-400">
            Be the first to add a comment!
          </div>
        )}

        {/* Reference for scrolling to the bottom for new comments */}
        <div ref={bottomRef} />
      </div>

      {/* Comment Input */}
      <div className="flex flex-row gap-2" onClick={handleEnableEditing}>
        <Input
          type="text"
          className="bg-white"
          placeholder="Add Comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
          readOnly={!isInputEditable}
          autoComplete="off"
          autoCorrect="off"
        />
        <Button onClick={send_comment}>
          <Send />
        </Button>
      </div>

      {comments.length > 1 && (
        <Button
          className="absolute bottom-14 left-1/2 transform -translate-x-1/2 hover:cursor-pointer"
          size="sm"
          onClick={scroll_to_bottom}
        >
          <ChevronDownIcon />
        </Button>
      )}
    </div>
  );
};

export default EventCardComments;
