// Importing UI Components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Importing Icons
import { Send } from "lucide-react";

// Importing dependencies
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { v4 } from "uuid";

// Importing Global Types
import type { Comment, User } from "@/types/global";

// Importing database
import { supabase } from "@/lib/supabaseClient";

// Importing customer components
import CommentCard from "./CommentCard";

type CommentSheetProps = {
  open: boolean;
  setOpenChange: Dispatch<SetStateAction<boolean>>;
  currentUser: User | null;
  section_id: number;
  book_id: string;
};

const CommentSheet = ({
  open,
  setOpenChange,
  currentUser,
  section_id,
  book_id,
}: CommentSheetProps) => {
  const [comments, setComments] = useState<Comment[]>([]);

  // Current Comment
  const [currentComment, setCurrentComment] = useState<string>("");

  // Helper function to send the comment
  async function send_comment() {
    // Only if the comment is not empty
    if (currentComment) {
      const new_comment: Comment = {
        comment_id: v4(),
        created_at: new Date(),
        author_name: `${currentUser?.first_name} ${currentUser?.last_name}`,
        author_avatar: String(currentUser?.avatar),
        text: currentComment,
        book_id: book_id,
        section_id: section_id,
      };

      const { error } = await supabase
        .from("comments")
        .insert(new_comment)
        .select();

      if (error) {
        console.log(error);
        return;
      }

      get_comments();
      setCurrentComment("");
    }
  }

  // Helper function to fetch the comments
  async function get_comments() {
    let { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("book_id", book_id)
      .eq("section_id", section_id)
      .order("created_at", { ascending: false });

    if (comments) {
      setComments(comments);
    } else if (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    get_comments();
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpenChange}>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-3xl">Comments</SheetTitle>
          <SheetDescription>
            Add a comment for the author or viewers to see.
          </SheetDescription>
        </SheetHeader>

        {/* Scroll Area or Empty Spacer */}
        <div className="flex-1 overflow-hidden">
          {comments.length > 0 ? (
            <ScrollArea className="h-full px-4">
              <div className="space-y-2">
                {comments.map((comment, index) => (
                  <CommentCard key={index} comment={comment} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-full flex justify-center items-center">
              Be the first to add a comment!
            </div>
          )}
        </div>

        {/* Input Container */}
        <div
          className="p-3 gap-2 flex flex-row items-center"
          onKeyDownCapture={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              send_comment();
            }
          }}
        >
          <Input
            type="text"
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            placeholder="Add Comment..."
          />
          <Button
            size="icon"
            className="hover:cursor-pointer"
            onClick={send_comment}
          >
            <Send />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentSheet;
