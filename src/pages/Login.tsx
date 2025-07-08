// Importing supabase
import { supabase } from "@/lib/supabaseClient";

// Importing Dependencies
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import logo from "/PlayletLogo.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed } from "lucide-react";

const Login = () => {
  // Navigate hook
  const navigate = useNavigate();

  // Login hooks
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  // Helper function to sign up a new user

  // Helper function to sign in a user
  async function sign_in_user() {
    // Clear the toasts and errors
    toast.dismiss();
    setError("");

    // Check for empty fields
    if (!email) {
      toast.warning("Please Input Email!");
      setError("email");
      return;
    }

    if (!password) {
      toast.warning("Please Input Password!");
      setError("password");
      return;
    }

    // Check email validity
    const pattern: RegExp = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!pattern.test(email)) {
      toast.warning("Invalid Email!");
      setError("email");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.warning("Invalid Email or Password!");
    } else {
      localStorage.setItem("PlayletUserID", data.user.id);
      navigate("/");
    }
  }

  useEffect(() => {
    // Change the tab title
    document.title = "Playlet Tools | Login";

    // Check if the user is logged in
    const user_id: string | null = localStorage.getItem("PlayletUserID");
    if (user_id) {
      navigate("/");
    }
  }, []);

  // Clear all errors when updating inputs
  useEffect(() => {
    setError("");
  }, [email, password]);

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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to login.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label>Email: </Label>
            <Input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={
                error == "email" ? "border-red-500 transition ease-in" : ""
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Password: </Label>
            <div className="relative w-full max-w-sm">
              <Input
                type={!viewPassword ? "password" : "text"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className={
                  error == "password" ? "border-red-500 transition ease-in" : ""
                }
              />
              <Button
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-sm hover:cursor-pointer"
                variant="ghost"
                onClick={() => {
                  setViewPassword(!viewPassword);
                }}
              >
                {!viewPassword ? <EyeClosed /> : <Eye />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full hover:cursor-pointer"
            onClick={sign_in_user}
            type="submit"
          >
            Login
          </Button>
          <div className="text-center text-gray-500 text-xs">
            Don't have an account?{" "}
            <span
              className="hover:underline cursor-pointer hover:text-black"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Register here.
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
