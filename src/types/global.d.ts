export type Img = {
  src: string,
  id: number
}

export type Role = {
  id: number;
  roleName: string | null;
  wardrobeStyle: string | null;
  colorPalette: string | null;
  additionalNotes: string | null;
  stylingSuggestions: Img[];
  accessories: Img[];
};