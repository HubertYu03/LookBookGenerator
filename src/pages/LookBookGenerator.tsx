// Import dependencies
import { pdf } from "@react-pdf/renderer";
import { useState } from "react";

// Import UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Importing Icons
import { ChevronUp, Plus, FileText } from "lucide-react";

// Import Custom Components
import LookBook from "@/pdf/LookBook";
import RoleInput from "@/components/RoleInput";

// Import Global Types
import type { Role } from "@/types/global";

const LookBookGenerator = () => {
  // General Information
  const [projectName, setProjectName] = useState<string | null>(null);
  const [crewName, setCrewName] = useState<string | null>(null);
  const [directorName, setDirectorName] = useState<string | null>(null);
  const [currentError, setCurrentError] = useState<string>("");

  const [currentEmpty, setCurrentEmpty] = useState<number>(0);

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
    };

    setRoles((roles) => [...roles, new_role]);

    toast.success(`Role #${new_id} successfully created!`);
  }

  // Helper function to jump to a selected field
  //   function jump_to_field(id: string) {
  //     // Get the target we want to jump to
  //     const target = document.getElementById(id);

  //     // Scroll to target
  //     if (target) {
  //       target.scrollIntoView({ behavior: "smooth" });
  //     }
  //   }

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

    // Check for empty roles, then jump to the first empty one
    for (let role of roles) {
      if (
        role.roleName == null ||
        role.roleName == "" ||
        role.additionalNotes == null ||
        role.additionalNotes == "" ||
        role.wardrobeStyle == null ||
        role.wardrobeStyle == "" ||
        role.stylingSuggestions.length == 0 ||
        role.accessories.length == 0
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
    const blob = await pdf(
      <LookBook
        project_name={String(projectName)}
        crew_name={String(crewName)}
        director_name={String(directorName)}
        roles={roles}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 space-y-4" id="top-of-page">
      {/* Back to top button */}
      <Button
        className="fixed bottom-1 right-5 hover:cursor-pointer"
        size="lg"
        onClick={() => {
          // Jump to the top of the page
          const target: HTMLElement | null =
            document.getElementById(`top-of-page`);
          target?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Back to Top
        <ChevronUp />
      </Button>

      <div className="flex flex-row justify-between">
        <div className="text-5xl font-semibold">Create New Lookbook</div>
        <Button
          className="bg-green-500 hover:bg-green-600 hover:cursor-pointer"
          onClick={generate_look_book}
        >
          Generate Lookbook
          <FileText />
        </Button>
      </div>

      {/* Project Name input */}
      <div className="grid w-full items-center gap-3">
        <Label className="text-2xl">
          Enter Project Name
          <span className={projectName ? "invisible" : "text-red-500"}>*</span>
        </Label>
        <Input
          className={`w-1/3 ${
            currentError == "project_name" ? "border-red-500" : ""
          }`}
          placeholder="Enter Project Name..."
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      {/* Crew Name Input */}
      <div className="grid w-full items-center gap-3">
        <Label className="text-2xl">
          Enter Crew Name
          <span className={crewName ? "invisible" : "text-red-500"}>*</span>
        </Label>
        <Input
          className={`w-1/3 ${
            currentError == "crew_name" ? "border-red-500" : ""
          }`}
          placeholder="Enter Crew Name..."
          onChange={(e) => setCrewName(e.target.value)}
        />
      </div>

      {/* Director Name Input */}
      <div className="grid w-full items-center gap-3">
        <Label className="text-2xl">
          Enter Director Name
          <span className={crewName ? "invisible" : "text-red-500"}>*</span>
        </Label>
        <Input
          className={`w-1/3 ${
            currentError == "director_name" ? "border-red-500" : ""
          }`}
          placeholder="Enter Director Name..."
          onChange={(e) => setDirectorName(e.target.value)}
        />
      </div>

      {/* Adding Roles */}
      <div className="flex flex-row justify-between items-center mt-10">
        <Label className="text-2xl">Add Roles:</Label>
        <div className="flex flex-row justify-between items-center gap-2">
          <Label className="text-lg font-light">Jump to Role:</Label>
          <Select
            onValueChange={(id) => {
              jump_to_role(id);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role ID" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {roles.map((role, index) => (
        <RoleInput
          key={index}
          role_id={role.id}
          updateRoles={setRoles}
          roles={roles}
          currentEmpty={Number(currentEmpty)}
          setCurrentEmpty={setCurrentEmpty}
        />
      ))}
      <div className="flex items-center justify-center">
        <Button
          className="w-1/2 hover:cursor-pointer"
          onClick={create_new_role}
        >
          Add Role
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default LookBookGenerator;
