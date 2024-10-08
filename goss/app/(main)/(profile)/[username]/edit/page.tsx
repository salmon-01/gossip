
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust based on your project structure
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/app/context/SessionContext';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
  });

  const supabase = createClient();
  const router = useRouter(); // Use Next.js router

  const { data: session } = useSessionContext();
  const username = session?.profile.username;
 
  useEffect(() => {
    if (session) {
      setProfile({
        name: session.profile.display_name || '',
        bio: session.profile.bio || '',
      });
    }
  }, [session]);

  // Handle input change for name and bio
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle form submission and profile update
  const updateProfile = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: profile.name,
        bio: profile.bio,
      })
      .eq('username', username); // Use the user's ID from authentication

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      router.push(`/${username}`);
      console.log('Profile updated successfully:', data);
    }
  };

  // Handle the cancel button
  const handleCancel = () => {
    if (username) {
      router.push(`/${username}`);  
       
    } else {
      console.error('No username found');
    }
  };

  return (
    <form className="w-full h-lvh mx-auto p-3" onSubmit={updateProfile}>
      <button
        type="button"
        onClick={handleCancel}
        className="font-bold p-2 text-xl"
      >
        X
      </button>


      <h2 className="text-xl font-bold mb-3 inline-block">Edit Profile</h2>

      <label htmlFor="name" className="block mb-1">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Name"
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
        value={profile.name}
        onChange={handleChange}
      />

      <label htmlFor="bio" className="block mb-1">Bio</label>
      <textarea
        id="bio"
        name="bio"
        placeholder="Bio"
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
        rows={4}
        value={profile.bio}
        onChange={handleChange}
      ></textarea>

      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Update Profile
      </button>


    </form>
  );
}



