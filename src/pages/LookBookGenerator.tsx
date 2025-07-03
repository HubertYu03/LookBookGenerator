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
import { Card } from "@/components/ui/card";
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
  ArrowLeft,
  ArrowRight,
  ChevronDownIcon,
} from "lucide-react";
import logo from "../../public/PlayletLogo.png";

// Import Custom Components
import LookBook from "@/pdf/LookBook";
import RoleInput from "@/components/RoleInput";

// Import Global Types
import type { Role } from "@/types/global";
import { DemoContent } from "@/assets/DemoContent";

const LookBookGenerator = () => {
  // General Information
  const [projectName, setProjectName] = useState<string | null>(null);
  const [crewName, setCrewName] = useState<string | null>(null);
  const [directorName, setDirectorName] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentError, setCurrentError] = useState<string>("");

  const [currentEmpty, setCurrentEmpty] = useState<number>(0);

  // Demo states
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(0);

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

    setTimeout(() => {
      jump_to_role(String(new_id));
    }, 0);

    toast.success(`Role #${new_id} successfully created!`);
  }

  // Helper function to jump to a selected field
  function jump_to_field(id: string) {
    // Get the target we want to jump to
    const target = document.getElementById(id);

    // Scroll to target
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
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
    const blob = await pdf(
      <LookBook
        project_name={String(projectName)}
        crew_name={String(crewName)}
        director_name={String(directorName)}
        date={String(date?.toLocaleDateString())}
        roles={roles}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Helper function to begin the demo
  function start_demo() {
    // Clear any toasts
    toast.dismiss();

    // Clear any errors
    setCurrentError("");
    setCurrentEmpty(0);

    // Disable scrolling
    document.body.style.overflow = "hidden";

    console.log("Demo started");
    setCurrentDemoStep(1);
  }

  // Helper function to iterate the demo one step
  function demo_next_step() {
    if (currentDemoStep) {
      if (currentDemoStep == DemoContent.length) {
        end_demo();
        return;
      }
      console.log(currentDemoStep);

      setCurrentDemoStep((prev) => prev + 1);
      jump_to_field(DemoContent[currentDemoStep].id);
    }
  }

  function demo_previous_step() {
    if (currentDemoStep) {
      if (currentDemoStep > 1) {
        const previousStep = currentDemoStep - 1;
        setCurrentDemoStep(previousStep);
        jump_to_field(DemoContent[previousStep - 1].id);
      }
    }
  }

  // Helper Function to end the demo
  function end_demo() {
    // Renable scrolling
    document.body.style.overflow = "auto";

    console.log("demo ended");

    setCurrentDemoStep(0);
  }

  return (
    <div className="p-6 space-y-4 relative z-0" id="top-of-page">
      {/* Overlay - dims the entire page for the demo */}
      {currentDemoStep != 0 && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-30" />
      )}

      {currentDemoStep != 0 && (
        <div
          className={`fixed top-0 left-0 w-screen h-screen flex justify-center items-end pb-5 z-50 ${
            currentDemoStep === 5 ? " pb-20" : ""
          }`}
        >
          <div className="w-1/2" onClick={(e) => e.stopPropagation()}>
            <Card className="p-4 flex justify-end items-end shadow-md">
              {DemoContent[currentDemoStep - 1] && (
                <div className="text-center w-full">
                  {DemoContent[currentDemoStep - 1].text}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  className="hover:cursor-pointer w-30"
                  onClick={end_demo}
                >
                  End Demo
                </Button>

                {currentDemoStep > 1 && (
                  <Button
                    className="hover:cursor-pointer w-30"
                    onClick={demo_previous_step}
                  >
                    Previous
                    <ArrowLeft />
                  </Button>
                )}

                <Button
                  className="hover:cursor-pointer w-30"
                  onClick={demo_next_step}
                >
                  {currentDemoStep == DemoContent.length ? (
                    "Finish"
                  ) : (
                    <>
                      Next
                      <ArrowRight />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Back to top button */}
      <div
        id="step-5"
        className={`fixed bottom-1 right-5${
          DemoContent[currentDemoStep - 1]?.id === "step-5"
            ? " z-40 bg-white p-3 max-w-lg rounded-sm fixed bottom-1 right-5"
            : ""
        }`}
      >
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
          Back to Top
          <ChevronUp />
        </Button>
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-3">
          <img src={logo} alt="Playlet_Logo" className="h-18" />
          <div className="text-5xl font-semibold">Create New Lookbook</div>
        </div>
        <div className="flex gap-3">
          <Button
            className="hover:cursor-pointer"
            variant="outline"
            size="lg"
            onClick={start_demo}
          >
            How To Use
            <CircleQuestionMark />
          </Button>
          <div
            className={`${
              currentDemoStep - 1 === 7
                ? " z-40 bg-white p-3 max-w-lg rounded-sm"
                : ""
            }`}
          >
            <Button
              className="bg-green-500 hover:bg-green-600 hover:cursor-pointer"
              size="lg"
              onClick={generate_look_book}
            >
              Generate Lookbook
              <FileText />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Name input */}
      <div
        className={`flex flex-col items-start gap-3${
          currentDemoStep === 2
            ? " relative z-40 bg-white p-3 max-w-lg rounded-sm"
            : ""
        }`}
      >
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
          <span className={directorName ? "invisible" : "text-red-500"}>*</span>
        </Label>
        <Input
          className={`w-1/3 ${
            currentError == "director_name" ? "border-red-500" : ""
          }`}
          placeholder="Enter Director Name..."
          onChange={(e) => setDirectorName(e.target.value)}
        />
      </div>

      {/* Date Input */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="text-2xl">
          Project Date
          <span className={date ? "invisible" : "text-red-500"}>*</span>
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            asChild
            className={currentError == "project_date" ? "border-red-500" : ""}
          >
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
        className="flex flex-row justify-between items-center mt-10"
        id="step-3"
      >
        <div
          className={`${
            currentDemoStep === 4
              ? " relative z-40 bg-white p-3 max-w-lg rounded-sm"
              : ""
          }`}
        >
          <Button
            className="hover:cursor-pointer"
            size="lg"
            onClick={create_new_role}
          >
            Add Role <Plus />
          </Button>
        </div>
        <div
          className={`flex flex-row justify-between items-center gap-2${
            currentDemoStep === 6
              ? " relative z-40 bg-white p-3 max-w-lg rounded-sm"
              : ""
          }`}
        >
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

      <Label className="text-2xl">Add Roles:</Label>

      <div
        id="step-2"
        className={`${
          currentDemoStep === 3
            ? "relative z-40 bg-white p-3 w-full rounded-sm"
            : ""
        }`}
      >
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
      </div>

      <div id="step-4" className={`flex items-center justify-center `}>
        <div
          className={`w-1/2 ${
            currentDemoStep === 5
              ? " relative z-40 bg-white p-3 max-w-lg rounded-sm"
              : ""
          }`}
        >
          <Button
            className="w-full hover:cursor-pointer"
            onClick={create_new_role}
          >
            Add Role
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LookBookGenerator;
