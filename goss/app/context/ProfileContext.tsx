import React, { createContext, useContext, ReactNode } from 'react';

interface ProfileData {
  user_id: string;
  username: string;
  badge:string,
  profile_img:string,
  bio: string,
  display_name:string,
  follower_count: number,
  following_total:number
  
}

const ProfileContext = createContext<ProfileData | null>(null);
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};


interface ProfileProviderProps {
  profileData: ProfileData;
  children: ReactNode; 
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ profileData, children }) => {
  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};
