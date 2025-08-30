export type Img = {
  src: string;
  id: number;
};

// Lookbook Types
export type LookBook = {
  lookbook_id: string;
  author_id: string;
  created_at: Date;
  project_name: string;
  crew_name: string;
  director_name: string;
  date: Date;
  roles: Role[];
  last_edited: Date;
};

export type Role = {
  id: number;
  roleName: string | null;
  wardrobeStyle: string | null;
  colorPalette: Img | null;
  additionalNotes: string | null;
  stylingSuggestions: Img[];
  accessories: Img[];
  newly_created: boolean;
};

// Location Book Types
export type Location = {
  id: number;
  scene: string | null;
  time_of_day: "Day" | "Night" | null;
  location_type: "Indoor" | "Outdoor" | null;
  location_name: string | null;
  images: Img[];
  newly_created: boolean;
};

export type LocationBook = {
  locationbook_id: string;
  created_at: Date;
  author_id: string;
  last_edited: Date;
  project_name: string;
  crew_name: string;
  director: string;
  date: Date;
  locations: Location[];
};

// Auth type
export type User = {
  user_id: string;
  created_at: Date;
  first_name: string;
  last_name: string;
  avatar: string;
};

// Comment Type
export type Comment = {
  comment_id: string;
  created_at: Date;
  author_name: string;
  author_avatar: string;
  text: string;
  book_id: string;
  section_id: number;
};

// Calendar Types
export type Event = {
  event_id: string;
  created_at: Date;
  event_date: string;
  event_desc: string;
  event_title: string;
  event_author: string;
  event_color: string;
  event_start: string;
  event_end: string;
};
