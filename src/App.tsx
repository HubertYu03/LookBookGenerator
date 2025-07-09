// Importing dependencies
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { v4 } from "uuid";
import { get_avatar } from "./lib/utils";
import Images from "./assets/avatar/AvatarIndex";

// Importing UI Components
import { Toaster } from "sonner";
import { Button } from "./components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarGroupLabel,
} from "./components/ui/sidebar";

import {
  BookPlus,
  BookText,
  ChevronRight,
  House,
  Map,
  MapPlus,
} from "lucide-react";
import logo from "/PlayletLogo.png";

// Importing Pages
import LookBookGenerator from "./pages/LookBookGenerator";
import MyLookBooks from "./pages/MyLookBooks";
import Login from "./pages/Login";
import Home from "./pages/Home";

// Importing supbase
import { supabase } from "./lib/supabaseClient";

// Importing pages
import MyLocationBooks from "./pages/MyLocationBooks";
import LocationBookGenerator from "./pages/LocationBookGenerator";
import Register from "./pages/Register";
import AuthCallback from "./components/AuthCallback";
import SidebarLinks from "./components/SidebarLinks";

import type { User } from "./types/global";

window.Buffer = Buffer;

function App() {
  // Sidebar States
  const [open, setOpen] = useState<boolean>(true);

  // User State
  const [userData, setUserData] = useState<User>();
  const [avatar, setAvatar] = useState<string | null>(null);

  // Helper function to get the current user (if any)
  async function get_user() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.log(user.id);
      localStorage.setItem("PlayletUserID", user.id);
    } else {
      const path: string = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/";
        return;
      }
    }

    // Get the user data from the database
    let { data: user_data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", localStorage.getItem("PlayletUserID"));

    if (!error && user_data && user_data.length > 0) {
      setUserData(user_data[0]);
      setAvatar(get_avatar(user_data[0].avatar));
    } else if (error) {
      console.log(error);
    }
  }

  // Helper function to set sidebar state
  function set_sidebar_state(value: boolean) {
    if (value) {
      sessionStorage.setItem("sidebar_state", "true");
    } else {
      sessionStorage.setItem("sidebar_state", "false");
    }
    setOpen(value);
  }

  useEffect(() => {
    if (sessionStorage.getItem("sidebar_state")) {
      let sidebar_state = sessionStorage.getItem("sidebar_state");
      if (sidebar_state == "true") {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }

    // Get the user
    get_user();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <SidebarProvider open={open}>
              <div className="relative flex flex-grow overflow-y-auto">
                <Sidebar
                  collapsible="icon"
                  style={{
                    transition: "width 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  {/* Siderbar Header */}
                  <SidebarHeader className="flex-row items-center gap-2 text-nowrap">
                    <img src={logo} alt="logo" className="w-12" />
                    {open && <div className="font-semibold">Playlet Tools</div>}
                  </SidebarHeader>

                  {/* Sidebar Content */}
                  <SidebarContent>
                    {/* Home Button */}
                    <SidebarMenu>
                      <SidebarLinks title="Home" path="/" icon={House} />
                    </SidebarMenu>

                    {/* Divider */}
                    {!open && <div className="mx-auto w-2/3 border" />}

                    {/* Lookbook navigation links */}
                    <SidebarGroupLabel>Lookbooks</SidebarGroupLabel>
                    <SidebarMenu>
                      {/* View all look books */}
                      <SidebarLinks
                        title="My Lookbooks"
                        path="/mylookbooks"
                        icon={BookText}
                      />

                      {/* create new look book */}
                      <SidebarLinks
                        title="Create New Lookbook"
                        path={`/lookbookgenerator/${v4()}`}
                        icon={BookPlus}
                      />
                    </SidebarMenu>

                    {/* Divider */}
                    {!open && <div className="mx-auto w-2/3 border" />}

                    {/* Location Book navigation links */}
                    <SidebarGroupLabel>Location Books</SidebarGroupLabel>
                    <SidebarMenu>
                      {/* View Your Location Books */}
                      <SidebarLinks
                        title="My Location Books"
                        path="/mylocationbooks"
                        icon={Map}
                      />

                      {/* Create New Location Book */}
                      <SidebarLinks
                        title="Create New Location Book"
                        path={`/locationbookgenerator/${v4()}`}
                        icon={MapPlus}
                      />
                    </SidebarMenu>
                  </SidebarContent>

                  {/* Sideber Footer */}
                  <SidebarFooter>
                    <div className="flex flex-row items-center gap-3 text-nowrap p-2 rounded-lg">
                      {avatar ? (
                        <Popover>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <PopoverTrigger asChild>
                                <img
                                  src={avatar}
                                  alt="avatar"
                                  className="w-12 h-12 rounded-full border object-cover hover:cursor-pointer"
                                />
                              </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              Click to change avatar
                            </TooltipContent>
                          </Tooltip>
                          <PopoverContent>
                            <div className="mb-3 font-light text-sm">
                              Select avatar to change to:
                            </div>
                            <div className="flex flex-row justify-center items-center gap-2">
                              {Images.map(
                                (
                                  img: { label: string; src: string },
                                  index
                                ) => (
                                  <img
                                    key={index}
                                    src={img.src}
                                    alt={`${img.label}_avatar`}
                                    className="w-12 h-12 rounded-full border object-cover"
                                  />
                                )
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Skeleton className="w-12 h-12 rounded-full" />
                      )}
                      {open && (
                        <div>
                          {userData ? (
                            <div className="font-normal">
                              {userData.first_name} {userData.last_name}
                            </div>
                          ) : (
                            <>
                              <Skeleton className="h-3 w-36" />
                              <Skeleton className="h-3 w-20" />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </SidebarFooter>
                </Sidebar>
                <main className="flex-grow overflow-y-auto">
                  {/* Button to close the sidebar */}
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => set_sidebar_state(!open)}
                    className="fixed mt-1 -ml-2 z-50 hover:cursor-pointer"
                  >
                    <ChevronRight
                      className={`${
                        open ? "rotate-180" : ""
                      } transition-transform`}
                    />
                  </Button>

                  <div className="mt-5">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="mylookbooks" element={<MyLookBooks />} />
                      <Route
                        path="lookbookgenerator/:look_book_id"
                        element={<LookBookGenerator />}
                      />
                      <Route
                        path="/mylocationbooks"
                        element={<MyLocationBooks />}
                      />
                      <Route
                        path="/locationbookgenerator/:location_book_id"
                        element={<LocationBookGenerator />}
                      />
                    </Routes>
                  </div>
                </main>
              </div>
            </SidebarProvider>
          }
        />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;
