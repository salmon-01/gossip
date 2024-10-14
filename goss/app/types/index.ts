// Typescript definitions go here

export interface Notification {
  id: string;
  type: string;
  context: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  sender: {
    profile_img: string;
    username: string;
  };
  recipient: {
    profile_img: string;
    username: string;
  };
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
  transcription: string;
}

export interface Session {
  profile: {
    username: string;
    profile_img: string;
    badge: string;
    created_at: Date;
    updated_at: Date;
    bio: string;
    display_name: string;
    user_id: string;
  };
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: Date;
    phone: number;
  };
}
