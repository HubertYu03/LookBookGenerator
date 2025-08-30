// Importing UI components
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

type SidebarFooterProps = {
  avatar: string;
  first_name: string;
  last_name: string;
  open: boolean;
  email: string;
};

const SidebarProfileFooter = ({
  avatar,
  first_name,
  last_name,
  open,
  email,
}: SidebarFooterProps) => {
  return (
    <SidebarMenu>
      {avatar ? (
        <SidebarMenuItem>
          <div className="flex flex-row items-center gap-3">
            <img
              src={avatar}
              alt="avatar"
              className={`rounded-full border-2 object-cover w-12`}
            />
            {open && (
              <div className="text-gray-500">
                <div className="sm">
                  {first_name} {last_name}
                </div>
                <div className="text-xs">{email}</div>
              </div>
            )}
          </div>
        </SidebarMenuItem>
      ) : (
        <div className="flex items-center space-x-4">
          {open ? (
            <>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-2 w-30" />
                <Skeleton className="h-2 w-20" />
              </div>
            </>
          ) : (
            <Skeleton className="h-6 w-6 rounded-full" />
          )}
        </div>
      )}
    </SidebarMenu>
  );
};

export default SidebarProfileFooter;
