// Importing Icons
import { ChevronDownIcon, Send } from "lucide-react";

// Importing UI Components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

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
  event_group_id: string | null | undefined;
};

const EventCardComments = ({
  event_id,
  event_group_id,
}: EventCardCommentsProps) => {
  // State for all the comments
  const [comments, setComments] = useState<EventComment[]>([]);

  // States for adding a new comment
  const [text, setText] = useState<string>("");
  const [linked, setLinked] = useState<boolean>(false);

  // Recent Comment Reference for scrolling to the most recent comment
  const bottomRef = useRef<HTMLDivElement>(null);

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
        comment_group_id: null,
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

  // Function to send the comment to all linked events
  async function send_linked_comment() {
    // Get all the linked events to add the comment to
    const linked_event_ids = await get_linked_events();

    // Generate a comment group id
    const comment_group_id: string = v4();

    // Prep the comments to send
    let comments_to_send: EventComment[] = [];

    // Loop through the linked event ids and create a list of comments to add
    linked_event_ids.map((id) => {
      const new_linked_comment: EventComment = {
        comment_id: v4(),
        event_id: id,
        created_at: new Date(),
        text: text,
        author_id: localStorage.getItem("PlayletUserID") as string,
        edited: false,
        comment_group_id: comment_group_id,
      };

      comments_to_send.push(new_linked_comment);
    });

    // Insert all the comments
    const { error } = await supabase
      .from("event_comments")
      .insert(comments_to_send)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    // Reset the comment input and get the new comments
    setText("");
    get_comments();
    setLinked(false);
  }

  // Helper function to get all the event ID's linked to this group
  async function get_linked_events(): Promise<string[]> {
    let { data: events, error } = await supabase
      .from("events")
      .select("event_id")
      .eq("group_id", event_group_id);

    if (error) {
      console.log(error);
      return [];
    }

    return events?.map((event) => event.event_id) ?? [];
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

  useEffect(() => {
    get_comments();
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
          if (linked) {
            send_linked_comment();
          } else {
            send_comment();
          }
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
      <div className="flex flex-row gap-2">
        <Input
          type="text"
          className="bg-white"
          placeholder="Add Comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          onClick={() => {
            if (linked) {
              send_linked_comment();
            } else {
              send_comment();
            }
          }}
        >
          <Send />
        </Button>
      </div>

      {/* Switch to set link comment */}
      {event_group_id && (
        <div className="flex flex-row items-center mt-2 gap-2">
          <Switch checked={linked} onCheckedChange={() => setLinked(!linked)} />
          <div className="text-sm">Add comment to linked events</div>
        </div>
      )}

      {comments.length > 1 && (
        <Button
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 hover:cursor-pointer"
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
