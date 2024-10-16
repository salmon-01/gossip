'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/app/context/SessionContext';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import ThemeSwitch from '@/app/ui/ThemeSwitch';
import SignOutBtn from '@/app/ui/signOutBtn';

interface Profile {
  name: string;
  bio: string;
  badge: string;
}
export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    bio: '',
    badge: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(''); // For image preview
  const queryClient = useQueryClient(); // Get the query client

  const supabase = createClient();
  const router = useRouter(); // Use Next.js router

  const { data: session } = useSessionContext();
  const username = session?.profile.username;
  const profileImg = session?.profile.profile_img || '';

  useEffect(() => {
    if (session) {
      setProfile({
        name: session.profile.display_name || '',
        bio: session.profile.bio || '',
        badge: session.profile.badge || '',
      });

      setPreview(profileImg);
    }
  }, [session]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl); // Set preview to the selected image's URL
    }
  };

  const updateProfile = async (e: FormEvent) => {
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

      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${file.name}`);

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
      queryClient.invalidateQueries({ queryKey: ['session'] });

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
    <>
      <form className="mx-auto h-lvh w-full p-3 px-10" onSubmit={updateProfile}>
        <div className="mb-3 flex items-center">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-2 text-3xl font-bold text-gray-600 dark:text-darkModeHeader"
          >
            {'\u2190'}
          </button>

          <h2 className="w-full px-4 text-2xl font-bold dark:text-darkModeHeader">
            Edit Profile
          </h2>
        </div>

        <div className="relative mb-4 h-36 w-36">
          <label htmlFor="file_input">
            <div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-200">
              {preview === profileImg ? (
                <div className="relative flex h-full w-full items-center justify-center">
                  <img
                    src={preview}
                    alt=""
                    className="absolute left-0 top-0 z-10 h-full w-full object-cover opacity-70"
                  />
                  <span className="z-20 rounded-full text-center text-6xl text-white">
                    +
                  </span>
                </div>
              ) : (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
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

        <label htmlFor="name" className="mb-1 block dark:text-darkModeParaText">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          className="w-full rounded border border-gray-300 bg-white p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-darkModePrimaryBtn dark:bg-darkModeSecondaryBackground dark:text-darkModeParaText"
          value={profile.name}
          onChange={handleChange}
        />

        <label
          htmlFor="badge"
          className="mb-1 block dark:text-darkModeParaText"
        >
          Badge
        </label>
        <input
          id="badge"
          name="badge"
          type="text"
          placeholder="Badge"
          className="w-full rounded border border-gray-300 bg-white p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-darkModePrimaryBtn dark:bg-darkModeSecondaryBackground dark:text-darkModeParaText"
          value={profile.badge}
          onChange={handleChange}
        />

        <label htmlFor="bio" className="mb-1 block dark:text-darkModeParaText">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Bio"
          className="w-full rounded border border-gray-300 bg-white p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-darkModePrimaryBtn dark:bg-darkModeSecondaryBackground dark:text-darkModeParaText"
          rows={4}
          value={profile.bio}
          onChange={handleChange}
        />
        <ThemeSwitch />
        <button
          type="submit"
          className="mt-10 w-full rounded bg-darkModePrimaryBtn p-2 text-white"
        >
          Update Profile
        </button>
      </form>
      <div className="flex w-full justify-center -mt-36">
        <SignOutBtn />
      </div>
    </>
  );
}
