// Importing Util dependencies
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Importing supabase client
import { supabase } from "./supabaseClient";

// Importing global types
import type { Location, Role } from "@/types/global";

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

// Function that deletes all the files for a specific
export async function delete_book(
  bucket: string,
  table_name: string,
  id_column_name: string,
  column_name: string,
  id: string
) {
  // Get all the files associated with the bucket
  let { data, error } = await supabase
    .from(table_name)
    .select(column_name)
    .eq(id_column_name, id);

  if (error) {
    console.log(error);
  }

  if (data) {
    // Create the paths to delete for a lookbook
    if (bucket == "lookbook") {
      // We need to get the paths for the color palette, styling images, and accessories
      const roles: Role[] = (data?.[0] as unknown as { roles: Role[] }).roles;
      await Promise.all(
        roles.map(async (role) => {
          // In each role first check if a color palette exists
          if (role.colorPalette) {
            const folder_path: string = `private/${id}/color_palette/${role.id}`;

            deleteAllFilesInBucket(bucket, folder_path);
          }

          // Next get the paths for the styling suggestion images
          if (role.stylingSuggestions) {
            const folder_path: string = `private/${id}/styling/${role.id}`;

            deleteAllFilesInBucket(bucket, folder_path);
          }

          // Finally, get the paths for the accessories
          if (role.accessories) {
            const folder_path: string = `private/${id}/accessories/${role.id}`;

            deleteAllFilesInBucket(bucket, folder_path);
          }
        })
      );

      // Then remove the lookbook from the database
      const { error: del_error } = await supabase
        .from(table_name)
        .delete()
        .eq(id_column_name, id);

      if (del_error) {
        console.log(del_error);
        return;
      }
    } else if (bucket == "locationbook") {
      const locations: Location[] = (
        data?.[0] as unknown as { locations: Location[] }
      ).locations;

      // Delete all the files for each location
      await Promise.all(
        locations.map((location) => {
          // For each location delete the images for that location

          const folder_path: string = `private/${id}/locations/${location.id}`;

          deleteAllFilesInBucket(bucket, folder_path);
        })
      );

      // Then delete the location book from the database
      const { error: del_error } = await supabase
        .from(table_name)
        .delete()
        .eq(id_column_name, id);

      if (del_error) {
        console.log(del_error);
        return;
      }

      // Also delete all the comments associated with the book

      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("book_id", id);

      if (error) {
        console.log(error);
      }
    }
  }
}

// Helper function to set the users avatar
import cat from "../assets/avatar/cat_avatar.png";
import lily from "../assets/avatar/lily.webp";
import capybara from "../assets/avatar/capybara.webp";

export function get_avatar(avatar_code: string): string {
  if (avatar_code == "cat") {
    return cat;
  }

  if (avatar_code == "lily") {
    return lily;
  }

  if (avatar_code == "capybara") {
    return capybara;
  }

  return cat;
}
