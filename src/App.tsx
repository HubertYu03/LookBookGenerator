// Importing dependencies
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { v4 } from "uuid";
import { get_avatar } from "./lib/utils";
import { useMediaQuery } from "react-responsive";

// Importing UI Components
import { Toaster } from "sonner";
import { Button } from "./components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarGroupLabel,
} from "./components/ui/sidebar";

// Importing Icons
import {
  BookPlus,
  BookText,
  ChevronRight,
  House,
  Map,
  MapPlus,
  CalendarDays,
  Menu,
  CalendarSearch,
} from "lucide-react";
import logo from "/PlayletLogo.png";

// Importing Pages
import LookBookGenerator from "./pages/LookBook/LookBookGenerator";
import MyLookBooks from "./pages/LookBook/MyLookBooks";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";

// Importing supbase
import { supabase } from "./lib/supabaseClient";

// Importing pages
import MyLocationBooks from "./pages/LocationBook/MyLocationBooks";
import LocationBookGenerator from "./pages/LocationBook/LocationBookGenerator";
import Register from "./pages/auth/Register";
import AuthCallback from "./components/Auth/AuthCallback";
import SidebarLinks from "./components/Sidebar/SidebarLinks";
import SidebarProfileFooter from "./components/Sidebar/SidebarProfileFooter";

import type { User } from "./types/global";
import LoginCard from "./components/Auth/LoginCard";
import Calendar from "./pages/Calendar/Calendar";
import MobileSidebar from "./components/Sidebar/MobileSidebar";
import AllCalendars from "./pages/Calendar/AllCalendars";

window.Buffer = Buffer;

function App() {
  // Sidebar States
  const [open, setOpen] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // User State
  const [userData, setUserData] = useState<User>();
  const [auth, setAuth] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>("/");

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  // Check to see the size of the viewport and what device it is
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Helper function to get the current user (if any)
  async function get_user() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.log(user.id);

      if (user.email) {
        setUserEmail(user.email);
      }

      localStorage.setItem("PlayletUserID", user.id);
    } else {
      // Check the path of the site, if you are not logged in give an option to log in
      if (
        window.location.pathname != "/login" &&
        window.location.pathname != "/register"
      ) {
        setCurrentPath(window.location.pathname);
        setAuth(false);
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

  // User effect to stop background scrolling
  useEffect(() => {
    if (!auth) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // Clean up on unmount
    };
  }, [auth]);

  useEffect(() => {
    // Get the sidebar state on page load
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
      {/* Modal for if the user is not signed in */}
      {!auth && (
        <div
          className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm
          bg-black/50 z-40 flex items-center justify-center"
        >
          <LoginCard current_path={currentPath} setAuth={setAuth} />
        </div>
      )}

      {/* Routes  */}

      {/* Custom Nav bar for mobile devices */}
      {isMobile && userData && (
        <div className="mt-5 ml-5">
          <Menu onClick={() => setMobileOpen(true)} />
          <MobileSidebar
            open={mobileOpen}
            setOpen={setMobileOpen}
            user={userData}
          />
        </div>
      )}

      <Routes>
        {/* Desktop device */}
        {isDesktop && (
          <Route
            path="/*"
            element={
              <SidebarProvider open={open}>
                {userData && (
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
                        {open && (
                          <div className="font-semibold">Playlet Tools</div>
                        )}
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

                        <SidebarGroupLabel>Calendar</SidebarGroupLabel>
                        <SidebarMenu>
                          {/* View Your Personal Calendar */}
                          <SidebarLinks
                            title="My Calendar"
                            path={`/calendar/${userData.personal_calendar_id}`}
                            icon={CalendarDays}
                          />

                          {/* View all your calendars */}
                          <SidebarLinks
                            title="All Calendars"
                            path={`/allcalendars`}
                            icon={CalendarSearch}
                          />
                        </SidebarMenu>
                      </SidebarContent>

                      {/* Sideber Footer */}
                      <SidebarFooter>
                        <SidebarProfileFooter
                          open={open}
                          avatar={avatar ?? ""}
                          email={userEmail ?? ""}
                          first_name={userData?.first_name ?? ""}
                          last_name={userData?.last_name ?? ""}
                        />
                      </SidebarFooter>
                    </Sidebar>

                    <main className="flex-grow overflow-y-auto">
                      {/* Button to close the sidebar */}
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => set_sidebar_state(!open)}
                        className="fixed mt-1 -ml-2 z-30 hover:cursor-pointer"
                      >
                        <ChevronRight
                          className={`${
                            open ? "rotate-180" : ""
                          } transition-transform`}
                        />
                      </Button>

                      <div className="mt-5">
                        {userData && (
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                              path="mylookbooks"
                              element={<MyLookBooks />}
                            />
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
                            <Route
                              path="/calendar/:calendar_id"
                              element={
                                <Calendar user={userData} isMobile={isMobile} />
                              }
                            />
                            <Route
                              path="/allcalendars"
                              element={
                                <AllCalendars
                                  user={userData}
                                  isMobile={isMobile}
                                />
                              }
                            />
                          </Routes>
                        )}
                      </div>
                    </main>
                  </div>
                )}
              </SidebarProvider>
            }
          />
        )}

        {/* Mobile Device */}
        {isMobile && (
          <Route
            path="/*"
            element={
              <>
                {userData && (
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
                    <Route
                      path="/calendar/:id"
                      element={<Calendar user={userData} isMobile={isMobile} />}
                    />
                    <Route
                      path="/allcalendars"
                      element={
                        <AllCalendars user={userData} isMobile={isMobile} />
                      }
                    />
                  </Routes>
                )}
              </>
            }
          />
        )}
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
