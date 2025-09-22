import { supabase } from "@/lib/supabaseClient";
import type { EventComment, User } from "@/types/global";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { get_avatar } from "@/lib/utils";
import { Button } from "../ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "../ui/textarea";
import { Link } from "lucide-react";
import { Switch } from "../ui/switch";

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
  const [link, setLink] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      if (newComment.trim() == comment.text && !link) {
        toast.warning("No changes made to comment!");
        return;
      } else {
        // First check to see if the comment you want to change is linked
        if (link) {
          const { error } = await supabase
            .from("event_comments")
            .update({ text: newComment.trim(), edited: true })
            .eq("comment_group_id", comment.comment_group_id)
            .select();

          if (error) {
            console.log(error);
            return;
          }
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
        }

        // If comment successfully updates, refetch the comments and close editing
        getComments();
        setEditing(false);
        setLink(false);
      }
    } else {
      toast.warning("Comment field is empty!");
    }
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

  // Function to delete all the linked comments
  async function delete_linked_comments() {
    const { error } = await supabase
      .from("event_comments")
      .delete()
      .eq("comment_group_id", comment.comment_group_id);

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
          <div className="flex flex-col gap-2">
            {/* Editing comment body */}
            <Textarea
              className="text-sm w-64 sm:w-96"
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

            {/* Switch to edit linked comments */}
            {comment.comment_group_id && (
              <div className="flex flex-row items-center gap-2">
                <Switch checked={link} onCheckedChange={() => setLink(!link)} />
                <div className="text-xs text-gray-500">
                  Save edit to all linked comments
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm">{comment.text}</div>
        )}

        <div className="flex flex-row justify-between items-center mt-3">
          {/* Author avatar and name */}
          <div className="flex flex-row items-center gap-2">
            <img
              className="w-8 rounded-full"
              src={get_avatar(author?.avatar as string)}
              alt="avatar"
            />
            <div className="text-xs">
              {author?.first_name} {author?.last_name}{" "}
              {comment.edited && (
                <span className="text-gray-500">(Edited)</span>
              )}
            </div>
          </div>

          {/* Comment Date */}
          <div className="flex flex-row gap-2 text-right text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </div>
        </div>

        {/* Comment Card Footer Buttons */}
        {comment.author_id == localStorage.getItem("PlayletUserID") && (
          <div className="flex flex-row justify-end -mb-4 gap-2 items-center">
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
                {comment.comment_group_id && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link size={12} className="hover:cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>This comment is linked</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {/* Editing Button */}
                <div
                  className="text-xs underline text-gray-500 
                  hover:text-gray-600 hover:cursor-pointer select-none"
                  onClick={() => setEditing(!editing)}
                >
                  Edit
                </div>

                <div
                  className="text-xs underline text-gray-500 
                  hover:text-gray-600 hover:cursor-pointer select-none"
                  onClick={() => setOpenDelete(true)}
                >
                  Delete
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>

      {/* Modal for deleting a comment */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deleting Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {comment.comment_group_id && (
            <div className="text-sm text-justify text-red-400">
              This comment is linked with other comments. You can choose to just
              delete this comment or all linked comments.
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>

            {/* If comment is linked be able to delete all the linked comments */}
            {comment.comment_group_id && (
              <AlertDialogAction
                className="hover:cursor-pointer"
                onClick={delete_linked_comments}
              >
                Delete Linked Comments
              </AlertDialogAction>
            )}
            <AlertDialogAction
              className="hover:cursor-pointer bg-red-600 hover:bg-red-500
              "
              onClick={delete_comment}
            >
              Delete Comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default EventCommentCard;
