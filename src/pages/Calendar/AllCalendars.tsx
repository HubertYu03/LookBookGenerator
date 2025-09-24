import type { User } from "@/types/global";

type AllCalendarsProps = {
  user: User;
};

const AllCalendars = ({ user }: AllCalendarsProps) => {
  return <div>{user.first_name}</div>;
};

export default AllCalendars;
