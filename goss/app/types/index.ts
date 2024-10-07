// Typescript definitions go here

export interface Notification {
  id: number;
  avatar: string;
  type: string;
  content: string;
  sender: string;
  created_at: string;
  is_read: boolean;
}

export interface User {
  user_id: string;
  username: string;
  badge: string;
  profile_img: string;
  bio: string;
  created_at: Date;
  updated_at: Date;
  display_name: string;
  email: string;
  phone: number;
}

export interface Post {
  id: string;
  created_at: Date;
  audio: string;
  caption: string;
  user_id: string;
}
