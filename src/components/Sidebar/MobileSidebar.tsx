// Importing UI Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Importing Icons
import {
  BookPlus,
  BookText,
  House,
  Map,
  MapPlus,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import logo from "/PlayletLogo.png";

// Importing dependencies
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

// Custom component for icon and label mobile sidebar links
type IconLabelLinkProps = {
  Icon: LucideIcon;
  label: string;
  path: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const IconLabelLink = ({ Icon, label, path, setOpen }: IconLabelLinkProps) => {
  // Navigation object
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-row items-center gap-2 active:opacity-50"
      onClick={() => {
        navigate(path);
        setOpen(false);
        window.location.reload();
      }}
    >
      <Icon />
      <span className="text-nowrap">{label}</span>
    </div>
  );
};

type MobileSidebarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSidebar = ({ open, setOpen }: MobileSidebarProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        className="flex flex-col h-screen duration-150 w-[85vw] max-w-[85vw] sm:w-[400px] sm:max-w-[540px]"
      >
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center gap-3">
            <img src={logo} alt="Logo" className="h-16" />
            <div className="text-xl">Playlet Tools</div>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        <div className="pl-5 -mt-2">
          <IconLabelLink Icon={House} label="Home" path="/" setOpen={setOpen} />

          {/* LookBook section */}
          <div className="text-sm text-gray-600 my-5">LookBooks</div>
          <div className="flex flex-col gap-2">
            <IconLabelLink
              Icon={BookPlus}
              label="My Lookbooks"
              path="/mylookbooks"
              setOpen={setOpen}
            />
            <IconLabelLink
              Icon={BookText}
              label="Create New Lookbook"
              path={`/lookbookgenerator/${v4()}`}
              setOpen={setOpen}
            />
          </div>

          {/* Location Book section */}
          <div className="text-sm text-gray-600 my-5">Location Books</div>
          <div className="flex flex-col gap-2">
            <IconLabelLink
              Icon={MapPlus}
              label="My Location Books"
              path="/mylocationbooks"
              setOpen={setOpen}
            />
            <IconLabelLink
              Icon={Map}
              label="Create New Location Book"
              path={`/locationbookgenerator/${v4()}`}
              setOpen={setOpen}
            />
          </div>

          {/* Calendar section */}
          <div className="text-sm text-gray-600 my-5">Calendar</div>
          <div className="flex flex-col gap-2">
            <IconLabelLink
              Icon={CalendarDays}
              label="Calendar"
              path="/calendar"
              setOpen={setOpen}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
