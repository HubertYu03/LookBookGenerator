import { useNavigate } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

import { type LucideIcon } from "lucide-react";

type SidebarLinksProps = {
  title: string;
  icon: LucideIcon;
  path: string;
};

export default function SidebarLinks({
  title,
  icon: Icon,
  path,
}: SidebarLinksProps) {
  const navigate = useNavigate();

  return (
    <SidebarMenuItem className="pl-1">
      <SidebarMenuButton
        tooltip={title}
        className="hover:cursor-pointer"
        onClick={() => {
          navigate(path);
          if (path.includes("generator") || path.includes("calendar/")) {
            window.location.reload();
          }
        }}
      >
        <div className="flex flex-row items-center gap-2">
          <Icon />
          <span className="text-nowrap">{title}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
