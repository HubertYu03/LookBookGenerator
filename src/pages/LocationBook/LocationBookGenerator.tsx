// Importing UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

// Importing Icons
import {
  ChevronDownIcon,
  ChevronUp,
  CircleQuestionMark,
  Ellipsis,
  FileText,
  Info,
  Plus,
  Save,
} from "lucide-react";

// Importing dependencies
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { pdf } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import _ from "lodash";

// Importing global types
import type { User, Location } from "@/types/global";
import {
  dataURLtoFile,
  deleteAllFilesInBucket,
  list_all_files,
} from "@/lib/utils";

// Importing custom components
import LocationInput from "@/components/locationbook/LocationInput";
import LocationBook from "@/pdf/LocationBook";
import LookBookMenuButton from "@/components/lookbook/LookBookMenuButton";
import AuthorCard from "@/components/AuthorCard";
import HowToSheet from "@/components/Documentation/HowToSheet";
import MobileShare from "@/components/Mobile/MobileShare";
import MobileDelete from "@/components/Mobile/MobileDelete";

// Importing supabase
import { supabase } from "@/lib/supabaseClient";

const LocationBookGenerator = () => {
  // Check to see the size of the viewport and what device it is
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Get the location book ID
  const { location_book_id } = useParams();

  // General Information
  const [loading, setLoading] = useState<boolean>(true);
  const [exists, setExists] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [projectName, setProjectName] = useState<string | null>(null);
  const [crewName, setCrewName] = useState<string | null>(null);
  const [directorName, setDirectorName] = useState<string | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // State for error
  const [currentError, setCurrentError] = useState<string>("");
  const [currentEmpty, setCurrentEmpty] = useState<number>(0);

  // State for editing
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [authorData, setAuthorData] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Set initial locations
  const initial_location: Location = {
    id: randomFiveDigit(),
    scene: null,
    time_of_day: null,
    location_type: null,
    location_name: null,
    images: [],
    newly_created: true,
  };

  const [locations, setLocations] = useState<Location[]>([initial_location]);

  // State for opening the how to page
  const [openHowTo, setOpenHowTo] = useState<boolean>(false);

  // Helper function to create a random role id for state tracking
  function randomFiveDigit(): number {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  // Function to generate the location book
  function generate_location_book() {
    openPDFInNewTab();
  }

  // Helper function to jump to selected role id
  function jump_to_location(id: string) {
    // Get the target we want to jump to
    const target = document.getElementById(`location-${id}`);

    // Scroll to target
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Helper function to create a new empty role
  function create_new_location() {
    // Clear toasts
    toast.dismiss();

    // Create a new location id
    const new_id: number = randomFiveDigit();

    // Create a new location
    const new_location: Location = {
      id: new_id,
      scene: null,
      time_of_day: null,
      location_type: null,
      location_name: null,
      images: [],
      newly_created: true,
    };

    setLocations((locations) => [...locations, new_location]);

    setTimeout(() => {
      jump_to_location(String(new_id));
    }, 0);

    toast.success(`Locations #${new_id} successfully created!`);
  }

  // Helper functions for saving the images
  async function uploadImage(file: File, path: string) {
    const { error } = await supabase.storage
      .from("locationbook")
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

  // Function to open the generated pdf
  const openPDFInNewTab = async () => {
    // Set loading toast
    toast.info("Generating Lookbook...", {
      id: "loading-message",
    });

    // We need to convert all our images into a temporary roles img links
    let pdf_locations_chunks: Location[][] = _.chunk(locations, 3);

    const blob = await pdf(
      <LocationBook
        project_name={String(projectName)}
        crew_name={String(crewName)}
        director_name={String(directorName)}
        date={String(date?.toLocaleDateString())}
        locations={pdf_locations_chunks}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // Clear the loading search
    toast.dismiss("loading-message");
  };

  // Function to fetch the author data id needed
  // Helper function to get the current user (if any)
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

  // Function to load lookbook data
  async function get_location_book_data() {
    // Get the location book data
    const { data } = await supabase
      .from("locationbook")
      .select("*")
      .eq("locationbook_id", location_book_id);

    console.log(data);

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
      setDirectorName(data[0].director);

      // Check the date
      const parsedDate = data[0].date ? new Date(data[0].date) : undefined;
      setDate(parsedDate);

      setLocations(data[0].locations);

      setExists(true);
    }

    // Set the loading to false
    setLoading(false);
  }

  // Function that saves the current location book
  async function save_progress() {
    // Clear all toasts and errors
    toast.dismiss();

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

    // The location data that needs to be saved
    let location_book_data = {
      locationbook_id: location_book_id,
      author_id: localStorage.getItem("PlayletUserID"),
      last_edited: new Date(),
      project_name: projectName,
      crew_name: crewName,
      director: directorName,
      date: date,
      locations: locations,
    };

    // First check if the location book already exists
    const { data } = await supabase
      .from("locationbook")
      .select("*")
      .eq("locationbook_id", location_book_id);

    // If the location book exists, save it
    // If a location was deleted, delete all the fiels associated with that folder
    if (data?.length != 0) {
      if (data && data[0].locations.length > locations.length) {
        console.log("There are roles to delete");

        const saved_locations: Location[] = data[0].locations;
        const current_locations: Location[] = locations;

        // Extract IDs from current roles
        const current_location_ids = current_locations.map((r) => r.id);

        // Get roles that are in savedRoles but not in currentRoles
        const locations_to_delete = saved_locations.filter(
          (saved_location) => !current_location_ids.includes(saved_location.id)
        );

        // Delete all the files in the unused roles
        locations_to_delete.map(async (location) => {
          // Delete the location images
          await deleteAllFilesInBucket(
            "locationbook",
            `private/${location_book_id}/locations/${location.id}`
          );

          // Delete all the comments associate with this location
          const { error } = await supabase
            .from("comments")
            .delete()
            .eq("book_id", location_book_id)
            .eq("section_id", location.id);

          if (error) {
            console.log(error);
            return;
          }
        });
      }
    }

    // We need to process all the locations
    await Promise.all(
      locations.map(async (location, index) => {
        // Check if there are locations to be processed
        if (location.images.length > 0) {
          console.log("There are location images to be saved");

          // Loop through the image and process each one
          await Promise.all(
            location.images.map(async (img, i) => {
              const path_name: string = `private/${location_book_id}/locations/${location.id}/${img.id}.jpg`;
              if (img.src.startsWith("data:image")) {
                // Convert the data url into a file and upload to supabase
                const converted_file: File = dataURLtoFile(
                  img.src,
                  `${img.id}.jpg`
                );

                await uploadImage(converted_file, path_name);

                location.images[i] = {
                  src: path_name,
                  id: img.id,
                };
              } else {
                location.images[i] = {
                  src: path_name,
                  id: img.id,
                };
              }
            })
          );
        } else {
          // If the list is empty, that means there are no images selected.
          // Delete all the images in the bucket
          await deleteAllFilesInBucket(
            "locationbook",
            `private/${location_book_id}/locations/${location.id}`
          );
        }

        // Delete files that are not part of the list
        if (location.images.length > 0) {
          // After processing the images, check to see which images
          // need to be deleted from the database if there are extra

          // Get all the currently saved paths
          let saved_img_list: string[] = [];
          location.images.forEach((img) => {
            saved_img_list.push(img.src);
          });

          // Get a list of the current images and the images in the storage
          let storage_list = await list_all_files(
            "locationbook",
            `private/${location_book_id}/locations/${location.id}`
          );

          // // convert the storage list in a list string
          let file_img_list: string[] = [];
          storage_list.forEach((filename) => {
            file_img_list.push(
              `private/${location_book_id}/locations/${location.id}/${filename}`
            );
          });

          if (file_img_list.length != 0 || saved_img_list.length != 0) {
            // // Get the non matching img names
            let nonMatching: string[] = [
              ...saved_img_list.filter((item) => !file_img_list.includes(item)),
              ...file_img_list.filter((item) => !saved_img_list.includes(item)),
            ];

            // If there are non matching files, delete them from the database
            if (nonMatching.length > 0) {
              // Delete the files from the storage
              const { error } = await supabase.storage
                .from("locationbook")
                .remove(nonMatching);
              if (error) {
                console.log(error);
              }
            }
          }
        }

        // Set the newly created locations to false
        location_book_data.locations[index].newly_created = false;
      })
    );

    const { error } = await supabase
      .from("locationbook")
      .upsert(location_book_data)
      .eq("locationbook_id", location_book_id)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    // Display success message and refetch data
    toast.dismiss("loading-toast");
    toast.success("Saved Lookbook!");
    get_location_book_data();

    // Refresh the inputs
    setRefreshKey((prev) => prev + 1);
  }

  useEffect(() => {
    // Clear all the toasts
    toast.dismiss();

    // Get the location book data
    get_location_book_data();

    // Get the current user
    get_user(String(localStorage.getItem("PlayletUserID")), setCurrentUser);
  }, []);

  return (
    <div className="p-6 space-y-4" id="top-of-page">
      {/* Back to top button */}
      <div className="fixed bottom-1 right-5 z-50">
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

      {/* Top of the page */}

      {/* Desktop View */}
      {!isMobile && (
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-row items-center gap-3">
            <div className="text-5xl font-semibold">Location Book Editor</div>
          </div>

          {/* Top of the page buttons */}
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
                onClick={generate_location_book}
                disabled={loading || !canEdit}
              >
                Generate Location Book
                <FileText />
              </Button>

              <LookBookMenuButton
                book_type="Location Book"
                bucket="locationbook"
                column_name="locations"
                id={location_book_id ?? ""}
                id_column_name="locationbook_id"
                table_name="locationbook"
                path="/mylocationbooks"
                disabled={loading || !canEdit}
                exists={exists}
              />
            </div>
          ) : (
            <div className="absolute right-6 flex flex-row gap-4">
              <Button
                className="bg-green-500 hover:bg-green-600 hover:cursor-pointer"
                onClick={generate_location_book}
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
          <div className="text-3xl font-semibold">Location Book Editor</div>

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
                  <SheetTitle className="text-xl">
                    Location Book Actions
                  </SheetTitle>
                  <SheetDescription>
                    Location Book editing actions that allows you to save,
                    share, and see your work.
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
                    onClick={generate_location_book}
                  >
                    <FileText />
                    <div>Generate Location Book</div>
                  </div>

                  {/* Share Lookbook Button */}
                  <MobileShare exists={exists} />

                  {/* Delete Lookbook Button */}
                  <MobileDelete
                    book_type="Location Book"
                    bucket="locationbook"
                    column_name="locations"
                    id={location_book_id ?? ""}
                    id_column_name="locationbook_id"
                    table_name="locationbook"
                    path="/mylocationbooks"
                    exists={exists}
                  />
                </div>
                <SheetFooter className="flex flex-row text-justify items-center">
                  <Info size={100} color="gray" />
                  <div className="text-xs text-gray-500">
                    On mobile devices: To generate the Location Book tap on the{" "}
                    <b>Generate Location Book</b> button once and wait for the
                    generation to finish. Then press on the button a second time
                    to view the Location Book.
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* Field inputs */}

      {loading ? (
        <div className="flex justify-center items-center min-h-screen pb-32 text-2xl">
          Loading Lookbook...
        </div>
      ) : (
        <>
          {/* Project name inputs */}
          <div className="flex flex-col items-start gap-3">
            <Label className="text-xl sm:text-2xl">Enter Project Name</Label>
            <Input
              className={`sm:w-1/3 text-sm sm:text-xl ${
                currentError == "project_name" ? "border-red-500" : ""
              }`}
              placeholder="Enter Project Name..."
              value={projectName ?? ""}
              onChange={(e) => {
                setProjectName(e.target.value);
              }}
              disabled={!canEdit}
            />
          </div>

          {/* Crew Name Input */}
          <div className="grid w-full items-center gap-3">
            <Label className="text-xl sm:text-2xl">Enter Crew Name</Label>
            <Input
              className={`sm:w-1/3 text-sm sm:text-xl`}
              placeholder="Enter Crew Name..."
              onChange={(e) => {
                setCrewName(e.target.value);
              }}
              value={crewName ?? ""}
              disabled={!canEdit}
            />
          </div>

          {/* Director Name Input */}
          <div className="grid w-full items-center gap-3">
            <Label className="text-xl sm:text-2xl">Enter Director Name</Label>
            <Input
              className={`sm:w-1/3 text-sm sm:text-xl`}
              placeholder="Enter Director Name..."
              onChange={(e) => {
                setDirectorName(e.target.value);
              }}
              value={directorName ?? ""}
              disabled={!canEdit}
            />
          </div>

          {/* Date Input */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="text-xl sm:text-2xl">
              Project Date
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
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

          {/* Adding roles */}
          <div className="flex flex-row justify-between items-center mt-6 sm:mt-10">
            {/* Button to add new role */}
            <Button
              className="hover:cursor-pointer"
              size={isMobile ? "sm" : "lg"}
              onClick={create_new_location}
              disabled={!canEdit}
            >
              Add Location <Plus />
            </Button>

            {/* Select trigger to jump to the different locations */}
            <div className="flex flex-row justify-between items-center gap-2">
              <Label className="text-sm sm:text-lg font-light">Jump to:</Label>
              <Select
                onValueChange={(id) => {
                  jump_to_location(id);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Location ID" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={String(location.id)}>
                      {location.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Adding Locations */}
          <Label className="text-2xl">Add Locations:</Label>
          <div id="step-2" className="flex flex-col gap-5">
            {locations.map((location, index) => (
              <LocationInput
                key={`${index}-${refreshKey}`}
                canEdit={canEdit}
                loaded_location={location}
                locations={locations}
                updateLocations={setLocations}
                currentEmpty={currentEmpty}
                setCurrentEmpty={setCurrentEmpty}
                currentUser={currentUser}
                locationbook_id={String(location_book_id)}
              />
            ))}
          </div>

          {/* Add Roles Button */}
          <div className="flex items-center justify-center">
            <div className="w-1/2">
              <Button
                className="w-full hover:cursor-pointer"
                onClick={create_new_location}
                disabled={!canEdit}
              >
                Add Location
                <Plus />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* How To Sheet */}
      <HowToSheet
        open={openHowTo}
        setOpenChange={setOpenHowTo}
        initial="locationbook"
      />
    </div>
  );
};

export default LocationBookGenerator;
