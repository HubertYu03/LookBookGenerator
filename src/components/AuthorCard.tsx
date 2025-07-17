// Importing UI Components
import { get_avatar } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Import global types
import type { User } from "@/types/global";

type AuthorCardProps = {
  author: User | null;
};

const AuthorCard = ({ author }: AuthorCardProps) => {
  return (
    <Card>
      <CardTitle>
        <CardHeader className="text-xl">Author:</CardHeader>
        <CardContent className="flex flex-row items-center gap-3 font-normal mt-2">
          <img
            src={get_avatar(String(author?.avatar))}
            alt="avatar"
            className="w-14 rounded-full border-2"
          />
          <div>
            {author?.first_name} {author?.last_name}
          </div>
        </CardContent>
      </CardTitle>
    </Card>
  );
};

export default AuthorCard;
