export type Role = {
  id: number;
  roleName: string | null;
  wardrobeStyle: string | null;
  colorPalette: string | null;
  additionalNotes: string | null;
  stylingSuggestions: string[];
  accessories: string[];
};