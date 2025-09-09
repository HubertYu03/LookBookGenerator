// Importing UI Components
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

// Importing Icons
import { BrushCleaning, MessageSquareText, Trash } from "lucide-react";

// Importing custom components
import CommentSheet from "../Comments/CommentSheet";
import ImagesPreview from "../ImagesPreview";

// Importing dependencies
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useMediaQuery } from "react-responsive";

// Import global types
import type { Img, Location, User } from "@/types/global";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Importing database
import { supabase } from "@/lib/supabaseClient";

type LocationInputProps = {
  loaded_location: Location;
  locations: Location[];
  updateLocations: Dispatch<SetStateAction<Location[]>>;
  currentEmpty: number;
  setCurrentEmpty: Dispatch<SetStateAction<number>>;
  canEdit: boolean;
  currentUser: User | null;
  locationbook_id: string;
};

const LocationInput = ({
  loaded_location,
  locations,
  updateLocations,
  currentEmpty,
  setCurrentEmpty,
  canEdit,
  currentUser,
  locationbook_id,
}: LocationInputProps) => {
  // Checking to see if the viewport is mobile
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // States for inputs
  const [scene, setScene] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<"Day" | "Night" | null>(null);
  const [locationType, setLocationType] = useState<"Indoor" | "Outdoor" | null>(
    null
  );
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationImgs, setLocationImgs] = useState<Img[]>([]);

  // States for comments
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [newlyCreated, setNewlyCreated] = useState<boolean>(true);

  // Helper function to create a random image id for deletion tracking
  function generate_image_id(): number {
    return Math.floor(Math.random() * 9000000) + 1000000;
  }

  // Helper function to remove a role
  function remove_location() {
    // Clear the toasts
    toast.dismiss();

    // Check if the deletion would leave nothing
    if (
      locations.filter((location) => location.id != loaded_location.id)
        .length == 0
    ) {
      toast.warning("You must have at least one location!");
    } else {
      updateLocations(
        locations.filter((location) => location.id != loaded_location.id)
      );
      toast.success(`Role #${loaded_location.id} successfully deleted!`);
    }
  }

  // Helper function to update the roles on the main page
  function update_location() {
    // Create temp role
    const updated_location: Location = {
      id: loaded_location.id,
      scene: scene,
      time_of_day: timeOfDay,
      location_name: locationName,
      location_type: locationType,
      images: locationImgs,
      newly_created: true,
    };

    // Set the state
    updateLocations(
      locations.map((location) =>
        location.id === loaded_location.id ? updated_location : location
      )
    );

    setCurrentEmpty(0);
  }

  // Function to clear all fields
  function clear_fields() {
    setScene(null);
    setTimeOfDay(null);
    setLocationType(null);
    setLocationName(null);
    setLocationImgs([]);
  }

  // Function to set loaded data
  async function load_location_data() {
    // Get location data
    setScene(loaded_location.scene);
    setTimeOfDay(loaded_location.time_of_day);
    setLocationType(loaded_location.location_type);
    setLocationName(loaded_location.location_name);
    setNewlyCreated(loaded_location.newly_created);

    // Loading the images from the database if there are any images
    if (loaded_location.images) {
      const location_imgs = await Promise.all(
        loaded_location.images.map(async (img) => {
          const path: string = img.src;
          const { data: imgData, error } = await supabase.storage
            .from("locationbook")
            .createSignedUrl(path, 1800);

          if (error) {
            console.error(error);
            return null;
          }

          return imgData?.signedUrl
            ? { src: imgData.signedUrl, id: img.id }
            : null;
        })
      );

      // Filter out any nulls
      setLocationImgs(location_imgs.filter((img): img is Img => img !== null));
    }
  }

  // Handle image file selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    multiple: boolean
  ) => {
    if (multiple) {
      const files = e.target.files;

      if (files) {
        // Check the amount of images there are
        if (files.length > 3) {
          toast.warning("You can only upload 3 images!");
          return;
        }

        // Count the existing images and add the new images
        if (files.length + locationImgs.length > 3) {
          toast.warning("You can only upload 3 images!");
          return;
        }

        const fileArray = Array.from(files);

        try {
          for (const file of fileArray) {
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === "string") {
                  const new_img: Img = {
                    src: result,
                    id: generate_image_id(),
                  };
                  setLocationImgs((prev) => [...prev, new_img]);
                }
              };
              reader.readAsDataURL(file);
            }
          }
        } catch (error) {
          console.error("Error processing images:", error);
          alert(
            "Error processing one or more images. Please try different formats."
          );
        }
      }
    }
  };

  // Helper funciton to remove the images
  function remove_image(img_id: number): void {
    // Remove the selected img from their respective list
    setLocationImgs(locationImgs.filter((img) => img.id != img_id));
  }

  useEffect(() => {
    // Get location data if any
    load_location_data();
  }, []);

  // Update the location everytime we make an edit
  useEffect(() => {
    update_location();
  }, [timeOfDay, locationType, locationName, locationImgs, scene]);

  return (
    <>
      <Card
        id={`location-${loaded_location.id}`}
        className={loaded_location.id == currentEmpty ? "border-red-500" : ""}
      >
        <CardContent className="flex flex-col gap-5">
          {/* Header for button on mobile view */}
          {isMobile && (
            <div className="flex flex-row gap-3">
              {!newlyCreated && (
                <Button
                  className="hover:cursor-pointer"
                  onClick={() => setCommentOpen(true)}
                >
                  <MessageSquareText />
                </Button>
              )}

              <Button
                variant="outline"
                className="hover:cursor-pointer"
                onClick={clear_fields}
                disabled={!canEdit}
              >
                <BrushCleaning />
              </Button>
              <Button
                variant="destructive"
                className="hover:cursor-pointer"
                onClick={remove_location}
                disabled={!canEdit}
              >
                <Trash />
              </Button>
            </div>
          )}

          {/* Scene Name Input */}
          <div className="flex flex-row justify-between items-start">
            <div className="grid sm:w-1/3 max-w-sm items-center gap-3">
              <Label>Scene:</Label>
              <Input
                placeholder="Scene"
                value={scene ?? ""}
                onChange={(e) => {
                  setScene(e.target.value);
                }}
                disabled={!canEdit}
              />
            </div>

            {/* Desktop View */}
            {!isMobile && (
              <div className="flex gap-3">
                {!newlyCreated && (
                  <Button
                    className="hover:cursor-pointer"
                    onClick={() => setCommentOpen(true)}
                  >
                    <MessageSquareText />
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="hover:cursor-pointer"
                  onClick={clear_fields}
                  disabled={!canEdit}
                >
                  Clear Fields <BrushCleaning />
                </Button>
                <Button
                  variant="destructive"
                  className="hover:cursor-pointer"
                  onClick={remove_location}
                  disabled={!canEdit}
                >
                  Remove Role <Trash />
                </Button>
              </div>
            )}
          </div>

          {/* Container for select inputs */}
          <div className="flex flex-col sm:flex-row sm:w-1/3 max-w-sm gap-3">
            {/* Day/Night Selection */}
            <div className="grid max-w-sm items-center gap-3">
              <Label>Day/Night:</Label>
              <Select
                value={timeOfDay ?? ""}
                onValueChange={(time) => {
                  setTimeOfDay(time as "Day" | "Night");
                }}
                disabled={!canEdit}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time of Day" />
                </SelectTrigger>
                <SelectContent>
                  {["Day", "Night"].map((time, index) => (
                    <SelectItem key={index} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Type Input */}
            <div className="grid sm:w-1/3 max-w-sm items-center gap-3">
              <Label>Outdoor/Indoor:</Label>
              <Select
                value={locationType ?? ""}
                onValueChange={(type) => {
                  setLocationType(type as "Outdoor" | "Indoor");
                }}
                disabled={!canEdit}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location Type" />
                </SelectTrigger>
                <SelectContent>
                  {["Outdoor", "Indoor"].map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Name Input */}
          <div className="grid sm:w-1/3 max-w-sm items-center gap-3">
            <Label>Location Name:</Label>
            <Input
              value={locationName ?? ""}
              placeholder="Location Name"
              onChange={(e) => {
                setLocationName(e.target.value);
              }}
              disabled={!canEdit}
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid sm:w-1/3 max-w-sm items-center gap-3">
              <Label>Upload Location Images (3 Max)</Label>
              <Input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
                onChange={(e) => {
                  handleImageChange(e, true);
                }}
                disabled={!canEdit}
              />
            </div>
            {locationImgs.length > 0 && (
              <ImagesPreview
                images={locationImgs}
                sizeClasses="h-32 w-56"
                removeImage={remove_image}
                canEdit={canEdit}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="text-gray-500 italic text-sm">
            Location ID: {loaded_location.id}
          </div>
        </CardFooter>
      </Card>

      {/* Comments Sheet Component */}
      <CommentSheet
        open={commentOpen}
        setOpenChange={setCommentOpen}
        currentUser={currentUser}
        section_id={loaded_location.id}
        book_id={locationbook_id}
      />
    </>
  );
};

export default LocationInput;
