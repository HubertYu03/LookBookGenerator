// Individual actor

// Importing dependencies
import { Label } from "@radix-ui/react-label";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Input } from "./ui/input";

// Importing global types
import type { Role } from "@/types/global";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type RoleInputProps = {
  id: number;
  roles: Role[];
  updateRoles: Dispatch<SetStateAction<Role[]>>;
};

const RoleInput = ({ id, roles, updateRoles }: RoleInputProps) => {
  // States for fields
  const [roleName, setRoleName] = useState<string | null>(null);
  const [wardrobeStyle, setWardrobeStyle] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<string | null>(null);
  const [additionalNotes, setAdditionNotes] = useState<string | null>(null);
  const [stylingSuggestions, setStylingSuggestions] = useState<string[]>([]);
  const [accessories, setAccessories] = useState<string[]>([]);

  // Helper function to remove a role
  function remove_role() {
    updateRoles(roles.filter((role) => role.id != id));
  }

  // Helper function to update the roles on the main page
  function update_role() {
    // Create temp role
    const updated_role: Role = {
      id: id,
      roleName: roleName,
      wardrobeStyle: wardrobeStyle,
      colorPalette: colorPalette,
      additionalNotes: additionalNotes,
      stylingSuggestions: stylingSuggestions,
      accessories: accessories,
    };

    // Set the state
    updateRoles(roles.map((role) => (role.id === id ? updated_role : role)));
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
                  if (field == "styling") {
                    setStylingSuggestions((prev) => [...prev, result]);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Role #{id}</CardTitle>
        <CardAction>
          <Button
            variant="destructive"
            className="hover:cursor-pointer"
            onClick={remove_role}
          >
            Remove Role
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid w-1/3 max-w-sm items-center gap-3">
          <Label>
            Role Name
            <span className={roleName ? "invisible" : "text-red-500"}>*</span>
          </Label>
          <Input
            placeholder="Role Name"
            onChange={(e) => setRoleName(e.target.value)}
          />
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
            />
          </div>

          {/* Addtional Comments Input */}
          <div className="grid w-1/3 max-w-sm items-center gap-3">
            <Label>
              Addition Notes
              <span className={additionalNotes ? "invisible" : "text-red-500"}>
                *
              </span>
            </Label>
            <Textarea
              className="h-32 resize-none"
              placeholder="Add Additional Comments..."
              onChange={(e) => setAdditionNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Color Palette Input */}
        <div className="flex flex-col gap-5">
          <div className="grid w-1/3 max-w-sm items-center gap-3">
            <Label>
              Upload Color Palette
              <span className={colorPalette ? "invisible" : "text-red-500"}>
                *
              </span>
            </Label>
            <Input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
              onChange={(e) => {
                handleImageChange(e, "colorPalette", false);
              }}
            />
          </div>
          {colorPalette && (
            <img
              src={colorPalette}
              alt="color_palette"
              className="h-40 object-cover"
            />
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
            <div className="flex flex-wrap gap-4">
              {stylingSuggestions.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Styling Suggestion ${i + 1}`}
                  className="h-32 w-32 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleInput;
