import { Card, CardContent } from "@/components/ui/card";
import { get_avatar } from "@/lib/utils";

// Importing global types
import type { Comment } from "@/types/global";

type CommentCardProps = {
  comment: Comment;
};

const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <Card>
      <CardContent className="text-sm">
        <div>{comment.text}</div>
        <div className="flex flex-row items-center justify-between mt-5">
          {/* Author avatar and name */}
          <div className="flex flex-row items-center gap-2">
            <img
              src={get_avatar(comment.author_avatar)}
              alt="author_avatar"
              className="w-8 rounded-full"
            />
            <div>{comment.author_name}</div>
          </div>

          {/* Comment time */}
          <div className="text-gray-500 text-xs">
            {new Date(comment.created_at).toLocaleString().replace(",", "")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
