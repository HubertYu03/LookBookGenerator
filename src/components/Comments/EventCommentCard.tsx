import { supabase } from "@/lib/supabaseClient";
import type { EventComment, User } from "@/types/global";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { get_avatar } from "@/lib/utils";

type EventCommentCardProps = {
  comment: EventComment;
};

const EventCommentCard = ({ comment }: EventCommentCardProps) => {
  const [author, setAuthor] = useState<User>();

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

  useEffect(() => {
    get_user();
  }, []);

  return (
    <Card>
      <CardContent>
        <div className="text-sm">{comment.text}</div>

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
          <div className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCommentCard;
