// Typescript definitions go here

export interface Notification {
  id: string;
  context: string;
  type: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
  sender_id: string;
  sender: {
    username: string;
    profile_img: string;
  };
  recipient: {
    username: string;
    profile_img: string;
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
  comments: Comment[];
  reactions: Reaction[];
}

export interface Reaction {
  reaction: string;
  count: number;
  userHasReacted: boolean;
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

export interface Favourite {
  id: string;
  created_at: Date;
  user_id: string;
  post_id: string;
}

export interface FollowResponse {
  success: boolean;
  status: 'active' | 'inactive';
  userId: string;
  targetUserId: string;
}

export interface FollowContextType {
  handleFollowToggle: (
    userId: string,
    targetUserId: string,
    targetUserName: string
  ) => void;
  isLoading: boolean;
  followingData: any;
  isFollowingLoading: boolean;
  refetchFollowing: () => void;
}


export interface Message {
  id: string;          
  sender_id: string;  
  content: string;              
  created_at: string;
};

export interface ChatMessagesProps {
  conversationId: string;
  loggedInUserId: string;
}