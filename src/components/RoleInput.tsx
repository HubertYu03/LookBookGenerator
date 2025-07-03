// Individual actor

// Importing dependencies
import {
  useRef,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
// import { supabase } from "@/lib/supabaseClient";

// Importing global types
import type { Img, Role } from "@/types/global";

// Import UI Components
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

// Import custom components
import ImagesPreview from "./ImagesPreview";

type RoleInputProps = {
  role_id: number;
  roles: Role[];
  updateRoles: Dispatch<SetStateAction<Role[]>>;
  currentEmpty: number;
  setCurrentEmpty: Dispatch<SetStateAction<number>>;
};

const RoleInput = ({
  role_id,
  roles,
  updateRoles,
  currentEmpty,
  setCurrentEmpty,
}: RoleInputProps) => {
  // States for fields
  const [roleName, setRoleName] = useState<string | null>(null);
  const [wardrobeStyle, setWardrobeStyle] = useState<string | null>(null);

  const [colorPalette, setColorPalette] = useState<string | null>(null);
  const colorPaletteInputRef = useRef<HTMLInputElement | null>(null);

  const [additionalNotes, setAdditionNotes] = useState<string | null>(null);
  const [stylingSuggestions, setStylingSuggestions] = useState<Img[]>([]);
  const [accessories, setAccessories] = useState<Img[]>([]);

  // State for deleteing the color palette photo
  const [hoverClosePalette, setHoverClosePalette] = useState<boolean>(false);

  // Helper function to create a random image id for deletion tracking
  function generate_image_id(): number {
    return Math.floor(Math.random() * 9000000) + 1000000;
  }

  // Helper function to remove a role
  function remove_role() {
    // Clear the toasts
    toast.dismiss();

    // Check if the deletion would leave nothing
    if (roles.filter((role) => role.id != role_id).length == 0) {
      toast.warning("You must have at least one role!");
    } else {
      updateRoles(roles.filter((role) => role.id != role_id));
      toast.success(`Role #${role_id} successfully deleted!`);
    }
  }

  // Helper function to update the roles on the main page
  function update_role() {
    // Create temp role
    const updated_role: Role = {
      id: role_id,
      roleName: roleName,
      wardrobeStyle: wardrobeStyle,
      colorPalette: colorPalette,
      additionalNotes: additionalNotes,
      stylingSuggestions: stylingSuggestions,
      accessories: accessories,
    };

    // Set the state
    updateRoles(
      roles.map((role) => (role.id === role_id ? updated_role : role))
    );

    setCurrentEmpty(0);
  }

  // Helper function to handle image removal
  function remove_image(imgID: number) {
    // Remove the selected img from their respective list
    setStylingSuggestions(
      stylingSuggestions.filter((image) => image.id != imgID)
    );
    setAccessories(accessories.filter((image) => image.id != imgID));
  }

  // Helper function to remove the seleced color palette photos
  function remove_color_palette() {
    setColorPalette(null);
    if (colorPaletteInputRef.current) {
      colorPaletteInputRef.current.value = "";
    }
  }

  // Handle image file selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    multiple: boolean
  ) => {
    if (multiple) {
      const files = e.target.files;

      if (files) {
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
                  if (field == "styling") {
                    setStylingSuggestions((prev) => [...prev, new_img]);
                  } else if (field == "accessories") {
                    setAccessories((prev) => [...prev, new_img]);
                  }
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
    } else {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === "string") {
            if (field == "colorPalette") {
              setColorPalette(result);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Update the role everytime we make an edit
  useEffect(() => {
    update_role();
  }, [
    roleName,
    wardrobeStyle,
    colorPalette,
    additionalNotes,
    stylingSuggestions,
    accessories,
  ]);

  function clear_fields() {
    setRoleName(null);
    setWardrobeStyle(null);

    // Clear the color palette ref
    setColorPalette(null);
    if (colorPaletteInputRef.current) {
      colorPaletteInputRef.current.value = "";
    }

    setAdditionNotes(null);
    setStylingSuggestions([]);
    setAccessories([]);
  }

  return (
    <Card
      className={currentEmpty == role_id ? "border-red-500" : ""}
      id={`role-${role_id}`}
    >
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-row justify-between items-start">
          <div className="grid w-1/3 max-w-sm items-center gap-3">
            <Label>
              Role Name
              <span className={roleName ? "invisible" : "text-red-500"}>*</span>
            </Label>
            <Input
              placeholder="Role Name"
              onChange={(e) => setRoleName(e.target.value)}
              value={roleName ? String(roleName) : ""}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={clear_fields}
            >
              Clear Fields
            </Button>
            <Button
              variant="destructive"
              className="hover:cursor-pointer"
              onClick={remove_role}
            >
              Remove Role
            </Button>
          </div>
        </div>

        {/* Text Area Inputs */}
        <div className="flex flex-wrap gap-12">
          {/* Wardrobe style input */}
          <div className="grid w-1/3 max-w-sm items-center gap-3">
            <Label>
              Wardrobe Style
              <span className={wardrobeStyle ? "invisible" : "text-red-500"}>
                *
              </span>
            </Label>
            <Textarea
              className="h-32 resize-none"
              placeholder="Enter Wardrobe Style..."
              onChange={(e) => setWardrobeStyle(e.target.value)}
              value={wardrobeStyle ? String(wardrobeStyle) : ""}
            />
          </div>

          {/* Addtional Comments Input */}
          <div className="grid w-1/3 max-w-sm items-center gap-3">
            <Label>Addition Notes {"(optional)"}</Label>
            <Textarea
              className="h-32 resize-none"
              placeholder="Add Additional Comments..."
              onChange={(e) => setAdditionNotes(e.target.value)}
              value={additionalNotes ? String(additionalNotes) : ""}
            />
          </div>
        </div>

        {/* Color Palette Input */}
        <div className="flex flex-col gap-5">
          <div className="grid w-1/3 max-w-sm items-center gap-3">
            <Label>Upload Color Palette {"(optional)"}</Label>
            <Input
              ref={colorPaletteInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
              onChange={(e) => {
                handleImageChange(e, "colorPalette", false);
              }}
            />
          </div>
          {colorPalette && (
            <div
              className="relative"
              onMouseEnter={() => setHoverClosePalette(true)}
              onMouseLeave={() => setHoverClosePalette(false)}
            >
              {hoverClosePalette && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 left-1 hover:cursor-pointer"
                  onClick={remove_color_palette}
                >
                  <CircleX />
                </Button>
              )}
              <img
                src={colorPalette}
                alt="color_palette"
                className="h-28 object-cover w-1/2"
              />
            </div>
          )}
        </div>

        {/* Styling Suggestions Picker */}
        <div className="flex flex-col gap-5">
          <div className="grid w-1/3 max-w-sm items-center gap-3">
            <Label>
              Upload Styling Suggestions
              <span
                className={
                  stylingSuggestions.length != 0 ? "invisible" : "text-red-500"
                }
              >
                *
              </span>
            </Label>
            <Input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
              onChange={(e) => {
                handleImageChange(e, "styling", true);
              }}
            />
          </div>
          {stylingSuggestions.length > 0 && (
            <ImagesPreview
              images={stylingSuggestions}
              sizeClasses="w-36 h-48"
              removeImage={remove_image}
            />
          )}
        </div>

        <div className="grid w-1/3 max-w-sm items-center gap-3">
          <Label>Upload Accessories {"(optional)"}</Label>
          <Input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
            onChange={(e) => {
              handleImageChange(e, "accessories", true);
            }}
          />
        </div>
        {accessories.length != 0 && (
          <ImagesPreview
            images={accessories}
            sizeClasses="w-32 h-32"
            removeImage={remove_image}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="text-gray-500 italic text-sm">Role ID: {role_id}</div>
      </CardFooter>
    </Card>
  );
};

export default RoleInput;
