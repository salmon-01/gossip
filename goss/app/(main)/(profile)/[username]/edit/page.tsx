'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust based on your project structure
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
  });
  const [username, setUsername] = useState('');
  const supabase = createClient();
  const router = useRouter(); // Use Next.js router

  // Fetch the logged-in user's profile data
  const fetchUserProfile = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Error fetching user:', authError);
      return;
    }

    if (user) {
      // Fetch the username from the profiles table based on user_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setUsername(profileData.username); // Store the username from the profile
      }
    }
  };

  fetchUserProfile(); // Fetch user info when rendering

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

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Error fetching user:', authError);
      return;
    }

    if (!user) {
      console.error('No user is authenticated');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: profile.name,
        bio: profile.bio,
      })
      .eq('user_id', user.id); // Use the user's ID from authentication

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      console.log('Profile updated successfully:', data);
    }
  };

  // Handle the cancel button
  const handleCancel = () => {
    if (username) {
      router.push(`/${username}`); // Navigate to the user's profile page
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
