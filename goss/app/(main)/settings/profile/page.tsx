'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust based on your project structure
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/app/context/SessionContext';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

// const MdOutlineCancel = dynamic(() =>
//   import('react-icons/md').then((mod) => mod.MdOutlineCancel)
// );
// const ImUserPlus = dynamic(() =>
//   import('react-icons/im').then((mod) => mod.ImUserPlus)
// );

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    badge: '',
  });
  const queryClient = useQueryClient(); // Get the query client
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(''); // For image preview

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
      toast.error('Error updating profile.');
    } else {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['profileId', username] });

      router.push(`/${username}`);

      toast.success('Profile updated successfully', {
        position: 'bottom-center',
      });
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
    <form className="mx-auto h-lvh w-full p-3" onSubmit={updateProfile}>
      <button
        type="button"
        onClick={handleCancel}
        className="p-1 text-3xl font-bold"
      >X
        {/* <MdOutlineCancel /> */}
      </button>

      <h2 className="mb-3 px-4 text-center text-2xl font-bold">Edit Profile</h2>

      <div className="relative mb-4 h-28 w-28">
        <label htmlFor="file_input">
          <div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-200">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-6xl text-center rounded-full text-white">
                +
              </span>
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

      <label htmlFor="name" className="mb-1 block">
        Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Name"
        className="w-full rounded border border-gray-300 p-2 shadow-sm"
        value={profile.name}
        onChange={handleChange}
      />

      <label htmlFor="badge" className="mb-1 block">
        Badge
      </label>
      <input
        id="badge"
        name="badge"
        type="text"
        placeholder="Badge"
        className="w-full rounded border border-gray-300 p-2 shadow-sm"
        value={profile.badge}
        onChange={handleChange}
      />

      <label htmlFor="bio" className="mb-1 block">
        Bio
      </label>
      <textarea
        id="bio"
        name="bio"
        placeholder="Bio"
        className="w-full rounded border border-gray-300 p-2 shadow-sm"
        rows={4}
        value={profile.bio}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="mt-2 rounded bg-purple-500 p-2 text-white"
      >
        Update Profile
      </button>
    </form>
  );
}
