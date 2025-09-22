import { supabase } from "@/lib/supabaseClient";
import type { EventComment, User } from "@/types/global";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { get_avatar } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type EventCommentCardProps = {
  comment: EventComment;
  getComments: () => void;
};

const EventCommentCard = ({ comment, getComments }: EventCommentCardProps) => {
  // State for the author of the event
  const [author, setAuthor] = useState<User>();

  // States for editing comments
  const [editing, setEditing] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  // State for deleting the modal
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  async function get_user() {
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

  // Function to edit the current comment
  async function save_comment() {
    toast.dismiss();

    if (newComment) {
      // First check if the comment actually changed
      if (newComment.trim() == comment.text) {
        toast.warning("No changes made to comment!");
        return;
      } else {
        const { error } = await supabase
          .from("event_comments")
          .update({ text: newComment.trim(), edited: true })
          .eq("comment_id", comment.comment_id)
          .select();

        if (error) {
          console.log(error);
          return;
        }

        // If comment successfully updates, refetch the comments and close editing
        getComments();
        setEditing(false);
      }
    }

    toast.warning("Comment field is empty!");
  }

  // Function to delete the current comment
  async function delete_comment() {
    const { error } = await supabase
      .from("event_comments")
      .delete()
      .eq("comment_id", comment.comment_id);

    if (error) {
      console.log(error);
      return;
    }

    // Once the comment is deleted refetch the comments
    getComments();
  }

  // Get the comment on start comment load
  useEffect(() => {
    get_user();
    setNewComment(comment.text);
  }, []);

  // Watch for editing mode and focus the input when it becomes true
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  return (
    <Card>
      <CardContent>
        {editing ? (
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDownCapture={(e) => {
              if (e.key == "Enter" && editing) {
                e.preventDefault();
                save_comment();
              }
            }}
            ref={inputRef}
          />
        ) : (
          <div className="text-sm">{comment.text}</div>
        )}

        <div className="flex flex-row justify-between items-center mt-5">
          {/* Author avatar and name */}
          <div className="flex flex-row items-center gap-2">
            <img
              className="w-8 rounded-full"
              src={get_avatar(author?.avatar as string)}
              alt="avatar"
            />
            <div className="text-xs">
              {author?.first_name} {author?.last_name}
            </div>
          </div>

          {/* Comment Date */}
          <div className="flex flex-row gap-2 text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
            {comment.edited && <u>Edited</u>}
          </div>
        </div>

        {/* Comment Card Footer Buttons */}
        {comment.author_id == localStorage.getItem("PlayletUserID") && (
          <div className="flex flex-row justify-end -mb-4 gap-2">
            {editing ? (
              <>
                {/* If editing, you can choose to cancel the edit or save it */}
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-500 hover:cursor-pointer"
                  onClick={() => {
                    setNewComment(comment.text);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="hover:cursor-pointer"
                  onClick={save_comment}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                {/* Editing Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:cursor-pointer"
                      onClick={() => setEditing(!editing)}
                      tabIndex={-1}
                    >
                      <Pencil />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>

                {/* Deleting Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:cursor-pointer"
                      onClick={() => setOpenDelete(true)}
                      tabIndex={-1}
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        )}
      </CardContent>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deleting Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="hover:cursor-pointer"
              onClick={delete_comment}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default EventCommentCard;
