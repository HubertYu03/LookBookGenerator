// Importing logo
import logo from "/PlayletLogo.png";

// Importing database
import { supabase } from "@/lib/supabaseClient";

// Importing UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Importing dependencies
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

// Importing Icons
import { Check, Eye, EyeClosed, X } from "lucide-react";
import type { Calendar, User } from "@/types/global";

// Custom input component
type TextInputProps = {
  label: string;
  code: string;
  type?: string;
  onChange: React.Dispatch<React.SetStateAction<string | null>>;
  error: string;
};

const TextInput = ({ label, code, type, onChange, error }: TextInputProps) => {
  return (
    <div className="grid gap-2">
      <Label>{label}:</Label>
      <Input
        type={type ?? ""}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className={error == code ? "border-red-500" : ""}
      />
    </div>
  );
};

const Register = () => {
  // Navigate state
  const navigate = useNavigate();

  // Register states
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const [email, setEmail] = useState<string | null>(null);

  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [viewConfirmPassword, setViewConfirmPassword] =
    useState<boolean>(false);

  const [currentError, setCurrentError] = useState<string>("");

  // Helper function to show if the passwords match
  function passwords_match(): boolean {
    if (password && confirmPassword) {
      if (password == confirmPassword) {
        return true;
      }
    }
    return false;
  }

  // Sign up the user
  async function sign_up_and_login_user() {
    if (email && password) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.log(error);
        return;
      }
      console.log(data);

      // Add personal calendar ID
      const calendar_id: string = v4();

      // Once the user is registered, add the data to the database
      const user: User = {
        user_id: data.user?.id as string,
        first_name: firstName as string,
        last_name: lastName as string,
        created_at: new Date(),
        avatar: "cat",
        pinned_events: [],
        personal_calendar_id: calendar_id,
        calendar_ids: [],
      };

      const { error: user_error } = await supabase
        .from("users")
        .insert(user)
        .select();

      if (user_error) {
        console.log(user_error);
        return;
      }

      // Add initial calendar
      const personal_calendar: Calendar = {
        calendar_id: calendar_id,
        calendar_name: `${firstName} ${lastName}'s Calendar`,
        created_at: new Date(),
        author_id: data.user?.id as string,
        private: true,
        personal: true,
      };

      const { error: calendar_error } = await supabase
        .from("calendar")
        .insert(personal_calendar)
        .select();

      if (calendar_error) {
        console.log(calendar_error);
        return;
      } else {
        sign_in();
      }
    }
  }

  // Helper function to login the user
  async function sign_in() {
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.log(error);
      } else {
        localStorage.setItem("PlayletUserID", data.user.id);
        navigate("/");
        window.location.reload();
      }
    }
  }

  // Function to register the user
  function register_user() {
    // Clear toasts and errors
    setCurrentError("");
    toast.dismiss();

    // Check for empty fields
    if (!firstName) {
      setCurrentError("first_name");
      toast.warning("Please input your First Name!");
      return;
    }

    if (!lastName) {
      setCurrentError("last_name");
      toast.warning("Please input your Last Name!");
      return;
    }

    if (!email) {
      setCurrentError("email");
      toast.warning("Please input Email!");
      return;
    }

    if (!password) {
      setCurrentError("password");
      toast.warning("Please input Password!");
      return;
    }

    // Check email validity
    const pattern: RegExp = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!pattern.test(email)) {
      toast.warning("Invalid Email!");
      setCurrentError("email");
      return;
    }

    if (!passwords_match()) {
      toast.warning("Passwords do not match!");
      setCurrentError("password");
      return;
    }

    sign_up_and_login_user();
  }

  useEffect(() => {
    // Change the tab title
    document.title = "Playlet Tools | Register";

    // Check if the user is logged in
    const user_id: string | null = localStorage.getItem("PlayletUserID");

    if (user_id) {
      navigate("/");
    }
  }, []);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {/* Icon and Tool Name */}
      <div className="flex flex-row items-center gap-5">
        <img src={logo} alt="logo" className="w-20" />
        <div className="text-3xl font-semibold">Playlet Tools</div>
      </div>

      {/* Login card */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Register for a playlet tools account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* First and Last name inputs */}
          <TextInput
            label="First Name"
            code="first_name"
            onChange={setFirstName}
            error={currentError}
          />
          <TextInput
            label="Last Name"
            code="last_name"
            onChange={setLastName}
            error={currentError}
          />

          <TextInput
            label="Email"
            code="email"
            type="email"
            onChange={setEmail}
            error={currentError}
          />
          <div className="grid gap-2">
            <Label>Password: </Label>
            <div className="relative w-full max-w-sm">
              <Input
                type={!viewPassword ? "password" : "text"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className={currentError == "password" ? "border-red-500" : ""}
              />
              <Button
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-sm"
                variant="ghost"
                onClick={() => {
                  setViewPassword(!viewPassword);
                }}
              >
                {!viewPassword ? <EyeClosed /> : <Eye />}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Confirm Password:</Label>
            <div className="relative w-full max-w-sm">
              <Input
                type={!viewConfirmPassword ? "password" : "text"}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                onPaste={(e) => e.preventDefault()}
              />
              <Button
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-sm"
                variant="ghost"
                onClick={() => {
                  setViewConfirmPassword(!viewConfirmPassword);
                }}
              >
                {!viewConfirmPassword ? <EyeClosed /> : <Eye />}
              </Button>
            </div>
            {password && confirmPassword && (
              <div
                className={`text-xs ${
                  passwords_match() ? "text-green-600" : "text-red-500"
                }`}
              >
                {passwords_match() ? (
                  <div className="flex flex-row items-center gap-1">
                    <Check size={20} />
                    <div>Passwords match!</div>
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-1">
                    <X size={20} />
                    <div>Passwords do not match!</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full hover:cursor-pointer"
            onClick={register_user}
          >
            Register and Sign In
          </Button>
          <div className="text-center text-gray-500 text-xs">
            Have an account?{" "}
            <span
              className="hover:underline cursor-pointer hover:text-black"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login here.
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
