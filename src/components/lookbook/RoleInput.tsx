// Individual actor

// Importing dependencies
import {
  useRef,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

// Importing database
import { supabase } from "@/lib/supabaseClient";

// Importing global types
import type { Img, Role, User } from "@/types/global";

// Import UI Components
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { BrushCleaning, CircleX, MessageSquareText, Trash } from "lucide-react";

// Import custom components
import ImagesPreview from "../ImagesPreview";
import CommentSheet from "../Comments/CommentSheet";

type RoleInputProps = {
  loaded_role: Role;
  roles: Role[];
  updateRoles: Dispatch<SetStateAction<Role[]>>;
  currentEmpty: number;
  setCurrentEmpty: Dispatch<SetStateAction<number>>;
  canEdit: boolean;
  currentUser: User | null;
  lookbook_id: string;
};

const RoleInput = ({
  loaded_role,
  roles,
  updateRoles,
  currentEmpty,
  setCurrentEmpty,
  canEdit,
  currentUser,
  lookbook_id,
}: RoleInputProps) => {
  // States for fields
  const [roleName, setRoleName] = useState<string | null>(null);
  const [wardrobeStyle, setWardrobeStyle] = useState<string | null>(null);

  const [colorPalette, setColorPalette] = useState<Img | null>(null);
  const colorPaletteInputRef = useRef<HTMLInputElement | null>(null);

  const [colorPalettePreview, setColorPalettePreview] = useState<Img | null>(
    null
  );

  const [additionalNotes, setAdditionNotes] = useState<string | null>(null);
  const [stylingSuggestions, setStylingSuggestions] = useState<Img[]>([]);
  const [accessories, setAccessories] = useState<Img[]>([]);
  const [newlyCreated, setNewlyCreated] = useState<boolean>(true);

  // State for deleteing the color palette photo
  const [hoverClosePalette, setHoverClosePalette] = useState<boolean>(false);

  // Commenting states
  const [commentOpen, setCommentOpen] = useState<boolean>(false);

  // Helper function to create a random image id for deletion tracking
  function generate_image_id(): number {
    return Math.floor(Math.random() * 9000000) + 1000000;
  }

  // Helper function to remove a role
  function remove_role() {
    // Clear the toasts
    toast.dismiss();

    // Check if the deletion would leave nothing
    if (roles.filter((role) => role.id != loaded_role.id).length == 0) {
      toast.warning("You must have at least one role!");
    } else {
      updateRoles(roles.filter((role) => role.id != loaded_role.id));
      toast.success(`Role #${loaded_role.id} successfully deleted!`);
    }
  }

  // Helper function to update the roles on the main page
  function update_role() {
    // Create temp role
    const updated_role: Role = {
      id: loaded_role.id,
      roleName: roleName,
      wardrobeStyle: wardrobeStyle,
      colorPalette: colorPalette,
      additionalNotes: additionalNotes,
      stylingSuggestions: stylingSuggestions,
      accessories: accessories,
      newly_created: true,
    };

    // Set the state
    updateRoles(
      roles.map((role) => (role.id === loaded_role.id ? updated_role : role))
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
    setColorPalettePreview(null);
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
              const new_img: Img = {
                src: result,
                id: generate_image_id(),
              };
              setColorPalette(new_img);
              setColorPalettePreview(new_img);
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

  // Function to clear all fields
  function clear_fields() {
    console.log(colorPalette);

    setRoleName(null);
    setWardrobeStyle(null);

    // Clear the color palette ref
    setColorPalette(null);
    setColorPalettePreview(null);
    if (colorPaletteInputRef.current) {
      colorPaletteInputRef.current.value = "";
    }

    setAdditionNotes(null);
    setStylingSuggestions([]);
    setAccessories([]);
  }

  // Function to load all existing data (if any)
  async function load_role_data() {
    // Load role name, wardrobe style, and additional notes
    setRoleName(loaded_role.roleName);
    setWardrobeStyle(loaded_role.wardrobeStyle);
    setAdditionNotes(loaded_role.additionalNotes);
    setNewlyCreated(loaded_role.newly_created);

    // Load color palette images if it exists
    if (loaded_role.colorPalette) {
      // If the image exists, get the img url

      const path: string = loaded_role.colorPalette.src;
      const { data: imgData, error } = await supabase.storage
        .from("lookbook")
        .createSignedUrl(path, 1800);

      if (error) {
        console.log(error);
      }

      // Set the image preview and color palette to the url or path and the id
      if (imgData?.signedUrl) {
        setColorPalettePreview({
          src: imgData.signedUrl,
          id: loaded_role.colorPalette.id,
        });

        setColorPalette({
          src: path,
          id: loaded_role.colorPalette.id,
        });
      }
    }

    // Load the styling images if they exist
    if (loaded_role.stylingSuggestions.length > 0) {
      const styling_imgs = await Promise.all(
        loaded_role.stylingSuggestions.map(async (img) => {
          const path: string = img.src;
          const { data: imgData, error } = await supabase.storage
            .from("lookbook")
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
      setStylingSuggestions(
        styling_imgs.filter((img): img is Img => img !== null)
      );
    }

    // Load the accesssory images if they exist
    if (loaded_role.accessories.length > 0) {
      const accessory_imgs = await Promise.all(
        loaded_role.accessories.map(async (img) => {
          const path: string = img.src;
          const { data: imgData, error } = await supabase.storage
            .from("lookbook")
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
      setAccessories(accessory_imgs.filter((img): img is Img => img !== null));
    }
  }

  useEffect(() => {
    // Load any data if any
    load_role_data();
  }, []);

  return (
    <>
      <Card
        className={currentEmpty == loaded_role.id ? "border-red-500" : ""}
        id={`role-${loaded_role.id}`}
      >
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-row justify-between items-start">
            <div className="grid w-1/3 max-w-sm items-center gap-3">
              <Label>
                Role Name
                <span className={roleName ? "invisible" : "text-red-500"}>
                  *
                </span>
              </Label>
              <Input
                placeholder="Role Name"
                onChange={(e) => setRoleName(e.target.value)}
                value={roleName ?? ""}
                disabled={!canEdit}
              />
            </div>
            <div className="flex gap-3">
              {!newlyCreated && (
                <Button
                  className="hover:cursor-pointer"
                  onClick={() => setCommentOpen(true)}
                >
                  Comments <MessageSquareText />
                </Button>
              )}

              <Button
                variant="outline"
                className="hover:cursor-pointer"
                onClick={clear_fields}
                disabled={!canEdit}
              >
                Clear Fields
                <BrushCleaning />
              </Button>
              <Button
                variant="destructive"
                className="hover:cursor-pointer"
                onClick={remove_role}
                disabled={!canEdit}
              >
                Remove Role
                <Trash />
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
                disabled={!canEdit}
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
                disabled={!canEdit}
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
                disabled={!canEdit}
              />
            </div>
            {colorPalettePreview && (
              <div
                className="relative"
                onMouseEnter={() => setHoverClosePalette(true)}
                onMouseLeave={() => setHoverClosePalette(false)}
              >
                {hoverClosePalette && canEdit && (
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
                  src={colorPalettePreview.src}
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
                    stylingSuggestions.length != 0
                      ? "invisible"
                      : "text-red-500"
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
                disabled={!canEdit}
              />
            </div>
            {stylingSuggestions.length > 0 && (
              <ImagesPreview
                images={stylingSuggestions}
                sizeClasses="w-36 h-48"
                removeImage={remove_image}
                canEdit={canEdit}
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
              disabled={!canEdit}
            />
          </div>
          {accessories.length != 0 && (
            <ImagesPreview
              images={accessories}
              sizeClasses="w-32 h-32"
              removeImage={remove_image}
              canEdit={canEdit}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="text-gray-500 italic text-sm">
            Role ID: {loaded_role.id}
          </div>
        </CardFooter>
      </Card>

      {/* Comment Sheet Component */}
      <CommentSheet
        open={commentOpen}
        setOpenChange={setCommentOpen}
        currentUser={currentUser}
        section_id={loaded_role.id}
        book_id={lookbook_id}
      />
    </>
  );
};

export default RoleInput;
