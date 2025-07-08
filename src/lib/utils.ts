import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { supabase } from "./supabaseClient";
import type { NavigateFunction } from "react-router-dom";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helpter function to convert a string URL to a file
export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

// Helper function to get the current user (if any)
export async function get_user(navigate: NavigateFunction) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    console.log(user.id);
  localStorage.setItem("PlayletUserID", user.id);
  } else {
    navigate("/login");
  }
}

// Helper function to set the users avatar
import cat from "../assets/avatar/cat_avatar.png";
import dog from "../assets/avatar/dog_avatar.jpg";

export function get_avatar(avatar_code: string):string {
  if(avatar_code == "cat") {
    return cat;
  }
  else {
    return dog;
  }
}
