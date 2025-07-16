// Helper functions that deal with user authentication and user management

// Importing the database variable
import { type NavigateFunction } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Function to get the user details
export async function get_user() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    localStorage.setItem("PlayletUserID", user.id);
  }
}

// Helper function to sign out the user
export async function sign_out(navigate: NavigateFunction) {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    localStorage.removeItem("PlayletUserID");
    navigate("/login");
  } else {
    console.log(error);
  }
}
