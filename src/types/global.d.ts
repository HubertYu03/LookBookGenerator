export type Img = {
  src: string,
  id: number
}

export type LookBook = {
  lookbook_id: string;
  author_id: string;
  created_at: Date;
  project_name: string;
  crew_name: string;
  director_name: string;
  date: Date;
  roles: Role[];
}

export type Role = {
  id: number;
  roleName: string | null;
  wardrobeStyle: string | null;
  colorPalette: Img | null;
  additionalNotes: string | null;
  stylingSuggestions: Img[];
  accessories: Img[];
};

export type User = {
  user_id: string;
  created_at: Date;
  first_name: string;
  last_name: string;
  avatar: string;
}
