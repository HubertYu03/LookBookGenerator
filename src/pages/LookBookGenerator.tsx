import { pdf } from "@react-pdf/renderer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LookBook from "@/pdf/LookBook";
import RoleInput from "@/components/RoleInput";
import type { Role } from "@/types/global";

const LookBookGenerator = () => {
  const [text, setText] = useState<string>("Default");
  const [two, setTwo] = useState<string>("Default 2");
  const [imageData, setImageData] = useState<string | null>(null);

  const [projectName, setProjectName] = useState<string | null>(null);

  // Create an initial role
  let inital_role: Role = {
    id: randomFiveDigit(),
    roleName: null,
    wardrobeStyle: null,
    colorPalette: null,
    additionalNotes: null,
    stylingSuggestions: [],
    accessories: [],
  };
  const [roles, setRoles] = useState<Role[]>([inital_role]);

  const openPDFInNewTab = async () => {
    const blob = await pdf(
      <LookBook
        section_one={text}
        section_two={two}
        image={imageData as string}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Helper function to create a random role id for state tracking
  function randomFiveDigit(): number {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  // Helper function to create a new empty role
  function create_new_role() {
    let new_role: Role = {
      id: randomFiveDigit(),
      roleName: null,
      wardrobeStyle: null,
      colorPalette: null,
      additionalNotes: null,
      stylingSuggestions: [],
      accessories: [],
    };

    setRoles((roles) => [...roles, new_role]);
  }

  // Helper function to generate the look book
  function generate_look_book() {
    console.log(roles);
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-row justify-between">
        <div className="text-4xl font-semibold">Create New LookBook</div>
        <Button
          className="bg-green-500 hover:bg-green-600 hover:cursor-pointer"
          onClick={generate_look_book}
        >
          Generate LookBook
        </Button>
      </div>
      <div className="grid w-full items-center gap-3">
        <Label className="text-2xl">Enter Project Name</Label>
        <Input
          className="w-1/3"
          placeholder="Enter Project Name..."
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      {/* Adding Roles */}
      <Label className="text-2xl mt-10">Add Roles:</Label>
      {roles.map((role, index) => (
        <RoleInput
          key={index}
          id={role.id}
          updateRoles={setRoles}
          roles={roles}
        />
      ))}
      <div className="flex items-center justify-center">
        <Button
          className="w-1/2 hover:cursor-pointer"
          onClick={create_new_role}
        >
          Add Role
        </Button>
      </div>
    </div>
  );
};

export default LookBookGenerator;
