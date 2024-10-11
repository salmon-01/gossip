'use client';

import { useSessionContext } from '@/app/context/SessionContext';
import ProfileCard from '@/app/ui/ProfileCard';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
const supabase = createClient();

export default function TestQuery() {
  const { data: session, isLoading, error } = useSessionContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setProfiles([]); // Clear results if search query is empty
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('display_name', `%${searchQuery}%`);

      if (error) {
        console.error(error);
      } else {
        setProfiles(data);
      }
    };

    // Add a small debounce (e.g., 300ms) to prevent too many API calls
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 500);

    // Clear the timeout if the search query changes before the debounce time is up
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div className="min-h-screen w-full">
      <input
        type="text"
        placeholder="Search for a profile"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="rounded border p-2"
      />

      <div className="mt-4">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <ProfileCard key={profile.user_id} user={profile} />
          ))
        ) : (
          <div>No profiles found</div>
        )}
      </div>
    </div>
  );
}
