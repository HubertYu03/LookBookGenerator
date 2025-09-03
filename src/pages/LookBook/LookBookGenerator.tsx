// Import dependencies
import { pdf } from "@react-pdf/renderer";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useParams } from "react-router-dom";
import {
  dataURLtoFile,
  deleteAllFilesInBucket,
  list_all_files,
} from "@/lib/utils";
import { useMediaQuery } from "react-responsive";

// Import Supabase
import { supabase } from "@/lib/supabaseClient";

// Import UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Importing Icons
import {
  ChevronUp,
  Plus,
  FileText,
  CircleQuestionMark,
  ChevronDownIcon,
  Save,
  Ellipsis,
} from "lucide-react";

// Import Custom Components
import LookBook from "@/pdf/LookBook";
import RoleInput from "@/components/lookbook/RoleInput";
import LookBookMenuButton from "@/components/lookbook/LookBookMenuButton";
import AuthorCard from "@/components/AuthorCard";
import HowToSheet from "@/components/Documentation/HowToSheet";
import MobileShare from "@/components/Mobile/MobileShare";

// Import Global Types
import type { Img, Role, User } from "@/types/global";
import MobileDelete from "@/components/Mobile/MobileDelete";

const LookBookGenerator = () => {
  // Check to see the size of the viewport and what device it is
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Get the LookBook ID
  const { look_book_id } = useParams();

  // States for page start up
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [authorData, setAuthorData] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [exists, setExists] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // General Information
  const [projectName, setProjectName] = useState<string | null>(null);
  const [crewName, setCrewName] = useState<string | null>(null);
  const [directorName, setDirectorName] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentError, setCurrentError] = useState<string>("");

  // States for error
  const [currentEmpty, setCurrentEmpty] = useState<number>(0);

  // State for opening the how to page
  const [openHowTo, setOpenHowTo] = useState<boolean>(false);

  // Create an initial role
  let inital_role: Role = {
    id: randomFiveDigit(),
    roleName: null,
    wardrobeStyle: null,
    colorPalette: null,
    additionalNotes: null,
    stylingSuggestions: [],
    accessories: [],
    newly_created: true,
  };
  const [roles, setRoles] = useState<Role[]>([inital_role]);

  // Helper function to create a random role id for state tracking
  function randomFiveDigit(): number {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  // Helper function to create a new empty role
  function create_new_role() {
    // Clear the toasts
    toast.dismiss();

    const new_id: number = randomFiveDigit();

    let new_role: Role = {
      id: new_id,
      roleName: null,
      wardrobeStyle: null,
      colorPalette: null,
      additionalNotes: null,
      stylingSuggestions: [],
      accessories: [],
      newly_created: true,
    };

    setRoles((roles) => [...roles, new_role]);

    setTimeout(() => {
      jump_to_role(String(new_id));
    }, 0);

    toast.success(`Role #${new_id} successfully created!`);
  }

  // Helper function to jump to selected role id
  function jump_to_role(id: string) {
    // Get the target we want to jump to
    const target = document.getElementById(`role-${id}`);

    // Scroll to target
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Helper function to generate the look book
  function generate_look_book() {
    // Clear all toasts
    toast.dismiss();
    setCurrentEmpty(0);
    setCurrentError("");

    // Make sure there is a project name
    if (!projectName) {
      setCurrentError("project_name");
      toast.error("Please enter a Project name!");
      return;
    }

    // Make sure there is a crew name
    if (!crewName) {
      setCurrentError("crew_name");
      toast.error("Please enter a Crew name!");
      return;
    }

    // Make sure there is a  name
    if (!directorName) {
      setCurrentError("director_name");
      toast.error("Please enter a Director name!");
      return;
    }

    if (!date) {
      setCurrentError("project_date");
      toast.error("Please enter a Project Date!");
      return;
    }

    // Check for empty roles, then jump to the first empty one
    for (let role of roles) {
      if (
        role.roleName == null ||
        role.roleName == "" ||
        role.wardrobeStyle == null ||
        role.wardrobeStyle == "" ||
        role.stylingSuggestions.length == 0
      ) {
        // Set the current empty list
        setCurrentEmpty(role.id);

        // Tell the user where the error is
        toast.error(`Role #${role.id} has empty fields!`);

        // Jump to the empty role
        jump_to_role(String(role.id));
        return;
      }
    }

    // if the program reaches this point, all the inputs are valid and then generate the look book
    openPDFInNewTab();
  }

  // Function to open the generated pdf
  const openPDFInNewTab = async () => {
    // Set loading toast
    toast.info("Generating Lookbook...", {
      id: "loading-message",
    });

    // We need to convert all our images into a temporary roles img links
    let pdf_roles: Role[] = roles;

    console.log(pdf_roles);

    // Check for color palette photos
    await Promise.all(
      pdf_roles.map(async (role) => {
        if (role.colorPalette?.src.startsWith("private")) {
          const { data, error } = await supabase.storage
            .from("lookbook")
            .createSignedUrl(role.colorPalette.src, 60);

          if (error) {
            console.log(error);
          }

          if (data) {
            role.colorPalette = {
              src: data.signedUrl,
              id: role.colorPalette.id,
            };
          }
        }
      })
    );

    const blob = await pdf(
      <LookBook
        project_name={String(projectName)}
        crew_name={String(crewName)}
        director_name={String(directorName)}
        date={String(date?.toLocaleDateString())}
        roles={pdf_roles}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // Dismiss the loading toast
    toast.dismiss("loading-message");
  };

  // Helper functions for saving the images
  async function uploadImage(file: File, path: string) {
    const { error } = await supabase.storage
      .from("lookbook")
      .upload(path, file, {
        upsert: true,
        metadata: {
          owner: localStorage.getItem("PlayletUserID"),
        },
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      throw error;
    }
  }

  // Helper function to save editing progress
  async function save_progress() {
    // Clear all toasts and errors
    toast.dismiss();
    setCurrentError("");

    // Only allow a save if the project name is not null
    if (!projectName) {
      setCurrentError("project_name");
      toast.warning("Please enter a Project Name before saving!");
      return;
    }

    // Set a loading toast message
    toast.info("Saving Location Book...", {
      id: "loading-toast",
    });

    // Save the fields
    let lookbook_data = {
      lookbook_id: look_book_id,
      author_id: localStorage.getItem("PlayletUserID"),
      project_name: projectName,
      crew_name: crewName,
      director_name: directorName,
      date: date,
      roles: roles,
      last_edited: new Date(),
    };

    // First check if the lookbook already exists
    const { data } = await supabase
      .from("lookbooks")
      .select("*")
      .eq("lookbook_id", look_book_id);

    // If the lookbook exists
    console.log("look book exists");

    // If a role was deleted, delete all the fields associated with that folder
    if (data?.length != 0) {
      if (data && data[0].roles.length > roles.length) {
        console.log("There are roles to delete");

        const saved_roles: Role[] = data[0].roles;
        const current_roles: Role[] = roles;

        // Extract IDs from current roles
        const current_role_ids = current_roles.map((r) => r.id);

        // Get roles that are in savedRoles but not in currentRoles
        const roles_to_delete = saved_roles.filter(
          (saved_role) => !current_role_ids.includes(saved_role.id)
        );

        console.log("Deleted Roles:", roles_to_delete);
        // Delete all the files in the unused roles
        roles_to_delete.map(async (role) => {
          // Delete the color palettes
          await deleteAllFilesInBucket(
            "lookbook",
            `private/${look_book_id}/color_palette/${role.id}`
          );

          // Delete the styles
          await deleteAllFilesInBucket(
            "lookbook",
            `private/${look_book_id}/styling/${role.id}`
          );

          // Delete all the comments associated with that role
          const { error } = await supabase
            .from("comments")
            .delete()
            .eq("book_id", look_book_id)
            .eq("section_id", role.id);

          if (error) {
            console.log(error);
            return;
          }
        });
      }
    }

    console.log(lookbook_data);

    // We need to first process the role fields and images, loop through all the roles
    await Promise.all(
      roles.map(async (role, index) => {
        // If there is an input from role
        if (role.colorPalette) {
          // First check if the file is still in data format
          if (role.colorPalette.src.startsWith("data:image")) {
            // Convert the file to a supabase path then insert it into the colorPalette path
            const converted_file: File = dataURLtoFile(
              role.colorPalette.src,
              `${role.colorPalette.id}.png`
            );

            // Generate the path for color palettes and upload the image
            const path_name: string = `private/${look_book_id}/color_palette/${role.id}/${role.colorPalette.id}.jpg`;
            await uploadImage(converted_file, path_name);

            // Add this path name to the object that is going to be updated
            const new_color_palette: Img = {
              src: path_name,
              id: role.colorPalette.id,
            };

            // Update the data sent to the database
            lookbook_data.roles[index].colorPalette = new_color_palette;
          } else {
          }
        } else {
          // If there is no images selected check if there exists a path in the database
          let { data: role_data, error } = await supabase
            .from("lookbooks")
            .select("roles")
            .eq("lookbook_id", look_book_id);

          if (error) {
            console.log(error);
          }

          if (role_data) {
            if (role_data.length != 0) {
              if (role_data[0].roles[index]) {
                if (role_data[0].roles[index].colorPalette) {
                  const path: string =
                    role_data[0].roles[index].colorPalette.src;

                  const { error } = await supabase.storage
                    .from("lookbook")
                    .remove([path]);

                  if (error) {
                    console.log(error);
                  }

                  console.log("Image Deleted");
                }
              }
            }
          }

          lookbook_data.roles[index].colorPalette = null;
        }

        if (role.colorPalette) {
          // After processing the color palette, check to see which images
          // need to be deleted from the database if there are extra

          // Get all the currently saved paths
          let saved_img_list: string[] = [role.colorPalette.src];

          // Get a list of the current images and the images in the storage
          let storage_list = await list_all_files(
            "lookbook",
            `private/${look_book_id}/color_palette/${role.id}`
          );

          // // convert the storage list in a list string
          let file_img_list: string[] = [];
          storage_list.forEach((filename) => {
            file_img_list.push(
              `private/${look_book_id}/color_palette/${role.id}/${filename}`
            );
          });

          console.log(saved_img_list);
          console.log(file_img_list);

          if (file_img_list.length != 0 || saved_img_list.length != 0) {
            // // Get the non matching img names
            let nonMatching: string[] = [
              ...saved_img_list.filter((item) => !file_img_list.includes(item)),
              ...file_img_list.filter((item) => !saved_img_list.includes(item)),
            ];

            console.log(nonMatching);

            // If there are non matching files, delete them from the database
            if (nonMatching.length > 0) {
              // Delete the files from the storage
              const { error } = await supabase.storage
                .from("lookbook")
                .remove(nonMatching);
              if (error) {
                console.log(error);
              }
            }
          }
        }

        // Processing the styling images
        if (role.stylingSuggestions.length > 0) {
          console.log("There are styling images to save");
          // Loop through all the images so we can begin processing

          await Promise.all(
            role.stylingSuggestions.map(async (img, i) => {
              if (img.src.startsWith("data:image")) {
                const converted_file: File = dataURLtoFile(
                  img.src,
                  `${img.id}.jpg`
                );
                const path_name: string = `private/${look_book_id}/styling/${role.id}/${img.id}.jpg`;

                await uploadImage(converted_file, path_name);

                role.stylingSuggestions[i] = {
                  src: path_name,
                  id: img.id,
                };
              } else if (!img.src.startsWith("private")) {
                const path_name: string = `private/${look_book_id}/styling/${role.id}/${img.id}.jpg`;
                role.stylingSuggestions[i] = { src: path_name, id: img.id };
              }
            })
          );
        } else {
          // If the list is empty, that means there are no images selected.
          // Delete all the images in the bucket
          await deleteAllFilesInBucket(
            "lookbook",
            `private/${look_book_id}/styling/${role.id}`
          );
        }

        // Delete files that are not part of the list
        if (role.stylingSuggestions.length > 0) {
          // After processing the images, check to see which images
          // need to be deleted from the database if there are extra

          // Get all the currently saved paths
          let saved_img_list: string[] = [];
          role.stylingSuggestions.forEach((img) => {
            saved_img_list.push(img.src);
          });

          // Get a list of the current images and the images in the storage
          let storage_list = await list_all_files(
            "lookbook",
            `private/${look_book_id}/styling/${role.id}`
          );

          // // convert the storage list in a list string
          let file_img_list: string[] = [];
          storage_list.forEach((filename) => {
            file_img_list.push(
              `private/${look_book_id}/styling/${role.id}/${filename}`
            );
          });

          console.log(saved_img_list);
          console.log(file_img_list);

          if (file_img_list.length != 0 || saved_img_list.length != 0) {
            // // Get the non matching img names
            let nonMatching: string[] = [
              ...saved_img_list.filter((item) => !file_img_list.includes(item)),
              ...file_img_list.filter((item) => !saved_img_list.includes(item)),
            ];

            console.log(nonMatching);

            // If there are non matching files, delete them from the database
            if (nonMatching.length > 0) {
              // Delete the files from the storage
              const { error } = await supabase.storage
                .from("lookbook")
                .remove(nonMatching);
              if (error) {
                console.log(error);
              }
            }
          }
        }

        // Process the Accessory images
        if (role.accessories.length > 0) {
          console.log("There are accessory images to save");
          // Loop through all the images so we can begin processing

          await Promise.all(
            role.accessories.map(async (img, i) => {
              if (img.src.startsWith("data:image")) {
                const converted_file: File = dataURLtoFile(
                  img.src,
                  `${img.id}.jpg`
                );
                const path_name: string = `private/${look_book_id}/accessories/${role.id}/${img.id}.jpg`;

                await uploadImage(converted_file, path_name);

                role.accessories[i] = {
                  src: path_name,
                  id: img.id,
                };
              } else if (!img.src.startsWith("private")) {
                const path_name: string = `private/${look_book_id}/accessories/${role.id}/${img.id}.jpg`;
                role.accessories[i] = { src: path_name, id: img.id };
              }
            })
          );
        } else {
          // If the list is empty, that means there are no images selected.
          // Delete all the images in the bucket
          await deleteAllFilesInBucket(
            "lookbook",
            `private/${look_book_id}/accessories/${role.id}`
          );
        }

        // Delete files that are not part of the accessory list
        if (role.accessories.length > 0) {
          // After processing the images, check to see which images
          // need to be deleted from the database if there are extra

          // Get all the currently saved paths
          let saved_img_list: string[] = [];
          role.accessories.forEach((img) => {
            saved_img_list.push(img.src);
          });

          // Get a list of the current images and the images in the storage
          let storage_list = await list_all_files(
            "lookbook",
            `private/${look_book_id}/accessories/${role.id}`
          );

          // // convert the storage list in a list string
          let file_img_list: string[] = [];
          storage_list.forEach((filename) => {
            file_img_list.push(
              `private/${look_book_id}/accessories/${role.id}/${filename}`
            );
          });

          console.log(saved_img_list);
          console.log(file_img_list);

          if (file_img_list.length != 0 || saved_img_list.length != 0) {
            // // Get the non matching img names
            let nonMatching: string[] = [
              ...saved_img_list.filter((item) => !file_img_list.includes(item)),
              ...file_img_list.filter((item) => !saved_img_list.includes(item)),
            ];

            console.log(nonMatching);

            // If there are non matching files, delete them from the database
            if (nonMatching.length > 0) {
              // Delete the files from the storage
              const { error } = await supabase.storage
                .from("lookbook")
                .remove(nonMatching);
              if (error) {
                console.log(error);
              }
            }
          }
        }

        lookbook_data.roles[index].newly_created = false;
      })
    );

    console.log(lookbook_data.roles);

    const { error } = await supabase
      .from("lookbooks")
      .upsert(lookbook_data)
      .eq("lookbook_id", look_book_id)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    // Display success message and refetch data
    toast.dismiss("loading-toast");
    toast.success("Saved Lookbook!");
    get_lookbook_data();

    setRefreshKey((prev) => prev + 1);
  }

  // Helper function to get the author data
  async function get_user(
    id: string,
    setState: Dispatch<SetStateAction<User | null>>
  ) {
    // Get the user data from the database
    let { data: user_data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", id);

    if (!error && user_data && user_data.length > 0) {
      setState(user_data[0]);
    } else if (error) {
      console.log(error);
    }
  }

  // Helper function to get the saved look book data
  async function get_lookbook_data() {
    // First check if the look book exists and belongs to someone else
    // First check if the lookbook already exists
    const { data } = await supabase
      .from("lookbooks")
      .select("*")
      .eq("lookbook_id", look_book_id);

    if (data && data.length !== 0) {
      // That means this look book exists
      if (localStorage.getItem("PlayletUserID") != data[0].author_id) {
        setCanEdit(false);
        get_user(data[0].author_id, setAuthorData);
      } else {
        console.log("You can edit this page!");
      }

      // Load the lookbook data into the editor
      setProjectName(data[0].project_name);
      setCrewName(data[0].crew_name);
      setDirectorName(data[0].director_name);

      // Check the date
      const parsedDate = data[0].date ? new Date(data[0].date) : undefined;
      setDate(parsedDate);

      setRoles(data[0].roles);

      // Set the book existing to be true
      setExists(true);
    }

    // Set loading to false
    setLoading(false);
  }

  // When the page loads, get the saved data if it exists
  useEffect(() => {
    document.title = "Lookbook Editor";

    get_lookbook_data();

    // Get the current User
    get_user(String(localStorage.getItem("PlayletUserID")), setCurrentUser);
  }, []);

  return (
    <div className="p-6 space-y-4 relative z-0" id="top-of-page">
      {/* Back to top button */}
      <div id="step-5" className="fixed bottom-1 right-5">
        <Button
          className="hover:cursor-pointer"
          size="lg"
          onClick={() => {
            // Jump to the top of the page
            const target: HTMLElement | null =
              document.getElementById(`top-of-page`);
            target?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {!isMobile && "Back to Top"}
          <ChevronUp />
        </Button>
      </div>

      {/* Beginning of the page */}

      {/* Desktop View */}
      {!isMobile && (
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-row items-center gap-3">
            <div className="text-3xl sm:text-5xl font-semibold">
              Lookbook Editor
            </div>
          </div>

          {canEdit ? (
            <div className="flex gap-3">
              <Button
                className="hover:cursor-pointer"
                variant="outline"
                disabled={loading}
                onClick={() => setOpenHowTo(true)}
              >
                How To Use
                <CircleQuestionMark />
              </Button>

              <Button
                className="hover:cursor-pointer"
                onClick={save_progress}
                disabled={loading || !canEdit}
              >
                Save <Save />
              </Button>

              <Button
                className="bg-green-500 hover:bg-green-600 hover:cursor-pointer"
                onClick={generate_look_book}
                disabled={loading || !canEdit}
              >
                Generate Lookbook
                <FileText />
              </Button>

              <LookBookMenuButton
                book_type="Look Book"
                bucket="lookbook"
                column_name="roles"
                id={look_book_id ?? ""}
                id_column_name="lookbook_id"
                table_name="lookbooks"
                path="/mylookbooks"
                disabled={loading || !canEdit}
                exists={exists}
              />
            </div>
          ) : (
            <div className="absolute right-6 flex flex-row gap-4">
              <Button
                className="bg-green-500 hover:bg-green-600 hover:cursor-pointer"
                onClick={generate_look_book}
                disabled={loading}
              >
                Generate Lookbook
                <FileText />
              </Button>

              <AuthorCard author={authorData} />
            </div>
          )}
        </div>
      )}

      {isMobile && (
        <div className="flex flex-row justify-between items-start">
          <div className="text-3xl sm:text-5xl font-semibold">
            Lookbook Editor
          </div>

          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => setOpenHowTo(true)}
            >
              <CircleQuestionMark />
            </Button>

            {/* Mobile View Sheet Content */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" disabled={loading}>
                  <Ellipsis />
                </Button>
              </SheetTrigger>
              <SheetContent className="max-w-full overflow-x-auto break-words">
                {/* Lookbook actions header */}
                <SheetHeader>
                  <SheetTitle className="text-2xl">Lookbook Actions</SheetTitle>
                  <SheetDescription>
                    Lookbook editing actions that allows you to save, share, and
                    see your work.
                  </SheetDescription>
                </SheetHeader>

                {/* Action Divs */}
                <div className="ml-5 flex flex-col gap-5">
                  {/* Save Button */}
                  <div
                    className="flex flex-row gap-2 active:opacity-50"
                    onClick={save_progress}
                  >
                    <Save />
                    <div>Save</div>
                  </div>

                  {/* Generate LookBook Button */}
                  <div
                    className="flex flex-row gap-2 active:opacity-50"
                    onClick={generate_look_book}
                  >
                    <FileText />
                    <div>Generate Lookbook</div>
                  </div>

                  {/* Share Lookbook Button */}
                  <MobileShare exists={exists} />

                  {/* Delete Lookbook Button */}
                  <MobileDelete
                    book_type="Look Book"
                    bucket="lookbook"
                    column_name="roles"
                    id={look_book_id ?? ""}
                    id_column_name="lookbook_id"
                    table_name="lookbooks"
                    path="/mylookbooks"
                    exists={exists}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-screen pb-32 text-2xl">
          Loading Lookbook...
        </div>
      ) : (
        <>
          {/* Project Name input */}
          <div className="flex flex-col items-start gap-3">
            <Label className="text-xl sm:text-2xl">
              Enter Project Name
              <span className={projectName ? "invisible" : "text-red-500"}>
                *
              </span>
            </Label>
            <Input
              className={`w-1/3 text-sm sm:text-xl ${
                currentError == "project_name" ? "border-red-500" : ""
              }`}
              placeholder="Enter Project Name..."
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName ?? ""}
              disabled={!canEdit}
            />
          </div>

          {/* Crew Name Input */}
          <div className="grid w-full items-center gap-3">
            <Label className="text-xl sm:text-2xl">
              Enter Crew Name
              <span className={crewName ? "invisible" : "text-red-500"}>*</span>
            </Label>
            <Input
              className={`w-1/3 text-sm sm:text-xl ${
                currentError == "crew_name" ? "border-red-500" : ""
              }`}
              placeholder="Enter Crew Name..."
              onChange={(e) => setCrewName(e.target.value)}
              value={crewName ?? ""}
              disabled={!canEdit}
            />
          </div>

          {/* Director Name Input */}
          <div className="grid w-full items-center gap-3">
            <Label className="text-xl sm:text-2xl">
              Enter Director Name
              <span className={directorName ? "invisible" : "text-red-500"}>
                *
              </span>
            </Label>
            <Input
              className={`w-1/3 text-sm sm:text-xl ${
                currentError == "director_name" ? "border-red-500" : ""
              }`}
              placeholder="Enter Director Name..."
              onChange={(e) => setDirectorName(e.target.value)}
              value={directorName ?? ""}
              disabled={!canEdit}
            />
          </div>

          {/* Date Input */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="text-xl sm:text-2xl">
              Project Date
              <span className={date ? "invisible" : "text-red-500"}>*</span>
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                asChild
                className={
                  currentError == "project_date" ? "border-red-500" : ""
                }
              >
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal text-sm sm:text-xl"
                  disabled={!canEdit}
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                  classNames={{
                    caption_dropdowns: "text-sm",
                    day: "text-sm",
                    head_cell: "text-sm",
                    cell: "text-sm",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Adding Roles */}
          <div
            className="flex flex-row justify-between items-center mt-6 sm:mt-10"
            id="step-3"
          >
            <Button
              className="hover:cursor-pointer"
              size={isMobile ? "sm" : "lg"}
              onClick={create_new_role}
              disabled={!canEdit}
            >
              Add Role <Plus />
            </Button>
            <div className="flex flex-row justify-between items-center gap-2">
              <Label className="text-sm sm:text-lg font-light">
                Jump to Role:
              </Label>
              <Select
                onValueChange={(id) => {
                  jump_to_role(id);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role ID" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role, index) => (
                    <SelectItem key={index} value={String(role.id)}>
                      {role.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Adding Roles */}
          <Label className="text-2xl">Add Roles:</Label>
          <div id="step-2" className="flex flex-col gap-5">
            {roles.map((role, index) => (
              <RoleInput
                key={`${index}-${refreshKey}`}
                loaded_role={role}
                updateRoles={setRoles}
                roles={roles}
                currentEmpty={Number(currentEmpty)}
                setCurrentEmpty={setCurrentEmpty}
                canEdit={canEdit}
                currentUser={currentUser}
                lookbook_id={String(look_book_id)}
              />
            ))}
          </div>

          {/* Add Roles Button */}
          <div className={`flex items-center justify-center `}>
            <div className="w-1/2">
              <Button
                className="w-full hover:cursor-pointer"
                onClick={create_new_role}
                disabled={!canEdit}
              >
                Add Role
                <Plus />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* How to sheet */}
      <HowToSheet
        open={openHowTo}
        setOpenChange={setOpenHowTo}
        initial="lookbook"
      />
    </div>
  );
};

export default LookBookGenerator;
