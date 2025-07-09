import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { supabase } from "./supabaseClient";
import type { NavigateFunction } from "react-router-dom";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

// Helper function to delete all the images in a file
export const deleteAllFilesInBucket = async (
  bucket_name: string,
  folder_path: string
) => {
  // Step 1: List all files in the bucket
  const { data: files, error: listError } = await supabase.storage
    .from(bucket_name)
    .list(folder_path);

  if (listError) {
    console.log(listError);
    return;
  }

  // If there are files to delete, delete them
  if (files.length > 0) {
    const paths_to_delete: string[] = [];
    files.map((file) => {
      // Get the file path and delete the img
      const path_to_delete: string = `${folder_path}/${file.name}`;
      paths_to_delete.push(path_to_delete);
    });

    // Delete the files from the storage
    const { error } = await supabase.storage
      .from(bucket_name)
      .remove(paths_to_delete);
    if (error) {
      console.log(error);
      return;
    }
  }
};

// Helper function to list all the files in a folder
export async function list_all_files(
  bucket_name: string,
  folder_path: string
): Promise<string[]> {
  const { data: files, error: listError } = await supabase.storage
    .from(bucket_name)
    .list(folder_path);

  if (listError) {
    console.log(listError);
    return [];
  }

  let files_in_folder: string[] = [];
  files.map((file) => {
    files_in_folder.push(file.name);
  });

  return files_in_folder;
}

// Helper function to set the users avatar
import cat from "../assets/avatar/cat_avatar.png";
import dog from "../assets/avatar/dog_avatar.jpg";

export function get_avatar(avatar_code: string): string {
  if (avatar_code == "cat") {
    return cat;
  } else {
    return dog;
  }
}
