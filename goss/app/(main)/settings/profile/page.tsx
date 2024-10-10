'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust based on your project structure
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/app/context/SessionContext';
import { MdOutlineCancel } from "react-icons/md";
import { ImUserPlus } from "react-icons/im";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    badge: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(""); // For image preview

  const supabase = createClient();
  const router = useRouter(); // Use Next.js router

  const { data: session } = useSessionContext();
  const username = session?.profile.username;

  useEffect(() => {
    if (session) {
      setProfile({
        name: session.profile.display_name || '',
        bio: session.profile.bio || '',
        badge: session.profile.badge || '',
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl); // Set preview to the selected image's URL
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    let profileImageUrl = null;

    if (file) {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('avatars')
        .upload(`${file.name}`, file);

      if (storageError) {
        console.error('Error uploading file:', storageError);
        return;
      }

      const { data: publicURL, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${file.name}`);

      if (urlError) {
        console.error('Error getting file URL:', urlError);
        return;
      }

      profileImageUrl = publicURL;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: profile.name,
        bio: profile.bio,
        badge: profile.badge,
        profile_img: profileImageUrl?.publicUrl,
      })
      .eq('username', username);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      router.push(`/${username}`);
      console.log('Profile updated successfully:', data);
    }
  };

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
        className="font-bold p-1 text-3xl"
      >
        <MdOutlineCancel />
      </button>

      <h2 className="text-2xl font-bold mb-3 px-4 text-center">Edit Profile</h2>

      <div className="relative w-28 h-28 mb-4">
        <label htmlFor="file_input">
          <div className="cursor-pointer relative w-full h-full rounded-full border border-gray-300 overflow-hidden bg-gray-200 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500 text-6xl"><ImUserPlus /></span>
            )}
          </div>
        </label>
        <input
          id="file_input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

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

      <label htmlFor="badge" className="block mb-1">Badge</label>
      <input
        id="badge"
        name="badge"
        type="text"
        placeholder="Badge"
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
        value={profile.badge}
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
      />

      <button
        type="submit"
        className="mt-2 bg-purple-500 text-white p-2 rounded"
      >
        Update Profile
      </button>
    </form>
  );
}
