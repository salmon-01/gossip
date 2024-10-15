// context/ProfileContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of the profile data (adjust based on your actual profile data)
interface ProfileData {
  user_id: string;
  username: string;
  // Add any other fields that your profile data contains
}

// Create Profile Context with an initial value of null or ProfileData type
const ProfileContext = createContext<ProfileData | null>(null);

// Create a custom hook to access the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// Define the props for ProfileProvider
interface ProfileProviderProps {
  profileData: ProfileData;
  children: ReactNode; // This is used to define the children that the provider will wrap
}

// Create a provider component
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ profileData, children }) => {
  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};
